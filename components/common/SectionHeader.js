export default function SectionHeader({
  title,
  description,
  center = true,
}) {
  return (
    <div
      className={`mb-14 ${
        center ? "text-center" : ""
      }`}
    >
      <h2 className="text-3xl font-bold md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}