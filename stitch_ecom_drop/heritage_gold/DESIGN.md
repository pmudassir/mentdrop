# Design System Document: The Editorial Ethnic Standard

## 1. Overview & Creative North Star: "The Gilded Manuscript"
This design system moves away from the rigid, boxy constraints of traditional e-commerce. Our Creative North Star is **"The Gilded Manuscript"**—an editorial-first approach that treats the screen like a high-end fashion lookbook. 

We reject the "template" look. Instead of grids of identical boxes, we utilize intentional asymmetry, overlapping images, and generous white space to create a sense of curated luxury. This system translates the tactile elegance of Indian ethnic wear—silk, gold thread, and soft drapes—into a digital experience that feels "breathtakingly quiet" yet authoritative.

---

## 2. Color & Atmospheric Depth
Our palette is not just a collection of hex codes; it is a system of light and shadow designed to mimic a sun-drenched marble courtyard.

### The Palette (Material Design Convention)
*   **Primary (#735C00 / #D4AF37):** Used for signature moments. The `primary_container` (#D4AF37) acts as our "woven gold."
*   **Surface & Background (#FBFBE2 / #F5F5DC):** The "Cream" and "Beige" foundations. 
*   **Tertiary (#415BA4):** A regal "Indigo" used sparingly for trust-critical UI elements (e.g., verified badges, secure checkout).

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined through background color shifts or tonal transitions. 
*   *Example:* A `surface_container_low` (#F5F5DC) product description section sitting on a `surface` (#FBFBE2) background.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
*   **Base:** `surface` (#FBFBE2)
*   **In-Page Sections:** `surface_container` (#EFEFD7)
*   **Floating Elements/Cards:** `surface_container_lowest` (#FFFFFF) for maximum "pop" and purity.

### Signature Textures & Glassmorphism
To create a premium feel, use **Glassmorphism** for floating navigation bars or quick-view modals. 
*   **Recipe:** `surface` at 70% opacity + 20px Backdrop Blur. 
*   **The Gold Glow:** Use subtle linear gradients from `primary` to `primary_container` for hero CTAs to simulate the sheen of metallic embroidery.

---

## 3. Typography: The Bilingual Elegance
The typography system balances the modern geometric precision of Poppins with the heritage-rich strokes of Noto Sans Devanagari.

*   **Display & Headlines (Plus Jakarta Sans/Poppins):** These are our "Hooks." We use a high-contrast scale. Use `display-lg` (3.5rem) for seasonal campaigns, often overlapping with images to break the grid.
*   **Title & Body (Be Vietnam Pro/Noto Sans Devanagari):** For Hinglish product names and descriptions. The line height is increased to 1.6x for an airy, readable feel.
*   **The Hierarchy of Trust:** Large, spaced-out headlines convey authority, while refined, smaller labels (`label-md`) in `on_surface_variant` (#4D4635) provide the necessary detail without cluttering the visual field.

---

## 4. Elevation & Depth: Tonal Layering
We do not use heavy shadows. We use "Atmospheric Depth."

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface_container_highest` (#E4E4CC) element indicates a deeper interactive "well," whereas a `surface_container_lowest` (#FFFFFF) card indicates a floating, high-priority item.
*   **Ambient Gold Shadows:** When a shadow is required (e.g., a floating "Add to Cart" button), the shadow must be tinted.
    *   **Shadow Specs:** `0px 20px 40px rgba(115, 92, 0, 0.08)` — using a 8% opacity version of the `primary` gold color rather than grey.
*   **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility, use the `outline_variant` (#D0C5AF) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Softness & Intent

### Buttons (The "Feminine Curve")
All buttons use the `full` roundedness scale (9999px) to mimic the soft curves of traditional silhouettes.
*   **Primary:** `primary` background with `on_primary` text. Use the "Gold Glow" gradient on hover.
*   **Secondary:** `surface_container_high` background. No border. Soft and integrated.
*   **Padding:** High horizontal padding (e.g., `spacing-6`) to ensure the button feels "grand."

### Cards & Product Grids
*   **Strict Rule:** No dividers. Separate product info from the image using `spacing-3`.
*   **Asymmetry:** In product listings, occasionally allow one image to occupy 1.5x the width of others to create an editorial flow.

### Input Fields
*   **Style:** Minimalist. No enclosing boxes. Use a `surface_variant` bottom bar (2px) that transforms into a `primary` gold bar upon focus.
*   **Labels:** Use `label-sm` always visible above the input, never placeholder-only.

### Special Component: The "Drape" Carousel
A custom carousel for "Swadesh Wears" where images do not just slide, but slightly scale and fade, mimicking the movement of fabric. Use `roundedness-lg` (2rem) for all featured campaign imagery.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use overlapping elements (e.g., a text block slightly covering an image edge) to create depth.
*   **Do** use `surface_container_lowest` for cards on a `surface` background to create a "lifted" look without shadows.
*   **Do** utilize the full Spacing Scale (especially `spacing-12` and `spacing-16`) to let the products breathe.

### Don't:
*   **Don't** use 100% black (#000000). Use `on_surface` (#1B1D0E) for a softer, more organic feel.
*   **Don't** use hard 90-degree corners. Everything must adhere to the `roundedness` scale, starting from `sm` (0.5rem).
*   **Don't** use standard Material Design "Drop Shadows." They are too "tech-heavy" for an ethnic brand. Stick to Tonal Layering or Gold Ambient Shadows.
*   **Don't** use "divider lines" to separate list items. Use white space (`spacing-4`) or a 5% opacity shift in background color.

---

**Director’s Final Note:** This design system is about the "space between." The luxury of Swadesh Wears isn't in the gold alone; it's in the confident use of whitespace and the refusal to clutter the user’s journey. Build with grace.