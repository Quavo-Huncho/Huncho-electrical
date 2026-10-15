import Link from "next/link";
import { FaBolt, FaTools, FaSolarPanel, FaBuilding, FaArrowRight } from "react-icons/fa";
import { services } from "@/data/services";

const icons = [FaBolt, FaTools, FaBolt, FaSolarPanel, FaBuilding, FaTools];

// Distinct colour tints per index (cycling)
const colourMap = [
  // amber
  {
    bg: "bg-amber-100 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    hoverBg: "group-hover:bg-amber-500",
  },
  // blue
  {
    bg: "bg-blue-100 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    hoverBg: "group-hover:bg-blue-500",
  },
  // green
  {
    bg: "bg-green-100 dark:bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
    hoverBg: "group-hover:bg-green-500",
  },
  // red
  {
    bg: "bg-red-100 dark:bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    hoverBg: "group-hover:bg-red-500",
  },
  // violet
  {
    bg: "bg-violet-100 dark:bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    hoverBg: "group-hover:bg-violet-500",
  },
  // cyan
  {
    bg: "bg-cyan-100 dark:bg-cyan-500/10",
    text: "text-cyan-600 dark:text-cyan-400",
    hoverBg: "group-hover:bg-cyan-500",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-20 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Our services
          </h2>
          <div className="mt-3 h-1 w-16 rounded-full bg-amber-500" />

          <p className="mt-5 text-base leading-7 text-slate-500 dark:text-slate-400">
            Dependable electrical solutions for homes, businesses and
            industries.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length];
            const colour = colourMap[index % colourMap.length];

            return (
              <div
                key={service.title}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-amber-500/30 dark:border-slate-800 dark:bg-slate-900"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition ${colour.bg} ${colour.text} ${colour.hoverBg} group-hover:text-white`}
                >
                  <Icon />
                </span>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  {service.title}
                </h3>

                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {service.description}
                </p>

                <Link
                  href="/services"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-amber-500 transition hover:text-amber-600"
                >
                  Learn more
                  <FaArrowRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
