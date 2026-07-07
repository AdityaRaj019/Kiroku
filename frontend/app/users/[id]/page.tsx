"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePublicUserLibrary } from "@/hooks/useUserLibrary";
import { useIsMounted } from "@/hooks/useIsMounted";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  Star, 
  MessageSquare,
  Play, 
  BookMarked,
  Loader2
} from "lucide-react";

type LibraryFilterStatus = "ALL" | "READING" | "COMPLETED" | "PLAN_TO_READ" | "PAUSED" | "DROPPED";

export default function PublicProfilePage() {
  const isReady = useRouteGuard();
  const params = useParams();
  const idString = params.id as string;
  const targetUserId = parseInt(idString, 10);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [activeTab, setActiveTab] = useState<LibraryFilterStatus>("ALL");
  const mounted = useIsMounted();

  // Retrieve user statistics, rank, and details
  const { 
    data: profileData, 
    isLoading: isProfileLoading, 
    isError: isProfileError 
  } = useUserProfile(isNaN(targetUserId) ? undefined : targetUserId);

  // Retrieve followed manga items based on status tab filter
  const { 
    data: libraryData, 
    isLoading: isLibraryLoading, 
    isError: isLibraryError 
  } = usePublicUserLibrary(targetUserId, {
    status: activeTab === "ALL" ? undefined : activeTab,
    limit: 100, // retrieve all for clean profile list
    enabled: isAuthenticated,
  });

  if (!isReady || !mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#FF6B00]" />
        <span className="font-bebas text-lg tracking-widest uppercase">Loading Portal...</span>
      </div>
    );
  }

  const userProfile = profileData?.user;
  const libraryItems = libraryData?.data || [];

  // Filter out currently reading manga to highlight on public profile
  const currentlyReadingItems = libraryItems.filter(item => item.status === "READING").slice(0, 3);

  // Derived rank details
  const currentExp = userProfile?.exp || 0;
  const nextRankThreshold = currentExp >= 1500 ? 3000 : currentExp >= 1000 ? 1500 : currentExp >= 500 ? 1000 : currentExp >= 200 ? 500 : 200;
  const expPercent = Math.min(100, Math.round((currentExp / nextRankThreshold) * 100));

  const formatLocalDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "READING": return "bg-blue-100 text-blue-800 border-blue-300";
      case "COMPLETED": return "bg-green-100 text-green-800 border-green-300";
      case "PLAN_TO_READ": return "bg-zinc-100 text-zinc-800 border-zinc-300";
      case "PAUSED": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "DROPPED": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-zinc-100 text-zinc-800 border-zinc-300";
    }
  };

  return (
    <div className="manga-theme-scope min-h-screen bg-[#FAF9F6] text-zinc-950 flex flex-col font-sans transition-all duration-300">
      <ThemeSelector scopeClass="manga-theme-scope" />
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 md:py-12">
        {/* Banner with Screentone Background */}
        <div className="w-full border-4 border-zinc-950 bg-white shadow-[6px_6px_0px_#000] p-6 md:p-8 mb-8 relative overflow-hidden manga-screentone">
          {/* Halftone decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FF6B00]/10 to-transparent pointer-events-none" />

          {isProfileLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="w-10 h-10 animate-spin text-[#FF6B00]" />
              <span className="font-bebas text-sm tracking-wider uppercase text-zinc-500">Loading user profile...</span>
            </div>
          ) : isProfileError || !userProfile ? (
            <div className="text-center py-6 text-red-600 font-bold">
              User not found or failed to load.
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
              
              {/* Profile Avatar Frame */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-none border-4 border-zinc-950 bg-zinc-100 shadow-[4px_4px_0px_#000] overflow-hidden shrink-0">
                <Image
                  src={userProfile.avatarUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=Kiroku"}
                  alt={userProfile.name || "User Avatar"}
                  fill
                  sizes="128px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Bio & Details Block */}
              <div className="flex-grow text-center md:text-left space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                  <h1 className="font-bebas text-4xl md:text-5xl font-black text-zinc-950 tracking-wide uppercase leading-none">
                    {userProfile.name || "Anonymous Reader"}
                  </h1>
                  <span className="bg-[#FFD700] text-zinc-950 border-2 border-zinc-950 px-2.5 py-0.5 text-xs font-mono font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_#000] shrink-0">
                    {userProfile.rank}
                  </span>
                </div>

                <p className="text-sm font-sans font-medium text-zinc-700 max-w-2xl leading-relaxed">
                  {userProfile.bio || "No profile bio written yet."}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono font-bold text-zinc-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Member Since: {formatLocalDate(userProfile.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px]">
                    ID: #{userProfile.id}
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Stats and Extra Sections (Comments & Currently Reading) */}
        {userProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Stats Summary Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="border-4 border-zinc-950 bg-white shadow-[4px_4px_0px_#000] p-5 space-y-4">
                <h3 className="font-bebas text-2xl font-black text-zinc-950 border-b-4 border-zinc-950 pb-1 uppercase">
                  Stats Dashboard
                </h3>

                <div className="space-y-4 font-bebas text-zinc-800">
                  {/* EXP progress */}
                  <div>
                    <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-1">
                      <span>EXP Level</span>
                      <span>{currentExp} EXP</span>
                    </div>
                    <div className="w-full h-4 border-2 border-zinc-950 bg-zinc-100 rounded-none overflow-hidden relative shadow-[1px_1px_0px_#000]">
                      <div className="h-full bg-[#FFD700]" style={{ width: `${expPercent}%` }} />
                    </div>
                  </div>

                  {/* Books Count */}
                  <div className="flex justify-between items-center py-2 border-b-2 border-dashed border-zinc-100">
                    <span className="text-zinc-500 uppercase font-black text-md">Total Series</span>
                    <span className="text-zinc-950 text-2xl font-black">{userProfile.stats.totalBooks}</span>
                  </div>

                  {/* Chapters Count */}
                  <div className="flex justify-between items-center py-2 border-b-2 border-dashed border-zinc-100">
                    <span className="text-zinc-500 uppercase font-black text-md">Chapters Read</span>
                    <span className="text-zinc-950 text-2xl font-black">{userProfile.stats.chaptersRead}</span>
                  </div>

                  {/* Average Score */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-500 uppercase font-black text-md">Mean Rating</span>
                    <span className="text-amber-500 text-2xl font-black flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-500" />
                      {userProfile.stats.averageScore || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Currently Reading Highlight */}
              <div className="border-4 border-zinc-950 bg-white shadow-[4px_4px_0px_#000] p-5">
                <h3 className="font-bebas text-2xl font-black text-zinc-950 border-b-4 border-zinc-950 pb-1 mb-4 uppercase">
                  Currently Reading
                </h3>

                {currentlyReadingItems.length === 0 ? (
                  <p className="text-sm font-sans font-semibold text-zinc-500 text-center py-4">No active series currently.</p>
                ) : (
                  <div className="space-y-3">
                    {currentlyReadingItems.map((item) => (
                      <Link 
                        key={item.id} 
                        href={`/manga/${item.manga?.sourceId}`}
                        className="flex gap-3 p-2 border-2 border-zinc-950 bg-zinc-50 hover:bg-zinc-100 transition-colors shadow-[2px_2px_0px_#000]"
                      >
                        <div className="relative w-10 h-14 border border-zinc-950 overflow-hidden shrink-0">
                          <Image
                            src={item.manga?.coverUrl || "https://uploads.mangadex.org/covers/placeholder.jpg"}
                            alt={item.manga?.title || ""}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="font-bebas text-md font-bold text-zinc-950 truncate uppercase leading-tight">
                            {item.manga?.title}
                          </div>
                          <div className="font-mono text-[10px] font-bold text-zinc-500 mt-1">
                            Progress: Ch. {item.progress}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Comments Column */}
            <div className="lg:col-span-2 border-4 border-zinc-950 bg-white shadow-[4px_4px_0px_#000] p-5">
              <h3 className="font-bebas text-2xl font-black text-zinc-950 border-b-4 border-zinc-950 pb-1 mb-4 uppercase flex items-center gap-1.5">
                <MessageSquare className="w-5 h-5 text-[#FF6B00]" />
                Recent Top Comments
              </h3>

              {userProfile.recentComments.length === 0 ? (
                <p className="text-sm font-sans font-semibold text-zinc-500 text-center py-10">No recent comments posted.</p>
              ) : (
                <div className="space-y-4">
                  {userProfile.recentComments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="border-2 border-zinc-950 p-4 shadow-[3px_3px_0px_#000] space-y-2 relative overflow-hidden"
                    >
                      {/* Stylized speech bubble indicator */}
                      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none select-none">
                        <MessageSquare className="w-24 h-24 text-zinc-950" />
                      </div>

                      <div className="flex justify-between items-baseline font-mono text-[11px] text-zinc-500">
                        <Link 
                          href="#"
                          className="font-bold text-zinc-800 hover:text-[#FF6B00] transition-colors uppercase"
                        >
                          {comment.mangaTitle} — Ch. {comment.chapterNumber}
                        </Link>
                        <span>{formatLocalDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm font-sans font-medium text-zinc-700 italic leading-relaxed">
                        &ldquo;{comment.body}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="border-4 border-zinc-950 bg-white shadow-[4px_4px_0px_#000] p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {([
              { key: "ALL", label: "All Follows" },
              { key: "READING", label: "Reading" },
              { key: "COMPLETED", label: "Completed" },
              { key: "PLAN_TO_READ", label: "Plan to Read" },
              { key: "PAUSED", label: "On Hold" },
              { key: "DROPPED", label: "Dropped" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 border-2 border-zinc-950 font-bebas text-md tracking-wider uppercase transition-all shadow-[2px_2px_0px_#000] active:translate-y-[0.5px] cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-zinc-950 text-white shadow-none"
                    : "bg-white text-zinc-950 hover:bg-zinc-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Followed Manga List Container */}
        <div className="border-4 border-zinc-950 bg-white shadow-[6px_6px_0px_#000] p-6 relative">
          <h2 className="font-bebas text-3xl font-black text-zinc-950 tracking-wider uppercase border-b-4 border-zinc-950 pb-2 mb-6">
            Manga Reading Ledger
          </h2>

          {isLibraryLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Loader2 className="w-10 h-10 animate-spin text-[#FF6B00]" />
              <span className="font-bebas text-sm tracking-wider uppercase text-zinc-500">Retrieving library items...</span>
            </div>
          ) : isLibraryError ? (
            <p className="text-center py-10 font-bold text-red-600">Failed to load followed manga.</p>
          ) : libraryItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <BookMarked className="w-12 h-12 text-zinc-400 mx-auto" />
              <p className="text-zinc-500 font-sans font-semibold text-center">
                No library items found in this section.
              </p>
            </div>
          ) : (
            <div className="divide-y-4 divide-dashed divide-zinc-200">
              {libraryItems.map((item) => {
                const manga = item.manga;
                if (!manga) return null;
                
                // Chapter progress denominator
                const chaptersCount = manga.chapterCount || 100;
                const progressPercent = Math.min(100, Math.round((item.progress / chaptersCount) * 100));

                return (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row gap-6 items-center md:items-start">
                    
                    {/* Cover Photo */}
                    <div className="relative w-20 h-28 border-2 border-zinc-950 shadow-[3px_3px_0px_#000] bg-zinc-100 overflow-hidden shrink-0 group">
                      <Image
                        src={manga.coverUrl || "https://uploads.mangadex.org/covers/placeholder.jpg"}
                        alt={manga.title}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </div>

                    {/* Manga Info Details */}
                    <div className="flex-grow text-center md:text-left space-y-3 w-full">
                      <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2">
                        <Link 
                          href={`/manga/${manga.sourceId}`}
                          className="font-bebas text-2xl font-black text-zinc-950 hover:text-[#FF6B00] transition-colors uppercase leading-none"
                        >
                          {manga.title}
                        </Link>
                        <span className={`px-2 py-0.5 border text-[10px] font-mono font-bold uppercase rounded-none ${getStatusStyle(item.status)}`}>
                          {item.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* Progress Metrics & Bar */}
                      <div className="max-w-md w-full">
                        <div className="flex justify-between items-center text-xs font-mono font-bold text-zinc-600 mb-1">
                          <span>Chapters Read: Ch. {item.progress} / {chaptersCount}</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full h-3 border-2 border-zinc-950 bg-zinc-100 rounded-none overflow-hidden relative shadow-[1px_1px_0px_#000]">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Dates & Score Details */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs font-mono font-semibold text-zinc-500">
                        <span className="flex items-center gap-1 text-[#FFD700] font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                          Score: {item.rating ? `${item.rating}/10` : "Unrated"}
                        </span>
                        <span className="text-zinc-300">|</span>
                        <span>Started: {formatLocalDate(item.startDate)}</span>
                        <span className="text-zinc-300">|</span>
                        <span>Finished: {formatLocalDate(item.endDate)}</span>
                      </div>

                    </div>

                    {/* Action Block */}
                    <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0 justify-center">
                      <Link
                        href={`/manga/${manga.sourceId}`}
                        className="flex-grow h-10 flex items-center justify-center gap-1.5 border-2 border-zinc-950 bg-zinc-50 hover:bg-zinc-100 text-zinc-950 font-bebas text-xs font-black tracking-widest shadow-[2px_2px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] transition-all uppercase px-4 cursor-pointer text-center"
                      >
                        <Play className="w-3 h-3 fill-zinc-950 shrink-0" />
                        READ NOW &rarr;
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
