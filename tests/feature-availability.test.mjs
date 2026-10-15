import test from "node:test";
import assert from "node:assert/strict";
import { hasAdminBackend } from "../src/lib/feature-availability.ts";
import { getGroupedNavItemsForRole } from "../src/config/navigation.ts";

test("unsupported backend pages have no navigation or accessible fallback contract", () => {
  const unavailable = [
    "resources",
    "resource-scope",
    "security",
    "system-config",
    "features",
    "settings",
  ];
  for (const path of unavailable) {
    assert.equal(hasAdminBackend(path), false);
    assert.equal(hasAdminBackend(path + "/detail"), false);
  }
  const items = getGroupedNavItemsForRole("super-admin", []).flatMap(
    (group) => group.items,
  );
  assert(!items.some((item) => unavailable.includes(item.href.split("/")[2])));
  for (const path of [
    "admins",
    "roles",
    "drivers",
    "vehicles",
    "pricing",
    "finance",
    "reports",
    "map",
  ])
    assert.equal(hasAdminBackend(path), true);
  assert(items.some((item) => item.href === "/super-admin/admins"));
  assert(items.some((item) => item.href === "/super-admin/roles"));
});
