import Image from "next/image";

export default function ProjectCard({ project }) {
  return (
    <article className="overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-700 dark:bg-slate-950">
      
      {project.image_url ? (
        <div className="relative h-56 w-full">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-56 bg-slate-200 dark:bg-slate-800" />
      )}

      <div className="p-6">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
          {project.category}
        </span>

        <h3 className="mt-4 text-xl font-bold">
          {project.title}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          {project.location}
        </p>

        <p className="mt-4 text-slate-600 dark:text-slate-400">
          {project.description}
        </p>

        <button className="mt-6 font-semibold text-amber-500 transition hover:scale-105 cursor-pointer">
          View Details →
        </button>
      </div>
    </article>
  );
}