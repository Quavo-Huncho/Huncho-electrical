"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import ThemeToggle from "../ui/ThemeToggle";
import { getUser, signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();

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
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur dark:bg-slate-950/95">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-25 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white font-bold">
              HE
            </div>

            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                Huncho Electrical
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Power & Energy Solutions
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-medium hover:text-amber-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white transition hover:border-amber-600 hover:bg-amber-600 dark:border-slate-700 dark:bg-amber-500 cursor-pointer">
              <ThemeToggle />  
            </div>
            

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg border  gap-2 px-4 py-2 hover:border-amber-500 flex items-center cursor-pointer"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Logout
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg bg-green-500 hover:bg-green-600 px-4 flex items-center py-2 gap-2 text-white cursor-pointer"
                >
                  Login
                  <LogIn size={16} />
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2 text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white dark:bg-slate-950">
          <div className="flex flex-col p-5">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-3"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-3">
              
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
                    className="flex h-11 items-center justify-center rounded-xl bg-green-500 px-4 py-2 text-center text-sm  hover:bg-green-600 gap-2 text-white"
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
        </div>
      )}
    </header>
  );
}