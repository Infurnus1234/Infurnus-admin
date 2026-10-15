"use client";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "./layout/PageHeader";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
type ManagedAdmin = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  updatedAt: string;
  permissions: string[];
};
type Inventory = {
  items: ManagedAdmin[];
  catalog: string[];
  page: number;
  pageSize: number;
  total: number;
};
export function AdminManagement({
  adminId,
  title = "Admin Management",
}: {
  adminId?: string;
  title?: string;
}) {
  const [page, setPage] = useState(1);
  const endpoint =
    "/admin/access/admins?" +
    new URLSearchParams({
      page: String(page),
      ...(adminId ? { adminId } : {}),
    });
  const [data, setData] = useState<Inventory | null>(null);
  const [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<ManagedAdmin | null>(null),
    [grants, setGrants] = useState<string[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const load = useCallback(async () => {
    try {
      setData(await adminApi<Inventory>(endpoint));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load admins");
    }
  }, [endpoint]);
  useEffect(() => {
    let active = true;
    void adminApi<Inventory>(endpoint)
      .then((result) => {
        if (active) {
          setData(result);
          if (adminId) {
            const target = result.items.find((item) => item.id === adminId);
            if (target) {
              setSelected(target);
              setGrants(target.permissions);
            } else setError("Admin record not found.");
          }
        }
      })
      .catch((e) => {
        if (active)
          setError(e instanceof Error ? e.message : "Unable to load admins");
      });
    return () => {
      active = false;
    };
  }, [endpoint, adminId]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (selected)
        await adminApi(
          `/admin/access/admins/${selected.id}/permissions`,
          "PATCH",
          { permissions: grants, expectedUpdatedAt: selected.updatedAt },
        );
      else
        await adminApi("/admin/access/admins", "POST", {
          ...form,
          permissions: grants,
        });
      setMessage(
        selected
          ? "Permissions saved. They apply to subsequent API requests."
          : "Admin created. The account can use the existing sign-in page.",
      );
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setSelected(null);
      setGrants([]);
      if (page !== 1) setPage(1);
      else await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }
  const groups = new Map<string, string[]>();
  async function changeStatus(admin: ManagedAdmin) {
    if (busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const status = admin.status === "active" ? "suspended" : "active";
      await adminApi(`/admin/access/admins/${admin.id}/status`, "PATCH", {
        status,
        expectedUpdatedAt: admin.updatedAt,
      });
      setSelected(null);
      setGrants([]);
      setMessage(
        status === "active"
          ? "Admin enabled. Access is restored; revoked refresh sessions remain revoked."
          : "Admin disabled. Protected access is blocked and refresh sessions are revoked.",
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status change failed");
    } finally {
      setBusy(false);
    }
  }
  for (const permission of data?.catalog || []) {
    const resource = permission.split(".")[0];
    groups.set(resource, [...(groups.get(resource) || []), permission]);
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description="Create Admin accounts and grant only the operations they need. Super Admin access is required."
      />
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      <Button disabled={busy} variant="outline" onClick={() => void load()}>
        Refresh accounts
      </Button>
      {!data && !error && <p role="status">Loading accounts…</p>}
      {data && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Permissions</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      {admin.firstName} {admin.lastName}
                    </td>
                    <td>{admin.email}</td>
                    <td>{admin.status}</td>
                    <td>{admin.permissions.length} granted</td>
                    <td>
                      <Button
                        disabled={busy}
                        variant="outline"
                        onClick={() => {
                          setSelected(admin);
                          setGrants(admin.permissions);
                          setForm({
                            firstName: "",
                            lastName: "",
                            email: "",
                            password: "",
                          });
                          setError("");
                          setMessage("");
                        }}
                      >
                        Configure permissions
                      </Button>
                      {["active", "suspended"].includes(admin.status) && (
                        <Button
                          disabled={busy}
                          variant="outline"
                          onClick={() => void changeStatus(admin)}
                        >
                          {admin.status === "active"
                            ? "Disable Admin"
                            : "Enable Admin"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.items.length === 0 && (
              <p>No Admin accounts were found on this page.</p>
            )}
          </div>
          <nav aria-label="Admin account pages">
            <span>
              Page {data.page} · {data.total} accounts
            </span>
            <Button
              disabled={busy || page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              disabled={busy || page * data.pageSize >= data.total}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </nav>
          <form onSubmit={submit} className="space-y-5 rounded-2xl border p-5">
            <h2 className="text-xl font-semibold">
              {selected ? `Permissions for ${selected.email}` : "Create Admin"}
            </h2>
            {!selected && (
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="First name"
                  required
                  maxLength={100}
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  disabled={busy}
                />
                <Input
                  label="Last name"
                  required
                  maxLength={100}
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  disabled={busy}
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  maxLength={320}
                  autoComplete="off"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={busy}
                />
                <Input
                  label="Password (8–128 characters)"
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  disabled={busy}
                />
              </div>
            )}
            <p>
              Unselected operations are denied. Detail and mutation permissions
              also require their module’s read permission. Private documents and
              contact information are separate grants. Unsupported delete or
              financial execution operations cannot be granted.
            </p>
            <fieldset disabled={busy}>
              <legend className="font-semibold">Granted permissions</legend>
              <div className="grid gap-4 md:grid-cols-3">
                {[...groups].map(([resource, keys]) => (
                  <fieldset key={resource} className="rounded-xl border p-3">
                    <legend className="capitalize">{resource}</legend>
                    {keys.map((key) => (
                      <label key={key} className="block py-1">
                        <input
                          type="checkbox"
                          checked={grants.includes(key)}
                          onChange={(e) =>
                            setGrants((current) =>
                              e.target.checked
                                ? [...current, key]
                                : current.filter((value) => value !== key),
                            )
                          }
                        />{" "}
                        {key.split(".")[1].replaceAll("_", " ")}
                      </label>
                    ))}
                  </fieldset>
                ))}
              </div>
            </fieldset>
            <Button type="submit" disabled={busy}>
              {busy
                ? "Saving…"
                : selected
                  ? "Save permissions"
                  : "Create Admin"}
            </Button>
            {selected && (
              <Button
                disabled={busy}
                type="button"
                variant="outline"
                onClick={() => {
                  setSelected(null);
                  setGrants([]);
                  setError("");
                }}
              >
                Cancel
              </Button>
            )}
          </form>
        </>
      )}
    </div>
  );
}
