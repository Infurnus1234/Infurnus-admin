# Hosting audit (10 October 2026)

Repository: Infurnus1234/Infurnus-admin. Baseline: main at 4b35967.

## Existing implementation

Next.js 16.3.7 App Router, React 19.2.8, TypeScript, Tailwind 4 and npm package-lock.json. Existing build/start/lint scripts. Default Next configuration; no Vercel configuration or environment convention. Root directory is the repository root.

The UI includes admin and super-admin dashboards, users, drivers, driver requests, vehicles, partners, fleets, approvals, coupons, notifications, reports, support, security, audit logs, roles and resource scopes, with detail drawers and local state actions. Some routes are module placeholders. Data comes from src/lib/*Data.ts and mockData.ts. No fetch/axios requests, API client, upload transport, token storage, refresh, login or signup routes were found. Topbar logout only logs to the console. permissionUtil.ts uses MOCK_LOGGED_IN_ADMIN; layouts wrap AppShell without authentication. These are mock UI permissions, not production authorization.

## Configuration and changes needed

Add one public API base URL configuration with the supplied Cloud Run origin and no /api prefix, a safe .env.example, explicit Vercel build settings, and deployment instructions. Preserve UI and mock behavior; setting an API URL does not turn mock modules into live integrations. No login/signup pages or new authentication flow are in scope. No localhost references exist in src or next.config.ts. Next App Router handles nested routes; no SPA catch-all rewrite or static export is appropriate. Google fonts are fetched at build time and require network access.

## Backend verification before changes

GET /health: 200, status ok. GET /health/ready: 200, database connected. GET /admin/users, /admin/dashboard, /admin/vehicle-types, /admin/drivers, /admin/partners, /admin/vehicles and /auth/sessions: 401 AUTHENTICATION_REQUIRED without credentials. This confirms reachable authentication middleware, not successful authorized API contracts. GET /auth/me: 404; do not invent this route or use the mock security log's /api/v1/auth/super-admin/login as a contract.

Paths were cross-checked read-only against the adjacent local Infurnus-new backend source; its version is not proof of the deployed revision. It mounts /admin and /auth directly. CORS uses an exact CORS_ORIGIN allowlist and CORS_CREDENTIALS. The reserved https://example.com test origin received no Access-Control-Allow-Origin. No actual Vercel origin exists yet, so its CORS acceptance cannot be tested.

## External requirements and limits

Vercel project access, an assigned deployment origin, backend-owner authorization for any production CORS change, and valid admin credentials are required for deployed browser and authorized API verification. Preserve existing CORS origins; add the exact assigned origin only with authorization. Determine cookie, CSRF and Authorization requirements from the real backend contracts before future integration. No backend or database changes are needed for this configuration work.

The baseline npm ci installed 439 packages and reported 7 high-severity dependency findings. Build, lint and TypeScript results will be recorded after validation. No automated test script is present.

## Changes prepared

- src/lib/api.ts: centralized public API origin and exact path joining; hosted default, explicit environment override, no implicit localhost or /api prefix. No module makes requests yet.
- .env.example and .gitignore: public URL template, while credential-bearing .env files stay ignored.
- vercel.json: Next.js preset, npm ci install and npm run build; no output/routing override.
- README.md: repository-root deployment settings, build-time variables, CORS approval steps and mock UI limitations.
- package.json and package-lock.json: Next.js and matching eslint-config-next 16.3.7 -> 16.3.8; compatible source-map-js 1.2.1 -> 1.2.2. Addresses the reported Next.js and source-map security findings without a framework minor/major migration. Baseline records above describe the original version.
- docs/hosting-audit.md: audit and actual validation evidence.

## Validation evidence

Initial npm ci succeeded. Baseline and first configured production builds succeeded, generating 24 static pages plus dynamic routes. API configuration assertions passed for the hosted origin, trailing-slash normalization, exact /admin/users?limit=10 path, explicit environment override, default origin and rejection of relative/protocol-relative paths. This exercises URL configuration, not authorized backend integration.

Source search found no localhost network URL, fetch or axios integration. The one 127.0.0.1 occurrence in driverData.ts is a mock audit-record IP address, not a service dependency. .env.local and .env.production remain ignored; .env.example is explicitly allowed. No existing screen, data module or authentication behavior was edited.

Final patched build with NEXT_PUBLIC_API_URL set to the supplied origin: PASS (Next.js 16.3.8; 24 static pages and existing dynamic routes). Standalone npx tsc --noEmit: PASS. npx eslint src/lib/api.ts: PASS. Full npm run lint: FAIL with 12 errors and 133 warnings; the full report is identical to baseline. Existing errors are unescaped JSX quotes and explicit any types. No lint suppression was added.

Final dependency audit: 5 high findings in @next/eslint-plugin-next, eslint-config-next, fast-glob, micromatch and braces. The suggested automatic fix downgrades eslint-config-next to 14.2.35 and is marked semver-major, so it was not applied to this Next.js 16 project. The reported Next.js and source-map-js findings were removed. Remaining findings require a compatible lint tooling follow-up.

Production server HTTP checks: two separate GET requests each to /, /admin, /super-admin/users, /super-admin/drivers/DRV-1001 and /admin/reports all returned 200. /unknown-role/reports returned 404. This verifies direct server routing and repeated navigation; it is not a browser interaction, authenticated permission or Vercel deployment test.

No existing automated tests are configured. No admin credentials were used; authorized data retrieval, writes, uploads, token refresh and end-to-end admin operation remain unverified. No Vercel domain has been assigned or deployed in this task. No backend setting, deployment, business logic or schema was changed.

## GitHub and deployment handoff

Dedicated branch: chore/admin-production-hosting, targeting main. GitHub reports push permission; effective branch rules query returned no rules. Leave a ready-to-review pull request because full lint and dependency checks still have documented baseline failures. Do not merge merely because a build passes.

Remaining deployment steps: review the PR and known limitations; import the repository in Vercel using the README settings; set the public API URL and Node 22.x; deploy and obtain its real origin; obtain approval for necessary backend CORS allowlist changes; verify that actual origin and authorized APIs. Current UI remains a mock demonstration until real integrations are implemented separately. No login/signup or new authentication flow was added.
