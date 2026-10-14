import { test } from "node:test";
import assert from "node:assert/strict";
import { canOpenPage, pagePermission } from "../src/lib/access-policy.ts";
import { allowedBackendPath } from "../src/lib/proxy-policy.ts";
import {profilePhotoDocument} from '../src/lib/profile-photo.ts';
test('native lowercase and catalog profile-photo fields identify the actual uploaded photo',()=>{
  const native={id:'native',documentType:'profile_photo'};
  const catalog={id:'catalog',documentType:'other',documentCode:'PROFILE_PHOTO'};
  assert.equal(profilePhotoDocument([{documentType:'driver_license'},native]),native);
  assert.equal(profilePhotoDocument([catalog]),catalog);
  assert.equal(profilePhotoDocument([{documentType:'driver_license'}]),undefined);
});
test("saved grants independently guard modules, details and direct URLs", () => {
  assert.equal(canOpenPage("admin", [], "/admin/users"), false);
  assert.equal(canOpenPage("admin", ["users.read"], "/admin/users"), true);
  assert.equal(
    canOpenPage("admin", ["users.read"], "/admin/users/record"),
    false,
  );
  assert.equal(
    canOpenPage("admin", ["users.read", "users.detail"], "/admin/users/record"),
    true,
  );
  assert.equal(canOpenPage("admin", ["users.read"], "/admin/admins"), false);
  assert.equal(
    canOpenPage("admin", ["users.read"], "/admin/users", true),
    false,
  );
  assert.equal(canOpenPage("super_admin", [], "/super-admin/admins"), true);
  assert.equal(pagePermission("/admin/pricing"), "pricing.read");
  assert.equal(pagePermission("/admin/finance"), "payments.read");
});
test("BFF permits exact reviewed admin management contracts", () => {
  assert.equal(allowedBackendPath("POST", "/admin/access/admins"), true);
  assert.equal(allowedBackendPath("GET", "/admin/access/me"), true);
  assert.equal(
    allowedBackendPath(
      "PATCH",
      "/admin/access/admins/550e8400-e29b-41d4-a716-446655440000/permissions",
    ),
    true,
  );
  assert.equal(
    allowedBackendPath(
      "DELETE",
      "/admin/access/admins/550e8400-e29b-41d4-a716-446655440000",
    ),
    false,
  );
});
