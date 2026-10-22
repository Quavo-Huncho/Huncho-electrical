# Implementation Plan — Homepage UI Polish

Apply changes in the order listed. Each item touches one file, leaves the build green, and has no side-effects on other items unless stated.

---

- [ ] 1. **MaterialCard.js — remove console.logs, fix price colour, fix out-of-stock button**
      Three small, safe edits with no logic change.
      - Remove lines 14–15 (`console.log("Material:", …)` and `console.log("Image URL:", …)`).
      - Line 68: change price `<p>` class from `text-slate-900 dark:text-white` → `text-amber-600 dark:text-amber-400`.
      - The out-of-stock button is the `Link` at lines 70–79. When `!inStock`, the button currently renders the same amber-filled style. Conditionally swap classes: when `!inStock` use `border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 bg-transparent shadow-none` instead of `bg-amber-500 text-white shadow-sm hover:bg-amber-600`.
      Files: `components/home/MaterialCard.js`
      Verify: `npm run build` — no console.log warnings, build succeeds.

---

- [ ] 2. **Hero.js — trust-badge pills, bottom fade, button sizing**
      - Import `FaShieldAlt`, `FaCheckCircle` from `react-icons/fa` (join existing `FaBolt`, `FaArrowRight` import on line 3).
      - Replace the `<p>` on line 110 (`Licensed, insured, and available for emergency callouts.`) with three inline pill badges:
        ```jsx
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
            <FaShieldAlt className="h-3 w-3 text-amber-400" /> Licensed &amp; insured
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
            <FaBolt className="h-3 w-3 text-amber-400" /> Emergency callouts
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
            <FaCheckCircle className="h-3 w-3 text-amber-400" /> Free quotes
          </span>
        </div>
        ```
      - Add a bottom-fade overlay div immediately before the closing `</section>` tag:
        ```jsx
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950/60 to-transparent" aria-hidden="true" />
        ```
      - "Get a free quote" button (line 97): change padding from `px-6 py-3.5` → `px-8 py-4` and add `shadow-lg` to the class list.
      - "View our projects" button (line 106): change padding from `px-6 py-3.5` → `px-6 py-3` (already smaller visually vs primary; keep border/text as-is).
      Files: `components/hero/Hero.js`
      Verify: `npm run build` — builds cleanly; visually confirm pills appear above the fold.

---

- [ ] 3. **TrustSection.js — card wrap, permanent amber left-border, min-h**
      - Each grid item `<div>` (line 18) currently has classes for hover-only accent. Apply these changes:
        - Add `min-h-[90px]` to the item div.
        - Add `border-l-4 border-amber-500` as permanent classes on the item div (remove the `group-hover:border-l-4 group-hover:border-amber-500` classes from the icon `<span>` — those were misapplied to the icon anyway).
        - Wrap each item in a card: change the item div's classes to include `bg-white dark:bg-slate-900 rounded-2xl shadow-sm` (keep existing transition/hover/flex classes).
        - Remove `group-hover:border-l-4 group-hover:border-amber-500` from the icon `<span>` class (line 22) since the border now lives on the card itself.
      Files: `components/home/TrustSection.js`
      Verify: `npm run build` — builds cleanly.

---

- [ ] 4. **ServicesSection.js — "View all services" link in header, coloured top border per card**
      - The header `<div>` (line 47, `mb-14 max-w-2xl`) currently has no flex layout. Change it to:
        `"mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"` and remove `max-w-2xl` (move `max-w-2xl` to an inner wrapper div containing just the `<h2>`, the amber bar, and the `<p>`). Then add a sibling `<Link>` after that inner div, mirroring the ProjectsSection pattern:
        ```jsx
        <Link
          href="/services"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
        >
          View all services
          <FaArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
        </Link>
        ```
      - `sm:grid-cols-2 lg:grid-cols-3` already exists — no change needed.
      - Add a coloured top border to each card using inline style. In the card `<div>` (line 63), add:
        `style={{ borderTopColor: colour.borderHex, borderTopWidth: 3 }}`
        and add a `borderHex` property to each entry in `colourMap`:
        amber→`"#F59E0B"`, blue→`"#3B82F6"`, green→`"#22C55E"`, red→`"#EF4444"`, violet→`"#8B5CF6"`, cyan→`"#06B6D4"`.
      Files: `components/services/ServicesSection.js`
      Verify: `npm run build` — builds cleanly; "View all services" link appears right-aligned on desktop.

---

- [ ] 5. **WhyChooseUs.js — numbered badge, subheading, min-h on cards**
      - Add a subheading `<p>` after the `<h2>` in the header block (after line 30):
        ```jsx
        <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
          Everything you need from a trusted electrical contractor.
        </p>
        ```
      - In the card `<div>` (line 36), add `min-h-[200px]` to the class list.
      - Inside each card, add a numbered badge in the top-right corner. Add the following as the first child of the card `<div>`:
        ```jsx
        <span className="absolute right-4 top-4 text-2xl font-extrabold tabular-nums text-slate-200 transition group-hover:text-amber-400 dark:text-slate-700 dark:group-hover:text-amber-500 select-none">
          {String(reasons.indexOf({ icon: Icon, title, text }) + 1).padStart(2, "0")}
        </span>
        ```
        Because `indexOf` with object literals won't reliably match, instead update the `.map` callback to use the `index` parameter:
        ```jsx
        {reasons.map(({ icon: Icon, title, text }, index) => (
          …
          <span …>{String(index + 1).padStart(2, "0")}</span>
          …
        ))}
        ```
      Files: `components/home/WhyChooseUs.js`
      Verify: `npm run build` — builds cleanly; badges "01"–"04" appear in top-right of each card.

---

- [ ] 6. **MaterialsSection.js — amber underline accent, bg change**
      - Change the `<section>` bg classes (line 34) from `bg-white dark:bg-slate-900` → `bg-slate-50 dark:bg-slate-950`.
      - The `<h2>` heading already sits inside a `<div>` block. Add an amber accent bar immediately after the `<h2>` closing tag:
        ```jsx
        <div className="mt-3 h-1 w-16 rounded-full bg-amber-500" />
        ```
        (The existing `<p>` description follows after — no other structure changes.)
      Files: `components/home/MaterialsSection.js`
      Verify: `npm run build` — builds cleanly.

---

- [ ] 7. **StatsSection.js — "Our track record" label, pulse dot move, larger numbers, mobile border on items 2–3**
      Four independent tweaks in one file.
      - Add a centered label above the grid (before the `<div className="grid …">`, line 45):
        ```jsx
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-slate-900/50">
          Our track record
        </p>
        ```
      - Increase stat number size: change `text-5xl sm:text-6xl` (line 53) → `text-5xl sm:text-6xl lg:text-7xl`.
      - Move pulse dot: remove the `<span className="mb-3 inline-block h-2 w-2 animate-pulse …">` block that sits above the number (lines 49–52). Instead add it inline after the label text (line 56):
        ```jsx
        <p className="mt-2 text-sm font-medium text-slate-900/70 sm:text-base">
          {stat.label}
          <span className="ml-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-slate-900/40 align-middle" aria-hidden="true" />
        </p>
        ```
      - Add mobile top-border to items at index 2 and 3. Update the card `<div>` className expression:
        ```jsx
        className={`sm:px-4 ${index < 3 ? "sm:border-r sm:border-slate-900/20" : ""} ${
          index >= 2 ? "border-t border-slate-900/15 pt-8 sm:border-t-0 sm:pt-0" : ""
        }`}
        ```
      Files: `components/home/StatsSection.js`
      Verify: `npm run build` — builds cleanly.

---

- [ ] 8. **ProjectsSection.js — skeleton empty state, category overlay badge**
      - Replace the existing empty-state block (lines 93–103, the `<div className="rounded-2xl border border-dashed …">` block) with 3 skeleton placeholder cards plus a message:
        ```jsx
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="h-52 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse" />
                <div className="space-y-3 p-6">
                  <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  <div className="h-3 w-1/2 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm font-medium text-slate-400 dark:text-slate-500">
            Portfolio coming soon
          </p>
        </div>
        ```
      - Add the amber accent bar under the heading — it already exists on line 38 (`<div className="mt-3 h-1 w-16 rounded-full bg-amber-500" />`). No change needed.
      - Add the category overlay badge on top-left of the project image. Inside the image `<div>` (line 59), after the hover-tint overlay div, add:
        ```jsx
        {project.category && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {project.category}
          </span>
        )}
        ```
        Keep the existing `{project.category && <p …>}` text block in the details area below — both displays co-exist as required.
      Files: `components/home/ProjectsSection.js`
      Verify: `npm run build` — builds cleanly; skeleton cards render when projects array is empty.

---

- [ ] 9. **CTASection.js — amber pill label, FaBolt decorative element, button shadow**
      - Import `FaBolt` from `react-icons/fa` (line 2, join existing imports).
      - Add a small amber pill label inside the content `<div className="max-w-2xl">` (line 67), before the `<h2>`:
        ```jsx
        <span className="inline-flex items-center rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
          Ready to get started?
        </span>
        ```
      - Add a right-side decorative bolt element. Inside `<div className="relative mx-auto max-w-7xl …">` (line 65), change the inner div to `flex items-center justify-between` and add a sibling div after `<div className="max-w-2xl">…</div>`:
        ```jsx
        <div className="relative hidden lg:flex items-center justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-amber-500/10 ring-4 ring-amber-500/20 shadow-[0_0_40px_0_rgb(245_158_11_/0.25)]">
            <FaBolt className="h-14 w-14 text-amber-400 drop-shadow-[0_0_12px_rgb(245_158_11_/0.6)]" />
          </div>
        </div>
        ```
        The outer container div (line 65) needs `flex items-center gap-12` added to its classes.
      - "Request a quote" button (line 72): add `shadow-lg shadow-amber-500/25` to its className.
      Files: `components/home/CTASection.js`
      Verify: `npm run build` — builds cleanly; bolt icon visible on lg screens, hidden on mobile.

---

## Application Order Summary

| # | File | Key risk |
|---|------|----------|
| 1 | `MaterialCard.js` | None — pure visual + console.log removal |
| 2 | `Hero.js` | None — additive only |
| 3 | `TrustSection.js` | Verify border-l-4 not duplicated on icon span |
| 4 | `ServicesSection.js` | Verify colourMap borderHex entries all present |
| 5 | `WhyChooseUs.js` | Use index param in map, not indexOf |
| 6 | `MaterialsSection.js` | None — minimal changes |
| 7 | `StatsSection.js` | Remove old pulse dot span, don't leave orphan markup |
| 8 | `ProjectsSection.js` | Empty-state replacement is a full block swap |
| 9 | `CTASection.js` | Outer content div needs flex added — verify layout not broken |

Run `npm run build` (or `next build`) after every item. No new packages are introduced. All changes are Tailwind v4 utility classes. No business logic, Supabase queries, prop APIs, or exports are touched.
