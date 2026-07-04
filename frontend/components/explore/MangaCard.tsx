"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, BookOpen, User } from "lucide-react";

export interface MangaData {
  sourceId: string;
  localId?: number | null;
  title: string;
  synopsis?: string | null;
  coverUrl?: string | null;
  author?: string | null;
  status: string;
  year?: number | null;
  rating?: string | number;
  chaptersCount?: number;
  lastChapter?: string | null;
  tags?: Array<{ id: string; name: string }>;
  demographicTag?: string | null;
}

interface MangaCardProps {
  manga: MangaData;
  priority?: boolean;
}

export const MangaCard: React.FC<MangaCardProps> = ({ manga, priority = false }) => {
  const {
    sourceId,
    title,
    coverUrl,
    author,
    status,
    rating = "8.5",
    demographicTag,
  } = manga;

  // Resolve chapter count from chaptersCount or lastChapter fallback
  const parsedLastCh = manga.lastChapter ? parseInt(manga.lastChapter, 10) : NaN;
  const chaptersCount = manga.chaptersCount || (!isNaN(parsedLastCh) ? parsedLastCh : 120);

  const displayCover = coverUrl || "/images/manga_cover_generic.png";

  return (
    <Link href={`/manga/${sourceId}`} className="block group">
      <div className="bg-white border-4 border-zinc-950 p-3 flex flex-col h-full shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200">
        
        {/* Cover Image Wrapper */}
        <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-zinc-950 bg-zinc-100 mb-3">
          <Image
            src={displayCover}
            alt={title}
            fill
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            unoptimized={displayCover.startsWith("http")} // prevent next/image build errors for dynamic external hosts if domains are not in config
          />

          {/* Halftone Screentone Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(204,0,0,0.12)_1.5px,transparent_0)] bg-[size:8px_8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 right-2 z-10 flex flex-wrap gap-1.5 pointer-events-none">
            <span className="bg-white border-2 border-zinc-950 px-1.5 py-0.5 text-[9px] font-bold font-sans tracking-wider uppercase shadow-[1px_1px_0px_#000] pointer-events-auto shrink-0">
              {status}
            </span>
            {demographicTag && (
              <span className="bg-[#CC0000] text-white border-2 border-zinc-950 px-1.5 py-0.5 text-[9px] font-bold font-sans tracking-wider uppercase shadow-[1px_1px_0px_#000] pointer-events-auto shrink-0">
                {demographicTag}
              </span>
            )}
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-2 right-2 z-10 bg-white border-2 border-zinc-950 px-2 py-0.5 text-xs font-bold font-mono flex items-center gap-1 shadow-[2px_2px_0px_#000]">
            <span>{typeof rating === "number" ? rating.toFixed(1) : rating}</span>
            <Star className="w-3.5 h-3.5 fill-[#CC0000] text-[#CC0000]" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow flex flex-col">
          <h3 className="font-bebas text-lg md:text-xl font-bold tracking-wider text-zinc-950 leading-tight group-hover:text-[#CC0000] transition-colors truncate uppercase mb-1">
            {title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-2 font-sans truncate">
            <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{author || "Unknown Artist"}</span>
          </div>

          <div className="mt-auto pt-2 border-t-2 border-dashed border-zinc-200 flex items-center justify-between text-zinc-700">
            <div className="flex items-center gap-1 text-xs font-bold font-mono">
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-950">{chaptersCount} Ch.</span>
            </div>
            
            <span className="font-bebas text-xs font-bold tracking-widest text-[#CC0000] group-hover:translate-x-1 transition-transform uppercase">
              CONTINUE →
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
};
