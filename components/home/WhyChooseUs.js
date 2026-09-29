import { FaCheckCircle, FaShieldAlt, FaClock, FaAward } from "react-icons/fa";

const reasons = [
  {
    icon: FaShieldAlt,
    title: "Safety first",
    text: "Strict compliance with electrical safety standards on every job.",
  },
  {
    icon: FaAward,
    title: "Professional team",
    text: "Experienced, certified technicians you can trust in your space.",
  },
  {
    icon: FaClock,
    title: "Fast response",
    text: "Quick turnarounds on quotes, callouts and project delivery.",
  },
  {
    icon: FaCheckCircle,
    title: "Quality assurance",
    text: "Durable workmanship backed by a satisfaction guarantee.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Why choose Huncho Electrical
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Icon />
              </span>

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
