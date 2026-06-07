import Bottleneck from "bottleneck";
import { redisClient } from "../utils/redis";
import type {
  MangaDexMangaEntity,
  MangaDexChapterEntity,
  MangaDexCollectionResponse,
  MangaDexEntityResponse,
  MangaDexErrorResponse,
} from "../types/mangadex.types";

// Re-export types so consumers can import from the service or the types file
export type {
  MangaDexMangaEntity,
  MangaDexChapterEntity,
  MangaDexCollectionResponse,
  MangaDexEntityResponse,
  MangaDexRelationship,
  MangaDexMangaAttributes,
  MangaDexChapterAttributes,
  LocalizedString,
} from "../types/mangadex.types";

// ─── MangaDex API Constants ──────────────────────────────────

const MANGADEX_BASE_URL = "https://api.mangadex.org";

/**
 * User-Agent header required by MangaDex API.
 * @see https://api.mangadex.org/docs/2-limitations/
 */
const USER_AGENT = "Kiroku/0.1.0 (https://github.com/kiroku)";

// ─── Cache TTLs (seconds) ────────────────────────────────────

/** Manga detail pages: 24 hours */
const CACHE_TTL_DETAIL = 60 * 60 * 24;

/** Search results: 15 minutes */
const CACHE_TTL_SEARCH = 60 * 15;

/** Chapter feed: 10 minutes */
const CACHE_TTL_CHAPTERS = 60 * 10;

// ─── Cache Key Prefixes ──────────────────────────────────────

const CACHE_PREFIX_SEARCH = "mangadex:search:";
const CACHE_PREFIX_DETAIL = "mangadex:detail:";
const CACHE_PREFIX_CHAPTERS = "mangadex:chapters:";

// ─── Custom Errors ───────────────────────────────────────────

export class MangaDexApiError extends Error {
  public readonly statusCode: number;
  public readonly isRateLimit: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "MangaDexApiError";
    this.statusCode = statusCode;
    this.isRateLimit = statusCode === 429;
  }
}

// ─── Service ─────────────────────────────────────────────────

/**
 * Rate-limited, Redis-cached wrapper around the MangaDex REST API.
 *
 * **Rate Limiter:** Token-bucket via Bottleneck —
 *   max 5 concurrent, 1 request every 250 ms (≈ 4 req/s sustained,
 *   stays safely below MangaDex's 5 req/s global limit).
 *
 * **Caching:**
 *   - Search results → 15 minutes
 *   - Manga details  → 24 hours
 *   - Chapter feeds   → 10 minutes
 *
 * **Graceful degradation:** On 429 or network errors, the service
 *   returns stale cached data if available, or throws a typed error.
 */
class MangaDexService {
  private readonly limiter: Bottleneck;

  constructor() {
    this.limiter = new Bottleneck({
      maxConcurrent: 5,
      minTime: 250, // ms between requests → ≈4 req/s sustained
    });
  }

  // ── Private Helpers ──────────────────────────────────────

  /**
   * Rate-limited HTTP fetch with mandatory User-Agent.
   * Returns the parsed JSON body or throws MangaDexApiError.
   */
  private async fetchFromMangaDex<T>(url: string): Promise<T> {
    return this.limiter.schedule(async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        let detail = response.statusText;
        try {
          const errBody = (await response.json()) as MangaDexErrorResponse;
          if (errBody.errors?.[0]?.detail) {
            detail = errBody.errors[0].detail;
          }
        } catch {
          // response body wasn't JSON — keep statusText
        }
        throw new MangaDexApiError(
          `MangaDex API error ${response.status}: ${detail}`,
          response.status
        );
      }

      return (await response.json()) as T;
    });
  }

  /**
   * Read from Redis cache. Returns `null` on cache miss or when
   * Redis is unavailable (fail-open for reads).
   */
  private async cacheGet<T>(key: string): Promise<T | null> {
    try {
      if (!redisClient.isOpen) return null;
      const raw = await redisClient.get(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(
        `[MangaDexService] Cache read failed for key "${key}":`,
        err instanceof Error ? err.message : err
      );
      return null;
    }
  }

  /**
   * Write to Redis cache with a TTL.
   * Fails silently — cache writes are best-effort.
   */
  private async cacheSet(
    key: string,
    value: unknown,
    ttlSeconds: number
  ): Promise<void> {
    try {
      if (!redisClient.isOpen) return;
      await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch (err) {
      console.warn(
        `[MangaDexService] Cache write failed for key "${key}":`,
        err instanceof Error ? err.message : err
      );
    }
  }

  /**
   * Fetch data with cache-first, graceful-degradation strategy.
   *
   * 1. Try cache → hit → return immediately
   * 2. Cache miss → fetch from MangaDex → store in cache → return
   * 3. On 429 / network error → return stale cache if available, else throw
   */
  private async fetchWithCache<T>(
    cacheKey: string,
    url: string,
    ttlSeconds: number
  ): Promise<T> {
    // 1. Try cache
    const cached = await this.cacheGet<T>(cacheKey);
    if (cached !== null) return cached;

    // 2. Fetch from MangaDex
    try {
      const data = await this.fetchFromMangaDex<T>(url);
      await this.cacheSet(cacheKey, data, ttlSeconds);
      return data;
    } catch (err) {
      // 3. Graceful degradation — return stale cache on 429 or network error
      if (
        err instanceof MangaDexApiError &&
        (err.isRateLimit || err.statusCode >= 500)
      ) {
        const stale = await this.cacheGet<T>(cacheKey);
        if (stale !== null) {
          console.warn(
            `[MangaDexService] Returning stale cache for "${cacheKey}" after ${err.statusCode}`
          );
          return stale;
        }
      }
      throw err;
    }
  }

  // ── Public Methods ───────────────────────────────────────

  /**
   * Search for manga on MangaDex.
   *
   * Includes `cover_art` and `author` relationships by default for
   * richer search result cards.
   *
   * @param query  - The search term (title substring).
   * @param limit  - Max results per page (1-100, default 10).
   * @param offset - Pagination offset (default 0).
   * @returns The full MangaDex collection response.
   */
  async searchManga(
    query: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<MangaDexCollectionResponse<MangaDexMangaEntity>> {
    const params = new URLSearchParams({
      title: query,
      limit: String(Math.min(Math.max(limit, 1), 100)),
      offset: String(Math.max(offset, 0)),
      "includes[]": "cover_art",
      "order[relevance]": "desc",
    });
    // URLSearchParams won't allow duplicate keys via constructor,
    // so append additional includes manually.
    params.append("includes[]", "author");

    const url = `${MANGADEX_BASE_URL}/manga?${params.toString()}`;

    // Normalize query for cache key: lowercase, trim, collapse whitespace
    // so "Chainsaw Man" and "chainsaw  man" hit the same cache entry.
    const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, " ");
    const cacheKey = `${CACHE_PREFIX_SEARCH}${normalizedQuery}:${limit}:${offset}`;

    return this.fetchWithCache<
      MangaDexCollectionResponse<MangaDexMangaEntity>
    >(cacheKey, url, CACHE_TTL_SEARCH);
  }

  /**
   * Get full manga details by its MangaDex source ID.
   *
   * Includes `cover_art`, `author`, and `artist` relationships.
   *
   * @param sourceId - The MangaDex manga UUID.
   * @returns The full MangaDex entity response.
   */
  async getMangaDetails(
    sourceId: string
  ): Promise<MangaDexEntityResponse<MangaDexMangaEntity>> {
    const params = new URLSearchParams({
      "includes[]": "cover_art",
    });
    params.append("includes[]", "author");
    params.append("includes[]", "artist");

    const url = `${MANGADEX_BASE_URL}/manga/${encodeURIComponent(sourceId)}?${params.toString()}`;
    const cacheKey = `${CACHE_PREFIX_DETAIL}${sourceId}`;

    return this.fetchWithCache<MangaDexEntityResponse<MangaDexMangaEntity>>(
      cacheKey,
      url,
      CACHE_TTL_DETAIL
    );
  }

  /**
   * Get the chapter feed for a manga.
   *
   * Chapters are returned in descending order by chapter number.
   *
   * @param sourceId - The MangaDex manga UUID.
   * @param limit    - Max chapters per page (1-500, default 100).
   * @param offset   - Pagination offset (default 0).
   * @param language - ISO 639-1 translated language filter (default "en").
   * @returns The full MangaDex collection response.
   */
  async getMangaChapters(
    sourceId: string,
    limit: number = 100,
    offset: number = 0,
    language: string = "en"
  ): Promise<MangaDexCollectionResponse<MangaDexChapterEntity>> {
    const params = new URLSearchParams({
      limit: String(Math.min(Math.max(limit, 1), 500)),
      offset: String(Math.max(offset, 0)),
      "translatedLanguage[]": language,
      "order[chapter]": "desc",
    });

    const url = `${MANGADEX_BASE_URL}/manga/${encodeURIComponent(sourceId)}/feed?${params.toString()}`;
    const cacheKey = `${CACHE_PREFIX_CHAPTERS}${sourceId}:${language}:${limit}:${offset}`;

    return this.fetchWithCache<
      MangaDexCollectionResponse<MangaDexChapterEntity>
    >(cacheKey, url, CACHE_TTL_CHAPTERS);
  }
}

// ─── Singleton Export ────────────────────────────────────────

const globalForMangaDex = globalThis as unknown as {
  mangaDexService: MangaDexService | undefined;
};

export const mangaDexService: MangaDexService =
  globalForMangaDex.mangaDexService ?? new MangaDexService();

if (process.env.NODE_ENV !== "production") {
  globalForMangaDex.mangaDexService = mangaDexService;
}
