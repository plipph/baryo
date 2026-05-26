import { NextResponse } from "next/server";

import { adminSupabase } from "@/lib/supabase/admin";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const businessId =
    searchParams.get(
      "businessId"
    );

  const linkId =
    searchParams.get(
      "linkId"
    );

  const target =
    searchParams.get(
      "target"
    );

  /*
    VALIDATION
  */

  if (
    !businessId ||
    !linkId ||
    !target
  ) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  /*
    LOG CLICK
  */

  await adminSupabase
    .from("link_clicks")
    .insert({
      business_id:
        businessId,
      link_id: linkId,
    });

  /*
    REDIRECT
  */

  return NextResponse.redirect(
    target
  );
}

