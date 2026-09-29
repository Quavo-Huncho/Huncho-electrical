import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "project-images";

// ==========================================
// UPLOAD PROJECT IMAGE
// ==========================================

export async function uploadProjectImage(file) {
  if (!file) {
    throw new Error("No image selected.");
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.${fileExt}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicUrl;
}

// ==========================================
// DELETE PROJECT IMAGE
// ==========================================

export async function deleteProjectImage(imageUrl) {
  if (!imageUrl) {
    return;
  }

  try {
    const url = new URL(imageUrl);

    const path = url.pathname.split(
      `/storage/v1/object/public/${BUCKET_NAME}/`
    )[1];

    if (!path) {
      console.warn(
        "Could not determine storage path from image URL."
      );
      return;
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error(
        "Failed to delete project image:",
        error
      );
    }
  } catch (error) {
    console.error(
      "Invalid project image URL:",
      error
    );
  }
}