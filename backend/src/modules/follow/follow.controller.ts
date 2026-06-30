import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma";
import { parseUserId } from "../../utils/auth.helpers";
import { mangaDexService, MangaDexApiError } from "../../services/mangadex.service";
import { AppError } from "../../middlewares/error.middleware";
import type { FollowInput, ProgressInput } from "./follow.schema";
import type {
  MangaDexMangaEntity,
  MangaDexRelationship,
  LocalizedString,
} from "../../types/mangadex.types";
import {
  mapMangaDexStatus,
  resolveTitle,
  resolveDescription,
  extractCoverUrl,
  extractAuthor,
  slugify,
} from "../../utils/mangadex.helpers";

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
  // 1. Check local DB first
  const existing = await prisma.manga.findUnique({
    where: { sourceId },
    select: { id: true },
  });

  if (existing) return existing.id;

  // 2. Fetch from MangaDex and persist
  let entity: MangaDexMangaEntity;
  try {
    const response = await mangaDexService.getMangaDetails(sourceId);
    entity = response.data;
  } catch (err) {
    if (err instanceof MangaDexApiError && err.statusCode === 404) {
      throw new AppError(404, "Manga not found on MangaDex");
    }
    throw err;
  }

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
    // Handle slug collision — retry with UUID suffix
    if (err instanceof Error && err.message.includes("Unique constraint")) {
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

// ─── Controllers ─────────────────────────────────────────────

/**
 * POST /api/v1/follows
 *
 * Creates a follow relation between the authenticated user and a manga.
 *
 * Follow handshake:
 *  1. Parse + validate the authenticated user's ID from the JWT.
 *  2. Ensure the manga exists locally — if not, fetch from MangaDex
 *     and upsert into the local DB before creating the relation.
 *  3. Create the UserFollow record. If the user already follows
 *     this manga, Prisma's unique constraint (userId_mangaId) is
 *     caught and a 409 Conflict is returned.
 *
 * Returns 201 with the created follow record on success.
 */
export async function followManga(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = parseUserId(req.user?.sub);
    const { mangaId: sourceId } = req.body as FollowInput;

    // Ensure local Manga record exists (upserts from MangaDex if missing)
    const localMangaId = await ensureLocalManga(sourceId);

    // Create the follow relation
    const follow = await prisma.userFollow.create({
      data: {
        userId,
        mangaId: localMangaId,
      },
      select: {
        id: true,
        userId: true,
        mangaId: true,
        lastReadChapter: true,
        createdAt: true,
        manga: {
          select: {
            sourceId: true,
            title: true,
            coverUrl: true,
          },
        },
      },
    });

    res.status(201).json({ data: follow });
  } catch (err) {
    // Prisma unique constraint violation → user already follows this manga
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint")
    ) {
      next(new AppError(409, "You are already following this manga"));
      return;
    }

    if (err instanceof MangaDexApiError) {
      const statusCode = err.isRateLimit ? 429 : err.statusCode >= 500 ? 502 : 500;
      next(new AppError(statusCode, err.message));
      return;
    }

    next(err);
  }
}

/**
 * DELETE /api/v1/follows/:mangaId
 *
 * Removes the follow relation between the authenticated user and a manga.
 *
 * The `:mangaId` param is the MangaDex source UUID. We resolve it
 * to the local Manga ID and then delete the UserFollow record.
 *
 * Returns 200 on success, 404 if the user is not following the manga.
 */
export async function unfollowManga(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = parseUserId(req.user?.sub);
    const { mangaId: sourceId } = req.params;

    // Resolve sourceId → local Manga record
    const manga = await prisma.manga.findUnique({
      where: { sourceId },
      select: { id: true },
    });

    if (!manga) {
      throw new AppError(404, "Manga not found");
    }

    // Attempt to delete the follow relation
    const deleted = await prisma.userFollow.deleteMany({
      where: {
        userId,
        mangaId: manga.id,
      },
    });

    if (deleted.count === 0) {
      throw new AppError(404, "You are not following this manga");
    }

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
      return;
    }

    next(err);
  }
}

/**
 * PATCH /api/v1/follows/:mangaId/progress
 *
 * Updates the reading progress (lastReadChapter) for a manga
 * the authenticated user is following.
 *
 * Returns 200 with the updated follow record on success.
 * Returns 404 if the user is not following the manga.
 */
export async function updateProgress(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = parseUserId(req.user?.sub);
    const { mangaId: sourceId } = req.params;
    const { lastReadChapter } = req.body as ProgressInput;

    // Resolve sourceId → local Manga record
    const manga = await prisma.manga.findUnique({
      where: { sourceId },
      select: { id: true },
    });

    if (!manga) {
      throw new AppError(404, "Manga not found");
    }

    // Verify the follow relation exists before updating
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        userId_mangaId: {
          userId,
          mangaId: manga.id,
        },
      },
      select: { id: true },
    });

    if (!existingFollow) {
      throw new AppError(404, "You are not following this manga");
    }

    // Update reading progress
    const updated = await prisma.userFollow.update({
      where: {
        userId_mangaId: {
          userId,
          mangaId: manga.id,
        },
      },
      data: { lastReadChapter },
      select: {
        id: true,
        userId: true,
        mangaId: true,
        lastReadChapter: true,
        createdAt: true,
        manga: {
          select: {
            sourceId: true,
            title: true,
          },
        },
      },
    });

    res.status(200).json({ data: updated });
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
      return;
    }

    next(err);
  }
}
