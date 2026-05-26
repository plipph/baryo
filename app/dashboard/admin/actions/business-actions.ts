"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function toggleBusinessStatus(
  businessId: string,
  currentStatus: boolean
) {
  const supabase =
    await createClient();

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
    TEMP ADMIN CHECK
  */

  const adminEmails = [
    "kgcomia@gmail.com",
  ];

  const isAdmin =
    user.email &&
    adminEmails.includes(
      user.email
    );

  if (!isAdmin) {
    throw new Error(
      "Forbidden"
    );
  }

  /*
    UPDATE STORE STATUS
  */

  const { error } =
    await supabase
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
    IMPORTANT:
    refresh pages
  */

  revalidatePath(
    "/dashboard/admin"
  );

  revalidatePath("/");

  return {
    success: true,
  };
}

