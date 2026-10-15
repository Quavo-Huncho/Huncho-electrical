"use client";

import { useState } from "react";
import { useMaterials } from "@/context/MaterialRequestContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RequestQuotePage() {
  const router = useRouter();

  const {
    items,
    removeItem,
    updateQuantity,
    clearItems,
  } = useMaterials();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    message: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (items.length === 0) {
      alert("Please select at least one material.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("material_requests")
        .insert({
          customer_name: form.customer_name,
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
          message: form.message,
          items,
        });

      if (error) throw error;

      await fetch(
        "/api/send-material-request",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            customer_name:
              form.customer_name,
            customer_email:
              form.customer_email,
            customer_phone:
              form.customer_phone,
            message: form.message,
            items,
          }),
        }
      );
      clearItems();

      alert(
        "Request submitted successfully."
      );

      router.push("/materials/success");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Request Quotation
        </h1>

        <p className="mt-3 text-slate-500">
          Submit your material request and
          our team will contact you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Request Items */}
        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Selected Materials
          </h2>

          {items.length === 0 ? (
            <p>No materials selected.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-b pb-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {item.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {item.category}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeItem(item.id)
                      }
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      className="h-8 w-8 rounded-lg border"
                    >
                      -
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      className="h-8 w-8 rounded-lg border"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border p-6 space-y-5"
        >
          <div>
            <label className="mb-2 block">
              Full Name
            </label>

            <input
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block">
              Email
            </label>

            <input
              type="email"
              name="customer_email"
              value={form.customer_email}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block">
              Phone Number
            </label>

            <input
              name="customer_phone"
              value={form.customer_phone}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block">
              Additional Notes
            </label>

            <textarea
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 py-3 font-medium text-white hover:bg-amber-600"
          >
            {loading
              ? "Submitting..."
              : "Submit Request"}
          </button>
        </form>
      </div>
    </section>
  );
}