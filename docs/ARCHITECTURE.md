# Architecture

## Repository Structure

- `src/pages/`
  - Astro routes for homepage, calculators, guides, examples, topics, newsletter, and utility pages.
- `src/components/`
  - Reusable page shells and UI components.
  - Key page-level components include `CalculatorPage.astro`, `GuideHubPage.astro`, `ComparisonGuidePage.astro`, `TopicalGuidePage.astro`, and `programmatic-seo/ProgrammaticSeoPage.astro`.
- `src/data/`
  - Main content source of truth.
  - Calculator config, categories, guides, newsletter config, and programmatic SEO record sets live here.
- `src/lib/`
  - Calculation helpers, related-link generation, educational helpers, analytics hooks, and programmatic SEO utilities.
- `src/config/`
  - Specialized defaults for account-specific calculators.
- `public/`
  - Static assets such as `robots.txt` and favicon.
- `scripts/`
  - Local SEO audit script for built output.
- `tests/`
  - Playwright regression coverage.
- `docs/`
  - Human/AI knowledge base plus existing project notes.

## Folder Purposes

- `src/data/calculators.ts`
  - Central calculator definitions: title, URL, inputs, outputs, FAQs, related IDs, optional chart and educational metadata.
- `src/data/content.ts`
  - Calculator discovery/index metadata used by landing pages.
- `src/data/calculator-categories.ts`
  - Category membership for calculator organization.
- `src/data/calculator-guides.ts`
  - Generated guide content built from calculator config plus supporting heuristics.
- `src/data/topical-guides.ts`
  - Authored educational guides.
- `src/data/comparison-guides.ts`
  - Authored side-by-side strategy comparisons.
- `src/data/guide-hubs.ts`
  - Topic hub pages with grouped links and FAQs.
- `src/data/programmatic-seo/`
  - Record sets for example-page clusters.

## Routing Architecture

- Static routes:
  - `/`
  - `/calculators/`
  - `/guides/`
  - `/examples/`
  - `/topics/`
  - `/newsletter/`
  - `/about/`, `/contact/`, `/privacy/`
- Calculator detail pages:
  - Mostly dedicated route files under `src/pages/calculators/*/index.astro`.
- Calculator category pages:
  - e.g. `/calculators/investing/`, `/calculators/debt-loans/`.
- Dynamic guide route:
  - `src/pages/guides/[slug].astro`
  - Serves generated calculator guides and topical guides.
- Static guide hub/comparison routes:
  - e.g. `/guides/retirement/`, `/guides/fire/`, `/guides/rent-vs-buy/`.
- Programmatic example routes:
  - Cluster examples indexes plus `[slug]` routes under calculator-specific folders.

## Data Flow

1. Data/config is defined in `src/data/*`.
2. Astro pages import that data directly at build time.
3. Shared page components render calculators, guides, and programmatic pages.
4. `Layout.astro` applies shared metadata, canonical handling, navigation, analytics scripts, and theme support.
5. Astro builds static HTML to `dist/`.
6. `scripts/audit-seo.mjs` audits the generated output locally.

## Astro Conventions In Use

- File-based routing with `index.astro` folders.
- `getStaticPaths()` for dynamic guide and programmatic SEO pages.
- Shared `Layout.astro` for page metadata and shell.
- JSON-LD injected with `<script type="application/ld+json">`.
- Static generation rather than server-rendered runtime logic.

## Build Process

- Install: `npm install`
- Local dev: `npm run dev`
- Production build: `npm run build`
- SEO audit after build: `npm run audit:seo`
- Browser regression coverage: `npm run test:calculators`

## Deployment Overview

- Astro is configured with `site: 'https://automatorlabs.co'`.
- `@astrojs/sitemap` generates sitemap output during build.
- Hosting provider and deployment pipeline are `Needs confirmation`.
- Based on inspected config, deployment artifact is a static site in `dist/`.

## Areas Future Contributors Should Understand First

- `src/data/calculators.ts`
  - Core calculator source of truth.
- `src/components/CalculatorPage.astro`
  - Shared calculator page shell, schema, CTA, and query-param hydration behavior.
- `src/data/content.ts`
  - Main discovery/index metadata for calculators.
- `src/data/programmatic-seo/` and `src/lib/programmatic-seo/`
  - Controlled example-page system.
- `scripts/audit-seo.mjs`
  - Local guardrail for metadata, canonicals, schema, links, and sitemap output.
- `tests/calculators.spec.ts`
  - Best picture of expected user-facing behavior.
