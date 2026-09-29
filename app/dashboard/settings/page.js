"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  Link2,
  Sparkles,
  MessageSquareText,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  RotateCcw,
} from "lucide-react";

const DEFAULT_SETTINGS = {
  company_name: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  business_hours: "",
  facebook: "",
  x: "",
  instagram: "",
  linkedin: "",
  hero_title: "",
  hero_description: "",
  contact_title: "",
  contact_description: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500";

// ==========================================
// TOAST
// ==========================================

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur sm:inset-x-auto sm:right-6 sm:bottom-6"
      style={{
        borderColor: isError ? "#fecaca" : "#a7f3d0",
        backgroundColor: isError
          ? "rgba(254,242,242,0.97)"
          : "rgba(240,253,244,0.97)",
      }}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-rose-500" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-500" />
      )}

      <p
        className={`flex-1 text-sm font-medium ${
          isError ? "text-rose-800" : "text-emerald-800"
        }`}
      >
        {toast.message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className={`flex-none rounded-md p-1 transition hover:bg-black/5 ${
          isError ? "text-rose-500" : "text-emerald-600"
        }`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ==========================================
// FORM PRIMITIVES
// ==========================================

function SectionCard({ icon, title, description, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            {icon}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, icon, wide, ...props }) {
  return (
    <div className={wide ? "md:col-span-2" : undefined}>
      <label
        htmlFor={props.id}
        className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        {icon}
        {label}
      </label>
      <input id={props.id} className={inputClass} {...props} />
    </div>
  );
}

function TextareaField({ label, icon, maxLength, ...props }) {
  const length = (props.value || "").length;

  return (
    <div className="md:col-span-2">
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={props.id}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          {icon}
          {label}
        </label>

        {maxLength && (
          <span
            className={`text-xs ${
              length > maxLength ? "text-rose-500" : "text-slate-400"
            }`}
          >
            {length}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        id={props.id}
        rows={4}
        className={`${inputClass} resize-y leading-relaxed`}
        {...props}
      />
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function SettingsPage() {
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS);

  function notify(type, message) {
    setToast({ type, message });
  }

  function updateField(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  // ==========================================
  // LOAD SETTINGS
  // ==========================================

  async function loadSettings() {
    setPageLoading(true);

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) {
      console.error("Error loading settings:", error);
      notify("error", "Couldn't load settings. Please refresh.");
    } else if (data) {
      const merged = { ...DEFAULT_SETTINGS, ...data };
      setSettings(merged);
      setSavedSettings(merged);
    }

    setPageLoading(false);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings]
  );

  function discardChanges() {
    setSettings(savedSettings);
  }

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase
      .from("settings")
      .update({
        company_name: settings.company_name,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        address: settings.address,
        business_hours: settings.business_hours,
        facebook: settings.facebook,
        x: settings.x,
        instagram: settings.instagram,
        linkedin: settings.linkedin,
        hero_title: settings.hero_title,
        hero_description: settings.hero_description,
        contact_title: settings.contact_title,
        contact_description: settings.contact_description,
      })
      .eq("id", settings.id);

    setSaving(false);

    if (error) {
      notify("error", error.message);
      return;
    }

    setSavedSettings(settings);
    notify("success", "Settings updated successfully!");
  }

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (pageLoading) {
    return (
      <section className="w-full overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-10">
            <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full overflow-x-hidden px-4 py-8 pb-28 sm:px-6 sm:py-10 lg:py-14">
      <div className="mx-auto w-full max-w-5xl">
        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-amber-500">
              Admin dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Website settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
              Update your company details, contact info and site content.
            </p>
          </div>

          <div>
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Unsaved changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All changes saved
              </span>
            )}
          </div>
        </div>

        {/* ========================================
            FORM
        ======================================== */}

        <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
          <SectionCard
            icon={<Building2 className="h-5 w-5" />}
            title="Company details"
            description="How your business is identified across the site."
          >
            <Field
              id="company_name"
              label="Company name"
              icon={<Building2 className="h-3.5 w-3.5 text-slate-400" />}
              placeholder="e.g. Huncho Electrical Services"
              value={settings.company_name || ""}
              onChange={(e) => updateField("company_name", e.target.value)}
              wide
            />

            <Field
              id="address"
              label="Business address"
              icon={<MapPin className="h-3.5 w-3.5 text-slate-400" />}
              placeholder="e.g. 12 Aba Road, Port Harcourt"
              value={settings.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
            />

            <Field
              id="business_hours"
              label="Business hours"
              icon={<Clock className="h-3.5 w-3.5 text-slate-400" />}
              placeholder="e.g. Mon–Sat, 8am–6pm"
              value={settings.business_hours || ""}
              onChange={(e) => updateField("business_hours", e.target.value)}
            />
          </SectionCard>

          <SectionCard
            icon={<Phone className="h-5 w-5" />}
            title="Contact information"
            description="How customers reach you — shown across the site and in enquiry emails."
          >
            <Field
              id="phone"
              label="Phone number"
              icon={<Phone className="h-3.5 w-3.5 text-slate-400" />}
              type="tel"
              placeholder="e.g. +234 800 000 0000"
              value={settings.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
            />

            <Field
              id="whatsapp"
              label="WhatsApp number"
              icon={<MessageCircle className="h-3.5 w-3.5 text-slate-400" />}
              type="tel"
              placeholder="e.g. +234 800 000 0000"
              value={settings.whatsapp || ""}
              onChange={(e) => updateField("whatsapp", e.target.value)}
            />

            <Field
              id="email"
              label="Email address"
              icon={<Mail className="h-3.5 w-3.5 text-slate-400" />}
              type="email"
              placeholder="e.g. hello@company.com"
              value={settings.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              wide
            />
          </SectionCard>

          <SectionCard
            icon={<Link2 className="h-5 w-5" />}
            title="Social links"
            description="Leave a field blank to hide that icon on your site."
          >
            <Field
              id="facebook"
              label="Facebook URL"
              icon={<Link2 className="h-3.5 w-3.5 text-slate-400" />}
              type="url"
              placeholder="https://facebook.com/yourpage"
              value={settings.facebook || ""}
              onChange={(e) => updateField("facebook", e.target.value)}
            />

            <Field
              id="x"
              label="X (Twitter) URL"
              icon={<Link2 className="h-3.5 w-3.5 text-slate-400" />}
              type="url"
              placeholder="https://x.com/yourhandle"
              value={settings.x || ""}
              onChange={(e) => updateField("x", e.target.value)}
            />

            <Field
              id="instagram"
              label="Instagram URL"
              icon={<Link2 className="h-3.5 w-3.5 text-slate-400" />}
              type="url"
              placeholder="https://instagram.com/yourhandle"
              value={settings.instagram || ""}
              onChange={(e) => updateField("instagram", e.target.value)}
            />

            <Field
              id="linkedin"
              label="LinkedIn URL"
              icon={<Link2 className="h-3.5 w-3.5 text-slate-400" />}
              type="url"
              placeholder="https://linkedin.com/company/yourcompany"
              value={settings.linkedin || ""}
              onChange={(e) => updateField("linkedin", e.target.value)}
            />
          </SectionCard>

          <SectionCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Homepage hero"
            description="The headline and intro text visitors see first."
          >
            <Field
              id="hero_title"
              label="Hero title"
              icon={<Sparkles className="h-3.5 w-3.5 text-slate-400" />}
              placeholder="e.g. Reliable electrical work, done right"
              value={settings.hero_title || ""}
              onChange={(e) => updateField("hero_title", e.target.value)}
              wide
            />

            <TextareaField
              id="hero_description"
              label="Hero description"
              icon={<Sparkles className="h-3.5 w-3.5 text-slate-400" />}
              placeholder="A short line about what you do and who you serve."
              maxLength={220}
              value={settings.hero_description || ""}
              onChange={(e) => updateField("hero_description", e.target.value)}
            />
          </SectionCard>

          <SectionCard
            icon={<MessageSquareText className="h-5 w-5" />}
            title="Contact page content"
            description="The heading and intro text on your contact page."
          >
            <Field
              id="contact_title"
              label="Contact title"
              icon={<MessageSquareText className="h-3.5 w-3.5 text-slate-400" />}
              placeholder="e.g. Get a free quote"
              value={settings.contact_title || ""}
              onChange={(e) => updateField("contact_title", e.target.value)}
              wide
            />

            <TextareaField
              id="contact_description"
              label="Contact description"
              icon={<MessageSquareText className="h-3.5 w-3.5 text-slate-400" />}
              placeholder="A short line inviting visitors to reach out."
              maxLength={220}
              value={settings.contact_description || ""}
              onChange={(e) =>
                updateField("contact_description", e.target.value)
              }
            />
          </SectionCard>
        </form>
      </div>

      {/* ========================================
          STICKY SAVE BAR
      ======================================== */}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex w-full max-w-5xl flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          {isDirty && (
            <button
              type="button"
              onClick={discardChanges}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Discard changes
            </button>
          )}

          <button
            type="submit"
            form="settings-form"
            disabled={saving || !isDirty}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
}