# FIRE Cluster Redesign — Design

Date: 2026-07-09

Status: **spec only — not approved for implementation.** Do not build against this until it is reviewed and a follow-up implementation plan is written and approved.

## Background

Google Search Console currently reports 63 site pages as "crawled - currently not indexed," of which 24 are FIRE cluster example pages (`/calculators/fire/<slug>/`). A same-day sitemap audit (see conversation history, no separate doc) confirmed this is not a sitemap-delivery problem — the live sitemap is complete and matches the current build exactly. The FIRE cluster itself is a plausible content-quality contributor: Google deprioritizes crawling/indexing pages it judges as thin or duplicate, and this cluster is unusually duplicate-heavy relative to the rest of the site.

Mechanically verified against the live 200-record `fireSeoRecords` array (`src/data/programmatic-seo/fire.ts`):

- 81 `spending-target` records collapse to **29 unique `annualSpending` values**.
- 119 `portfolio-check` records collapse to **40 unique `(portfolioValue, annualSpending)` pairs**.
- **41 of the 69 unique groups have more than one record** — 172 of the 200 records (86%) belong to a group where the *only* varying field is `withdrawalRatePercent` (typically 3%, 3.5%, 4%, 4.5%, 5% for the same spending/portfolio combination).
- Example group: `retire-spending-30000-per-year` variants at 3%, 3.5%, 4.5%, 5% (plus the implicit 4% base record) are five separate URLs that differ in exactly one input.

This is structurally different from the two most recently shipped clusters. Net Worth (`src/data/programmatic-seo/net-worth.ts`) uses 5 intents that are **sign-asserted** — `underwater-household` is build-time-audited to always produce negative net worth, `debt-free-saver` always positive — so the intent changes the narrative, not just the input labels. 529 College Savings uses 5 life-stage intents tied to genuinely different time horizons, each rendering its own 18+ point year-by-year chart. FIRE's 2 intents (`spending-target`, `portfolio-check`) don't force any narrative or outcome difference, and its builder (`src/lib/programmatic-seo/fire.ts`) is fully templated — the same sentence skeletons render on every page with only numbers substituted.

One relevant thing the current builder already does right: `createSensitivityTable()` (`src/lib/programmatic-seo/fire.ts:97-140`) already renders a 3%/3.5%/4%/4.5%/5% comparison table on **every** page, portfolio-check and spending-target alike. In other words, the "compare this scenario across withdrawal rates" content this redesign wants to make load-bearing already exists in the template — it's just currently duplicated identically across every rate-variant page instead of being the reason a single page exists.

## Goal

Collapse the near-duplicate rate-variant groups into one canonical page per group, redesign the intent model to be outcome-aware (matching the net-worth standard), and reduce total page count instead of preserving the fixed 200. Every removed URL gets a 301 redirect to its surviving group's page.

## Scope Simplification: Rate Collapse

**Current:** `withdrawalRatePercent` is a per-record varying field for `spendingTargetVariantFireSeoRecords` (14 amounts × 4 rates) and `priorityPortfolioFireSeoRecords` / `additionalPortfolioFireSeoRecords` (18 pairs × 4 rates + 9 pairs × 3 rates).

**Redesigned:** `withdrawalRatePercent` is no longer a record field at all. Every page is generated at the standard 4% planning rate (matching `coreFireSeoRecords` / `longTailFireSeoRecords`, which already don't vary rate), and the existing `createSensitivityTable()` — already present, unchanged — is what tells the visitor how the outcome moves across 3%–5%. This is not new content generation, it's promoting the table that already exists to be the primary reason the page justifies its own URL.

**Resulting record set:**

- `spending-target`: 29 unique `annualSpending` values (down from 81 records / 4-5 duplicate rate variants each)
- `portfolio-check`: 40 unique `(portfolioValue, annualSpending)` pairs (down from 119 records)
- **Total: 69 pages, down from 200 (a 65% reduction)**

This intentionally does not hit any fixed target count — 69 is what falls out of de-duplicating by genuine input distinctness, which is the point (stop treating "200" as a design constraint per cluster).

## Intents: Redesigned To The Net-Worth Standard

**Current:** 2 intents (`spending-target`, `portfolio-check`) that only change question phrasing, not narrative substance.

**Redesigned:** 4 intents, chosen so each one is either sign-asserted (like net-worth) or maps to an already-existing, already-computed narrative branch in the builder (`fireStyleFor`, `isFunded`) rather than inventing new ones:

### 1. `underfunded-portfolio-check` — portfolio below the 4% FIRE number

Sign-asserted: `plan.portfolioGap < 0` for every record, mirroring net-worth's `underwater-household` check. The builder already computes `isFunded` (`src/lib/programmatic-seo/fire.ts:207`) and already branches the summary sentence on it — this intent formalizes that existing branch into an audited invariant instead of an incidental outcome.

### 2. `funded-portfolio-check` — portfolio at or above the 4% FIRE number

Sign-asserted: `plan.portfolioGap >= 0` for every record. Mirrors net-worth's `debt-free-saver`.

### 3. `lean-spending-target` — `annualSpending <= 50000`

Reuses the existing `fireStyleFor()` / `fireStyleFraming()` logic (`src/lib/programmatic-seo/fire.ts:37-53`), which already exists but is currently applied identically regardless of intent. Making it intent-defining means the FAQ/section framing text becomes genuinely distinguishing instead of decorative.

### 4. `fat-spending-target` — `annualSpending >= 125000`

Same mechanism as #3, opposite end of the existing style thresholds.

**Open question for the follow-up implementation plan:** the current "regular" middle band (`50000 < annualSpending < 125000`, ~14 of the 29 unique spending amounts by rough count) has no sign-invariant or style-extreme hook the way the other four intents do. Options to resolve before implementation: (a) keep `regular-spending-target` as a 5th, non-sign-asserted intent — consistent with net-worth, which also has 3 non-sign-asserted intents alongside its 2 sign-asserted ones — or (b) fold "regular" spending amounts into whichever of lean/fat they're numerically closer to. Recommend (a): it matches the precedent net-worth already set (not every intent needs to be sign-asserted) and avoids arbitrarily reclassifying a spending amount that is genuinely "middle of the range."

## New Sign-Invariant Audit

Following `auditNetWorthSeoRecords`'s pattern exactly: `auditFireSeoRecords` (or a new wrapper) must, after the generic uniqueness audit, compute `calculateWithdrawalPlan` for every `portfolio-check` record and assert `portfolioGap < 0` when `intent === 'underfunded-portfolio-check'` and `portfolioGap >= 0` when `intent === 'funded-portfolio-check'`, throwing a build-time error on violation — not a runtime check, a data-authoring check, same as net-worth's.

## Migration & 301 Redirects

131 of the current 200 URLs disappear (200 total − 69 surviving groups). Every removed URL must 301 to its surviving group's new canonical URL.

Recommended mechanism: **`public/_redirects`** (Netlify's static redirect file format). This is inferred from live response headers (`server: Netlify`, `cache-status: "Netlify Edge"`) observed during a same-day production check, not from repo config — `docs/DEPLOYMENT.md` explicitly states hosting platform is not repo-confirmed. **This assumption must be confirmed with the user/operator before the implementation plan finalizes on this mechanism** — if hosting isn't actually Netlify, an Astro-level `redirects` config in `astro.config.mjs` (supported natively since Astro 3) is the platform-agnostic fallback and should be the default if Netlify isn't confirmed.

Concretely, the implementation plan should:

1. Before rewriting `src/data/programmatic-seo/fire.ts`, snapshot the current 200 records (slug + grouping key) as a fixture — e.g. a throwaway script run once against the current file, output committed as a small JSON/TS mapping table of `{ oldSlug, newSlug }` for the 131 removed records. This is a one-time migration artifact, not permanent app code.
2. Generate the redirect rules from that fixture (`/calculators/fire/<oldSlug>/ /calculators/fire/<newSlug>/ 301` per line for `_redirects`, or an array of `{ source, destination, status: 301 }` for `astro.config.mjs`), so redirects are mechanically derived from real old→new slug pairs rather than hand-typed.
3. Verify every redirect target slug actually exists in the new 69-record set before committing (a redirect to a dead slug is worse than no redirect).
4. Keep the fixture file in the repo (e.g. alongside the spec/plan under `docs/superpowers/` or a `scripts/` migration folder) so the mapping is auditable later, even though it's not imported by runtime code.

## Page Content Model Changes

- `showChart` stays `false` (unchanged — this was never a time-series cluster).
- `table` (the existing sensitivity comparison) is promoted from decorative to primary: update its heading/framing copy to make clear this table is the page's core answer to "what if the rate is different," not a footnote.
- `summary` narrative: extend the existing `isFunded` branch (currently one sentence) into a fuller funded/underfunded framing paragraph, following net-worth's `isPositive ? ... : ...` pattern (`src/lib/programmatic-seo/net-worth.ts` summary section) rather than the current single-clause substitution.
- Add one new FAQ entry per portfolio-check intent: "What if my portfolio is below the FIRE number?" (underfunded) / "What if my portfolio is already above the FIRE number?" (funded) — both answerable from data already computed in the builder (`plan.portfolioGap`), no new math.
- `relatedPages` scoring (`src/lib/programmatic-seo/fire.ts:65-92`) currently penalizes cross-intent matches by a flat `+0.4`. With 4 outcome-driven intents instead of 2 phrasing-only ones, re-check whether that penalty still produces sensible "related" picks — worth a look during implementation but not a blocking design question.

## Testing

Following the established pattern (same shape as the net-worth plan's testing section):

- Update the record-count audit to the new expected count (69, not 200) — `EXPECTED_FIRE_SEO_PAGE_COUNT`.
- New sign-invariant test coverage for both `underfunded-portfolio-check` and `funded-portfolio-check`, same shape as net-worth's.
- Examples-index test updates for the new (smaller) card count.
- A redirect-verification test or script: every `{ oldSlug, newSlug }` fixture entry's `newSlug` must resolve to a real generated page — run this as part of `npm run verify` or a dedicated check before the redirects file ships.
- `npm run verify` must pass before this is considered done.

## Launch Checklist (for the follow-up implementation plan, not this spec)

1. Confirm hosting platform (Netlify vs. other) to lock the redirect mechanism.
2. Resolve the open "regular-spending-target" intent question above.
3. Generate and hand-verify the old→new slug migration fixture from the *current* 200-record file before touching it.
4. Rewrite `src/data/programmatic-seo/fire.ts` to the new 69-record, 4-5 intent model.
5. Update `src/lib/programmatic-seo/fire.ts`: new sign-invariant audit, promoted sensitivity table framing, extended funded/underfunded summary, new FAQ entries.
6. Add the redirects (mechanism per #1).
7. Update `docs/programmatic-seo.md` cluster-notes entry and counts (200 → 69, 2 → 4-5 intents).
8. Update any calculator-page `exampleItems` wiring that references now-removed FIRE slugs (see the concurrent internal-linking work touching `fire-calculator`, `barista-fire-calculator`, `fat-fire-calculator`, `lean-fire-calculator` — those pages' featured-example picks will need re-selection against the new 69-record set once this ships).
9. Run `npm run build`, `npm run audit:seo`, `npm run test:calculators`.

## Out Of Scope

- Any change to `calculateFireNumber`, `calculateWithdrawalIncome`, or `calculateWithdrawalPlan` math (approval-gated; not requested, and not needed — this is a record-model and content-model change only).
- Redesigning Coast FIRE, Safe Withdrawal Rate, or other FIRE-adjacent clusters — this spec is scoped to the `fire` cluster only, though the same near-duplicate-by-single-parameter pattern is worth auditing in other clusters separately (not assessed here).
- Actually writing any code — per instruction, this is spec-only. A separate implementation plan (`docs/superpowers/plans/...`) is required before building, following this repo's established two-stage spec-then-plan convention.
