# Local Release Audit

This is a dated point-in-time report from June 14, 2026. Treat it as historical release context, not the current live state of the repository.

Date: June 14, 2026

Status: **Needs Fix**

## Release Gates

- **Build:** Pass. `npm run build` generated 124 pages successfully.
- **Calculator QA:** Needs Fix. `npm run test:calculators` completed with 53 passing tests and 1 failure.
- **Failure:** Emergency Fund Calculator does not submit with its default target of `6` months. The field uses `min="0.01"` and `step="0.5"`, so the browser considers `6` a step mismatch and suggests `5.51` or `6.01`. Native validation blocks the submit event, preventing shareable URL parameters, the share control, and the GA4 calculation event.

## Audit Results

- Live calculator pages contain no "coming soon" text.
- All internal `/calculators/` links found on calculator pages resolve to generated pages.
- Every registered calculator page has exactly one `<h1>`.
- Calculator index search filters cards, updates the count, hides empty groups, and shows the no-results state.
- All six calculator category pages load successfully.
- All 60 generated guide pages build; representative guide navigation loads successfully.
- Dark/light mode passed across the calculator suite except the Emergency Fund test, which stops before its theme assertions. Representative global theme switching passed separately.
- "Share calculation" is hidden initially and appears after a successful FIRE calculation.
- Charts appear only on configured calculators: Compound Interest, FIRE, Investment Fee, DRIP, Mortgage Payoff, and Debt Payoff.
- Calculator SoftwareApplication and FAQPage JSON-LD parsed successfully.
- Guide FAQPage JSON-LD parsed successfully wherever visible FAQs are present.
- No console errors or uncaught page exceptions occurred on the homepage, calculator index, FIRE Calculator, or FIRE guide.

## Recommendation

Fix the Emergency Fund `targetMonths` input constraint so its default value is valid, then rerun `npm run test:calculators` before release.
