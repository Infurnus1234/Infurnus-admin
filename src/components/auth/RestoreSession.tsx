"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, ApiError } from "@/lib/admin-api";
export function RestoreSession() {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    let current = true;
    void adminApi<{ identity: { role: string } }>("/auth/refresh", "POST").then(
      (result) => {
        if (!current) return;
        if (!["admin", "super_admin"].includes(result?.identity?.role)) {
          router.replace("/login");
          return;
        }
        router.replace(
          result.identity.role === "super_admin"
            ? "/super-admin/driver-requests"
            : "/admin/driver-requests",
        );
        router.refresh();
      },
      (failure) => {
        if (!current) return;
        if (
          failure instanceof ApiError &&
          [401, 403].includes(failure.status)
        ) {
          router.replace("/login");
          return;
        }
        setError(
          "Your session could not be restored. Retry, or sign in again.",
        );
      },
    );
    return () => {
      current = false;
    };
  }, [attempt, router]);
  return (
    <main className="session-restore">
      <h1>Restoring your session</h1>
      {error ? (
        <>
          <p role="alert">{error}</p>
          <div className="operations-toolbar">
            <button
              onClick={() => {
                setError("");
                setAttempt((value) => value + 1);
              }}
            >
              Retry
            </button>
            <button onClick={() => router.replace("/login")}>
              Sign in again
            </button>
          </div>
        </>
      ) : (
        <p role="status">Checking your existing session securely…</p>
      )}
    </main>
  );
}
