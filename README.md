# INFURNUS Admin frontend

Next.js App Router operations console for Super Admin and permission-limited Admin accounts. Existing visual design is retained. Supported modules use the authenticated same-origin BFF and actual backend records; unsupported capabilities are explicitly unavailable. Historical demo component/data files are preserved but are not substitutes for live responses.

## Development and checks

Use Node.js 22 and the committed npm lockfile:

```sh
npm ci
cp .env.example .env.local
npm run dev
npm test
npm run lint
npx tsc --noEmit
npm run build
```

PowerShell: `Copy-Item .env.example .env.local`. Keep local files ignored. The two real-session tests additionally require `ADMIN_INTEGRATION_URL` pointing to an owned disposable localhost environment with the documented test personas; do not point them at production.

## Backend and session configuration

The existing backend origin is `https://infurnus-api-675633214574.asia-south2.run.app`. Set `BACKEND_API_URL` to the approved backend origin for the server BFF. Its fallback is `NEXT_PUBLIC_API_URL`, then the existing hosted origin. Do not add `/api` to this origin: actual routes include `/admin`, `/auth`, `/vehicles`, `/maps` and `/provider-approvals`.

Set `ADMIN_APP_ORIGIN` to the exact frontend origin (currently `https://infurnus-admin.vercel.app` for the hosted site) so mutations enforce same-origin access. Access/refresh/CSRF credentials stay HttpOnly. The BFF validates the account with `/admin/access/me`, handles backend refresh cookies and preserves real HTTP errors; it never replaces rejected requests with sample success.

Only use `AUTH_REFRESH_COOKIE_NAME` / `AUTH_CSRF_COOKIE_NAME` if the backend uses non-default cookie names. Never put backend JWT/database/storage/Maps secrets in public variables.

## Admin Management and authorization

Super Admin uses `/super-admin/admins` to create an Admin with names, email and an 8–128 character password matching the existing backend policy, and configure explicit grants. New accounts default to no grants. The backend uses existing Argon2 hashing and migration 038's existing role/permission/assignment tables; no new schema migration is introduced.

Permissions distinguish module reads, details, supported mutations, review decisions, private documents and sensitive contact data. Backend enforcement runs before application routers and reads current database grants for every administrative request. Browser navigation and controls use the same saved grants; hiding a button is not the authorization boundary. The management API cannot create Super Admins or let Admins elevate themselves. Updates use an exact database version and reject stale edits. Existing shared roles are not silently altered.

Assigned resource/geographic scopes currently lack authoritative query filtering. Such Admins fail closed for protected operations rather than gaining global access. Unsupported scope/settings/security administration and financial execution are not represented as completed capabilities.

## Media and fleet map

Driver detail headers select the actual native `profile_photo` or catalog `PROFILE_PHOTO` document and use the authorized document proxy, not public storage URLs. The proxy validates trusted HTTPS storage, MIME signatures, file limits and private access. Local storage adapters are permitted only in development; local adapter tests do not prove hosted Cloudinary delivery.

Set `NEXT_PUBLIC_MAPS_API_KEY` to the dedicated browser Maps JavaScript credential with exact approved website/API restrictions; this key is public by design. Never reuse the backend Maps key. Its value is embedded at build time. Existing key restrictions must be reviewed for the actual hosted origin before release.

The dashboard opens `/{role}/map`. The full-page map polls the existing fleet read API every 15 seconds and displays only valid coordinates marked fresh by the database (30-second snapshot freshness). It reads up to 100 authorized records per page and provides pagination. Driver location ingestion and backend road geometry remain authoritative; no random locations or frontend fares are generated. Missing locations/configuration produce explicit states.

## Coordinated release

Import this repository root into Vercel using the Next.js preset, Node 22.x, `npm ci`, `npm run build` and the framework's default output. Next handles direct App Router navigation; do not add an SPA catch-all rewrite or static export.

This frontend requires the matching Admin-access backend release. Deploying it against an older backend without `/admin/access/me` prevents sign-in. Before enabling default-deny access, Super Admin must explicitly configure existing Admin grants; no broad automatic grants are seeded. Obtain approval for production release, any credential/CORS changes or migrations before executing them. Preserve the existing Cloud Run service, Cloud SQL database, storage and pricing records.

See [the integration/release report](docs/MASTER_ADMIN_INTEGRATION.md). The older [hosting audit](docs/hosting-audit.md) describes the original October 10 mock baseline and is historical, not the current architecture.
