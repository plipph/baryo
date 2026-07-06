
"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { adminSupabase } from "@/lib/supabase/admin";

export async function toggleBusinessStatus(
  formData: FormData
) {
  /*
    NORMAL USER CLIENT
    (for auth verification only)
  */

  const supabase =
    await createClient();

  /*
    FORM DATA
  */

  const businessId =
    formData.get(
      "businessId"
    ) as string;

  const currentStatus =
    formData.get(
      "currentStatus"
    ) === "true";

  /*
    AUTH CHECK
  */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  /*
    ADMIN CHECK
    User must have role = "admin"
    in the profiles table.
  */

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error(
      "Unable to verify permissions"
    );
  }

  if (profile?.role !== "admin") {
    throw new Error(
      "Forbidden"
    );
  }

  /*
    IMPORTANT:
    SERVICE ROLE UPDATE
    (bypasses RLS safely)
  */

  const { error } =
    await adminSupabase
      .from("businesses")
      .update({
        is_active:
          !currentStatus,
      })
      .eq("id", businessId);

  if (error) {
    console.error(error);

    throw new Error(
      error.message
    );
  }

  /*
    REFRESH
  */

  revalidatePath(
    "/dashboard/admin"
  );

  revalidatePath("/");

  return;
}
