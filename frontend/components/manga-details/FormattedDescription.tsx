"use client";

import React, { useMemo } from "react";
import { Link2, Sparkles } from "lucide-react";

interface FormattedDescriptionProps {
  synopsis: string;
}

interface ParsedLink {
  label: string;
  url: string;
}

export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({ synopsis }) => {
  const parsed = useMemo(() => {
    if (!synopsis) {
      return { mainText: "No synopsis available.", altTitles: [] as string[], links: [] as ParsedLink[] };
    }

    let mainText = synopsis;
    const altTitles: string[] = [];
    const links: ParsedLink[] = [];

    // 1. Parse BBCode links like [url=https://...]Label[/url] or [url]https://...[/url]
    const bbcodeLinkRegex = /\[url=([^\]]+)\]([^\[]+)\[\/url\]/gi;
    let match;
    while ((match = bbcodeLinkRegex.exec(synopsis)) !== null) {
      links.push({ url: match[1], label: match[2] });
    }

    // Clean up BBCode links from main text
    mainText = mainText.replace(/\[url=[^\]]+\]([^\[]+)\[\/url\]/gi, "$1");
    mainText = mainText.replace(/\[url\]([^\[]+)\[\/url\]/gi, "$1");

    // 2. Split out Alternative Titles if they are marked with --- or standard headers
    // Frequently, MangaDex synopses separate sections with a horizontal rule (---)
    const sections = mainText.split(/(?:^|\n)(?:---|___|\*\*\*)+(?:\n|$)/);
    
    if (sections.length > 1) {
      mainText = sections[0].trim();
      const secondaryPart = sections.slice(1).join("\n");

      // Extract lines that look like alternative titles
      const lines = secondaryPart.split("\n");
      let inAltSection = false;

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        if (/alternative|alt titles|alt names|associated names/i.test(trimmed)) {
          inAltSection = true;
          return;
        }

        if (inAltSection) {
          // If the line starts with list markers
          if (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•")) {
            altTitles.push(trimmed.replace(/^[-*•]\s*/, ""));
          } else if (trimmed.includes(":") || trimmed.length > 40) {
            // Stop parsing if we hit another colon or long paragraph
            inAltSection = false;
          } else {
            altTitles.push(trimmed);
          }
        }
      });
    }

    // Cleanup residual Markdown from the main synopsis
    mainText = mainText.replace(/(?:^|\n)(?:Alternative Titles|Alt Titles|Alternative Names):?[\s\S]*$/gi, "").trim();

    return { mainText, altTitles, links };
  }, [synopsis]);

  // Renders text line by line, formatting **bold** tags inline
  const renderFormattedParagraphs = (text: string) => {
    const lines = text.split("\n");
    
    return lines.map((line, pIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={pIdx} className="h-2" />;

      // Split line by markdown bold pattern: (**bold text**)
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      
      return (
        <p key={pIdx} className="text-sm text-zinc-700 leading-relaxed font-sans font-medium text-justify mb-2.5">
          {parts.map((part, partIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={partIdx} className="font-extrabold text-zinc-950 uppercase tracking-wide">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t-2 border-dashed border-zinc-200 pt-4">
      {/* Main Synopsis Area */}
      <div className={`${parsed.altTitles.length > 0 || parsed.links.length > 0 ? "md:col-span-8" : "md:col-span-12"}`}>
        <h3 className="font-bebas text-lg tracking-wider text-zinc-950 uppercase font-bold mb-2">
          Synopsis
        </h3>
        <div className="space-y-1">
          {renderFormattedParagraphs(parsed.mainText)}
        </div>
      </div>

      {/* Alternative Metadata / Tidbits Sidebar Column */}
      {(parsed.altTitles.length > 0 || parsed.links.length > 0) && (
        <div className="md:col-span-4 border-2 md:border-l-4 md:border-t-0 md:border-r-0 md:border-b-0 border-zinc-950 md:pl-6 pt-4 md:pt-0 space-y-4">
          
          {/* Alternative Titles */}
          {parsed.altTitles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bebas text-sm tracking-wider text-zinc-900 uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#CC0000]" />
                Alternate Titles
              </h4>
              <ul className="space-y-1.5">
                {parsed.altTitles.map((title, idx) => (
                  <li key={idx} className="text-[11px] font-sans font-semibold text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-none">
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* External Links */}
          {parsed.links.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bebas text-sm tracking-wider text-zinc-900 uppercase font-bold flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-[#CC0000]" />
                Official Links
              </h4>
              <div className="flex flex-col gap-1.5">
                {parsed.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono font-bold text-[#CC0000] hover:text-[#CC0000]/80 underline flex items-center gap-1 break-all truncate"
                  >
                    &bull; {link.label || "External URL"}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
export default FormattedDescription;
