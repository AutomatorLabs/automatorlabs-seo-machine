# SEO

## SEO Philosophy

AutomatorLabs is not just "a site with SEO." The product is organized as an SEO-aware publishing system.

The core approach is:

- publish tools for explicit intent
- attach explanation and education to those tools
- cover adjacent search journeys with guides
- cover long-tail scenario queries with worked examples
- link every layer together

Good SEO work in this repo usually means improving the whole system, not just one title tag.

## Existing SEO Implementation

- shared canonical generation in `src/layouts/Layout.astro`
- sitemap integration via `@astrojs/sitemap`
- permissive `public/robots.txt`
- build-time SEO audit in `scripts/audit-seo.mjs`
- browser-based checks in `tests/calculators.spec.ts`

## Metadata System

`src/layouts/Layout.astro` currently manages:

- `<title>`
- meta description
- canonical URL
- optional `noindex`
- shared Open Graph defaults
- shared Twitter card defaults

Current shared social defaults:

- `og:type = website`
- `og:site_name = AutomatorLabs`
- `og:title` from the page title
- `og:description` from the page description
- `og:url` from the canonical URL
- `twitter:card = summary`
- `twitter:title` from the page title
- `twitter:description` from the page description

Page-specific titles and descriptions are passed in by:

- calculator routes
- guide components
- examples hub
- programmatic SEO page builders

Programmatic metadata helpers live in:

- `src/lib/programmatic-seo/metadata.ts`

## Structured Data

### Calculator pages

- `SoftwareApplication`
- `FAQPage`
- `BreadcrumbList`

### Guide pages

- `FAQPage`

### Programmatic example pages

- `FAQPage`
- `BreadcrumbList`

### Hubs

- breadcrumb schema on examples and topic surfaces

## Indexability And Crawl Rules

Current repo-visible behavior:

- `robots.txt` allows crawling
- sitemap URL is declared
- optional per-page `noindex` is supported by the layout

There is no repo-visible global crawl suppression beyond that.

## Internal Linking Philosophy

Internal linking is one of the main SEO mechanisms in this repo.

Expected flow:

- broad entry pages route users toward narrower tools
- narrow tool pages route users toward related calculators and education
- example pages route users back to calculators and into adjacent scenarios
- guide pages connect higher-funnel educational intent back to calculator intent

This reduces orphan pages and increases topical depth.

## Current Link Surfaces

- main nav: Home, Calculators, Guides, About
- footer: Topics, Examples, Newsletter, Privacy, Contact, GitHub
- calculator pages:
  - related calculators
  - related guides
  - optional worked-example links
  - newsletter CTA
- guide pages:
  - matching calculators
  - adjacent guides
  - example collections when relevant
- example pages:
  - parent calculator
  - cluster examples index
  - related examples
  - related calculators
  - related guides
- topics page:
  - manual cross-type curation backed by `src/data/topics.ts`

## Programmatic SEO Within The SEO System

Programmatic pages are not standalone SEO experiments. They are part of the main content graph.

Each cluster should:

- answer a distinct scenario intent
- map cleanly to one calculator family
- link back to the calculator
- link to the examples index
- link to adjacent guides
- maintain unique metadata

See [programmatic-seo.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/programmatic-seo.md) for the cluster system itself.

## What The Audit Actually Enforces

`scripts/audit-seo.mjs` verifies:

- unique titles
- unique meta descriptions
- unique canonicals
- canonical presence
- Open Graph presence for `og:type`, `og:site_name`, `og:title`, `og:description`, and `og:url`
- Twitter metadata presence for `twitter:card`, `twitter:title`, and `twitter:description`
- canonical and `og:url` parity
- single H1 on pages
- calculator registry-to-page consistency
- category coverage
- FAQ schema on calculator pages
- breadcrumb schema on calculator pages
- hosted newsletter CTA on calculator pages
- topics data-module structure, including non-empty sections, non-empty link groups, internal absolute hrefs, and duplicate label/href checks within a topic section
- internal-link validity
- sitemap output

Related calculator selection currently follows this fallback philosophy:

- preserve explicit `relatedIds` first
- prefer reciprocal and same-family matches before broader category fill
- use broad site-wide fallback only after topical and category-local options are exhausted

## Strengths

- static output with predictable canonical behavior
- good route-to-registry consistency checks
- strong use of cross-linking between calculators, guides, and examples
- shared page shells reduce metadata drift
- controlled programmatic SEO rather than unbounded generation

## Gaps And Open Opportunities

- no repo-visible social preview image system
- no documented Search Console workflow
- no documented analytics review workflow beyond embedded tags
- no explicit freshness workflow outside source edits
- topics page should be reviewed periodically for stale or missing links
- shared social metadata now has a build-output assertion, but there is still no shared social preview image system

## Common SEO Mistakes In This Repo

- shipping a route without updating the index registries
- adding content without internal-link support
- stale counts in docs after launches
- duplicate or near-duplicate programmatic metadata
- assuming build success means SEO quality without running the audit
- treating the topics page as self-updating when it is manual
