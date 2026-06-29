export interface FriendActivity {
  id: string;
  user: string;
  avatarText: string;
  action: string;
  time: string;
}

export interface FloatingCard {
  id: string;
  title: string;
  icon: string;
  subtitle?: string;
  className: string; // Positioning & custom delay styles
}

export interface AnimeSeriesData {
  id: string;
  title: string;
  character: string;
  accentColor: string; // Tailwind/CSS color value
  glowColor: string; // Semi-transparent glow value
  rating: string;
  ratingStars: number;
  progress: number; // percentage (0-100)
  status: string; // e.g. "Currently Watching" / "Completed"
  details: string; // e.g. "Season 4" / "4 Seasons • 96 Episodes"
  trendingBadge: string;
  japaneseTitle: string;
  japaneseWelcome: string;
  welcomeSub: string;
  quote: string;
  quoteSpeaker: string;
  imagePath: string;
  stats: {
    label: string;
    value: string;
  }[];
  friendsActivity: FriendActivity[];
  floatingCards: FloatingCard[];
}

export const ANIME_SHOWCASE_DATA: AnimeSeriesData[] = [
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    character: "Levi Ackerman",
    accentColor: "#E52521", // Crimson
    glowColor: "rgba(229, 37, 33, 0.15)",
    rating: "9.2",
    ratingStars: 5,
    progress: 82,
    status: "Currently Watching",
    details: "Season 4 Part 3",
    trendingBadge: "🔥 #2 Top Rated",
    japaneseTitle: "進撃の巨人",
    japaneseWelcome: "ようこそ、壁の中の世界へ",
    welcomeSub: "Itterasshai (いってらっしゃい) — Face the walls with courage.",
    quote: "The only thing we're allowed to do... is to believe that we won't regret the choice we made.",
    quoteSpeaker: "Levi Ackerman",
    imagePath: "/images/levi.png",
    stats: [
      { label: "Completed", value: "4 Seasons" },
      { label: "Episodes", value: "96 total" },
      { label: "Rating", value: "9.2/10" }
    ],
    friendsActivity: [
      { id: "a1", user: "John", avatarText: "J", action: "completed Episode 80", time: "2m ago" },
      { id: "a2", user: "Emily", avatarText: "E", action: "rated Vinland Saga ★★★★★", time: "10m ago" },
      { id: "a3", user: "Rohit", avatarText: "R", action: "started Bleach TYBW", time: "1h ago" }
    ],
    floatingCards: [
      { id: "f1", title: "Humanity's Hope", icon: "🏆", subtitle: "Achievement unlocked", className: "top-[15%] left-[5%]" },
      { id: "f2", title: "Ep 80/96 Watched", icon: "👀", subtitle: "82% completed", className: "bottom-[20%] left-[8%]" },
      { id: "f3", title: "Rate: ★★★★★", icon: "⭐", className: "top-[30%] right-[5%]" }
    ]
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    character: "Satoru Gojo",
    accentColor: "#A855F7", // Purple
    glowColor: "rgba(168, 85, 247, 0.15)",
    rating: "9.1",
    ratingStars: 5,
    progress: 64,
    status: "Currently Watching",
    details: "Season 2",
    trendingBadge: "🔮 #1 Trending",
    japaneseTitle: "呪術廻戦",
    japaneseWelcome: "領域展開へ、ようこそ",
    welcomeSub: "Ryōiki Tenkai (領域展開) — Awaken the cursed energy within.",
    quote: "Don't worry, I'm the strongest. There's no limit to what you can achieve here.",
    quoteSpeaker: "Satoru Gojo",
    imagePath: "/images/gojo.png",
    stats: [
      { label: "Rating", value: "9.1/10" },
      { label: "Trackers", value: "35M Users" },
      { label: "Status", value: "Ongoing" }
    ],
    friendsActivity: [
      { id: "j1", user: "Karan", avatarText: "K", action: "completed Season 2", time: "5m ago" },
      { id: "j2", user: "Suresh", avatarText: "S", action: "unlocked 'Limitless' Badge", time: "15m ago" },
      { id: "j3", user: "Priyan", avatarText: "P", action: "started Jujutsu Kaisen 0", time: "2h ago" }
    ],
    floatingCards: [
      { id: "f1", title: "Domain Expansion", icon: "🔮", subtitle: "Special grade unlock", className: "top-[10%] left-[10%]" },
      { id: "f2", title: "+12 Friends Online", icon: "👥", className: "bottom-[25%] left-[5%]" },
      { id: "f3", title: "Limitless Power", icon: "⚡", className: "top-[25%] right-[8%]" }
    ]
  },
  {
    id: "one-piece",
    title: "One Piece",
    character: "Monkey D. Luffy",
    accentColor: "#0088FF", // Blue
    glowColor: "rgba(0, 136, 255, 0.15)",
    rating: "8.9",
    ratingStars: 4,
    progress: 95,
    status: "Currently Watching",
    details: "Egghead Arc",
    trendingBadge: "🏴‍☠️ Legendary Series",
    japaneseTitle: "ワンピース",
    japaneseWelcome: "野郎ども、キロクへ出発だ！",
    welcomeSub: "Shuppatsu da (出発だ) — Set sail for your ultimate list.",
    quote: "If you don't take risks, you can't create a future! Become the king of your journey.",
    quoteSpeaker: "Monkey D. Luffy",
    imagePath: "/images/luffy.png",
    stats: [
      { label: "Episodes", value: "1100+" },
      { label: "Format", value: "Weekly" },
      { label: "Manga Chapters", value: "1110+" }
    ],
    friendsActivity: [
      { id: "o1", user: "ZoroFan", avatarText: "Z", action: "read Chapter 1115", time: "1m ago" },
      { id: "o2", user: "Nami", avatarText: "N", action: "added Egghead Arc to Watched", time: "12m ago" },
      { id: "o3", user: "Luffy", avatarText: "L", action: "reached Wano Peak", time: "4h ago" }
    ],
    floatingCards: [
      { id: "f1", title: "King of Pirates", icon: "☠️", subtitle: "Grand achievement", className: "top-[18%] left-[6%]" },
      { id: "f2", title: "Gear 5 Activated", icon: "🥁", className: "bottom-[22%] left-[12%]" },
      { id: "f3", title: "Ep 1085 Watched", icon: "📺", className: "top-[28%] right-[6%]" }
    ]
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    character: "Kamado Tanjiro",
    accentColor: "#10B981", // Emerald
    glowColor: "rgba(16, 185, 129, 0.15)",
    rating: "8.7",
    ratingStars: 5,
    progress: 50,
    status: "Currently Watching",
    details: "Hashira Training",
    trendingBadge: "⚔️ Visually Stunning",
    japaneseTitle: "鬼滅の刃",
    japaneseWelcome: "全集中、常中！",
    welcomeSub: "Zen Shūchū (全集中) — Complete focus on your collection.",
    quote: "No matter how many people you lose, you have no choice but to go on living. No matter how devastating the blows.",
    quoteSpeaker: "Kamado Tanjiro",
    imagePath: "/images/tanjiro.png",
    stats: [
      { label: "Rating", value: "8.7/10" },
      { label: "Seasons", value: "4 Seasons" },
      { label: "Studio", value: "ufotable" }
    ],
    friendsActivity: [
      { id: "d1", user: "Zenitsu", avatarText: "Z", action: "unlocked 'Thunder Clap' Badge", time: "30s ago" },
      { id: "d2", user: "Inosuke", avatarText: "I", action: "completed Season 3", time: "8m ago" },
      { id: "d3", user: "Nezuko", avatarText: "N", action: "rated Demon Slayer ★★★★★", time: "1h ago" }
    ],
    floatingCards: [
      { id: "f1", title: "Water Breathing", icon: "🌊", subtitle: "Flow state unlocked", className: "top-[14%] left-[8%]" },
      { id: "f2", title: "Hinokami Kagura", icon: "☀️", className: "bottom-[18%] left-[7%]" },
      { id: "f3", title: "Mugen Train Completed", icon: "🚂", className: "top-[32%] right-[5%]" }
    ]
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    character: "Sung Jinwoo",
    accentColor: "#6366F1", // Indigo
    glowColor: "rgba(99, 102, 241, 0.15)",
    rating: "9.0",
    ratingStars: 5,
    progress: 75,
    status: "Currently Watching",
    details: "Season 1",
    trendingBadge: "👑 Monarch Rise",
    japaneseTitle: "俺だけレベルアップな件",
    japaneseWelcome: "今からレベルアップが始まる",
    welcomeSub: "Tate (起て) — Arise, and start leveling up your stats.",
    quote: "If the system wants me to fight, I'll fight. I will rise above everything.",
    quoteSpeaker: "Sung Jinwoo",
    imagePath: "/images/jinwoo.png",
    stats: [
      { label: "Rating", value: "9.0/10" },
      { label: "Type", value: "Manhwa / Anime" },
      { label: "Status", value: "Season 2 Coming" }
    ],
    friendsActivity: [
      { id: "s1", user: "ChaHae", avatarText: "C", action: "read Solo Leveling Chapter 179", time: "3m ago" },
      { id: "s2", user: "Jinah", avatarText: "J", action: "rated Solo Leveling ★★★★★", time: "20m ago" },
      { id: "s3", user: "HunterWu", avatarText: "W", action: "started Webtoon Reading", time: "3h ago" }
    ],
    floatingCards: [
      { id: "f1", title: "Shadow Monarch", icon: "👑", subtitle: "Supreme Class", className: "top-[12%] left-[4%]" },
      { id: "f2", title: "Arise / 起て", icon: "☠️", className: "bottom-[24%] left-[10%]" },
      { id: "f3", title: "Hunter Rank: S", icon: "💎", className: "top-[26%] right-[8%]" }
    ]
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    character: "Denji",
    accentColor: "#FF6B00", // Orange
    glowColor: "rgba(255, 107, 0, 0.15)",
    rating: "8.8",
    ratingStars: 4,
    progress: 42,
    status: "Currently Watching",
    details: "Public Safety Arc",
    trendingBadge: "🪚 Chaotic Masterpiece",
    japaneseTitle: "チェンソーマン",
    japaneseWelcome: "チェンソーの心臓へ、ようこそ",
    welcomeSub: "Keiyaku (契約) — Make a contract and track your titles.",
    quote: "I want to live a normal life and be treated like a human. I'll fight to prove my dream.",
    quoteSpeaker: "Denji",
    imagePath: "/images/denji.png",
    stats: [
      { label: "Rating", value: "8.8/10" },
      { label: "Episodes", value: "12 Episodes" },
      { label: "Studio", value: "MAPPA" }
    ],
    friendsActivity: [
      { id: "c1", user: "Power", avatarText: "P", action: "completed Chainsaw Man", time: "1m ago" },
      { id: "c2", user: "Aki", avatarText: "A", action: "added Reze Arc to Planned", time: "18m ago" },
      { id: "c3", user: "Makima", avatarText: "M", action: "rated Chainsaw Man ★★★★★", time: "6h ago" }
    ],
    floatingCards: [
      { id: "f1", title: "Chainsaw Heart", icon: "🪚", subtitle: "Pochita's bond", className: "top-[16%] left-[9%]" },
      { id: "f2", title: "Easy Revenge!", icon: "🚬", className: "bottom-[20%] left-[6%]" },
      { id: "f3", title: "Public Safety Division 4", icon: "🏢", className: "top-[30%] right-[7%]" }
    ]
  }
];
