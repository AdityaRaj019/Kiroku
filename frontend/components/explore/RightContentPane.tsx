"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MangaCard, MangaData } from "./MangaCard";
import { Flame, Award, Calendar, Grid2X2, Loader2, BookOpen } from "lucide-react";

// Mock Manga Datasets for Trending feeds based on Time Filter Tabs (Day, Month, Year)
const TRENDING_BY_TIME: Record<string, MangaData[]> = {
  day: [
    {
      sourceId: "a1c7c817-e785-4ef0-9938-f0d58a1f1fcf",
      title: "Chainsaw Man",
      coverUrl: "https://uploads.mangadex.org/covers/a1c7c817-e785-4ef0-9938-f0d58a1f1fcf/354a3275-d146-4447-b895-cd91d5757d54.jpg",
      author: "Tatsuki Fujimoto",
      status: "ongoing",
      rating: "8.8",
      chaptersCount: 168,
      demographicTag: "shonen"
    },
    {
      sourceId: "c24f60cc-1725-412d-965a-fa637f90e599",
      title: "Oshi no Ko",
      coverUrl: "https://uploads.mangadex.org/covers/c24f60cc-1725-412d-965a-fa637f90e599/d8a2eb83-059d-4767-bc18-2e061807353f.jpg",
      author: "Aka Akasaka",
      status: "ongoing",
      rating: "8.4",
      chaptersCount: 152,
      demographicTag: "seinen"
    },
    {
      sourceId: "47bda6a4-cd8d-4ee6-857e-77d6118d0426",
      title: "Kaiju No. 8",
      coverUrl: "https://uploads.mangadex.org/covers/47bda6a4-cd8d-4ee6-857e-77d6118d0426/a07b7134-2e91-4fd5-8a2b-65c26af32759.jpg",
      author: "Naoya Matsumoto",
      status: "ongoing",
      rating: "7.9",
      chaptersCount: 112,
      demographicTag: "shonen"
    },
    {
      sourceId: "3e0c0363-2287-47b2-ad06-d7a8d1326462",
      title: "Spy x Family",
      coverUrl: "https://uploads.mangadex.org/covers/3e0c0363-2287-47b2-ad06-d7a8d1326462/5c0d2979-4a94-4df1-bd93-1383794b15bb.png",
      author: "Tatsuya Endo",
      status: "ongoing",
      rating: "8.6",
      chaptersCount: 98,
      demographicTag: "shonen"
    }
  ],
  month: [
    {
      sourceId: "d8a959f7-648e-4c8d-8f23-f1f3f22d869f",
      title: "Jujutsu Kaisen",
      coverUrl: "https://uploads.mangadex.org/covers/c527605b-b16a-4ee9-8fba-99d8e74e8350/20349141-5df7-4cc9-96fc-d6b7b6c507a2.jpg",
      author: "Gege Akutami",
      status: "completed",
      rating: "8.7",
      chaptersCount: 271,
      demographicTag: "shonen"
    },
    {
      sourceId: "a1c7c817-e785-4ef0-9938-f0d58a1f1fcf",
      title: "Chainsaw Man",
      coverUrl: "https://uploads.mangadex.org/covers/a1c7c817-e785-4ef0-9938-f0d58a1f1fcf/354a3275-d146-4447-b895-cd91d5757d54.jpg",
      author: "Tatsuki Fujimoto",
      status: "ongoing",
      rating: "8.8",
      chaptersCount: 168,
      demographicTag: "shonen"
    },
    {
      sourceId: "17247fa4-ca01-4475-8167-96a8473de0fb",
      title: "Solo Leveling",
      coverUrl: "https://uploads.mangadex.org/covers/321e4242-2d1e-4fd2-8b61-4c6ecda0c4be/141e6e0d-b45d-4f76-905e-88ebf27914f6.jpg",
      author: "Chugong",
      status: "completed",
      rating: "8.9",
      chaptersCount: 179,
      demographicTag: "shonen"
    },
    {
      sourceId: "e9f0d116-c953-481d-91b4-7d5a525d8869",
      title: "Dandadan",
      coverUrl: "https://uploads.mangadex.org/covers/ae4ca1f2-17aa-4252-9442-de74dbf77c38/200508a8-cb35-44bd-9c02-f6735a29792c.jpg",
      author: "Yukinobu Tatsu",
      status: "ongoing",
      rating: "8.7",
      chaptersCount: 155,
      demographicTag: "shonen"
    }
  ],
  year: [
    {
      sourceId: "80150b51-7271-4699-bc4c-2231c6d3de88",
      title: "One Piece",
      coverUrl: "https://uploads.mangadex.org/covers/a1c7c817-e785-4ef0-9938-f0d58a1f1fcf/354a3275-d146-4447-b895-cd91d5757d54.jpg",
      author: "Eiichiro Oda",
      status: "ongoing",
      rating: "9.2",
      chaptersCount: 1115,
      demographicTag: "shonen"
    },
    {
      sourceId: "d8a959f7-648e-4c8d-8f23-f1f3f22d869f",
      title: "Jujutsu Kaisen",
      coverUrl: "https://uploads.mangadex.org/covers/c527605b-b16a-4ee9-8fba-99d8e74e8350/20349141-5df7-4cc9-96fc-d6b7b6c507a2.jpg",
      author: "Gege Akutami",
      status: "completed",
      rating: "8.7",
      chaptersCount: 271,
      demographicTag: "shonen"
    },
    {
      sourceId: "b887b8d4-5390-48fc-bdf7-e6f6634d0b13",
      title: "Sakamoto Days",
      coverUrl: "https://uploads.mangadex.org/covers/6f414434-72de-4e3a-b85f-82ff5cf0383a/c615a1a1-9a74-4b53-a5c2-1e9bf4c06df9.jpg",
      author: "Yuto Suzuki",
      status: "ongoing",
      rating: "8.6",
      chaptersCount: 172,
      demographicTag: "shonen"
    },
    {
      sourceId: "77cd5209-cb25-47e0-bc84-9dbb5f939e6a",
      title: "Frieren: Beyond Journey's End",
      coverUrl: "https://uploads.mangadex.org/covers/b0b721ff-c388-4486-aa0f-ee00bb4e50b2/30438cf9-c88c-4a3d-a517-84dc2d3e421f.jpg",
      author: "Kanehito Yamada",
      status: "ongoing",
      rating: "9.1",
      chaptersCount: 130,
      demographicTag: "shonen"
    }
  ]
};

// Mock Top 5 All-Time list with bold crimson ranks
const TOP_5_ALL_TIME: MangaData[] = [
  {
    sourceId: "2c8646b9-930a-48f5-ab9f-72c050a41d99",
    title: "Berserk",
    author: "Kentaro Miura",
    status: "ongoing",
    rating: "9.4",
    chaptersCount: 376,
    demographicTag: "seinen",
    coverUrl: "https://uploads.mangadex.org/covers/803c5b52-7adb-48e0-bad1-c9171f64f434/41f4d9c7-7429-45e0-b6a4-fdf69b0fa8a0.jpg"
  },
  {
    sourceId: "80150b51-7271-4699-bc4c-2231c6d3de88",
    title: "One Piece",
    author: "Eiichiro Oda",
    status: "ongoing",
    rating: "9.2",
    chaptersCount: 1115,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/a1c7c817-e785-4ef0-9938-f0d58a1f1fcf/354a3275-d146-4447-b895-cd91d5757d54.jpg"
  },
  {
    sourceId: "77cd5209-cb25-47e0-bc84-9dbb5f939e6a",
    title: "Frieren: Beyond Journey's End",
    author: "Kanehito Yamada",
    status: "ongoing",
    rating: "9.1",
    chaptersCount: 130,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/b0b721ff-c388-4486-aa0f-ee00bb4e50b2/30438cf9-c88c-4a3d-a517-84dc2d3e421f.jpg"
  },
  {
    sourceId: "931215b3-3a5f-4a00-98ff-8a3d13264622",
    title: "Vagabond",
    author: "Takehiko Inoue",
    status: "hiatus",
    rating: "9.1",
    chaptersCount: 327,
    demographicTag: "seinen",
    coverUrl: "https://uploads.mangadex.org/covers/2e38c2c6-3d60-4965-9856-787fe9e992b4/fcead9d5-7313-431f-bc80-b2be88dd33bc.jpg"
  },
  {
    sourceId: "a526601b-c953-481d-91b4-7d5a525d8869",
    title: "Monster",
    author: "Naoki Urasawa",
    status: "completed",
    rating: "9.0",
    chaptersCount: 162,
    demographicTag: "seinen",
    coverUrl: "https://uploads.mangadex.org/covers/8d8b2d18-97c7-4977-bc60-9118e77a11eb/fce9beeb-ee4c-473d-82d8-500b3e606cd0.png"
  }
];

// Mock Top 20 Highly Rated Grid items
const TOP_20_HIGHLY_RATED: MangaData[] = [
  {
    sourceId: "2c8646b9-930a-48f5-ab9f-72c050a41d99",
    title: "Berserk",
    author: "Kentaro Miura",
    status: "ongoing",
    rating: "9.4",
    chaptersCount: 376,
    demographicTag: "seinen",
    coverUrl: "https://uploads.mangadex.org/covers/803c5b52-7adb-48e0-bad1-c9171f64f434/41f4d9c7-7429-45e0-b6a4-fdf69b0fa8a0.jpg"
  },
  {
    sourceId: "80150b51-7271-4699-bc4c-2231c6d3de88",
    title: "One Piece",
    author: "Eiichiro Oda",
    status: "ongoing",
    rating: "9.2",
    chaptersCount: 1115,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/a1c7c817-e785-4ef0-9938-f0d58a1f1fcf/354a3275-d146-4447-b895-cd91d5757d54.jpg"
  },
  {
    sourceId: "77cd5209-cb25-47e0-bc84-9dbb5f939e6a",
    title: "Frieren: Beyond Journey's End",
    author: "Kanehito Yamada",
    status: "ongoing",
    rating: "9.1",
    chaptersCount: 130,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/b0b721ff-c388-4486-aa0f-ee00bb4e50b2/30438cf9-c88c-4a3d-a517-84dc2d3e421f.jpg"
  },
  {
    sourceId: "931215b3-3a5f-4a00-98ff-8a3d13264622",
    title: "Vagabond",
    author: "Takehiko Inoue",
    status: "hiatus",
    rating: "9.1",
    chaptersCount: 327,
    demographicTag: "seinen",
    coverUrl: "https://uploads.mangadex.org/covers/2e38c2c6-3d60-4965-9856-787fe9e992b4/fcead9d5-7313-431f-bc80-b2be88dd33bc.jpg"
  },
  {
    sourceId: "a526601b-c953-481d-91b4-7d5a525d8869",
    title: "Monster",
    author: "Naoki Urasawa",
    status: "completed",
    rating: "9.0",
    chaptersCount: 162,
    demographicTag: "seinen",
    coverUrl: "https://uploads.mangadex.org/covers/8d8b2d18-97c7-4977-bc60-9118e77a11eb/fce9beeb-ee4c-473d-82d8-500b3e606cd0.png"
  },
  {
    sourceId: "291e4242-2d1e-4fd2-8b61-4c6ecda0c4be",
    title: "Fullmetal Alchemist",
    author: "Hiromu Arakawa",
    status: "completed",
    rating: "8.9",
    chaptersCount: 108,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/e9b8893d-d552-446f-a64e-b08953188849/fcead9d5-7313-431f-bc80-b2be88dd33bc.jpg"
  },
  {
    sourceId: "17247fa4-ca01-4475-8167-96a8473de0fb",
    title: "Solo Leveling",
    author: "Chugong",
    status: "completed",
    rating: "8.9",
    chaptersCount: 179,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/321e4242-2d1e-4fd2-8b61-4c6ecda0c4be/141e6e0d-b45d-4f76-905e-88ebf27914f6.jpg"
  },
  {
    sourceId: "a1c7c817-e785-4ef0-9938-f0d58a1f1fcf",
    title: "Chainsaw Man",
    author: "Tatsuki Fujimoto",
    status: "ongoing",
    rating: "8.8",
    chaptersCount: 168,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/a1c7c817-e785-4ef0-9938-f0d58a1f1fcf/354a3275-d146-4447-b895-cd91d5757d54.jpg"
  },
  {
    sourceId: "d8a959f7-648e-4c8d-8f23-f1f3f22d869f",
    title: "Jujutsu Kaisen",
    author: "Gege Akutami",
    status: "completed",
    rating: "8.7",
    chaptersCount: 271,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/c527605b-b16a-4ee9-8fba-99d8e74e8350/20349141-5df7-4cc9-96fc-d6b7b6c507a2.jpg"
  },
  {
    sourceId: "e9f0d116-c953-481d-91b4-7d5a525d8869",
    title: "Dandadan",
    author: "Yukinobu Tatsu",
    status: "ongoing",
    rating: "8.7",
    chaptersCount: 155,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/ae4ca1f2-17aa-4252-9442-de74dbf77c38/200508a8-cb35-44bd-9c02-f6735a29792c.jpg"
  },
  {
    sourceId: "b887b8d4-5390-48fc-bdf7-e6f6634d0b13",
    title: "Sakamoto Days",
    author: "Yuto Suzuki",
    status: "ongoing",
    rating: "8.6",
    chaptersCount: 172,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/6f414434-72de-4e3a-b85f-82ff5cf0383a/c615a1a1-9a74-4b53-a5c2-1e9bf4c06df9.jpg"
  },
  {
    sourceId: "3e0c0363-2287-47b2-ad06-d7a8d1326462",
    title: "Spy x Family",
    author: "Tatsuya Endo",
    status: "ongoing",
    rating: "8.6",
    chaptersCount: 98,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/3e0c0363-2287-47b2-ad06-d7a8d1326462/5c0d2979-4a94-4df1-bd93-1383794b15bb.png"
  },
  {
    sourceId: "e9f0d116-c953-481d-91b4-7d5a525d8870",
    title: "Vinland Saga",
    author: "Makoto Yukimura",
    status: "ongoing",
    rating: "9.0",
    chaptersCount: 210,
    demographicTag: "seinen",
    coverUrl: "https://uploads.mangadex.org/covers/a64f52fa-ca01-4475-8167-96a8473de0fb/fcead9d5-7313-431f-bc80-b2be88dd33bc.jpg"
  },
  {
    sourceId: "2c8646b9-930a-48f5-ab9f-72c050a41da1",
    title: "Death Note",
    author: "Tsugumi Ohba",
    status: "completed",
    rating: "8.8",
    chaptersCount: 108,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/b526601b-c953-481d-91b4-7d5a525d8869/fcead9d5-7313-431f-bc80-b2be88dd33bc.jpg"
  },
  {
    sourceId: "c24f60cc-1725-412d-965a-fa637f90e599",
    title: "Oshi no Ko",
    author: "Aka Akasaka",
    status: "ongoing",
    rating: "8.4",
    chaptersCount: 152,
    demographicTag: "seinen",
    coverUrl: "https://uploads.mangadex.org/covers/c24f60cc-1725-412d-965a-fa637f90e599/d8a2eb83-059d-4767-bc18-2e061807353f.jpg"
  },
  {
    sourceId: "47bda6a4-cd8d-4ee6-857e-77d6118d0426",
    title: "Kaiju No. 8",
    author: "Naoya Matsumoto",
    status: "ongoing",
    rating: "7.9",
    chaptersCount: 112,
    demographicTag: "shonen",
    coverUrl: "https://uploads.mangadex.org/covers/47bda6a4-cd8d-4ee6-857e-77d6118d0426/a07b7134-2e91-4fd5-8a2b-65c26af32759.jpg"
  }
];

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

  const trendingManga = TRENDING_BY_TIME[timeFilter] || [];

  return (
    <div className="space-y-12">
      {isSearchActive ? (
        /* Search Results Content Block */
        <div className="bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000]">
          <div className="flex items-center justify-between pb-4 border-b-2 border-zinc-950 mb-6">
            <h2 className="font-bebas text-2xl font-bold tracking-wider text-zinc-950 flex items-center gap-2">
              <Grid2X2 className="w-5 h-5 text-[#CC0000]" />
              <span>SEARCH RESULTS FOR &quot;{searchQuery.toUpperCase()}&quot;</span>
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
                No results matched your search. Try searching for popular titles like &quot;Chainsaw Man&quot; or &quot;One Piece&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((manga) => (
                <MangaCard key={manga.sourceId} manga={manga} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Default Discovery Feed blocks */
        <>
          {/* Grid Layout: Left col is Trending (scroll row) + Top 20; Right col is Top 5 (all-time) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col (8/12 width): Trending & Time Filter Tabs */}
            <div className="lg:col-span-8 space-y-10">
              
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
                        className={`px-3 py-1 font-bebas text-sm font-bold tracking-widest transition-all ${
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
                  {trendingManga.map((manga) => (
                    <div key={manga.sourceId} className="w-56 shrink-0">
                      <MangaCard manga={manga} />
                    </div>
                  ))}
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
                  {TOP_20_HIGHLY_RATED.map((manga) => (
                    <MangaCard key={manga.sourceId} manga={manga} />
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col (4/12 width): Top 5 All-Time List */}
            <div className="lg:col-span-4">
              <div className="bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000] sticky top-24">
                <div className="flex items-center gap-2 pb-4 border-b-2 border-zinc-950 mb-6">
                  <Award className="w-5 h-5 text-[#CC0000]" />
                  <h2 className="font-bebas text-2xl font-bold tracking-wider text-zinc-950">
                    TOP 5 ALL-TIME
                  </h2>
                </div>

                {/* Vertical ranked cards list */}
                <div className="space-y-4">
                  {TOP_5_ALL_TIME.map((manga, idx) => {
                    const rank = idx + 1;
                    return (
                      <Link
                        href={`/manga/${manga.sourceId}`}
                        key={manga.sourceId}
                        className="group flex gap-3 p-3 border-2 border-zinc-950 hover:bg-[#CC0000]/5 transition-colors"
                      >
                        {/* Rank indicator */}
                        <div className="w-12 h-12 flex items-center justify-center border-4 border-zinc-950 bg-white font-bebas text-2xl font-black text-[#CC0000] shadow-[2px_2px_0px_#000] shrink-0 group-hover:scale-105 transition-transform">
                          #{rank}
                        </div>

                        {/* Title, rating, artist */}
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bebas text-lg font-bold tracking-wider text-zinc-950 truncate group-hover:text-[#CC0000] transition-colors leading-none mb-1">
                            {manga.title.toUpperCase()}
                          </h4>
                          <p className="text-[11px] text-zinc-500 font-sans truncate mb-1">
                            by {manga.author}
                          </p>
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-700">
                            <span className="bg-zinc-100 border border-zinc-300 px-1 py-0.2 shrink-0">
                              {manga.chaptersCount} CH.
                            </span>
                            <span className="text-[#CC0000]">★ {manga.rating}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
