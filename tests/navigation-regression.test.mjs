import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  MASTER_NAVIGATION_CONFIG,
  getGroupedNavItemsForRole,
} from "../src/config/navigation.ts";
test("all configured sidebar destinations are unique, rooted and keep finance routes distinct", () => {
  const permissions = MASTER_NAVIGATION_CONFIG.map(
    (row) => row.requiredPermission,
  ).filter(Boolean);
  for (const role of ["admin", "super-admin"]) {
    const items = getGroupedNavItemsForRole(role, permissions).flatMap(
      (group) => group.items,
    );
    assert.equal(new Set(items.map((row) => row.href)).size, items.length);
    assert(
      items.every(
        (row) =>
          row.href === "/" + role || row.href.startsWith("/" + role + "/"),
      ),
    );
    for (const name of [
      "finance",
      "refunds",
      "wallets",
      "transactions",
      "settlements",
    ])
      assert(items.some((row) => row.href === `/${role}/${name}`));
    assert(
      !items.some(
        (row) => /audit/i.test(row.title) || row.href.endsWith("/audit-logs"),
      ),
    );
  }
});
test("Admin ordinary navigation hides financial and governance shortcuts without granting permissions", () => {
  const items = getGroupedNavItemsForRole("admin", [
    "VIEW_DASHBOARD",
    "VIEW_USERS",
    "VIEW_DRIVERS",
    "VIEW_APPROVALS",
  ]).flatMap((group) => group.items);
  assert(
    !items.some((row) =>
      /finance|transactions|wallets|roles|admins/.test(row.href),
    ),
  );
  assert(items.some((row) => row.href === "/admin/drivers"));
});
test("the protected audit route remains while all ordinary navigation removes its shortcut", () => {
  assert(
    readFileSync(
      new URL("../src/app/super-admin/audit-logs/page.tsx", import.meta.url),
      "utf8",
    ).includes("audit-logs"),
  );
  assert(!MASTER_NAVIGATION_CONFIG.some((row) => row.path === "audit-logs"));
});
