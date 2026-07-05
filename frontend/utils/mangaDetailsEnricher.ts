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

// Pre-defined rich content for popular series
const popularSeriesContent: Record<string, Partial<EnrichedMangaDetails>> = {
  onepiece: {
    motto: "Inherited Will, The Destiny of Age, and The Dreams of People...",
    characters: [
      {
        name: "Monkey D. Luffy",
        image: "https://cdn.myanimelist.net/images/characters/9/31067.jpg",
        role: "Main Character",
        quote: "If you don't take risks, you can't create a future!",
      },
      {
        name: "Roronoa Zoro",
        image: "https://cdn.myanimelist.net/images/characters/3/100534.jpg",
        role: "Main Character",
        quote: "When the world shoves you around, you've just got to stand up and shove back.",
      },
      {
        name: "Nami",
        image: "https://cdn.myanimelist.net/images/characters/2/263249.jpg",
        role: "Main Character",
        quote: "Life is like a wind, Luffy! I am the navigator who guides the ship!",
      },
      {
        name: "Vinsmoke Sanji",
        image: "https://cdn.myanimelist.net/images/characters/5/136769.jpg",
        role: "Main Character",
        quote: "It doesn't matter if a woman is lying, a real man forgives her lies.",
      },
      {
        name: "Nico Robin",
        image: "https://cdn.myanimelist.net/images/characters/4/263251.jpg",
        role: "Main Character",
        quote: "Sometimes the only thing you have to doubt is your own common sense.",
      },
      {
        name: "Tony Tony Chopper",
        image: "https://cdn.myanimelist.net/images/characters/3/263253.jpg",
        role: "Main Character",
        quote: "I realized back then, the reason I wanted to become human, was that I wanted to have friends.",
      },
      {
        name: "Usopp",
        image: "https://cdn.myanimelist.net/images/characters/3/263255.jpg",
        role: "Main Character",
        quote: "There comes a time when a man has to stand and fight!",
      },
      {
        name: "Portgas D. Ace",
        image: "https://cdn.myanimelist.net/images/characters/4/510107.jpg",
        role: "Supporting Character",
        quote: "Thank you for loving someone like me who is good for nothing... with bad blood!",
      },
      {
        name: "Trafalgar Law",
        image: "https://cdn.myanimelist.net/images/characters/4/114979.jpg",
        role: "Supporting Character",
        quote: "The weak don't get to decide anything, not even how they die.",
      },
      {
        name: "Red-Haired Shanks",
        image: "https://cdn.myanimelist.net/images/characters/13/461719.jpg",
        role: "Supporting Character",
        quote: "By experiencing both victory and defeat... that's how a man grows.",
      },
    ],
    staff: [
      { name: "Eiichiro Oda", role: "Author & Lead Illustrator" },
      { name: "Kohei Onishi", role: "Chief Editor" },
      { name: "Shueisha", role: "Publisher" },
    ],
    stats: {
      reading: 425310,
      completed: 128450,
      onHold: 45200,
      dropped: 12500,
      planToRead: 198000,
      releaseFrequency: "Weekly (Shonen Jump)",
      nextChapterReleaseDate: "Sunday, July 12, 2026",
      popularityRank: 1,
    },
    comments: [
      {
        username: "PirateKing99",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
        comment: "Egghead Island arc is an absolute masterpiece! Oda continues to deliver peak fiction after 28 years.",
        rating: 10,
        likes: 342,
        date: "2 days ago",
      },
      {
        username: "ZoroFanboy",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop",
        comment: "The pacing is finally picking up and the lore drops are insane. Literally the best manga of all time.",
        rating: 10,
        likes: 198,
        date: "4 days ago",
      },
    ],
  },
  naruto: {
    motto: "I won't run away, I never go back on my word! That is my nindo!",
    characters: [
      {
        name: "Naruto Uzumaki",
        image: "https://cdn.myanimelist.net/images/characters/9/131317.jpg",
        role: "Main Character",
        quote: "If you don't like your destiny, don't accept it. Instead, have the courage to change it!",
      },
      {
        name: "Sasuke Uchiha",
        image: "https://cdn.myanimelist.net/images/characters/9/131319.jpg",
        role: "Main Character",
        quote: "I have long since closed my eyes... My only goal is in the darkness.",
      },
      {
        name: "Kakashi Hatake",
        image: "https://cdn.myanimelist.net/images/characters/7/284129.jpg",
        role: "Supporting Character",
        quote: "Those who break the rules are scum, but those who abandon their friends are worse than scum.",
      },
      {
        name: "Sakura Haruno",
        image: "https://cdn.myanimelist.net/images/characters/9/131321.jpg",
        role: "Main Character",
        quote: "The things that are most important aren't written in books. You have to learn them by experiencing them.",
      },
      {
        name: "Itachi Uchiha",
        image: "https://cdn.myanimelist.net/images/characters/4/504286.jpg",
        role: "Supporting Character",
        quote: "People live their lives bound by what they accept as correct and true. That is how they define 'reality'.",
      },
      {
        name: "Jiraiya",
        image: "https://cdn.myanimelist.net/images/characters/14/50338.jpg",
        role: "Supporting Character",
        quote: "A person grows up when he's able to overcome hardships. Protection is important, but there are some things a person must learn on his own.",
      },
      {
        name: "Gaara",
        image: "https://cdn.myanimelist.net/images/characters/13/284125.jpg",
        role: "Supporting Character",
        quote: "Perhaps the companionship of an evil person is preferable to loneliness.",
      },
      {
        name: "Shikamaru Nara",
        image: "https://cdn.myanimelist.net/images/characters/7/284123.jpg",
        role: "Supporting Character",
        quote: "It's because we help out when they're in trouble that we can count on them when we need them.",
      },
      {
        name: "Hinata Hyuga",
        image: "https://cdn.myanimelist.net/images/characters/9/284121.jpg",
        role: "Supporting Character",
        quote: "When I watch you, I feel strong, like I can do anything—that even I am worth something.",
      },
      {
        name: "Minato Namikaze",
        image: "https://cdn.myanimelist.net/images/characters/16/231189.jpg",
        role: "Supporting Character",
        quote: "To be a shinobi is to endure. Pain, loss, and the heavy burden of choice.",
      },
    ],
    staff: [
      { name: "Masashi Kishimoto", role: "Author & Illustrator" },
      { name: "Yahagi Kosuke", role: "Editor" },
      { name: "Shueisha", role: "Publisher" },
    ],
    stats: {
      reading: 98120,
      completed: 541090,
      onHold: 15430,
      dropped: 29800,
      planToRead: 85200,
      releaseFrequency: "Completed",
      nextChapterReleaseDate: "N/A (Series Completed)",
      popularityRank: 3,
    },
    comments: [
      {
        username: "Dattebayo_Uzumaki",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
        comment: "This series shaped my entire childhood. The Pain Arc is arguably the best arc in anime/manga history.",
        rating: 10,
        likes: 512,
        date: "1 week ago",
      },
    ],
  },
  chainsawman: {
    motto: "If there's a devil I can make friends with... I'd love to.",
    characters: [
      {
        name: "Denji",
        image: "https://cdn.myanimelist.net/images/characters/3/492407.jpg",
        role: "Main Character",
        quote: "If having a dream is so great, then maybe I'll try to have one too.",
      },
      {
        name: "Power",
        image: "https://cdn.myanimelist.net/images/characters/11/492411.jpg",
        role: "Main Character",
        quote: "Bow down before me, humans! My name is Power!",
      },
      {
        name: "Aki Hayakawa",
        image: "https://cdn.myanimelist.net/images/characters/3/492409.jpg",
        role: "Main Character",
        quote: "Don't die on me. We've got devils to kill.",
      },
      {
        name: "Makima",
        image: "https://cdn.myanimelist.net/images/characters/14/492412.jpg",
        role: "Supporting Character",
        quote: "All devils are born with a name. The more that name is feared, the more powerful the devil itself becomes.",
      },
      {
        name: "Himeno",
        image: "https://cdn.myanimelist.net/images/characters/8/492414.jpg",
        role: "Supporting Character",
        quote: "I want Aki to cry for me when I die. That's all.",
      },
      {
        name: "Kobeni Higashiyama",
        image: "https://cdn.myanimelist.net/images/characters/2/492415.jpg",
        role: "Supporting Character",
        quote: "If I'm going to die anyway, I want to eat something tasty first!",
      },
      {
        name: "Reze",
        image: "https://cdn.myanimelist.net/images/characters/6/454955.jpg",
        role: "Supporting Character",
        quote: "Denji, did you know? The town mouse and the country mouse...",
      },
      {
        name: "Kishibe",
        image: "https://cdn.myanimelist.net/images/characters/15/496262.jpg",
        role: "Supporting Character",
        quote: "The devil hunters that devils fear are the ones with the most screwed-up heads.",
      },
      {
        name: "Angel Devil",
        image: "https://cdn.myanimelist.net/images/characters/7/496253.jpg",
        role: "Supporting Character",
        quote: "I am an angel, but I am also a devil. I gather souls of those whose time has come.",
      },
      {
        name: "Pochita",
        image: "https://cdn.myanimelist.net/images/characters/8/496255.jpg",
        role: "Supporting Character",
        quote: "Denji... show me your dreams.",
      },
    ],
    staff: [
      { name: "Tatsuki Fujimoto", role: "Author & Illustrator" },
      { name: "Shihei Lin", role: "Editor" },
      { name: "Shonen Jump+", role: "Publisher" },
    ],
    stats: {
      reading: 285400,
      completed: 104000,
      onHold: 24500,
      dropped: 8900,
      planToRead: 112000,
      releaseFrequency: "Bi-weekly",
      nextChapterReleaseDate: "Wednesday, July 15, 2026",
      popularityRank: 2,
    },
    comments: [
      {
        username: "MakimasLeash",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop",
        comment: "Fujimoto is a mad genius. You never know if the next chapter is going to be a cinematic masterpiece or absolute chaos.",
        rating: 9,
        likes: 289,
        date: "Yesterday",
      },
    ],
  },
  jujutsukaisen: {
    motto: "In a world where cursed energy runs wild, only the strongest survive.",
    characters: [
      {
        name: "Yuji Itadori",
        image: "https://cdn.myanimelist.net/images/characters/16/381507.jpg",
        role: "Main Character",
        quote: "I don't know how I'll feel when I'm dead, but I don't want to regret the way I lived.",
      },
      {
        name: "Satoru Gojo",
        image: "https://cdn.myanimelist.net/images/characters/3/420783.jpg",
        role: "Main Character",
        quote: "Don't worry, I'm the strongest.",
      },
      {
        name: "Megumi Fushiguro",
        image: "https://cdn.myanimelist.net/images/characters/11/381512.jpg",
        role: "Main Character",
        quote: "I save people unequally. That's why I became a jujutsu sorcerer.",
      },
      {
        name: "Nobara Kugisaki",
        image: "https://cdn.myanimelist.net/images/characters/14/381515.jpg",
        role: "Main Character",
        quote: "What makes us obligated to meet perfection or such absurd standards?",
      },
      {
        name: "Kento Nanami",
        image: "https://cdn.myanimelist.net/images/characters/3/399316.jpg",
        role: "Supporting Character",
        quote: "Jujutsu sorcerers are scum. Working in an office is scum. Since both are equally scum, I chose the one I'm better at.",
      },
      {
        name: "Ryomen Sukuna",
        image: "https://cdn.myanimelist.net/images/characters/7/424911.jpg",
        role: "Supporting Character",
        quote: "Know your place, fool.",
      },
      {
        name: "Maki Zenin",
        image: "https://cdn.myanimelist.net/images/characters/15/399307.jpg",
        role: "Supporting Character",
        quote: "I'm going to become a great sorcerer just to spite my family.",
      },
      {
        name: "Toge Inumaki",
        image: "https://cdn.myanimelist.net/images/characters/6/399308.jpg",
        role: "Supporting Character",
        quote: "Salmon. Bonito flakes. Mustard leaf.",
      },
      {
        name: "Suguru Geto",
        image: "https://cdn.myanimelist.net/images/characters/3/438780.jpg",
        role: "Supporting Character",
        quote: "Are you the strongest because you're Satoru Gojo, or are you Satoru Gojo because you're the strongest?",
      },
      {
        name: "Yuta Okkotsu",
        image: "https://cdn.myanimelist.net/images/characters/2/450702.jpg",
        role: "Supporting Character",
        quote: "I want to have relationships with people. I want to be needed by someone. I want to have the confidence to feel like it's okay to live.",
      },
    ],
    staff: [
      { name: "Gege Akutami", role: "Author & Illustrator" },
      { name: "Tatsuhiko Katayama", role: "Editor" },
      { name: "Shueisha", role: "Publisher" },
    ],
    stats: {
      reading: 198000,
      completed: 312000,
      onHold: 18700,
      dropped: 11000,
      planToRead: 64000,
      releaseFrequency: "Completed",
      nextChapterReleaseDate: "N/A (Series Completed)",
      popularityRank: 4,
    },
    comments: [
      {
        username: "CursedEnergyX",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
        comment: "The final showdown was absolutely mind blowing. Sad that it's over, but what a ride!",
        rating: 9,
        likes: 412,
        date: "3 days ago",
      },
    ],
  },
};

// Lists for fallback generator
const genericMottos = [
  "In the face of despair, the only option is to rise.",
  "Bonds forged in fire are the hardest to break.",
  "A journey of a thousand pages begins with a single search.",
  "When dark shadows creep, the light of courage shines brightest.",
  "Beyond the limits of destiny lies true freedom.",
];

const genericCharacters = [
  { name: "Hiroshi Sato", quote: "I will protect this world, even if it costs me everything." },
  { name: "Ren Tanaka", quote: "Strength isn't about not falling, it's about getting back up." },
  { name: "Yuki Watanabe", quote: "Sometimes, the quietest hearts have the loudest dreams." },
  { name: "Aoi Kobayashi", quote: "The future belongs to those who fight for it today." },
  { name: "Kenji Suzuki", quote: "A sword is only as sharp as the spirit of the one who wields it." },
  { name: "Mei Takahashi", quote: "Logic can only take you so far. Sometimes you need a little magic." },
  { name: "Daiki Saito", quote: "No one stands at the top of the world without scars." },
  { name: "Sakura Ito", quote: "Bonds of friendship are the ultimate armor." },
];

const characterImages = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=80",
];

const genericStaffNames = [
  "Takeshi Obata",
  "Yusuke Murata",
  "Sui Ishida",
  "Kentaro Miura",
  "Naoko Takeuchi",
  "Hirohiko Araki",
  "Kubo Tite",
  "Hiromu Arakawa",
];

const genericComments = [
  "I stumbled upon this series by accident and now I'm completely hooked. The art style is gorgeous!",
  "Great pacing and character development. Definitely one of the top reads of this season.",
  "The lore is so deep! I spent three hours reading wiki theories after the latest chapter.",
  "Honestly a bit of a slow start, but stick with it. The payoff in the second volume is massive.",
  "Highly recommended for anyone who loves rich storytelling and stunning battle panels.",
];

const genericUsernames = [
  "OtakuSoul",
  "MangaReader99",
  "ChibiChan",
  "WeebWarrior",
  "KageBunshin",
  "Shinigami_Ryu",
  "GamerManga",
  "SenseiX",
];

export function getMangaEnrichedDetails(mangaId: string, title: string): EnrichedMangaDetails {
  const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // 1. Try matching with popular series
  let matchedKey = "";
  if (normTitle.includes("onepiece")) matchedKey = "onepiece";
  else if (normTitle.includes("naruto")) matchedKey = "naruto";
  else if (normTitle.includes("chainsawman")) matchedKey = "chainsawman";
  else if (normTitle.includes("jujutsukaisen") || normTitle.includes("jjk")) matchedKey = "jujutsukaisen";
  
  if (matchedKey && popularSeriesContent[matchedKey]) {
    // Return complete mock filled in with defaults for safety
    const match = popularSeriesContent[matchedKey];
    return {
      motto: match.motto || "A thrilling tale of adventure and destiny.",
      characters: match.characters || [],
      staff: match.staff || [{ name: "Unknown Author", role: "Author" }],
      stats: match.stats || {
        reading: 10000,
        completed: 5000,
        onHold: 1200,
        dropped: 400,
        planToRead: 8000,
        releaseFrequency: "Weekly",
        nextChapterReleaseDate: "Sunday, July 12, 2026",
        popularityRank: 12,
      },
      comments: match.comments || [],
    };
  }

  // 2. Fallback procedural generator using string hashing
  const hash = getStringHash(mangaId || title);
  
  const motto = genericMottos[hash % genericMottos.length];
  
  // Generate 8-12 characters for generic series
  const charCount = 8 + (hash % 5); // 8, 9, 10, 11, or 12
  const characters: Character[] = [];
  for (let i = 0; i < charCount; i++) {
    const charHash = hash + i * 17;
    const charTemplate = genericCharacters[charHash % genericCharacters.length];
    
    // Ensure unique names
    let name = charTemplate.name;
    if (characters.some(c => c.name === name)) {
      name = genericCharacters[(charHash + 1) % genericCharacters.length].name;
    }
    
    characters.push({
      name,
      image: characterImages[charHash % characterImages.length],
      role: i === 0 || i === 1 ? "Main Character" : "Supporting Character",
      quote: charTemplate.quote,
    });
  }

  // Generate 2-3 staff members
  const staff: Staff[] = [];
  const authorName = genericStaffNames[hash % genericStaffNames.length];
  const artistName = genericStaffNames[(hash + 3) % genericStaffNames.length];
  staff.push({ name: authorName, role: "Author" });
  if (authorName !== artistName) {
    staff.push({ name: artistName, role: "Illustrator & Designer" });
  }
  staff.push({ name: "Kodansha" , role: "Publisher" });

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

  // Generate 2-3 comments
  const commentCount = 2 + (hash % 2);
  const comments: Comment[] = [];
  for (let i = 0; i < commentCount; i++) {
    const commHash = hash + i * 29;
    const user = genericUsernames[commHash % genericUsernames.length];
    const userAvatar = `https://images.unsplash.com/photo-${1500000000000 + (commHash % 999999)}?w=80&h=80&fit=crop`;
    
    comments.push({
      username: user,
      avatar: userAvatar,
      comment: genericComments[commHash % genericComments.length],
      rating: 7 + (commHash % 4), // 7, 8, 9, 10
      likes: commHash % 50,
      date: `${1 + (commHash % 6)} days ago`,
    });
  }

  return {
    motto,
    characters,
    staff,
    stats,
    comments,
  };
}
