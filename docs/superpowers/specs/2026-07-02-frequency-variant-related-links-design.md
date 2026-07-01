# Design: Related-Calculator Links to Frequency-Variant Calculators

Date: 2026-07-02

## Problem

Seven calculators are frequency/variant tools that were deliberately built instead of dedicated programmatic-SEO clusters:

- `daily-compound-interest-calculator`
- `monthly-compound-interest-calculator`
- `quarterly-compound-interest-calculator`
- `annual-compound-interest-calculator`
- `daily-savings-calculator`
- `weekly-savings-calculator`
- `401k-growth-calculator`

They are live, discoverable calculator pages (registered in `src/data/content.ts`), but the four related 200-page programmatic-SEO clusters — compound-interest, investment-growth, savings-growth, and 401(k) — do not link to most of them from their `relatedCalculators` blocks in `src/lib/programmatic-seo/*.ts`. That leaves these seven pages with little to no inbound linking from the site's largest internal-link surfaces.

## Findings from auditing the current implementation

- Each cluster's `relatedCalculators` array is hardcoded per cluster in its lib file (`src/lib/programmatic-seo/compound-interest.ts`, `investment-growth.ts`, `savings-growth.ts`, `401k.ts`), rendered as-is by `src/components/programmatic-seo/ProgrammaticSeoPage.astro` (a plain `.map()` over the array in a CSS grid — no count limit enforced by code).
- `investment-growth.ts` already pushes a `401(k) Growth Calculator` link for `intent === 'retirement-investing'` records (~24 of 200 pages) — so 401k-growth-calculator is not receiving literally zero links project-wide, but it is absent from the 401(k) cluster itself, which is its most natural home (that cluster's own record slugs are prefixed `401k-growth-*`).
- `apy.ts` already conditionally links `daily-compound-interest-calculator` and `monthly-compound-interest-calculator` for matching intents, and `monthly-savings.ts` already links `weekly-savings-calculator` unconditionally. These are outside the four clusters in scope here and are left untouched.
- The compound-interest cluster's 200 records are all generated with `periodsPerYear: 1` (i.e., every example already models annual compounding). Every existing cluster caps `relatedCalculators` at 3-4 items; none currently reach 7.
- `auditProgrammaticSeoRecords` (the build-time cluster audit) checks record counts, slug validity/uniqueness, title/meta-description uniqueness, and canonical path correctness. It does not validate `relatedCalculators` contents or count, so these additions carry no audit risk beyond keeping the array well-formed.

## Goals

- Give each of the 7 target calculators new inbound links from the compound-interest, investment-growth, savings-growth, and 401(k) clusters, without pushing any cluster's `relatedCalculators` count far past the site's existing 3-4 item norm.
- Keep the additions deterministic and free of new data fields — compute rotation from properties already present on each record.

## Non-goals

- No changes to `src/data/programmatic-seo/*.ts` record data, `auditProgrammaticSeoRecords`, or `ProgrammaticSeoPage.astro`.
- No changes to `apy.ts` or `monthly-savings.ts` (already link some of these calculators; out of scope).
- No changes to calculator math, `content.ts` registrations, or `related-calculators.ts` (that logic serves calculator-to-calculator pages, not programmatic clusters).

## Design

### 1. Compound-interest cluster — `src/lib/programmatic-seo/compound-interest.ts`

`createCompoundInterestSeoPage`'s `relatedCalculators` array currently has 3 static items (Compound Interest Calculator, Inflation Calculator, CAGR Calculator). Add a 4th item chosen by `record.years % 4`:

| `record.years % 4` | Link |
| --- | --- |
| `0` | **Annual Compound Interest Calculator** — `/calculators/annual-compound-interest-calculator/` — "Use a calculator locked to annual compounding if you don't need to change the frequency." |
| `1` | **Daily Compound Interest Calculator** — `/calculators/daily-compound-interest-calculator/` — "Run the same balance and rate with interest compounding daily instead of once a year." |
| `2` | **Monthly Compound Interest Calculator** — `/calculators/monthly-compound-interest-calculator/` — "Run the same balance and rate with interest compounding monthly instead of once a year." |
| `3` | **Quarterly Compound Interest Calculator** — `/calculators/quarterly-compound-interest-calculator/` — "Run the same balance and rate with interest compounding quarterly instead of once a year." |

Implement as a small `frequencyVariantCalculatorFor(record: CompoundInterestSeoRecord): ProgrammaticSeoLink` function (mirrors the existing `frequencyLabel` helper style in the same file), called from `createCompoundInterestSeoPage` and appended to the existing 3-item array. Result: 4 `relatedCalculators` items per page, ~50 of the 200 pages linking to each frequency variant.

### 2. Savings-growth cluster — `src/lib/programmatic-seo/savings-growth.ts`

`relatedCalculatorsFor` currently returns 3 static items plus 1 intent-based item (4 total). Add a 5th item chosen by `record.years % 2`:

| `record.years % 2` | Link |
| --- | --- |
| `0` | **Daily Savings Calculator** — `/calculators/daily-savings-calculator/` — "Work backward from a future target if you need a required daily savings amount instead of a growth projection." |
| `1` | **Weekly Savings Calculator** — `/calculators/weekly-savings-calculator/` — "Work backward from a future target if you need a required weekly savings amount instead of a growth projection." |

Append this inside `relatedCalculatorsFor` after the existing intent-based `calculators.push(...)` block, so every record ends up with 5 `relatedCalculators` items (3 static + 1 intent-based + 1 frequency-rotated).

### 3. 401(k) cluster — `src/lib/programmatic-seo/401k.ts`

`create401kSeoPage`'s `relatedCalculators` array currently has 3 static items (401(k) Calculator, 401(k) Contribution Calculator, Employer Match Calculator). Add a 4th static item, unconditionally, to every record (no rotation needed — it fits every record equally):

**401(k) Growth Calculator** — `/calculators/401k-growth-calculator/` — "Model the same starting balance, contributions, and employer match with this dedicated growth-focused calculator."

### 4. Investment-growth cluster — `src/lib/programmatic-seo/investment-growth.ts`

`relatedCalculatorsFor` already branches on `record.intent` to append a 4th item (`retirement-investing` → 401(k) Growth Calculator already present and unchanged; `taxable-investing` → Taxable vs Tax-Advantaged; `index-fund-investing`/`etf-investing` → ETF Fee Drag; else → Lump Sum vs DCA). Add two more `else if` branches so `monthly-investing` and `annual-investing` records get a 5th item instead of falling into the existing `else` (Lump Sum vs DCA) branch:

- `intent === 'monthly-investing'` → **Monthly Compound Interest Calculator** — `/calculators/monthly-compound-interest-calculator/` — "Compare this contribution plan against a dedicated monthly-compounding calculator."
- `intent === 'annual-investing'` → **Annual Compound Interest Calculator** — `/calculators/annual-compound-interest-calculator/` — "Compare this contribution plan against a dedicated annual-compounding calculator."

These are *additional* items (pushed alongside, not replacing, the existing Lump Sum vs DCA push those two intents currently fall through to) — confirm during implementation whether `monthly-investing`/`annual-investing` currently hit the `else` branch (they do, per current code) and add the new push without removing the existing one, since removing an existing working link isn't part of this task's goal.

The other 5 intents (`lump-sum`, `retirement-investing`, `taxable-investing`, `index-fund-investing`, `etf-investing`, `wealth-accumulation`) are unchanged.

## Testing / Verification

- No new unit test files. Run `npm run verify` (build + `audit:seo` + Playwright `tests/*.spec.ts`) as the existing gate — it will catch broken links, schema issues, or audit regressions from the added link objects.
- After building, grep `dist/` for each of the 7 target calculator URLs appearing within the corresponding cluster's generated page output, to confirm the new links actually render (not just present in source).
- Manually spot-check one page per rotation bucket (e.g., a compound-interest page with `years % 4 === 0, 1, 2, 3`) to confirm the correct variant link and description appear.

## Global constraints (verbatim values for implementation)

- Exact rotation formulas: `record.years % 4` (compound-interest), `record.years % 2` (savings-growth).
- Exact URLs, titles, and descriptions for every new link are listed verbatim in sections 1-4 above — use them exactly, do not paraphrase.
- Do not modify `apy.ts`, `monthly-savings.ts`, record data files, `audit.ts`, or `ProgrammaticSeoPage.astro`.
- Do not remove any existing `relatedCalculators` entries in any of the 4 files — all changes are additive.
