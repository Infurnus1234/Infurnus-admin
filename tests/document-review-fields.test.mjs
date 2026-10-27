import test from "node:test";
import assert from "node:assert/strict";
import { reviewDocumentFields } from "../src/lib/review-document-fields.ts";
import { requestTimestamp } from "../src/lib/request-models.ts";

test("calendar-only document dates retain their day in a negative UTC timezone", () => {
  const original = process.env.TZ;
  try {
    process.env.TZ = "America/Los_Angeles";
    assert.equal(requestTimestamp("2030-01-01"), "1 Jan 2030");
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
});

test("partner document row dates and reviewer correction reach the same preview UI contract", () => {
  assert.deepEqual(
    reviewDocumentFields({
      expires_at: "2030-01-01",
      issued_at: "2025-01-01",
      metadata: {
        documentNumber: "TEST_SAMPLE",
        rejectionReason: "Replace unreadable copy",
      },
    }),
    {
      number: "TEST_SAMPLE",
      expiresAt: "2030-01-01",
      issuedAt: "2025-01-01",
      reason: "Replace unreadable copy",
      licenceClasses: undefined,
    },
  );
});
test("Driver metadata dates remain supported; authoritative partner expiry wins over stale metadata", () => {
  assert.equal(
    reviewDocumentFields({ document_metadata: { licenceClasses: "LMV" } })
      .licenceClasses,
    "LMV",
  );
  assert.equal(
    reviewDocumentFields({ document_metadata: { expiresAt: "2030-05-01" } })
      .expiresAt,
    "2030-05-01",
  );
  assert.equal(
    reviewDocumentFields({
      expires_at: "2031-01-01",
      metadata: { expiresAt: "2020-01-01" },
    }).expiresAt,
    "2031-01-01",
  );
});
