"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LeftFilterPanel, FilterState } from "@/components/explore/LeftFilterPanel";
import { RightContentPane } from "@/components/explore/RightContentPane";
import { apiFetch } from "@/utils/api";
import { MangaData } from "@/components/explore/MangaCard";

export default function MangaCatalogPage() {
  // Page level filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    genre: "",
    status: "",
    language: "",
    minChapters: 0,
    maxChapters: 1000,
  });

  // Query search results when search is active
  const { data: searchResults, isLoading, isError } = useQuery<MangaData[]>({
    queryKey: ["mangaSearch", filters.search],
    queryFn: async () => {
      if (!filters.search) return [];
      const res = await apiFetch(`/manga?q=${encodeURIComponent(filters.search)}&limit=40`);
      if (!res.ok) {
        throw new Error("Failed to search manga");
      }
      const json = await res.json();
      return json.data as MangaData[];
    },
    enabled: !!filters.search,
  });

  // Filter search results locally based on sidebar filter options
  const finalFilteredResults = useMemo(() => {
    if (!searchResults) return [];

    return searchResults.filter((manga) => {
      // 1. Genre filter (matching tags)
      if (filters.genre) {
        const hasGenre = manga.tags?.some(
          (t) => t.name.toLowerCase() === filters.genre.toLowerCase()
        );
        if (!hasGenre) return false;
      }

      // 2. Status filter
      if (filters.status) {
        if (manga.status.toLowerCase() !== filters.status.toLowerCase()) {
          return false;
        }
      }

      // 3. Chapters Count filter (MangaDex search returns lastChapter, parse it)
      const parsedChapters = manga.lastChapter ? parseInt(manga.lastChapter, 10) : 100;
      const chCount = isNaN(parsedChapters) ? 100 : parsedChapters;
      if (chCount < filters.minChapters || chCount > filters.maxChapters) {
        return false;
      }

      return true;
    });
  }, [searchResults, filters]);

  const isSearchActive = !!filters.search;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-950 flex flex-col font-sans">
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
    </div>
  );
}
