export default function SectionHeader({
  title,
  description,
  center = true,
  badge,
}) {
  return (
    <div
      className={`mb-14 ${center ? "text-center" : ""}`}
    >
      {badge && (
        <span className="mb-3 inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
          {badge}
        </span>
      )}

      <h2 className="text-3xl font-bold md:text-4xl">
        {title}
      </h2>

      {/* Amber accent underline */}
      <div
        className={`mt-3 h-1 w-16 rounded-full bg-amber-500 ${
          center ? "mx-auto" : ""
        }`}
      />

      {description && (
        <p className="mt-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
