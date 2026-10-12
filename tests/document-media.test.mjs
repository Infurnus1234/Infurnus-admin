import { test } from "node:test";
import assert from "node:assert/strict";
import {
  documentStorageUrl,
  documentMime,
  readDocument,
  documentLimit,
} from "../src/lib/document-media.ts";
import { reviewReturnPath } from "../src/lib/review-context.ts";
test("document storage only accepts trusted HTTPS delivery; local fixtures never work in production", () => {
  assert.equal(
    new URL(
      documentStorageUrl(
        "https://res.cloudinary.com/test/image/authenticated/file.png",
      ),
    ).hostname,
    "res.cloudinary.com",
  );
  for (const url of [
    "http://res.cloudinary.com/file",
    "https://res.cloudinary.com.evil.invalid/file",
    "http://169.254.169.254/meta",
    "https://fixture:password@res.cloudinary.com/file",
    "https://res.cloudinary.com:444/file",
  ])
    assert.throws(() => documentStorageUrl(url));
  assert.equal(
    documentStorageUrl(
      "http://127.0.0.1:3110/sample.png",
      "http://127.0.0.1:3110",
      false,
    ),
    "http://127.0.0.1:3110/sample.png",
  );
  assert.throws(() =>
    documentStorageUrl(
      "http://127.0.0.1:3110/sample.png",
      "http://127.0.0.1:3110",
      true,
    ),
  );
});
test("HTML, SVG and executable media are rejected", () => {
  for (const type of ["text/html", "image/svg+xml", "application/javascript"])
    assert.throws(() => documentMime(type));
  assert.equal(
    documentMime("application/pdf; charset=binary"),
    "application/pdf",
  );
});
test("real PDF bytes are preserved; unavailable storage and disguised payloads fail", async () => {
  const pdf = new TextEncoder().encode("%PDF-1.7\nfixture bytes");
  const result = await readDocument(
    new Response(pdf, { headers: { "Content-Type": "application/pdf" } }),
  );
  assert.equal(result.type, "application/pdf");
  assert.deepEqual(new Uint8Array(result.data), pdf);
  await assert.rejects(
    () =>
      readDocument(
        new Response("<html>wrong</html>", {
          headers: { "Content-Type": "image/png" },
        }),
      ),
    /declared format/,
  );
  await assert.rejects(
    () =>
      readDocument(
        new Response("", {
          status: 404,
          headers: { "Content-Type": "application/pdf" },
        }),
      ),
    /unavailable/,
  );
});
test("declared and streamed response limits prevent oversized files", async () => {
  await assert.rejects(
    () =>
      readDocument(
        new Response("small", {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Length": String(documentLimit + 1),
          },
        }),
      ),
    /limit/,
  );
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(documentLimit + 1));
      controller.close();
    },
  });
  await assert.rejects(
    () =>
      readDocument(
        new Response(stream, {
          headers: { "Content-Type": "application/pdf" },
        }),
      ),
    /limit/,
  );
});
test("review return navigation preserves only the correct role parent context", () => {
  assert.equal(
    reviewReturnPath(
      "/super-admin/driver-requests?status=ALL&q=TEST_ONLY&page=2",
      "super-admin",
    ),
    "/super-admin/driver-requests?status=ALL&q=TEST_ONLY&page=2",
  );
  for (const path of [
    "https://evil.invalid",
    "//evil.invalid",
    "/admin/driver-requests",
    "/super-admin/finance",
  ])
    assert.equal(
      reviewReturnPath(path, "super-admin"),
      "/super-admin/driver-requests",
    );
});
