export interface Character {
  name: string;
  image: string;
  role: "Main Character" | "Supporting Character";
  quote: string;
}

export interface Staff {
  name: string;
  role: string;
}

export interface Stats {
  reading: number;
  completed: number;
  onHold: number;
  dropped: number;
  planToRead: number;
  releaseFrequency: string;
  nextChapterReleaseDate: string;
  popularityRank: number;
}

export interface Comment {
  username: string;
  avatar: string;
  comment: string;
  rating: number;
  likes: number;
  date: string;
}

export interface EnrichedMangaDetails {
  motto: string;
  characters: Character[];
  staff: Staff[];
  stats: Stats;
  comments: Comment[];
}

// Helper to generate a simple numeric hash from string
function getStringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getMangaEnrichedDetails(mangaId: string, title: string): EnrichedMangaDetails {
  const hash = getStringHash(mangaId || title);
  
  // Generate stats
  const baseReaders = 5000 + (hash % 100000);
  const stats: Stats = {
    reading: Math.round(baseReaders * 0.4),
    completed: Math.round(baseReaders * 0.25),
    onHold: Math.round(baseReaders * 0.1),
    dropped: Math.round(baseReaders * 0.05),
    planToRead: Math.round(baseReaders * 0.2),
    releaseFrequency: hash % 2 === 0 ? "Weekly" : "Monthly",
    nextChapterReleaseDate: hash % 2 === 0 ? "Wednesday, July 8, 2026" : "Friday, July 24, 2026",
    popularityRank: 10 + (hash % 500),
  };

  return {
    motto: "",
    characters: [],
    staff: [],
    stats,
    comments: [],
  };
}
