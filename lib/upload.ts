import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export async function uploadImage({
  supabase,
  bucket,
  file,
  folder,
}: {
  supabase: SupabaseClient;
  bucket: string;
  file: File;
  folder: string;
}) {
  if (!allowedImageTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WebP images are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be less than 5 MB.");
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${folder}/${crypto.randomUUID()}.${fileExtension}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return data.publicUrl;
}