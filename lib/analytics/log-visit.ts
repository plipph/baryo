
import { adminSupabase } from "@/lib/supabase/admin";

export async function logBusinessVisit(
  businessId: string
) {
  console.log(
    "LOGGING VISIT:",
    businessId
  );

  const { data, error } =
    await adminSupabase
      .from("business_analytics")
      .insert({
        business_id:
          businessId,
      })
      .select();

  console.log(
    "ANALYTICS RESULT:",
    data
  );

  if (error) {
    console.error(
      "ANALYTICS ERROR:",
      error
    );
  }
}

