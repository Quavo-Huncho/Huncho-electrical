"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          `${window.location.origin}/update-password`,
      }
    );

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset email sent.");
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-3xl border p-8">
          <h1 className="mb-6 text-3xl font-bold">
            Forgot Password
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border p-4"
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 py-4 text-white"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}