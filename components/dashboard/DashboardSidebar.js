"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { X } from "lucide-react";

import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Settings,
  Zap,
  Globe,
  Home,
  Briefcase,
  Phone,
  Info,
} from "lucide-react";

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const pathname = usePathname();

  const adminLinks = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      name: "Enquiries",
      href: "/dashboard/enquiries",
      icon: MessageSquare,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 z-[999]
        h-screen w-[280px] max-w-[85vw]
        overflow-y-auto
        bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-300
        transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        lg:translate-x-0
        lg:static
        lg:flex
        lg:flex-col
      `}
    >

      {/* Logo */}
      <div className="border-b border-slate-200 p-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white">
            <Zap size={24} />
          </div>

          <div>
            
            <h2 className="text-xl font-bold">
              Huncho Admin
            </h2>

            <p className="text-sm text-slate-500">
              Control Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {adminLinks.map((link) => {
            const Icon = link.icon;

            const isActive =
              pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-amber-500 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
              >
                <Icon size={18} />

                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Website Links */}
      <div className="mt-8">
        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Website
        </p>

        <div className="space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Home size={18} />
            Home
          </Link>

          <Link
            href="/about"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Info size={18} />
            About
          </Link>

          <Link
            href="/services"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Briefcase size={18} />
            Services
          </Link>

          <Link
            href="/projects"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FolderKanban size={18} />
            Projects
          </Link>

          <Link
            href="/contact"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Phone size={18} />
            Contact
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="mb-4 rounded-xl bg-slate-100 p-4 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Logged in as
          </p>

          <p className="mt-1 truncate font-medium">
            Admin User
          </p>
        </div>

        <div className="space-y-3">
          <ThemeToggle />

          <LogoutButton />
        </div>
      </div>

    </aside>
  );
}