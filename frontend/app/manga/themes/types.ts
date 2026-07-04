export interface MangaTheme {
  id: string;
  name: string;
  isDark?: boolean;
  colors: {
    background: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    primaryHover: string;
    accent: string;
    border: string;
    shadow: string;
    badgeBg: string;
    badgeText: string;
  };
}
