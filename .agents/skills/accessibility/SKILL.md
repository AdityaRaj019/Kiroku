---
name: accessibility
description: Guidelines for accessible UI implementation including semantics, keyboard support, focus management, ARIA, contrast, and reduced motion
---

# Instructions

- **Semantic HTML First:** Prefer native elements (`button`, `a`, `label`, `input`, `select`, `dialog`, `fieldset`) before adding ARIA. ARIA should clarify behavior, not replace correct markup.
- **Keyboard Completeness:** Every interactive control must be reachable with Tab and usable with Enter, Space, or arrow keys according to the control pattern.
- **Visible Focus:** Preserve clear `:focus-visible` styling. Never remove outlines unless a replacement focus indicator is provided with sufficient contrast.
- **Accessible Names:** Icon-only buttons, form controls, landmarks, and custom widgets must have stable accessible names using visible text, `aria-label`, `aria-labelledby`, or associated labels.
- **Dialog & Overlay Safety:** Modals, drawers, menus, and popovers must manage focus on open, trap focus where appropriate, restore focus on close, and close predictably with Escape.
- **Contrast & Motion:** Text and essential UI indicators must meet WCAG contrast expectations. Respect `prefers-reduced-motion` for non-essential animation.

# Gotchas

- **Clickable Divs:** `div` or `span` elements with click handlers are not buttons unless keyboard behavior, role, focus, and disabled semantics are also implemented. Prefer a real `button`.
- **ARIA Overuse:** Incorrect ARIA can make a UI less accessible than plain HTML. Do not add roles or states unless they match the component behavior.
- **Focus Loss:** Re-rendering lists, dialogs, or forms can unexpectedly drop focus to the document body. Preserve focus through stable keys and explicit focus restoration.
- **Color-Only State:** Error, success, selected, and disabled states must not be communicated only by color.

# Validation Loops

1.  **Keyboard Pass:** Navigate the new UI using only Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where relevant.
2.  **Screen Reader Pass:** Inspect accessible names, roles, and live regions using browser accessibility tools or a screen reader.
3.  **Contrast Pass:** Verify foreground/background contrast for text, icons, focus rings, and error states.
4.  **Motion Pass:** Enable reduced motion and confirm the UI remains usable without essential information hidden in animation.
