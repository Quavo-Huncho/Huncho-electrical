"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully");

    router.push("/login");
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-3xl border p-8">
          <h1 className="mb-6 text-3xl font-bold">
            Update Password
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="password"
              placeholder="New Password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-xl border p-4"
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 py-4 text-white"
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}