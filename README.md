# Site Skeleton

Site Skeleton is a self-hostable, markdown-first site framework for editorial websites.

It is built for a simple upstream-fork workflow:
- fork the repo
- use your fork as your site
- customize the site-owned surfaces in `site/`
- write and publish content through the content pipeline
- pull upstream improvements when useful, then let your agent resolve conflicts if needed

The runtime only trusts generated state. Raw markdown is authoring input, not the live runtime source.

## What You Get

- a strict Markdoc content pipeline
- reusable canonical blocks and page templates
- one obvious site-owned customization root in `site/`
- visible accepted-content history in `content/archive/`
- recovery paths for misplaced drafts or direct edits
- static-export output from Next.js 16

## 5 Minute Agent Quickstart

If an agent is dropped into this repo cold, do this first:

```bash
npm install
npm run content -- audit
npm run dev
```

For a full validation pass:

```bash
npm run lint
npm run test
npm run build
```

`npm run content -- audit` matters on a fresh clone because `content/.state/` is ignored and rebuilt from the accepted archive. in that case, `regenerated` can be non-zero without meaning anything is wrong. `quarantined` should stay at `0` unless the audit found misplaced markdown or direct edits to generated files.

## Start A New Site

Run the starter initializer when you want a working neutral site quickly:

```bash
npm run site:init
```

This copies generic starter files from `init/` into the active website paths, then seeds the neutral starter pages through the content pipeline.

Tracked starter sources:

- `init/site/*`
- `init/content/examples/seed/*`
- `init/public/site/*`
- `init/public/og/*`

Generated site-owned targets:

- `site/config.ts`
- `site/block-overrides.tsx`
- `site/template-overrides.tsx`
- `content/examples/seed/*`
- `public/site/*`
- `public/og/*`

Framework `main` does not track the active `site/config.ts`. If no site config exists yet, framework commands create an ignored fallback that re-exports `site/default-config.ts`; `site:init` replaces that fallback with a starter site-owned config.

After that, update:

- `site/config.ts` for identity, navigation, footer, metadata, theme, and icon paths
- `public/site/*` for browser and install icons
- `public/og/*` for social card images
- `public/images/*` for page images referenced by media-capable blocks
- `content/submit-here/*` for your real pages

If any generated target already exists with different content, `site:init` stops instead of overwriting it. Use `npm run content -- site-init --force` only when you intentionally want to replace starter files.

## Pull Into An Existing Site

Existing site repos do not need to run `site:init`. Keep their current site-owned files.

Clean framework `main` does not track active starter, demo, or website files. If a site is migrating from older framework history, the migration merge may still report delete/modify conflicts for files your site already owns, such as `content/archive/*`, `public/images/*`, `public/site/*`, `public/og/*`, `site/config.ts`, or site override files. Resolve those conflicts by keeping the website's versions. After the migration, framework `main` ignores those active site-owned paths and should not keep reintroducing starter files there.

## Where Agents Should Edit

### Site-Owned Surfaces

Start here for normal site customization:

- `site/config.ts`
  - site name
  - canonical URL
  - nav
  - footer copy
  - manifest defaults
  - metadata defaults
  - social card registry
- `site/blocks.ts`
  - site-level renderer overrides for the existing block keys
- `site/templates.ts`
  - site-level renderer overrides for the existing template keys
- `app/globals.css`
  - tokens and global styling
- `components/site/*`
  - shared site chrome and visual primitives
- `init/*`
  - tracked starter files copied by `npm run site:init`

### Canonical CMS Core

Leave these alone unless you are improving the framework itself:

- `lib/content/*`
- `components/blocks/*`
- `components/templates/*`
- `content/types.ts`
- `scripts/site-content.ts`

## Agent Best Practices

### Styling

- Use Tailwind utility classes and the existing design tokens in `app/globals.css`.
- Do not add one-off custom CSS files, inline style blobs, or parallel styling systems unless there is a strong reason.
- Prefer editing shared site primitives in `components/site/*` before scattering repeated class changes across many pages.
- When doing frontend design work, use Playwright to verify real rendered behavior and take screenshots so visual changes are grounded in the actual UI, not guesswork.
- If a visual rule is reusable, put it in the shared site layer, not in one random page.

### Blocks and Templates

- If you are improving the CMS for everyone, edit the canonical catalogs in `components/blocks/*` and `components/templates/*`.
- If you are making a site-specific customization in a fork, start in `site/blocks.ts` and `site/templates.ts`.
- Today that site seam is for swapping existing renderer keys. adding new block or template names still requires contract changes in `lib/content/*`.
- Promote a block or template upstream only when it is clearly reusable across multiple sites.
- Keep the seam boring and explicit. Avoid plugin systems, dynamic discovery, or clever abstractions.

### Content and Publishing

- Do not edit `content/archive/*` or `content/.state/*` directly.
- Put new drafts in `content/submit-here/` and use the content CLI to check, submit, or edit them.
- Treat `init/content/examples/seed/*` as starter examples, not as hidden runtime state.

### Repo Hygiene

- Normal site work should stay inside `site/*`, `components/site/*`, `app/globals.css`, and content files.
- Core CMS changes should be intentional, small, and validated with lint, tests, build, and content CLI checks.
- When in doubt, prefer the change that keeps future upstream merges boring.

## Content Workflow

New markdown drafts only go in:

- `content/submit-here/`

Common commands:

```bash
npm run content -- check content/submit-here/<file>.md
npm run content -- submit content/submit-here/<file>.md
npm run content -- edit content/submit-here/<file>.md
npm run content -- pages
npm run content -- list-templates
npm run content -- list-blocks
npm run content -- recovery-list
```

Publishing model:
- accepted revisions are mirrored into `content/archive/`
- the runtime rebuilds hidden generated state under `content/.state/`
- only the newest accepted `published` revision per page becomes live
- accepted `draft` revisions stay archived without replacing the live page
- bad direct writes are quarantined into `content/recovered-drafts/`

## Default Starter Routes

The repo ships with neutral placeholder templates under `init/` so a new website can be bootstrapped quickly.

Default routes:
- `/`
- `/features`
- `/contact`

Create them with `npm run site:init`, then replace them through the content pipeline.

## Repo Shape

- `site/*`
  active site-owned customization seam for downstream forks
- `init/*`
  tracked starter files copied into active site-owned paths by `npm run site:init`
- `content/*`
  editorial inputs, archive, and recovery paths
- `lib/content/*`
  content engine, validation, state, metadata, archive, and recovery logic
- `components/blocks/*`
  canonical block implementations
- `components/templates/*`
  canonical page-template implementations
- `content/site.ts`
  compatibility shim for older references, now forwarding to `site/config.ts`

## Deployment

The app is configured for static export with `next build`.

- `next.config.ts` uses `output: "export"`
- `next.config.ts` disables Next image optimization so `next/image` emits direct `/images/...` asset URLs for static hosts
- `public/_worker.js` can enforce a canonical host when `CANONICAL_HOST` is set
- `.github/workflows/deploy-pages.yml` can deploy to Cloudflare Pages when repo variables and secrets are configured

## Docs to Read Next

For humans and agents, this is the best reading order:

1. [content/AUTHORING.md](./content/AUTHORING.md)
2. [content/submit-here/README.md](./content/submit-here/README.md)
3. [content/archive/README.md](./content/archive/README.md)
4. [content/recovered-drafts/README.md](./content/recovered-drafts/README.md)
5. [site/README.md](./site/README.md)
