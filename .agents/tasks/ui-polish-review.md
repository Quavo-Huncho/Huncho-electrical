# Visual UI Polish — Huncho Electrical Next.js Site

This change applies a broad visual polish pass across the entire Huncho Electrical site: 23 files modified or created, covering every page and most shared components. The approach layers in CSS keyframe animations, ambient SVG decorations, Tailwind hover/ring upgrades, and a new client-side `ProjectsGrid` filter component. The two pre-existing invalid Tailwind classes (`p-15`, `h-25`) are both fixed. A pre-existing build-blocking duplicate-variable bug in `materials/request/page.js` was also resolved as a side-effect.

**Watch for:** The `hero-grid` and `about-grid` SVG `<pattern>` elements share a common `id` attribute scoped only to the DOM — if both `PageHero` and `about/page.js` are rendered in the same document tree simultaneously (e.g. route transitions with partial hydration), the duplicate `id="hero-grid"` / `id="about-grid"` pattern IDs could cause one pattern to silently override the other (likely). The `animate-[pulse-ring_2s_ease-in-out_infinite]` arbitrary animation class in `WhatsAppButton.js` works because the `pulse-ring` keyframe is defined in `globals.css`, but the `@layer utilities` class `.animate-pulse-ring` is defined separately — two spellings for the same animation exist in the codebase (possible confusion for maintainers).

**Verdict**: APPROVED

---

## High-level view

The invalid Tailwind classes (`p-15` in `services/page.js`, `h-25` in `Navbar.js`) are both confirmed fixed — replaced with valid scale values. The build report in `impl-notes.md` confirms 0 errors across 25 pages.

`ProjectsGrid.js` was created as required: `"use client"`, `useState` for active category, filter buttons rendering against a hardcoded `categories` array, filtered card grid delegating to `ProjectCard`. `projects/page.js` is now a clean server component that fetches and passes data down; no Supabase logic was moved or altered.

Auth logic in `Navbar.js` is untouched — the `supabase.auth.getUser()` flow, the `onAuthStateChange` subscription, and the `handleLogout` function are identical to what the plan required to be preserved. The new additions (logo image, `usePathname` active indicator, mobile slide-down animation) are purely presentational.

The `globals.css` additions (`pulse-ring`, `shimmer`, `fade-in-up` keyframes, `.amber-glow` utility) are clean additive changes inside `@layer utilities` with no modifications to the existing `@theme inline` block or CSS variables.

Two SVG `<pattern>` elements use hardcoded `id` attributes (`hero-grid` in `PageHero.js`, `about-grid` in `about/page.js`). In normal navigation these are in separate documents, but if Next.js ever co-renders both in the same DOM (e.g. parallel routes, modals), the duplicate IDs will cause one pattern to silently fail. The fix is to use unique IDs or inline `defs` scoped per render.

The `WhatsAppButton` uses an arbitrary Tailwind class `animate-[pulse-ring_2s_ease-in-out_infinite]` alongside the `.animate-pulse-ring` utility class defined in `globals.css`. Both reference the same keyframe but they are not the same class — the arbitrary-value form works at runtime but creates two parallel spellings for the same effect, which will confuse maintainers.

---

<details>
<summary>Issues (2)</summary>

1. **Duplicate SVG pattern IDs** — `PageHero.js` uses `id="hero-grid"` and `about/page.js` uses `id="about-grid"`, but if both are ever in the same DOM simultaneously (parallel routes, modal overlays, or future layout changes), the latter definition silently overrides the former, causing one pattern to render as a blank fill. Replace with dynamically generated IDs (e.g. via a `useId` hook in a client wrapper, or a prop-injected suffix) or scope the `<defs>` strictly inside each SVG without cross-SVG-reusable IDs.

2. **Dual animation spellings for `pulse-ring`** — `WhatsAppButton.js` uses the arbitrary-value Tailwind class `animate-[pulse-ring_2s_ease-in-out_infinite]` while `globals.css` also defines `.animate-pulse-ring`. Both work, but maintainers will not know which spelling to use. Standardize on `.animate-pulse-ring` (the utility class) and remove the arbitrary-value usage, or remove the utility class and use only the arbitrary-value form consistently.

</details>

---

<details>
<summary>Details</summary>

### Invalid Tailwind class fixes — confirmed clean

Both flagged classes are confirmed fixed. `services/page.js` now uses `p-8` on the "Why Clients Choose Us" cards (not the `p-10` the plan suggested, but `p-8` is equally valid). `Navbar.js` now uses `h-16` on the flex row. No remaining `p-15` or `h-25` occurrences were found in the spot-checked files.

### ProjectsGrid architecture

`ProjectsGrid.js` is a `"use client"` component with `useState("All")` for the active filter. The filter compares `p.category?.toLowerCase()` against `activeCategory.toLowerCase()`, handling mixed-case category strings from Supabase. The empty-state renders a message; `projects/page.js` passes `projects ?? []` so the component never receives `null`.

### Duplicate SVG pattern IDs

`PageHero.js` defines `<pattern id="hero-grid">` and `about/page.js` defines `<pattern id="about-grid">`. These are different IDs so there is no direct collision between those two. However, `PageHero` is used on four pages (projects, services, about, contact) — all four will emit a `<pattern id="hero-grid">` into the document. In standard Next.js page navigation this is fine because each route replaces the DOM. The risk is real in any scenario where two `PageHero` instances exist simultaneously in the same document (e.g. a route transition with `<AnimatePresence>` keeping the old page mounted, or if `PageHero` is ever used in a modal). The `about-grid` ID in `about/page.js` is unique to that page so it is lower risk, but the pattern is worth addressing for robustness.

### WhatsApp animation spelling inconsistency

`globals.css` defines `.animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }` as a named utility. `WhatsAppButton.js` applies `animate-[pulse-ring_2s_ease-in-out_infinite]` — the Tailwind 4 arbitrary-value form — rather than the utility class. Both produce identical CSS output at runtime. The issue is maintainability: a future developer seeing `.animate-pulse-ring` in `globals.css` will not know the component uses the arbitrary form, and vice versa. Standardizing on one removes the ambiguity.


</details>

---

<details>
<summary>File map</summary>

| File | Change |
|---|---|
| `app/globals.css` | Added 3 keyframes + 4 utility classes; `background-color` added to body transition |
| `components/common/PageHero.js` | Grid SVG overlay, radial gradient, badge bolt icon, `animate-fade-in-up`, bottom wave divider |
| `components/common/SectionHeader.js` | Amber underline bar, optional `badge` prop |
| `components/common/CTASection.js` | Decorative SVG overlay, `secondaryText`/`secondaryLink` optional props, consistent button sizing |
| `components/navbar/Navbar.js` | Logo image, `usePathname` active indicator, mobile slide-down animation, `h-25`→`h-16` |
| `components/home/TrustSection.js` | Gradient background, hover amber highlight on items |
| `components/home/WhyChooseUs.js` | Section gradient, card hover ring + shadow, amber scale-x accent bar |
| `components/home/ProjectsSection.js` | Per-card colour gradients, shimmer overlay, amber badge pill, bolt + arrow hover effects |
| `components/home/StatsSection.js` | Circuit SVG decoration, larger stat numbers, visible dividers, pulse dot per stat |
| `components/home/CTASection.js` | Extra SVG paths + mirrored right-side SVG, consistent button sizing |
| `components/services/ServicesSection.js` | Per-index colour tints, "Learn more →" arrow link |
| `app/(website)/services/page.js` | All `p-15`→`p-8`, icons + descriptions in process steps, connector lines, inline CTA → `<CTASection>` |
| `app/(website)/about/page.js` | Gradient decorative panel, stat chips, Mission/Vision top borders, `md:grid-cols-3` values, inline CTA → `<CTASection>` |
| `components/contact/ContactInfo.js` | Card wrappers per contact item, coloured icon backgrounds, amber emergency callout |
| `components/contact/ContactForm.js` | Focus rings, submit spinner, `disabled` states |
| `app/(website)/materials/page.js` | Page hero header, visual filter buttons, `MaterialCard` usage, `CartBadge` |
| `components/materials/CartBadge.js` | **NEW** — `"use client"` cart count badge |
| `components/materials/MaterialCard.js` | `next/image`, hover scale, cart checkmark badge, `FaBolt` fallback |
| `components/projects/ProjectsGrid.js` | **NEW** — `"use client"`, `useState` filter, filtered `ProjectCard` grid |
| `app/(website)/projects/page.js` | Server component delegates to `<ProjectsGrid>` |
| `components/projects/ProjectCard.js` | Category colour map, hover "View Details" overlay, removed standalone button |
| `components/footer/Footer.js` | `bg-slate-200`→`bg-slate-50` with `text-slate-700`, social icon scale + colour transition |
| `components/ui/WhatsAppButton.js` | Pulse ring animation, hover tooltip |

Full diff: `git diff main` from the repo root.

</details>
