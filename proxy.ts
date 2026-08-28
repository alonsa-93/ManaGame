import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, isAuthEnabled, verifySessionValue } from "@/lib/auth/admin-session";

/**
 * Access gate for the internal surfaces.
 *
 * `proxy.ts`, not `middleware.ts` — the middleware convention is deprecated in
 * Next 16 and renamed to proxy (see node_modules/next/dist/docs, and AGENTS.md
 * on why this repo's Next is not the one you remember).
 *
 * This runs before any page renders, which is the point: an unauthenticated
 * request to /assessor/sessions must never reach a component that reads
 * candidate data, not even to throw it away afterwards.
 */
export async function proxy(request: NextRequest) {
  if (!isAuthEnabled()) return NextResponse.next();

  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifySessionValue(cookie)) return NextResponse.next();

  const login = new URL("/login", request.url);
  // Carry the destination so signing in lands the operator where they meant to
  // go. Only the path and query are kept — never an absolute URL, which would
  // turn this into an open redirect.
  login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/assessor/:path*"],
};
