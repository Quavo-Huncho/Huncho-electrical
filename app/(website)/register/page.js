"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Account created. Check your email to verify."
    );
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-3xl border p-8">
          <h1 className="mb-6 text-3xl font-bold">
            Create Account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border p-4"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border p-4"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border p-4"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border p-4"
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 py-4 text-white"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}