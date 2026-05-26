"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { error } from "console";

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
  await supabase.rpc(
    "toggle_business_status",
    {
      target_business_id:
        businessId,
      new_status:
        !currentStatus,
    }
  );



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

