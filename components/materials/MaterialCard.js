"use client";

import Image from "next/image";
import { FaBolt } from "react-icons/fa";
import { useMaterials } from "@/context/MaterialRequestContext";

export default function MaterialCard({ material }) {
  const { addItem, items } = useMaterials();

  const isInCart = items?.some((item) => item.id === material.id);

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      {/* Image area */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {material.image_url ? (
          <Image
            src={material.image_url}
            alt={material.name || "Electrical material"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FaBolt className="h-10 w-10 text-amber-400/60" />
          </div>
        )}

        {isInCart && (
          <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white shadow">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Material details */}
      <div className="p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {material.name}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {material.category}
        </p>

        <p className="mt-3 text-xl font-bold text-amber-500">
          {material.price !== null &&
          material.price !== undefined &&
          material.price !== ""
            ? `₦${Number(material.price).toLocaleString()}`
            : "Price on request"}
        </p>

        <button
          type="button"
          onClick={() => addItem(material)}
          className="mt-4 w-full rounded-xl bg-amber-500 py-3 font-semibold text-white transition hover:bg-amber-600"
        >
          {isInCart ? "Added to Request" : "Add To Request"}
        </button>
      </div>
    </div>
  );
}