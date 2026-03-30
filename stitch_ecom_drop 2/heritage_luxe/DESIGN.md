# Design System Document

## 1. Overview & Creative North Star: "The Heritage Modernist"

This design system is a sophisticated bridge between the storied elegance of ethnic South Asian fashion and the razor-sharp precision of high-end digital commerce. Our Creative North Star is **"The Heritage Modernist."** 

We are not building a generic storefront; we are curating a digital atelier. To achieve this, we move beyond the "boxed" constraints of traditional Shopify templates. We utilize **intentional asymmetry**, allowing high-quality editorial photography to break the container, and **tonal layering** to create depth without the clutter of lines. This system prioritizes breathing room (whitespace) and typographic authority to evoke trust, heritage, and exclusivity.

---

## 2. Colors

The palette is anchored in organic, tactile tones that feel like high-grade cottons and silks, punctuated by a deep "Regal Green" for authoritative action.

### The Foundation
*   **Background (`#F9F9F7`):** A warm, off-white "creamy" base. Never use pure #FFFFFF for large surfaces; the off-white creates a softer, more premium "paper" feel.
*   **Primary (`#00261B`) & Primary Container (`#0B3D2E`):** Our "Regal Green." Use this for key CTAs, trust badges, and headers where brand authority must be absolute.
*   **Secondary (`#775A19`):** Our "Subtle Gold." Used for highlights, refined icons, and accent text. It should feel like a gold-leaf inlay—sparing and precious.

### The "No-Line" Rule
Sectioning must never be achieved with `1px solid` borders. Instead, define boundaries through:
*   **Background Shifts:** Transition from `surface` to `surface-container-low` to denote a new section (e.g., the transition from a Hero to a Product Grid).
*   **Vertical Spacing:** Use the Spacing Scale (specifically `12` to `20` tokens) to create logical separation.

### Signature Textures & Glassmorphism
*   **The Glass Effect:** For floating navigation bars or quick-view modals, use `surface-container-lowest` at 80% opacity with a `20px` backdrop-blur. This keeps the user connected to the rich textures of the garments beneath the UI.
*   **Regal Gradients:** For primary buttons, use a subtle linear gradient from `primary` to `primary_container`. This prevents the UI from feeling "flat" and adds a silk-like sheen to interactions.

---

## 3. Typography

Typography is the "voice" of this design system. We contrast the historical weight of a serif with the modern efficiency of a geometric sans-serif.

*   **Display & Headlines (Noto Serif / Playfair Display):** These tokens carry the "Heritage." Use these for product titles and editorial quotes. The high contrast between thick and thin strokes mirrors the intricate embroidery of the products.
*   **Titles & Body (Plus Jakarta Sans):** Modern, airy, and highly legible. Use for product descriptions and functional labels. 
*   **The Scale of Authority:**
    *   `display-lg` (3.5rem): Used for high-impact editorial statements.
    *   `title-md` (1.125rem): The standard for secondary information, providing a clean, "Shopify-plus" aesthetic.

---

## 4. Elevation & Depth: The Layering Principle

We reject the "drop shadow" in its traditional form. Depth in this design system is physical and atmospheric.

*   **Tonal Stacking:** Instead of shadows, place a `surface-container-lowest` card on a `surface-container-low` section. The minute shift in "paper weight" creates enough contrast to signify a clickable element.
*   **Ambient Shadows:** Where floating elements (like Cart Drawers) are required, use the following:
    *   `Shadow Color`: A 6% opacity tint of `on-surface` (#1A1C1B).
    *   `Blur`: `24px` to `48px`. This creates an "ambient glow" rather than a harsh edge.
*   **The Ghost Border:** If a form field or secondary button needs a container, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** `primary_container` background, `on_primary` text. Soft `rounded-md` (12px) corners. No border.
*   **Secondary:** `surface` background with a `secondary` (Gold) "Ghost Border."
*   **Tertiary:** Text-only in `primary` with a `2px` underline that appears only on hover, mimicking an editorial link.

### Cards & Product Grids
*   **Constraint:** Forbid divider lines.
*   **Image Styling:** Use `rounded-lg` (16px) for main product images to soften the interface.
*   **Product Info:** Center-aligned typography. Use `title-sm` for the Brand/Collection and `headline-sm` for the Product Name.

### Input Fields
*   **Default State:** `surface-container-low` background with a subtle `outline-variant` ghost border.
*   **Focus State:** The border transitions to `secondary` (Gold) at 40% opacity, providing a soft "glow" to indicate active status.

### Custom Component: The "Heritage Arch"
Inspired by the Pehnava Lawns source, use the `rounded-xl` (1.5rem) or custom SVG masks to create arched image containers for featured collections. This breaks the standard rectangular grid and reinforces the ethnic modern theme.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use extreme whitespace (`spacing-20`) between major sections to let the photography breathe.
*   **Do** use `display-md` for hero messaging, ensuring it overlaps image edges slightly for a "magazine" feel.
*   **Do** prioritize "Natural Light" shadows—diffused, low-opacity, and colored by the background.

### Don't:
*   **Don't** use pure black (#000000) for text. Use `on-surface` (#1A1C1B) to maintain a soft, luxury feel.
*   **Don't** use heavy, opaque borders to separate content. If you think you need a line, use a background color shift instead.
*   **Don't** use aggressive "Sales" colors. Use `secondary_container` (Soft Gold) for "New Arrival" or "Sold Out" tags rather than high-contrast reds.

### Accessibility Note:
While we use soft grays and ghost borders, ensure all `on-surface` text meets a 4.5:1 contrast ratio against our `surface` tiers. The elegance of the system should never come at the cost of the user's ability to navigate.