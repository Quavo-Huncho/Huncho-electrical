"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import ThemeToggle from "../ui/ThemeToggle";
import { getUser, signOut } from "@/lib/auth";
import { LayoutDashboard, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut();

    router.push("/");
    router.refresh();
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Materials", href: "/materials" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-slate-100 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-amber-500">
              <Image
                src="/logo.png"
                width={40}
                height={40}
                alt="Huncho Electrical"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Huncho Electrical
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Power & Energy Solutions
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-medium transition-colors hover:text-amber-500 ${
                    isActive
                      ? "text-amber-500"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-amber-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white transition hover:bg-amber-600 dark:bg-amber-500 cursor-pointer">
              <ThemeToggle />
            </div>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 hover:border-amber-500"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                >
                  Logout
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                  Login
                  <LogIn size={16} />
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu — slide-down animation */}
      <div
        className={`overflow-hidden border-t bg-white transition-all duration-300 ease-in-out dark:bg-slate-950 md:hidden ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-5 py-3.5 font-medium transition-colors hover:text-amber-500 ${
                  isActive
                    ? "border-l-2 border-amber-500 pl-4 text-amber-500"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 p-5 pt-4">
          <ThemeToggle />

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-white"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-center text-sm text-white hover:bg-green-600"
              >
                Login
                <LogIn size={16} />
              </Link>

              <Link
                href="/register"
                className="flex h-11 items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-center text-white hover:bg-amber-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
