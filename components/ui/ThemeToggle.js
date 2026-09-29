"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-amber-500 text-white transition hover:border-amber-600 hover:bg-amber-600 dark:border-slate-700 dark:bg-amber-500 cursor-pointer"
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}