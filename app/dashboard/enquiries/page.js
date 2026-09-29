"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Inbox,
  Search,
  X,
  Download,
  Phone,
  Mail,
  MessageCircle,
  Trash2,
  Hash,
  CalendarDays,
  Sparkles,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ==========================================
// STATUS CONFIG — single source of truth for
// colors/labels so badges, stats and the
// select all stay in sync.
// ==========================================

const STATUSES = [
  { value: "New", accent: "#0ea5e9", badge: "sky" },
  { value: "In Progress", accent: "#f59e0b", badge: "amber" },
  { value: "Completed", accent: "#10b981", badge: "emerald" },
];

const BADGE_CLASSES = {
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

function statusConfig(status) {
  return STATUSES.find((s) => s.value === status) || STATUSES[0];
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
// DELETE CONFIRM DIALOG
// ==========================================

function DeleteDialog({ enquiry, deleting, onCancel, onConfirm }) {
  if (!enquiry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <Trash2 className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Delete this enquiry?
        </h3>

        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          The enquiry from{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {enquiry.name || "this customer"}
          </span>{" "}
          will be permanently removed. This can&apos;t be undone.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {deleting ? "Deleting..." : "Delete enquiry"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({ label, value, icon, accent }) {
  return (
    <div
      className="min-w-[168px] flex-1 snap-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      style={{ borderLeftWidth: 4, borderLeftColor: accent }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  function notify(type, message) {
    setToast({ type, message });
  }

  // ==========================================
  // FETCH ENQUIRIES
  // ==========================================

  async function fetchEnquiries() {
    setLoading(true);

    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching enquiries:", error);
      setEnquiries([]);
      notify("error", "Couldn't load enquiries. Please refresh.");
    } else {
      setEnquiries(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // ==========================================
  // DELETE ENQUIRY
  // ==========================================

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    const { error } = await supabase
      .from("enquiries")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      notify("error", "Failed to delete enquiry: " + error.message);
    } else {
      notify("success", "Enquiry deleted.");
      await fetchEnquiries();
    }

    setDeleting(false);
    setDeleteTarget(null);
  }

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  async function updateStatus(enquiry, status) {
    const previousStatus = enquiry.status || "New";
    if (previousStatus === status) return;

    setUpdatingId(enquiry.id);

    const { error } = await supabase
      .from("enquiries")
      .update({ status })
      .eq("id", enquiry.id);

    if (error) {
      notify("error", "Failed to update status: " + error.message);
      setUpdatingId(null);
      return;
    }

    try {
      const response = await fetch("/api/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...enquiry, status }),
      });

      const result = await response.json();

      if (!result.success) {
        console.error("Status email failed:", result.error);
      }
    } catch (error) {
      console.error("Status email error:", error);
    }

    await fetchEnquiries();
    setUpdatingId(null);
  }

  // ==========================================
  // FILTER
  // ==========================================

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enquiries
      .filter((enquiry) => filter === "All" || (enquiry.status || "New") === filter)
      .filter((enquiry) => {
        if (!query) return true;

        return (
          enquiry.name?.toLowerCase().includes(query) ||
          enquiry.email?.toLowerCase().includes(query) ||
          enquiry.phone?.toLowerCase().includes(query) ||
          enquiry.service?.toLowerCase().includes(query) ||
          enquiry.quote_id?.toLowerCase().includes(query)
        );
      });
  }, [enquiries, search, filter]);

  // ==========================================
  // EXPORT TO CSV
  // ==========================================

  function escapeCSV(value) {
    if (value === null || value === undefined) return "";
    return `"${String(value).replace(/"/g, '""')}"`;
  }

  function exportToCSV() {
    if (filteredEnquiries.length === 0) {
      notify("error", "There are no enquiries to export.");
      return;
    }

    const headers = [
      "Quote ID",
      "Name",
      "Email",
      "Phone",
      "Service",
      "Status",
      "Message",
      "Submitted Date",
    ];

    const rows = filteredEnquiries.map((enquiry) => [
      enquiry.quote_id || "",
      enquiry.name || "",
      enquiry.email || "",
      enquiry.phone || "",
      enquiry.service || "",
      enquiry.status || "New",
      enquiry.message || "",
      enquiry.created_at ? new Date(enquiry.created_at).toLocaleString() : "",
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `huncho-enquiries-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    notify("success", `Exported ${filteredEnquiries.length} enquiries.`);
  }

  // ==========================================
  // STATISTICS
  // ==========================================

  const total = enquiries.length;
  const newCount = enquiries.filter((e) => !e.status || e.status === "New").length;
  const progressCount = enquiries.filter((e) => e.status === "In Progress").length;
  const completedCount = enquiries.filter((e) => e.status === "Completed").length;

  const hasActiveFilters = search || filter !== "All";

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <section className="w-full overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10">
            <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 min-w-[168px] flex-1 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>

          <div className="mt-8 space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
      <div className="mx-auto w-full max-w-7xl">
        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-amber-500">
              Admin dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Customer enquiries
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
              Manage customer messages, quote requests and enquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={exportToCSV}
            disabled={filteredEnquiries.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* ========================================
            STATISTICS
        ======================================== */}

        <div className="mb-10 -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 snap-x sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
          <StatCard
            label="Total enquiries"
            value={total}
            icon={<Inbox className="h-5 w-5" />}
            accent="#f59e0b"
          />
          <StatCard
            label="New"
            value={newCount}
            icon={<Sparkles className="h-5 w-5" />}
            accent={statusConfig("New").accent}
          />
          <StatCard
            label="In progress"
            value={progressCount}
            icon={<Clock3 className="h-5 w-5" />}
            accent={statusConfig("In Progress").accent}
          />
          <StatCard
            label="Completed"
            value={completedCount}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent={statusConfig("Completed").accent}
          />
        </div>

        {/* ========================================
            SEARCH + FILTER
        ======================================== */}

        <div className="sticky top-0 z-10 -mx-4 mb-6 bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/80 sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none dark:sm:bg-transparent">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <label htmlFor="enquiry-search" className="sr-only">
                  Search enquiries
                </label>

                <input
                  id="enquiry-search"
                  type="text"
                  placeholder="Search by quote ID, name, email, phone or service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              <div className="md:w-52">
                <label htmlFor="status-filter" className="sr-only">
                  Filter by status
                </label>

                <select
                  id="status-filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="All">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {filteredEnquiries.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {total}
                </span>{" "}
                enquiries
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                  className="text-sm font-semibold text-amber-500 transition hover:text-amber-600"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================
            ENQUIRIES
        ======================================== */}

        {filteredEnquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900 sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Inbox className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              No enquiries found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {hasActiveFilters
                ? "Try changing your search or status filter."
                : "Customer enquiries will appear here as they come in."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="mt-5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredEnquiries.map((enquiry) => {
              const status = enquiry.status || "New";
              const { accent, badge } = statusConfig(status);
              const isUpdating = updatingId === enquiry.id;

              const formattedDate = enquiry.created_at
                ? new Date(enquiry.created_at).toLocaleString()
                : "Unknown date";

              const whatsappNumber = enquiry.phone
                ? enquiry.phone.replace(/\D/g, "")
                : "";

              return (
                <article
                  key={enquiry.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  style={{ borderLeftWidth: 4, borderLeftColor: accent }}
                >
                  <div className="flex flex-col gap-6 p-5 sm:p-6 xl:flex-row xl:justify-between">
                    {/* CUSTOMER INFO */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {enquiry.name}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE_CLASSES[badge]}`}
                        >
                          {status}
                        </span>

                        {isUpdating && (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-amber-500">
                        <Hash className="h-3.5 w-3.5" />
                        {enquiry.quote_id || "N/A"}
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="flex items-center gap-2 break-all text-sm text-sky-600 hover:underline dark:text-sky-400"
                        >
                          <Mail className="h-3.5 w-3.5 flex-none" />
                          {enquiry.email}
                        </a>

                        {enquiry.phone && (
                          <a
                            href={`tel:${enquiry.phone}`}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:underline dark:text-slate-400"
                          >
                            <Phone className="h-3.5 w-3.5 flex-none" />
                            {enquiry.phone}
                          </a>
                        )}
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                        Service:{" "}
                        <span className="text-amber-600 dark:text-amber-400">
                          {enquiry.service}
                        </span>
                      </p>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Submitted {formattedDate}
                      </div>

                      {enquiry.message && (
                        <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {enquiry.message}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-3 sm:w-56 xl:w-52 xl:flex-none">
                      <label
                        htmlFor={`status-${enquiry.id}`}
                        className="text-xs font-semibold text-slate-500 dark:text-slate-400"
                      >
                        Update status
                      </label>

                      <select
                        id={`status-${enquiry.id}`}
                        value={status}
                        onChange={(e) => updateStatus(enquiry, e.target.value)}
                        disabled={isUpdating}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.value}
                          </option>
                        ))}
                      </select>

                      {enquiry.phone && (
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                          <Phone className="h-4 w-4" />
                          Call customer
                        </a>
                      )}

                      <a
                        href={`mailto:${enquiry.email}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                      >
                        <Mail className="h-4 w-4" />
                        Send email
                      </a>

                      {enquiry.phone && (
                        <a
                          href={`https://wa.me/${whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
                        >
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(enquiry)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500 dark:hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete enquiry
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <DeleteDialog
        enquiry={deleteTarget}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
}