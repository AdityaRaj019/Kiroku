"use client";

import React from "react";
import { BarChart3, Clock, Milestone } from "lucide-react";
import { Stats } from "@/utils/mangaDetailsEnricher";

interface StatsPanelProps {
  stats: Stats;
  totalChapters: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, totalChapters }) => {
  const {
    reading = 0,
    completed = 0,
    onHold = 0,
    dropped = 0,
    planToRead = 0,
    releaseFrequency = "Weekly",
    nextChapterReleaseDate = "Next Wednesday",
  } = stats;

  const totalActions = reading + completed + onHold + dropped + planToRead;

  // Percentage calculations for stacked chart bar
  const pctReading = totalActions > 0 ? (reading / totalActions) * 100 : 0;
  const pctCompleted = totalActions > 0 ? (completed / totalActions) * 100 : 0;
  const pctOnHold = totalActions > 0 ? (onHold / totalActions) * 100 : 0;
  const pctDropped = totalActions > 0 ? (dropped / totalActions) * 100 : 0;
  const pctPlanToRead = totalActions > 0 ? (planToRead / totalActions) * 100 : 0;

  return (
    <div className="w-full bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000] space-y-6">
      
      {/* Header */}
      <h2 className="font-bebas text-2xl md:text-3xl font-black tracking-wider text-zinc-950 border-b-4 border-zinc-950 pb-3 uppercase flex items-center gap-2">
        <BarChart3 className="w-6 h-6 shrink-0" style={{ color: "var(--theme-primary)" }} />
        Community Reading Stats
      </h2>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        {/* Reading */}
        <div className="border-2 border-zinc-950 p-3 bg-zinc-50 flex flex-col justify-between shadow-[2px_2px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase leading-none mb-1">Reading</span>
          <span className="font-bebas text-xl md:text-2xl font-bold text-[#CC0000] tracking-wide leading-none uppercase">
            {reading.toLocaleString()}
          </span>
        </div>

        {/* Completed */}
        <div className="border-2 border-zinc-950 p-3 bg-zinc-50 flex flex-col justify-between shadow-[2px_2px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase leading-none mb-1">Completed</span>
          <span className="font-bebas text-xl md:text-2xl font-bold text-green-700 tracking-wide leading-none uppercase">
            {completed.toLocaleString()}
          </span>
        </div>

        {/* On Hold */}
        <div className="border-2 border-zinc-950 p-3 bg-zinc-50 flex flex-col justify-between shadow-[2px_2px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase leading-none mb-1">On Hold</span>
          <span className="font-bebas text-xl md:text-2xl font-bold text-orange-600 tracking-wide leading-none uppercase">
            {onHold.toLocaleString()}
          </span>
        </div>

        {/* Dropped */}
        <div className="border-2 border-zinc-950 p-3 bg-zinc-50 flex flex-col justify-between shadow-[2px_2px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase leading-none mb-1">Dropped</span>
          <span className="font-bebas text-xl md:text-2xl font-bold text-zinc-600 tracking-wide leading-none uppercase">
            {dropped.toLocaleString()}
          </span>
        </div>

        {/* Plan to Read */}
        <div className="border-2 border-zinc-950 p-3 bg-zinc-50 flex flex-col justify-between shadow-[2px_2px_0px_#000] col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase leading-none mb-1">Plan to Read</span>
          <span className="font-bebas text-xl md:text-2xl font-bold text-blue-700 tracking-wide leading-none uppercase">
            {planToRead.toLocaleString()}
          </span>
        </div>

      </div>

      {/* Stacked Chart Bar */}
      {totalActions > 0 && (
        <div className="space-y-1.5">
          <div className="h-5 w-full border-2 border-zinc-950 bg-zinc-200 flex overflow-hidden shadow-[1px_1px_0px_#000]">
            <div className="h-full bg-[#CC0000]" style={{ width: `${pctReading}%` }} title={`Reading: ${pctReading.toFixed(1)}%`} />
            <div className="h-full bg-green-700" style={{ width: `${pctCompleted}%` }} title={`Completed: ${pctCompleted.toFixed(1)}%`} />
            <div className="h-full bg-orange-600" style={{ width: `${pctOnHold}%` }} title={`On Hold: ${pctOnHold.toFixed(1)}%`} />
            <div className="h-full bg-zinc-500" style={{ width: `${pctDropped}%` }} title={`Dropped: ${pctDropped.toFixed(1)}%`} />
            <div className="h-full bg-blue-700" style={{ width: `${pctPlanToRead}%` }} title={`Plan to Read: ${pctPlanToRead.toFixed(1)}%`} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-mono font-bold text-zinc-500 uppercase">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#CC0000] border border-zinc-950 inline-block" /> Reading ({pctReading.toFixed(0)}%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-700 border border-zinc-950 inline-block" /> Completed ({pctCompleted.toFixed(0)}%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-orange-600 border border-zinc-950 inline-block" /> On Hold ({pctOnHold.toFixed(0)}%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-zinc-500 border border-zinc-950 inline-block" /> Dropped ({pctDropped.toFixed(0)}%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-700 border border-zinc-950 inline-block" /> Plan to Read ({pctPlanToRead.toFixed(0)}%)</span>
          </div>
        </div>
      )}

      {/* Release Info & Next Chapter Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-dashed border-zinc-200 pt-5">
        
        {/* Next Chapter Release */}
        <div className="flex gap-3 items-center border-2 border-zinc-950 bg-[#CC0000]/5 p-3.5 shadow-[2px_2px_0px_#000]">
          <Clock className="w-6 h-6 text-[#CC0000] shrink-0" />
          <div>
            <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase leading-none mb-0.5">
              Next Chapter Release
            </div>
            <span className="font-bebas text-lg font-bold tracking-wide text-[#CC0000] uppercase block">
              {nextChapterReleaseDate}
            </span>
          </div>
        </div>

        {/* Release Frequency */}
        <div className="flex gap-3 items-center border-2 border-zinc-950 bg-zinc-50 p-3.5 shadow-[2px_2px_0px_#000]">
          <Milestone className="w-6 h-6 text-[#CC0000] shrink-0" />
          <div>
            <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase leading-none mb-0.5">
              Release Frequency
            </div>
            <span className="font-bebas text-lg font-bold tracking-wide text-zinc-950 uppercase block">
              {releaseFrequency}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
