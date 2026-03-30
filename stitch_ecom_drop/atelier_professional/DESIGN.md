# Design System Specification: High-End Editorial Admin

## 1. Overview & Creative North Star: "The Digital Atelier"
This design system moves beyond the generic "SaaS Dashboard" aesthetic to embrace the precision of a high-end editorial workspace. The Creative North Star is **The Digital Atelier**: a space that feels curated, intentional, and quiet.

To achieve a "signature" look, we reject the standard grid of boxed-in widgets. Instead, we use **intentional asymmetry** and **tonal depth**. By leaning into the whitespace as a structural element rather than a "gap," the UI feels like a bespoke gallery of data. We break the "template" look by layering surfaces rather than boxing them, creating a sophisticated environment where the user’s data is the art.

---

## 2. Colors & Tonal Logic
The palette is rooted in the authoritative `primary` (Deep Slate) and accented by the prestigious `secondary` (Refined Gold). 

### The "No-Line" Rule
Traditional 1px solid borders for sectioning are strictly prohibited. Structure must be defined through **Background Color Shifts**. For example:
*   Use `surface-container-low` for a sidebar sitting on a `surface` background.
*   Use `surface-container-lowest` for cards to create a subtle "lift" against a `surface-container-low` section.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base:** `surface` (#F7F9FB)
*   **Sectioning:** `surface-container-low` (#F2F4F6)
*   **Content Containers:** `surface-container-lowest` (#FFFFFF)
*   **Active/Elevated Overlays:** `surface-bright` (#F7F9FB) with Glassmorphism.

### The Glass & Gradient Rule
To prevent a "flat" feel, use `backdrop-blur` on floating elements (modals, dropdowns) using a semi-transparent `surface` color. 
*   **Signature Polish:** For Primary CTAs, use a subtle linear gradient from `primary` (#091426) to `primary_container` (#1E293B) at a 135-degree angle. This adds "soul" and weight that a flat hex code cannot achieve.

---

## 3. Typography: Editorial Authority
We utilize **Inter** not just for legibility, but as a tool for hierarchy.

*   **Display & Headlines:** Use `display-md` and `headline-sm` with `font-weight: 600` and `letter-spacing: -0.02em`. This "tight" tracking mimics high-end print magazines.
*   **Body & Labels:** Use `body-md` for standard data. Use `label-sm` with `font-weight: 700` and `text-transform: uppercase` for category headers to create an authoritative, "Atelier" feel.
*   **Contrast:** Pair `primary` text for titles with `on_surface_variant` (#45474C) for secondary info to create a sophisticated grey-scale depth.

---

## 4. Elevation & Depth
We eschew traditional shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft, natural edge without the "clutter" of a stroke.
*   **Ambient Shadows:** For floating elements (e.g., Modals), use an extra-diffused shadow: `0px 20px 40px rgba(9, 20, 38, 0.05)`. The shadow color is a tinted version of `primary`, mimicking natural light.
*   **The Ghost Border:** If a boundary is strictly required for accessibility, use a `1px` border with `outline_variant` at **20% opacity**. Never use a 100% opaque border.
*   **Glassmorphism:** Navigation bars and floating headers should use `background: rgba(255, 255, 255, 0.7)` with a `blur: 12px`. This integrates the UI into the background rather than feeling "pasted on."

---

## 5. Components

### Buttons
*   **Primary:** Gradient (`primary` to `primary_container`), `rounded-lg`, `label-md` (bold).
*   **Secondary (Action):** `secondary` (#735C00) text on `secondary_container` (#FED65B). Only use for the single most important conversion on a page.
*   **Tertiary:** Ghost style, no background, `on_surface` text.

### Cards & Data Tables
*   **Forbidden:** Divider lines.
*   **Layout:** Use `spacing-6` (2rem) as the standard padding. Separate rows in tables by shifting the background to `surface-container-low` on hover, rather than using horizontal lines.

### Inputs & Fields
*   **Style:** `surface-container-lowest` background with a `Ghost Border`. Focus state moves the border to `secondary` (#D4AF37) at 100% opacity for a "golden highlight" effect.

### Subtle Status Chips
*   **Success/Danger:** Use high-transparency backgrounds (e.g., `error_container` at 30% opacity) with high-contrast text to keep the UI professional and avoid "loud" blocks of color.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Align a large `display-sm` heading to the left while keeping the primary action isolated on the right with generous whitespace.
*   **Use the Spacing Scale:** Stick strictly to the `1.4rem` (`4`) and `2rem` (`6`) increments to create a "breathable" luxury layout.
*   **Nesting:** Put `surface-container-highest` elements inside `surface-container-lowest` cards for nested data modules.

### Don't:
*   **No "Box-in-a-Box":** Avoid drawing a border around a card that is already inside a grey section. Use the background shift.
*   **No Solid Black:** Use `primary` (#091426) for "black" elements. It provides a deeper, more expensive-looking tone.
*   **No Standard Shadows:** Avoid the "fuzzy grey" default shadow. If it isn't diffused and tinted, don't use it.