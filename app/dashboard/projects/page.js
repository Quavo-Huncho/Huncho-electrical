"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadProjectImage, deleteProjectImage } from "@/lib/storage";
import {
  FolderKanban,
  Tags,
  ImagePlus,
  ImageOff,
  Pencil,
  Trash2,
  Plus,
  X,
  Search,
  MapPin,
  CalendarDays,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
      className="
        fixed inset-x-4 bottom-4 z-50
        mx-auto flex max-w-md items-start gap-3
        rounded-xl border p-4 shadow-lg backdrop-blur
        sm:inset-x-auto sm:right-6 sm:bottom-6
        animate-in
      "
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

function DeleteDialog({ project, deleting, onCancel, onConfirm }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <Trash2 className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Delete this project?
        </h3>

        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {project.title}
          </span>{" "}
          and its image will be permanently removed. This can&apos;t be undone.
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
            {deleting ? "Deleting..." : "Delete project"}
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

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
  });

  const fileInputRef = useRef(null);
  const formTopRef = useRef(null);

  function notify(type, message) {
    setToast({ type, message });
  }

  // ==========================================
  // FETCH PROJECTS
  // ==========================================

  async function fetchProjects() {
    setLoading(true);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
      notify("error", "Couldn't load projects. Please refresh.");
    } else {
      setProjects(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==========================================
  // FORM HELPERS
  // ==========================================

  function resetForm() {
    setFormData({ title: "", category: "", location: "", description: "" });
    setImage(null);
    setPreview("");
    setEditingProject(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function processImageFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("error", "Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify("error", "Please choose an image smaller than 5MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleImageChange(e) {
    processImageFile(e.target.files?.[0]);
    e.target.value = "";
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    processImageFile(e.dataTransfer.files?.[0]);
  }

  // ==========================================
  // ADD / UPDATE PROJECT
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim()) {
      notify("error", "Please enter a project title.");
      return;
    }
    if (!formData.category.trim()) {
      notify("error", "Please enter a project category.");
      return;
    }
    if (!formData.location.trim()) {
      notify("error", "Please enter the project location.");
      return;
    }
    if (!formData.description.trim()) {
      notify("error", "Please enter a project description.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = editingProject?.image_url || "";

      if (image) {
        const newImageUrl = await uploadProjectImage(image);

        if (editingProject?.image_url) {
          await deleteProjectImage(editingProject.image_url);
        }

        imageUrl = newImageUrl;
      }

      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update({
            title: formData.title.trim(),
            category: formData.category.trim(),
            location: formData.location.trim(),
            description: formData.description.trim(),
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProject.id);

        if (error) throw error;

        notify("success", "Project updated.");
      } else {
        const { error } = await supabase.from("projects").insert([
          {
            title: formData.title.trim(),
            category: formData.category.trim(),
            location: formData.location.trim(),
            description: formData.description.trim(),
            image_url: imageUrl,
          },
        ]);

        if (error) throw error;

        notify("success", "Project added.");
      }

      resetForm();
      await fetchProjects();
    } catch (error) {
      console.error("Project save error:", error);
      notify(
        "error",
        error?.message || "Something went wrong while saving the project."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // EDIT PROJECT
  // ==========================================

  function editProject(project) {
    setEditingProject(project);

    setFormData({
      title: project.title || "",
      category: project.category || "",
      location: project.location || "",
      description: project.description || "",
    });

    setImage(null);
    setPreview(project.image_url || "");

    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      if (deleteTarget.image_url) {
        await deleteProjectImage(deleteTarget.image_url);
      }

      if (editingProject?.id === deleteTarget.id) {
        resetForm();
      }

      await fetchProjects();
      notify("success", "Project deleted.");
    } catch (error) {
      console.error("Delete project error:", error);
      notify("error", error?.message || "Failed to delete project.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {
    const uniqueCategories = projects
      .map((project) => project.category?.trim())
      .filter(Boolean);

    return ["All", ...new Set(uniqueCategories)];
  }, [projects]);

  // ==========================================
  // FILTER PROJECTS
  // ==========================================

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects
      .filter((project) => filter === "All" || project.category === filter)
      .filter((project) => {
        if (!query) return true;

        return (
          project.title?.toLowerCase().includes(query) ||
          project.category?.toLowerCase().includes(query) ||
          project.location?.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query)
        );
      });
  }, [projects, search, filter]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalProjects = projects.length;

  const totalCategories = new Set(
    projects.map((project) => project.category).filter(Boolean)
  ).size;

  const projectsWithImages = projects.filter((p) => p.image_url).length;
  const projectsWithoutImages = totalProjects - projectsWithImages;

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <section className="w-full overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10">
            <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
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

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const hasActiveFilters = search || filter !== "All";

  return (
    <section className="w-full overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
      <div className="mx-auto w-full max-w-7xl" ref={formTopRef}>
        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-amber-500">
              Admin dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Manage projects
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
              Add, update and manage the electrical projects displayed on
              your website.
            </p>
          </div>

          {editingProject && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
              Cancel editing
            </button>
          )}
        </div>

        {/* ========================================
            STATISTICS — horizontal scroll on mobile, grid on desktop
        ======================================== */}

        <div className="mb-10 -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 snap-x sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
          <StatCard
            label="Total projects"
            value={totalProjects}
            icon={<FolderKanban className="h-5 w-5" />}
            accent="#f59e0b"
          />
          <StatCard
            label="Categories"
            value={totalCategories}
            icon={<Tags className="h-5 w-5" />}
            accent="#3b82f6"
          />
          <StatCard
            label="With images"
            value={projectsWithImages}
            icon={<ImagePlus className="h-5 w-5" />}
            accent="#10b981"
          />
          <StatCard
            label="Without images"
            value={projectsWithoutImages}
            icon={<ImageOff className="h-5 w-5" />}
            accent="#a855f7"
          />
        </div>

        {/* ========================================
            ADD / EDIT FORM
        ======================================== */}

        <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                {editingProject ? (
                  <Pencil className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingProject ? "Edit project" : "Add new project"}
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {editingProject
                    ? "Update the project information below."
                    : "Add a new completed project to your website."}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Project title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Residential electrical installation"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="e.g. Electrical installation"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Port Harcourt, Rivers State"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Project description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Describe the electrical work completed on this project..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Image dropzone */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Project image
                </span>

                {preview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview("");
                    }}
                    className="text-xs font-medium text-rose-500 hover:text-rose-600"
                  >
                    Remove image
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                id="project-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />

              {preview ? (
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-950">
                  <Image
                    src={preview}
                    alt="Project preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/70"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="project-image"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                    dragActive
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10"
                      : "border-slate-300 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
                  }`}
                >
                  <UploadCloud className="h-6 w-6 text-slate-400" />

                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Drag an image here, or{" "}
                    <span className="text-amber-600 dark:text-amber-400">
                      browse
                    </span>
                  </p>

                  <p className="text-xs text-slate-400">PNG or JPG, up to 5MB</p>
                </label>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              {editingProject && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving
                  ? editingProject
                    ? "Updating..."
                    : "Saving..."
                  : editingProject
                  ? "Update project"
                  : "Add project"}
              </button>
            </div>
          </form>
        </div>

        {/* ========================================
            PROJECT LIST HEADER
        ======================================== */}

        <div className="sticky top-0 z-10 -mx-4 mb-6 bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/80 sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none dark:sm:bg-transparent">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Your projects
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Showing {filteredProjects.length} of {totalProjects} projects
                </p>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <label htmlFor="project-search" className="sr-only">
                  Search projects
                </label>

                <input
                  id="project-search"
                  type="search"
                  placeholder="Search by title, category, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              <div className="md:w-64">
                <label htmlFor="category-filter" className="sr-only">
                  Filter by category
                </label>

                <select
                  id="category-filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div>
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
              </div>
            )}
          </div>
        </div>

        {/* ========================================
            PROJECTS
        ======================================== */}

        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900 sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <FolderKanban className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              No projects found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {hasActiveFilters
                ? "Try changing your search or category filter."
                : "You haven't added any projects yet. Add your first project using the form above."}
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
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                {/* IMAGE */}
                <div className="relative aspect-[4/3] w-full flex-none overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {project.image_url ? (
                    <>
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                      <ImageOff className="h-8 w-8" />
                      <p className="text-xs font-medium">No image uploaded</p>
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                    {project.category}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="line-clamp-2 text-xl font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin className="h-4 w-4 flex-none" />
                    <span className="line-clamp-1">{project.location}</span>
                  </div>

                  <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {project.description}
                  </p>

                  {/* Date */}
                  <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>
                      Added{" "}
                      {project.created_at
                        ? new Date(project.created_at).toLocaleDateString()
                        : "Unknown date"}
                      {project.updated_at &&
                        project.updated_at !== project.created_at &&
                        ` · Updated ${new Date(
                          project.updated_at
                        ).toLocaleDateString()}`}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => editProject(project)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-amber-500 hover:text-white dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(project)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500 dark:hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <DeleteDialog
        project={deleteTarget}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
}