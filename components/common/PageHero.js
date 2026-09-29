export default function PageHero({
  badge,
  title,
  description,
}) {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {badge && (
            <span className="rounded-full bg-amber-500/20 px-4 py-5 text-amber-400">
              {badge}
            </span>
          )}

          <h1 className="mt-10 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="mt-6 text-lg text-slate-300">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}