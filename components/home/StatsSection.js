const stats = [
  { value: "500+", label: "Projects completed" },
  { value: "300+", label: "Happy clients" },
  { value: "10+", label: "Years experience" },
  { value: "24/7", label: "Emergency support" },
];

export default function StatsSection() {
  return (
    <section className="bg-amber-500 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4 sm:divide-x sm:divide-slate-900/10">
          {stats.map((stat) => (
            <div key={stat.label} className="sm:px-4">
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {stat.value}
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900/70 sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
