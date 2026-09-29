"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/lib/auth";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaExclamationCircle,
  FaBolt,
  FaArrowRight,
} from "react-icons/fa";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await signIn({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (signInError) {
      setError(
        signInError.message || "Couldn't sign you in. Please try again."
      );
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 sm:px-6">
      {/* Gradient base */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Logo watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
      >
        <Image
          src="/images/huncho_elctrical_logo.png"
          alt=""
          fill
          sizes="100vw"
          className="object-contain object-center mix-blend-screen"
        />
      </div>

      {/* Readability overlay */}
      <div className="absolute inset-0 -z-10 bg-slate-950/60" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur dark:bg-slate-900/95 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
              <FaBolt className="h-5 w-5" />
            </span>

            <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Sign in to manage your electrical business dashboard.
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
              <FaExclamationCircle className="mt-0.5 h-4 w-4 flex-none" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Email address
              </label>

              <div className="relative">
                <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <FaLock className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <FaSpinner className="h-4 w-4 animate-spin" />
              ) : (
                <FaArrowRight className="h-4 w-4" />
              )}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}