import { NextRequest, NextResponse } from "next/server";
import { GET as backendProxy } from "@/app/api/backend/[...path]/route";
import { documentStorageUrl, readDocument } from "@/lib/document-media";
export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ kind: string; owner: string; document: string }>;
  },
) {
  const { kind, owner, document } = await context.params;
  const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
  const query = request.nextUrl.searchParams;
  if (
    !["approval", "driver"].includes(kind) ||
    !uuid.test(owner) ||
    !uuid.test(document) ||
    query.getAll("page").length > 1 ||
    [...query.keys()].some((k) => k !== "page") ||
    (query.has("page") && !/^[1-5]$/.test(query.get("page") || ""))
  )
    return NextResponse.json(
      { message: "Invalid document request" },
      { status: 400 },
    );
  const path =
    kind === "approval"
      ? `provider-approvals/${owner}/documents/${document}/access-url`
      : `admin/drivers/${owner}/documents/${document}/access-url`;
  const authorized = await backendProxy(request, {
    params: Promise.resolve({ path: path.split("/") }),
  });
  const finish = (response: NextResponse) => {
    response.headers.set("Cache-Control", "private, no-store");
    for (const cookie of authorized.headers.getSetCookie())
      response.headers.append("Set-Cookie", cookie);
    return response;
  };
  if (!authorized.ok)
    return finish(
      NextResponse.json(
        {
          message: [401, 403].includes(authorized.status)
            ? "Your session or permissions do not allow this document."
            : "Document or page is unavailable. Reload the record and retry.",
        },
        { status: authorized.status },
      ),
    );
  try {
    const payload = await authorized.json();
    const url = documentStorageUrl(
      payload.data.accessUrl,
      process.env.ADMIN_LOCAL_DOCUMENT_ORIGIN,
      process.env.NODE_ENV === "production",
    );
    const stored = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    const { data, type } = await readDocument(stored);
    const response = new NextResponse(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "no-referrer",
        "Content-Disposition": `inline; filename="document.${type === "application/pdf" ? "pdf" : type.split("/")[1]}"`,
      },
    });
    return finish(response);
  } catch {
    return finish(
      NextResponse.json(
        {
          message:
            "The stored file could not be previewed. Its link may have expired, the format may be unsupported, or storage may be unavailable. Retry to request fresh access.",
        },
        { status: 502 },
      ),
    );
  }
}
