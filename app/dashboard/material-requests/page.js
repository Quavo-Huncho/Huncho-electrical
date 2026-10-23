"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ClipboardList,
  Inbox,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  Mail,
  Phone,
  Package,
  CalendarDays,
  MessageSquareText,
  Loader2,
} from "lucide-react";

// ==========================================
// STATUS CONFIG
// ==========================================

const STATUSES = [
  { value: "pending", label: "Pending", accent: "#0ea5e9", badge: "sky" },
  { value: "contacted", label: "Contacted", accent: "#f59e0b", badge: "amber" },
  { value: "quoted", label: "Quoted", accent: "#8b5cf6", badge: "violet" },
  { value: "completed", label: "Completed", accent: "#10b981", badge: "emerald" },
];

const BADGE_CLASSES = {
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
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

function MaterialRequestsContent() {
  const searchParams = useSearchParams();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  // Pre-select filter from ?filter= query param (e.g. coming from dashboard)
  const [statusFilter, setStatusFilter] = useState(() => {
    const param = searchParams.get("filter");
    const valid = ["All", ...STATUSES.map((s) => s.value)];
    return valid.includes(param) ? param : "All";
  });

  const [toast, setToast] = useState(null);

  function notify(type, message) {
    setToast({ type, message });
  }

  // ==========================================
  // LOAD REQUESTS
  // ==========================================

  async function loadRequests() {
    setLoading(true);

    const { data, error } = await supabase
      .from("material_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading material requests:", error);
      setRequests([]);
      notify("error", "Couldn't load material requests. Please refresh.");
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  async function updateStatus(id, status) {
    setUpdatingId(id);

    const { error } = await supabase
      .from("material_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      notify("error", "Couldn't update status: " + error.message);
      setUpdatingId(null);
      return;
    }

    await loadRequests();
    setUpdatingId(null);
  }

  // ==========================================
  // FILTER
  // ==========================================

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests
      .filter(
        (request) =>
          statusFilter === "All" || (request.status || "pending") === statusFilter
      )
      .filter((request) => {
        if (!query) return true;
        return (
          request.customer_name?.toLowerCase().includes(query) ||
          request.customer_email?.toLowerCase().includes(query) ||
          request.customer_phone?.toLowerCase().includes(query)
        );
      });
  }, [requests, search, statusFilter]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const total = requests.length;
  const pendingCount = requests.filter(
    (r) => (r.status || "pending") === "pending"
  ).length;
  const inProgressCount = requests.filter((r) =>
    ["contacted", "quoted"].includes(r.status)
  ).length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  const hasActiveFilters = search || statusFilter !== "All";

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <section className="w-full overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10">
            <div className="h-9 w-72 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
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

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-amber-500">
            Admin dashboard
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Material requests
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
            Manage customer quotation requests for electrical materials.
          </p>
        </div>

        {/* ========================================
            STATISTICS
        ======================================== */}

        <div className="mb-10 -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 snap-x sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
          <StatCard
            label="Total requests"
            value={total}
            icon={<ClipboardList className="h-5 w-5" />}
            accent="#f59e0b"
          />
          <StatCard
            label="Pending"
            value={pendingCount}
            icon={<Inbox className="h-5 w-5" />}
            accent={statusConfig("pending").accent}
          />
          <StatCard
            label="In progress"
            value={inProgressCount}
            icon={<Clock3 className="h-5 w-5" />}
            accent={statusConfig("contacted").accent}
          />
          <StatCard
            label="Completed"
            value={completedCount}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent={statusConfig("completed").accent}
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

                <label htmlFor="request-search" className="sr-only">
                  Search requests
                </label>

                <input
                  id="request-search"
                  type="text"
                  placeholder="Search by customer name, email or phone..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="All">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {filteredRequests.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {total}
                </span>{" "}
                requests
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
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
            REQUESTS
        ======================================== */}

        {filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900 sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <ClipboardList className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              No requests found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {hasActiveFilters
                ? "Try changing your search or status filter."
                : "Customer material requests will appear here as they come in."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredRequests.map((request) => {
              const status = request.status || "pending";
              const { accent, badge, label } = statusConfig(status);
              const isUpdating = updatingId === request.id;

              const formattedDate = request.created_at
                ? new Date(request.created_at).toLocaleString()
                : "Unknown date";

              return (
                <article
                  key={request.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  style={{ borderLeftWidth: 4, borderLeftColor: accent }}
                >
                  <div className="p-5 sm:p-6">
                    {/* Header row */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {request.customer_name || "Unnamed customer"}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE_CLASSES[badge]}`}
                          >
                            {label}
                          </span>

                          {isUpdating && (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                          )}
                        </div>

                        <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                          {request.customer_email && (
                            <a
                              href={`mailto:${request.customer_email}`}
                              className="flex items-center gap-1.5 text-sm text-sky-600 hover:underline dark:text-sky-400"
                            >
                              <Mail className="h-3.5 w-3.5 flex-none" />
                              {request.customer_email}
                            </a>
                          )}

                          {request.customer_phone && (
                            <a
                              href={`tel:${request.customer_phone}`}
                              className="flex items-center gap-1.5 text-sm text-slate-600 hover:underline dark:text-slate-400"
                            >
                              <Phone className="h-3.5 w-3.5 flex-none" />
                              {request.customer_phone}
                            </a>
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Requested {formattedDate}
                        </div>
                      </div>

                      {/* Status selector */}
                      <div className="sm:w-48 sm:flex-none">
                        <label
                          htmlFor={`status-${request.id}`}
                          className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400"
                        >
                          Update status
                        </label>

                        <select
                          id={`status-${request.id}`}
                          value={status}
                          onChange={(e) => updateStatus(request.id, e.target.value)}
                          disabled={isUpdating}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                          {STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Requested materials */}
                    <div className="mt-5">
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <Package className="h-3.5 w-3.5" />
                        Requested materials
                      </h3>

                      {request.items?.length > 0 ? (
                        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                          {request.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-sm dark:bg-slate-800/60"
                            >
                              <span className="truncate text-slate-700 dark:text-slate-300">
                                {item.name}
                              </span>
                              <span className="flex-none font-semibold text-slate-500 dark:text-slate-400">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-slate-400">
                          No items listed.
                        </p>
                      )}
                    </div>

                    {/* Customer notes */}
                    {request.message && (
                      <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                        <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <MessageSquareText className="h-3.5 w-3.5" />
                          Customer notes
                        </h4>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {request.message}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
}

export default function MaterialRequestsPage() {
  return (
    <Suspense
      fallback={
        <section className="w-full px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-8 h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </section>
      }
    >
      <MaterialRequestsContent />
    </Suspense>
  );
}