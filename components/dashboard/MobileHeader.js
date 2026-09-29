"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function MobileHeader({
  setSidebarOpen,
}) {
  return (
    <div className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-800 bg-white/95 text-slate-950 dark:bg-slate-900 dark:text-slate-300 px-4 lg:hidden">
      <button
        onClick={() => setSidebarOpen(true)}
      >
        <Menu />
      </button>

      <h2 className="font-bold text-lg text-slate-900 dark:text-white">
        Huncho Admin
      </h2>

      <Link
        href="/"
        className="rounded-lg border border-slate-700 px-3 py-2 text-xs"
      >
        View Website
      </Link>
    </div>
  );
}