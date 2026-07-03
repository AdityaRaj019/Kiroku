import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { Prisma } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { parseUserId } from "../../utils/auth.helpers";
import { mangaDexService, MangaDexApiError } from "../../services/mangadex.service";
import { AppError } from "../../middlewares/error.middleware";
import type { SearchQueryInput, ChaptersQueryInput, ShowcaseQueryInput } from "./manga.schema";
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
 * Extracts the artist name from MangaDex relationships.
 */
function extractArtist(relationships: MangaDexRelationship[]): string | null {
  const artistRel = relationships.find((r) => r.type === "artist");
  if (!artistRel?.attributes) return null;

  return (artistRel.attributes["name"] as string) ?? null;
}

/**
 * Upserts a batch of MangaDex manga entities into the local database.
 *
 * Uses `sourceId` as the unique key for deduplication. Operations
 * are performed sequentially to avoid overwhelming the DB connection pool
 * and to handle potential slug conflicts gracefully.
 *
 * Returns the locally persisted manga records.
 */
async function upsertMangaBatch(
  entities: MangaDexMangaEntity[]
): Promise<
  Array<{
    id: number;
    sourceId: string | null;
    title: string;
    slug: string;
    coverUrl: string | null;
    synopsis: string | null;
    author: string | null;
    status: string;
  }>
> {
  const results: Array<{
    id: number;
    sourceId: string | null;
    title: string;
    slug: string;
    coverUrl: string | null;
    synopsis: string | null;
    author: string | null;
    status: string;
  }> = [];

  for (const entity of entities) {
    const title = resolveTitle(entity.attributes.title);
    const synopsis = resolveDescription(entity.attributes.description);
    const coverUrl = extractCoverUrl(entity.id, entity.relationships);
    const author = extractAuthor(entity.relationships);
    const status = mapMangaDexStatus(entity.attributes.status);
    const baseSlug = slugify(title);

    // Ensure slug uniqueness: if slug collision with a different sourceId,
    // append the last segment of the MangaDex UUID
    const slug = baseSlug || entity.id.slice(0, 8);

    try {
      const record = await prisma.manga.upsert({
        where: { sourceId: entity.id },
        create: {
          sourceId: entity.id,
          title,
          slug,
          coverUrl,
          synopsis,
          author,
          status,
          sourceUrl: `https://mangadex.org/title/${entity.id}`,
        },
        update: {
          title,
          coverUrl,
          synopsis,
          author,
          status,
        },
        select: {
          id: true,
          sourceId: true,
          title: true,
          slug: true,
          coverUrl: true,
          synopsis: true,
          author: true,
          status: true,
        },
      });

      results.push(record);
    } catch (err) {
      // If slug collision occurs (different manga, same slug), retry with UUID suffix
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
            coverUrl,
            synopsis,
            author,
            status,
            sourceUrl: `https://mangadex.org/title/${entity.id}`,
          },
          update: {
            title,
            coverUrl,
            synopsis,
            author,
            status,
          },
          select: {
            id: true,
            sourceId: true,
            title: true,
            slug: true,
            coverUrl: true,
            synopsis: true,
            author: true,
            status: true,
          },
        });

        results.push(record);
      } else {
        // Log and skip individual failures — don't fail the entire batch
        console.error(
          `[MangaController] Failed to upsert manga ${entity.id}:`,
          err instanceof Error ? err.message : err
        );
      }
    }
  }

  return results;
}

/**
 * Fetches the authenticated user's tracking record for a given manga.
 * Returns a structured tracking object, or a default "not following" state.
 *
 * @param userId - The authenticated user's database primary key.
 * @param mangaLocalId - The local database ID of the manga.
 */
async function fetchUserTracking(
  userId: number,
  mangaLocalId: number
): Promise<{ isFollowing: boolean; lastReadChapter: string | null; followedAt: Date | null }> {
  const item = await prisma.libraryItem.findUnique({
    where: {
      userId_mangaId: {
        userId,
        mangaId: mangaLocalId,
      },
    },
    select: {
      progress: true,
      createdAt: true,
    },
  });

  if (!item) {
    return { isFollowing: false, lastReadChapter: null, followedAt: null };
  }

  return {
    isFollowing: true,
    lastReadChapter: item.progress.toString(),
    followedAt: item.createdAt,
  };
}

// ─── Controllers ─────────────────────────────────────────────

/**
 * GET /api/v1/manga?q=...&limit=...&offset=...
 *
 * Searches MangaDex for manga matching the query string, persists
 * results locally for future lookups, and returns a structured response.
 *
 * Flow:
 *  1. Validate query params (done by middleware)
 *  2. Call MangaDexService.searchManga (rate-limited + Redis-cached)
 *  3. Upsert matching results into local Manga table
 *  4. Return combined response with local IDs + MangaDex data
 *
 * The search-specific rate limiter (30 req/15min per IP) on the route
 * acts as server-side "debounce" — clients should also debounce on the
 * frontend (300-500ms) to avoid burning through the limit.
 */
export async function searchManga(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { q, limit, offset } = req.query as unknown as SearchQueryInput;

    // 1. Query MangaDex (internally rate-limited + Redis-cached)
    const mangaDexResponse = await mangaDexService.searchManga(q, limit, offset);

    // 2. Upsert search results into local DB for future reference
    const localRecords = await upsertMangaBatch(mangaDexResponse.data);

    // 3. Build enriched response combining local IDs with MangaDex data
    const results = mangaDexResponse.data.map((entity) => {
      const localMatch = localRecords.find((r) => r.sourceId === entity.id);

      return {
        // Local database ID (useful for follow/tracking endpoints)
        localId: localMatch?.id ?? null,
        // MangaDex source ID (UUID)
        sourceId: entity.id,
        title: resolveTitle(entity.attributes.title),
        synopsis: resolveDescription(entity.attributes.description),
        coverUrl: extractCoverUrl(entity.id, entity.relationships),
        author: extractAuthor(entity.relationships),
        status: entity.attributes.status,
        year: entity.attributes.year,
        contentRating: entity.attributes.contentRating,
        tags: entity.attributes.tags.map((t) => ({
          id: t.id,
          name: t.attributes.name.en ?? Object.values(t.attributes.name)[0] ?? "Unknown",
          group: t.attributes.group,
        })),
        lastChapter: entity.attributes.lastChapter,
        demographicTag: entity.attributes.publicationDemographic,
      };
    });

    res.status(200).json({
      data: results,
      pagination: {
        limit: mangaDexResponse.limit,
        offset: mangaDexResponse.offset,
        total: mangaDexResponse.total,
      },
    });
  } catch (err) {
    if (err instanceof MangaDexApiError) {
      const statusCode = err.isRateLimit ? 429 : err.statusCode >= 500 ? 502 : 500;
      next(new AppError(statusCode, err.message));
      return;
    }
    next(err);
  }
}

/**
 * GET /api/v1/manga/:id
 *
 * Returns detailed information for a single manga.
 *
 * **Access model:**
 * - Publicly accessible — guests can browse manga details without logging in.
 * - If the user is authenticated (optional auth), the response is enriched
 *   with their tracking status (follow state + last read chapter).
 * - Tracking data is `null` for unauthenticated guests.
 *
 * Lookup strategy:
 *  1. Check local DB by `sourceId` (fast, no external calls)
 *  2. If not found locally → fetch from MangaDex, persist, return
 *  3. If MangaDex also doesn't have it → 404
 *
 * The `:id` param is the MangaDex UUID (validated by `validateParams` middleware).
 */
export async function getMangaDetails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // UUID validation is handled by validateParams middleware.
    // req.user is populated only if a valid token was provided (optional auth).
    const userId = req.user ? parseUserId(req.user.sub) : null;

    // 1. Check local DB first (avoids external API call)
    const localManga = await prisma.manga.findUnique({
      where: { sourceId: id },
      select: {
        id: true,
        sourceId: true,
        title: true,
        slug: true,
        coverUrl: true,
        synopsis: true,
        author: true,
        status: true,
        sourceUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (localManga) {
      // Fetch tracking data only for authenticated users
      const tracking = userId
        ? await fetchUserTracking(userId, localManga.id)
        : null;

      // Return the local copy immediately (with tracking for auth users)
      res.status(200).json({ data: localManga, tracking, source: "local" });

      // Fire-and-forget background refresh (best-effort)
      mangaDexService
        .getMangaDetails(id)
        .then(async (freshData) => {
          const entity = freshData.data;
          await prisma.manga.update({
            where: { sourceId: id },
            data: {
              title: resolveTitle(entity.attributes.title),
              coverUrl: extractCoverUrl(entity.id, entity.relationships),
              synopsis: resolveDescription(entity.attributes.description),
              author: extractAuthor(entity.relationships),
              status: mapMangaDexStatus(entity.attributes.status),
            },
          });
        })
        .catch((refreshErr) => {
          console.warn(
            `[MangaController] Background refresh for ${id} failed:`,
            refreshErr instanceof Error ? refreshErr.message : refreshErr
          );
        });

      return;
    }

    // 2. Not in local DB — fetch from MangaDex
    let mangaDexResponse;
    try {
      mangaDexResponse = await mangaDexService.getMangaDetails(id);
    } catch (err) {
      if (err instanceof MangaDexApiError && err.statusCode === 404) {
        throw new AppError(404, "Manga not found");
      }
      throw err;
    }

    const entity = mangaDexResponse.data;

    // 3. Persist locally
    const persisted = await upsertMangaBatch([entity]);

    // 4. Fetch user tracking only for authenticated users
    const tracking =
      userId && persisted[0]
        ? await fetchUserTracking(userId, persisted[0].id)
        : null;

    const result = {
      localId: persisted[0]?.id ?? null,
      sourceId: entity.id,
      title: resolveTitle(entity.attributes.title),
      altTitles: entity.attributes.altTitles.map(
        (alt) => Object.values(alt)[0] ?? ""
      ),
      synopsis: resolveDescription(entity.attributes.description),
      coverUrl: extractCoverUrl(entity.id, entity.relationships),
      author: extractAuthor(entity.relationships),
      artist: extractArtist(entity.relationships),
      status: entity.attributes.status,
      year: entity.attributes.year,
      contentRating: entity.attributes.contentRating,
      demographicTag: entity.attributes.publicationDemographic,
      originalLanguage: entity.attributes.originalLanguage,
      lastVolume: entity.attributes.lastVolume,
      lastChapter: entity.attributes.lastChapter,
      availableLanguages: entity.attributes.availableTranslatedLanguages.filter(
        (l): l is string => l !== null
      ),
      tags: entity.attributes.tags.map((t) => ({
        id: t.id,
        name: t.attributes.name.en ?? Object.values(t.attributes.name)[0] ?? "Unknown",
        group: t.attributes.group,
      })),
      sourceUrl: `https://mangadex.org/title/${entity.id}`,
      createdAt: entity.attributes.createdAt,
      updatedAt: entity.attributes.updatedAt,
    };

    res.status(200).json({ data: result, tracking, source: "mangadex" });
  } catch (err) {
    if (err instanceof MangaDexApiError) {
      const statusCode = err.isRateLimit ? 429 : err.statusCode >= 500 ? 502 : 500;
      next(new AppError(statusCode, err.message));
      return;
    }
    next(err);
  }
}

/**
 * GET /api/v1/manga/:id/chapters?limit=...&offset=...&language=...
 *
 * Returns a paginated chapter feed for a manga from MangaDex.
 * Publicly accessible — no authentication required.
 *
 * The `:id` param is the MangaDex UUID (validated by `validateParams` middleware).
 * Results are returned in descending chapter order.
 */
export async function getMangaChapters(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // UUID validation is handled by validateParams middleware

    const { limit, offset, language } =
      req.query as unknown as ChaptersQueryInput;

    const mangaDexResponse = await mangaDexService.getMangaChapters(
      id,
      limit,
      offset,
      language
    );

    const chapters = mangaDexResponse.data.map((ch) => ({
      sourceId: ch.id,
      chapter: ch.attributes.chapter,
      volume: ch.attributes.volume,
      title: ch.attributes.title,
      language: ch.attributes.translatedLanguage,
      pages: ch.attributes.pages,
      publishedAt: ch.attributes.publishAt,
      readableAt: ch.attributes.readableAt,
    }));

    res.status(200).json({
      data: chapters,
      pagination: {
        limit: mangaDexResponse.limit,
        offset: mangaDexResponse.offset,
        total: mangaDexResponse.total,
      },
    });
  } catch (err) {
    if (err instanceof MangaDexApiError) {
      if (err.statusCode === 404) {
        next(new AppError(404, "Manga not found or has no chapters"));
        return;
      }
      const statusCode = err.isRateLimit ? 429 : err.statusCode >= 500 ? 502 : 500;
      next(new AppError(statusCode, err.message));
      return;
    }
    next(err);
  }
}

/**
 * GET /api/v1/manga/showcase?trendingPeriod=day|month|year
 *
 * Returns curated and popular lists of manga for the explore catalogue.
 * Trending manga is pulled in real-time from MangaDex (cached for 15m),
 * while Top 5 and Top 20 are queried in batch using static showcase IDs
 * from a local JSON file (mapped and cached efficiently).
 */
export async function getMangaShowcase(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { trendingPeriod } = req.query as unknown as ShowcaseQueryInput;

    // 1. Map trending period to sort criteria
    let sortOption = "followedCount";
    if (trendingPeriod === "day") {
      sortOption = "latestUploadedChapter";
    } else if (trendingPeriod === "month") {
      sortOption = "followedCount";
    } else if (trendingPeriod === "year") {
      sortOption = "rating";
    }

    // 2. Fetch trending list from MangaDex (12 items)
    const trendingResponse = await mangaDexService.getPopularManga(12, 0, sortOption);

    // 3. Load top5 & top20 IDs from JSON file
    const jsonPath = path.join(__dirname, "../../utils/showcase_ids.json");
    const idsRaw = fs.readFileSync(jsonPath, "utf-8");
    const ids = JSON.parse(idsRaw) as { top5: string[]; top20: string[] };

    // 4. Fetch details from MangaDex for top5 and top20 in parallel
    const [top5Response, top20Response] = await Promise.all([
      mangaDexService.getMangaListByIds(ids.top5),
      mangaDexService.getMangaListByIds(ids.top20),
    ]);

    // 5. Sync all of them in local DB for consistency
    const allEntities = [
      ...trendingResponse.data,
      ...top5Response.data,
      ...top20Response.data,
    ];
    const localRecords = await upsertMangaBatch(allEntities);

    // 6. Map results combining local IDs and attributes
    const mapResult = (entity: MangaDexMangaEntity) => {
      const localMatch = localRecords.find((r) => r.sourceId === entity.id);
      return {
        localId: localMatch?.id ?? null,
        sourceId: entity.id,
        title: resolveTitle(entity.attributes.title),
        synopsis: resolveDescription(entity.attributes.description),
        coverUrl: extractCoverUrl(entity.id, entity.relationships),
        author: extractAuthor(entity.relationships),
        status: entity.attributes.status,
        year: entity.attributes.year,
        contentRating: entity.attributes.contentRating,
        tags: entity.attributes.tags.map((t) => ({
          id: t.id,
          name: t.attributes.name.en ?? Object.values(t.attributes.name)[0] ?? "Unknown",
          group: t.attributes.group,
        })),
        lastChapter: entity.attributes.lastChapter,
        demographicTag: entity.attributes.publicationDemographic,
      };
    };

    res.status(200).json({
      data: {
        trending: trendingResponse.data.map(mapResult),
        top5: top5Response.data.map(mapResult),
        top20: top20Response.data.map(mapResult),
      },
    });
  } catch (err) {
    if (err instanceof MangaDexApiError) {
      const statusCode = err.isRateLimit ? 429 : err.statusCode >= 500 ? 502 : 500;
      next(new AppError(statusCode, err.message));
      return;
    }
    next(err);
  }
}

