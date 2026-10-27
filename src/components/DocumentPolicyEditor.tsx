"use client";
import { useState, type FormEvent } from "react";
import { adminApi } from "@/lib/admin-api";
import { useBackendQuery } from "@/lib/use-backend-query";
export function DocumentPolicyEditor() {
  const { data, busy, error, refresh } = useBackendQuery<
    Record<string, unknown>[]
  >("/provider-approvals/document-policies");
  const [notice, setNotice] = useState(""),
    [saving, setSaving] = useState(false);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setSaving(true);
    setNotice("");
    try {
      await adminApi("/provider-approvals/document-policies", "PUT", {
        providerRole: f.get("providerRole"),
        category: f.get("category"),
        documentCode: f.get("documentCode"),
        required: f.has("required"),
        requiresExpiry: f.has("requiresExpiry"),
        minimumPages: Number(f.get("minimumPages")),
        active: f.has("active"),
        onboardingDeferrable: f.has("onboardingDeferrable"),
        requiredLicenceClasses: [
          ...new Set(
            String(f.get("classes") ?? "")
              .toUpperCase()
              .split(/[,;\s]+/)
              .filter(Boolean),
          ),
        ],
      });
      setNotice(
        "Policy saved. Existing records must still pass independent review.",
      );
      refresh();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Policy could not be saved");
    } finally {
      setSaving(false);
    }
  }
  return (
    <section className="workspace-section">
      <article className="review-card">
        <h1>Operator document policies</h1>
        <p>
          Global policy for the selected role/category, not an individual Fleet
          Owner. Configure only approved requirements. No document is a
          universal requirement merely because it is supported here. Aadhaar
          collection remains subject to the separate authorized consent/masking
          configuration.
        </p>
        <form onSubmit={save} className="review-fields">
          <label>
            Provider role
            <select name="providerRole">
              <option value="fleet_owner">Fleet Owner</option>
              <option value="driver">Driver</option>
              <option value="driver_fleet_owner">Driver and Fleet Owner</option>
            </select>
          </label>
          <label>
            Existing vehicle category code, or *
            <input name="category" defaultValue="*" maxLength={50} required />
          </label>
          <label>
            Existing document code
            <input
              name="documentCode"
              defaultValue="pan"
              pattern="[a-z][a-z0-9_]*"
              maxLength={50}
              required
            />
          </label>
          <label>
            Minimum pages
            <input
              name="minimumPages"
              type="number"
              min="1"
              max="5"
              defaultValue="1"
              required
            />
          </label>
          <label>
            Accepted licence classes, comma separated
            <input
              name="classes"
              maxLength={600}
              placeholder="Only for driver_license policies"
            />
          </label>
          <label>
            <input name="required" type="checkbox" />
            Required by approved policy
          </label>
          <label>
            <input name="requiresExpiry" type="checkbox" />
            Expiry required
          </label>
          <label>
            <input name="onboardingDeferrable" type="checkbox" defaultChecked />
            May defer optional setup (driving licence cannot be deferred)
          </label>
          <label>
            <input name="active" type="checkbox" defaultChecked />
            Active
          </label>
          <button disabled={saving}>
            {saving ? "Saving…" : "Save global policy"}
          </button>
        </form>
        <p>
          Licence class matching uses independently approved Driver licence
          metadata and is enforced during assignment and dispatch. Blank classes
          configure no additional class restriction; this screen does not query
          a government licence database.
        </p>
        {notice && <p role="status">{notice}</p>}
        {error && <p role="alert">{error}</p>}
      </article>
      <article className="review-card">
        <h2>Current configured policies</h2>
        {busy ? (
          <p>Loading policies…</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Category</th>
                  <th>Document</th>
                  <th>Required</th>
                  <th>Expiry</th>
                  <th>Pages</th>
                  <th>Classes</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((row) => (
                  <tr key={String(row.id)}>
                    {[
                      "provider_role",
                      "vehicle_category",
                      "document_code",
                      "required",
                      "requires_expiry",
                      "minimum_pages",
                      "required_licence_classes",
                      "active",
                    ].map((k) => (
                      <td key={k}>
                        {Array.isArray(row[k])
                          ? (row[k] as string[]).join(", ")
                          : String(row[k] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
