# Infurnus Admin frontend

Next.js App Router admin and super-admin UI. Read [the hosting audit](docs/hosting-audit.md) before deployment: existing modules use mock data and local state. No login/signup flow or backend API integration is implemented. This configuration preserves that behavior.

## Local development

Use Node.js 22 and npm with the committed package-lock.json:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

PowerShell: `Copy-Item .env.example .env.local`. Override the public URL in the ignored .env.local only if using a separate development backend. The supplied Cloud Run origin is the default; there is no implicit localhost fallback.

## API configuration

`src/lib/api.ts` exports `API_BASE_URL` and `apiUrl(path)` for future integrations. It reads `process.env.NEXT_PUBLIC_API_URL` directly, trims trailing slashes, and uses the supplied hosted origin when unset. Paths include their leading slash, for example `/admin/users`; no `/api` prefix is added. Existing modules make no API requests, so no calls or contracts were changed. This configuration alone does not connect their mock data to production.

Only the backend origin is public. Never put credentials or backend secrets in NEXT_PUBLIC variables. Next.js freezes public variables during the build; changing them requires a rebuild.

## Vercel settings

Import Infurnus1234/Infurnus-admin from GitHub. Set:

| Setting | Value |
| --- | --- |
| Root directory | Repository root (`.`), containing package.json |
| Framework | Next.js |
| Node.js | 22.x |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | Framework default (`.next`); leave dashboard override disabled |
| Production branch | `main` after reviewed merge |
| Environment | `NEXT_PUBLIC_API_URL=https://infurnus-api-675633214574.asia-south2.run.app` |

Set the variable for Production and deliberately choose the appropriate backend for Preview/Development. Preview UI currently remains mocked. vercel.json specifies the framework and commands. Next handles App Router routes directly; do not add a catch-all SPA rewrite, export to `out`, or proxy arbitrary API paths. Builds fetch Fraunces/Nunito from Google via next/font and need network access.

## Before operational use

Obtain the actual assigned Vercel origin, then request backend-owner approval to add that exact origin to CORS_ORIGIN while preserving existing entries. Do not invent a domain or allow every vercel.app subdomain. The local backend source uses an exact allowlist; the deployed configuration must be verified independently. Cookie-based requests may require CORS_CREDENTIALS, credentials: include, CSRF headers and appropriate secure cookie attributes. Confirm the real contract before implementing any request handling.

Existing mock permissions and the console-only logout are not access controls. Keep a demonstration deployment restricted using Vercel access controls where available. Real backend integration and authenticated authorization need separate implementation; this task intentionally adds no login/signup pages.

After deployment, verify direct navigation and refresh at `/admin`, `/super-admin/users`, a real detail route and `/admin/reports`; verify the actual origin's preflight and authorized API responses with approved admin credentials. No deployed frontend or end-to-end admin success is claimed here.

## Checks

```sh
npm run build
npx tsc --noEmit
npm run lint
```

No automated test script exists. See the audit for actual results and remaining limitations.

References: [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables), [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).
