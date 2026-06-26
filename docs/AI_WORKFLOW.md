# AI Workflow

## Goal

A future AI agent should be able to continue this project safely without rediscovering the architecture from scratch.

## Required Onboarding Sequence

Before making non-trivial changes:

1. Read the core docs listed in [README.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/README.md).
2. Verify the relevant source files directly.
3. Check whether counts or docs are stale before trusting them.
4. Inspect tests and audits touching the area you plan to change.

## Default Mental Model

Assume this repo is:

- static
- registry-driven
- SEO-sensitive
- internal-link-sensitive
- documentation-dependent

That means "small" changes often touch multiple registries and docs.

## High-Value Files To Inspect First

- `src/data/content.ts`
- `src/data/calculators.ts`
- `src/data/calculator-categories.ts`
- `src/data/calculator-guides.ts`
- `src/data/programmatic-seo/clusters.ts`
- `src/components/CalculatorPage.astro`
- `src/components/programmatic-seo/ProgrammaticSeoPage.astro`
- `src/layouts/Layout.astro`
- `tests/calculators.spec.ts`
- `scripts/audit-seo.mjs`

## Safe Working Rules

- Do not assume a route is "live" just because a file exists.
- Do not assume a calculator is discoverable unless it is also in `src/data/content.ts`.
- Do not add content without planning its internal links.
- Do not change formulas casually; many pages and tests depend on shared math.
- Treat `src/layouts/Layout.astro` as shared metadata infrastructure; small head changes affect the whole site.
- Do not describe unknown deployment details as facts.
- Update docs whenever architecture, content shape, or workflow changes.

## Workflow For Common Tasks

### Add a calculator

Inspect first:

- `src/data/calculators.ts`
- `src/data/content.ts`
- `src/data/calculator-categories.ts`
- similar route files in `src/pages/calculators/`
- `src/data/calculator-guides.ts`
- `tests/calculators.spec.ts`

Then verify:

- route exists
- config exists
- content item exists
- category assignment exists
- related links are sensible
- generated guide behavior still works

### Add a guide

Determine the type first:

- guide hub
- topical guide
- comparison guide
- generated calculator guide

Then update the correct registry and check:

- guide index visibility
- topic grouping
- internal links
- related calculator coverage

### Add a worked-example cluster

Inspect first:

- `docs/programmatic-seo.md`
- `src/data/programmatic-seo/clusters.ts`
- a similar cluster's data file
- its builder in `src/lib/programmatic-seo/`
- its route files under `src/pages/calculators/...`
- Playwright coverage for a similar cluster

### Document-only session

- Read all `/docs` files first if the task is a doc audit.
- Treat old counts and roadmap notes as suspect until confirmed in source.
- Prefer updating docs over changing production code unless a tiny doc-related fix is unavoidable.

## Verification Workflow

Use the narrowest relevant verification first, then broader checks as needed.

Available repo checks:

- `npm run build`
- `npm run audit:seo`
- `npm run verify`
- `npm run test:calculators`
- `git diff --check`

`npm run verify` is the default full-pass check for low-risk production changes.

`npm run audit:seo` now also validates shared Open Graph and Twitter metadata on built pages, including canonical and `og:url` parity.

For documentation-only changes, `git diff --check` is the minimum required check.

## Common Failure Modes For AI Agents

- Updating one calculator registry but not the others
- Trusting stale counts from docs instead of source
- Forgetting that guides and examples are part of the calculator launch surface
- Creating orphan content with weak internal links
- Forgetting docs updates after changing content shape
- Stating deployment or business facts that the repo does not prove
