"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserLibrary } from "@/hooks/useUserLibrary";
import { useIsMounted } from "@/hooks/useIsMounted";
import { EditProfileModal } from "@/components/dashboard/EditProfileModal";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import Image from "next/image";
import Link from "next/link";
import { 
  Award, 
  Calendar, 
  Edit3, 
  Star, 
  Trophy, 
  Play, 
  BookMarked,
  Loader2
} from "lucide-react";

type LibraryFilterStatus = "ALL" | "READING" | "COMPLETED" | "PLAN_TO_READ" | "PAUSED" | "DROPPED";

export default function DashboardPage() {
  const isReady = useRouteGuard();
  const currentUser = useAuthStore((state) => state.user);
  
  const [activeTab, setActiveTab] = useState<LibraryFilterStatus>("ALL");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const mounted = useIsMounted();

  const userId = currentUser?.id;

  // Retrieve user statistics, rank, and details
  const { 
    data: profileData, 
    isLoading: isProfileLoading, 
    isError: isProfileError 
  } = useUserProfile(userId);

  // Retrieve followed manga items based on status tab filter
  const { 
    data: libraryData, 
    isLoading: isLibraryLoading, 
    isError: isLibraryError 
  } = useUserLibrary({
    status: activeTab === "ALL" ? undefined : activeTab,
    limit: 100, // retrieve all for clean dashboard list
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
          {/* Halftone backdrop decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FF6B00]/10 to-transparent pointer-events-none" />

          {isProfileLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="w-10 h-10 animate-spin text-[#FF6B00]" />
              <span className="font-bebas text-sm tracking-wider uppercase text-zinc-500">Loading profile data...</span>
            </div>
          ) : isProfileError || !userProfile ? (
            <div className="text-center py-6 text-red-600 font-bold">
              Failed to load profile details. Please try refreshing.
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
                  <span className="bg-[#FF6B00] text-white border-2 border-zinc-950 px-2.5 py-0.5 text-xs font-mono font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_#000] shrink-0">
                    {userProfile.rank}
                  </span>
                </div>

                <p className="text-sm font-sans font-medium text-zinc-700 max-w-2xl leading-relaxed">
                  {userProfile.bio || "No profile bio written yet. Let other readers know about your manga tastes!"}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono font-bold text-zinc-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined: {formatLocalDate(userProfile.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px]">
                    ID: #{userProfile.id}
                  </span>
                </div>
              </div>

              {/* Edit Profile Action */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="md:self-start h-11 flex items-center justify-center gap-2 border-4 border-zinc-950 bg-white text-zinc-950 font-bebas text-md font-black tracking-wider shadow-[3px_3px_0px_#000] hover:bg-zinc-50 hover:shadow-[4px_4px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#000] transition-all cursor-pointer select-none uppercase px-5 shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>

            </div>
          )}
        </div>

        {/* User Stats RPG Section */}
        {userProfile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* EXP Card */}
            <div className="md:col-span-2 border-4 border-zinc-950 bg-white shadow-[4px_4px_0px_#000] p-5 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bebas text-xl font-black text-zinc-950 tracking-wide uppercase flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-[#FF6B00]" />
                  Exp Progress
                </span>
                <span className="font-mono text-xs font-bold text-zinc-600">
                  {currentExp} / {nextRankThreshold} EXP
                </span>
              </div>
              {/* Exp Bar */}
              <div className="w-full h-6 border-2 border-zinc-950 bg-zinc-100 rounded-none overflow-hidden relative shadow-[1px_1px_0px_#000] mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FFD700] transition-all duration-500"
                  style={{ width: `${expPercent}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-black text-zinc-950 mix-blend-overlay">
                  {expPercent}%
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 leading-none">
                Earn EXP by keeping your reading progress checklist updated.
              </p>
            </div>

            {/* Total Books Card */}
            <div className="border-4 border-zinc-950 bg-white shadow-[4px_4px_0px_#000] p-5 flex flex-col justify-between">
              <span className="font-bebas text-lg font-bold text-zinc-500 tracking-wider uppercase block">
                Total Tracked
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-bebas text-4xl md:text-5xl font-black text-zinc-950 leading-none">
                  {userProfile.stats.totalBooks}
                </span>
                <span className="font-bebas text-sm font-bold text-zinc-500 uppercase">Series</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-600 pt-2 border-t border-dashed border-zinc-200 mt-2">
                <span className="text-green-600">{userProfile.stats.completedCount} Completed</span>
                <span className="text-zinc-400">•</span>
                <span className="text-blue-600">{userProfile.stats.readingCount} Active</span>
              </div>
            </div>

            {/* Chapters Read Card */}
            <div className="border-4 border-zinc-950 bg-white shadow-[4px_4px_0px_#000] p-5 flex flex-col justify-between">
              <span className="font-bebas text-lg font-bold text-zinc-500 tracking-wider uppercase block flex items-center gap-1">
                <Trophy className="w-4 h-4 text-[#FFD700] shrink-0" />
                Chapters Read
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-bebas text-4xl md:text-5xl font-black text-zinc-950 leading-none">
                  {userProfile.stats.chaptersRead}
                </span>
                <span className="font-bebas text-sm font-bold text-zinc-500 uppercase">Chapters</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-600 pt-2 border-t border-dashed border-zinc-200 mt-2">
                <span>Avg Rating: </span>
                <span className="font-black text-amber-500 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-500" />
                  {userProfile.stats.averageScore || "N/A"}
                </span>
              </div>
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
              <p className="text-zinc-500 font-sans font-semibold">
                No items found matching the selected category.
              </p>
              <Link
                href="/manga"
                className="inline-block px-5 py-2.5 border-4 border-zinc-950 bg-[#FFD700] text-zinc-950 font-bebas text-md font-black tracking-wider shadow-[3px_3px_0px_#000] hover:bg-[#FFD700]/90 transition-all uppercase"
              >
                Search Manga Catalog &rarr;
              </Link>
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

      {/* Edit Profile Modal */}
      {userProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentName={userProfile.name || ""}
          currentAvatarUrl={userProfile.avatarUrl || ""}
          currentBio={userProfile.bio || ""}
        />
      )}

      <Footer />
    </div>
  );
}
