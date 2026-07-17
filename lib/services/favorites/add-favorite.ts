"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function addFavorite(businessId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in to save businesses." };
  }

  const { error } = await supabase.from("favorites").insert({
    profile_id: user.id,
    business_id: businessId,
  });

  if (error && error.code !== "23505") {
    return { error: error.message };
  }

  revalidatePath("/favorites");
  revalidatePath("/profile");

  return { error: null };
}
