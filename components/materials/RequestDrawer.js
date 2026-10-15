"use client";

import { useMaterials } from "@/context/MaterialRequestContext";
import Link from "next/link";

export default function RequestDrawer() {
  const { items } =
    useMaterials();

  if (items.length === 0)
    return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 rounded-2xl bg-amber-500 p-5 text-white shadow-xl">
      <p className="font-semibold">
        {items.reduce(
          (total, item) =>
            total + item.quantity,
          0
        )} item(s)
      </p>

      <Link
        href="/materials/request"
        className="mt-2 block rounded-lg bg-white px-4 py-2 text-center text-amber-500"
      >
        Request Quote
      </Link>
    </div>
  );
}