import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma";
import { mangaDexService, MangaDexApiError } from "../../services/mangadex.service";
import { AppError } from "../../middlewares/error.middleware";
import type { SearchQueryInput, ChaptersQueryInput } from "./manga.schema";
import type {
  MangaDexMangaEntity,
  MangaDexRelationship,
  LocalizedString,
} from "../../types/mangadex.types";

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Maps MangaDex status strings to our Prisma MangaStatus enum.
 * Falls back to ONGOING for unknown values.
 */
function mapMangaDexStatus(
  status: string
): "ONGOING" | "COMPLETED" | "HIATUS" | "CANCELLED" {
  const statusMap: Record<string, "ONGOING" | "COMPLETED" | "HIATUS" | "CANCELLED"> = {
    ongoing: "ONGOING",
    completed: "COMPLETED",
    hiatus: "HIATUS",
    cancelled: "CANCELLED",
  };
  return statusMap[status.toLowerCase()] ?? "ONGOING";
}

/**
 * Resolves the preferred English title from a MangaDex localized string,
 * falling back to Japanese, then the first available locale.
 */
function resolveTitle(title: LocalizedString): string {
  return title.en ?? title["ja-ro"] ?? title.ja ?? Object.values(title)[0] ?? "Untitled";
}

/**
 * Resolves the English description from a MangaDex localized string.
 */
function resolveDescription(desc: LocalizedString): string | null {
  return desc.en ?? desc["ja-ro"] ?? desc.ja ?? Object.values(desc)[0] ?? null;
}

/**
 * Extracts the cover art filename from MangaDex relationships.
 * Returns the full cover URL if found, otherwise null.
 *
 * @see https://api.mangadex.org/docs/04-covers/
 */
function extractCoverUrl(
  mangaId: string,
  relationships: MangaDexRelationship[]
): string | null {
  const coverRel = relationships.find((r) => r.type === "cover_art");
  if (!coverRel?.attributes) return null;

  const filename = coverRel.attributes["fileName"] as string | undefined;
  if (!filename) return null;

  return `https://uploads.mangadex.org/covers/${mangaId}/${filename}.256.jpg`;
}

/**
 * Extracts the author name from MangaDex relationships.
 */
function extractAuthor(relationships: MangaDexRelationship[]): string | null {
  const authorRel = relationships.find((r) => r.type === "author");
  if (!authorRel?.attributes) return null;

  return (authorRel.attributes["name"] as string) ?? null;
}

/**
 * Creates a URL-friendly slug from a title string.
 * Strips non-alphanumeric characters, collapses hyphens.
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
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
        err instanceof Error &&
        err.message.includes("Unique constraint")
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
 * Lookup strategy:
 *  1. Check local DB by `sourceId` (fast, no external calls)
 *  2. If not found locally → fetch from MangaDex, persist, return
 *  3. If MangaDex also doesn't have it → 404
 *
 * The `:id` param is the MangaDex UUID (e.g. `a1c7c817-4e59-43b7-9365-09675a149a6f`).
 */
export async function getMangaDetails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError(400, "Manga ID is required");
    }

    // UUID format validation (MangaDex uses UUID v4)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new AppError(400, "Invalid manga ID format — expected a UUID");
    }

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
      // Refresh from MangaDex in the background to keep data fresh,
      // but return the local copy immediately for speed
      res.status(200).json({ data: localManga, source: "local" });

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

    res.status(200).json({ data: result, source: "mangadex" });
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
 *
 * The `:id` param is the MangaDex UUID.
 * Results are returned in descending chapter order.
 */
export async function getMangaChapters(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError(400, "Manga ID is required");
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new AppError(400, "Invalid manga ID format — expected a UUID");
    }

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

// ─── Private Helpers (detail-specific) ───────────────────────

/**
 * Extracts the artist name from MangaDex relationships.
 */
function extractArtist(relationships: MangaDexRelationship[]): string | null {
  const artistRel = relationships.find((r) => r.type === "artist");
  if (!artistRel?.attributes) return null;

  return (artistRel.attributes["name"] as string) ?? null;
}
