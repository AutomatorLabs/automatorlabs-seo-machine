# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Start here

This repo has a full AI/human project handbook in `docs/`. Read `docs/README.md` first — it defines the required read order (`PROJECT.md` → `BUSINESS.md` → `ARCHITECTURE.md` → `CONTENT.md` → `SEO.md` → `programmatic-seo.md` → `STYLE_GUIDE.md` → `AI_WORKFLOW.md` → `CONTRIBUTING.md` → `DECISIONS.md`) before making non-trivial changes. `docs/AI_WORKFLOW.md` and `docs/CONTRIBUTING.md` in particular are written directly for AI agents working in this codebase — treat them as binding, not optional background.

## North star

The goal is not "another calculator website" — it's a financial search authority that compounds organic traffic over years. Every calculator is a search entry point, every worked example captures long-tail intent, every guide builds topical authority, and they're meant to reinforce each other. Monetization is expected to eventually come through newsletter growth, affiliates, sponsorships, and future premium/SaaS products — but the current build priority is authority and traffic quality, not short-term monetization hacks. Never trade long-term SEO durability for a short-term gain.

## Commands

| Command | Action |
| :-- | :-- |
| `npm run dev` | Start the local Astro dev server |
| `npm run build` | Build the production site to `dist/` |
| `npm run audit:seo` | Static audit of built output (titles, canonicals, schema, broken links, sitemap) — run `npm run build` first |
| `npm run test:calculators` | Playwright suite (`tests/*.spec.ts`) |
| `npm run verify` | `build` + `audit:seo` + `test:calculators` — default full-pass check before any low-risk production change |
| `npm run preview` | Preview the production build locally |

For a single Playwright spec: `npx playwright test tests/<file>.spec.ts`.

Documentation-only changes only require `git diff --check`.

## Architecture

Static Astro site, no backend/CMS. Everything is TypeScript registries in `src/data/*` rendered at build time by route files in `src/pages/*` through shared components in `src/components/*`, using math/SEO helpers in `src/lib/*`.

The two facts that matter most: **the site is registry-driven**, and **adding content is a multi-file operation**, not a single route file:

- `src/data/content.ts` — public discovery registry (a calculator isn't findable unless it's here)
- `src/data/calculators.ts` — calculator config source of truth (inputs, outputs, FAQs, related IDs)
- `src/data/calculator-categories.ts` — category membership
- `src/data/calculator-guides.ts` + `src/lib/calculator-education.ts` — generated calculator guides
- `src/data/programmatic-seo/*.ts` + `src/lib/programmatic-seo/*.ts` — typed, count-validated worked-example clusters (not free-form generation)
- `src/layouts/Layout.astro` — shared metadata/canonical/nav/theme shell used by every page; small changes here affect the whole site

Guides come in three other flavors beyond generated calculator guides: guide hubs (`src/data/guide-hubs.ts`), topical guides (`src/data/topical-guides.ts`, emitted by `src/pages/guides/[slug].astro`), and comparison guides (`src/data/comparison-guides.ts`).

Internal linking is treated as part of the product. `src/lib/related-calculators.ts` ranks related calculators by explicit `relatedIds` first, then family/topic token overlap (weighted, same-category preferred), then broader same/cross-category fallback. New content without planned internal links is considered incomplete.

Full architecture detail (route families, data flow, testing/audit breakdown) lives in `docs/ARCHITECTURE.md` — read it rather than relying on a summary before touching routing or the SEO audit.

## Working rules

- Don't assume a calculator is discoverable just because a route file exists — it must also be in `src/data/content.ts`.
- Don't change shared math in `src/lib/` casually; many pages/tests depend on it.
- Before adding a new programmatic SEO cluster, audit existing clusters first — avoid duplicating intent, prefer improving what exists over adding more.
- Deployment platform/CI are **not confirmed** by this repo (see `docs/DEPLOYMENT.md`) — don't state them as fact. Deploys are release work, not something to do casually from a coding session.
- Update `docs/` in the same session as any architecture, content-model, or workflow change — stale counts/docs are treated as a known failure mode here.

## Approval gate

Do not do the following without explicit approval first: refactor core architecture, rewrite the calculator framework, change calculator formulas/math, change newsletter behavior, introduce breaking changes, or deploy.

Local commits are fine without asking. **Never run `git push` without explicit instruction to do so** — pushing to origin triggers a Netlify build, so it's a deploy action, not a commit action.

## Task workflow

For non-trivial work, follow this loop rather than jumping straight to implementation:

1. Read the relevant docs.
2. Audit the current implementation in the area you're touching.
3. Explain findings before proposing changes.
4. Recommend improvements.
5. Wait for approval.
6. Implement only what was approved.
7. Run `npm run verify` and `git diff --check`.
8. Report back: files changed, verify result, remaining technical debt, next recommendations.
