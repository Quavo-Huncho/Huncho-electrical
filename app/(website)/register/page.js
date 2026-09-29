"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signUp } from "@/lib/auth";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaRegCircle,
  FaBolt,
  FaEnvelopeOpenText,
  FaArrowRight,
} from "react-icons/fa";

const REQUIREMENTS = [
  { key: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { key: "letter", label: "Contains a letter", test: (v) => /[a-zA-Z]/.test(v) },
  { key: "number", label: "Contains a number", test: (v) => /[0-9]/.test(v) },
  {
    key: "symbol",
    label: "Contains a symbol",
    test: (v) => /[^a-zA-Z0-9]/.test(v),
  },
];

const STRENGTH_COLORS = [
  "bg-slate-300 dark:bg-slate-700",
  "bg-rose-500",
  "bg-amber-500",
  "bg-amber-500",
  "bg-emerald-500",
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const metRequirements = useMemo(
    () =>
      REQUIREMENTS.map((req) => ({ ...req, met: req.test(formData.password) })),
    [formData.password]
  );

  const metCount = metRequirements.filter((r) => r.met).length;
  const allMet = metCount === REQUIREMENTS.length;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!allMet) {
      setError(
        "Your password must be at least 8 characters and include a letter, a number and a symbol."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
    });

    setLoading(false);

    if (signUpError) {
      setError(
        signUpError.message || "Couldn't create your account. Please try again."
      );
      return;
    }

    setSuccess(true);
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
          {success ? (
            <div className="flex flex-col items-center py-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <FaEnvelopeOpenText className="h-6 w-6" />
              </span>

              <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                Check your email
              </h1>

              <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                We&apos;ve sent a verification link to{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formData.email}
                </span>
                . Confirm it to activate your account.
              </p>

              <Link
                href="/login"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                  <FaBolt className="h-5 w-5" />
                </span>

                <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  Create your account
                </h1>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Get access to your electrical business dashboard.
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
                    htmlFor="fullName"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <FaUser className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="Jane Doe"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

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
                      required
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <FaLock className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
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

                  {/* Strength bar */}
                  {formData.password && (
                    <div className="mt-2.5 flex gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i < metCount
                              ? STRENGTH_COLORS[metCount]
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Requirements checklist */}
                  <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {metRequirements.map((req) => (
                      <li
                        key={req.key}
                        className={`flex items-center gap-1.5 text-xs ${
                          req.met
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {req.met ? (
                          <FaCheckCircle className="h-3 w-3 flex-none" />
                        ) : (
                          <FaRegCircle className="h-3 w-3 flex-none" />
                        )}
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <FaLock className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirm ? (
                        <FaEyeSlash className="h-4 w-4" />
                      ) : (
                        <FaEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {formData.confirmPassword && (
                    <p
                      className={`mt-2 text-xs ${
                        formData.confirmPassword === formData.password
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-500"
                      }`}
                    >
                      {formData.confirmPassword === formData.password
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </p>
                  )}
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
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}