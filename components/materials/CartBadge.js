"use client";

import { useMaterials } from "@/context/MaterialRequestContext";
import { FaShoppingCart } from "react-icons/fa";

export default function CartBadge() {
  const { items } = useMaterials();
  const count = items?.length ?? 0;

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
      <FaShoppingCart className="h-4 w-4" />
      <span>{count} item{count !== 1 ? "s" : ""} in request</span>
    </div>
  );
}
