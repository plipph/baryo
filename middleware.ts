import { type NextRequest, NextResponse } from "next/server";

// Fallback local implementation of updateSession to avoid missing module error.
// This keeps middleware behavior minimal: it simply continues the request.
async function updateSession(request: NextRequest) {
  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};