# AGENTS.md

## Project Overview

Personal blog site built on **Docusaurus v3.7** (React/TypeScript). Chinese-language content, deployed to Vercel.

## Essential Commands

```bash
pnpm install --no-frozen-lockfile   # install deps (lockfile is not strict)
pnpm start                          # dev server
pnpm build                          # production build (must succeed before deploying)
pnpm serve                          # preview production build locally
pnpm clear                          # wipe .docusaurus cache and changelog/
```

- **Package manager is pnpm**, not npm (README mentions npm but that is outdated).
- **Node >= 20** required.
- No test runner configured. No typecheck command in scripts — run `npx tsc --noEmit` manually if needed.
- `pnpm lint` exits 0 (linting is effectively disabled locally; CI runs `eslint.config.mjs` separately).

## Build & Deploy

- Vercel deploys from `package.json` using `@vercel/static-build`.
- Vercel build command explicitly sets `CI=false DISABLE_ESLINT_PLUGIN=true SKIP_PREFLIGHT_CHECK=true`.
- Git LFS is used (CI runs `git lfs checkout`).

## Architecture

### Key Directories

| Path | Purpose |
|---|---|
| `blog/` | Blog posts organized by category subdirectories (`ai/`, `develop/`, `program/`, `project/`, `lifestyle/`, `trade/`, etc.) |
| `data/` | Structured site data: `social.ts`, `friends.tsx`, `projects.tsx`, `collections.ts`, `features.tsx`, `skills.tsx`, `navbar.ts` |
| `docs/` | Docusaurus docs (sidebar defined in `sidebars.ts`) |
| `src/pages/` | Custom pages: `index.tsx`, `about.tsx`, `private.tsx`, `admin.tsx`, `project/`, `friends/`, `blog/` |
| `src/components/` | UI components including `magicui/`, `ui/` (shadcn-style), blog-specific components |
| `src/theme/` | Docusaurus theme swizzles (28 overrides: BlogPostPage, Layout, Navbar, Footer, CodeBlock, etc.) |
| `src/plugin/` | Custom Docusaurus plugins |
| `src/hooks/` | Custom React hooks (`useReadPercent`, `useViewType`, `useWindowSize`) |
| `src/css/` | Custom stylesheets (`custom.css`, `custom-blog.css`) |
| `api/` | Vercel serverless functions (`comments.js`, `posts.js`, `geo.js`, `weather.js`, `telegram-notify.js`, `location.js`) |
| `static/js/` | Client-side scripts (e.g. `disable-webpack-overlay.js`, `telegram-notify.js`) |

### Critical: Custom Blog Plugin

The blog content plugin is **forked** at `./src/plugin/plugin-content-blog` — not the standard `@docusaurus/plugin-content-blog`. This allows global blog data access. Do not replace it with the standard plugin.

## Styling Conventions

- **TailwindCSS** with `preflight: false` — never set to `true` or it breaks Docusaurus styles.
- Dark mode toggles via `data-theme="dark"` attribute on `<html>`, not `prefers-color-scheme` media query.
- Colors reference CSS custom properties (`var(--ifm-*)`, `var(--content-background)`, etc.) for theme compatibility.
- Primary brand color: `#12AFFA`.
- Font stack: Inter → Noto Sans SC for body; JetBrains Mono for code; MiSans as `.font-misans`.

## Path Aliases

`jsconfig.json` defines `@site/*` → `./*`. Use `@site/` imports for cross-module references.

## TypeScript Config

Strict mode enabled but `noImplicitAny: false` and `noUnusedLocals: false`. `src/sw.js` is excluded from TS checking.

## ESLint

Two config files exist:
- `eslint.config.mjs` — **the active one** (flat config format with stylistic, react, tailwindcss, typescript-eslint).
- `eslint.config.js` — legacy, nearly all rules disabled, ignorePatterns covers `src/**`. Do not use.

## `.npmrc` Settings

```
shamefully-hoist=true
strict-peer-dependencies=false
legacy-peer-deps=true
```

Required for dependency resolution with Docusaurus + TailwindCSS + other client packages.

## Content Authoring

- Blog front matter: `title`, `date`, `tags`, `authors` (keyed by `blog/authors.yml`), `description`, `slug`, `image`, `readingTime`, etc.
- Math support: `remark-math` + `rehype-katex` (use `$$...$$` for block, `$...$` for inline).
- Mermaid diagrams: enabled via `@docusaurus/theme-mermaid`.
- Image zoom: `docusaurus-plugin-image-zoom` applied to `.markdown :not(em) > img`.
- Ideal image plugin: `@docusaurus/plugin-ideal-image` — use `<Img>` component for optimized images.

## Comment System

Uses a custom **minimal comment system** (not Giscus/Waline). No login required — just a textarea + submit button, with optional nickname field (defaults to "匿名").

- **Frontend**: `src/components/Comment/index.tsx` — React component with input form + comment list
- **Backend**: `api/comments.js` — Vercel serverless function, stores in **Upstash Redis** (`@upstash/redis`)
- **Rate limiting**: 5 comments per IP per 60 seconds
- **Sanitization**: HTML entities escaped server-side, XSS via `dangerouslySetInnerHTML` is safe (pre-sanitized)
- **Local dev**: auto-falls back to in-memory store if `UPSTASH_REDIS_REST_URL` env var is missing
- **Setup**: Create an Upstash Redis instance on [Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=redis), add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as Vercel env vars
- Comments are keyed by page `slug` (URL pathname), stored as Redis lists under `comments:<slug>`

## Admin Panel

Hidden management page at `/admin` (not linked anywhere in the site, `noindex`/`nofollow` meta tags).

- **Access**: password-protected with `ADMIN_TOKEN` env var (defaults to `blog-admin-2024`)
- **Token storage**: saved in `localStorage` after login, persists across sessions
- **Two tabs**: 评论管理 (comments) and 文章管理 (posts)
- **Local dev**: comment management falls back to localStorage; post management requires production (GitHub API)

### Comment Management

- List all pages with comments, view/delete individual comments, clear all comments for a page
- API auth: `Authorization: Bearer <token>` header for GET list, `token` in request body for DELETE

### Post Management (CMS)

- **API**: `api/posts.js` — uses **GitHub Content API** to read/write/delete markdown files in the repo
- **Env vars required**: `GITHUB_TOKEN` (Personal Access Token with `repo` scope) — stored in Vercel, never in code
- **How it works**: admin writes/edits posts → GitHub API commits to repo → Vercel auto-rebuilds (3-5 min delay)
- **Categories**: `ai`, `develop`, `program`, `project`, `lifestyle`, `trade`, `reference` — matches `blog/` subdirectories
- **Front matter**: auto-generated from form fields (title, slug, date, tags, description)
- Post management only works in production (requires GitHub API); shows "本地模式不可用" notice in dev

## i18n

Only `zh-CN` locale is configured. The `i18n/zh/` directory exists but is not actively used for translation.

## When Adding New Features

- New blog posts go in `blog/<category>/` as markdown files with front matter.
- New pages go in `src/pages/` and must export a React component.
- New theme components go in `src/theme/` (use `pnpm swizzle` to scaffold).
- New static assets go in `static/` (images in `static/img/`, scripts in `static/js/`).
- Structured data (friends links, projects, etc.) belongs in `data/` as `.ts`/`.tsx` files.