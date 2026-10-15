import Link from "next/link";
import { FaBolt, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

const projects = [
  {
    title: "Government Building Contract",
    location: "Enugu",
    gradient: "from-slate-800 via-slate-700 to-slate-600",
  },
  {
    title: "Commercial Building Wiring",
    location: "Port Harcourt",
    gradient: "from-blue-900 via-slate-800 to-slate-700",
  },
  {
    title: "Solar Power Installation",
    location: "Abuja",
    gradient: "from-green-900 via-slate-800 to-slate-700",
  },
  {
    title: "Industrial Electrical Upgrade",
    location: "Lagos",
    gradient: "from-red-900 via-slate-800 to-slate-700",
  },
  {
    title: "Residential House Wiring",
    location: "Bayelsa",
    gradient: "from-violet-900 via-slate-800 to-slate-700",
  },
  {
    title: "Estate House Wiring",
    location: "Benin City",
    gradient: "from-cyan-900 via-slate-800 to-slate-700",
  },
];

export default function ProjectsSection() {
  return (
    <section className="bg-white py-20 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Featured projects
            </h2>
            <div className="mt-3 h-1 w-16 rounded-full bg-amber-500" />
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-500 dark:text-slate-400">
              A sample of the electrical work we&apos;ve delivered across
              Nigeria.
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Image placeholder with shimmer overlay */}
              <div
                className={`relative flex h-52 items-center justify-center bg-gradient-to-br ${project.gradient} overflow-hidden`}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                <FaBolt className="h-9 w-9 text-amber-500/70 transition group-hover:scale-110 group-hover:text-amber-400" />

                {/* Hover overlay tint */}
                <div className="absolute inset-0 bg-amber-500/0 transition group-hover:bg-amber-500/10" />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h3>

                {/* Location badge */}
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <FaMapMarkerAlt className="h-3 w-3 text-amber-500" />
                  {project.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
