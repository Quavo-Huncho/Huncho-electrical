import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import MaterialCard from "@/components/home/MaterialCard";

// Change this if your public materials page lives at a different path
const ALL_MATERIALS_HREF = "/materials";

async function getMaterials() {
  const { data: featured } = await supabase
    .from("materials")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (featured && featured.length > 0) {
    return { materials: featured, hasFeatured: true };
  }

  // Nothing marked as featured yet, so fall back to the newest materials
  const { data: latest } = await supabase
    .from("materials")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  return { materials: latest || [], hasFeatured: false };
}

export default async function MaterialsSection() {
  const { materials, hasFeatured } = await getMaterials();

  // Hide the whole section until there is something to show
  if (materials.length === 0) return null;

  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {hasFeatured ? "Featured materials" : "Materials we supply"}
            </h2>
            <div className="mt-3 h-1 w-16 rounded-full bg-amber-500" />

            <p className="mt-3 max-w-xl text-base leading-7 text-slate-500 dark:text-slate-400">
              Quality cables, switches, breakers and more, available for your
              next installation.
            </p>
          </div>

          <Link
            href={ALL_MATERIALS_HREF}
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          >
            View all materials
            <FaArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      </div>
    </section>
  );
}
