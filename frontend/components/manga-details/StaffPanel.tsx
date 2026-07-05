"use client";

import React from "react";
import { Award, Briefcase } from "lucide-react";
import { Staff } from "@/utils/mangaDetailsEnricher";

interface StaffPanelProps {
  staff: Staff[];
}

export const StaffPanel: React.FC<StaffPanelProps> = ({ staff }) => {
  return (
    <div className="w-full bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000] space-y-4">
      
      {/* Header */}
      <h2 className="font-bebas text-2xl md:text-3xl font-black tracking-wider text-zinc-950 border-b-4 border-zinc-950 pb-3 uppercase flex items-center gap-2">
        <Briefcase className="w-6 h-6 shrink-0" style={{ color: "var(--theme-primary)" }} />
        Production Staff
      </h2>

      {/* Staff Grid */}
      {staff && staff.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {staff.map((person, index) => (
            <div
              key={`${person.name}-${person.role}-${index}`}
              className="bg-zinc-50 border-2 border-zinc-950 p-3 flex items-center gap-3 shadow-[2.5px_2.5px_0px_#000]"
            >
              <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-950 flex items-center justify-center shrink-0 text-[#FFD700]">
                <Award className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase leading-none mb-0.5">
                  {person.role}
                </div>
                <span className="font-bebas text-md md:text-lg font-bold tracking-wide text-zinc-950 uppercase truncate block">
                  {person.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm font-sans font-medium text-zinc-500 py-2 text-center">
          No crew or staff data available.
        </p>
      )}

    </div>
  );
};
