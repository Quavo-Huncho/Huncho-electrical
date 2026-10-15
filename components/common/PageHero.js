import { FaBolt } from "react-icons/fa";

export default function PageHero({
  badge,
  title,
  description,
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Animated grid/circuit decoration */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Subtle radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 50%, rgb(245 158 11 / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl animate-fade-in-up">
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-4 py-1.5 text-sm font-medium text-amber-400">
              <FaBolt className="h-3 w-3" />
              {badge}
            </span>
          )}

          <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 C360 0 1080 0 1440 40 L1440 40 L0 40 Z"
            fill="currentColor"
            className="text-white dark:text-slate-900"
          />
        </svg>
      </div>
    </section>
  );
}
