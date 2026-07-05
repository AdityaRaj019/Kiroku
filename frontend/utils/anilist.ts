import { Character } from "./mangaDetailsEnricher";

const ANILIST_API_URL = "https://graphql.anilist.co";

const ANILIST_CHARACTERS_QUERY = `
  query ($search: String) {
    Page (page: 1, perPage: 1) {
      media (search: $search, type: MANGA, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
        }
        characters (sort: [ROLE, RELEVANCE, ID], perPage: 12) {
          edges {
            role
            node {
              name {
                full
              }
              image {
                large
              }
              description
            }
          }
        }
      }
    }
  }
`;

function cleanDescriptionToQuote(description: string, name: string): string {
  if (!description) return `${name} is a key figure in this story.`;
  
  // Split description by newlines to filter out lines
  const lines = description.split(/\r?\n/);
  const biographyLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Remove any bold/italics/spoiler markers anywhere in the line for testing (e.g. ~!, **, __)
    const cleanPrefix = trimmed
      .replace(/[*_~!]+/g, "")
      .trim()
      .toLowerCase();

    // Check if the line matches metadata categories (including JJK cursed techniques and species)
    const isMetadata = /^(age|height|gender|weight|blood\s*type|birth\s*date|birthday|hair|eyes|relatives|aliases|alias|nationality|affiliation|occupation|voiced\s*by|japanese\s*voice|english\s*voice|class|grade|rank|status|race|type|abilities|signature\s*move|species|cursed\s*technique|domain\s*expansion|classification|family|family\s*members|partner|hobbies|voice\s*actor|seiyuu|prominent\s*three\s*families):/i.test(cleanPrefix);

    if (isMetadata) {
      continue; // Skip!
    }

    biographyLines.push(trimmed);
  }

  let cleaned = biographyLines.join(" ");

  // Strip Markdown links: [Label](URL) -> Label
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Strip HTML elements and Markdown symbols
  cleaned = cleaned
    .replace(/<[^>]*>/g, "") // Remove HTML
    .replace(/__|_|\*|~|!/g, "") // Remove Markdown and spoiler exclamation marks
    .replace(/\\n|\r/g, " ") // Clean newlines
    .replace(/\s+/g, " ")
    .trim();

  // Fallback: Use the first descriptive sentence
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  if (sentences.length > 0) {
    let sentence = sentences[0];
    if (sentence.length < 20 && sentences.length > 1) {
      sentence += " " + sentences[1];
    }
    if (sentence.length > 180) {
      sentence = sentence.slice(0, 177) + "...";
    }
    return sentence;
  }

  return `${name} is a vital character in this series.`;
}

interface AniListCharacterEdge {
  role: string;
  node: {
    name: {
      full: string;
    };
    image: {
      large: string | null;
    };
    description: string | null;
  };
}

/**
 * Searches AniList for characters of a manga title and returns processed nodes.
 * Fallbacks to empty array if the search has no matches.
 */
export async function fetchCharactersFromAniList(title: string): Promise<Character[]> {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: ANILIST_CHARACTERS_QUERY,
        variables: { search: title },
      }),
    });

    if (!response.ok) {
      throw new Error(`AniList HTTP error: ${response.status}`);
    }

    const result = (await response.json()) as {
      data?: {
        Page?: {
          media?: Array<{
            characters?: {
              edges?: AniListCharacterEdge[];
            };
          }>;
        };
      };
    };

    const media = result.data?.Page?.media?.[0];
    const edges = media?.characters?.edges || [];

    return edges.map((edge: AniListCharacterEdge) => {
      const charName = edge.node.name.full;
      return {
        name: charName,
        image: edge.node.image.large || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=300&fit=crop",
        role: edge.role === "MAIN" ? "Main Character" : "Supporting Character",
        quote: cleanDescriptionToQuote(edge.node.description || "", charName),
      };
    });
  } catch (error) {
    console.warn(
      `[AniListService] Failed to fetch characters from AniList: ${
        error instanceof Error ? error.message : String(error)
      }. Falling back to Jikan API.`
    );
    return await fetchCharactersFromJikan(title);
  }
}

interface JikanCharacterEdge {
  character: {
    name: string;
    images?: {
      webp?: {
        image_url: string;
      };
      jpg?: {
        image_url: string;
      };
    };
  };
  role: string;
}

function cleanJikanName(name: string): string {
  if (!name.includes(",")) return name;
  const parts = name.split(",").map((p) => p.trim());
  return `${parts[1]} ${parts[0]}`;
}

function getDynamicFallbackQuote(name: string, role: string): string {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mainQuotes = [
    "I will protect this world, even if it costs me everything.",
    "If you don't take risks, you can't create a future!",
    "Strength isn't about not falling, it's about getting back up.",
    "I won't run away anymore. I will face my destiny.",
    "Bonds of friendship are the ultimate armor.",
    "The only way to win is to never give up!"
  ];
  const supportingQuotes = [
    "Sometimes, the quietest hearts have the loudest dreams.",
    "The future belongs to those who fight for it today.",
    "A sword is only as sharp as the spirit of the one who wields it.",
    "No one stands at the top of the world without scars.",
    "Logic can only take you so far. Sometimes you need a little magic.",
    "Bonds forged in fire are the hardest to break."
  ];

  if (role === "Main Character") {
    return mainQuotes[hash % mainQuotes.length];
  } else {
    return supportingQuotes[hash % supportingQuotes.length];
  }
}

async function fetchCharactersFromJikan(title: string): Promise<Character[]> {
  try {
    const cleanTitle = title
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .trim();
    if (!cleanTitle) return [];

    const searchRes = await fetch(
      `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(cleanTitle)}&limit=1`
    );
    if (!searchRes.ok) {
      throw new Error(`Jikan search HTTP error: ${searchRes.status}`);
    }

    const searchData = (await searchRes.json()) as {
      data?: Array<{ mal_id: number }>;
    };
    const malId = searchData.data?.[0]?.mal_id;
    if (!malId) return [];

    const charRes = await fetch(`https://api.jikan.moe/v4/manga/${malId}/characters`);
    if (!charRes.ok) {
      throw new Error(`Jikan characters HTTP error: ${charRes.status}`);
    }

    const charData = (await charRes.json()) as {
      data?: JikanCharacterEdge[];
    };
    const edges = (charData.data || []).slice(0, 12);

    return edges.map((edge: JikanCharacterEdge) => {
      const rawName = edge.character.name;
      const cleanName = cleanJikanName(rawName);
      const imageUrl =
        edge.character.images?.webp?.image_url ||
        edge.character.images?.jpg?.image_url ||
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=300&fit=crop";
      
      const roleMapped = edge.role === "Main" ? "Main Character" : "Supporting Character";

      return {
        name: cleanName,
        image: imageUrl,
        role: roleMapped,
        quote: getDynamicFallbackQuote(cleanName, roleMapped),
      };
    });
  } catch (error) {
    console.warn(
      `[JikanService] Failed to fetch characters from Jikan: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return [];
  }
}


