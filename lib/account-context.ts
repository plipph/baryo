import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getAccountContext() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, business: null };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { user, business };
}
