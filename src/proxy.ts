import { NextResponse, type NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  // Overwrite client input. This is navigation context, never an authorization signal.
  headers.set(
    "x-infurnus-workspace-path",
    request.nextUrl.pathname + request.nextUrl.search,
  );
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ["/admin/:path*", "/super-admin/:path*"] };
