# Contributing

## Principles

- Keep production behavior stable unless the task explicitly calls for product changes.
- Prefer small, coherent edits over broad rewrites.
- Verify source facts before updating docs or counts.
- Treat SEO, internal linking, and discoverability as part of correctness.

## Coding Standards

- Reuse shared components before copying markup.
- Keep data/config in `src/data/*` whenever possible.
- Keep calculations and reusable helpers in `src/lib/*`.
- Keep route files thin when a shared component already fits the use case.
- Use existing naming patterns and route shapes.

## Testing Workflow

### Documentation-only work

Required:

- `git diff --check`

Optional when docs depend on a new source audit:

- `npm run build`
- `npm run audit:seo`

### Calculator or routing work

Recommended minimum:

1. `npm run build`
2. `npm run audit:seo`
3. `npm run test:calculators`

Equivalent one-command flow:

1. `npm run verify`

## Deployment Workflow

Known from repo:

- production artifact is a static Astro build in `dist/`

Unknown:

- hosting platform
- CI provider
- deploy trigger
- release approval path

Treat deployment details as `Needs confirmation` until documented from a real source.

## How To Add A New Calculator

1. Add or update the calculator config in `src/data/calculators.ts`.
2. Add the public content entry in `src/data/content.ts`.
3. Add category membership in `src/data/calculator-categories.ts`.
4. Create the route file under `src/pages/calculators/...`.
5. Reuse an existing calculator-family component when possible.
6. Wire related calculators, related guides, and example links.
7. Confirm the generated calculator guide still works or is intentionally excluded.
8. Update docs if counts or workflows changed.
9. Run relevant verification.

## How To Add A New Worked-Example Cluster

1. Add the typed record module under `src/data/programmatic-seo/`.
2. Export an explicit expected page count.
3. Add the page-model builder under `src/lib/programmatic-seo/`.
4. Add the examples index route.
5. Add the page route using `getStaticPaths()`.
6. Audit records during static generation.
7. Register the cluster in `src/data/programmatic-seo/clusters.ts`.
8. Link the cluster from the parent calculator and relevant guides/topics.
9. Add or update Playwright coverage.
10. Update docs counts and cluster inventory.

## How To Add A Guide

First decide which guide type it is.

### Guide hub

- Add data in `src/data/guide-hubs.ts`
- add the route file under `src/pages/guides/<slug>/index.astro`
- ensure calculator and example links are intentional

### Topical guide

- Add data in `src/data/topical-guides.ts`
- it will publish through `src/pages/guides/[slug].astro`
- review guide index topic grouping

### Comparison guide

- Add data in `src/data/comparison-guides.ts`
- add the route file under `src/pages/guides/<slug>/index.astro`
- ensure links support a decision journey, not just a text article

### Generated calculator guide

- Usually created automatically from calculator config
- if a calculator needs custom guide handling, update the generator carefully

## How To Add A Topic

The topics surface is manual.

1. Update `src/pages/topics/index.astro`.
2. Add calculator, guide, and example links intentionally.
3. Run `npm run audit:seo` or `npm run verify` to catch broken manually curated topic links.
4. Avoid creating topics that are too thin or redundant with category pages.

## Common Mistakes

- forgetting `src/data/content.ts`
- forgetting category assignment
- forgetting internal links after adding a page
- letting docs counts drift
- creating duplicate programmatic metadata
- adding a route that is not represented in tests or audits
