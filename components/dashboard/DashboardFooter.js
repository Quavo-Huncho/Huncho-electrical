import Link from "next/link";
import { Zap } from "lucide-react";

const year = new Date().getFullYear();

const footerLinks = [
  { label: "Overview",          href: "/dashboard" },
  { label: "Projects",          href: "/dashboard/projects" },
  { label: "Enquiries",         href: "/dashboard/enquiries" },
  { label: "Materials",         href: "/dashboard/materials" },
  { label: "Requests",          href: "/dashboard/material-requests" },
  { label: "Settings",          href: "/dashboard/settings" },
];

export default function DashboardFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Amber top rule */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shadow-sm shadow-amber-500/30">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-slate-800 dark:text-white">Huncho Admin</p>
              <p className="text-[10px] text-slate-400">Control Panel</p>
            </div>
          </div>

          {/* Quick nav */}
          <nav className="flex flex-wrap gap-x-5 gap-y-1.5">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-slate-500 transition hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-slate-400 dark:text-slate-500 sm:text-right">
            © {year} Huncho Electrical
          </p>
        </div>
      </div>
    </footer>
  );
}
