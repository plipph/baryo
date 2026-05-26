
import { adminSupabase } from "@/lib/supabase/admin";

export async function logBusinessVisit(
  businessId: string
) {
  const { error } =
    await adminSupabase
      .from("business_analytics")
      .insert({
        business_id:
          businessId,
      });

  if (error) {
    console.error(error);

    throw new Error(
      error.message
    );
  }
}

