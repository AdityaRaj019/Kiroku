---
name: frontend-design
description: Guidelines for frontend layout creation, styling, CSS variables, component design, responsive styling, and micro-animations
---

# Instructions

- **Responsive Styling:** Always design Mobile-First. Leverage media queries or responsive utilities (e.g., Tailwind breakpoints) to ensure layouts scale fluidly from small mobile screens to large ultra-wide monitors.
- **CSS Variables & Theme System:** Define colors, fonts, spacing, and border-radii using CSS custom properties (variables). Always use HSL values for colors to support easy opacity adjustments (`hsla(var(--primary), 0.5)`).
- **Component Architecture:** Build single-purpose, highly cohesive, reusable components. Keep state close to where it's used. Prefer named exports over default exports.
- **Accessibility (A11y):** Ensure all interactive elements have semantic HTML (`<button>`, `<a>`, `<input>`). Provide explicit `aria-label` tags for elements that only display icons, and verify appropriate contrast ratios.
- **Micro-Animations & Transitions:** Add subtle animations on hover, focus, and state transitions. Use CSS transitions for properties like `transform`, `opacity`, and `background-color`. Never animate performance-heavy properties like `width`, `height`, `top`, or `left`.

# Gotchas

- **Cumulative Layout Shift (CLS):** Images and dynamic containers without specified aspect ratios or dimensions can cause layouts to jump when loading. Always define dimensions or use placeholders.
- **Contrast Ratios:** Pure white on light gray or light gray text on white background violates WCAG standards. Keep contrast ratios high (minimum 4.5:1 for normal text).
- **Z-Index Hell:** Unorganized z-index layers can cause modals, dropdowns, and overlays to render underneath background elements. Always use a centralized z-index naming system or scale.

# Validation Loops

1.  **Component Scaffolding:** Create the component in isolation.
2.  **Lint & Formatter Check:** Run the compiler and style checks to ensure there are no formatting or syntax errors.
3.  **Visual Proofing:** Verify the component's appearance across mobile, tablet, and desktop breakpoints. Check hover and focus states.
4.  **Aria Check:** Inspect the rendered DOM elements to ensure correct ARIA roles and keyboard navigation (Tab/Enter/Space) work properly.
