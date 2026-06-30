import type { LocalizedString, MangaDexRelationship } from "../types/mangadex.types";

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
