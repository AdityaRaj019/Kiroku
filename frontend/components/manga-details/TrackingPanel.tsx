"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/hooks/useAuthStore";
import { apiFetch } from "@/utils/api";
import { BookOpen, Check, ChevronDown, Loader2, Play, Trash2 } from "lucide-react";

interface TrackingPanelProps {
  mangaId: string;
  tracking: {
    isFollowing: boolean;
    libraryItemId: number | null;
    status: string | null;
    lastReadChapter: string | null;
    followedAt: string | null;
  } | null;
  totalChapters: number;
}

interface Chapter {
  sourceId: string;
  chapter: string;
  volume: string | null;
  title: string | null;
  language: string;
}

export const TrackingPanel: React.FC<TrackingPanelProps> = ({
  mangaId,
  tracking,
  totalChapters,
}) => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isChaptersOpen, setIsChaptersOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pagination local state
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 12;

  // Resolve current tracking state
  const isFollowing = tracking?.isFollowing ?? false;
  const currentStatus = tracking?.status ?? null;
  const currentProgress = tracking?.lastReadChapter ? parseInt(tracking.lastReadChapter, 10) : 0;
  const libraryItemId = tracking?.libraryItemId ?? null;

  // Fetch chapters for tracking list
  const { data: chapters = [], isLoading: isChaptersLoading } = useQuery<Chapter[]>({
    queryKey: ["mangaChapters", mangaId],
    queryFn: async () => {
      const res = await apiFetch(`/manga/${mangaId}/chapters?limit=500&language=en`);
      if (!res.ok) throw new Error("Failed to fetch chapters");
      const json = await res.json();
      return json.data || [];
    },
  });

  // Filter and sort chapters ascending (1, 2, 3...)
  const sortedChapters = useMemo(() => {
    if (!chapters) return [];
    
    // De-duplicate chapters by chapter number to avoid multiple versions in list
    const seen = new Set<string>();
    const unique = chapters.filter((c) => {
      if (!c.chapter) return false;
      if (seen.has(c.chapter)) return false;
      seen.add(c.chapter);
      return true;
    });

    return unique.sort((a, b) => {
      const numA = parseFloat(a.chapter);
      const numB = parseFloat(b.chapter);
      if (isNaN(numA) || isNaN(numB)) {
        return a.chapter.localeCompare(b.chapter);
      }
      return numA - numB;
    });
  }, [chapters]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedChapters.length / chaptersPerPage));
  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = sortedChapters.slice(indexOfFirstChapter, indexOfLastChapter);



  // Mutations
  const upsertMutation = useMutation({
    mutationFn: async (payload: { status: string; progress: number }) => {
      const res = await apiFetch("/library", {
        method: "POST",
        body: JSON.stringify({
          mangaId,
          status: payload.status,
          progress: payload.progress,
          mediaType: "MANGA",
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update tracking");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mangaDetails", mangaId] });
      setErrorMessage(null);
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || "An error occurred while tracking.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const res = await apiFetch(`/library/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove from library");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mangaDetails", mangaId] });
      setIsChaptersOpen(false);
      setErrorMessage(null);
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || "An error occurred while deleting.");
    },
  });

  const handleStatusChange = (status: string) => {
    if (!isAuthenticated) {
      setErrorMessage("Please login or register to track manga!");
      return;
    }
    upsertMutation.mutate({ status, progress: currentProgress });
    setIsDropdownOpen(false);
  };

  const handleChapterCheck = (chapterNum: string, isChecked: boolean) => {
    if (!isAuthenticated) {
      setErrorMessage("Please login or register to track manga!");
      return;
    }
    const num = parseInt(chapterNum, 10);
    if (isNaN(num)) return;

    // If checked, progress is this chapter. If unchecked, progress is this chapter - 1.
    const newProgress = isChecked ? num : Math.max(0, num - 1);
    upsertMutation.mutate({ status: currentStatus || "READING", progress: newProgress });
  };

  const handleRemoveTrack = () => {
    if (libraryItemId) {
      deleteMutation.mutate(libraryItemId);
    }
  };

  const getStatusLabel = (status: string | null) => {
    if (!status) return "Track Now";
    switch (status) {
      case "READING": return "Reading";
      case "COMPLETED": return "Completed";
      case "PLAN_TO_READ": return "Plan to Read";
      case "PAUSED": return "On Hold";
      case "DROPPED": return "Dropped";
      default: return status;
    }
  };

  const nextChapterToRead = currentProgress < totalChapters ? currentProgress + 1 : null;

  const nextChapterUrl = useMemo(() => {
    if (!nextChapterToRead || !sortedChapters.length) {
      return `https://mangadex.org/title/${mangaId}`;
    }
    const match = sortedChapters.find((c) => parseFloat(c.chapter) === nextChapterToRead);
    return match
      ? `https://mangadex.org/chapter/${match.sourceId}`
      : `https://mangadex.org/title/${mangaId}`;
  }, [nextChapterToRead, sortedChapters, mangaId]);

  return (
    <div className="w-full flex flex-col items-center md:items-start gap-4">
      
      {/* Tracking Actions Header */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
        
        {/* Track Main Button */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              setErrorMessage("Please log in to track your reading progress!");
              return;
            }
            if (!isFollowing) {
              handleStatusChange("READING");
            } else {
              setIsChaptersOpen((prev) => {
                const nextVal = !prev;
                if (nextVal) {
                  setCurrentPage(1);
                }
                return nextVal;
              });
            }
          }}
          className={`flex-grow h-12 flex items-center justify-center gap-2 border-4 border-zinc-950 font-bebas text-lg font-bold tracking-wider shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000] transition-all cursor-pointer select-none uppercase px-6 w-full ${
            isFollowing
              ? "bg-white text-zinc-950 hover:bg-zinc-50"
              : "bg-[#CC0000] text-white hover:bg-[#CC0000]/95"
          }`}
        >
          {upsertMutation.isPending || deleteMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isFollowing ? (
            <>
              <BookOpen className="w-5 h-5 shrink-0" style={{ color: "var(--theme-primary)" }} />
              {isChaptersOpen ? "Close Progress" : "Track Progress"}
            </>
          ) : (
            <>
              <Play className="w-5 h-5 shrink-0" />
              Track Now
            </>
          )}
        </button>

        {/* Dropdown status selector */}
        {isFollowing && (
          <div className="relative shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-12 w-full sm:w-44 flex items-center justify-between border-4 border-zinc-950 bg-white text-zinc-950 px-4 font-bebas text-md tracking-wider shadow-[3px_3px_0px_#000] hover:bg-zinc-50 transition-all select-none uppercase"
            >
              <span className="truncate">{getStatusLabel(currentStatus)}</span>
              <ChevronDown className="w-4 h-4 shrink-0 border-l-2 border-zinc-950 pl-1.5 ml-2 w-6" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-14 w-full sm:w-44 bg-white border-4 border-zinc-950 shadow-[4px_4px_0px_#000] z-50 flex flex-col font-bebas text-sm">
                {(["READING", "COMPLETED", "PLAN_TO_READ", "PAUSED", "DROPPED"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full text-left px-4 py-2 hover:bg-[#CC0000]/5 border-b-2 last:border-0 border-zinc-950 transition-colors uppercase ${
                      currentStatus === status ? "bg-[#CC0000] text-white hover:bg-[#CC0000]" : "text-zinc-950"
                    }`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
                
                {/* Remove Tracker Option */}
                <button
                  onClick={handleRemoveTrack}
                  className="w-full text-left px-4 py-2 text-[#CC0000] hover:bg-red-50 transition-colors uppercase flex items-center gap-1.5 font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Track
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Read Next Button / Catch Up Banner */}
      {isFollowing && (
        <div className="w-full max-w-md text-zinc-950 font-bold">
          {nextChapterToRead !== null ? (
            <a
              href={nextChapterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 flex items-center justify-center gap-2 border-4 border-zinc-950 bg-[#FFD700] text-zinc-950 font-bebas text-lg font-bold tracking-wider shadow-[3px_3px_0px_#000] hover:bg-[#FFD700]/90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000] transition-all select-none uppercase px-6 text-center"
            >
              <Play className="w-4 h-4 shrink-0 fill-zinc-950" />
              Read Next: Chapter {nextChapterToRead} &rarr;
            </a>
          ) : (
            <div className="w-full h-12 flex items-center justify-center gap-2 border-4 border-zinc-950 border-dashed bg-green-50 text-green-800 font-bebas text-md tracking-wider select-none uppercase px-6 font-black">
              🎉 All Caught Up!
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-xs text-[#CC0000] font-sans font-semibold border-2 border-[#CC0000] bg-red-50 px-3 py-1.5 rounded-none max-w-md w-full">
          {errorMessage}
        </p>
      )}

      {/* Chapters Checklist Container */}
      {isChaptersOpen && (
        <div className="w-full max-w-md bg-white border-4 border-zinc-950 p-4 shadow-[4px_4px_0px_#000] animate-fade-in-up mt-2 relative">
          <h4 className="font-bebas text-xl font-bold tracking-wider text-zinc-950 border-b-4 border-zinc-950 pb-2 mb-3 uppercase flex items-center justify-between">
            <span>Chapter Checklist</span>
            <span className="text-xs font-mono font-bold bg-[#CC0000] text-white px-2 py-0.5 border-2 border-zinc-950 shadow-[1px_1px_0px_#000]">
              Progress: {currentProgress} / {totalChapters} Ch.
            </span>
          </h4>

          {isChaptersLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#CC0000]" />
              <span className="font-bebas text-sm tracking-widest text-zinc-500 uppercase">Loading Chapters...</span>
            </div>
          ) : sortedChapters.length === 0 ? (
            <p className="text-sm font-sans font-medium text-zinc-500 text-center py-6">No English chapters available.</p>
          ) : (
            <>
              {/* Checkbox list */}
              <div className="grid grid-cols-2 gap-2 mb-4 max-h-56 overflow-y-auto pr-1">
                {currentChapters.map((ch) => {
                  const chNum = parseInt(ch.chapter, 10);
                  const isRead = !isNaN(chNum) && chNum <= currentProgress;
                  
                  return (
                    <label
                      key={ch.sourceId}
                      className={`flex items-center gap-2 px-2.5 py-1.5 border-2 border-zinc-950 cursor-pointer select-none transition-all ${
                        isRead 
                          ? "bg-[#CC0000]/10 border-[#CC0000]" 
                          : "bg-zinc-50 hover:bg-zinc-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isRead}
                        onChange={(e) => handleChapterCheck(ch.chapter, e.target.checked)}
                        className="w-4 h-4 accent-[#CC0000] cursor-pointer shrink-0 border-2 border-zinc-950"
                      />
                      <span className="font-mono text-xs font-bold truncate text-zinc-800">
                        Ch. {ch.chapter}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Local Pagination Controls */}
              <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-zinc-200 font-bebas text-xs tracking-wider">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 border-2 border-zinc-950 shadow-[1px_1px_0px_#000] active:translate-y-[0.5px] disabled:opacity-40 disabled:pointer-events-none uppercase font-bold"
                >
                  &larr; Prev
                </button>
                <span className="font-mono font-bold text-zinc-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 border-2 border-zinc-950 shadow-[1px_1px_0px_#000] active:translate-y-[0.5px] disabled:opacity-40 disabled:pointer-events-none uppercase font-bold"
                >
                  Next &rarr;
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
