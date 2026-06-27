# Architecture

## High-Level Shape

AutomatorLabs is a static Astro site whose pages are assembled from TypeScript registries and rendered at build time.

The architecture has four major layers:

1. Content and config registries in `src/data/*`
2. Shared page shells and UI components in `src/components/*`
3. Calculation and SEO helpers in `src/lib/*`
4. Astro route files in `src/pages/*`

There is no visible runtime backend or CMS.

## Repository Structure

- `src/pages/`
  - Astro routes for calculators, guides, examples, topics, newsletter, and utility pages.
- `src/components/`
  - Shared page shells and reusable UI.
- `src/data/`
  - Source-of-truth registries for calculators, content, guides, categories, newsletter, and programmatic SEO records.
- `src/lib/`
  - Math helpers, input parsing, related-link generation, educational content generators, analytics hooks, and programmatic SEO utilities.
- `src/config/`
  - Specialized defaults for retirement-account calculators.
- `public/`
  - Static assets such as `robots.txt` and favicon.
- `scripts/`
  - Local audit utilities.
- `tests/`
  - Playwright regression suite.
- `docs/`
  - Human and AI handbook.

## Core Source Files

### Public discovery and indexing

- `src/data/content.ts`
  - Public calculator registry used by the calculator index and related-linking systems.

### Calculator source of truth

- `src/data/calculators.ts`
  - Calculator config registry: inputs, outputs, FAQs, related IDs, chart flags, and other page-driving metadata.

### Category system

- `src/data/calculator-categories.ts`
  - Category definitions and calculator membership.

### Generated educational system

- `src/data/calculator-guides.ts`
  - Generates calculator guide data from calculator config and content metadata.
- `src/lib/calculator-education.ts`
  - Shared guide/FAQ/explanation generators.

### Programmatic SEO system

- `src/data/programmatic-seo/*.ts`
  - cluster records
- `src/lib/programmatic-seo/*.ts`
  - cluster builders, metadata, schemas, shared types, and audits
- `src/components/programmatic-seo/ProgrammaticSeoPage.astro`
  - shared page renderer

### Site shell

- `src/layouts/Layout.astro`
  - shared metadata, canonical tag, nav, footer, analytics tags, and theme switching

## Route Families

### Static routes

- `/`
- `/calculators/`
- `/guides/`
- `/examples/`
- `/topics/`
- `/newsletter/`
- `/about/`
- `/contact/`
- `/privacy/`

### Calculator detail routes

Most calculator pages are static route files under:

- `src/pages/calculators/*/index.astro`

There are more route directories than core live calculators because the repo includes calculator variants and family-specific pages.

### Calculator category routes

Examples:

- `/calculators/investing/`
- `/calculators/debt-loans/`
- `/calculators/fire-retirement/`

These are thin wrappers around `src/components/CalculatorCategoryPage.astro`.

### Guide routes

There are two main guide patterns:

- dynamic route `src/pages/guides/[slug].astro`
  - emits generated calculator guides and topical guides
- static route directories under `src/pages/guides/*/index.astro`
  - used for guide hubs and comparison guides

### Programmatic example routes

Per cluster:

- parent calculator page
- examples index at `/calculators/<cluster>/examples/`
- static generated pages at `/calculators/<cluster>/<slug>/`

## Calculator Page Architecture

Most calculators follow this pattern:

1. Route imports a calculator config or shared calculator-family component.
2. Route derives related calculator and guide links from registry data.
3. Route passes content to `src/components/CalculatorPage.astro`.
4. Inline client script imports shared math/input/analytics helpers.
5. Successful calculation updates UI, updates the URL query string, and may fire analytics.

Shared calculator page responsibilities:

- page metadata
- SoftwareApplication schema
- FAQ schema
- breadcrumb schema
- input rendering
- result panels
- share-calculation controls
- chart container
- worked example section
- educational sections
- related calculator / guide / example surfaces
- newsletter CTA

## Guide Architecture

### Guide hubs

- stored in `src/data/guide-hubs.ts`
- rendered with `src/components/GuideHubPage.astro`
- published through dedicated static route files

### Topical guides

- stored in `src/data/topical-guides.ts`
- emitted by `src/pages/guides/[slug].astro`
- rendered with `src/components/TopicalGuidePage.astro`

### Comparison guides

- stored in `src/data/comparison-guides.ts`
- rendered with `src/components/ComparisonGuidePage.astro`
- published through dedicated static route files

### Generated calculator guides

- derived in `src/data/calculator-guides.ts`
- rendered with `src/components/CalculatorGuidePage.astro`
- emitted by `src/pages/guides/[slug].astro`

## Programmatic SEO Architecture

The programmatic system is intentionally constrained:

- typed record sets
- explicit expected counts
- shared metadata and schema generation
- cluster-specific page model builders
- build-time audit failures for bad records

This is not a free-text page factory. It is a validated static publishing system.

## Data Flow

1. Registries and content live in `src/data/*`.
2. Route files import those registries at build time.
3. Shared page components render the content.
4. `Layout.astro` applies shared shell and metadata.
5. Astro builds static output into `dist/`.
6. `scripts/audit-seo.mjs` audits the built output plus key registries.
7. Playwright verifies user-facing behavior in a browser.

## Internal Linking Infrastructure

Internal links are generated from multiple layers:

- explicit `relatedIds` in content/config
- shared helper `src/lib/related-calculators.ts`
- guide registries that link calculators to guides and example collections
- programmatic cluster registry used by `/examples/`
- manual topic curation in `src/pages/topics/index.astro`

If you add new content without updating its link graph, the content is incomplete.

## Testing And Audit Architecture

### Static SEO audit

`scripts/audit-seo.mjs` checks:

- missing/duplicate titles
- missing/duplicate meta descriptions
- missing/duplicate canonicals
- missing or multiple H1s
- calculator-to-page registry consistency
- category assignment consistency
- FAQ and breadcrumb schema on calculator pages
- hosted newsletter CTA presence on calculator pages
- broken internal links
- sitemap existence

### Browser regression suite

The split Playwright suite under `tests/*.spec.ts` covers:

- calculator index search/filter UX
- newsletter CTA presence
- many calculator behaviors
- category pages
- guide behaviors
- programmatic cluster audits and routes
- representative SEO-critical page checks

## Build And Local Workflow

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run audit:seo`
- `npm run test:calculators`

## Deployment Workflow

Confirmed:

- Astro `site` is `https://automatorlabs.co`
- sitemap generation is enabled
- deployment output is static `dist/`

Not confirmed:

- hosting provider
- CI/CD platform
- branch/deploy policy
- release approval workflow
