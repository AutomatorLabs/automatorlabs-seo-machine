# Project

## One-Sentence Summary

AutomatorLabs is a static financial publishing site that uses calculators, guides, and worked examples as an integrated SEO and education system.

## Mission

Help users ask better financial questions before making decisions by pairing free calculators with clear explanations, worked examples, and related guides.

## Product Surfaces

- Homepage: brand framing plus entry points into calculators, guides, and examples.
- Calculator index: searchable and filterable directory of live calculator pages.
- Calculator category pages: curated collections for major decision areas.
- Calculator detail pages: interactive tools with explanations, FAQs, related links, and optional example links.
- Guide index: hub for guide hubs, comparison guides, topical guides, and generated calculator guides.
- Guide hubs: broader educational pages that connect calculators, guides, and example collections.
- Topical guides: authored educational articles.
- Comparison guides: side-by-side decision articles.
- Worked examples: large static example clusters under calculator families.
- Topics index: manually curated subject map across calculators, guides, and examples.
- Newsletter page plus shared CTA blocks: audience capture via Beehiiv.

## Current Scope

Verified from source:

- 84 calculator content entries
- 84 calculator configs
- 6 calculator categories
- 10 guide hubs
- 17 topical guides
- 7 comparison guides
- generated calculator guides for calculator configs
- 51 programmatic SEO clusters
- 10,200 example pages total

## Positioning

The site positions itself as:

- practical
- beginner-friendly
- scenario-based
- educational rather than advisory

Homepage language reflects the core promise:

- "Practical financial calculators built to explain the results"
- "Clear numbers. Better questions."

## User Jobs

The repo suggests users come here to:

- estimate a financial outcome
- compare multiple scenarios
- understand what calculator outputs mean
- move from a narrow query into adjacent education
- browse examples when they do not know what inputs to choose

## Technical Shape

- Astro 6 static site
- TypeScript
- `@astrojs/sitemap`
- Playwright end-to-end coverage
- repo-hosted content and config in `.ts` files
- no visible CMS, backend, or database

## Operating Constraints

- The site is static-first; most "content operations" are code edits.
- Internal linking is core product behavior, not optional polish.
- Counts in docs can go stale quickly after calculator or example launches.
- Deployment artifact is clearly `dist/`, but host and deploy trigger remain `Needs confirmation`.

## Non-Goals Visible In Source

The inspected repo does not currently implement:

- authenticated users
- user accounts
- saved scenarios on a backend
- personalized financial advice
- ecommerce or checkout
- a visible editorial CMS
