"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import styles from "./auth.module.css";
export function AuthScreen({ superPortal }: { superPortal: boolean }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
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
      .catch(() => {});
  }, [router]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >;
    const problems: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email?.trim() || ""))
      problems.email = "Enter a valid email address.";
    if (!values.password) problems.password = "Enter your password.";
    setFields(problems);
    setError("");
    if (Object.keys(problems).length) {
      (
        form.elements.namedItem(Object.keys(problems)[0]) as HTMLInputElement
      )?.focus();
      return;
    }
    setBusy(true);
    try {
      const result = await adminApi<{ identity: { role: string } }>(
        "/auth/admin/login",
        "POST",
        { email: values.email.trim(), password: values.password },
      );
      router.replace(
        result.identity.role === "super_admin"
          ? "/super-admin/driver-requests"
          : "/admin/driver-requests",
      );
      router.refresh();
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const input = (
    name: string,
    label: string,
    type = "text",
    autocomplete = "",
  ) => (
    <div className={styles.field}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.inputWrap}>
        <input
          id={name}
          name={name}
          type={type === "password" && visible ? "text" : type}
          required
          autoComplete={autocomplete}
          disabled={busy}
          aria-invalid={!!fields[name]}
          aria-describedby={fields[name] ? `${name}-error` : undefined}
          inputMode={name === "email" ? "email" : undefined}
          maxLength={254}
        />
        {type === "password" && (
          <button
            type="button"
            className={styles.eye}
            aria-label={visible ? "Hide passwords" : "Show passwords"}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        )}
      </div>
      {fields[name] && (
        <span id={`${name}-error`} className={styles.fieldError}>
          {fields[name]}
        </span>
      )}
    </div>
  );
  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#auth-form">
        Skip to form
      </a>
      <aside className={styles.brand}>
        <Link href="/" className={styles.logo}>
          INFURNUS<span>OPERATIONS PORTAL</span>
        </Link>
        <div>
          <span className={styles.eyebrow}>CONTROL WITH CONFIDENCE</span>
          <h1>
            Every journey.
            <br />
            One clear view.
          </h1>
          <p>
            Your workspace for people, partners and operations. Built for the
            teams that keep INFURNUS moving.
          </p>
        </div>
        <div className={styles.trust}>
          <ShieldCheck size={22} />
          <span>
            Access is verified.
            <br />
            Permissions stay with your account.
          </span>
        </div>
      </aside>
      <section className={styles.content} aria-labelledby="form-title">
        <nav className={styles.portals} aria-label="Portal view">
          <Link
            aria-current={!superPortal ? "page" : undefined}
            href={`/login?portal=admin`}
          >
            Admin
          </Link>
          <Link
            aria-current={superPortal ? "page" : undefined}
            href={`/login?portal=super-admin`}
          >
            Super Admin
          </Link>
        </nav>
        <div className={styles.card}>
          <span className={styles.badge}>
            {superPortal ? "Super Admin" : "Admin"} portal
          </span>
          <h2 id="form-title">{"Welcome back"}</h2>
          <p className={styles.intro}>
            {
              "Sign in with your email and password to continue to your operations workspace."
            }
          </p>
          <form id="auth-form" noValidate onSubmit={submit} aria-busy={busy}>
            {input("email", "Work email", "email", "username")}
            {input("password", "Password", "password", "current-password")}
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <button className={styles.primary} disabled={busy} type="submit">
              {busy ? "Please wait…" : "Sign in"}
              <ArrowRight size={19} />
            </button>
          </form>
          <p className={styles.switch}>
            Need access? Contact your authorized administrator. Accounts and
            roles must be provisioned through the existing backend process.
          </p>
          <p className={styles.caption}>
            Your account determines your permissions. Choosing a portal does not
            change your access.
          </p>
        </div>
        <footer className={styles.footer}>
          INFURNUS · Administration & operations
        </footer>
      </section>
    </main>
  );
}
