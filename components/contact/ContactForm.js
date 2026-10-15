"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
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

    const quoteId = `HE-${new Date().getFullYear()}-${Date.now()
      .toString()
      .slice(-6)}`;

    const { error } = await supabase
      .from("enquiries")
      .insert([
        {
          quote_id: quoteId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
        },
      ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await fetch("/api/send-enquiry", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ ...formData, quote_id: quoteId }),
    });

    alert("Message submitted successfully!");

    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-amber-400 dark:focus:ring-amber-400/30";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-900"
    >
      <h2 className="text-3xl font-bold">Request a Quote</h2>

      <div className="mt-8 space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClass}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputClass}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className={inputClass}
        />

        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select Service</option>
          <option value="Electrical Installation">
            Electrical Installation
          </option>
          <option value="Electrical Maintenance">
            Electrical Maintenance
          </option>
          <option value="Solar Installation">Solar Installation</option>
          <option value="Material Supply">Material Supply</option>
          <option value="Consultancy">Consultancy</option>
        </select>

        <textarea
          rows="5"
          name="message"
          placeholder="Tell us about your project"
          value={formData.message}
          onChange={handleChange}
          required
          className={`${inputClass} resize-none`}
        />

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-4 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </div>
    </form>
  );
}
