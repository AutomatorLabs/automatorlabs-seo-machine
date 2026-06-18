# Programmatic SEO System

## Current clusters

- Compound Interest: 100 generated pages.
- FIRE: 30 generated pages.
- Global examples hub: `/examples/`.

Cluster routes:

- Main calculator: `/calculators/compound-interest/`
- Browsable examples index: `/calculators/compound-interest/examples/`
- Generated example: `/calculators/compound-interest/{slug}/`
- Main FIRE calculator: `/calculators/fire-calculator/`
- Browsable FIRE examples index: `/calculators/fire/examples/`
- Generated FIRE example: `/calculators/fire/{slug}/`

The original 30 compound-interest proof-of-concept records remain unchanged,
with 70 controlled records added around them. FIRE remains a controlled
30-page proof of concept.

## Shared architecture

The system separates source data, calculation/content generation, rendering,
and validation:

- `src/lib/programmatic-seo/audit.ts`
  - Enforces expected count, valid and unique slugs, unique visible and SEO
    titles, unique non-empty descriptions, and correct unique canonical paths.
- `src/lib/programmatic-seo/paths.ts`
  - Builds normalized canonical paths for generated pages.
- `src/lib/programmatic-seo/examples.ts`
  - Groups records for server-rendered examples indexes.
- `src/lib/programmatic-seo/types.ts`
  - Defines reusable page-model, table, link, FAQ, breadcrumb, result, section,
    and chart types.
- `src/lib/programmatic-seo/metadata.ts`
  - Creates consistent SEO titles and meta descriptions.
- `src/lib/programmatic-seo/schema.ts`
  - Creates FAQPage and breadcrumb structured data and safely serializes JSON-LD.
- `src/components/programmatic-seo/ProgrammaticSeoPage.astro`
  - Renders the shared article shell while allowing cluster-specific formula,
    table, chart, CTA, and related-page labels.
- `src/data/programmatic-seo/clusters.ts`
  - Registers each cluster for the global `/examples/` hub.
- `src/pages/examples/index.astro`
  - Provides a crawlable overview of every current cluster and representative
    generated pages.

Cluster-specific modules remain responsible for calculations and content:

- `src/data/programmatic-seo/compound-interest.ts`
  - Defines the record shape.
  - Preserves the original 30 records.
  - Generates the controlled 70-record expansion.
  - Exports the expected page count.
- `src/lib/programmatic-seo/compound-interest.ts`
  - Reuses the existing compound-interest formula from `src/lib/math`.
  - Builds page titles, descriptions, results, projections, FAQs, related
    links, and the Compound Interest page model.
- `src/data/programmatic-seo/fire.ts`
  - Defines the controlled FIRE record set and expected count.
- `src/lib/programmatic-seo/fire.ts`
  - Reuses FIRE math helpers and builds FIRE-specific answers, sensitivity
    tables, FAQs, related links, and page models.
- `src/pages/calculators/compound-interest/[slug].astro`
  - Runs the audit during static generation.
  - Creates one route for every valid record.
- `src/pages/calculators/compound-interest/examples/index.astro`
  - Renders grouped links to all 100 examples in indexable HTML.
  - Adds client-side search without hiding links from crawlers.

The shared layer intentionally does not know how compound interest or FIRE is
calculated. It also does not choose record variables, write cluster-specific
copy, score related pages, or define index card text.

## Record model

Each compound-interest record contains:

- `slug`
- `question`
- `principal`
- `annualRatePercent`
- `years`
- `monthlyContribution`
- `periodsPerYear`
- optional `featured`

The current cluster intentionally uses no recurring contributions and annual
compounding. That keeps search intent and page comparisons focused on the
question:

> How much will $X grow at Y% for Z years?

The calculator formula itself is not duplicated or modified. Generated pages
call the same `calculateCompoundInterest` implementation as the interactive
calculator.

## Expansion strategy

The first 30 records are listed explicitly and must not be removed or have
their slugs changed.

The additional 70 records use ten starting amounts:

- $2,000
- $3,000
- $6,000
- $12,000
- $18,000
- $35,000
- $60,000
- $80,000
- $125,000
- $150,000

Each amount is paired with seven rate/time scenarios:

- 3% for 5 years
- 4% for 10 years
- 5% for 15 years
- 6% for 20 years
- 7% for 25 years
- 8% for 30 years
- 9% for 40 years

This matrix broadens coverage without creating thousands of thin,
near-duplicate pages.

## Examples index

The examples index groups records into four starting-balance ranges:

- Below $5,000
- $5,000 to $24,999
- $25,000 to $74,999
- $75,000 and above

All links are present in the server-rendered HTML. Search filters cards and
groups in the browser by question, slug, principal, formatted principal, rate,
or years.

## Internal linking

The cluster is connected through:

- A prominent examples-index link on the Compound Interest Calculator.
- Featured example links on the calculator.
- An examples-index link on every generated page.
- Four related generated examples selected by numeric similarity.
- Links from the main compound-interest guide.
- Links from topical compound-interest guides.
- A link from the CAGR vs Compound Interest comparison guide.
- Related calculator and guide links on each generated page.

## Required build audit

Every cluster audit must call `auditProgrammaticSeoRecords` during static path
generation. It validates:

- Expected record count.
- Valid and unique slugs.
- Unique visible titles and SEO titles.
- Non-empty and unique meta descriptions.
- Canonical paths matching the cluster route pattern.
- Unique canonical paths.

A failed audit stops `npm run build`; it is not a warning.

## Required browser coverage

Every cluster must test:

- The all-record metadata audit and exact expected count.
- The examples index heading, canonical URL, total links, and unique hrefs.
- Search and clear behavior when the index is searchable.
- At least one representative generated page.
- One H1, canonical URL, internal calculator/examples links, successful
  response, and absence of page errors.

The global `/examples/` hub must test its canonical URL, one H1, all registered
cluster links, representative generated-page links, and absence of page errors.

## Adding a new cluster

1. Define a typed record module under `src/data/programmatic-seo/`.
2. Set an explicit expected page count.
3. Create a cluster page-model builder under `src/lib/programmatic-seo/` that
   reuses existing calculator/math helpers.
4. Use `createProgrammaticCanonicalPath` for generated URLs.
5. Wrap `auditProgrammaticSeoRecords` with a small cluster-specific audit
   function.
6. Add a static `[slug].astro` route that runs the audit before returning paths.
7. Add a crawlable examples index. Use `createProgrammaticExampleGroups` when
   records are grouped.
8. Register the cluster in `src/data/programmatic-seo/clusters.ts`.
9. Add calculator, guide, cluster-index, and global-hub internal links.
10. Add the required audit, index, generated-page, and no-page-error tests.
11. Preserve existing live slugs and routes.
12. Run:

   ```sh
   npm run build
   npm run test:calculators
   ```

Do not scale a cluster beyond its controlled validation size until the
previous cluster has real production indexing data. Build success and local
tests prove technical correctness; they do not prove search demand, index
quality, or traffic value.

## Quality rules

Every generated page must have:

- A unique title and meta description.
- One H1.
- A canonical URL.
- FAQ and breadcrumb structured data.
- A calculated answer and contribution/growth breakdown.
- A formula explanation.
- A year-by-year projection table.
- A growth chart.
- Assumptions and limitations.
- Links to the main calculator, examples index, related examples, calculators,
  and guides.
- Responsive layout, dark-mode support, static HTML, and indexable content.

Do not mass-generate additional clusters until their records, templates,
internal links, audits, and browser coverage meet the same standard, and the
previous cluster has production indexing data.

## FIRE proof-of-concept cluster

Status: implemented as a controlled 30-page static cluster.

Routes:

- Main calculator: `/calculators/fire-calculator/`
- Browsable examples index: `/calculators/fire/examples/`
- Generated example: `/calculators/fire/{slug}/`

The dataset is defined in `src/data/programmatic-seo/fire.ts` and contains:

- 20 FIRE-number pages based on annual retirement spending.
- 10 portfolio-versus-spending checks.
- A fixed expected count of 30.

The page-model builder in `src/lib/programmatic-seo/fire.ts` reuses:

- `calculateFireNumber`
- `calculateWithdrawalIncome`
- `calculateWithdrawalPlan`

No FIRE calculator formula is copied or changed. The generated content uses the
same math helpers as the interactive calculator.

Each page includes:

- A unique title and meta description.
- A canonical path under `/calculators/fire/`.
- One H1.
- A short calculated answer.
- FIRE number and annual/monthly spending assumptions.
- A withdrawal-rate explanation.
- A five-row withdrawal-rate comparison table.
- Assumptions and limitations.
- FAQPage and breadcrumb structured data.
- Related FIRE examples, calculators, and guides.
- Links to the FIRE Calculator, FIRE examples index, Beginner’s Guide to FIRE,
  What Is FIRE guide, and FIRE vs Coast FIRE guide.

The examples index exposes all 30 links in server-rendered HTML and groups them
into:

- FIRE numbers by annual spending.
- Portfolio and spending checks.

Client-side search filters by question, slug, spending amount, portfolio
amount, or intent without removing links from the indexable source HTML.

`auditFireSeoRecords` runs during static generation and fails the build when
the cluster has:

- A count other than 30.
- Invalid or duplicate slugs.
- Duplicate titles.
- Duplicate descriptions.
- Incorrect or duplicate canonical paths.

Playwright coverage checks the FIRE audit, all 30 index links, index search,
one H1, canonical URLs, the internal FIRE Calculator link, the comparison
table, successful responses, and absence of page errors.
