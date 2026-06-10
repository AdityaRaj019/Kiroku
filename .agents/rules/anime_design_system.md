# MangaPulse Anime-Style Design System (MangaVibe UI)

This document establishes the styling tokens, visual guidelines, and component rules to enforce a high-influence **Anime/Manga Design Language** (MangaVibe UI) across all frontend pages and components. It draws inspiration from shonen titles, cyberpunk aesthetics, and halftone print textures.

---

## 1. Visual Theme & Color Palette

We utilize a **Harajuku Neon & Cyberpunk Dark** palette. It combines a dark, moody canvas with piercing, vibrant neon accents reminiscent of night-time Tokyo.

```text
Midnight Violet (Canvas) ──> Neon Sakura Pink (Primary) ──> Electric Cyan (Secondary) ──> Toxic Lime (Success)
```

| Token Name | Hex Code | Tailwind Equivalent | Use Case |
| :--- | :--- | :--- | :--- |
| **Midnight Base** | `#080511` | `bg-neutral-950` | Primary application canvas background |
| **Dark Violet** | `#120A2A` | `bg-violet-950/20` | Card and secondary container backgrounds |
| **Neon Sakura** | `#FF1E75` | `text-pink-500` / `bg-pink-600` | Primary actions, follow buttons, unread badges |
| **Electric Cyan** | `#00F0FF` | `text-cyan-400` / `bg-cyan-500` | Webhooks, sockets, loading states, secondary links |
| **Toxic Lime** | `#39FF14` | `text-lime-400` | Read chapter progress indicators, status online |
| **Aura Gold** | `#FFD700` | `text-amber-400` | Popular tags, system announcements, highlights |

---

## 2. Signature Design Elements (The Manga Vibe)

To make components feel distinctly "Anime/Manga", we use four signature CSS effects:

### A. Halftone Print Texture (Manga Screentones)
Classic manga uses dots for shading. We replicate this in CSS using repeating radial gradients as backdrops for panels and headers:
```css
.manga-screentone {
  background-image: radial-gradient(rgba(255, 30, 117, 0.15) 1px, transparent 0);
  background-size: 12px 12px;
}
```

### B. Asymmetric Cuts & Skewed Bounds
Perfect boxes look like standard SaaS templates. Anime UI should feel sharp, dynamic, and angled:
* Use minor skews: `hover:skew-x-1 hover:-rotate-1`
* Use polygon clip-paths for diagonal button cuts:
  ```css
  .anime-cut {
    clip-path: polygon(0% 0%, 90% 0%, 100% 100%, 0% 100%);
  }
  ```

### C. Bold Borders & Hard Shadows (Cell-Shading)
Use thick, high-contrast borders and offsets instead of soft, blurry box-shadows:
```css
.manga-card {
  border: 2px solid #ffffff;
  box-shadow: 4px 4px 0px #FF1E75;
  transition: transform 0.2s, box-shadow 0.2s;
}
.manga-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #00F0FF;
}
```

### D. Action/Speedlines (Active Hover backdrops)
Add subtle overlay animations simulating shonen action/speed lines on hovered states or details backdrops.

---

## 3. Typography Guide

Use Google Fonts loaded in the Next.js root layout:
* **Headings (Display):** **Space Grotesk** or **Oxanium** (cyberpunk, futuristic, hard angles).
* **Body Text:** **Inter** or **Plus Jakarta Sans** (clean, high legibility on dark backgrounds).

---

## 4. Component Rules

* **Buttons:** Must have hard borders and offset card shadows. Hovering should slide a neon background diagonally from left to right.
* **Cards:** Cover images must zoom slightly on hover (`overflow-hidden group-hover:scale-105 transition-transform duration-300`).
* **Tags:** Badges should resemble stamp cuts or neon warning tags (e.g. `[ EN ]` or `[ HOT ]`).
* **Modals:** Slide into view with a scale pop effect (`scale-95 to scale-100`) and a dark violet glassmorphism backdrop (`backdrop-blur-md bg-neutral-950/70`).
