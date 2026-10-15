"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const categories = [
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

export default function AddMaterialForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    in_stock: true,
    featured: false,
  });

  const [image, setImage] = useState(null);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      // 1. Verify the current Supabase user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("Logged in user ID:", user?.id);
      console.log("User lookup error:", userError);

      if (userError) throw userError;

      if (!user) {
        throw new Error(
          "You are not logged in. Please sign in again."
        );
      }

      // 2. Upload the image if one was selected
      let imageUrl = "";

      if (image) {
        const extension = image.name.split(".").pop();
        const fileName = `${Date.now()}.${extension}`;
        const filePath = `materials/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("materials")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("materials")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // 3. Insert the material
      const { error: insertError } = await supabase
        .from("materials")
        .insert({
          name: form.name.trim(),
          category: form.category,
          description: form.description.trim(),
          image_url: imageUrl,
          price: form.price === "" ? null : Number(form.price),
          in_stock: form.in_stock,
          featured: form.featured,
        });

      if (insertError) {
        console.error("Material insert error:", insertError);
        throw insertError;
      }

      // 4. Reset the form after successful insertion
      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        in_stock: true,
        featured: false,
      });

      setImage(null);

      onSuccess?.();

      alert("Material added successfully!");
    } catch (err) {
      console.error("Add material failed:", err);
      alert(err.message || "Failed to add material.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Material Name
        </label>

        <input
          className="w-full rounded-xl border p-3"
          value={form.name}
          onChange={(e) =>
            updateField("name", e.target.value)
          }
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Category
        </label>

        <select
          className="w-full rounded-xl border p-3"
          value={form.category}
          onChange={(e) =>
            updateField("category", e.target.value)
          }
          required
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Price
        </label>

        <input
          type="number"
          className="w-full rounded-xl border p-3"
          value={form.price}
          onChange={(e) =>
            updateField("price", e.target.value)
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          rows={4}
          className="w-full rounded-xl border p-3"
          value={form.description}
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Material Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files?.[0])
          }
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.in_stock}
            onChange={(e) =>
              updateField(
                "in_stock",
                e.target.checked
              )
            }
          />
          In Stock
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              updateField(
                "featured",
                e.target.checked
              )
            }
          />
          Featured
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-amber-500 px-6 py-3 font-medium text-white hover:bg-amber-600"
      >
        {loading
          ? "Adding Material..."
          : "Add Material"}
      </button>
    </form>
  );
}