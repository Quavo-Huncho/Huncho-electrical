"use client";

import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 h-25 border-b border-slate-800 bg:white text:slate-900 dark:bg-slate-950  dark:text-slate-300">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <ThemeToggle />

          <Link
            href="/"
            className="hidden rounded-lg border border-slate-700 px-4 py-2 text-lg hover:border-amber-500 md:flex"
          >
            View Website
          </Link>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}