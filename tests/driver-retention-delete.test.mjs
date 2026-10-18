import test from "node:test";
import assert from "node:assert/strict";
import { permanentlyDeleteRecord } from "../src/lib/admin-api.ts";
test("retention deletion requires explicit request and matching backend confirmation", async () => {
  const id = "local-driver";
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/backend/admin/records/drivers/" + id);
    assert.equal(options.method, "DELETE");
    assert.deepEqual(JSON.parse(options.body), { retainHistory: true });
    return Response.json({
      success: true,
      data: {
        id,
        deleted: true,
        mode: "retained",
        message: "Access removed; documents retained.",
      },
    });
  };
  assert.equal(
    await permanentlyDeleteRecord("drivers", id, true),
    "Access removed; documents retained.",
  );
  globalThis.fetch = async () =>
    Response.json({ success: true, data: { id, deleted: true } });
  await assert.rejects(
    permanentlyDeleteRecord("drivers", id, true),
    /did not confirm retention-safe/,
  );
});
