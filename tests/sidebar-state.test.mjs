import test from "node:test";
import assert from "node:assert/strict";
import {
  sidebarPreferenceKey,
  sidebarIsCollapsed,
  sidebarLayout,
} from "../src/lib/sidebar-state.ts";
test("desktop can hide and restore the sidebar without making content inert", () => {
  assert.deepEqual(sidebarLayout(false, false, false), {
    expanded: true,
    inertContent: false,
  });
  assert.deepEqual(sidebarLayout(false, false, true), {
    expanded: false,
    inertContent: false,
  });
  assert.deepEqual(sidebarLayout(false, true, false), {
    expanded: true,
    inertContent: false,
  });
});
test("mobile drawer defaults closed, traps content only while open and ignores desktop preference", () => {
  for (const collapsed of [false, true]) {
    assert.deepEqual(sidebarLayout(true, false, collapsed), {
      expanded: false,
      inertContent: false,
    });
    assert.deepEqual(sidebarLayout(true, true, collapsed), {
      expanded: true,
      inertContent: true,
    });
  }
});
test("collapsed preference survives storage roundtrip and is scoped per account and role", () => {
  assert.equal(sidebarIsCollapsed(String(true)), true);
  for (const value of [null, "false", "bad", "{}"])
    assert.equal(sidebarIsCollapsed(value), false);
  assert.notEqual(
    sidebarPreferenceKey("one", "admin"),
    sidebarPreferenceKey("two", "admin"),
  );
  assert.notEqual(
    sidebarPreferenceKey("one", "admin"),
    sidebarPreferenceKey("one", "super-admin"),
  );
});
