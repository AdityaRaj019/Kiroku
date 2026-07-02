import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/prisma";
import { parseUserId } from "../../../utils/auth.helpers";
import { mangaDexService, MangaDexApiError } from "../../../services/mangadex.service";
import { AppError } from "../../../middlewares/error.middleware";
import type { UpsertLibraryItemInput } from "../library.schema";
import {
  mapMangaDexStatus,
  resolveTitle,
  resolveDescription,
  extractCoverUrl,
  extractAuthor,
  slugify,
} from "../../../utils/mangadex.helpers";

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Ensures a Manga record exists locally for the given MangaDex sourceId.
 *
 * Lookup strategy:
 *  1. Check local DB by sourceId (fast, no external call)
 *  2. If missing → fetch from MangaDex → upsert locally
 *  3. If MangaDex also fails → throw AppError(404)
 *
 * Returns the local Manga record's database primary key (id).
 */
async function ensureLocalManga(sourceId: string): Promise<number> {
  const existing = await prisma.manga.findUnique({
    where: { sourceId },
    select: { id: true },
  });

  if (existing) return existing.id;

  const response = await mangaDexService.getMangaDetails(sourceId);
  const entity = response.data;

  const title = resolveTitle(entity.attributes.title);
  const slug = slugify(title) || entity.id.slice(0, 8);

  try {
    const record = await prisma.manga.upsert({
      where: { sourceId: entity.id },
      create: {
        sourceId: entity.id,
        title,
        slug,
        coverUrl: extractCoverUrl(entity.id, entity.relationships),
        synopsis: resolveDescription(entity.attributes.description),
        author: extractAuthor(entity.relationships),
        status: mapMangaDexStatus(entity.attributes.status),
        sourceUrl: `https://mangadex.org/title/${entity.id}`,
      },
      update: {
        title,
        coverUrl: extractCoverUrl(entity.id, entity.relationships),
        synopsis: resolveDescription(entity.attributes.description),
        author: extractAuthor(entity.relationships),
        status: mapMangaDexStatus(entity.attributes.status),
      },
      select: { id: true },
    });

    return record.id;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const fallbackSlug = `${slug}-${entity.id.slice(0, 8)}`;
      const record = await prisma.manga.upsert({
        where: { sourceId: entity.id },
        create: {
          sourceId: entity.id,
          title,
          slug: fallbackSlug,
          coverUrl: extractCoverUrl(entity.id, entity.relationships),
          synopsis: resolveDescription(entity.attributes.description),
          author: extractAuthor(entity.relationships),
          status: mapMangaDexStatus(entity.attributes.status),
          sourceUrl: `https://mangadex.org/title/${entity.id}`,
        },
        update: {
          title,
          coverUrl: extractCoverUrl(entity.id, entity.relationships),
          synopsis: resolveDescription(entity.attributes.description),
          author: extractAuthor(entity.relationships),
          status: mapMangaDexStatus(entity.attributes.status),
        },
        select: { id: true },
      });

      return record.id;
    }

    throw err;
  }
}

// ─── Controller ──────────────────────────────────────────────

/**
 * POST /api/v1/library
 *
 * Creates or updates a library item for the authenticated user.
 *
 * Upsert logic:
 *  1. Parse the authenticated user's ID from the JWT.
 *  2. If mediaType is MANGA, resolve the mangaId to a local DB record
 *     (fetching from MangaDex and upserting if missing).
 *  3. Upsert the LibraryItem using the (userId, mangaId) or
 *     (userId, animeId) unique constraint.
 *  4. Automatically set startDate when status transitions to READING
 *     and endDate when status transitions to COMPLETED.
 *
 * Returns 200 with the upserted library item on success.
 * Returns 201 if a new item was created.
 */
export async function upsertLibraryItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = parseUserId(req.user?.sub);
    const body = req.body as UpsertLibraryItemInput;

    let localMangaId: number | null = null;

    // Resolve manga to local DB record if mediaType is MANGA
    if (body.mediaType === "MANGA" && body.mangaId) {
      try {
        localMangaId = await ensureLocalManga(body.mangaId);
      } catch (err) {
        if (err instanceof MangaDexApiError) {
          if (err.statusCode === 404) {
            next(new AppError(404, "Manga not found on MangaDex"));
            return;
          }
          const statusCode = err.isRateLimit ? 429 : err.statusCode >= 500 ? 502 : 500;
          next(new AppError(statusCode, err.message));
          return;
        }
        throw err;
      }
    }

    // Determine the upsert unique key
    const whereClause = localMangaId
      ? { userId_mangaId: { userId, mangaId: localMangaId } }
      : { userId_animeId: { userId, animeId: body.animeId as string } };

    // Check if the item already exists (to determine 200 vs 201)
    const existingItem = await prisma.libraryItem.findUnique({
      where: whereClause,
      select: { id: true, status: true, startDate: true },
    });

    // Auto-set dates based on status transitions
    const startDate = resolveStartDate(body.status, body.startDate, existingItem);
    const endDate = resolveEndDate(body.status, body.endDate);

    const data = {
      mediaType: body.mediaType,
      status: body.status,
      progress: body.progress,
      favorite: body.favorite,
      enableNotifications: body.enableNotifications,
      rating: body.rating ?? null,
      startDate,
      endDate,
      reReadCount: body.reReadCount,
    };

    const libraryItem = await prisma.libraryItem.upsert({
      where: whereClause,
      create: {
        userId,
        mangaId: localMangaId,
        animeId: body.animeId ?? null,
        ...data,
      },
      update: data,
      select: {
        id: true,
        userId: true,
        mangaId: true,
        animeId: true,
        mediaType: true,
        status: true,
        progress: true,
        favorite: true,
        enableNotifications: true,
        rating: true,
        startDate: true,
        endDate: true,
        reReadCount: true,
        createdAt: true,
        updatedAt: true,
        manga: {
          select: {
            sourceId: true,
            title: true,
            coverUrl: true,
            status: true,
          },
        },
      },
    });

    const statusCode = existingItem ? 200 : 201;
    res.status(statusCode).json({ data: libraryItem });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      next(new AppError(409, "This item already exists in your library"));
      return;
    }

    next(err);
  }
}

// ─── Date Resolution Helpers ─────────────────────────────────

/**
 * Resolves the startDate for a library item.
 *
 * - If the client explicitly provides a startDate, use it.
 * - If transitioning to READING and no startDate exists, auto-set to now.
 * - Otherwise, preserve the existing startDate.
 */
function resolveStartDate(
  status: string,
  clientStartDate: Date | null | undefined,
  existing: { startDate: Date | null } | null
): Date | null {
  if (clientStartDate !== undefined) return clientStartDate;

  if (status === "READING" && !existing?.startDate) {
    return new Date();
  }

  return existing?.startDate ?? null;
}

/**
 * Resolves the endDate for a library item.
 *
 * - If the client explicitly provides an endDate, use it.
 * - If transitioning to COMPLETED, auto-set to now.
 * - Otherwise, null (not finished).
 */
function resolveEndDate(
  status: string,
  clientEndDate: Date | null | undefined
): Date | null {
  if (clientEndDate !== undefined) return clientEndDate;

  if (status === "COMPLETED") {
    return new Date();
  }

  return null;
}
