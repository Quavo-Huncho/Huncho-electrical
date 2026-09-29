"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    projects: 0,
    enquiries: 0,
    newEnquiries: 0,
    inProgress: 0,
    completed: 0,
  });

  const [recentProjects, setRecentProjects] =
    useState([]);

  const [recentEnquiries, setRecentEnquiries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);

      const [
        { count: projects },
        { count: enquiries },
        { count: newEnquiries },
        { count: inProgress },
        { count: completed },
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("enquiries")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("enquiries")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("status", "New"),

        supabase
          .from("enquiries")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq(
            "status",
            "In Progress"
          ),

        supabase
          .from("enquiries")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq(
            "status",
            "Completed"
          ),
      ]);

      setStats({
        projects: projects || 0,
        enquiries: enquiries || 0,
        newEnquiries:
          newEnquiries || 0,
        inProgress:
          inProgress || 0,
        completed:
          completed || 0,
      });

      const { data: projectsData } =
        await supabase
          .from("projects")
          .select("*")
          .order("created_at", {
            ascending: false,
          })
          .limit(5);

      const { data: enquiriesData } =
        await supabase
          .from("enquiries")
          .select("*")
          .order("created_at", {
            ascending: false,
          })
          .limit(5);

      setRecentProjects(
        projectsData || []
      );

      setRecentEnquiries(
        enquiriesData || []
      );

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <section className="py-24 text-center">
        Loading Dashboard...
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">

        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Welcome back,
            {" "}
            {user?.email}
          </p>
        </div>

        {/* Stats */}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            title="Projects"
            value={stats.projects}
            color="text-amber-500"
          />

          <StatCard
            title="Enquiries"
            value={stats.enquiries}
            color="text-blue-500"
          />

          <StatCard
            title="New"
            value={stats.newEnquiries}
            color="text-green-500"
          />

          <StatCard
            title="In Progress"
            value={stats.inProgress}
            color="text-yellow-500"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            color="text-purple-500"
          />

        </div>

        {/* Quick Actions */}

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <ActionCard
            href="/dashboard/projects"
            title="Manage Projects"
            description="Add, edit and delete projects"
          />

          <ActionCard
            href="/dashboard/enquiries"
            title="Customer Enquiries"
            description="Manage quote requests"
          />

          <ActionCard
            href="/"
            title="View Website"
            description="Open live website"
          />

        </div>

        {/* Recent Sections */}

        <div className="mt-12 grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl border p-6">
            <h2 className="mb-6 text-2xl font-bold">
              Recent Projects
            </h2>

            <div className="space-y-4">
              {recentProjects.map(
                (project) => (
                  <div
                    key={project.id}
                    className="rounded-xl border p-4"
                  >
                    <h3 className="font-semibold">
                      {project.title}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {
                        project.category
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-3xl border p-6">
            <h2 className="mb-6 text-2xl font-bold">
              Recent Enquiries
            </h2>

            <div className="space-y-4">
              {recentEnquiries.map(
                (enquiry) => (
                  <div
                    key={enquiry.id}
                    className="rounded-xl border p-4"
                  >
                    <h3 className="font-semibold">
                      {enquiry.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {
                        enquiry.service
                      }
                    </p>

                    <p className="mt-2 line-clamp-2">
                      {
                        enquiry.message
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  color,
}) {
  return (
    <div className="rounded-3xl border p-6">
      <p className="text-slate-500">
        {title}
      </p>

      <h2
        className={`mt-3 text-5xl font-bold ${color}`}
      >
        {value}
      </h2>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border p-6 transition hover:border-amber-500"
    >
      <h3 className="font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </Link>
  );
}