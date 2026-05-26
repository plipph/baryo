"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function toggleBusinessStatus(
  formData: FormData
) {
  const supabase =
    await createClient();

  const businessId =
    formData.get(
      "businessId"
    ) as string;

  const currentStatus =
    formData.get(
      "currentStatus"
    ) === "true";

  /*
    AUTH
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
    UPDATE
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
    REFRESH
  */

  revalidatePath(
    "/dashboard/admin"
  );

  revalidatePath("/");

  return;
}

