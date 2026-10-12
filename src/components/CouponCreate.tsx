"use client";
import { useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Modal } from "./ui/Modal";
import { couponDates } from "@/lib/coupon-dates";
export function CouponCreate({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    maxDiscountAmount: "",
    minFareAmount: "",
    usageLimit: "",
    perUserLimit: "",
    startsAt: "",
    expiresAt: "",
    isActive: false,
  });
  async function save() {
    setSaving(true);
    setError("");
    try {
      await adminApi("/admin/operations/coupons", "POST", {
        ...form,
        discountValue: Number(form.discountValue),
        maxDiscountAmount:
          form.discountType === "PERCENTAGE"
            ? Number(form.maxDiscountAmount)
            : null,
        minFareAmount: Number(form.minFareAmount),
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : null,
        ...couponDates(form.startsAt, form.expiresAt),
      });
      setOpen(false);
      setConfirm(false);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Creation failed");
      setConfirm(false);
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setConfirm(false);
          setError("");
        }}
      >
        Create promo code
      </button>
      <Modal
        isOpen={open}
        onClose={() => {
          if (!saving) setOpen(false);
        }}
        title={confirm ? "Confirm promo code" : "Create promo code"}
      >
        {confirm ? (
          <>
            <p>
              Create {form.code} with{" "}
              {form.discountType === "PERCENTAGE"
                ? `${form.discountValue}% discount`
                : `${form.discountValue} paise fixed discount`}
              ? Active: {form.isActive ? "Yes" : "No"}. Limits and dates will be
              validated and persisted by the backend.
            </p>
            <div className="operations-toolbar">
              <button disabled={saving} onClick={() => void save()}>
                {saving ? "Saving…" : "Confirm creation"}
              </button>
              <button disabled={saving} onClick={() => setConfirm(false)}>
                Back
              </button>
            </div>
          </>
        ) : (
          <form
            className="pricing-form"
            onSubmit={(e) => {
              e.preventDefault();
              try {
                couponDates(form.startsAt, form.expiresAt);
                setError("");
                setConfirm(true);
              } catch (failure) {
                setError(
                  failure instanceof Error
                    ? failure.message
                    : "Check the dates.",
                );
              }
            }}
          >
            <label>
              Code
              <input
                required
                maxLength={50}
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </label>
            <label>
              Discount type
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm({ ...form, discountType: e.target.value })
                }
              >
                <option>PERCENTAGE</option>
                <option>FIXED</option>
              </select>
            </label>
            {(
              [
                "discountValue",
                "maxDiscountAmount",
                "minFareAmount",
                "usageLimit",
                "perUserLimit",
              ] as const
            )
              .filter(
                (key) =>
                  key !== "maxDiscountAmount" ||
                  form.discountType === "PERCENTAGE",
              )
              .map((key) => (
                <label key={key}>
                  {
                    {
                      discountValue:
                        form.discountType === "PERCENTAGE"
                          ? "Discount (%)"
                          : "Fixed discount (integer paise)",
                      maxDiscountAmount: "Maximum discount (paise)",
                      minFareAmount: "Minimum fare (paise)",
                      usageLimit: "Total usage limit (blank = unlimited)",
                      perUserLimit: "Per-customer limit (blank = unlimited)",
                    }[key]
                  }
                  <input
                    type="number"
                    min={
                      key === "minFareAmount"
                        ? 0
                        : key === "discountValue" &&
                            form.discountType === "PERCENTAGE"
                          ? 0.01
                          : 1
                    }
                    step={
                      key === "discountValue" &&
                      form.discountType === "PERCENTAGE"
                        ? "0.01"
                        : "1"
                    }
                    max={
                      key === "discountValue" &&
                      form.discountType === "PERCENTAGE"
                        ? 100
                        : key === "discountValue"
                          ? 99999999
                          : ["minFareAmount", "maxDiscountAmount"].includes(key)
                            ? 9999999999
                            : 2147483647
                    }
                    required={!["usageLimit", "perUserLimit"].includes(key)}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </label>
              ))}
            <label>
              Starts (local time)
              <input
                required
                type="datetime-local"
                value={form.startsAt}
                onInput={(e) => {
                  const value = e.currentTarget.value;
                  setForm((current) => ({ ...current, startsAt: value }));
                }}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    startsAt: e.target.value,
                  }))
                }
              />
            </label>
            <label>
              Expires (local time, optional)
              <input
                type="datetime-local"
                min={form.startsAt}
                value={form.expiresAt}
                onInput={(e) => {
                  const value = e.currentTarget.value;
                  setForm((current) => ({ ...current, expiresAt: value }));
                }}
                onChange={(e) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />{" "}
              Activate
            </label>
            <button>Review creation</button>
          </form>
        )}
        {error && <p role="alert">{error}</p>}
      </Modal>
    </>
  );
}
