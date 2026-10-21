
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import AddMaterialForm from "@/components/materials/AddMaterialForm";
import {
  Package,
  PackageCheck,
  PackageX,
  Star,
  Search,
  Plus,
  X,
  Trash2,
  Pencil,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const MATERIAL_CATEGORIES = [
  "Cables",
  "Switches",
  "Sockets",
  "Distribution Boards",
  "Circuit Breakers",
  "Changeover Switches",
  "Solar Materials",
  "Lighting",
  "Conduits",
  "Accessories",
];

function formatPrice(price) {
  if (price === null || price === undefined || price === "") return "—";
  return `₦${Number(price).toLocaleString()}`;
}

// ==========================================
// TOAST NOTIFICATION
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
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto flex max-w-md items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur sm:inset-x-auto sm:right-6 sm:bottom-6"
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
        className="rounded-md p-1 text-slate-500 hover:bg-black/5"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ==========================================
// DELETE CONFIRMATION
// ==========================================

function DeleteDialog({ material, deleting, onCancel, onConfirm }) {
  if (!material) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <Trash2 className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Delete this material?
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          <strong className="text-slate-700 dark:text-slate-200">
            {material.name}
          </strong>{" "}
          will be permanently removed from your materials list.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {deleting ? "Deleting..." : "Delete material"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STATISTICS CARD
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
// MAIN MATERIALS PAGE
// ==========================================

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    in_stock: true,
    featured: false,
  });
  const [editImage, setEditImage] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [toast, setToast] = useState(null);

  function notify(type, message) {
    setToast({ type, message });
  }

  // ==========================================
  // LOAD MATERIALS
  // ==========================================

  async function loadMaterials() {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading materials:", error);
      notify("error", "Couldn't load materials: " + error.message);
      return false;
    }

    setMaterials(data || []);
    return true;
  }

  useEffect(() => {
    let active = true;

    async function initialLoad() {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Error loading materials:", error);
        notify("error", "Couldn't load materials: " + error.message);
      } else {
        setMaterials(data || []);
      }

      setLoading(false);
    }

    initialLoad();

    return () => {
      active = false;
    };
  }, []);

  // ==========================================
  // UPDATE STOCK
  // ==========================================

  async function toggleStock(item) {
    setUpdatingId(item.id);

    try {
      const { data, error } = await supabase
        .from("materials")
        .update({ in_stock: !item.in_stock })
        .eq("id", item.id)
        .select("id");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "No material was updated. Check your materials table UPDATE policy in Supabase."
        );
      }

      await loadMaterials();
    } catch (error) {
      console.error("Stock update error:", error);
      notify("error", error.message || "Couldn't update stock status.");
    } finally {
      setUpdatingId(null);
    }
  }

  // ==========================================
  // UPDATE FEATURED STATUS
  // ==========================================

  async function toggleFeatured(item) {
    setUpdatingId(item.id);

    try {
      const { data, error } = await supabase
        .from("materials")
        .update({ featured: !item.featured })
        .eq("id", item.id)
        .select("id");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "No material was updated. Check your materials table UPDATE policy in Supabase."
        );
      }

      await loadMaterials();
    } catch (error) {
      console.error("Featured update error:", error);
      notify("error", error.message || "Couldn't update featured status.");
    } finally {
      setUpdatingId(null);
    }
  }

  // ==========================================
  // DELETE MATERIAL
  // ==========================================

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const { data, error } = await supabase
        .from("materials")
        .delete()
        .eq("id", deleteTarget.id)
        .select("id");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "No material was deleted. Check the DELETE policy for the materials table in Supabase. Your current permissions may block this action."
        );
      }

      setMaterials((current) =>
        current.filter((item) => item.id !== deleteTarget.id)
      );

      setDeleteTarget(null);
      notify("success", "Material deleted successfully.");
    } catch (error) {
      console.error("Delete material error:", error);
      notify("error", error.message || "Failed to delete material.");
    } finally {
      setDeleting(false);
    }
  }

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  function openEdit(item) {
    setEditingMaterial(item);

    setEditForm({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
      price: item.price ?? "",
      in_stock: Boolean(item.in_stock),
      featured: Boolean(item.featured),
    });

    setEditImage(null);
  }

  // ==========================================
  // SAVE EDITED MATERIAL
  // ==========================================

  async function saveEdit(event) {
    event.preventDefault();

    if (!editingMaterial) return;

    if (!editForm.name.trim()) {
      notify("error", "Please enter a material name.");
      return;
    }

    if (
      editForm.price !== "" &&
      (!Number.isFinite(Number(editForm.price)) ||
        Number(editForm.price) < 0)
    ) {
      notify("error", "Please enter a valid price.");
      return;
    }

    setSavingEdit(true);

    let uploadedFilePath = null;

    try {
      let imageUrl = editingMaterial.image_url || "";

      // Upload a replacement image if the admin selected one.
      if (editImage) {
        const extension =
          editImage.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${extension}`;

        uploadedFilePath = `materials/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("materials")
          .upload(uploadedFilePath, editImage, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("materials")
          .getPublicUrl(uploadedFilePath);

        imageUrl = publicData.publicUrl;
      }

      const { data, error } = await supabase
        .from("materials")
        .update({
          name: editForm.name.trim(),
          category: editForm.category,
          description: editForm.description.trim(),
          price: editForm.price === "" ? null : Number(editForm.price),
          in_stock: editForm.in_stock,
          featured: editForm.featured,
          image_url: imageUrl,
        })
        .eq("id", editingMaterial.id)
        .select("id");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "No material was updated. Check the UPDATE policy for the materials table in Supabase."
        );
      }

      setMaterials((current) =>
        current.map((item) =>
          item.id === editingMaterial.id
            ? {
                ...item,
                name: editForm.name.trim(),
                category: editForm.category,
                description: editForm.description.trim(),
                price: editForm.price === "" ? null : Number(editForm.price),
                in_stock: editForm.in_stock,
                featured: editForm.featured,
                image_url: imageUrl,
              }
            : item
        )
      );

      setEditingMaterial(null);
      setEditImage(null);
      notify("success", "Material updated successfully.");
    } catch (error) {
      console.error("Update material error:", error);

      // If upload succeeded but saving the row failed, attempt to remove
      // the newly uploaded, unused image.
      if (uploadedFilePath) {
        const { error: cleanupError } = await supabase.storage
          .from("materials")
          .remove([uploadedFilePath]);

        if (cleanupError) {
          console.error("Replacement image cleanup error:", cleanupError);
        }
      }

      notify("error", error.message || "Failed to update material.");
    } finally {
      setSavingEdit(false);
    }
  }

  // ==========================================
  // FILTERS AND STATISTICS
  // ==========================================

  const categories = useMemo(() => {
    const unique = materials.map((m) => m.category?.trim()).filter(Boolean);
    return ["All", ...new Set(unique)];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();

    return materials
      .filter(
        (item) => categoryFilter === "All" || item.category === categoryFilter
      )
      .filter((item) => {
        if (stockFilter === "All") return true;
        return stockFilter === "In Stock" ? item.in_stock : !item.in_stock;
      })
      .filter((item) => {
        if (!query) return true;

        return (
          item.name?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        );
      });
  }, [materials, search, categoryFilter, stockFilter]);

  const total = materials.length;
  const inStockCount = materials.filter((m) => m.in_stock).length;
  const outOfStockCount = total - inStockCount;
  const featuredCount = materials.filter((m) => m.featured).length;

  const hasActiveFilters =
    Boolean(search) || categoryFilter !== "All" || stockFilter !== "All";

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

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
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
        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-amber-500">
              Admin dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Materials management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
              Add and manage the electrical materials you stock and supply.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
          >
            {showForm ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {showForm ? "Close form" : "Add material"}
          </button>
        </div>

        {/* STATISTICS */}

        <div className="mb-10 -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
          <StatCard
            label="Total materials"
            value={total}
            icon={<Package className="h-5 w-5" />}
            accent="#f59e0b"
          />

          <StatCard
            label="In stock"
            value={inStockCount}
            icon={<PackageCheck className="h-5 w-5" />}
            accent="#10b981"
          />

          <StatCard
            label="Out of stock"
            value={outOfStockCount}
            icon={<PackageX className="h-5 w-5" />}
            accent="#f43f5e"
          />

          <StatCard
            label="Featured"
            value={featuredCount}
            icon={<Star className="h-5 w-5" />}
            accent="#3b82f6"
          />
        </div>

        {/* ADD MATERIAL FORM */}

        {showForm && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <Plus className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Add new material
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This will appear in your materials list once saved.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <AddMaterialForm
                onSuccess={async () => {
                  setShowForm(false);
                  await loadMaterials();
                  notify("success", "Material added.");
                }}
              />
            </div>
          </div>
        )}

        {/* SEARCH AND FILTERS */}

        <div className="sticky top-0 z-10 -mx-4 mb-6 bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/80 sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none dark:sm:bg-transparent">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <label htmlFor="material-search" className="sr-only">
                  Search materials
                </label>

                <input
                  id="material-search"
                  type="text"
                  placeholder="Search by name or category..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              <div className="md:w-52">
                <label htmlFor="category-filter" className="sr-only">
                  Filter by category
                </label>

                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:w-48">
                <label htmlFor="stock-filter" className="sr-only">
                  Filter by stock status
                </label>

                <select
                  id="stock-filter"
                  value={stockFilter}
                  onChange={(event) => setStockFilter(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="All">All stock status</option>
                  <option value="In Stock">In stock</option>
                  <option value="Out of Stock">Out of stock</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {filteredMaterials.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {total}
                </span>{" "}
                materials
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setStockFilter("All");
                  }}
                  className="text-sm font-semibold text-amber-500 transition hover:text-amber-600"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MATERIALS LIST */}

        {filteredMaterials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900 sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Package className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              No materials found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {hasActiveFilters
                ? "Try changing your search or filters."
                : "You haven't added any materials yet. Add your first one above."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("All");
                  setStockFilter("All");
                }}
                className="mt-5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMaterials.map((item) => {
              const isUpdating = updatingId === item.id;

              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* IMAGE */}

                  <div className="relative aspect-[4/3] w-full flex-none overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Package className="h-8 w-8" />
                      </div>
                    )}

                    {item.featured && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* MATERIAL DETAILS */}

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-1 font-semibold text-slate-900 dark:text-white">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {item.category || "Uncategorized"}
                    </p>

                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    )}

                    <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-4 flex flex-1 items-end justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStock(item)}
                        disabled={isUpdating}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          item.in_stock
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                            : "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                        }`}
                        title="Click to toggle stock status"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : item.in_stock ? (
                          <PackageCheck className="h-3 w-3" />
                        ) : (
                          <PackageX className="h-3 w-3" />
                        )}

                        {item.in_stock ? "In stock" : "Out of stock"}
                      </button>

                      <div className="flex items-center gap-1">
                        {/* EDIT BUTTON */}

                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          aria-label={`Edit ${item.name}`}
                          title="Edit material"
                          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* FEATURED BUTTON */}

                        <button
                          type="button"
                          onClick={() => toggleFeatured(item)}
                          disabled={isUpdating}
                          aria-label={
                            item.featured
                              ? `Remove ${item.name} from featured`
                              : `Mark ${item.name} as featured`
                          }
                          title="Click to toggle featured"
                          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-slate-400 transition hover:bg-amber-50 hover:text-amber-500 disabled:opacity-60 dark:hover:bg-amber-500/10"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              item.featured
                                ? "fill-amber-500 text-amber-500"
                                : ""
                            }`}
                          />
                        </button>

                        {/* DELETE BUTTON */}

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={`Delete ${item.name}`}
                          title="Delete material"
                          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT MATERIAL MODAL */}

      {editingMaterial && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Edit material
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Update the details below and save your changes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingMaterial(null)}
                disabled={savingEdit}
                aria-label="Close edit form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveEdit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Material name *
                  <input
                    required
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Category

                  <select
                    value={editForm.category}
                    onChange={(event) =>
                      setEditForm((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="">Select category</option>

                    {MATERIAL_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

              </div>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Price (₦)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.price}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      price: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Replace image (optional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setEditImage(event.target.files?.[0] || null)
                  }
                  className="mt-1.5 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-2 file:font-semibold file:text-amber-700 dark:text-slate-300 dark:file:bg-amber-500/10 dark:file:text-amber-400"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500 dark:text-slate-400">
                  Leave empty to keep the current image.
                </span>
              </label>

              <div className="flex flex-wrap gap-5">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editForm.in_stock}
                    onChange={(event) =>
                      setEditForm((prev) => ({
                        ...prev,
                        in_stock: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-amber-500"
                  />
                  In stock
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editForm.featured}
                    onChange={(event) =>
                      setEditForm((prev) => ({
                        ...prev,
                        featured: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-amber-500"
                  />
                  Featured material
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  disabled={savingEdit}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingEdit ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {savingEdit ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}

      <DeleteDialog
        material={deleteTarget}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
}
