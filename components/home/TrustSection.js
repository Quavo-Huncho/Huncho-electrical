import { FaAward, FaShieldAlt, FaUserCheck, FaTools } from "react-icons/fa";

const items = [
  { icon: FaAward, title: "Certified professionals" },
  { icon: FaShieldAlt, title: "Safety compliant" },
  { icon: FaUserCheck, title: "Trusted service" },
  { icon: FaTools, title: "Quality workmanship" },
];

export default function TrustSection() {
  return (
    <section className="border-b border-slate-100 bg-white py-10 dark:border-slate-800 dark:bg-slate-950 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {items.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-amber-100 text-lg text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Icon />
              </span>

              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-base">
                {title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
