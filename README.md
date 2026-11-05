# DuoMingo 🦩

**Languages for the thoroughly fed up.**

DuoMingo is an irreverent, installable language-learning PWA for the phrases textbooks leave out: everyday swearing, creative insults, sarcasm, pub survival and the delicate art of telling someone to leave you alone.

## Current courses

- 🇫🇷 French: everyday phrases, irritation, swearing, sarcasm, workplace diplomacy and after-work drinks.
- 🇬🇧 British English: foundational insults and weapons-grade verbal craftsmanship.
- 🇪🇸 Spanish: a starter pack of survival swearing and essential phrases.

Course content currently lives in `src/main.jsx`. Guest progress is stored locally; signed-in users can sync it to Neon.

## Stack

- React 18 + Vite
- PWA manifest and service worker
- Neon Postgres for progress
- Neon Auth (Managed Better Auth) for email/password accounts
- Vercel Functions for the authenticated progress API
- Vercel for hosting and automatic Git deployments

## Neon project

- Project: `DuoMingo`
- Region: `aws-eu-central-1`
- Project ID: `dry-sky-07190027`

Neon Auth is enabled on the main branch. Application tables are in `public`; authentication tables are managed by Neon in `neon_auth`. Schema reference: `db/schema.sql`.

## Environment variables

These are configured in the linked Vercel project for Production, Preview and Development:

| Variable | Where used | Purpose |
|---|---|---|
| `VITE_NEON_AUTH_URL` | Browser | Public Neon Auth endpoint |
| `DATABASE_URL` | Server only | Pooled Neon Postgres connection |
| `NEON_AUTH_JWKS_URL` | Server only | Verify signed auth tokens |
| `NEON_AUTH_ISSUER` | Server only | Expected JWT issuer |

The database URL is stored as a sensitive Vercel secret. Never commit it or expose it through a `VITE_` variable. For local development, copy `.env.example` to `.env.local` and supply the private `DATABASE_URL`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

The repository is linked to the Vercel project `duomingo`. Pushes to `main` trigger a Vercel deployment.

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- API: `/api/progress`

GitHub Pages remains configured as a static fallback. Its workflow sets `GITHUB_PAGES=true` so Vite uses the repository sub-path. Cloud account sync is available on the Vercel deployment where Neon environment variables are configured.

## PWA

The app includes a web manifest, installable flamingo icon artwork and a service worker for offline app-shell caching. Authenticated sync requests are never cached.

## Security

- Neon credentials stay in server-side Vercel environment variables.
- The progress API verifies the Neon Auth JWT signature and issuer.
- The API derives user ID from the verified token, never from client input.
- Progress payloads are bounded before writing.
- Guest progress remains local to the device.
