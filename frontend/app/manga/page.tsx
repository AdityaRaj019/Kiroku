"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LeftFilterPanel, FilterState } from "@/components/explore/LeftFilterPanel";
import { RightContentPane } from "@/components/explore/RightContentPane";
import { apiFetch } from "@/utils/api";
import { MangaData } from "@/components/explore/MangaCard";
import { MANGA_THEMES } from "./themes";
import { Paintbrush } from "lucide-react";

export default function MangaCatalogPage() {
  // Theme States
  const [activeThemeId, setActiveThemeId] = useState<string>("default");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("kiroku-manga-theme");
    if (saved) {
      setTimeout(() => {
        setActiveThemeId(saved);
      }, 0);
    }
  }, []);

  const handleThemeChange = (id: string) => {
    setActiveThemeId(id);
    localStorage.setItem("kiroku-manga-theme", id);
  };

  const activeTheme = useMemo(() => {
    return MANGA_THEMES.find((t) => t.id === activeThemeId) || MANGA_THEMES[0];
  }, [activeThemeId]);

  const primaryAlphaColor = useMemo(() => {
    const hex = activeTheme.colors.primary;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return isNaN(r) || isNaN(g) || isNaN(b)
      ? "rgba(204, 0, 0, 0.12)"
      : `rgba(${r}, ${g}, ${b}, 0.12)`;
  }, [activeTheme]);

  // Page level filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    genre: "",
    status: "",
    language: "",
    minChapters: 0,
    maxChapters: 1000,
    demographics: [],
    contentRatings: [],
  });

  // We define isSearchActive as true when any search or filter parameter is set (aside from the defaults)
  const isSearchActive = useMemo(() => {
    return !!(
      filters.search ||
      filters.genre ||
      filters.status ||
      filters.language ||
      (filters.demographics && filters.demographics.length > 0) ||
      (filters.contentRatings && filters.contentRatings.length > 0) ||
      filters.minChapters > 0 ||
      filters.maxChapters < 1000
    );
  }, [filters]);

  // Query search/filter results when active using the backend's /manga/search advanced search route
  const { data: searchResults = [], isLoading, isError } = useQuery<MangaData[]>({
    queryKey: [
      "mangaSearch",
      filters.search,
      filters.genre,
      filters.status,
      filters.language,
      filters.demographics?.join(","),
      filters.contentRatings?.join(","),
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append("q", filters.search);
      if (filters.genre) params.append("genres", filters.genre); // Backend advanced search expects genres parameter
      if (filters.status) params.append("status", filters.status);
      if (filters.language) params.append("language", filters.language);
      if (filters.demographics && filters.demographics.length > 0) {
        params.append("demographics", filters.demographics.join(","));
      }
      if (filters.contentRatings && filters.contentRatings.length > 0) {
        params.append("contentRatings", filters.contentRatings.join(","));
      }
      
      // Fetch up to 100 results from MangaDex to allow local filtering on frontend
      params.append("limit", "100");

      const res = await apiFetch(`/manga/search?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to search/filter manga");
      }
      const json = await res.json();
      return (json.data || []) as MangaData[];
    },
    enabled: isSearchActive,
  });

  // Filter search results locally based on sidebar chapter count options
  const finalFilteredResults = useMemo(() => {
    if (!searchResults) return [];

    return searchResults.filter((manga) => {
      // Chapters Count filter (MangaDex search returns lastChapter, parse it)
      const parsedChapters = manga.lastChapter ? parseInt(manga.lastChapter, 10) : 120;
      const chCount = isNaN(parsedChapters) ? 120 : parsedChapters;
      if (chCount < filters.minChapters || chCount > filters.maxChapters) {
        return false;
      }

      return true;
    });
  }, [searchResults, filters.minChapters, filters.maxChapters]);

  return (
    <div className="manga-theme-scope min-h-screen bg-[#FAF9F6] text-zinc-950 flex flex-col font-sans transition-all duration-300">
      {/* Raw style tag for theme overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .manga-theme-scope {
          --theme-bg: ${activeTheme.colors.background};
          --theme-card-bg: ${activeTheme.colors.cardBackground};
          --theme-text-primary: ${activeTheme.colors.textPrimary};
          --theme-text-secondary: ${activeTheme.colors.textSecondary};
          --theme-primary: ${activeTheme.colors.primary};
          --theme-primary-hover: ${activeTheme.colors.primaryHover};
          --theme-accent: ${activeTheme.colors.accent};
          --theme-border: ${activeTheme.colors.border};
          --theme-shadow: ${activeTheme.colors.shadow};
          --theme-badge-bg: ${activeTheme.colors.badgeBg};
          --theme-badge-text: ${activeTheme.colors.badgeText};
          --theme-primary-alpha: ${primaryAlphaColor};
        }

        /* Scoped overrides for theme */
        .manga-theme-scope {
          background-color: var(--theme-bg) !important;
          color: var(--theme-text-primary) !important;
        }

        .manga-theme-scope .bg-\[\#FAF9F6\] {
          background-color: var(--theme-bg) !important;
        }

        .manga-theme-scope .bg-white {
          background-color: var(--theme-card-bg) !important;
        }

        .manga-theme-scope .bg-\[\#CC0000\],
        .manga-theme-scope .bg-red-600 {
          background-color: var(--theme-primary) !important;
          color: var(--theme-badge-text) !important;
        }

        .manga-theme-scope .hover\:bg-\[\#CC0000\]:hover,
        .manga-theme-scope .hover\:bg-red-700:hover {
          background-color: var(--theme-primary-hover) !important;
        }

        .manga-theme-scope .hover\:bg-\[\#CC0000\]\/5:hover,
        .manga-theme-scope .group:hover .group-hover\:bg-\[\#CC0000\]\/5 {
          background-color: var(--theme-primary-alpha) !important;
        }

        .manga-theme-scope .bg-zinc-100 {
          background-color: var(--theme-bg) !important;
          opacity: 0.9;
        }

        .manga-theme-scope .text-zinc-950,
        .manga-theme-scope .text-zinc-900,
        .manga-theme-scope .text-black,
        .manga-theme-scope h1,
        .manga-theme-scope h2,
        .manga-theme-scope h3,
        .manga-theme-scope h4 {
          color: var(--theme-text-primary) !important;
        }

        .manga-theme-scope .text-zinc-600,
        .manga-theme-scope .text-zinc-500,
        .manga-theme-scope .text-zinc-700 {
          color: var(--theme-text-secondary) !important;
        }

        .manga-theme-scope .text-\[\#CC0000\],
        .manga-theme-scope .group:hover .group-hover\:text-\[\#CC0000\] {
          color: var(--theme-primary) !important;
        }

        .manga-theme-scope .fill-\[\#CC0000\] {
          fill: var(--theme-primary) !important;
        }

        .manga-theme-scope .border-zinc-950,
        .manga-theme-scope .border-black {
          border-color: var(--theme-border) !important;
        }

        .manga-theme-scope .border-zinc-200,
        .manga-theme-scope .border-zinc-300 {
          border-color: var(--theme-border) !important;
          opacity: 0.4;
        }

        .manga-theme-scope .shadow-\[1px_1px_0px_\#000\] { box-shadow: 1px 1px 0px var(--theme-shadow) !important; }
        .manga-theme-scope .shadow-\[2px_2px_0px_\#000\] { box-shadow: 2px 2px 0px var(--theme-shadow) !important; }
        .manga-theme-scope .shadow-\[3px_3px_0px_\#000\] { box-shadow: 3px 3px 0px var(--theme-shadow) !important; }
        .manga-theme-scope .shadow-\[4px_4px_0px_\#000\] { box-shadow: 4px 4px 0px var(--theme-shadow) !important; }
        .manga-theme-scope .shadow-\[6px_6px_0px_\#000\] { box-shadow: 6px 6px 0px var(--theme-shadow) !important; }
        .manga-theme-scope .shadow-\[8px_8px_0px_\#000\] { box-shadow: 8px 8px 0px var(--theme-shadow) !important; }
        .manga-theme-scope .hover\:shadow-\[8px_8px_0px_\#000\]:hover { box-shadow: 8px 8px 0px var(--theme-shadow) !important; }

        .manga-theme-scope select,
        .manga-theme-scope input[type="text"],
        .manga-theme-scope input[type="range"] {
          background-color: var(--theme-card-bg) !important;
          color: var(--theme-text-primary) !important;
          border-color: var(--theme-border) !important;
        }
        .manga-theme-scope .accent-\[\#CC0000\] {
          accent-color: var(--theme-primary) !important;
        }
        .manga-theme-scope .bg-\[radial-gradient\(rgba\(204\,0\,0\,0\.12\)_1\.5px\,transparent_0\)\] {
          background-image: radial-gradient(var(--theme-primary-alpha) 1.5px, transparent 0) !important;
        }
        .manga-theme-scope .bg-\[radial-gradient\(rgba\(204\,0\,0\,0\.08\)_1\.5px\,transparent_0\)\] {
          background-image: radial-gradient(var(--theme-primary-alpha) 1.5px, transparent 0) !important;
        }
      ` }} />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Discover Layout */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 md:px-8">
        
        {/* Page Banner Header */}
        <div className="bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000] mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(rgba(204,0,0,0.08)_1.5px,transparent_0)] bg-[size:12px_12px] opacity-70 pointer-events-none" />
          <div className="relative z-10">
            <span className="bg-[#CC0000] text-white font-bebas text-xs font-bold tracking-widest px-2 py-0.5 uppercase border-2 border-zinc-950 shadow-[2px_2px_0px_#000]">
              Manga discovery portal
            </span>
            <h1 className="font-bebas text-4xl md:text-5xl font-black tracking-wider text-zinc-950 mt-3 mb-1 uppercase">
              EXPLORE MANGA CATALOG
            </h1>
            <p className="text-sm text-zinc-600 max-w-xl font-sans font-medium">
              Browse through trending series, filter by chapters, genre, status, and track your reading updates seamlessly on Kiroku.
            </p>
          </div>
        </div>

        {/* Catalog Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Filter Sidebar Panel (col-span-3 or col-span-4 on desktop) */}
          <div className="lg:col-span-3 lg:sticky lg:top-28 z-20">
            <LeftFilterPanel filters={filters} onChange={setFilters} />
          </div>

          {/* Right Column: Dynamic Content Feed Panel (col-span-9 or col-span-8 on desktop) */}
          <div className="lg:col-span-9">
            <RightContentPane
              key={`${filters.search}-${filters.genre}-${filters.status}-${filters.language}-${filters.demographics?.join(",")}-${filters.contentRatings?.join(",")}`}
              isSearchActive={isSearchActive}
              searchQuery={filters.search}
              searchResults={finalFilteredResults}
              isSearchLoading={isLoading}
              isSearchError={isError}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Theme Selector Button & Popover (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <div className="relative flex flex-col items-end">
          {/* Popover Menu */}
          {isThemeMenuOpen && (
            <div className="mb-4 w-56 bg-white border-4 border-zinc-950 p-3.5 shadow-[6px_6px_0px_#000] rounded-none space-y-2.5 animate-fade-in font-sans">
              <h4 className="font-bebas text-lg font-bold tracking-wider text-zinc-950 border-b-2 border-dashed border-zinc-200 pb-1.5 uppercase">
                Choose Universe Theme
              </h4>
              <div className="flex flex-col gap-1.5">
                {MANGA_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      handleThemeChange(theme.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full font-bebas text-xs px-2.5 py-1.5 border-2 border-zinc-950 shadow-[1.5px_1.5px_0px_#000] active:translate-y-[0.5px] active:shadow-[0.5px_0.5px_0px_#000] transition-all cursor-pointer font-bold tracking-wider flex items-center gap-2 uppercase select-none ${
                      activeThemeId === theme.id
                        ? "bg-[#CC0000] text-white"
                        : "bg-white text-zinc-950 hover:bg-[#CC0000]/5"
                    }`}
                  >
                    <span
                      className="w-3 h-3 border border-zinc-950 rounded-full shrink-0"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <span className="truncate">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trigger FAB */}
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="w-12 h-12 flex items-center justify-center bg-[#CC0000] text-white border-4 border-zinc-950 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all cursor-pointer rounded-none hover:bg-[#CC0000]/90"
            title="Choose Page Theme"
          >
            <Paintbrush className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
