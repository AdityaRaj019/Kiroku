"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { apiFetch } from "@/utils/api";
import { getMangaEnrichedDetails } from "@/utils/mangaDetailsEnricher";
import { HeaderSection } from "./HeaderSection";
import { TrackingPanel } from "./TrackingPanel";
import { MetadataPanel } from "./MetadataPanel";
import { CharactersPanel } from "./CharactersPanel";
import { StaffPanel } from "./StaffPanel";
import { StatsPanel } from "./StatsPanel";
import { SocialPanel } from "./SocialPanel";
import { ArrowLeft, Loader2, Quote } from "lucide-react";

interface MangaTag {
  id: string;
  name: string;
}

interface MangaDetailsData {
  id: number;
  sourceId: string;
  title: string;
  coverUrl: string | null;
  synopsis: string | null;
  author: string | null;
  artist: string | null;
  status: string;
  year: number | null;
  rating: string | number;
  followsCount: number;
  chaptersCount: number;
  tags: MangaTag[];
  demographicTag: string | null;
}

interface TrackingData {
  isFollowing: boolean;
  libraryItemId: number | null;
  status: string | null;
  lastReadChapter: string | null;
  followedAt: string | null;
}

interface ApiResponse {
  data: MangaDetailsData;
  tracking: TrackingData | null;
}

interface MangaDetailsViewProps {
  mangaId: string;
}

export const MangaDetailsView: React.FC<MangaDetailsViewProps> = ({ mangaId }) => {
  // Fetch details & optional user tracking state
  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["mangaDetails", mangaId],
    queryFn: async () => {
      const res = await apiFetch(`/manga/${mangaId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch manga details");
      }
      return res.json();
    },
  });

  const manga = responseData?.data;
  const tracking = responseData?.tracking ?? null;

  // Enrich details (characters, quotes, comments, mottos)
  const enriched = useMemo(() => {
    if (!manga) return null;
    return getMangaEnrichedDetails(manga.sourceId, manga.title);
  }, [manga]);

  const displayCover = manga?.coverUrl || "/images/manga_cover_generic.png";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-4 font-sans text-zinc-950">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 border-4 border-[#CC0000] border-t-transparent rounded-full animate-spin" />
          <div className="absolute w-10 h-10 border-4 border-zinc-950 border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse" }} />
        </div>
        <p className="font-bebas text-xl tracking-widest text-[#CC0000] uppercase animate-pulse">
          Loading Manga Details...
        </p>
      </div>
    );
  }

  if (isError || !manga || !enriched) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-zinc-950 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <div className="border-4 border-zinc-950 bg-white p-6 shadow-[6px_6px_0px_#000] space-y-4">
            <h1 className="font-bebas text-3xl font-black text-[#CC0000] tracking-wider uppercase">
              Manga Not Found
            </h1>
            <p className="text-sm text-zinc-600 font-sans font-semibold">
              {error instanceof Error ? error.message : "The requested manga details could not be loaded."}
            </p>
            <Link
              href="/manga"
              className="inline-flex items-center gap-2 bg-[#CC0000] text-white border-2 border-zinc-950 px-4 py-2 font-bebas text-sm tracking-wider shadow-[2px_2px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="manga-theme-scope min-h-screen bg-[#FAF9F6] text-zinc-950 flex flex-col font-sans transition-all duration-300 relative overflow-hidden">
      {/* Floating Theme Selector Button & Style Scope */}
      <ThemeSelector scopeClass="manga-theme-scope" />

      {/* Global Page Blur Backdrop Image */}
      <div 
        className="absolute top-0 left-0 right-0 h-[600px] bg-cover bg-center filter blur-3xl opacity-10 pointer-events-none scale-105"
        style={{ backgroundImage: `url(${displayCover})` }}
      />
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-transparent to-[#FAF9F6] pointer-events-none" />

      <Navbar />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 md:px-8 relative z-10">
        
        {/* Back navigation line */}
        <div className="mb-4">
          <Link
            href="/manga"
            className="inline-flex items-center gap-1.5 font-bebas text-sm font-bold text-zinc-600 hover:text-[#CC0000] transition-colors uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Catalog
          </Link>
        </div>

        {/* Top Motto Quote Line */}
        {enriched.motto && (
          <div className="mb-6 bg-zinc-950 text-[#FFD700] py-2.5 px-6 border-4 border-zinc-950 shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2">
            <Quote className="w-4 h-4 fill-[#CC0000] text-[#CC0000] shrink-0" />
            <p className="font-bebas text-md md:text-lg tracking-widest uppercase text-center font-extrabold italic truncate max-w-4xl">
              &ldquo;{enriched.motto}&rdquo;
            </p>
          </div>
        )}

        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (circle cover image, track, tags/metadata) - span 4 */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 z-20 space-y-6 flex flex-col items-center md:items-stretch">
            
            {/* Circle Cover Card */}
            <div className="bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000] flex flex-col items-center w-full">
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-zinc-950 overflow-hidden shadow-[4px_4px_0px_#000] shrink-0 bg-zinc-100 flex-none group mb-6">
                <Image
                  src={displayCover}
                  alt={manga.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-w-768px) 192px, 224px"
                  priority
                  unoptimized={displayCover.startsWith("http")}
                />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(204,0,0,0.08)_1.5px,transparent_0)] bg-[size:8px_8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Title under cover on mobile, or metadata identifier */}
              <h2 className="font-bebas text-2xl font-black text-center text-zinc-950 tracking-wider uppercase mb-1 line-clamp-2 md:hidden">
                {manga.title}
              </h2>

              {/* Follow / Track Button */}
              <TrackingPanel
                mangaId={manga.sourceId}
                tracking={tracking}
                totalChapters={manga.chaptersCount}
              />
            </div>

            {/* Tags / Metadata Panel */}
            <MetadataPanel
              status={manga.status}
              year={manga.year}
              demographicTag={manga.demographicTag}
              rating={manga.rating}
              followsCount={manga.followsCount}
              tags={manga.tags}
            />

          </div>

          {/* Right Column (Title, Description, Characters, Staff, Stats) - span 8 */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Synopsis Card */}
            <div className="bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000] relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1/4 bg-[radial-gradient(rgba(204,0,0,0.04)_1.5px,transparent_0)] bg-[size:10px_10px] pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div>
                  <span className="bg-[#CC0000] text-white font-bebas text-xs font-bold tracking-widest px-2 py-0.5 border-2 border-zinc-950 shadow-[1.5px_1.5px_0px_#000] uppercase">
                    Manga Pulse Catalog
                  </span>
                  <h1 className="font-bebas text-3xl md:text-5xl font-black tracking-wider text-zinc-950 uppercase mt-2 mb-1">
                    {manga.title}
                  </h1>
                  {manga.author && (
                    <p className="text-xs font-mono font-bold text-zinc-500">
                      Story & Art by <span className="text-[#CC0000] uppercase">{manga.author}</span>
                    </p>
                  )}
                </div>

                <div className="border-t-2 border-dashed border-zinc-200 pt-3">
                  <h3 className="font-bebas text-md tracking-wider text-zinc-950 uppercase font-bold mb-1.5">
                    Synopsis
                  </h3>
                  <p className="text-sm text-zinc-700 leading-relaxed font-sans font-medium text-justify">
                    {manga.synopsis || "No synopsis available."}
                  </p>
                </div>
              </div>
            </div>

            {/* Characters Panel */}
            <CharactersPanel characters={enriched.characters} />

            {/* Staff Panel */}
            <StaffPanel staff={enriched.staff} />

            {/* Stats Panel */}
            <StatsPanel stats={enriched.stats} totalChapters={manga.chaptersCount} />

          </div>

        </div>

        {/* Social Comment Section (Full Width Bottom) */}
        <div className="mt-8">
          <SocialPanel comments={enriched.comments} />
        </div>

      </main>

      <Footer />
    </div>
  );
};
export default MangaDetailsView;
