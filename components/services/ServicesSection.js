import { FaBolt, FaTools, FaSolarPanel, FaBuilding } from "react-icons/fa";
import { services } from "@/data/services";

const icons = [FaBolt, FaTools, FaBolt, FaSolarPanel, FaBuilding, FaTools];

export default function ServicesSection() {
  return (
    <section className="bg-white py-20 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Our services
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400">
            Dependable electrical solutions for homes, businesses and
            industries.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length];

            return (
              <div
                key={service.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-500/10 dark:text-amber-400">
                  <Icon />
                </span>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  {service.title}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
