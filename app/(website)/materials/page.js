import { createClient } from "@/lib/supabase-server";
import MaterialCard from "@/components/materials/MaterialCard";
import CartBadge from "@/components/materials/CartBadge";

export const metadata = {
  title: "Materials | Huncho Electrical",
  description:
    "Browse available electrical materials and request a quote.",
};

export default async function MaterialsPage() {
  const supabase = await createClient();

  const { data: materials } = await supabase
    .from("materials")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white">
        {/* Subtle grid overlay */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="mat-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mat-grid)" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded-full bg-amber-500/20 px-4 py-1.5 text-sm font-medium text-amber-400">
                Materials Catalogue
              </span>

              <h1 className="mt-4 text-4xl font-bold">
                Electrical Materials
              </h1>

              <p className="mt-3 text-lg text-slate-300">
                Browse available electrical materials and request a quote.
              </p>
            </div>

            {/* Cart badge — client component */}
            <CartBadge />
          </div>
        </div>
      </section>

      {/* Filter buttons (visual only) */}
      <section className="bg-slate-50 py-6 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {["All", "Cables", "Switches", "Panels", "Lighting"].map(
              (cat, i) => (
                <button
                  key={cat}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    i === 0
                      ? "bg-amber-500 text-white"
                      : "border border-slate-300 text-slate-600 hover:border-amber-500 hover:text-amber-600 dark:border-slate-700 dark:text-slate-400"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Materials grid */}
      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {materials?.map((item) => (
              <MaterialCard key={item.id} material={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
