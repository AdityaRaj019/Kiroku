import { Character } from "./mangaDetailsEnricher";

const ANILIST_API_URL = "https://graphql.anilist.co";

const ANILIST_CHARACTERS_QUERY = `
  query ($search: String) {
    Media (search: $search, type: MANGA) {
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
`;

function cleanDescriptionToQuote(description: string, name: string): string {
  if (!description) return `${name} is a key figure in this story.`;
  
  // Strip HTML elements and Markdown symbols
  let cleaned = description
    .replace(/<[^>]*>/g, "") // Remove HTML
    .replace(/__|_|\*|~/g, "") // Remove Markdown
    .replace(/\\n|\r/g, " ") // Clean newlines
    .replace(/\s+/g, " ")
    .trim();

  // Look for any quotation blocks inside the description first
  const quoteMatch = cleaned.match(/"([^"]+)"/);
  if (quoteMatch && quoteMatch[1].length > 10 && quoteMatch[1].length < 150) {
    return quoteMatch[1];
  }

  // Fallback: Use the first descriptive sentence
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  if (sentences.length > 0) {
    let sentence = sentences[0];
    
    // Ensure it doesn't end abruptly if too long
    if (sentence.length > 150) {
      sentence = sentence.slice(0, 147) + "...";
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
    const edges = result.data?.Media?.characters?.edges || [];

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
