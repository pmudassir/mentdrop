```markdown
# Design System Strategy: The Digital Atelier

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** 

Unlike standard commerce templates that feel like rigid spreadsheets, this system treats data as a craft. We are moving away from the "boxed-in" utility of legacy dashboards toward a high-end, editorial workspace. The "Digital Atelier" aesthetic relies on **intentional asymmetry, expansive breathing room, and tonal depth** to signal premium quality. We replace loud structural lines with soft transitions of light, ensuring that the user feels like a curator of a luxury brand, not just an administrator of a database.

## 2. Colors & Surface Logic
The palette is rooted in functional neutrality, using high-chroma accents only to guide intent.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined through **Background Color Shifts**. For example, a `surface-container-low` (#f3f3f4) section should sit on a `surface` (#f9f9fa) background to define its territory. This creates a softer, more sophisticated "wash" of color rather than a hard clinical break.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. 
- **Base Level:** `surface` (#f9f9fa) is your canvas.
- **Secondary Level:** Use `surface-container` (#eeeeef) for sidebars or utility panels.
- **Focus Level:** Use `surface-container-lowest` (#ffffff) for primary content cards. Placing a pure white card on a light gray background provides a "natural lift" that signals importance without needing a heavy shadow.

### The "Glass & Gradient" Rule
To elevate primary actions, avoid flat blocks of color. 
- **Signature CTAs:** Apply a subtle linear gradient to `primary` (#00654b) buttons, transitioning into `primary-container` (#008060). This adds a "jewel-toned" depth that feels expensive.
- **Floating Elements:** Modals and dropdowns should utilize **Glassmorphism**. Use `surface-container-lowest` at 85% opacity with a `20px` backdrop-blur. This allows the colors of the underlying data to bleed through, integrating the UI layers.

## 3. Typography: The Editorial Voice
We use **Inter** exclusively, but we manipulate its weight and tracking to create an authoritative hierarchy.

*   **Display (Display-LG/MD):** Used for high-level "Atelier" insights (e.g., Total Revenue). Tighten letter-spacing by `-0.02em` to give it a customized, sleek look.
*   **Headlines (Headline-SM):** Set in `on-surface` (#1a1c1d). These are the anchors of your pages.
*   **Body (Body-MD):** The workhorse. Use `on-secondary-fixed-variant` (#454748) for secondary body text to reduce visual "vibration" and improve long-form readability.
*   **Labels (Label-MD):** All-caps with `+0.05em` letter-spacing for status tags and small metadata. This mimics the labeling found in high-end fashion ateliers.

## 4. Elevation & Depth
Depth is a tool for focus, not decoration.

*   **The Layering Principle:** Avoid shadows for static layout pieces. Achieve hierarchy by stacking: Place a `surface-container-lowest` (#ffffff) card inside a `surface-container-low` (#f3f3f4) wrapper.
*   **Ambient Shadows:** For "floating" objects (Popovers, active Modals), use a multi-layered shadow: `0px 4px 20px rgba(26, 28, 29, 0.06)`. The shadow color must be a tinted version of `on-surface`, never a neutral black.
*   **The "Ghost Border" Fallback:** If a container requires a boundary (e.g., inside a white-on-white layout), use the `outline-variant` (#bdc9c2) at **15% opacity**. It should be felt, not seen.

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary-container`. `0.375rem` (md) corner radius. White text.
*   **Secondary:** `surface-container-highest` (#e2e2e3) background with `on-surface` text. No border.
*   **Tertiary:** Ghost style. `on-primary-fixed-variant` text. High-contrast hover state using a `5%` primary-tinted overlay.

### Input Fields
*   **Default State:** `surface-container-lowest` background with a Ghost Border.
*   **Focus State:** Shift the background to `surface-bright` and apply a `2px` glow using `primary` at 20% opacity.
*   **Labeling:** Labels sit *above* the field in `label-md`, never inside as placeholders.

### Cards & Data Lists
*   **Rule:** Forbid divider lines between list items.
*   **Execution:** Use `spacing-4` (1rem) of vertical white space to separate items. If separation is visually required, use a subtle background toggle (zebra-striping) using `surface` and `surface-container-low`.
*   **Inventory Chips:** Use `tertiary-fixed-dim` (#e9c400) with `on-tertiary-fixed` (#221b00) for "Low Stock" alerts. This is our "Subtle Gold"—it marks a status, not a brand color.

### Advanced: The "Data Sheet" Component
For high-end commerce, we introduce the **Data Sheet**. This is a full-width container using `surface-container-lowest` with a left-aligned asymmetric header. It treats product listings as an editorial catalog rather than a grid.

## 6. Do’s and Don’ts

### Do:
*   **Do** use `spacing-12` and `spacing-16` to create dramatic breaks between major sections. Space is a luxury.
*   **Do** use `on-surface-variant` (#3e4944) for helper text to maintain a sophisticated, low-contrast hierarchy.
*   **Do** ensure all interactive elements have a `44px` minimum hit target, hidden within the spacious padding of the "Atelier" style.

### Don’t:
*   **Don’t** use 100% black (#000000). Always use `on-surface` (#1a1c1d) for text to maintain the "ink on paper" feel.
*   **Don’t** use standard `rounded-lg` for everything. Use `rounded-md` (0.375rem) for functional elements and `rounded-none` for structural layout shifts to maintain a professional edge.
*   **Don’t** crowd the interface. If a screen feels full, increase the spacing scale by one increment. If it still feels full, move content to a "Ghost-Border" drawer.