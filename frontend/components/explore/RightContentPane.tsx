"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/utils/api";
import { MangaCard, MangaData } from "./MangaCard";
import { Flame, Award, Grid2X2, Loader2 } from "lucide-react";

interface RightContentPaneProps {
  isSearchActive: boolean;
  searchQuery: string;
  searchResults: MangaData[];
  isSearchLoading: boolean;
  isSearchError: boolean;
}

export const RightContentPane: React.FC<RightContentPaneProps> = ({
  isSearchActive,
  searchQuery,
  searchResults,
  isSearchLoading,
  isSearchError,
}) => {
  const [timeFilter, setTimeFilter] = useState<"day" | "month" | "year">("day");

  // Query showcase lists in parallel based on selected trendingPeriod/timeFilter
  const { data: showcase, isLoading: isShowcaseLoading, isError: isShowcaseError } = useQuery({
    queryKey: ["mangaShowcase", timeFilter],
    queryFn: async () => {
      const res = await apiFetch(`/manga/showcase?trendingPeriod=${timeFilter}`);
      if (!res.ok) {
        throw new Error("Failed to fetch explore showcase lists");
      }
      const json = await res.json();
      return json.data as {
        trending: MangaData[];
        top5: MangaData[];
        top20: MangaData[];
      };
    },
    enabled: !isSearchActive, // only run when search is not active to optimize calls
  });

  const [currentPage, setCurrentPage] = useState(1);

  if (isSearchActive) {
    const totalPages = Math.ceil(searchResults.length / 5);
    const startIndex = (currentPage - 1) * 5;
    const paginatedResults = searchResults.slice(startIndex, startIndex + 5);

    return (
      <div className="space-y-12">
        {/* Search Results Content Block */}
        <div className="bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000]">
          <div className="flex items-center justify-between pb-4 border-b-2 border-zinc-950 mb-6">
            <h2 className="font-bebas text-2xl font-bold tracking-wider text-zinc-950 flex items-center gap-2">
              <Grid2X2 className="w-5 h-5 text-[#CC0000]" />
              <span>
                {searchQuery ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"` : "FILTERED CATALOG RESULTS"}
              </span>
            </h2>
            <span className="text-xs font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 border border-zinc-300">
              {searchResults.length} FOUND
            </span>
          </div>

          {isSearchLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-12 h-12 text-[#CC0000] animate-spin" />
              <p className="font-bebas text-lg tracking-wider text-zinc-600">SEARCHING MANGADEX...</p>
            </div>
          ) : isSearchError ? (
            <div className="py-20 text-center border-4 border-dashed border-red-200 bg-red-50">
              <p className="font-bebas text-xl text-[#CC0000] font-bold mb-2">ERROR CONNECTING TO MANGADEX</p>
              <p className="text-sm text-zinc-600 max-w-md mx-auto">
                We couldn&apos;t load search results. You might have exceeded the MangaDex API rate limits. Please try again in a few moments.
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-20 text-center border-4 border-dashed border-zinc-300">
              <p className="font-bebas text-xl text-zinc-800 font-bold mb-2">NO MANGA FOUND</p>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                No results matched your search/filters. Try adjusting your filter parameters or search term.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {paginatedResults.map((manga, idx) => (
                  <MangaCard key={manga.sourceId} manga={manga} priority={idx < 5} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t-2 border-zinc-950 mt-8 font-sans">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={`font-bebas text-sm px-4 py-2 border-2 border-zinc-950 shadow-[2px_2px_0px_#000] transition-all cursor-pointer select-none font-bold uppercase ${
                      currentPage === 1
                        ? "opacity-40 cursor-not-allowed bg-zinc-100"
                        : "bg-white text-zinc-950 hover:bg-[#CC0000] hover:text-white hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000]"
                    }`}
                  >
                    ← PREV
                  </button>

                  <span className="font-bebas text-lg font-bold tracking-widest text-zinc-700">
                    PAGE {currentPage} OF {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={`font-bebas text-sm px-4 py-2 border-2 border-zinc-950 shadow-[2px_2px_0px_#000] transition-all cursor-pointer select-none font-bold uppercase ${
                      currentPage === totalPages
                        ? "opacity-40 cursor-not-allowed bg-zinc-100"
                        : "bg-white text-zinc-950 hover:bg-[#CC0000] hover:text-white hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000]"
                    }`}
                  >
                    NEXT →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Handle loading and error states for showcase
  if (isShowcaseLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000]">
        <Loader2 className="w-12 h-12 text-[#CC0000] animate-spin" />
        <p className="font-bebas text-xl tracking-wider text-zinc-700 animate-pulse">
          LOADING EXPLORE CATALOGUE...
        </p>
      </div>
    );
  }

  if (isShowcaseError || !showcase) {
    return (
      <div className="py-16 text-center border-4 border-dashed border-red-200 bg-red-50 p-6 shadow-[6px_6px_0px_#000]">
        <p className="font-bebas text-2xl text-[#CC0000] font-bold mb-2">
          ERROR LOADING CATALOGUE
        </p>
        <p className="text-sm text-zinc-600 max-w-md mx-auto mb-4">
          We had trouble fetching the explore showcase lists. The MangaDex API rate limits may have been temporarily exceeded.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="font-bebas text-sm bg-zinc-950 text-white px-4 py-2 border-2 border-zinc-950 shadow-[3px_3px_0px_#CC0000] hover:translate-y-[-2px] transition-all cursor-pointer"
        >
          RETRY
        </button>
      </div>
    );
  }

  const trendingManga = showcase.trending || [];
  const top5Manga = showcase.top5 || [];
  const top20Manga = showcase.top20 || [];

  return (
    <div className="space-y-12">
      {/* Default Discovery Feed blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (9/12 width): Trending & Time Filter Tabs */}
        <div className="lg:col-span-9 space-y-10">
          
          {/* Block 1: Trending Row with Time-Filtered Tabs */}
          <div className="bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000] relative overflow-hidden">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-zinc-950 mb-6">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-[#CC0000] fill-[#CC0000]" />
                <h2 className="font-bebas text-2xl font-bold tracking-wider text-zinc-950">
                  TRENDING NOW
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex border-2 border-zinc-950 p-0.5 bg-zinc-50 shadow-[2px_2px_0px_#000]">
                {(["day", "month", "year"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTimeFilter(tab)}
                    className={`px-3 py-1 font-bebas text-sm font-bold tracking-widest transition-all cursor-pointer ${
                      timeFilter === tab
                        ? "bg-[#CC0000] text-white"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal scroll cards */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
              {trendingManga.length === 0 ? (
                <p className="text-sm text-zinc-500 py-6">No trending manga found for this period.</p>
              ) : (
                trendingManga.map((manga, idx) => (
                  <div key={manga.sourceId} className="w-60 shrink-0">
                    <MangaCard manga={manga} priority={idx < 4} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Block 2: Top 20 Highly Rated Grid (Displays top titles) */}
          <div className="bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000]">
            <div className="flex items-center gap-2 pb-4 border-b-2 border-zinc-950 mb-6">
              <Grid2X2 className="w-5 h-5 text-[#CC0000]" />
              <h2 className="font-bebas text-2xl font-bold tracking-wider text-zinc-950">
                TOP HIGHLY RATED
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {top20Manga.length === 0 ? (
                <p className="text-sm text-zinc-500 col-span-3 text-center py-10">No top rated manga found.</p>
              ) : (
                top20Manga.map((manga) => (
                  <MangaCard key={manga.sourceId} manga={manga} />
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Col (3/12 width): Top 5 All-Time List */}
        <div className="lg:col-span-3">
          <div className="bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000] sticky top-24">
            <div className="flex items-center gap-2 pb-4 border-b-2 border-zinc-950 mb-6">
              <Award className="w-5 h-5 text-[#CC0000]" />
              <h2 className="font-bebas text-2xl font-bold tracking-wider text-zinc-950">
                TOP 5 ALL-TIME
              </h2>
            </div>

            {/* Vertical ranked cards list */}
            <div className="space-y-4">
              {top5Manga.length === 0 ? (
                <p className="text-sm text-zinc-500 py-6">No top all-time manga found.</p>
              ) : (
                top5Manga.map((manga, idx) => {
                  const rank = idx + 1;
                  // Resolve chapter count from chaptersCount or lastChapter fallback
                  const parsedLastCh = manga.lastChapter ? parseInt(manga.lastChapter, 10) : NaN;
                  const chaptersCount = manga.chaptersCount || (!isNaN(parsedLastCh) ? parsedLastCh : 120);
                  
                  return (
                    <Link
                      href={`/manga/${manga.sourceId}`}
                      key={manga.sourceId}
                      className="group flex gap-2.5 p-2 border-2 border-zinc-950 hover:bg-[#CC0000]/5 transition-colors animate-fade-in"
                    >
                      {/* Rank indicator */}
                      <div className="w-9 h-9 flex items-center justify-center border-2 border-zinc-950 bg-white font-bebas text-lg font-black text-[#CC0000] shadow-[1px_1px_0px_#000] shrink-0 group-hover:scale-105 transition-transform">
                        #{rank}
                      </div>

                      {/* Title, rating, artist */}
                      <div className="flex-grow min-w-0 flex flex-col justify-center">
                        <h4 className="font-bebas text-base font-bold tracking-wider text-zinc-950 truncate group-hover:text-[#CC0000] transition-colors leading-none mb-1">
                          {manga.title.toUpperCase()}
                        </h4>
                        <p className="text-[10px] text-zinc-500 font-sans truncate mb-1">
                          by {manga.author || "Unknown"}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-700">
                          <span className="bg-zinc-100 border border-zinc-300 px-1 py-0.2 shrink-0 font-extrabold" style={{ color: "var(--theme-primary)" }}>
                            {chaptersCount} CH.
                          </span>
                          <span className="text-[#CC0000] shrink-0">★ {typeof manga.rating === 'number' ? manga.rating.toFixed(1) : (manga.rating || "8.5")}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
