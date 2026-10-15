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
    <section className="bg-gradient-to-b from-slate-50 to-white py-20 dark:from-slate-950 dark:to-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Why choose Huncho Electrical
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-amber-500" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl bg-white p-7 text-center shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 hover:ring-amber-400/50 dark:bg-slate-900"
            >
              {/* Icon with hover glow */}
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_0_16px_0_rgb(245_158_11_/0.4)] dark:bg-amber-500/10 dark:text-amber-400">
                <Icon />
              </span>

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {text}
              </p>

              {/* Bottom amber accent */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-amber-500 transition-transform duration-300 group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
