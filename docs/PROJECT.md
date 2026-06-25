# Project

## Mission

AutomatorLabs appears to be building a search-friendly library of free financial calculators, educational guides, and worked examples that help users understand financial tradeoffs before making decisions.

## Product Overview

- Astro static site at `https://automatorlabs.co`.
- Primary content types:
  - Interactive calculators.
  - Guide hubs and educational articles.
  - Programmatic example pages grouped into example collections.
  - Newsletter acquisition pages and shared signup CTAs.
- Current positioning from the homepage:
  - "Practical financial calculators built to explain the results."

## Target Audience

- Consumers researching personal finance decisions.
- Users comparing scenarios in investing, retirement, debt, mortgages, budgeting, and savings.
- Search visitors looking for specific calculator intents.
- Newsletter subscribers who want ongoing calculator and guide updates.

## Technology Stack

- Astro 6 static site.
- TypeScript with Astro strict config.
- `@astrojs/sitemap` for sitemap generation.
- Playwright for browser-based regression coverage.
- Node.js `>=22.12.0`.
- Content/data stored in repo as TypeScript modules instead of a CMS.

## Current Capabilities

- 84 live calculator entries in `src/data/content.ts`.
- Calculator pages built from centralized calculator config/data.
- Calculator categories and category landing pages.
- Guide system with:
  - 10 guide hubs.
  - 17 topical guides.
  - 7 comparison guides.
  - Generated calculator guides derived from calculator configs.
- Programmatic SEO example system with 9 clusters and 1,800 total example pages.
- Global examples hub at `/examples/`.
- Shared newsletter CTA across major site sections.
- Static SEO audit script for built output.
- Playwright tests covering calculators, examples, and SEO-critical behavior.

## Revenue Strategy

- `Needs confirmation`.
- The current repository shows audience acquisition via SEO and newsletter growth.
- No direct monetization, checkout, subscription paywall, or ad system is visible in the inspected code.

## Design Philosophy

- Static-first and content-heavy.
- Calculator pages pair tools with explanations, FAQs, breadcrumbs, related links, and guide links.
- Programmatic SEO pages are controlled, typed, and validated instead of mass-generated blindly.
- Site messaging emphasizes education and scenario testing rather than prediction or advice.

## Known Constraints

- No visible backend, database, or CMS in the inspected repo.
- Most content is hard-coded in TypeScript data files, so updates are code changes.
- SEO quality depends on keeping metadata, schema, canonicals, and internal links consistent.
- Deployment target is `Needs confirmation`; the site is clearly a static Astro build, but hosting platform is not stated in the inspected files.
- Existing docs in `/docs` include older planning notes; treat them as historical unless they still match source.
