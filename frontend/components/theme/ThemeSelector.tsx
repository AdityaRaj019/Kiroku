"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Paintbrush } from "lucide-react";
import { MANGA_THEMES } from "./index";

interface ThemeSelectorProps {
  scopeClass?: string; // Target CSS class to scope overrides to (e.g. 'manga-theme-scope')
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ scopeClass = "manga-theme-scope" }) => {
  const [activeThemeId, setActiveThemeId] = useState<string>("default");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("kiroku-theme-id");
    if (saved) {
      setTimeout(() => {
        setActiveThemeId(saved);
      }, 0);
    }
  }, []);

  const handleThemeChange = (id: string) => {
    setActiveThemeId(id);
    localStorage.setItem("kiroku-theme-id", id);
  };

  const activeTheme = useMemo(() => {
    return MANGA_THEMES.find((t) => t.id === activeThemeId) || MANGA_THEMES[0];
  }, [activeThemeId]);

  const primaryAlphaColor = useMemo(() => {
    const hex = activeTheme.colors.primary;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return isNaN(r) || isNaN(g) || isNaN(b)
      ? "rgba(204, 0, 0, 0.12)"
      : `rgba(${r}, ${g}, ${b}, 0.12)`;
  }, [activeTheme]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .${scopeClass} {
          --theme-bg: ${activeTheme.colors.background};
          --theme-card-bg: ${activeTheme.colors.cardBackground};
          --theme-text-primary: ${activeTheme.colors.textPrimary};
          --theme-text-secondary: ${activeTheme.colors.textSecondary};
          --theme-primary: ${activeTheme.colors.primary};
          --theme-primary-hover: ${activeTheme.colors.primaryHover};
          --theme-accent: ${activeTheme.colors.accent};
          --theme-border: ${activeTheme.colors.border};
          --theme-shadow: ${activeTheme.colors.shadow};
          --theme-badge-bg: ${activeTheme.colors.badgeBg};
          --theme-badge-text: ${activeTheme.colors.badgeText};
          --theme-primary-alpha: ${primaryAlphaColor};
        }

        /* Scoped overrides for theme */
        .${scopeClass} {
          background-color: var(--theme-bg) !important;
          color: var(--theme-text-primary) !important;
        }

        .${scopeClass} .bg-\[\#FAF9F6\] {
          background-color: var(--theme-bg) !important;
        }

        .${scopeClass} .bg-white {
          background-color: var(--theme-card-bg) !important;
        }

        .${scopeClass} .bg-\[\#CC0000\],
        .${scopeClass} .bg-red-600 {
          background-color: var(--theme-primary) !important;
          color: var(--theme-badge-text) !important;
        }

        .${scopeClass} .hover\:bg-\[\#CC0000\]:hover,
        .${scopeClass} .hover\:bg-red-700:hover {
          background-color: var(--theme-primary-hover) !important;
        }

        .${scopeClass} .hover\:bg-\[\#CC0000\]\/5:hover,
        .${scopeClass} .group:hover .group-hover\:bg-\[\#CC0000\]\/5 {
          background-color: var(--theme-primary-alpha) !important;
        }

        .${scopeClass} .bg-zinc-100 {
          background-color: var(--theme-bg) !important;
          opacity: 0.9;
        }

        .${scopeClass} .text-zinc-950,
        .${scopeClass} .text-zinc-900,
        .${scopeClass} .text-zinc-800,
        .${scopeClass} .text-zinc-700,
        .${scopeClass} .text-black,
        .${scopeClass} h1,
        .${scopeClass} h2,
        .${scopeClass} h3,
        .${scopeClass} h4 {
          color: var(--theme-text-primary) !important;
        }

        .${scopeClass} .text-zinc-600,
        .${scopeClass} .text-zinc-500,
        .${scopeClass} .text-zinc-400 {
          color: var(--theme-text-secondary) !important;
        }

        .${scopeClass} .text-\[\#CC0000\],
        .${scopeClass} .group:hover .group-hover\:text-\[\#CC0000\] {
          color: var(--theme-primary) !important;
        }

        .${scopeClass} .fill-\[\#CC0000\] {
          fill: var(--theme-primary) !important;
        }

        .${scopeClass} .border-zinc-950,
        .${scopeClass} .border-black {
          border-color: var(--theme-border) !important;
        }

        .${scopeClass} .border-zinc-200,
        .${scopeClass} .border-zinc-300 {
          border-color: var(--theme-text-secondary) !important;
        }

        .${scopeClass} .shadow-\[1px_1px_0px_\#000\] { box-shadow: 1px 1px 0px var(--theme-shadow) !important; }
        .${scopeClass} .shadow-\[2px_2px_0px_\#000\] { box-shadow: 2px 2px 0px var(--theme-shadow) !important; }
        .${scopeClass} .shadow-\[3px_3px_0px_\#000\] { box-shadow: 3px 3px 0px var(--theme-shadow) !important; }
        .${scopeClass} .shadow-\[4px_4px_0px_\#000\] { box-shadow: 4px 4px 0px var(--theme-shadow) !important; }
        .${scopeClass} .shadow-\[6px_6px_0px_\#000\] { box-shadow: 6px 6px 0px var(--theme-shadow) !important; }
        .${scopeClass} .shadow-\[8px_8px_0px_\#000\] { box-shadow: 8px 8px 0px var(--theme-shadow) !important; }
        .${scopeClass} .hover\:shadow-\[8px_8px_0px_\#000\]:hover { box-shadow: 8px 8px 0px var(--theme-shadow) !important; }

        .${scopeClass} select,
        .${scopeClass} input[type="text"],
        .${scopeClass} input[type="range"] {
          background-color: var(--theme-card-bg) !important;
          color: var(--theme-text-primary) !important;
          border-color: var(--theme-border) !important;
        }
        .${scopeClass} .accent-\[\#CC0000\] {
          accent-color: var(--theme-primary) !important;
        }
        .${scopeClass} .bg-\[radial-gradient\(rgba\(204\,0\,0\,0\.12\)_1\.5px\,transparent_0\)\] {
          background-image: radial-gradient(var(--theme-primary-alpha) 1.5px, transparent 0) !important;
        }
        .${scopeClass} .bg-\[radial-gradient\(rgba\(204\,0\,0\,0\.08\)_1\.5px\,transparent_0\)\] {
          background-image: radial-gradient(var(--theme-primary-alpha) 1.5px, transparent 0) !important;
        }
      ` }} />

      {/* Floating Theme Selector Button & Popover (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <div className="relative flex flex-col items-end">
          {/* Popover Menu */}
          {isThemeMenuOpen && (
            <div className="mb-4 w-56 bg-white border-4 border-zinc-950 p-3.5 shadow-[6px_6px_0px_#000] rounded-none space-y-2.5 animate-fade-in font-sans">
              <h4 className="font-bebas text-lg font-bold tracking-wider text-zinc-950 border-b-2 border-dashed border-zinc-200 pb-1.5 uppercase">
                Choose Universe Theme
              </h4>
              <div className="flex flex-col gap-1.5">
                {MANGA_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      handleThemeChange(theme.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full font-bebas text-xs px-2.5 py-1.5 border-2 border-zinc-950 shadow-[1.5px_1.5px_0px_#000] active:translate-y-[0.5px] active:shadow-[0.5px_0.5px_0px_#000] transition-all cursor-pointer font-bold tracking-wider flex items-center gap-2 uppercase select-none ${
                      activeThemeId === theme.id
                        ? "bg-[#CC0000] text-white"
                        : "bg-white text-zinc-950 hover:bg-[#CC0000]/5"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 border border-zinc-950 rounded-full shrink-0"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <span className="truncate">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trigger FAB */}
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="w-12 h-12 flex items-center justify-center bg-[#CC0000] text-white border-4 border-zinc-950 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all cursor-pointer rounded-none hover:bg-[#CC0000]/90"
            title="Choose Page Theme"
          >
            <Paintbrush className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>
    </>
  );
};
