import React from "react";

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ className = "", children }) => (
  <div
    className={`backdrop-blur-[18px] bg-white/[0.03] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-[24px] p-5 text-white/90 select-none ${className}`}
  >
    {children}
  </div>
);
