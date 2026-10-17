import test from "node:test";
import assert from "node:assert/strict";
import { onboardingReviewPayload } from "../src/lib/request-models.ts";
import { approvalQuery } from "../src/lib/approval-api.ts";
const details = {
  target: { updated_at: "2026-10-17T00:00:00.123456+00:00" },
  onboarding_items: [
    {
      id: "photo",
      status: "PENDING",
      expected_updated_at: "2026-10-17T00:00:01.123456+00:00",
    },
    {
      id: "licence",
      status: "PENDING",
      expected_updated_at: "2026-10-17T00:00:02.123456+00:00",
    },
    {
      id: "old",
      status: "REJECTED",
      expected_updated_at: "2026-10-16T00:00:00+00:00",
    },
  ],
};
test("rollout fallback supports the old backend without masking permissions or server failures", async () => {
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return url.includes("group=driver")
      ? Response.json(
          { success: false, error: { message: "Unsupported query" } },
          { status: 400 },
        )
      : Response.json({ success: true, data: [{ id: "legacy" }] });
  };
  assert.deepEqual(
    await approvalQuery(
      "/provider-approvals?group=driver",
      "/provider-approvals",
    ),
    [{ id: "legacy" }],
  );
  assert.equal(calls.length, 2);
  for (const status of [401, 403, 409, 500]) {
    let count = 0;
    globalThis.fetch = async () => {
      count++;
      return Response.json(
        { success: false, error: { message: "Rejected" } },
        { status },
      );
    };
    await assert.rejects(
      approvalQuery("/provider-approvals?group=driver", "/provider-approvals"),
    );
    assert.equal(count, 1);
  }
});
test("one onboarding decision contains the exact pending snapshot and preserves microseconds", () => {
  const body = onboardingReviewPayload(details, "APPROVED", "");
  assert.deepEqual(
    body.items,
    details.onboarding_items.slice(0, 2).map((item) => ({
      id: item.id,
      expectedUpdatedAt: item.expected_updated_at,
    })),
  );
});
test("individual evidence review uses its own version and does not review other items", () => {
  const body = onboardingReviewPayload(
    details,
    "REJECTED",
    "Replace unreadable photo",
    "photo",
  );
  assert.equal(
    body.expectedUpdatedAt,
    details.onboarding_items[0].expected_updated_at,
  );
  assert.equal(body.items, undefined);
  assert.equal(body.reason, "Replace unreadable photo");
});
test("rejection needs a reason and reviewed or absent snapshots cannot be submitted", () => {
  assert.throws(
    () => onboardingReviewPayload(details, "REJECTED", ""),
    /reason/,
  );
  assert.throws(
    () => onboardingReviewPayload(details, "APPROVED", "", "old"),
    /no longer pending/,
  );
  assert.throws(
    () =>
      onboardingReviewPayload(
        { ...details, onboarding_items: [] },
        "APPROVED",
        "",
      ),
    /No pending/,
  );
});
