import { test } from "node:test";
import assert from "node:assert/strict";
import { documentAccessUrl } from "../src/lib/admin-api.ts";
const base =
  "/api/backend/provider-approvals/request/documents/document/access-url";
for (const missingPageMessage of [
  "Page not found",
  "Stored document/page not found",
])
  test(
    "single-file page-not-found uses the same authorized root endpoint: " +
      missingPageMessage,
    async () => {
      const paths = [];
      globalThis.fetch = async (path) => {
        paths.push(path);
        return paths.length === 1
          ? Response.json(
              { success: false, error: { message: missingPageMessage } },
              { status: 404 },
            )
          : Response.json({
              success: true,
              data: { accessUrl: "https://files.example.invalid/document.png" },
            });
      };
      assert.equal(
        await documentAccessUrl("request", "document", 1, 1),
        "https://files.example.invalid/document.png",
      );
      assert.deepEqual(paths, [base + "?page=1", base]);
    },
  );
test("paged document success does not use legacy fallback", async () => {
  const paths = [];
  globalThis.fetch = async (path) => {
    paths.push(path);
    return Response.json({
      success: true,
      data: { accessUrl: "https://files.example.invalid/page.png" },
    });
  };
  await documentAccessUrl("request", "document", 2, 2);
  assert.deepEqual(paths, [base + "?page=2"]);
});
for (const [page, count, status, message] of [
  [2, 2, 404, "Page not found"],
  [1, 2, 404, "Page not found"],
  [1, 1, 404, "Document is not related to this request"],
  [1, 1, 401, "Session expired"],
  [1, 1, 403, "Access denied"],
])
  test(`document denial is preserved without fallback: ${page}/${count}/${status}/${message}`, async () => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return Response.json({ success: false, error: { message } }, { status });
    };
    await assert.rejects(
      documentAccessUrl("request", "document", page, count),
      (error) => error.status === status,
    );
    assert.equal(calls, 1);
  });
for (const accessUrl of [
  "javascript:alert(1)",
  "http://external.example.invalid/file",
])
  test(
    "unsafe document protocol is rejected: " + accessUrl.split(":")[0],
    async () => {
      globalThis.fetch = async () =>
        Response.json({ success: true, data: { accessUrl } });
      await assert.rejects(
        documentAccessUrl("request", "document", 1, 1),
        /Invalid document access URL/,
      );
    },
  );
