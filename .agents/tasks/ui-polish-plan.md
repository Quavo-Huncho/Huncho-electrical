# UI Polish Implementation Plan — Huncho Electrical

## Pre-flight findings

### Stack confirmed (package.json)
- Next.js 16.3.0, React 19, Tailwind CSS 4 (via `@tailwindcss/postcss`)
- **framer-motion ^13.1.0** ✅ available
- **lucide-react ^1.34.0** ✅ available
- **react-icons ^5.7.0** ✅ available
- **next-themes ^0.4.6** ✅ available
- No `tailwind.config.js` — Tailwind 4 uses CSS-first config (`globals.css` + `@theme inline`)

### Invalid / broken Tailwind 4 classes found
| File | Class | Problem |
|---|---|---|
| `app/(website)/services/page.js` | `p-15` (used 4×) | Not a default Tailwind scale step — generates no style |
| `components/navbar/Navbar.js` | `h-25` | Not a default Tailwind scale step — generates no style |

### Shared patterns to keep consistent across the plan
1. **Card hover style**: `transition hover:-translate-y-1 hover:shadow-lg` — used in WhyChooseUs, ServicesSection, ProjectsSection. Upgrade all cards to the same `hover:-translate-y-1.5 hover:shadow-xl` pattern.
2. **Icon container**: `flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl text-amber-600 dark:bg-amber-500/10 dark:text-amber-400` — replicate in every card-style component.
3. **Section badge**: amber pill badge pattern already in Hero and PageHero — extend it into SectionHeader's optional `badge` prop.
4. **CTA block**: two places define an inline amber CTA (`about/page.js` inline, `services/page.js` inline, `common/CTASection.js`). All three must match the same design after polish.
5. **Page background alternation**: sections alternate `bg-white` / `bg-slate-50` / `bg-slate-950` — maintain this rhythm so consecutive white sections aren't used without a break.

### Export / import shapes that must be preserved
- `PageHero` — default export, props: `{ badge, title, description }`
- `SectionHeader` — default export, props: `{ title, description, center=true }`
- `CTASection` (common) — default export, props: `{ title, description, buttonText, buttonLink }`
- `MaterialCard` — default export, prop: `{ material }`, calls `useMaterials().addItem`
- `ProjectCard` — default export, prop: `{ project }`
- `ContactForm` — default export, `"use client"`, own `useState` + supabase submit — **no logic changes**
- `ContactInfo` — default export, async server component calling `getSettings()`
- `WhatsAppButton` — default export, async server component
- `Footer` — default export, async server component
- `Navbar` — default export, `"use client"` with Supabase auth state — **no auth logic changes**

---

## Implementation Plan

- [ ] 1. **Fix invalid Tailwind classes in `app/(website)/services/page.js`**
  Fix the four `p-15` instances on the "Why Clients Choose Us" cards — replace with `p-10`, which is a valid Tailwind 4 spacing step and visually equivalent. Also fix the one `hover:-translate-y-2` on service grid items to `hover:-translate-y-1.5` to match the shared card hover pattern.
  Files: `app/(website)/services/page.js`
  Verify: `npm run build` — build must complete with zero Tailwind warnings for these classes.

- [ ] 2. **Fix invalid `h-25` class in `Navbar.js` and polish the navbar**
  Replace `h-25` (invalid) on the flex row with `h-16 sm:h-18` (or `h-16` for a crisp 64 px bar). While here, add a subtle bottom border accent (`border-b-amber-500/20`), tighten the mobile menu with a `divide-y divide-slate-100 dark:divide-slate-800` between nav links, and give the logo "HE" monogram a `text-sm font-extrabold` treatment to sharpen it.
  Files: `components/navbar/Navbar.js`
  Verify: `npm run build` — zero build errors; visually confirm navbar height is consistent.

- [ ] 3. **Enhance `globals.css` — add custom utilities and smooth transition defaults**
  Add: (a) a CSS `@keyframes` fade-in-up animation and a `.animate-fade-in-up` utility class registered via `@layer utilities`; (b) a subtle `bg-transition` for body that includes `background-color 0.3s ease` (currently only `color` is transitioned); (c) a custom `--amber-glow` CSS variable (`box-shadow: 0 0 20px 0 rgb(245 158 11 / 0.25)`) that can be applied to `.amber-glow` utility class for CTA button glow effects.
  No changes to existing variables or `@theme inline` block — only additions.
  Files: `app/globals.css`
  Verify: `npm run build` — no CSS parse errors.

- [ ] 4. **Upgrade `PageHero.js`** — richer hero header
  Current state: minimal dark section, badge is an unstyled span with `py-5` (visually oversized). Changes:
  - Fix badge padding: `px-4 py-1.5` + add a small bolt icon (`FaBolt` from react-icons) inline before badge text + `text-sm font-medium`.
  - Add a subtle animated grid/circuit SVG decoration (inline `<svg>` with a grid pattern, `aria-hidden`, `opacity-5`) behind the text so the section isn't a plain dark rectangle.
  - Wrap heading in a `<div>` that applies `animate-fade-in-up` (defined in item 3).
  - Description: bump to `text-slate-300 leading-relaxed`.
  - No prop signature change — default export with `{ badge, title, description }` preserved.
  Files: `components/common/PageHero.js`
  Verify: `npm run build` — pages using PageHero (projects, services, about, contact) build without error.

- [ ] 5. **Upgrade `SectionHeader.js`** — add optional `badge` prop and accent underline
  Add an optional `badge` prop (string). When provided, render an amber pill badge above the title (same style as Hero badge). Add a short `<span>` decorative underline (`block w-12 h-1 rounded-full bg-amber-500 mx-auto mt-4` when centered, `mt-4` when left-aligned) to give section titles a visual anchor. `center=true` default unchanged.
  Files: `components/common/SectionHeader.js`
  Verify: `npm run build` — existing callers that don't pass `badge` are unaffected.

- [ ] 6. **Upgrade `common/CTASection.js`** — align with home CTASection quality
  Current state: flat amber block, white button has no hover state. Changes:
  - Add `hover:shadow-lg hover:scale-[1.02] transition-transform` to the button.
  - Add a subtle radial glow `<div>` (`absolute inset-0 bg-radial-gradient …` via inline style, `aria-hidden`, `pointer-events-none`) inside the section to give depth.
  - Add a `secondaryButtonText` + `secondaryButtonLink` optional prop (default `undefined`) — when provided, render a ghost/outline secondary button beside the primary. If not provided, nothing changes for existing callers.
  Files: `components/common/CTASection.js`
  Verify: `npm run build` — `projects/page.js` which consumes this component builds cleanly.

- [ ] 7. **Upgrade `TrustSection.js`** — refined trust bar
  Add subtle `hover:bg-amber-50 dark:hover:bg-amber-500/5 rounded-xl px-4 py-3 transition` wrapper on each item so the bar feels interactive. Bump icon container to `h-12 w-12 rounded-2xl` to match card icon pattern from item 1. Text: add `tracking-tight` to titles.
  Files: `components/home/TrustSection.js`
  Verify: `npm run build` — no errors.

- [ ] 8. **Upgrade `WhyChooseUs.js`** — card polish + ambient section gradient
  Current state: good card structure, but background is plain `bg-slate-50`. Changes:
  - Add amber-tinted gradient overlay to section background: `bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900`.
  - Upgrade card hover: `hover:-translate-y-1.5 hover:shadow-xl hover:ring-1 hover:ring-amber-500/20`.
  - Add a bottom amber `border-b-4 border-b-transparent group-hover:border-b-amber-500` accent to each card.
  Files: `components/home/WhyChooseUs.js`
  Verify: `npm run build` — no errors.

- [ ] 9. **Upgrade `StatsSection.js`** — animated number appearance + visual dividers
  Add `framer-motion`'s `<motion.div>` wrapper to each stat with `initial={{ opacity:0, y:20 }}` and `whileInView={{ opacity:1, y:0 }}` with a staggered `transition={{ delay: index * 0.1 }}`. Add a top and bottom amber stripe (`border-t-4 border-b-4 border-amber-600/30`) to the section for visual contrast.
  Files: `components/home/StatsSection.js`
  Verify: `npm run build` — no errors; framer-motion is an existing dependency, no new installs needed.

- [ ] 10. **Upgrade `ProjectsSection.js`** — card image placeholder and hover overlay
  Current state: project cards have a flat `bg-gradient-to-br from-slate-800 to-slate-950` placeholder. Changes:
  - Add a hover overlay: `group-hover:bg-amber-500/10 transition` on the image area div.
  - Make `FaBolt` icon pulse on hover: `group-hover:scale-110 group-hover:text-amber-400 transition`.
  - Add a `gap-1.5` row below the location with an amber `FaBolt` bullet.
  - "View all projects" link: add a right-arrow icon with `group-hover:translate-x-1 transition` on the arrow.
  Files: `components/home/ProjectsSection.js`
  Verify: `npm run build` — no errors.

- [ ] 11. **Upgrade `home/CTASection.js`** — already well-built, minor enhancements only
  This is already the best CTA in the codebase (SVG decoration, focus rings, etc.). Minor additions:
  - Add `motion.div` from framer-motion with `initial={{ opacity:0, x:-30 }}` and `whileInView={{ opacity:1, x:0 }}` around the text block.
  - Add a second decorative SVG on the right side (mirroring the left one, `right-0`, `opacity-[0.06]`) for symmetry.
  Files: `components/home/CTASection.js`
  Verify: `npm run build` — no errors.

- [ ] 12. **Upgrade `ServicesSection.js`** — service card improvements
  Add a `<p>` for `service.description` below the title (the data already has it, the card just doesn't render it). Also tighten hover ring: `group-hover:ring-1 group-hover:ring-amber-500/30`. Keep icon hover color-flip (`group-hover:bg-amber-500 group-hover:text-white`) which already exists.
  Files: `components/services/ServicesSection.js`
  Verify: `npm run build` — no errors; data file (`@/data/services`) is unchanged.

- [ ] 13. **Upgrade `app/(website)/services/page.js`** — fix p-15, polish sections
  - Replace all four `p-15` with `p-10` (valid Tailwind value, same visual intent).
  - Add description text to each step card in the "How We Work" process section (currently only a heading + number).
  - Add a `text-slate-500 dark:text-slate-400 mt-2 text-sm` description line per step (e.g. "We listen to your needs and goals").
  - Inline CTA section at bottom: replace with `<CTASection>` from `@/components/common/CTASection` so it stays consistent — import is already in scope of the pattern, but since this file already has an inline CTA identical to the common one, just swap it out.
  Files: `app/(website)/services/page.js`
  Verify: `npm run build` — zero errors; no p-15 class emitted.

- [ ] 14. **Upgrade `app/(website)/about/page.js`** — Mission/Vision cards + inline CTA swap
  - Mission & Vision cards: add `transition hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-amber-500/20` to the two `rounded-3xl` cards.
  - Core Values cards: apply the same hover treatment; add a bottom amber border accent (`border-b-2 border-b-transparent hover:border-b-amber-500`).
  - Replace the inline amber CTA at the bottom with `<CTASection>` from `@/components/common/CTASection` — import it and remove the inline section. Pass `title="Ready to Work With Us?" description="Whether it's an installation, maintenance project, or electrical consultation, we're ready to help." buttonText="Contact Us Today"`.
  - "Our Story" image placeholder (`rounded-3xl bg-slate-100`): add `FaBolt` animation class `animate-pulse` and a `text-amber-400/30` second bolt for visual depth.
  Files: `app/(website)/about/page.js`
  Verify: `npm run build` — no errors.

- [ ] 15. **Upgrade `ContactInfo.js`** — info row polish + emergency card
  - Each contact row: wrap in a `rounded-xl px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 flex gap-4 items-start` container so items read as cards, not floating text.
  - Icon: bump to `text-amber-500` and `text-xl flex-none`.
  - Emergency Support card: add an amber left border (`border-l-4 border-amber-500`) and an animated `FaBolt` icon before the heading.
  Files: `components/contact/ContactInfo.js`
  Verify: `npm run build` — no errors. ContactInfo is an async server component; no state/logic changes.

- [ ] 16. **Upgrade `ContactForm.js`** — form polish
  - Add `focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition` to all inputs, select, and textarea (currently missing focus styles).
  - Textarea: add the same dark mode classes (`dark:border-slate-700 dark:bg-slate-800 dark:text-white`) that inputs already have.
  - Submit button: add `disabled:opacity-60 disabled:cursor-not-allowed` so the loading state is visually obvious.
  - Wrap the form in a `motion.div` with `initial={{ opacity:0, y:20 }}` / `animate={{ opacity:1, y:0 }}` / `transition={{ duration:0.4 }}` for a polished entrance.
  No logic, no field names, no Supabase call changed.
  Files: `components/contact/ContactForm.js`
  Verify: `npm run build` — `"use client"` directive preserved; no errors.

- [ ] 17. **Upgrade `app/(website)/materials/page.js`** — page-level polish
  - Wrap page in a standard hero-style header section (`bg-slate-950 text-white py-16`) with badge, h1, and description to match other inner pages — currently it's a bare `<section>` with no page header treatment.
  - Move the `<h1>` and description into the new header section with amber badge.
  - Filter buttons row: add above the grid — "All", "Cables", "Switches", "Panels", "Lighting" filter buttons (static, visual-only, no JS logic) matching the style in `projects/page.js`.
  - Card grid: add `shadow-sm hover:shadow-md transition` to the existing card div.
  Files: `app/(website)/materials/page.js`
  Verify: `npm run build` — supabase query and `materials?.map` pattern unchanged.

- [ ] 18. **Upgrade `MaterialCard.js`** — card refinement
  - Add missing dark mode border class: `dark:border-slate-800`.
  - Add `transition hover:-translate-y-1 hover:shadow-lg` on the outer div.
  - Handle missing image: add a fallback div (same `flex h-56 items-center justify-center bg-slate-100 dark:bg-slate-800` with `FaBolt` placeholder) when `material.image_url` is falsy — currently the `<img>` crashes with a broken image.
  - Button: add `hover:bg-amber-600 transition-colors` and `font-semibold`.
  `useMaterials().addItem` call and `"use client"` directive unchanged.
  Files: `components/materials/MaterialCard.js`
  Verify: `npm run build` — no errors.

- [ ] 19. **Upgrade `app/(website)/projects/page.js`** — filter bar polish
  Filter buttons: add `transition-colors hover:bg-amber-500 hover:text-white hover:border-amber-500` to the inactive filter buttons; add `text-sm font-medium` to all buttons for consistency.
  Files: `app/(website)/projects/page.js`
  Verify: `npm run build` — supabase query and `ProjectCard` usage unchanged.

- [ ] 20. **Upgrade `ProjectCard.js`** — category badge color map + image fallback
  - Image fallback (when `!project.image_url`): replace plain gray div with a styled dark gradient div + `FaBolt` icon centered, matching `ProjectsSection.js` style.
  - Category badge: currently a flat amber pill. Keep shape but swap to a color-mapped system: `{ Residential: "bg-blue-100 text-blue-700", Commercial: "bg-violet-100 text-violet-700", Industrial: "bg-slate-100 text-slate-700", Solar: "bg-green-100 text-green-700" }` — use a `const categoryColors` map and fall back to amber. This makes filtering more scannable.
  - "View Details →" button: replace with a proper `<button>` styled as `inline-flex items-center gap-1.5 text-sm font-semibold text-amber-500 hover:text-amber-600 transition-colors group`; add `<FaArrowRight>` with `group-hover:translate-x-0.5 transition-transform`.
  Files: `components/projects/ProjectCard.js`
  Verify: `npm run build` — no errors; `project` prop shape unchanged.

- [ ] 21. **Upgrade `Footer.js`** — color contrast fix + newsletter hint row
  - Current `bg-slate-200` on the footer causes very low contrast for `text-slate-300` text (near-white text on near-white background). Fix: change footer background to `bg-slate-900 dark:bg-slate-950` so text is legible in both themes.
  - Social icons: dark border `border-slate-800` is invisible on `bg-slate-200`; with the new dark background it's correct. No change needed.
  - Copyright bar: currently `border-slate-900` which is invisible on `bg-slate-200` — with the fixed background it'll render correctly.
  Files: `components/footer/Footer.js`
  Verify: `npm run build` — no errors; `getSettings()` call and social link filtering logic unchanged.

- [ ] 22. **Upgrade `WhatsAppButton.js`** — tooltip + pulse ring
  - Add a ping animation ring (`<span className="absolute -inset-1 rounded-full bg-green-500/30 animate-ping" aria-hidden="true">`) to draw attention to the WhatsApp button.
  - Add a hover tooltip: `<span className="absolute right-16 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Chat on WhatsApp</span>`. Add `group relative` to the outer `<a>`.
  Files: `components/ui/WhatsAppButton.js`
  Verify: `npm run build` — server component, async, `getSettings()` call unchanged.

---

## Constraint reminders for the coder

1. **No business logic changes** — no Supabase queries, no API routes, no auth flows, no context state logic.
2. **Tailwind 4 CSS-first** — there is no `tailwind.config.js`. Custom utilities must be added to `globals.css` using `@layer utilities { }`. Arbitrary values like `[mask-image:…]` are valid. Do not introduce a config file.
3. **framer-motion** — import as `"use client"` context: any component using `motion.*` must either already be `"use client"` or wrap the animated portion in a small `"use client"` sub-component. Server components (`ContactInfo`, `Footer`, `WhatsAppButton`, `Hero`, `CTASection` home) must not get the `"use client"` directive added — instead, extract a thin client wrapper if animation is needed.
4. **`p-15` is invalid** — Tailwind 4's default scale goes in steps of 0.5 up to 12, then 14, 16, 20… There is no `p-15`. Replace with `p-10` or `p-12` as appropriate.
5. **`h-25` is invalid** — replace with `h-16` or another valid scale value.
6. **All default exports must remain default exports.** Named export shapes must not change.
7. Verify each item with `npm run build` — the project uses `next build` which runs Tailwind compilation and will surface any class or import errors.
