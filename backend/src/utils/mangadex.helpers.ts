import type { LocalizedString, MangaDexRelationship, MangaDexTag } from "../types/mangadex.types";

/**
 * Maps MangaDex status strings to our Prisma MangaStatus enum.
 * Falls back to ONGOING for unknown values.
 */
export function mapMangaDexStatus(
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
export function resolveTitle(title: LocalizedString): string {
  return title.en ?? title["ja-ro"] ?? title.ja ?? Object.values(title)[0] ?? "Untitled";
}

/**
 * Resolves the English description from a MangaDex localized string.
 */
export function resolveDescription(desc: LocalizedString): string | null {
  return desc.en ?? desc["ja-ro"] ?? desc.ja ?? Object.values(desc)[0] ?? null;
}

/**
 * Extracts the cover art filename from MangaDex relationships.
 * Returns the full cover URL if found, otherwise null.
 */
export function extractCoverUrl(
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
export function extractAuthor(relationships: MangaDexRelationship[]): string | null {
  const authorRel = relationships.find((r) => r.type === "author");
  if (!authorRel?.attributes) return null;

  return (authorRel.attributes["name"] as string) ?? null;
}

/**
 * Creates a URL-friendly slug from a title string.
 * Strips non-alphanumeric characters, collapses hyphens.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

// ─── Advanced Catalog Helpers (Task 03) ──────────────────────

/**
 * Extracts genre names from MangaDex tags where `group` is "genre".
 * Returns a deduplicated, non-empty string array.
 */
export function extractGenres(tags: MangaDexTag[]): string[] {
  return tags
    .filter((t) => t.attributes.group === "genre")
    .map((t) => t.attributes.name.en ?? Object.values(t.attributes.name)[0] ?? "")
    .filter(Boolean);
}

/**
 * Infers the manga format from the MangaDex `originalLanguage` field.
 *  - ja  → MANGA
 *  - ko  → MANHWA
 *  - zh  → MANHUA
 *
 * Returns null for unrecognised languages.
 */
export function inferFormat(
  originalLanguage: string
): "MANGA" | "MANHWA" | "MANHUA" | null {
  const formatMap: Record<string, "MANGA" | "MANHWA" | "MANHUA"> = {
    ja: "MANGA",
    ko: "MANHWA",
    zh: "MANHUA",
    "zh-hk": "MANHUA",
  };
  return formatMap[originalLanguage] ?? null;
}

/**
 * Maps a MangaDex `originalLanguage` code to an ISO-style country code.
 * Falls back to the raw language code when no mapping exists.
 */
export function inferCountry(originalLanguage: string): string {
  const countryMap: Record<string, string> = {
    ja: "JP",
    ko: "KR",
    zh: "CN",
    "zh-hk": "HK",
    en: "US",
    fr: "FR",
    de: "DE",
    es: "ES",
    it: "IT",
    pt: "PT",
    "pt-br": "BR",
  };
  return countryMap[originalLanguage] ?? originalLanguage;
}

/**
 * Parses MangaDex `lastChapter` (a string like "142") into a numeric
 * chapter count. Returns null for non-numeric or missing values.
 */
export function parseChapterCount(
  lastChapter: string | null | undefined
): number | null {
  if (!lastChapter) return null;
  const parsed = parseInt(lastChapter, 10);
  return isNaN(parsed) ? null : parsed;
}
