"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function removeFavorite(businessId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in to manage saved businesses." };
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("profile_id", user.id)
    .eq("business_id", businessId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/favorites");
  revalidatePath("/profile");

  return { error: null };
}
