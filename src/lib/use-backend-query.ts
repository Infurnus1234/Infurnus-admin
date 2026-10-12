"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, ApiError } from "./admin-api";

/** Discard superseded reads; never show an old page under a new filter. */
export function useBackendQuery<T>(path: string) {
  const router = useRouter();
  const [revision, setRevision] = useState(0);
  const key = path + "\n" + revision;
  const [result, setResult] = useState<{
    key: string;
    data: T | null;
    error: string;
  } | null>(null);
  useEffect(() => {
    let current = true;
    void adminApi<T>(path).then(
      (data) => {
        if (current) setResult({ key, data, error: "" });
      },
      (error) => {
        if (!current) return;
        if (error instanceof ApiError && error.status === 401)
          router.replace("/login");
        setResult({
          key,
          data: null,
          error: error instanceof Error ? error.message : "Records unavailable",
        });
      },
    );
    return () => {
      current = false;
    };
  }, [path, key, router]);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  return {
    data: result?.key === key ? result.data : null,
    error: result?.key === key ? result.error : "",
    busy: result?.key !== key,
    refresh,
  };
}
