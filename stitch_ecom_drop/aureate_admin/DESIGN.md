# Design System Specification: The Digital Atelier

## 1. Overview & Creative North Star
This design system is built for the "Digital Atelier"—a philosophy that treats administrative commerce not as a spreadsheet, but as a high-end fashion ledger. Moving away from the rigid, boxed-in nature of traditional SaaS, this system embraces an editorial aesthetic that mirrors the craftsmanship of Indian ethnic wear.

**Creative North Star: "Curated Authority"**
The interface must feel like a Winter 2026 runway lookbook: structured yet fluid, warm yet professional. We break the "template" look by using intentional white space, tonal depth instead of borders, and a high-contrast hierarchy that guides the eye to critical dropshipping metrics like RTO (Return to Origin) and inventory health.

## 2. Colors & Surface Philosophy
The palette balances the richness of `primary_container` (#D4AF37) with the sophisticated sobriety of `on_surface` (#1A1C1B).

### The "No-Line" Rule
To achieve a premium enterprise look, **1px solid borders are strictly prohibited** for sectioning. Boundaries must be defined through:
*   **Background Shifts:** Place a `surface_container_lowest` card on a `surface_container_low` background.
*   **Tonal Transitions:** Use the `surface_container` tiers to denote hierarchy.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper.
*   **Base Layer:** `surface` (#F9F9F7) – The main canvas.
*   **Content Sections:** `surface_container_low` (#F4F4F2).
*   **Interactive Cards:** `surface_container_lowest` (#FFFFFF) – These should "lift" off the page.

### Signature Textures & Glassmorphism
*   **The Gold Gradient:** For primary CTA buttons or high-level metric highlights, use a subtle linear gradient: `primary_container` (#D4AF37) to `primary_fixed_dim` (#E9C349).
*   **Floating Elements:** Use `surface_container_lowest` with 80% opacity and a `20px` backdrop-blur for sidebars or "quick view" panels to create a frosted-glass effect.

## 3. Typography
We use **Inter** for its precision, but we style it with editorial intent.

*   **Display (Large Metrics):** Use `display-md` or `display-sm` for daily revenue. These are your "hero" numbers.
*   **Headlines (Navigation/Sectioning):** `headline-sm` should be used for major dashboard sections. Ensure `on_surface` is used for maximum legibility.
*   **The Status Hierarchy:** Use `label-md` in all-caps with `0.05em` letter-spacing for status tags (e.g., "SHIPPED", "RTO ALERT").
*   **Body:** Use `body-md` for general data entry. It provides the high data density required for a dropshipping admin while maintaining clarity.

## 4. Elevation & Depth
Depth is a functional tool, not a decoration. We use **Tonal Layering** over shadows.

*   **The Layering Principle:** A `surface_container_lowest` card placed on a `surface_container_low` background creates a natural elevation. This is our default "elevation."
*   **Ambient Gold Shadows:** When a card requires a floating effect (e.g., a critical RTO notification), use a shadow tinted with `primary` (#735C00).
    *   *Shadow Setting:* `0px 12px 32px -4px`, Opacity: `6%`.
*   **The "Ghost Border" Fallback:** If a container sits on a background of the same color (accessibility requirement), use `outline_variant` (#D0C5AF) at **15% opacity**. Never use 100% opacity for lines.

## 5. Components

### Cards (The Core Primitive)
*   **Radius:** `rounded-lg` (1rem) for main containers; `rounded-md` (0.75rem) for nested items.
*   **Spacing:** Use `spacing-6` (1.3rem) for internal padding to give elements room to breathe.
*   **Separation:** No dividers. Use `spacing-10` (2.25rem) of vertical white space to separate card groups.

### Buttons
*   **Primary:** Background: `primary_container`, Text: `on_primary_container`. Shape: `rounded-md`.
*   **Secondary:** Background: `secondary_container`, Text: `on_secondary_container`.
*   **Tertiary (Alert/RTO):** Background: `tertiary`, Text: `on_tertiary`. Use this for high-stakes actions like "Cancel Order" or "Flag Fraud."

### High-Contrast RTO Indicators
For Return-to-Origin (RTO) alerts, use the **Tertiary Scale**:
*   **Container:** `tertiary_container` (#FF968C)
*   **Icon/Text:** `on_tertiary_container` (#90000E)
*   **Effect:** Add a pulse animation or a ghost border of `tertiary` at 20% to ensure it commands immediate attention.

### Input Fields
*   **Surface:** `surface_container_lowest`.
*   **Border:** Ghost border using `outline_variant` at 20%.
*   **Focus State:** Transition the ghost border to `primary` (#735C00) and add a subtle `primary_fixed` outer glow.

## 6. Do’s and Don'ts

### Do
*   **Do** use `spacing-8` or `spacing-10` between major sections to emphasize the premium "Winter 2026" editorial feel.
*   **Do** use `secondary_fixed_dim` for disabled states to keep the palette warm and cohesive.
*   **Do** prioritize data density in tables by using `body-sm` for row data, but keep row heights generous (`spacing-12`).

### Don't
*   **Don't** use pure black (#000000). Always use `on_surface` (#1A1C1B) or `inverse_surface` for deep charcoals.
*   **Don't** use standard 1px dividers. If you must separate content within a card, use a subtle background shift to `surface_container_high`.
*   **Don't** use sharp corners. Everything in this system should feel approachable and bespoke, adhering to the `rounded-md` and `rounded-lg` scales.