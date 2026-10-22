const stats = [
  { value: "500+", label: "Projects completed" },
  { value: "300+", label: "Happy clients" },
  { value: "10+", label: "Years experience" },
  { value: "24/7", label: "Emergency support" },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-amber-500 py-16 sm:py-20">
      {/* Decorative circuit/electricity SVG lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
        viewBox="0 0 800 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Horizontal rail */}
        <path
          d="M0 100 L800 100"
          stroke="white"
          strokeWidth="1"
          strokeDasharray="6 4"
        />
        {/* Vertical drops */}
        <path d="M100 0 L100 200" stroke="white" strokeWidth="0.8" />
        <path d="M300 0 L300 200" stroke="white" strokeWidth="0.8" />
        <path d="M500 0 L500 200" stroke="white" strokeWidth="0.8" />
        <path d="M700 0 L700 200" stroke="white" strokeWidth="0.8" />
        {/* Corner nodes */}
        <circle cx="100" cy="100" r="4" fill="white" />
        <circle cx="300" cy="100" r="4" fill="white" />
        <circle cx="500" cy="100" r="4" fill="white" />
        <circle cx="700" cy="100" r="4" fill="white" />
        {/* Branches */}
        <path d="M100 100 L140 60 L180 80" stroke="white" strokeWidth="0.8" />
        <path d="M300 100 L260 140 L220 120" stroke="white" strokeWidth="0.8" />
        <path d="M500 100 L540 60 L580 80" stroke="white" strokeWidth="0.8" />
        <path d="M700 100 L660 140 L620 120" stroke="white" strokeWidth="0.8" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-slate-900/50">
          Our track record
        </p>
        <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`sm:px-4 ${index < 3 ? "sm:border-r sm:border-slate-900/20" : ""} ${
                index >= 2 ? "border-t border-slate-900/15 pt-8 sm:border-t-0 sm:pt-0" : ""
              }`}
            >
              <p className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                {stat.value}
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900/70 sm:text-base">
                {stat.label}
                <span className="ml-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-slate-900/40 align-middle" aria-hidden="true" />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
