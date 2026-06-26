# Architectural Decisions

## Confirmed Decisions

### 1. Static-first Astro architecture

Reason:

- The repo uses Astro static generation with no visible backend.
- Content is compiled from TypeScript data at build time.

Implication:

- Most features should be implemented as build-time content or client-side enhancements, not server features.

### 2. Content is stored in code, not a CMS

Reason:

- Calculators, guides, categories, and SEO records all live in source-controlled `.ts` files.

Implication:

- Content launches require code edits, reviews, and documentation updates.

### 3. Calculators are registry-driven

Reason:

- The public calculator system depends on `src/data/content.ts`, `src/data/calculators.ts`, route files, and category assignments working together.

Implication:

- Adding one page file is never enough.

### 4. Programmatic SEO is controlled and audited

Reason:

- Every cluster uses typed records, shared page models, and audit helpers.
- The build should fail when metadata or canonical rules break.

Implication:

- Avoid free-form content generation patterns that bypass the shared audit layer.

### 5. Internal linking is intentional product infrastructure

Reason:

- Related links are embedded across calculators, guides, example pages, topics, and hubs.

Implication:

- New content should always be added with an explicit linking plan.

### 6. Shared educational scaffolding is preferred

Reason:

- Calculator pages and generated calculator guides use helper-generated FAQs, explanation sections, common mistakes, and related links.

Implication:

- Prefer improving the shared generators before hand-writing many near-duplicate explanation blocks.

## Open Decisions / Needs Confirmation

### Deployment platform

Status:

- `Needs confirmation`

What the repo proves:

- Astro builds a static `dist/` artifact.

What it does not prove:

- where that artifact is deployed
- who deploys it
- whether deploys are manual or automated

### Monetization model

Status:

- `Needs confirmation`

What the repo proves:

- SEO and newsletter acquisition are live priorities.

What it does not prove:

- direct revenue model

### Release workflow outside local checks

Status:

- `Needs confirmation`

What the repo proves:

- local build, SEO audit, and Playwright flows exist

What it does not prove:

- CI gating
- required branch workflow
- release approval process
