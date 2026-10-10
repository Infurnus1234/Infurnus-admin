"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-api";

export default function Login() {
  const router = useRouter();
  const [challengeId, setChallenge] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void adminApi<{ identity: { role: string } }>("/auth/refresh", "POST")
      .then((result) => {
        router.replace(
          result.identity.role === "super_admin"
            ? "/super-admin/driver-requests"
            : "/admin/driver-requests",
        );
        router.refresh();
      })
      .catch(() => {
        /* An absent/expired refresh session leaves the login form available. */
      });
  }, [router]);
  async function submit(form: FormData) {
    setBusy(true);
    setError("");
    try {
      if (!challengeId) {
        const result = await adminApi<{ challengeId: string }>(
          "/auth/login",
          "POST",
          { email: form.get("email"), password: form.get("password") },
        );
        setChallenge(result.challengeId);
      } else {
        const result = await adminApi<{ identity: { role: string } }>(
          "/auth/login/verify",
          "POST",
          { challengeId, otp: form.get("otp") },
        );
        router.replace(
          result.identity.role === "super_admin"
            ? "/super-admin/driver-requests"
            : "/admin/driver-requests",
        );
        router.refresh();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="max-w-md mx-auto p-8 space-y-4">
      <h1>Administrator sign in</h1>
      <form action={submit} className="space-y-4">
        {challengeId ? (
          <label>
            Verification code
            <input
              name="otp"
              inputMode="numeric"
              pattern="[0-9]{6}"
              required
              autoComplete="one-time-code"
            />
          </label>
        ) : (
          <>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </label>
          </>
        )}
        <button disabled={busy}>
          {busy ? "Please wait…" : challengeId ? "Verify" : "Sign in"}
        </button>
      </form>
      {challengeId && (
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await adminApi("/auth/login/resend", "POST", { challengeId });
              setError("Code resent");
            } catch (error) {
              setError(
                error instanceof Error ? error.message : "Resend failed",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          Resend code
        </button>
      )}
      <p role="alert">{error}</p>
    </main>
  );
}
