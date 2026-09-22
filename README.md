# Astro Svelte

Learning project: **Astro** pages + **Svelte** islands, with Tailwind, Zustand, TanStack Query, and TypeScript.

---

## Developer profile (read this first)

> When this `README.md` is shared in chat, treat it as the source of truth for the owner’s level and requirements. Update this file whenever new prefs, goals, or rules are given.

### Level

| Area | Level | Notes |
| ---- | ----- | ----- |
| Overall | **Beginner → Intermediate** | Learning by following official docs |
| Astro | Beginner | Project structure, layouts, pages, `client:*` islands |
| Svelte 5 | Beginner | Components, runes, hydration in Astro |
| TypeScript | Beginner | Prefer typed props and simple types |
| Tailwind | Beginner | Utility classes OK; keep design readable |
| Zustand / TanStack | Beginner | Use only in **client islands** (`client:load`, etc.) |
| Testing | Beginner | Vitest (unit/component) + Playwright (E2E) |

### Language

- Owner often writes in **Bangla** (or Bangla + English mix).
- Replies can be **Bangla**, **English**, or mixed — keep explanations simple and step-by-step.
- Prefer short answers; show code when it helps.

### Requirements (must follow)

1. Follow **Astro production project structure**:
   `src/pages`, `src/layouts`, `src/components/{layout,sections,islands}`, `src/lib/{api,query,utils}`, `src/stores`, `src/styles`, `src/types`, `e2e/`.
2. Use the **docs pattern** for Svelte in Astro:
   ```astro
   import BuyButton from '../components/BuyButton.svelte';
   <BuyButton id={product.id} client:load />
   ```
3. Stack to use when relevant:
   - **Astro** — pages, layouts, static UI
   - **Svelte 5** — interactive islands
   - **Tailwind CSS v4** — styling (see `src/styles/global.css`)
   - **Zustand** — client state (`src/stores/`)
   - **TanStack Query** (`@tanstack/svelte-query`) — client data fetching
   - **Axios** (`src/lib/api/`) — HTTP client for all API calls (used inside Query `queryFn`)
   - **TypeScript** — typed stores, libs, and `lang="ts"` in Svelte
   - **Vitest** — unit tests + Astro Container API component tests (`src/**/*.test.ts`)
   - **Playwright** — full-page E2E only (`e2e/`)
   - **Icons8 Line Awesome** (`line-awesome`) — icon font; use `<i class="las la-home"></i>`
4. Do **not** put Zustand / TanStack Query in static-only Astro markup; hydrate islands first.
5. **Axios + Zustand + TanStack roles (must keep separate):**
   - **Axios** = HTTP only (`src/lib/api/axios.ts`)
   - **TanStack Query** = server state / cache (call Axios inside `queryFn` / `mutationFn`)
   - **Zustand** = client UI + HTTP status (`authToken`, `pendingRequests`, `lastError`) — never store API response payloads in Zustand
6. Keep the landing page structure clear: navbar, hero, sections, footer.
7. **Testing architecture mandate (Vite-native — non-negotiable):**
   - Legacy runners (Jest, etc.) are **out of scope**. This repo stays on the **Vite-native** stack only.
   - **Foundation stack:** Astro + Svelte + **Vitest** + **Playwright**.
   - **Vitest** = unit tests, store/API helpers, Astro Container API component HTML — fast ESM, TypeScript, shared Vite/Astro config.
   - **Playwright** = full-page / cross-browser E2E only. Do **not** force Vitest to run full-page E2E.
   - Prefer `pool: 'threads'`, isolate tests, `clearMocks` / reset store state; bound workers in CI when needed.
   - Scale path (when needed later): Vitest projects/workspaces, tighter thread-pool memory controls, true-browser component testing (Vitest Browser Mode), and careful Svelte hydration checks — without abandoning Playwright for E2E.
   - Goal: a robust, scalable Astro–Svelte quality gate for modern production apps.
8. Prefer official docs when unsure:
   - [Astro docs](https://docs.astro.build)
   - [Astro testing](https://docs.astro.build/en/guides/testing/)
   - [Astro + UI frameworks](https://docs.astro.build/en/guides/framework-components/)
   - [Svelte getting started](https://svelte.dev/docs/svelte/getting-started)
   - [TanStack Svelte Query](https://tanstack.com/query/latest/docs/framework/svelte/overview)
   - [Axios](https://axios-http.com/docs/intro)
   - [Vitest](https://vitest.dev/)
   - [Playwright](https://playwright.dev/)
9. **Package / CLI rules (always):**
   - **Never install packages globally** (`npm install -g …` ❌).
   - Prefer **project-local** deps in `package.json` (`npm install` / `npm install -D`).
   - Prefer **`npx`** for one-off CLIs when available (e.g. `npx astro add …`, `npx playwright …`, `npx vitest …`) instead of global binaries.
   - Scripts in `package.json` (`npm run …`) already use local binaries — prefer those in daily work.
   - Keep the project portable: another machine should work after `npm install` only.

### AI collaboration rules

- **README is the memory file.** If the owner shares new goals, level updates, features, or preferences, **add/update them in this README** (this section + Sections 5–6 when rules change), then implement.
- For full feature builds with Figma/TDD, use the prompt in [`docs/AI feature prompt.md`](docs/AI%20feature%20prompt.md) (reads Sections 5–6 + Svelte quality rules).
- Explain **why** briefly when teaching; don’t dump huge unrelated refactors.
- Match existing file style; don’t expand scope beyond what was asked.
- Dev server: prefer `astro dev --background` (see `AGENTS.md` / `CLAUDE.md`).
- When adding tools/CLIs: install locally and/or use **`npx`** — do not suggest global installs.

### Current goals

- [x] Basic landing page (navbar, hero, sections, footer)
- [x] Svelte islands with `client:load`
- [x] Tailwind + Zustand + TanStack Query + TypeScript wired
- [x] Testing setup: Vitest (unit/component) + Playwright (E2E)
- [x] Icons8 Line Awesome icons installed
- [x] Axios wired with Zustand + TanStack Query
- [x] Vite-native testing mandate documented (Vitest + Playwright only)
- [x] Production folder structure (`layout` / `sections` / `islands` / `lib/*`)
- [x] Loading / error / retry / cache UX in the stack demo (Query + Axios + Zustand)
- [x] Performance: client directives by priority, prefetch, `<Image>`, server island fallback
- [x] Route cache (`Astro.cache` + `cache.enabled`) and 5-minute API TTL cache
- [x] CI quality gate: Vitest and production build run in parallel
- [x] Toast notifications via `svelte-sonner` (Sonner for Svelte)
- [x] Engineering rules + Svelte code-quality docs for AI feature prompts
- [ ] (Add next goals here when the owner shares them)

---

## 1. Project structure

```text
/
├── public/
│   └── favicon.svg
├── docs/
│   ├── Rules for Svelte code quality.md   # Component / TDD / abstraction rules
│   └── AI feature prompt.md               # Copy-paste prompt for new features
├── src/
│   ├── components/
│   │   ├── layout/     # Navbar, Footer
│   │   ├── sections/   # Hero, Features, HowItWorks, LiveRepo, CallToAction
│   │   └── islands/    # Svelte client islands (StackDemo, StartButton, ToastHost, Navbar)
│   ├── layouts/        # Layout.astro
│   ├── lib/
│   │   ├── api/        # Axios client + API modules + TTL cache
│   │   ├── query/      # TanStack QueryClient + keys
│   │   └── utils/      # helpers (useZustandStore, …)
│   ├── pages/          # routes (index.astro)
│   ├── stores/         # Zustand (app + http)
│   ├── styles/         # global.css (+ Tailwind)
│   ├── types/          # shared TypeScript types
│   ├── middleware.ts   # Cache-Control for /_astro/* assets
│   └── env.d.ts
├── e2e/                # Playwright E2E specs
├── .github/workflows/  # CI: Vitest + build in parallel
├── astro.config.mjs
├── vitest.config.ts
├── playwright.config.ts
├── svelte.config.js
├── tsconfig.json
└── package.json
```

## 2. Stack

| Package | Role |
| ------- | ---- |
| `astro` | Framework / SSG |
| `@astrojs/svelte` + `svelte` | UI islands |
| `tailwindcss` + `@tailwindcss/vite` | Styling |
| `zustand` | Client state |
| `@tanstack/svelte-query` | Client server-state / fetching |
| `axios` | HTTP client (API layer) |
| `svelte-sonner` | Toast notifications (Sonner for Svelte; not React `sonner`) |
| `typescript` | Types |
| `vitest` | Unit + Astro component tests |
| `@playwright/test` | Full-page E2E |
| `line-awesome` | Icons8 icon font |

## 3. Data fetching (loading, error, cache, speed)

Roles stay split: **Axios** = HTTP, **TanStack Query** = server cache + UI flags, **Zustand** = client HTTP status (never API payloads).

| Need | What to use |
| ---- | ----------- |
| First load | Query `isPending` → loading UI |
| Background refresh | `isFetching` + cached `data` → keep old data, show “Updating” |
| Run failed, no cache | `isError` && no `data` → failed panel + **Try again** (`refetch`) |
| Run failed, cache exists | keep cached UI + error banner |
| Cache freshness | `staleTime` 60s (fresh), `gcTime` 5 min, **Refresh cache** (`invalidateQueries`) |
| HTTP spinner / last error | Zustand `pendingRequests` / `lastError` (Axios interceptors) |
| User feedback toasts | `svelte-sonner` (`toast.success` / `toast.error`) — not a data store |
| Super fast | skip extra network while fresh, no refetch on tab focus, abort stale requests (`signal`) |

Canceled Axios requests are not UI errors. 4xx is not retried; network / 5xx retries once.

## 4. Performance, caching, and CI

Follow official Astro APIs — not `console.log` dumps or extra Redis for this app.

| Practice | How this repo does it |
| -------- | --------------------- |
| Client JS | `Navbar` = `client:load` (above the fold). `StackDemo` = `client:visible`. `StartButton` = `client:idle`. |
| Server islands | `LiveRepo` uses `server:defer` + `slot="fallback"` so the static page can cache while live stats load. Needs the Node adapter. |
| Prefetch | `prefetch: { prefetchAll: true }` — hover/focus on **internal** pages (hash links and external docs are skipped). |
| Images | Hero uses `<Image>` from `astro:assets` (WebP, srcset, no layout shift). |
| Route cache | `cache.provider = memoryCache()`. Always wrap with `Astro.cache.enabled` before `set()` / `invalidate()`. Dev mode is never cached. |
| API cache | `fetchAstroRepoCached()` — 5-minute in-memory TTL (one Node process). Client cache stays in TanStack Query. |
| Asset cache | `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*` (middleware + `public/_headers`). |
| Errors | `Astro.logger.error()` on server-island fetch failure; Query **Try again** on the client; optional toast via `svelte-sonner`. |
| CI | GitHub Actions runs **Vitest** and **build** in parallel. `gate` job runs only if both pass. |

## 5. Engineering Rules

> AI and humans must follow these when adding features. Full component checklist: [`docs/Rules for Svelte code quality.md`](docs/Rules%20for%20Svelte%20code%20quality.md). Copy-paste prompt: [`docs/AI feature prompt.md`](docs/AI%20feature%20prompt.md).

1. **Stack lock:** Astro + Svelte 5 + Tailwind v4 + Zustand + TanStack Query + Axios + Vitest + Playwright + `svelte-sonner`. No React, no Jest, no React `sonner`.
2. **Folder lock:** Only use the structure in Section 1. New UI goes in `sections/` (static) or `islands/` (interactive). Routes only under `src/pages/`.
3. **`.astro` vs `.svelte`:** Static / server HTML → `.astro`. Click / fetch / client state / toast triggers → `.svelte` with the right `client:*` directive.
4. **Data roles stay separate:** Axios = HTTP; Query = server cache; Zustand = client status only (no API payloads); sonner = UX feedback only.
5. **Isolation:** Change only files required for the requested feature. Do not drive-by refactor unrelated code.
6. **TDD:** For new features, write Vitest tests first, then implement. Playwright only for full-page E2E in `e2e/`.
7. **Responsive:** Desktop, ~1020px, 768px, 425px, 375px, 320px must remain usable.
8. **Valid markup:** Every opened tag must close. Always `class="..."` with quotes for Tailwind.
9. **Packages:** Project-local installs only; prefer `npx` for one-off CLIs.
10. **README memory:** New owner prefs/goals → update this README (and Section 5–6 if rules change), then implement.

## 6. Code Quality Standards

1. **One level of abstraction per function** — orchestrate *or* do one concrete job; do not mix.
2. **No magic numbers** — name constants (`STALE_MS`, breakpoints helpers, timeouts).
3. **Svelte 5 runes** — `$props`, `$state`, `$derived`, `$effect` (cleanup on return). No React hooks.
4. **Typed props & TS** in islands, stores, and `lib/`.
5. **Tailwind** for styling; theme tokens in `src/styles/global.css` `@theme`.
6. **Loading / error / empty / success** when fetching data (Query flags + optional toast).
7. **Self-review required** after implementation: explicitly check abstraction levels and magic numbers; refactor before finishing.
8. **Tests must pass** (`npm test`; E2E when the feature is page-level).

### How to ask the AI for a new feature

1. Open [`docs/AI feature prompt.md`](docs/AI%20feature%20prompt.md).
2. Paste the prompt into chat.
3. Fill `[Insert Figma Link]` and `[Insert Page/Component Name]`.
4. The AI must read **this README Sections 5–6** + **`docs/Rules for Svelte code quality.md`** before coding.

## 7. Commands

| Command | Action |
| ------- | ------ |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server → `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview production build |
| `npm run test` | Run Vitest (unit/component) once |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:e2e` | Run Playwright E2E |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run astro ...` | Astro CLI |

CI (GitHub Actions): Vitest and `npm run build` run in parallel; the quality-gate job needs both.

## 8. Docs

- [Astro project structure](https://docs.astro.build/en/basics/project-structure/)
- [Astro framework components](https://docs.astro.build/en/guides/framework-components/)
- [Astro testing](https://docs.astro.build/en/guides/testing/)
- [Astro prefetch](https://docs.astro.build/en/guides/prefetch/)
- [Astro images](https://docs.astro.build/en/guides/images/)
- [Astro server islands](https://docs.astro.build/en/guides/server-islands/)
- [Astro route caching](https://docs.astro.build/en/guides/caching/)
- [Svelte docs](https://svelte.dev/docs/svelte/getting-started)
- [svelte-sonner](https://github.com/wobsoriano/svelte-sonner)
- Repo: [`docs/Rules for Svelte code quality.md`](docs/Rules%20for%20Svelte%20code%20quality.md)
- Repo: [`docs/AI feature prompt.md`](docs/AI%20feature%20prompt.md)

## 9. Troubleshooting

### Git: `cannot lock ref 'HEAD'` / `refs/heads/main: reference broken`

**Meaning:** local branch pointer file is corrupt (not a code bug).

**Fix (PowerShell, project root):**

```powershell
# 1) Confirm the error
git status

# 2) Remove broken main ref (+ lock files if present)
Remove-Item -Force .git\refs\heads\main -ErrorAction SilentlyContinue
Remove-Item -Force .git\refs\heads\main.lock -ErrorAction SilentlyContinue
Remove-Item -Force .git\HEAD.lock -ErrorAction SilentlyContinue

# 3) Check again
git status

# 4) Commit again from Cursor, or:
git add -A
git commit -m "your message"
```

**If there are already good commits** and only `main` is broken, recover from the last known commit:

```powershell
git reflog
# copy a good commit hash, then:
git update-ref refs/heads/main <good-commit-hash>
git status
```

**Avoid:** putting the project inside OneDrive sync of `.git`, force-closing during commit, editing `.git` files by hand.
