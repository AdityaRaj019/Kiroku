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

    // Remove any non-alphanumeric markers to check for prefix matching (e.g. ~!, **, __)
    const cleanPrefix = trimmed
      .replace(/^[^a-zA-Z0-9]+/, "")
      .toLowerCase();

    // Check if the line matches metadata categories
    const isMetadata = /^(age|height|gender|weight|blood\s*type|birth\s*date|birthday|hair|eyes|relatives|aliases|alias|nationality|affiliation|occupation|voiced\s*by|japanese\s*voice|english\s*voice|class|grade|rank|status|race|type|abilities|signature\s*move):/i.test(cleanPrefix);

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

  // Look for any quotation blocks inside the description first
  const quoteMatch = cleaned.match(/"([^"]+)"/);
  if (quoteMatch && quoteMatch[1].length > 15 && quoteMatch[1].length < 180) {
    return quoteMatch[1];
  }

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

    const result = await response.json();
    const media = result.data?.Page?.media?.[0];
    const edges = media?.characters?.edges || [];

    return edges.map((edge: any) => {
      const charName = edge.node.name.full;
      return {
        name: charName,
        image: edge.node.image.large || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=300&fit=crop",
        role: edge.role === "MAIN" ? "Main Character" : "Supporting Character",
        quote: cleanDescriptionToQuote(edge.node.description, charName),
      };
    });
  } catch (error) {
    console.error("[AniListService] Failed to fetch characters:", error);
    return [];
  }
}
