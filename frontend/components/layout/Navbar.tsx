"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { apiFetch } from "@/utils/api";
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  ChevronDown, 
  BookOpen, 
  Tv,
  Users,
  MessageSquare,
  Globe,
  RefreshCw,
  Book,
  Camera,
  Sparkles,
  TrendingUp,
  Sliders
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, clearSession } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      clearSession();
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      router.push("/");
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  // Nav Active States
  const isMangaActive = pathname.startsWith("/manga") || (pathname.startsWith("/explore") && !pathname.includes("/anime"));
  const isAnimeActive = pathname.startsWith("/anime");
  const isRoomsActive = pathname.startsWith("/rooms");
  const isForumsActive = pathname.startsWith("/forums");
  const isCommunityActive = pathname.startsWith("/community");

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b-4 border-zinc-950 px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center space-x-6 lg:space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            <span className="font-bebas text-3xl font-extrabold tracking-wider text-zinc-950 transition-transform group-hover:-skew-x-6 duration-200">
              KIROKU
            </span>
            <span className="font-bebas bg-[#CC0000] text-white px-2 py-0.5 text-sm font-bold tracking-widest uppercase transform rotate-[-2deg] border-2 border-zinc-950 shadow-[2px_2px_0px_#000]">
              記録
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link 
              href="/manga" 
              className={`flex items-center gap-1 font-bebas text-base lg:text-lg font-bold tracking-wider px-2.5 py-1 border-2 transition-all ${
                isMangaActive 
                  ? "bg-[#CC0000] text-white border-zinc-950 shadow-[3px_3px_0px_#000] translate-x-[-2px] translate-y-[-2px]" 
                  : "text-zinc-700 border-transparent hover:text-[#CC0000] hover:border-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>MANGA</span>
            </Link>
            <Link 
              href="/anime" 
              className={`flex items-center gap-1 font-bebas text-base lg:text-lg font-bold tracking-wider px-2.5 py-1 border-2 transition-all ${
                isAnimeActive 
                  ? "bg-[#CC0000] text-white border-zinc-950 shadow-[3px_3px_0px_#000] translate-x-[-2px] translate-y-[-2px]" 
                  : "text-zinc-700 border-transparent hover:text-[#CC0000] hover:border-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>ANIME</span>
            </Link>
            <Link 
              href="/rooms" 
              className={`flex items-center gap-1 font-bebas text-base lg:text-lg font-bold tracking-wider px-2.5 py-1 border-2 transition-all ${
                isRoomsActive 
                  ? "bg-[#CC0000] text-white border-zinc-950 shadow-[3px_3px_0px_#000] translate-x-[-2px] translate-y-[-2px]" 
                  : "text-zinc-700 border-transparent hover:text-[#CC0000] hover:border-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>ROOMS</span>
            </Link>
            <Link 
              href="/forums" 
              className={`flex items-center gap-1 font-bebas text-base lg:text-lg font-bold tracking-wider px-2.5 py-1 border-2 transition-all ${
                isForumsActive 
                  ? "bg-[#CC0000] text-white border-zinc-950 shadow-[3px_3px_0px_#000] translate-x-[-2px] translate-y-[-2px]" 
                  : "text-zinc-700 border-transparent hover:text-[#CC0000] hover:border-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>FORUMS</span>
            </Link>
            <Link 
              href="/community" 
              className={`flex items-center gap-1 font-bebas text-base lg:text-lg font-bold tracking-wider px-2.5 py-1 border-2 transition-all ${
                isCommunityActive 
                  ? "bg-[#CC0000] text-white border-zinc-950 shadow-[3px_3px_0px_#000] translate-x-[-2px] translate-y-[-2px]" 
                  : "text-zinc-700 border-transparent hover:text-[#CC0000] hover:border-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>COMMUNITY</span>
            </Link>
          </div>
        </div>

        {/* Right Section: Auth State / Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-zinc-950 rounded-none shadow-[3px_3px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_#000] transition-all"
              >
                <div className="w-7 h-7 rounded-none bg-[#CC0000] border-2 border-zinc-950 flex items-center justify-center text-white font-bebas text-sm font-bold">
                  {getInitials(user?.name ?? null, user?.email ?? "")}
                </div>
                <span className="font-bebas text-base font-bold tracking-wide text-zinc-950 max-w-[120px] truncate">
                  {user?.name || user?.email.split("@")[0]}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-950 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu (Enriched with Advanced PRD Features) */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border-4 border-zinc-950 shadow-[6px_6px_0px_#000] rounded-none py-1 z-50 animate-fade-in-up">
                  
                  {/* Profile Info Header */}
                  <div className="px-4 py-2 border-b-2 border-zinc-950 bg-zinc-50">
                    <p className="text-[10px] text-zinc-500 font-sans uppercase font-bold">Signed in as</p>
                    <p className="font-bebas text-base font-bold tracking-wide text-zinc-950 truncate">
                      {user?.name || "Reader"}
                    </p>
                    <p className="text-xs text-zinc-600 font-mono truncate">{user?.email}</p>
                  </div>
                  
                  {/* Dashboard Route */}
                  <Link
                    href="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#CC0000] hover:text-white border-b-2 border-zinc-950 transition-colors"
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                    <div className="flex flex-col">
                      <span className="font-bebas text-base font-bold leading-tight uppercase">Dashboard</span>
                      <span className="text-[10px] text-zinc-500 font-sans leading-none uppercase group-hover:text-white/80">View Reading Library & Progress</span>
                    </div>
                  </Link>

                  {/* Advanced PRD Features Header */}
                  <div className="bg-zinc-50 border-b-2 border-zinc-950 px-4 py-1">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-[#CC0000]">ADVANCED FEATURES</span>
                  </div>

                  {/* Advanced features routes */}
                  <div className="max-h-[320px] overflow-y-auto">
                    
                    {/* Multi-Platform sync */}
                    <Link
                      href="/integrations"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#CC0000] hover:text-white border-b-2 border-zinc-950 last:border-b-0 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 shrink-0 text-zinc-600 hover:text-inherit" />
                      <div className="flex flex-col">
                        <span className="font-bebas text-base font-bold leading-tight uppercase">Multi-Platform Sync</span>
                        <span className="text-[10px] text-zinc-500 font-sans leading-none uppercase">Aggregate AniList & Webtoon</span>
                      </div>
                    </Link>

                    {/* Hybrid Ledger */}
                    <Link
                      href="/ledger"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#CC0000] hover:text-white border-b-2 border-zinc-950 last:border-b-0 transition-colors"
                    >
                      <Book className="w-4 h-4 shrink-0 text-zinc-600 hover:text-inherit" />
                      <div className="flex flex-col">
                        <span className="font-bebas text-base font-bold leading-tight uppercase">Hybrid Ledger</span>
                        <span className="text-[10px] text-zinc-500 font-sans leading-none uppercase">Digital vs Physical volumes</span>
                      </div>
                    </Link>

                    {/* Scan-to-track */}
                    <Link
                      href="/scan"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#CC0000] hover:text-white border-b-2 border-zinc-950 last:border-b-0 transition-colors"
                    >
                      <Camera className="w-4 h-4 shrink-0 text-zinc-600 hover:text-inherit" />
                      <div className="flex flex-col">
                        <span className="font-bebas text-base font-bold leading-tight uppercase">Scan-to-Track</span>
                        <span className="text-[10px] text-zinc-500 font-sans leading-none uppercase">OCR Cover scanner</span>
                      </div>
                    </Link>

                    {/* Trope Recommendations */}
                    <Link
                      href="/recommendations"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#CC0000] hover:text-white border-b-2 border-zinc-950 last:border-b-0 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 shrink-0 text-zinc-600 hover:text-inherit" />
                      <div className="flex flex-col">
                        <span className="font-bebas text-base font-bold leading-tight uppercase">AI Recommendations</span>
                        <span className="text-[10px] text-zinc-500 font-sans leading-none uppercase">Art, pacing & trope filters</span>
                      </div>
                    </Link>

                    {/* Release Predictions */}
                    <Link
                      href="/predictions"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#CC0000] hover:text-white border-b-2 border-zinc-950 last:border-b-0 transition-colors"
                    >
                      <TrendingUp className="w-4 h-4 shrink-0 text-zinc-600 hover:text-inherit" />
                      <div className="flex flex-col">
                        <span className="font-bebas text-base font-bold leading-tight uppercase">Release Predictions</span>
                        <span className="text-[10px] text-zinc-500 font-sans leading-none uppercase">Estimate release hour/day</span>
                      </div>
                    </Link>

                    {/* Smart Filters */}
                    <Link
                      href="/filters"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#CC0000] hover:text-white transition-colors"
                    >
                      <Sliders className="w-4 h-4 shrink-0 text-zinc-600 hover:text-inherit" />
                      <div className="flex flex-col">
                        <span className="font-bebas text-base font-bold leading-tight uppercase">Smart Filters</span>
                        <span className="text-[10px] text-zinc-500 font-sans leading-none uppercase">Quiet hours & keyword alerts</span>
                      </div>
                    </Link>

                  </div>

                  {/* Actions Section */}
                  <div className="border-t-2 border-zinc-950">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#CC0000] font-bebas text-lg font-bold hover:bg-[#CC0000] hover:text-white transition-colors text-left font-sans"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>LOGOUT</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="font-bebas text-base font-bold tracking-widest text-zinc-950 px-4 py-1.5 border-2 border-transparent hover:border-zinc-950 hover:bg-zinc-50 transition-all"
              >
                LOGIN
              </Link>
              <Link
                href="/register"
                className="font-bebas text-base font-bold tracking-widest bg-[#CC0000] text-white px-4 py-1.5 border-2 border-zinc-950 shadow-[3px_3px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000] active:translate-y-[0px] active:translate-x-[0px] active:shadow-[2px_2px_0px_#000] transition-all"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-zinc-950 mt-3 pt-3 pb-2 space-y-2 flex flex-col bg-white">
          <Link
            href="/manga"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 font-bebas text-xl font-bold tracking-wider py-2 px-3 border-2 ${
              isMangaActive 
                ? "bg-[#CC0000] text-white border-zinc-950" 
                : "text-zinc-800 border-transparent hover:bg-zinc-50"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>MANGA</span>
          </Link>
          <Link
            href="/anime"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 font-bebas text-xl font-bold tracking-wider py-2 px-3 border-2 ${
              isAnimeActive 
                ? "bg-[#CC0000] text-white border-zinc-950" 
                : "text-zinc-800 border-transparent hover:bg-zinc-50"
            }`}
          >
            <Tv className="w-5 h-5" />
            <span>ANIME</span>
          </Link>
          <Link
            href="/rooms"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 font-bebas text-xl font-bold tracking-wider py-2 px-3 border-2 ${
              isRoomsActive 
                ? "bg-[#CC0000] text-white border-zinc-950" 
                : "text-zinc-800 border-transparent hover:bg-zinc-50"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>ROOMS</span>
          </Link>
          <Link
            href="/forums"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 font-bebas text-xl font-bold tracking-wider py-2 px-3 border-2 ${
              isForumsActive 
                ? "bg-[#CC0000] text-white border-zinc-950" 
                : "text-zinc-800 border-transparent hover:bg-zinc-50"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>FORUMS</span>
          </Link>
          <Link
            href="/community"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 font-bebas text-xl font-bold tracking-wider py-2 px-3 border-2 ${
              isCommunityActive 
                ? "bg-[#CC0000] text-white border-zinc-950" 
                : "text-zinc-800 border-transparent hover:bg-zinc-50"
            }`}
          >
            <Globe className="w-5 h-5" />
            <span>COMMUNITY</span>
          </Link>

          <hr className="border-zinc-300" />

          {isAuthenticated ? (
            <div className="px-3 py-1 space-y-2">
              <div className="bg-zinc-50 p-2.5 border-2 border-zinc-950">
                <p className="text-[10px] text-zinc-500 font-sans uppercase font-bold">Logged in as</p>
                <p className="font-bebas text-base font-bold text-zinc-950">{user?.name || "Reader"}</p>
                <p className="text-xs text-zinc-600 font-mono truncate">{user?.email}</p>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 w-full font-bebas text-lg font-bold text-zinc-800 py-1.5 hover:text-[#CC0000] transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>DASHBOARD</span>
              </Link>

              {/* Mobile Mobile Advanced Features list */}
              <div className="border-t border-dashed border-zinc-300 pt-2 mt-2">
                <span className="text-[10px] font-bold font-mono text-[#CC0000] block mb-1">ADVANCED FEATURES</span>
                
                <Link
                  href="/integrations"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full font-bebas text-base font-bold text-zinc-700 py-1.5 hover:text-[#CC0000]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>MULTI-PLATFORM SYNC</span>
                </Link>
                <Link
                  href="/ledger"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full font-bebas text-base font-bold text-zinc-700 py-1.5 hover:text-[#CC0000]"
                >
                  <Book className="w-4 h-4" />
                  <span>HYBRID LEDGER</span>
                </Link>
                <Link
                  href="/scan"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full font-bebas text-base font-bold text-zinc-700 py-1.5 hover:text-[#CC0000]"
                >
                  <Camera className="w-4 h-4" />
                  <span>SCAN-TO-TRACK</span>
                </Link>
                <Link
                  href="/recommendations"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full font-bebas text-base font-bold text-zinc-700 py-1.5 hover:text-[#CC0000]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI RECOMMENDATIONS</span>
                </Link>
                <Link
                  href="/predictions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full font-bebas text-base font-bold text-zinc-700 py-1.5 hover:text-[#CC0000]"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>RELEASE PREDICTIONS</span>
                </Link>
                <Link
                  href="/filters"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full font-bebas text-base font-bold text-zinc-700 py-1.5 hover:text-[#CC0000]"
                >
                  <Sliders className="w-4 h-4" />
                  <span>SMART FILTERS</span>
                </Link>
              </div>

              <hr className="border-zinc-300" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full font-bebas text-lg font-bold text-[#CC0000] py-1.5 text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>LOGOUT</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-3 pt-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center font-bebas text-lg font-bold tracking-widest text-zinc-950 py-2 border-2 border-zinc-950 hover:bg-zinc-50 transition-all"
              >
                LOGIN
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center font-bebas text-lg font-bold tracking-widest bg-[#CC0000] text-white py-2 border-2 border-zinc-950 shadow-[3px_3px_0px_#000] active:translate-y-[0px] active:shadow-[1px_1px_0px_#000] transition-all"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
