"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FileText, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Modal } from "./ui/Modal";
import { requestLabel, requestTimestamp } from "@/lib/request-models";
import { withAdminSession } from "@/lib/admin-api";
export interface SubmittedDocument {
  id: string;
  label: string;
  status: string;
  mimeType?: string;
  number?: string;
  createdAt?: string;
  reviewedAt?: string;
  reason?: string;
  expiresAt?: string;
  pages: {
    pageNumber: number;
    side?: string;
    mimeType?: string;
    createdAt?: string;
  }[];
}
function MediaPreview({ path, label }: { path: string; label: string }) {
  const [retry, setRetry] = useState(0),
    [zoom, setZoom] = useState(1);
  const key = path + "\n" + retry;
  const [result, setResult] = useState<{
    key: string;
    url?: string;
    type?: string;
    error?: string;
    loaded?: boolean;
  } | null>(null);
  useEffect(() => {
    const abort = new AbortController();
    let url = "";
    void (async () => {
      try {
        const response = await withAdminSession(() =>
          fetch(path, {
            credentials: "same-origin",
            cache: "no-store",
            signal: abort.signal,
          }),
        );
        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw Error(
            error?.message || "Secure document preview is unavailable.",
          );
        }
        const blob = await response.blob();
        if (abort.signal.aborted) return;
        url = URL.createObjectURL(blob);
        setResult({ key, url, type: blob.type });
      } catch (error) {
        if (!abort.signal.aborted)
          setResult({
            key,
            error: error instanceof Error ? error.message : "Preview failed",
          });
      }
    })();
    return () => {
      abort.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [path, key]);
  const current = result?.key === key ? result : null;
  if (current?.error)
    return (
      <div className="document-error" role="alert">
        <FileText />
        <p>{current.error}</p>
        <button onClick={() => setRetry((v) => v + 1)}>
          Retry secure access
        </button>
      </div>
    );
  return (
    <div className="document-preview">
      <div className="document-preview-toolbar">
        <span>{label}</span>
        <div>
          {current?.type !== "application/pdf" && (
            <>
              <button
                aria-label="Zoom out"
                disabled={zoom <= 0.5 || !current?.url}
                onClick={() => setZoom((v) => Math.max(0.5, v - 0.25))}
              >
                <ZoomOut size={17} />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                aria-label="Zoom in"
                disabled={zoom >= 2 || !current?.url}
                onClick={() => setZoom((v) => Math.min(2, v + 0.25))}
              >
                <ZoomIn size={17} />
              </button>
              <button
                aria-label="Reload document"
                onClick={() => setRetry((v) => v + 1)}
              >
                <RotateCw size={17} />
              </button>
            </>
          )}
          {current?.type === "application/pdf" && (
            <button
              aria-label="Reload PDF"
              onClick={() => setRetry((v) => v + 1)}
            >
              <RotateCw size={17} />
            </button>
          )}
        </div>
      </div>
      {!current?.url ? (
        <p role="status">Retrieving authorized document…</p>
      ) : current.type === "application/pdf" ? (
        <>
          <iframe
            title={label + " PDF preview"}
            src={current.url + "#toolbar=0"}
            className="document-pdf"
          />
          <p className="admin-muted">
            If your browser cannot render the PDF,{" "}
            <a href={current.url} target="_blank" rel="noopener noreferrer">
              open this authorized PDF preview
            </a>
            .
          </p>
        </>
      ) : (
        <div className="document-image-scroll">
          <Image
            src={current.url}
            unoptimized
            width={1400}
            height={1000}
            alt={label + " actual uploaded document"}
            style={{ width: `${zoom * 100}%` }}
            onError={() =>
              setResult({
                key,
                error:
                  "The uploaded image could not be rendered. Reload its secure access.",
              })
            }
          />
        </div>
      )}
    </div>
  );
}
export function DocumentsPanel({
  documents,
  kind,
  owner,
  initialDocumentId,
}: {
  documents: SubmittedDocument[];
  kind: "approval" | "driver";
  owner: string;
  initialDocumentId?: string;
}) {
  const [selected, setSelected] = useState(() =>
      Math.max(
        0,
        documents.findIndex((document) => document.id === initialDocumentId),
      ),
    ),
    [page, setPage] = useState<number | undefined>(),
    [large, setLarge] = useState(false);
  const document =
    documents[Math.min(selected, Math.max(0, documents.length - 1))];
  const selectedPage = page ?? document?.pages[0]?.pageNumber;
  const mediaPath = document
    ? `/api/documents/${kind}/${owner}/${document.id}${selectedPage ? `?page=${selectedPage}` : ""}`
    : "";
  return (
    <section className="review-card">
      <h2>
        Submitted documents{" "}
        <span className="count-badge">{documents.length}</span>
      </h2>
      {!documents.length ? (
        <div className="document-empty">
          <FileText />
          <p>No document records were returned for this profile.</p>
          <span className="admin-muted">
            An approval status does not prove that a stored file exists.
          </span>
        </div>
      ) : (
        <div className="documents-layout">
          <div
            className="document-selector"
            role="group"
            aria-label="Submitted documents"
          >
            {documents.map((doc, index) => (
              <button
                key={doc.id}
                className={index === selected ? "is-selected" : ""}
                onClick={() => {
                  setSelected(index);
                  setPage(undefined);
                }}
              >
                <FileText size={20} />
                <span>
                  <strong>{doc.label}</strong>
                  <small>{requestLabel(doc.status)}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="document-selected">
            <div className="document-metadata">
              <h3>{document.label}</h3>
              <span
                className="status-badge"
                data-status={document.status.toUpperCase()}
              >
                {requestLabel(document.status)}
              </span>
              {document.number && <p>Document number: {document.number}</p>}
              <p>
                Uploaded:{" "}
                {document.createdAt
                  ? requestTimestamp(document.createdAt)
                  : "Not provided"}
              </p>
              {document.reviewedAt && (
                <p>Reviewed: {requestTimestamp(document.reviewedAt)}</p>
              )}
              {document.expiresAt && (
                <p>Expiry: {requestTimestamp(document.expiresAt)}</p>
              )}
              {document.reason && (
                <p className="review-comment">
                  Reviewer comment: {document.reason}
                </p>
              )}
            </div>
            <div className="document-page-tabs">
              {document.pages.map((item) => (
                <button
                  key={item.pageNumber}
                  aria-pressed={selectedPage === item.pageNumber}
                  onClick={() => setPage(item.pageNumber)}
                >
                  {item.side === "FRONT"
                    ? "Front"
                    : item.side === "BACK"
                      ? "Back"
                      : `Page ${item.pageNumber}`}
                </button>
              ))}
              <button onClick={() => setLarge(true)}>View larger</button>
            </div>
            {!large && (
              <MediaPreview
                key={mediaPath}
                path={mediaPath}
                label={document.label}
              />
            )}
          </div>
        </div>
      )}
      <Modal
        isOpen={large && !!document}
        onClose={() => setLarge(false)}
        title={document?.label || "Document"}
        size="xl"
      >
        {large && document && (
          <MediaPreview path={mediaPath} label={document.label} />
        )}
      </Modal>
    </section>
  );
}
