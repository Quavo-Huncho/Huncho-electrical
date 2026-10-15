import Image from "next/image";
import { FaBolt } from "react-icons/fa";

const categoryColors = {
  residential: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400",
  commercial: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
  industrial: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400",
  solar: "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400",
};

function getCategoryClass(category) {
  if (!category) return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
  return (
    categoryColors[category.toLowerCase()] ||
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
  );
}

export default function ProjectCard({ project }) {
  return (
    <article className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-700 dark:bg-slate-950">
      {/* Image / placeholder */}
      <div className="relative h-56 w-full overflow-hidden">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
            <FaBolt className="h-9 w-9 text-amber-500/70 transition group-hover:scale-110 group-hover:text-amber-400" />
          </div>
        )}

        {/* Hover "View Details" overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
            View Details
          </span>
        </div>
      </div>

      <div className="p-6">
        <span
          className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${getCategoryClass(
            project.category
          )}`}
        >
          {project.category}
        </span>

        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          {project.title}
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {project.location}
        </p>

        <p className="mt-4 text-slate-600 dark:text-slate-400">
          {project.description}
        </p>
      </div>
    </article>
  );
}
