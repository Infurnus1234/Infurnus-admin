import type { ReviewDocument } from "./request-models.ts";

// Partner dates live on the row; Driver dates live in document_metadata.
export function reviewDocumentFields(document: ReviewDocument) {
  return {
    number:
      document.document_metadata?.documentNumber ||
      document.metadata?.documentNumber,
    expiresAt:
      document.expires_at ||
      document.document_metadata?.expiresAt ||
      document.metadata?.expiresAt ||
      undefined,
    issuedAt:
      document.issued_at || document.document_metadata?.issuedAt || undefined,
    reason: document.rejection_reason || document.metadata?.rejectionReason,
    licenceClasses: document.document_metadata?.licenceClasses,
  };
}
