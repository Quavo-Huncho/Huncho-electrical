import { supabase } from "@/lib/supabase";

export async function uploadMaterialImage(file) {
  const fileExt = file.name.split(".").pop();

  const fileName = `${Date.now()}.${fileExt}`;

  const filePath = `materials/${fileName}`;

  const { error } = await supabase.storage
    .from("materials")
    .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("materials")
    .getPublicUrl(filePath);

  return publicUrl;
}