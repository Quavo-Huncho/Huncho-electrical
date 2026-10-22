"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Sun, Moon, Globe, LogOut, ChevronDown } from "lucide-react";

const ROUTE_LABELS = {
  "/dashboard":                   "Overview",
  "/dashboard/projects":          "Projects",
  "/dashboard/enquiries":         "Enquiries",
  "/dashboard/materials":         "Materials",
  "/dashboard/material-requests": "Material Requests",
  "/dashboard/settings":          "Settings",
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const router   = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted]   = useState(false);
  const [user, setUser]         = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const isDark      = resolvedTheme === "dark";
  const pageLabel   = ROUTE_LABELS[pathname] ?? "Dashboard";
  const initials    = (user?.user_metadata?.full_name || user?.email || "A")[0].toUpperCase();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      {/* Amber accent rule */}
      <div className="h-[3px] w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

      <div className="flex h-20 w-full items-center justify-between gap-4 px-6">

        {/* ── LEFT: breadcrumb ── */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400 dark:text-slate-500">Dashboard</span>
          {pageLabel !== "Overview" && (
            <>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-semibold text-slate-800 dark:text-white">{pageLabel}</span>
            </>
          )}
        </div>

        {/* ── RIGHT: actions ── */}
        <div className="flex items-center gap-2">

          {/* View Website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-amber-400 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-amber-500 dark:hover:text-amber-400 md:flex"
          >
            <Globe className="h-3.5 w-3.5" />
            Live site
          </Link>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-amber-400 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-amber-500 dark:hover:text-amber-400"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
                {initials}
              </div>
              <span className="hidden max-w-[120px] truncate font-medium text-slate-700 dark:text-slate-300 sm:block">
                {displayName}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 flex-none text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">
                    {user?.user_metadata?.full_name || "Admin"}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-400">{user?.email}</p>
                </div>

                <div className="p-1.5">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    Settings
                  </Link>

                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    View live site
                  </Link>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
