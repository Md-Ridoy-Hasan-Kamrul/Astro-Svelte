# Deploy (Vercel)

This app uses `@astrojs/vercel` (server islands + `POST /api/feedback`).

## One-time setup (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** the GitHub repo.
3. Framework preset: **Astro** (auto-detected). Leave build as `npm run build`.
4. Deploy. You get a live URL (e.g. `https://astro-svelte-….vercel.app`).

Later pushes to `main` auto-deploy.

## Optional: GitHub Actions deploy

Repo secrets (Vercel dashboard → Settings → Tokens / Project settings):

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

CI job **Deploy (Vercel)** runs only on `main` when `VERCEL_TOKEN` is set.

## Local CLI

```bash
npx vercel login
npx vercel
npx vercel --prod
```

Never install the Vercel CLI globally if you follow this repo’s package rules — use `npx vercel`.
