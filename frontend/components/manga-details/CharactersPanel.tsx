"use client";

import React from "react";
import Image from "next/image";
import { MessageSquareCode, Users } from "lucide-react";
import { Character } from "@/utils/mangaDetailsEnricher";

interface CharactersPanelProps {
  characters: Character[];
  isLoading?: boolean;
}

export const CharactersPanel: React.FC<CharactersPanelProps> = ({ characters, isLoading = false }) => {
  return (
    <div className="w-full bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000] space-y-5">
      
      {/* Header */}
      <h2 className="font-bebas text-2xl md:text-3xl font-black tracking-wider text-zinc-950 border-b-4 border-zinc-950 pb-3 uppercase flex items-center gap-2">
        <Users className="w-6 h-6 shrink-0" style={{ color: "var(--theme-primary)" }} />
        Characters
      </h2>

      {/* Characters List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-zinc-50 border-4 border-zinc-950 p-3.5 flex gap-4 shadow-[4px_4px_0px_#000] animate-pulse"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-zinc-950 bg-zinc-200 shrink-0" />
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="h-3 w-16 bg-zinc-300 mb-2" />
                  <div className="h-5 w-32 bg-zinc-300" />
                </div>
                <div className="h-8 w-full bg-zinc-200 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : characters && characters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characters.map((char, idx) => {
            const isMain = char.role === "Main Character";
            
            return (
              <div
                key={`${char.name}-${idx}`}
                className="bg-zinc-50 border-4 border-zinc-950 p-3.5 flex gap-4 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Square Image Box */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 border-2 border-zinc-950 shrink-0 bg-zinc-100 overflow-hidden flex items-center justify-center">
                  {char.image && !char.image.includes("default.jpg") && !char.image.includes("default.png") ? (
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className="object-cover"
                      sizes="(max-w-768px) 80px, 96px"
                      unoptimized={char.image.startsWith("http")}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">
                      <Users className="w-10 h-10" />
                    </div>
                  )}
                  {/* Screentone layout */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(204,0,0,0.06)_1.5px,transparent_0)] bg-[size:6px_6px] pointer-events-none" />
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col justify-between min-w-0">
                  <div>
                    {/* Role Badge & Name */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span
                        className={`text-[9px] font-bold font-mono tracking-wide uppercase px-1.5 py-0.2 border border-zinc-950 shrink-0 shadow-[1px_1px_0px_#000] ${
                          isMain
                            ? "bg-[#CC0000] text-white"
                            : "bg-zinc-200 text-zinc-800"
                        }`}
                      >
                        {char.role}
                      </span>
                    </div>
                    <h3 className="font-bebas text-lg md:text-xl font-bold tracking-wider text-zinc-950 truncate uppercase leading-tight">
                      {char.name}
                    </h3>
                  </div>

                  {/* Character Quote */}
                  {char.quote && (
                    <div className="mt-2 text-xs font-mono text-zinc-600 bg-white border border-dashed border-zinc-300 p-2 flex items-start gap-1.5 italic">
                      <MessageSquareCode className="w-3.5 h-3.5 text-[#CC0000] shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed">
                        &ldquo;{char.quote}&rdquo;
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm font-sans font-medium text-zinc-500 py-4 text-center">
          No character profiles available.
        </p>
      )}

    </div>
  );
};
