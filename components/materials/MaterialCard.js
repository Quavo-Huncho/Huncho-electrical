"use client";

import Image from "next/image";
import { FaBolt } from "react-icons/fa";
import { useMaterials } from "@/context/MaterialRequestContext";

export default function MaterialCard({ material }) {
  const { addItem, items } = useMaterials();

  const isInCart = items?.some((i) => i.id === material.id);

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      {/* Image area */}
      <div className="relative overflow-hidden">
        {material.image_url ? (
          <div className="relative h-56 w-full transition group-hover:scale-105">
            <Image
              src={material.image_url}
              alt={material.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
            <FaBolt className="h-10 w-10 text-amber-400/60" />
          </div>
        )}

        {/* In-cart checkmark badge */}
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

      <div className="p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {material.name}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {material.category}
        </p>

        <p className="mt-3 text-xl font-bold text-amber-500">
          ₦{Number(material.price || 0).toLocaleString()}
        </p>

        <button
          onClick={() => addItem(material)}
          className="mt-4 w-full rounded-xl bg-amber-500 py-3 font-semibold text-white transition hover:bg-amber-600"
        >
          {isInCart ? "Added to Request" : "Add To Request"}
        </button>
      </div>
    </div>
  );
}
