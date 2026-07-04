"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Settings, X, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/utils/api";
import Image from "next/image";
import { MangaData } from "./MangaCard";

export interface FilterState {
  search: string;
  genre: string;
  status: string;
  language: string;
  minChapters: number;
  maxChapters: number;
}

interface LeftFilterPanelProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
}

const POPULAR_GENRES = [
  { value: "", label: "ALL GENRES" },
  { value: "action", label: "ACTION" },
  { value: "adventure", label: "ADVENTURE" },
  { value: "comedy", label: "COMEDY" },
  { value: "drama", label: "DRAMA" },
  { value: "fantasy", label: "FANTASY" },
  { value: "romance", label: "ROMANCE" },
  { value: "sci-fi", label: "SCI-FI" },
  { value: "slice-of-life", label: "SLICE OF LIFE" },
  { value: "thriller", label: "THRILLER" },
  { value: "supernatural", label: "SUPERNATURAL" },
];

const LANGUAGES = [
  { value: "", label: "ANY LANGUAGE" },
  { value: "ja", label: "JAPANESE (JA)" },
  { value: "ko", label: "KOREAN (KO)" },
  { value: "zh", label: "CHINESE (ZH)" },
  { value: "en", label: "ENGLISH (EN)" },
];

const STATUS_OPTIONS = [
  { value: "", label: "ANY STATUS" },
  { value: "ongoing", label: "ONGOING" },
  { value: "completed", label: "COMPLETED" },
  { value: "hiatus", label: "HIATUS" },
  { value: "cancelled", label: "CANCELLED" },
];

export const LeftFilterPanel: React.FC<LeftFilterPanelProps> = ({
  filters,
  onChange,
}) => {
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [debouncedInput, setDebouncedInput] = useState(filters.search);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);



  // Debouncing search suggestions trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Query suggestions from endpoint with limit of 6
  const { data: suggestions = [], isLoading: isSuggestionsLoading } = useQuery({
    queryKey: ["mangaSuggestions", debouncedInput],
    queryFn: async () => {
      if (!debouncedInput || debouncedInput.trim().length < 3) return [];
      const res = await apiFetch(`/manga?q=${encodeURIComponent(debouncedInput.trim())}&limit=6`);
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []) as MangaData[];
    },
    enabled: debouncedInput.trim().length >= 3,
  });

  // Handle clicking outside suggestions list
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Debounced search trigger (or simple form submit)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({ ...filters, search: searchInput });
    setShowSuggestions(false);
  };

  const handleInputChange = <K extends keyof FilterState>(field: K, value: FilterState[K]) => {
    onChange({ ...filters, [field]: value });
  };

  const resetFilters = () => {
    setSearchInput("");
    onChange({
      search: "",
      genre: "",
      status: "",
      language: "",
      minChapters: 0,
      maxChapters: 1000,
    });
    setShowSuggestions(false);
  };

  return (
    <div className="w-full bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000]">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-zinc-950">
        <h2 className="font-bebas text-2xl font-bold tracking-wider text-zinc-950 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#CC0000]" />
          <span>CATALOG FILTERS</span>
        </h2>
        <button
          onClick={resetFilters}
          className="text-xs font-bold tracking-wider font-sans text-zinc-500 hover:text-[#CC0000] uppercase transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="mb-6 relative">
        <label className="block text-xs font-bold font-sans tracking-wider text-zinc-500 mb-2 uppercase">
          Search Title
        </label>
        <div className="flex gap-2">
          <div ref={containerRef} className="relative flex-grow">
            <input
              type="text"
              placeholder="e.g. Chainsaw Man..."
              value={searchInput}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full bg-white text-zinc-950 border-2 border-zinc-950 px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:ring-offset-1 font-sans text-sm rounded-none"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />

            {/* Suggestions Dropdown */}
            {showSuggestions && searchInput.trim().length >= 3 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border-4 border-zinc-950 shadow-[4px_4px_0px_#000] z-[100] divide-y-2 divide-zinc-950 max-h-72 overflow-y-auto">
                {isSuggestionsLoading ? (
                  <div className="p-3 text-center text-xs font-mono font-bold text-zinc-500 animate-pulse">
                    SEARCHING...
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="p-3 text-center text-xs font-mono font-bold text-zinc-500">
                    NO SUGGESTIONS
                  </div>
                ) : (
                  suggestions.map((manga) => (
                    <button
                      key={manga.sourceId}
                      type="button"
                      onClick={() => {
                        setSearchInput(manga.title);
                        onChange({ ...filters, search: manga.title });
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#CC0000]/10 flex gap-2.5 items-center transition-colors cursor-pointer"
                    >
                      {manga.coverUrl ? (
                        <div className="relative w-8 h-10 border-2 border-zinc-950 shrink-0 bg-zinc-100">
                          <Image
                            src={manga.coverUrl}
                            alt={manga.title}
                            fill
                            sizes="32px"
                            className="object-cover"
                            unoptimized={manga.coverUrl.startsWith("http")}
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-10 border-2 border-zinc-950 shrink-0 bg-zinc-100 flex items-center justify-center font-bebas text-zinc-400 text-xs">
                          NO COV
                        </div>
                      )}
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-bebas text-sm font-bold tracking-wider text-zinc-950 truncate uppercase leading-tight">
                          {manga.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 truncate font-sans font-medium">
                          by {manga.author || "Unknown"}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsAdvancedModalOpen(true)}
            className="p-2.5 bg-white border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-50 transition-colors shadow-[2px_2px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000]"
            title="Advanced Filters"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Genre Selector */}
      <div className="mb-6">
        <label className="block text-xs font-bold font-sans tracking-wider text-zinc-500 mb-2 uppercase">
          Genre
        </label>
        <select
          value={filters.genre}
          onChange={(e) => handleInputChange("genre", e.target.value)}
          className="w-full bg-white text-zinc-950 border-2 border-zinc-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000] font-bebas text-lg tracking-wider rounded-none"
        >
          {POPULAR_GENRES.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.label}
            </option>
          ))}
        </select>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-xs font-bold font-sans tracking-wider text-zinc-500 mb-2 uppercase">
          Original Language
        </label>
        <select
          value={filters.language}
          onChange={(e) => handleInputChange("language", e.target.value)}
          className="w-full bg-white text-zinc-950 border-2 border-zinc-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000] font-bebas text-lg tracking-wider rounded-none"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Selector */}
      <div className="mb-6">
        <label className="block text-xs font-bold font-sans tracking-wider text-zinc-500 mb-2 uppercase">
          Publishing Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          className="w-full bg-white text-zinc-950 border-2 border-zinc-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000] font-bebas text-lg tracking-wider rounded-none"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Chapters Slider */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold font-sans tracking-wider text-zinc-500 uppercase">
            Chapter Count Range
          </label>
          <span className="text-xs font-mono font-bold text-zinc-800 bg-zinc-100 border border-zinc-300 px-1.5 py-0.5">
            {filters.minChapters} - {filters.maxChapters === 1000 ? "1000+" : filters.maxChapters}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-bold text-zinc-400 flex justify-between">
              <span>MIN CHAPTERS</span>
              <span>{filters.minChapters}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="5"
              value={filters.minChapters}
              onChange={(e) => handleInputChange("minChapters", parseInt(e.target.value))}
              className="w-full accent-[#CC0000] h-1 bg-zinc-200 cursor-pointer"
            />
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 flex justify-between">
              <span>MAX CHAPTERS</span>
              <span>{filters.maxChapters === 1000 ? "1000+" : filters.maxChapters}</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={filters.maxChapters}
              onChange={(e) => handleInputChange("maxChapters", parseInt(e.target.value))}
              className="w-full accent-[#CC0000] h-1 bg-zinc-200 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings Modal Overlay */}
      {isAdvancedModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[999] animate-fade-in">
          <div className="w-full max-w-md bg-white border-4 border-zinc-950 p-6 shadow-[8px_8px_0px_#000] rounded-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-zinc-950 mb-4">
              <h3 className="font-bebas text-2xl font-bold tracking-wider text-zinc-950 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#CC0000] animate-spin-slow" />
                <span>ADVANCED SEARCH FILTERS</span>
              </h3>
              <button
                onClick={() => setIsAdvancedModalOpen(false)}
                className="p-1 border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 font-sans text-sm">
              <p className="text-xs text-zinc-500 font-bold mb-2 uppercase">
                Content Demographics
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["shonen", "shojo", "seinen", "josei"].map((demo) => {
                  // Pretend demographic is selectable, we can show checked states
                  return (
                    <label
                      key={demo}
                      className="flex items-center gap-2 p-2 border-2 border-zinc-200 hover:border-zinc-950 cursor-pointer uppercase font-bebas tracking-wide"
                    >
                      <input type="checkbox" className="accent-[#CC0000] w-4 h-4" />
                      <span>{demo}</span>
                    </label>
                  );
                })}
              </div>

              <p className="text-xs text-zinc-500 font-bold mt-4 mb-2 uppercase">
                Content Rating Filter
              </p>
              <div className="flex flex-col gap-2">
                {["safe", "suggestive", "erotica"].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer uppercase font-bebas text-base tracking-wide">
                    <input
                      type="radio"
                      name="rating"
                      defaultChecked={rating === "safe"}
                      className="accent-[#CC0000] w-4 h-4"
                    />
                    <span>{rating}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t-2 border-zinc-950 mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsAdvancedModalOpen(false)}
                  className="px-4 py-2 border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-50 font-bebas text-lg font-bold tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => setIsAdvancedModalOpen(false)}
                  className="px-4 py-2 bg-[#CC0000] text-white border-2 border-zinc-950 shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] font-bebas text-lg font-bold tracking-wider"
                >
                  APPLY FILTERS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
