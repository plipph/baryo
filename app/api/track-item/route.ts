import { NextResponse } from "next/server";

import { adminSupabase } from "@/lib/supabase/admin";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const businessId =
      searchParams.get(
        "businessId"
      );

    const itemId =
      searchParams.get(
        "itemId"
      );

    /*
      VALIDATION
    */

    if (
      !businessId ||
      !itemId
    ) {
      return NextResponse.json(
        {
          error:
            "Missing params",
        },
        {
          status: 400,
        }
      );
    }

    /*
      LOG CLICK
    */

    await adminSupabase
      .from("item_clicks")
      .insert({
        business_id:
          businessId,
        item_id: itemId,
      });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "ITEM TRACK ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Tracking failed",
      },
      {
        status: 500,
      }
    );
  }
}

