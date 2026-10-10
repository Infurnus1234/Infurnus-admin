import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adminApi, ApiError } from '../src/lib/admin-api.ts';
import { reviewPayload, statusLabel } from '../src/lib/request-models.ts';
import { allowedBackendPath, sameOriginMutation } from '../src/lib/proxy-policy.ts';

test('API attaches same-origin credentials and maps server envelopes', async () => {
  globalThis.fetch = async (url, options) => { assert.equal(url, '/api/backend/provider-approvals'); assert.equal(options.credentials, 'same-origin'); assert.equal(options.cache, 'no-store'); return Response.json({success:true,data:[{id:'real-id',status:'PENDING'}]}); };
  assert.equal((await adminApi('/provider-approvals'))[0].id, 'real-id');
});
for (const status of [401,403,409,400,502]) test(`API preserves ${status} rejection without fake success`, async () => {
  globalThis.fetch = async () => Response.json({success:false,error:{message:'Rejected by backend'}},{status});
  await assert.rejects(adminApi('/provider-approvals'), error => error instanceof ApiError && error.status === status);
});
test('network failures are propagated and do not poison later requests', async () => {
  globalThis.fetch = async () => { throw new Error('network unavailable'); };
  await assert.rejects(adminApi('/provider-approvals'), /network unavailable/);
  globalThis.fetch = async () => Response.json({success:true,data:[]});
  assert.deepEqual(await adminApi('/provider-approvals'), []);
});
test('review preserves exact offset microseconds and distinguishes rejection reason', () => {
  const detail = {target:{updated_at:'2026-10-11T01:02:03.123456+00:00'}};
  assert.equal(reviewPayload(detail,'APPROVED','').expectedUpdatedAt, detail.target.updated_at);
  assert.throws(() => reviewPayload(detail,'REJECTED',' '), /reason/);
  assert.equal(reviewPayload(detail,'REJECTED',' justified ').reason, 'justified');
  assert.equal(statusLabel('CHANGES_REQUESTED'),'changes requested');
});
test('proxy refuses arbitrary and super-admin privileged routes', () => {
  assert.equal(allowedBackendPath('GET','/provider-approvals'),true);
  assert.equal(allowedBackendPath('POST','/admin/admins'),false);
  assert.equal(allowedBackendPath('GET','//attacker.invalid'),false);
  assert.equal(allowedBackendPath('DELETE','/admin/users/anything'),false);
});
test('same-origin mutations reject absent and foreign origins', () => {
  assert.equal(sameOriginMutation('POST',null,'https://admin.example'),false);
  assert.equal(sameOriginMutation('POST','https://foreign.example','https://admin.example'),false);
  assert.equal(sameOriginMutation('POST','https://admin.example','https://admin.example'),true);
});
