"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  FolderKanban,
  Package,
  Inbox,
  ClipboardList,
  Globe,
  ArrowRight,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

// ==========================================
// ROUTES — change a path here if a folder is named differently
// ==========================================

const ROUTES = {
  projects: "/dashboard/project",
  enquiries: "/dashboard/enquiries",
  materials: "/dashboard/materials",
  materialRequests: "/dashboard/material-requests",
  website: "/",
};

// ==========================================
// HELPERS
// ==========================================

async function countRows(table, applyFilter) {
  let query = supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (applyFilter) query = applyFilter(query);

  const { count, error } = await query;
  if (error) throw error;

  return count || 0;
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "";
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") return null;
  return `₦${Number(price).toLocaleString()}`;
}

const REQUEST_BADGES = {
  pending: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  contacted:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  quoted:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

const ENQUIRY_BADGES = {
  New: REQUEST_BADGES.pending,
  "In Progress": REQUEST_BADGES.contacted,
  Completed: REQUEST_BADGES.completed,
};

function Badge({ className, children }) {
  return (
    <span
      className={`flex-none rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${className}`}
    >
      {children}
    </span>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({ label, value, hint, icon, accent, href }) {
  return (
    <Link
      href={href}
      className="group min-w-[200px] flex-1 snap-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
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
          {hint && (
            <p className="mt-1 text-xs text-slate-400">{hint}</p>
          )}
        </div>

        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          {icon}
        </div>
      </div>
    </Link>
  );
}

// ==========================================
// STATUS BREAKDOWN (segmented bar)
// ==========================================

function StatusBreakdown({ title, href, segments }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {total > 0 &&
          segments.map((s) =>
            s.value > 0 ? (
              <div
                key={s.label}
                style={{
                  width: `${(s.value / total) * 100}%`,
                  backgroundColor: s.color,
                }}
              />
            ) : null
          )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {segments.map((s) => (
          <div key={s.label}>
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 flex-none rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {s.label}
              </span>
            </div>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// ACTION CARD
// ==========================================

function ActionCard({ href, title, description, icon }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-500/10 dark:text-amber-400">
        {icon}
      </span>

      <div className="min-w-0">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </Link>
  );
}

// ==========================================
// RECENT LIST CARD
// ==========================================

function RecentCard({ title, href, isEmpty, emptyText, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isEmpty ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-400 dark:border-slate-700">
          {emptyText}
        </p>
      ) : (
        <ul className="space-y-3">{children}</ul>
      )}
    </div>
  );
}

function RecentRow({ title, subtitle, meta, badge }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3.5 dark:border-slate-800">
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
        {meta && <p className="mt-0.5 text-xs text-slate-400">{meta}</p>}
      </div>

      {badge}
    </li>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    projects: 0,
    materials: 0,
    outOfStock: 0,
    enquiries: 0,
    newEnquiries: 0,
    inProgress: 0,
    completed: 0,
    requests: 0,
    requestsPending: 0,
    requestsInProgress: 0,
    requestsCompleted: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    let redirected = false;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirected = true;
        router.replace("/login");
        return;
      }

      setUser(user);

      const [
        projects,
        materials,
        outOfStock,
        enquiries,
        newEnquiries,
        inProgress,
        completed,
        requests,
        requestsPending,
        requestsInProgress,
        requestsCompleted,
      ] = await Promise.all([
        countRows("projects"),
        countRows("materials"),
        countRows("materials", (q) => q.eq("in_stock", false)),
        countRows("enquiries"),
        countRows("enquiries", (q) => q.eq("status", "New")),
        countRows("enquiries", (q) => q.eq("status", "In Progress")),
        countRows("enquiries", (q) => q.eq("status", "Completed")),
        countRows("material_requests"),
        countRows("material_requests", (q) => q.eq("status", "pending")),
        countRows("material_requests", (q) =>
          q.in("status", ["contacted", "quoted"])
        ),
        countRows("material_requests", (q) => q.eq("status", "completed")),
      ]);

      setStats({
        projects,
        materials,
        outOfStock,
        enquiries,
        newEnquiries,
        inProgress,
        completed,
        requests,
        requestsPending,
        requestsInProgress,
        requestsCompleted,
      });

      const recent = (table) =>
        supabase
          .from(table)
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

      const [projectsRes, enquiriesRes, materialsRes, requestsRes] =
        await Promise.all([
          recent("projects"),
          recent("enquiries"),
          recent("materials"),
          recent("material_requests"),
        ]);

      const firstError =
        projectsRes.error ||
        enquiriesRes.error ||
        materialsRes.error ||
        requestsRes.error;

      if (firstError) throw firstError;

      setRecentProjects(projectsRes.data || []);
      setRecentEnquiries(enquiriesRes.data || []);
      setRecentMaterials(materialsRes.data || []);
      setRecentRequests(requestsRes.data || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(err?.message || "Couldn't load dashboard data.");
    } finally {
      if (!redirected) setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <section className="w-full overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10">
            <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-5 w-72 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 min-w-[200px] flex-1 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
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
            Overview
          </h1>

          <p className="mt-2 break-all text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Welcome back, {user?.email}
          </p>
        </div>

        {error && (
          <div className="mb-8 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-300 px-3 py-1.5 font-semibold transition hover:bg-rose-100 dark:border-rose-500/30 dark:hover:bg-rose-500/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* ========================================
            STATISTICS
        ======================================== */}

        <div className="mb-8 -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 snap-x sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
          <StatCard
            label="Projects"
            value={stats.projects}
            icon={<FolderKanban className="h-5 w-5" />}
            accent="#f59e0b"
            href={ROUTES.projects}
          />
          <StatCard
            label="Materials"
            value={stats.materials}
            hint={
              stats.outOfStock > 0
                ? `${stats.outOfStock} out of stock`
                : "All in stock"
            }
            icon={<Package className="h-5 w-5" />}
            accent="#3b82f6"
            href={ROUTES.materials}
          />
          <StatCard
            label="Enquiries"
            value={stats.enquiries}
            hint={`${stats.newEnquiries} new`}
            icon={<Inbox className="h-5 w-5" />}
            accent="#0ea5e9"
            href={ROUTES.enquiries}
          />
          <StatCard
            label="Material requests"
            value={stats.requests}
            hint={`${stats.requestsPending} pending`}
            icon={<ClipboardList className="h-5 w-5" />}
            accent="#8b5cf6"
            href={ROUTES.materialRequests}
          />
        </div>

        {/* ========================================
            PIPELINES
        ======================================== */}

        <div className="mb-10 grid gap-6 md:grid-cols-2">
          <StatusBreakdown
            title="Enquiries pipeline"
            href={ROUTES.enquiries}
            segments={[
              { label: "New", value: stats.newEnquiries, color: "#0ea5e9" },
              { label: "In progress", value: stats.inProgress, color: "#f59e0b" },
              { label: "Completed", value: stats.completed, color: "#10b981" },
            ]}
          />

          <StatusBreakdown
            title="Material requests pipeline"
            href={ROUTES.materialRequests}
            segments={[
              { label: "Pending", value: stats.requestsPending, color: "#0ea5e9" },
              {
                label: "In progress",
                value: stats.requestsInProgress,
                color: "#f59e0b",
              },
              {
                label: "Completed",
                value: stats.requestsCompleted,
                color: "#10b981",
              },
            ]}
          />
        </div>

        {/* ========================================
            QUICK ACTIONS
        ======================================== */}

        <div className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            Quick actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <ActionCard
              href={ROUTES.projects}
              title="Manage projects"
              description="Add, edit and delete"
              icon={<FolderKanban className="h-5 w-5" />}
            />
            <ActionCard
              href={ROUTES.materials}
              title="Materials"
              description="Stock, pricing, featured"
              icon={<Package className="h-5 w-5" />}
            />
            <ActionCard
              href={ROUTES.enquiries}
              title="Enquiries"
              description="Manage quote requests"
              icon={<Inbox className="h-5 w-5" />}
            />
            <ActionCard
              href={ROUTES.materialRequests}
              title="Material requests"
              description="Customer quotations"
              icon={<ClipboardList className="h-5 w-5" />}
            />
            <ActionCard
              href={ROUTES.website}
              title="View website"
              description="Open the live site"
              icon={<Globe className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* ========================================
            RECENT ACTIVITY
        ======================================== */}

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentCard
            title="Recent projects"
            href={ROUTES.projects}
            isEmpty={recentProjects.length === 0}
            emptyText="No projects yet."
          >
            {recentProjects.map((project) => (
              <RecentRow
                key={project.id}
                title={project.title}
                subtitle={project.category}
                meta={formatDate(project.created_at)}
              />
            ))}
          </RecentCard>

          <RecentCard
            title="Recent enquiries"
            href={ROUTES.enquiries}
            isEmpty={recentEnquiries.length === 0}
            emptyText="No enquiries yet."
          >
            {recentEnquiries.map((enquiry) => {
              const status = enquiry.status || "New";

              return (
                <RecentRow
                  key={enquiry.id}
                  title={enquiry.name}
                  subtitle={enquiry.service}
                  meta={formatDate(enquiry.created_at)}
                  badge={
                    <Badge className={ENQUIRY_BADGES[status] || ENQUIRY_BADGES.New}>
                      {status}
                    </Badge>
                  }
                />
              );
            })}
          </RecentCard>

          <RecentCard
            title="Recent materials"
            href={ROUTES.materials}
            isEmpty={recentMaterials.length === 0}
            emptyText="No materials yet."
          >
            {recentMaterials.map((material) => (
              <RecentRow
                key={material.id}
                title={material.name}
                subtitle={[material.category, formatPrice(material.price)]
                  .filter(Boolean)
                  .join(" · ")}
                meta={formatDate(material.created_at)}
                badge={
                  <Badge
                    className={
                      material.in_stock
                        ? REQUEST_BADGES.completed
                        : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                    }
                  >
                    {material.in_stock ? "In stock" : "Out of stock"}
                  </Badge>
                }
              />
            ))}
          </RecentCard>

          <RecentCard
            title="Recent material requests"
            href={ROUTES.materialRequests}
            isEmpty={recentRequests.length === 0}
            emptyText="No material requests yet."
          >
            {recentRequests.map((request) => {
              const status = request.status || "pending";
              const itemCount = request.items?.length || 0;

              return (
                <RecentRow
                  key={request.id}
                  title={request.customer_name || "Unnamed customer"}
                  subtitle={`${itemCount} ${
                    itemCount === 1 ? "item" : "items"
                  } requested`}
                  meta={formatDate(request.created_at)}
                  badge={
                    <Badge className={REQUEST_BADGES[status] || REQUEST_BADGES.pending}>
                      {status}
                    </Badge>
                  }
                />
              );
            })}
          </RecentCard>
        </div>
      </div>
    </section>
  );
}