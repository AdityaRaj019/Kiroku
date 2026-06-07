/**
 * MangaDex API response types.
 *
 * These mirror the JSON structures returned by the MangaDex REST API
 * (v5.x) and are consumed by the MangaDex service, controllers, and
 * workers throughout the backend.
 *
 * @see https://api.mangadex.org/docs/
 */

// ─── Primitives ──────────────────────────────────────────────

/** Localized string map — MangaDex returns { "en": "...", "ja": "..." } */
export interface LocalizedString {
  [locale: string]: string;
}

// ─── Shared Sub-Structures ───────────────────────────────────

export interface MangaDexTag {
  id: string;
  type: "tag";
  attributes: {
    name: LocalizedString;
    description: LocalizedString;
    group: string;
    version: number;
  };
  relationships: unknown[];
}

export interface MangaDexRelationship {
  id: string;
  type: string;
  related?: string;
  attributes?: Record<string, unknown>;
}

// ─── Manga ───────────────────────────────────────────────────

export interface MangaDexMangaAttributes {
  title: LocalizedString;
  altTitles: LocalizedString[];
  description: LocalizedString;
  isLocked: boolean;
  links: Record<string, string> | null;
  originalLanguage: string;
  lastVolume: string;
  lastChapter: string;
  publicationDemographic: string | null;
  status: string;
  year: number | null;
  contentRating: string;
  tags: MangaDexTag[];
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  availableTranslatedLanguages: (string | null)[];
  latestUploadedChapter: string | null;
}

export interface MangaDexMangaEntity {
  id: string;
  type: "manga";
  attributes: MangaDexMangaAttributes;
  relationships: MangaDexRelationship[];
}

// ─── Chapter ─────────────────────────────────────────────────

export interface MangaDexChapterAttributes {
  volume: string | null;
  chapter: string | null;
  title: string | null;
  translatedLanguage: string;
  externalUrl: string | null;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
}

export interface MangaDexChapterEntity {
  id: string;
  type: "chapter";
  attributes: MangaDexChapterAttributes;
  relationships: MangaDexRelationship[];
}

// ─── Response Envelopes ──────────────────────────────────────

/** Collection response envelope from MangaDex (search, feed, etc.) */
export interface MangaDexCollectionResponse<T> {
  result: "ok" | "error";
  response: "collection";
  data: T[];
  limit: number;
  offset: number;
  total: number;
}

/** Single-entity response from MangaDex (e.g. GET /manga/:id) */
export interface MangaDexEntityResponse<T> {
  result: "ok" | "error";
  response: "entity";
  data: T;
}

/** Error response from MangaDex */
export interface MangaDexErrorResponse {
  result: "error";
  errors: Array<{
    id: string;
    status: number;
    title: string;
    detail: string;
    context: string | null;
  }>;
}
