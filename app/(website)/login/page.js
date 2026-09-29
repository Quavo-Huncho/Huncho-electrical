"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { data, error } = await signIn({
      email: formData.email,
      password: formData.password,
    });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-slate-900">
          <h1 className="mb-6 text-3xl font-bold">
            Welcome Back
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border p-4 bg-transparent"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border p-4 bg-transparent"
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 py-4 font-semibold text-white hover:bg-amber-600"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-amber-500"
            >
              Forgot Password?
            </Link>

            <Link
              href="/register"
              className="text-amber-500"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}