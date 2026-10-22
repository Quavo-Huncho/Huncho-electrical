"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  X,
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Settings,
  Zap,
  Package,
  Globe,
  ClipboardList,
  LogOut,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";

const adminLinks = [
  { name: "Overview",          href: "/dashboard",                   icon: LayoutDashboard },
  { name: "Projects",          href: "/dashboard/projects",          icon: FolderKanban },
  { name: "Enquiries",         href: "/dashboard/enquiries",         icon: MessageSquare },
  { name: "Materials",         href: "/dashboard/materials",         icon: Package },
  { name: "Material Requests", href: "/dashboard/material-requests", icon: ClipboardList },
  { name: "Settings",          href: "/dashboard/settings",          icon: Settings },
];

export default function DashboardSidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser]       = useState(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const isDark      = resolvedTheme === "dark";
  const initials    = (user?.user_metadata?.full_name || user?.email || "A")[0].toUpperCase();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-[999]
        flex h-screen w-64 flex-col
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        shadow-xl lg:shadow-none
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0
      `}
    >
      {/* ════════════════════════════════════════
          BRAND HEADER — dark panel with amber glow
      ════════════════════════════════════════ */}
      <div className="relative flex h-auto flex-none flex-col overflow-hidden bg-slate-900 pb-5 pt-5">

        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-6 -top-6 h-32 w-32 rounded-full bg-amber-500/25 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 rounded-full bg-amber-600/15 blur-2xl"
        />

        {/* Dot-grid texture */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="sb-dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#F59E0B" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sb-dots)" />
          </svg>
        </div>

        {/* Top row: logo + close */}
        <div className="relative flex items-center justify-between px-5">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3">
            {/* Icon badge */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 shadow-lg shadow-amber-500/40">
              <Zap className="h-5 w-5 text-white" />
              {/* Pulse ring */}
              <span className="absolute inset-0 animate-ping rounded-xl bg-amber-400 opacity-20" />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-extrabold tracking-wide text-white">
                Huncho Admin
              </p>
              <p className="text-[11px] font-medium text-amber-400/80">
                Control Panel
              </p>
            </div>
          </Link>

          {/* Close — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User chip */}
        {user && (
          <div className="relative mx-4 mt-4 flex items-center gap-2.5 rounded-xl bg-white/8 px-3 py-2.5 ring-1 ring-white/10">
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white shadow-md shadow-amber-500/30">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">{displayName}</p>
              <p className="truncate text-[10px] text-slate-400">{user.email}</p>
            </div>
          </div>
        )}

        {/* Amber rule */}
        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
      </div>

      {/* ════════════════════════════════════════
          MAIN NAV
      ════════════════════════════════════════ */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Main menu
        </p>

        <ul className="space-y-0.5">
          {adminLinks.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                    ${isActive
                      ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                >
                  {/* Active left pill */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white/50" />
                  )}

                  <Icon
                    className={`h-4 w-4 flex-none transition-colors
                      ${isActive ? "text-white" : "text-slate-400 group-hover:text-amber-500"}`}
                  />
                  <span className="flex-1">{name}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 border-t border-slate-200 dark:border-slate-800" />

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Website
        </p>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Globe className="h-4 w-4 flex-none text-slate-400" />
          View Live Site
          <span className="ml-auto text-xs text-slate-400">↗</span>
        </Link>
      </nav>

      {/* ════════════════════════════════════════
          FOOTER ACTIONS
      ════════════════════════════════════════ */}
      <div className="flex-none border-t border-slate-200 p-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-amber-400 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-amber-500 dark:hover:text-amber-400"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500 dark:hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
