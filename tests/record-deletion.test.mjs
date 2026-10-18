import test from "node:test";
import assert from "node:assert/strict";
import { permanentlyDeleteRecord, ApiError } from "../src/lib/admin-api.ts";

const id = "f83f72ef-115f-4dba-a88d-4ef5839e8556";
test("deletion sends the selected ID with DELETE and requires the backend acknowledgement", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, `/api/backend/admin/records/users/${id}`);
    assert.equal(options.method, "DELETE");
    assert.equal(options.credentials, "same-origin");
    return Response.json({ success: true, data: { id, deleted: true } });
  };
  await permanentlyDeleteRecord("users", id);
});
test("incomplete, mismatched and negative acknowledgements never report deletion success", async () => {
  for (const data of [
    undefined,
    {},
    { id, deleted: false },
    { id: "other-id", deleted: true },
  ]) {
    globalThis.fetch = async () => Response.json({ success: true, data });
    await assert.rejects(
      permanentlyDeleteRecord("users", id),
      (error) => error instanceof ApiError && error.status === 502,
    );
  }
  globalThis.fetch = async () => new Response(null, { status: 204 });
  await assert.rejects(permanentlyDeleteRecord("users", id), /not confirmed/);
});
test("retention reasons and authorization failures reach the dialog without fake success", async () => {
  for (const status of [401, 403, 409]) {
    const message =
      status === 409
        ? "Permanent deletion blocked by protected documents; use account deactivation."
        : "Access denied";
    globalThis.fetch = async () =>
      Response.json({ success: false, error: { message } }, { status });
    await assert.rejects(
      permanentlyDeleteRecord("drivers", id),
      (error) =>
        error instanceof ApiError &&
        error.status === status &&
        error.message === message,
    );
  }
});
