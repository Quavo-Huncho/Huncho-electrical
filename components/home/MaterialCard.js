import Image from "next/image";
import Link from "next/link";
import { FaBolt, FaStar, FaArrowRight } from "react-icons/fa";

function formatPrice(price) {
  if (price === null || price === undefined || price === "") return null;
  return `₦${Number(price).toLocaleString()}`;
}

export default function MaterialCard({ material }) {
  const inStock = material.in_stock;
  const price = formatPrice(material.price);

  console.log("Material:", material.name);
  console.log("Image URL:", material.image_url);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950">
        {material.image_url ? (
          <Image
            src={material.image_url}
            alt={material.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            className={`object-cover transition duration-500 group-hover:scale-105 ${
              inStock ? "" : "opacity-60"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-amber-500/70">
            <FaBolt className="h-9 w-9" />
          </div>
        )}

        {material.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            <FaStar className="h-3 w-3" />
            Featured
          </span>
        )}

        {!inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Out of stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {material.category && (
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
            {material.category}
          </p>
        )}

        <h3 className="mt-1 line-clamp-1 text-lg font-bold text-slate-900 dark:text-white">
          {material.name}
        </h3>

        {material.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {material.description}
          </p>
        )}

        <div className="mt-5 flex flex-1 items-end justify-between gap-3">
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {price || "Price on request"}
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {inStock ? "Request quote" : "Ask availability"}
            <FaArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
