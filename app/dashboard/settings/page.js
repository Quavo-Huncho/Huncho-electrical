"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  Trash2,
  Pencil,
  UploadCloud,
  Undo2,
  Image as ImageIcon,
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
  hero_bg_url: "",
  login_bg_url: "",
  contact_title: "",
  contact_description: "",
};

const IMAGE_FIELDS = ["hero_bg_url", "login_bg_url"];

const EMPTY_PENDING = { hero_bg_url: null, login_bg_url: null };
const EMPTY_REMOVED = { hero_bg_url: false, login_bg_url: false };

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500";

// ==========================================
// IMAGE STORAGE HELPERS
// ==========================================

const BUCKET = "settings-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function validateImage(file) {
  if (!ALLOWED_TYPES[file.type]) {
    return "Please upload a JPG, PNG, or WebP image.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image size must not exceed 5 MB.";
  }

  return "";
}

// crypto.randomUUID only exists on https / localhost, so keep a fallback
function uniqueId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Turns a public storage URL back into the file path inside the bucket
function storagePathFromUrl(url) {
  if (!url) return null;

  const marker = `/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);

  if (index === -1) return null;

  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

async function removeStoredImage(url) {
  const path = storagePathFromUrl(url);

  if (!path) return;

  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    console.warn("Couldn't delete image from storage:", error.message);
  }
}

async function uploadSettingsImage(file) {
  const problem = validateImage(file);

  if (problem) throw new Error(problem);

  const path = `settings/${uniqueId()}.${ALLOWED_TYPES[file.type]}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data: publicData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  if (!publicData?.publicUrl) {
    await supabase.storage.from(BUCKET).remove([data.path]);
    throw new Error("The image uploaded, but its public URL could not be created.");
  }

  return publicData.publicUrl;
}

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
      className="fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-md items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur sm:inset-x-auto sm:right-6"
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
// IMAGE UPLOAD FIELD
//
// Fully controlled by the parent. It only picks a file, shows a local
// preview, and reports what the user did. Nothing is uploaded or deleted
// here; that all happens when "Save settings" is clicked.
// ==========================================

function ImageUploadField({
  label,
  description,
  savedUrl,
  pendingFile,
  markedForRemoval,
  onSelect,
  onRemove,
  onUndo,
  disabled,
}) {
  const inputRef = useRef(null);

  const [error, setError] = useState("");
  const [failedUrl, setFailedUrl] = useState("");
  const [dragging, setDragging] = useState(false);

  // Instant local preview of the staged file
  const pendingPreview = useMemo(
    () => (pendingFile ? URL.createObjectURL(pendingFile) : ""),
    [pendingFile]
  );

  useEffect(() => {
    return () => {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
  }, [pendingPreview]);

  const previewSrc = pendingPreview || (markedForRemoval ? "" : savedUrl);
  const loadFailed = Boolean(previewSrc) && failedUrl === previewSrc;

  function processFile(file) {
    if (!file || disabled) return;

    const problem = validateImage(file);

    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    onSelect(file);
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0];

    // Reset right away so choosing the same file again still fires onChange
    e.target.value = "";

    processFile(file);
  }

  function openPicker() {
    if (!disabled) inputRef.current?.click();
  }

  const secondaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-amber-500 dark:hover:text-amber-400";

  return (
    <div className="md:col-span-2">
      <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </p>

      {description && (
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
        tabIndex={-1}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Preview */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            processFile(e.dataTransfer.files?.[0]);
          }}
          className={`relative h-40 w-full overflow-hidden rounded-xl border-2 border-dashed transition sm:w-72 sm:flex-none ${
            dragging
              ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10"
              : "border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
          }`}
        >
          {previewSrc && !loadFailed ? (
            <img
              key={previewSrc}
              src={previewSrc}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
              onError={() => setFailedUrl(previewSrc)}
            />
          ) : loadFailed ? (
            <div className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center text-rose-500">
              <AlertCircle className="h-7 w-7" />
              <span className="text-xs">
                This image couldn&apos;t be loaded. Check that the bucket is
                public.
              </span>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-slate-400">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs">
                {markedForRemoval ? "Image will be deleted" : "No image set"}
              </span>
              <span className="text-[11px]">Drop an image here</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {previewSrc ? (
              <>
                <button
                  type="button"
                  onClick={openPicker}
                  disabled={disabled}
                  className={secondaryButton}
                >
                  <Pencil className="h-4 w-4" />
                  Replace
                </button>

                {pendingFile ? (
                  <button
                    type="button"
                    onClick={onUndo}
                    disabled={disabled}
                    className={secondaryButton}
                  >
                    <Undo2 className="h-4 w-4" />
                    Cancel new image
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onRemove}
                    disabled={disabled}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500 dark:hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={openPicker}
                  disabled={disabled}
                  className={secondaryButton}
                >
                  <UploadCloud className="h-4 w-4" />
                  Upload image
                </button>

                {markedForRemoval && (
                  <button
                    type="button"
                    onClick={onUndo}
                    disabled={disabled}
                    className={secondaryButton}
                  >
                    <Undo2 className="h-4 w-4" />
                    Undo delete
                  </button>
                )}
              </>
            )}
          </div>

          {error && (
            <p className="flex items-start gap-1.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-none" />
              {error}
            </p>
          )}

          {pendingFile && (
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              New image selected: click “Save settings” to apply it.
            </p>
          )}

          {markedForRemoval && !pendingFile && (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
              This image will be deleted when you click “Save settings”.
            </p>
          )}

          {savedUrl && !pendingFile && !markedForRemoval && (
            <p className="break-all text-xs text-slate-400">
              Current:{" "}
              <span className="text-slate-600 dark:text-slate-300">
                {savedUrl.split("/").pop()}
              </span>
            </p>
          )}

          <p className="text-xs text-slate-400">
            JPG, PNG or WebP, at least 1920×1080px. Max 5 MB.
          </p>
        </div>
      </div>
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

  // Staged image changes (applied only when "Save settings" is clicked)
  const [pendingImages, setPendingImages] = useState(EMPTY_PENDING);
  const [removedImages, setRemovedImages] = useState(EMPTY_REMOVED);

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

  const hasImageChanges = IMAGE_FIELDS.some(
    (field) => pendingImages[field] || removedImages[field]
  );

  const isDirty = useMemo(
    () =>
      JSON.stringify(settings) !== JSON.stringify(savedSettings) ||
      hasImageChanges,
    [settings, savedSettings, hasImageChanges]
  );

  function discardChanges() {
    setSettings(savedSettings);
    setPendingImages(EMPTY_PENDING);
    setRemovedImages(EMPTY_REMOVED);
  }

  // ==========================================
  // IMAGE STAGING (nothing is uploaded here)
  // ==========================================

  function selectImage(field, file) {
    setPendingImages((prev) => ({ ...prev, [field]: file }));
    setRemovedImages((prev) => ({ ...prev, [field]: false }));
  }

  function markImageRemoved(field) {
    setPendingImages((prev) => ({ ...prev, [field]: null }));
    setRemovedImages((prev) => ({ ...prev, [field]: true }));
  }

  function undoImageChange(field) {
    setPendingImages((prev) => ({ ...prev, [field]: null }));
    setRemovedImages((prev) => ({ ...prev, [field]: false }));
  }

  // ==========================================
  // SAVE HELPER
  //
  // Supabase returns no error when RLS blocks an update, it just updates
  // zero rows. Asking for the rows back lets us catch that case.
  // ==========================================

  async function updateSettings(values) {
    if (!settings.id) {
      throw new Error("Settings row not found.");
    }

    const { data, error } = await supabase
      .from("settings")
      .update(values)
      .eq("id", settings.id)
      .select("id");

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error(
        "Nothing was saved. Check that your account has permission to edit settings."
      );
    }
  }

  // ==========================================
  // SAVE SETTINGS (text fields + staged images)
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isDirty) return;

    setSaving(true);

    const uploadedUrls = {}; // field -> newly uploaded url

    try {
      // 1. Upload any newly chosen images
      for (const field of IMAGE_FIELDS) {
        const file = pendingImages[field];
        if (file) {
          uploadedUrls[field] = await uploadSettingsImage(file);
        }
      }

      // 2. Work out the final value for each image column
      const imageValues = {};
      for (const field of IMAGE_FIELDS) {
        if (uploadedUrls[field]) {
          imageValues[field] = uploadedUrls[field];
        } else if (removedImages[field]) {
          imageValues[field] = "";
        }
      }

      // 3. Save everything to the database in one update
      try {
        await updateSettings({
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
          ...imageValues,
        });
      } catch (err) {
        // DB save failed, so remove the files we just uploaded
        await Promise.all(Object.values(uploadedUrls).map(removeStoredImage));
        throw err;
      }

      // 4. Only now delete the old files from storage
      for (const field of Object.keys(imageValues)) {
        const oldUrl = savedSettings[field];
        if (oldUrl && oldUrl !== imageValues[field]) {
          await removeStoredImage(oldUrl);
        }
      }

      const next = { ...settings, ...imageValues };
      setSettings(next);
      setSavedSettings(next);
      setPendingImages(EMPTY_PENDING);
      setRemovedImages(EMPTY_REMOVED);

      notify("success", "Settings updated successfully!");
    } catch (err) {
      console.error("Save settings failed:", err);

      // If we uploaded files but something failed before the DB step,
      // make sure they don't get orphaned.
      notify("error", err?.message || "Couldn't save settings.");
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (pageLoading) {
    return (
      <section className="w-full overflow-x-clip px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
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
    <section className="w-full overflow-x-clip px-4 pt-8 sm:px-6 sm:pt-10 lg:pt-14">
      <div className="mx-auto w-full max-w-5xl pb-8">
        {/* HEADER */}
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

        {/* FORM */}
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

          {/* Background images */}
          <SectionCard
            icon={<ImageIcon className="h-5 w-5" />}
            title="Background images"
            description="Choose, replace or delete images, then click Save settings."
          >
            <ImageUploadField
              label="Hero section background"
              description="Shown behind the headline on the homepage."
              savedUrl={settings.hero_bg_url || ""}
              pendingFile={pendingImages.hero_bg_url}
              markedForRemoval={removedImages.hero_bg_url}
              disabled={saving}
              onSelect={(file) => selectImage("hero_bg_url", file)}
              onRemove={() => markImageRemoved("hero_bg_url")}
              onUndo={() => undoImageChange("hero_bg_url")}
            />

            <ImageUploadField
              label="Login & register page background"
              description="Shown behind the login and register card."
              savedUrl={settings.login_bg_url || ""}
              pendingFile={pendingImages.login_bg_url}
              markedForRemoval={removedImages.login_bg_url}
              disabled={saving}
              onSelect={(file) => selectImage("login_bg_url", file)}
              onRemove={() => markImageRemoved("login_bg_url")}
              onUndo={() => undoImageChange("login_bg_url")}
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

      {/* SAVE BAR */}
      <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/90 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-slate-800 dark:bg-slate-950/90 sm:-mx-6 sm:px-6">
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