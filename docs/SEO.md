# SEO

## Existing SEO Implementation

- Site-level canonical generation in `src/layouts/Layout.astro`.
- Sitemap integration enabled through `@astrojs/sitemap`.
- `public/robots.txt` allows crawling and points to `https://automatorlabs.co/sitemap-index.xml`.
- Static SEO audit script checks built HTML and source data for common issues.

## Metadata

- `Layout.astro` sets:
  - `<title>`
  - meta description
  - canonical URL
  - optional `noindex`
- Calculator, guide, and example pages pass page-specific titles and descriptions into the layout.
- Programmatic SEO utilities include shared metadata generation helpers in `src/lib/programmatic-seo/metadata.ts`.

## Structured Data

- Calculator pages include:
  - `SoftwareApplication`
  - `FAQPage`
  - `BreadcrumbList`
- Guide pages include:
  - `FAQPage`
- Programmatic example pages include:
  - `FAQPage`
  - `BreadcrumbList`
- Example and topic hubs include breadcrumb schema.

## Sitemap

- Enabled via `astro.config.mjs`.
- Audit script expects `dist/sitemap-index.xml` or `dist/sitemap.xml`.

## Robots

- Current `robots.txt`:
  - `User-agent: *`
  - `Allow: /`
  - sitemap declaration
- No repo-visible crawl blocking beyond optional per-page `noindex`.

## Internal Linking

- Global nav links to Home, Calculators, Guides, and About.
- Footer links extend to Topics, Examples, Newsletter, Privacy, and Contact.
- Calculator pages link to:
  - Related calculators.
  - Related guides.
  - Worked/example pages when available.
  - Newsletter CTA.
- Guide pages link back into calculators and examples.
- Programmatic example pages link to:
  - Parent calculator.
  - Example index.
  - Related pages.
  - Guide and newsletter CTA.
- Topic pages aggregate calculators, guides, and examples by subject.

## Existing Calculators

- 84 live calculator entries are indexed in `src/data/content.ts`.
- Major calculator families:
  - Investing and compound growth.
  - FIRE and retirement.
  - Debt and credit cards.
  - Mortgage and home buying.
  - Savings and budgeting.
  - Tax-advantaged account planning.

## Existing Content Pages

- Guides index with search/filter UI.
- 10 guide hubs.
- 17 topical guides.
- 7 comparison guides.
- Generated calculator guides from calculator configs.
- Global examples hub plus 12 example clusters.

## Existing Programmatic Example Clusters

- Compound interest.
- APY.
- CAGR.
- Investment growth.
- FIRE.
- Mortgage.
- Savings goal.
- Credit card payoff.
- Balance transfer.
- Retirement withdrawal.
- Safe withdrawal rate.
- 4 percent rule.

Current repo state indicates 200 records per cluster, for 2,400 total examples.

## Current Strengths

- Static-first architecture with clean canonical handling.
- Strong internal linking between calculators, guides, categories, topics, and examples.
- Structured data is embedded in shared page components.
- SEO guardrails exist in both source-level audits and browser tests.
- Programmatic SEO is controlled by typed record sets rather than unconstrained generation.

## Missing Opportunities

- No repo-visible OG/Twitter social metadata in the shared layout.
- No repo-visible image generation pipeline for rich previews.
- No repo-visible search-console, indexing, or analytics reporting docs.
- No repo-visible content freshness workflow beyond manual source edits.
- Keep `/docs/programmatic-seo.md` synchronized whenever cluster counts, route patterns, or launch rules change.

## Future SEO Improvements

- Add explicit Open Graph and Twitter card metadata.
- Document and standardize title/meta rules for each content type.
- Add a current SEO inventory doc for live URLs and clusters.
- Expand test/audit coverage to social metadata if added.
- Review topic page links against live guide/calculator coverage for gaps.
- Validate whether all guide links referenced from topics are currently live.
- Keep programmatic SEO docs synchronized with actual cluster counts and route patterns.
