# Shonen Command Center (MangaVibe UI)

This document establishes the styling tokens, visual guidelines, and component rules to enforce a high-influence **Anime/Manga Design Language** (Shonen Command Center UI) across all frontend pages and components. It draws inspiration from shonen battle tropes, power-level scanner interfaces, futuristic tracking dashboards, and classic print manga magazine aesthetics while maintaining a clean, professional visual structure.

---

## 1. Visual Theme & Concept

The **"Shonen Command Center"** fuses four distinct worlds into a unified user interface:
1. **Classic Manga Page Layout:** Heavy black ink boarders, screentones, and dynamic panel frames.
2. **Futuristic Power-Level Scanner:** Battle scanner displays (e.g., green/red tracking guides, holographic grids).
3. **Command Dashboard:** Clean, legible telemetry for tracking chapter lists and viewing stats.
4. **Japanese Manga Magazine Covers:** Bold, aggressive typography, slanted accents, and high-contrast color highlights.

---

## 2. Color System & Design Tokens

### A. Primary Brand Colors
| Token Name | Hex Code | Use Case / Application |
| :--- | :--- | :--- |
| **Shonen Orange** | `#FF6B00` | Primary actions (CTA), active tabs, dynamic highlights, hover glows |
| **Ninja Blue** | `#0077FF` | Links, status tags, notification indicators, AI feature borders |
| **Super Saiyan Gold** | `#FFD700` | Ranking indicators (#1-3), premium badges, trending tags, legendary stats |

### B. Dark Theme Background & Surfaces
| Token Name | Hex Code | Use Case / Application |
| :--- | :--- | :--- |
| **Main Background** | `#0B0F1A` | Canvas background (very dark, moody navy) |
| **Secondary Background** | `#121827` | Content cards, manga panels, input form fills |
| **Surface Hover** | `#1A2336` | Active item selections, menu item hover, elevated state outlines |
| **Accent Red** | `#FF2E63` | Alerts, critical deletions, trending/hot icons, special action highlights |

### C. Typography Rules
* **Headings (Anime Title Energy):** Use `Bebas Neue` or `Anton`. These fonts are optimized for uppercase, high-impact headlines (e.g., `TRACK EVERY CHAPTER. MISS NOTHING.`).
* **Body Text (Modern Readability):** Use `Inter`. Clean, neutral, high-legibility sans-serif font for stats, logs, summaries, and forms.
* **Japanese Accent (Decorative Labels):** Use `Noto Sans JP` (e.g., `友情` [Friendship], `努力` [Effort], `勝利` [Victory]) in low opacity backdrops to add authentic manga-culture accents.

---

## 3. Signature Layout & Components

### A. Hero Section
* **Left Content:** Big titles in `Bebas Neue`, subheadlines detailing features, and clip-path buttons.
* **Right Content:** Holographic "Command Center" dashboard mockups displaying:
  * Power Scanner UI elements.
  * System telemetry (e.g., `Tracking: 342 Manga`, `Watching: 87 Anime`, `Unread: 12`).
  * Floating notification toast: `⚡ New Chapter Detected: Kingdom Ch. 850 (2m ago)`.
  * AI sensei chat bubble: `Ask Sensei AI: "Recommend dark fantasy like Berserk"`.

### B. Top Ranked Manga (Bounty Poster Cards)
* Styled as manga **Bounty Posters** using heavy box shadows and thin borders.
* Includes rank badges using **Super Saiyan Gold** (`#FFD700`).
* **Hover State:** Card "powers up" with an outer glow using `box-shadow: 0 0 15px rgba(255, 107, 0, 0.4)` and a translateY shift.

### C. Feature Panels (Manga Panels)
* Arrange features in irregular comic book panel frames using CSS grids and `clip-path` cuts.
* Features to include:
  1. **Chapter Tracking:** Radar scanner icon; automatic updates of followed series.
  2. **Anime Tracking:** TV monitor icon; episode release schedules.
  3. **Notifications:** Lightning bolt icon; real-time browser push alerts.
  4. **AI Sensei:** Robot + book icon; recommendation and summary engine.
  5. **Rankings:** Crown icon; tracking of trending weekly hits.
  6. **Reading Statistics:** Bar chart icon; personal dashboard metrics.

### D. AI Sensei Terminal
* Styled as an anime battle scanner or diagnostic terminal.
* Text uses an animated typewriter typing effect.
* Prompt example: `Recommend me manga similar to Vinland Saga.`
* Response recommendation chips: `Kingdom`, `Golden Kamuy`, `Vagabond`, `Historie`.

### E. Live Notification Demo
* An interactive phone or app mockup showing alerts sliding in from the right:
  * `🔥 Solo Leveling Chapter 250 Released`
  * `⚡ One Piece Chapter 1115 Released`
  * `⭐ New Episode Available`

---

## 4. Key Visual & Styling Guidelines

### A. Angled Elements (Clip-Paths)
* Avoid standard rounded boxes for main call-to-actions. Buttons and prominent tabs must use angled edges:
  ```css
  .anime-button-cut {
    clip-path: polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%);
  }
  ```

### B. Manga Speed Lines & Halftones
* Backdrop details should include subtle speed lines using CSS repeating linear gradients:
  ```css
  .manga-speedlines {
    background: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.03),
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 10px
    );
  }
  ```
* Incorporate floating decorative Japanese characters (`友情`, `努力`, `勝利`) at a very low opacity (`opacity: 0.04 - 0.08`) absolute positioned in the layout background.

### C. Bold Shadows (Cell Shading)
* Outlines and shadows should replicate clean manga shading:
  ```css
  .manga-shadow {
    border: 2px solid #FFFFFF;
    box-shadow: 5px 5px 0px var(--shonen-orange, #FF6B00);
  }
  ```

---

## 5. Animation Token Specifications

* **Parallax Scroll:** Applied on background floating items in the Hero section.
* **Glow Rise:** Hover transitions on cards: `transform: translateY(-8px)` with a fast easing transition (`transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s ease`).
* **Alert Slide-in:** Slide animations for notifications: `keyframes slideInFromRight { from { transform: translateX(120%); } to { transform: translateX(0); } }`.
* **Pulse Core:** Soft pulse animations on AI Assistant components to denote scanner/idle listening activity.
