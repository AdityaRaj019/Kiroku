export interface UserProfileStats {
  totalBooks: number;
  completedCount: number;
  readingCount: number;
  chaptersRead: number;
  averageScore: number;
}

export interface UserComment {
  id: number;
  mangaTitle: string;
  chapterNumber: string;
  body: string;
  createdAt: string;
}

export interface UserProfile {
  id: number;
  email?: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  exp: number;
  rank: string;
  createdAt: string;
  stats: UserProfileStats;
  recentComments: UserComment[];
}

export interface UserProfileResponse {
  user: UserProfile;
}

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface UpdateProfileResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    bio: string | null;
    exp: number;
    rank: string;
    createdAt: string;
  };
}
