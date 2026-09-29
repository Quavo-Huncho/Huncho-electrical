import Link from "next/link";
import { FaBolt, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

const projects = [
  { title: "Government Building Contract", location: "Enugu" },
  { title: "Commercial Building Wiring", location: "Port Harcourt" },
  { title: "Solar Power Installation", location: "Abuja" },
  { title: "Industrial Electrical Upgrade", location: "Lagos" },
  { title: "Residential House Wiring", location: "Bayelsa" },
  { title: "Estate House Wiring", location: "Benin City" },
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

            <p className="mt-3 max-w-xl text-base leading-7 text-slate-500 dark:text-slate-400">
              A sample of the electrical work we&apos;ve delivered across
              Nigeria.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          >
            View all projects
            <FaArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-52 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-amber-500/70">
                <FaBolt className="h-9 w-9" />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h3>

                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <FaMapMarkerAlt className="h-3 w-3" />
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
