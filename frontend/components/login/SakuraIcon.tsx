import React from "react";

interface SakuraIconProps {
  className?: string;
}

export const SakuraIcon: React.FC<SakuraIconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 50 C45 35, 30 25, 25 35 C20 45, 35 50, 50 50 Z"
      fill="url(#sakura-grad)"
    />
    <path
      d="M50 50 C65 35, 80 25, 75 35 C70 45, 65 50, 50 50 Z"
      fill="url(#sakura-grad)"
    />
    <path
      d="M50 50 C65 65, 80 75, 75 65 C70 55, 65 50, 50 50 Z"
      fill="url(#sakura-grad)"
    />
    <path
      d="M50 50 C35 65, 20 75, 25 65 C30 55, 35 50, 50 50 Z"
      fill="url(#sakura-grad)"
    />
    <circle cx="50" cy="50" r="6" fill="#FCA5A5" />
    <defs>
      <linearGradient id="sakura-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5FA8" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
  </svg>
);
