"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Menu, Sun, Moon, Zap } from "lucide-react";

// Map route → short page label shown in the header
const ROUTE_LABELS = {
  "/dashboard":                   "Overview",
  "/dashboard/projects":          "Projects",
  "/dashboard/enquiries":         "Enquiries",
  "/dashboard/materials":         "Materials",
  "/dashboard/material-requests": "Material Requests",
  "/dashboard/settings":          "Settings",
};

export default function MobileHeader({ setSidebarOpen }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark    = resolvedTheme === "dark";
  const pageLabel = ROUTE_LABELS[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 lg:hidden">
      {/* ── Main bar ── */}
      <div className="relative flex h-20 items-center justify-between overflow-hidden bg-slate-900 px-5 dark:bg-slate-950">

        {/* Decorative amber glow blob — top-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl"
        />

        {/* Decorative circuit dots */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mobile-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="#F59E0B" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mobile-dots)" />
          </svg>
        </div>

        {/* ── LEFT: hamburger + brand ── */}
        <div className="relative flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/10 transition hover:bg-amber-500 hover:ring-amber-500"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo mark + name */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 shadow-md shadow-amber-500/40">
              <Zap className="h-5 w-5 text-white" />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-bold text-white">Huncho Admin</p>
              <p className="text-[11px] font-medium text-amber-400/80">
                {pageLabel}
              </p>
            </div>
          </Link>
        </div>

        {/* ── RIGHT: theme toggle ── */}
        <div className="relative flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-amber-300 ring-1 ring-white/10 transition hover:bg-amber-500 hover:text-white hover:ring-amber-500"
            >
              {isDark
                ? <Sun  className="h-4 w-4" />
                : <Moon className="h-4 w-4" />
              }
            </button>
          )}
        </div>
      </div>

      {/* ── Amber accent rule ── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
    </header>
  );
}
