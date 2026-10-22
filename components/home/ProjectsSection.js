import Link from "next/link";
import Image from "next/image";
import {
  FaBolt,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";

async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Failed to fetch featured projects:", error);
    return [];
  }

  return data || [];
}

export default async function ProjectsSection() {
  const projects = await getProjects();

  return (
    <section className="bg-white py-20 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Featured Projects
            </h2>

            <div className="mt-3 h-1 w-16 rounded-full bg-amber-500" />

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-500 dark:text-slate-400">
              A selection of electrical installation, maintenance, and
              solar projects delivered by Huncho Electrical.
            </p>
          </div>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          >
            View all projects
            <FaArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Project image */}
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title || "Huncho Electrical project"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <FaBolt className="h-9 w-9 text-amber-500/70 transition group-hover:scale-110 group-hover:text-amber-400" />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-amber-500/0 transition group-hover:bg-amber-500/10" />

                  {project.category && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {project.category}
                    </span>
                  )}
                </div>

                {/* Project details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>

                  {project.category && (
                    <p className="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                      {project.category}
                    </p>
                  )}

                  {project.location && (
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <FaMapMarkerAlt className="h-3 w-3 text-amber-500" />
                      {project.location}
                    </p>
                  )}

                  {project.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {project.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="h-52 animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
                  <div className="space-y-3 p-6">
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm font-medium text-slate-400 dark:text-slate-500">
              Portfolio coming soon
            </p>
          </div>
        )}
      </div>
    </section>
  );
}