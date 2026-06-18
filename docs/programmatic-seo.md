# Programmatic SEO System

## Current production scope

The first production cluster contains 100 static compound-interest examples.
The original 30 proof-of-concept records remain unchanged, with 70 controlled
records added around them.

Routes:

- Main calculator: `/calculators/compound-interest/`
- Browsable examples index: `/calculators/compound-interest/examples/`
- Generated example: `/calculators/compound-interest/{slug}/`

The build currently treats 100 generated compound-interest pages as an
invariant. Changing that number requires an intentional update to both the data
and expected-count constant.

## Architecture

The system separates source data, calculation/content generation, rendering,
and validation:

- `src/data/programmatic-seo/compound-interest.ts`
  - Defines the record shape.
  - Preserves the original 30 records.
  - Generates the controlled 70-record expansion.
  - Exports the expected page count.
- `src/lib/programmatic-seo/compound-interest.ts`
  - Reuses the existing compound-interest formula from `src/lib/math`.
  - Builds page titles, descriptions, results, projections, FAQs, related
    links, and canonical paths.
  - Audits count and metadata uniqueness.
- `src/components/programmatic-seo/ProgrammaticSeoPage.astro`
  - Renders the shared article, result summary, formula, chart, projection
    table, FAQs, and internal links.
- `src/pages/calculators/compound-interest/[slug].astro`
  - Runs the audit during static generation.
  - Creates one route for every valid record.
- `src/pages/calculators/compound-interest/examples/index.astro`
  - Renders grouped links to all 100 examples in indexable HTML.
  - Adds client-side search without hiding links from crawlers.

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

## Build audit

`auditCompoundInterestSeoRecords` runs during static path generation and throws
on any failure. It validates:

- Expected record count.
- Valid and unique slugs.
- Unique SEO titles.
- Non-empty and unique meta descriptions.
- Canonical paths matching
  `/calculators/compound-interest/{slug}/`.
- Unique canonical paths.

A failed audit stops `npm run build`; it is not a warning.

## Browser coverage

`tests/calculators.spec.ts` covers:

- The all-record metadata audit.
- The examples index heading, canonical URL, four groups, 100 links, and unique
  hrefs.
- Search and clear behavior on the examples index.
- Representative generated pages from both the original and expanded datasets.
- One H1, title, description, canonical URL, projection-row count, internal
  examples link, successful response, and absence of page errors.

## Adding or changing records

1. Preserve existing live slugs.
2. Add records in the data module or extend the controlled expansion matrix.
3. Update `EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT`.
4. Confirm the scenario adds distinct search intent and useful comparison
   value.
5. Run:

   ```sh
   npm run build
   npm run test:calculators
   ```

6. Do not ship if the audit reports duplicate metadata or canonical paths.

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
internal links, audits, and browser coverage meet the same standard.
