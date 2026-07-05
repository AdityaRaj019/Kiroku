"use client";

import React from "react";
import { Calendar, Heart, Shield, Star, Tag } from "lucide-react";

interface MangaTag {
  id: string;
  name: string;
  group?: string;
}

interface MetadataPanelProps {
  status: string;
  year: number | null | undefined;
  demographicTag: string | null | undefined;
  rating: string | number;
  followsCount: number;
  tags: MangaTag[];
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({
  status,
  year,
  demographicTag,
  rating,
  followsCount,
  tags,
}) => {
  const displayRating = typeof rating === "number" ? rating.toFixed(1) : rating || "8.5";

  return (
    <div className="w-full bg-white border-4 border-zinc-950 p-4 shadow-[4px_4px_0px_#000] space-y-4">
      <h3 className="font-bebas text-xl font-bold tracking-wider text-zinc-950 border-b-4 border-zinc-950 pb-2 uppercase">
        Manga Details
      </h3>

      {/* Grid of Core Metadata */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold text-zinc-800">
        
        {/* Status */}
        <div className="flex items-center gap-2 p-2 border-2 border-zinc-950 bg-zinc-50">
          <Shield className="w-4 h-4 text-[#CC0000] shrink-0" />
          <div className="truncate">
            <div className="text-[10px] text-zinc-500 uppercase leading-none mb-0.5">Status</div>
            <span className="uppercase">{status || "Unknown"}</span>
          </div>
        </div>

        {/* Released Year */}
        <div className="flex items-center gap-2 p-2 border-2 border-zinc-950 bg-zinc-50">
          <Calendar className="w-4 h-4 text-[#CC0000] shrink-0" />
          <div className="truncate">
            <div className="text-[10px] text-zinc-500 uppercase leading-none mb-0.5">Released</div>
            <span>{year || "N/A"}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 p-2 border-2 border-zinc-950 bg-zinc-50">
          <Star className="w-4 h-4 text-[#CC0000] fill-[#CC0000] shrink-0" />
          <div className="truncate">
            <div className="text-[10px] text-zinc-500 uppercase leading-none mb-0.5">Rating</div>
            <span>{displayRating} / 10</span>
          </div>
        </div>

        {/* Popularity/Followers */}
        <div className="flex items-center gap-2 p-2 border-2 border-zinc-950 bg-zinc-50">
          <Heart className="w-4 h-4 text-[#CC0000] fill-[#CC0000] shrink-0" />
          <div className="truncate">
            <div className="text-[10px] text-zinc-500 uppercase leading-none mb-0.5">Followers</div>
            <span>{followsCount?.toLocaleString() || "0"}</span>
          </div>
        </div>

      </div>

      {/* Demographics Banner */}
      {demographicTag && (
        <div className="flex items-center justify-between p-2 border-2 border-zinc-950 bg-zinc-950 text-white font-bebas text-sm tracking-wider uppercase">
          <span>Target Demographic</span>
          <span className="text-[#FFD700] font-extrabold">{demographicTag}</span>
        </div>
      )}

      {/* Tags Cloud */}
      <div className="space-y-2">
        <h4 className="font-bebas text-sm tracking-wider text-zinc-950 flex items-center gap-1.5 uppercase font-bold">
          <Tag className="w-3.5 h-3.5" style={{ color: "var(--theme-primary)" }} />
          Genres & Themes
        </h4>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-zinc-100 hover:bg-[#CC0000] hover:text-white border-2 border-zinc-950 px-2 py-0.5 text-[10px] font-sans font-bold uppercase transition-colors select-none shrink-0"
              >
                {tag.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-zinc-500 font-sans font-medium">No genre tags available.</span>
          )}
        </div>
      </div>
    </div>
  );
};
