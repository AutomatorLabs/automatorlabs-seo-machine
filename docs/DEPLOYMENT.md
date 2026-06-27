# Deployment Workflow

Operator checklist for releasing the live AutomatorLabs site.

This document is intentionally procedural. It mixes repo-proven steps with external operator checks that happen in Netlify, search consoles, and analytics tools.

## Before You Release

Do not deploy casually if the change touches any of these areas without strong reason and full verification:

- shared calculator math in `src/lib/math.ts`
- calculator registries in `src/data/content.ts`, `src/data/calculators.ts`, or `src/data/calculator-categories.ts`
- `src/layouts/Layout.astro` metadata behavior
- programmatic SEO cluster generation or canonical logic
- newsletter acquisition behavior

If a change is documentation-only, do not deploy just to publish docs unless there is a deliberate reason.

## Local Verification

Run the standard release check locally:

```sh
npm run verify
git diff --check
```

Expected behavior:

- `npm run verify` passes `build`, `audit:seo`, and `test:calculators`
- `git diff --check` returns clean
- there are no unresolved merge markers, whitespace errors, or half-finished edits

## Git Status Expectations

Before commit:

- `git status` should show only intentional files
- no accidental `dist/` output or scratch files should be staged
- doc-only releases should not include production code unless intentionally bundled

Before push:

- re-read `git diff --stat` or `git diff --cached`
- confirm the scope still matches the intended release
- confirm no secrets, local notes, or experimental files are included

## Commit And Push Flow

Standard release sequence:

```sh
git status
git add <intended files>
git commit -m "Describe the release change"
git push
```

Recommended habits:

- keep commit messages specific
- avoid mixing low-risk release work with large refactors
- prefer one coherent release scope per push

Needs confirmation:

- default branch name
- whether deploys happen automatically on push or from a manual Netlify promotion step

## Netlify Deploy Check

The repo docs now assume Netlify is part of the live workflow, but the exact project settings are not source-controlled here.

After push:

1. Open the AutomatorLabs site in Netlify.
2. Confirm a new deploy was triggered for the expected branch or commit.
3. Wait for the deploy to finish successfully.
4. Confirm the published deploy matches the intended commit SHA.
5. If Netlify shows warnings, read them before treating the release as complete.

Check at minimum:

- build succeeded
- deploy was published to production, not just a preview
- no missing environment or dependency failures appeared

## Live Site Smoke Test

After the production deploy is live, test the public site:

1. Open the homepage.
2. Open `/calculators/`.
3. Open one representative calculator page.
4. Open one representative guide page.
5. Open one representative programmatic SEO example page.
6. Confirm canonical URL, page title, and description look correct.
7. Confirm the newsletter CTA still renders where expected.
8. Confirm no obvious broken layout, missing styles, or client-side errors.

Recommended sample pages:

- `/`
- `/calculators/`
- `/status/`
- one high-traffic calculator route
- one `/guides/...` route
- one `/calculators/.../examples/` or generated example route

Recommended quick verification URL:

- `/status/` for one static page that confirms the shared layout, source-backed counts, and public smoke-test links are all rendering in production

## Sitemap URL Check

After deploy, verify the live sitemap URLs load:

- `https://automatorlabs.com/sitemap-index.xml`
- linked sitemap files referenced from the index

Confirm:

- the sitemap index returns successfully
- sitemap URLs use the correct production domain
- recently added routes appear where expected

## Google Search Console Sitemap Resubmission

After a release that changes URLs, internal linking, metadata, or page generation:

1. Open Google Search Console for the live AutomatorLabs property.
2. Go to `Sitemaps`.
3. Enter or re-enter `sitemap-index.xml` if needed.
4. Submit the sitemap.
5. Confirm Google accepts the sitemap URL.
6. Check for immediate parse or fetch errors.

Also review:

- coverage or indexing anomalies
- sudden spike in excluded pages
- canonical disagreements if visible

## Bing Webmaster Tools Sitemap Resubmission

After the same classes of release, repeat the sitemap step in Bing:

1. Open Bing Webmaster Tools for AutomatorLabs.
2. Navigate to the sitemap submission area.
3. Submit `https://automatorlabs.com/sitemap-index.xml` if it is not already current.
4. Confirm Bing accepts the sitemap.
5. Check for fetch or format errors.

## GA4 Realtime Check

After the production release:

1. Open GA4 for AutomatorLabs.
2. Go to `Realtime`.
3. Visit the live site in a clean browser session.
4. Confirm your page view appears.
5. Spot-check that the visited route is visible in realtime reporting.

This is only a quick instrumentation sanity check, not a full analytics audit.

## Microsoft Clarity Check

After the production release:

1. Open the AutomatorLabs project in Microsoft Clarity.
2. Confirm the tracking project is still receiving data after the release window.
3. If available, confirm a fresh page view or recording arrives from the live site test.

This is a basic signal that the script still loads on production pages.

## Rollback And Tag Usage

Use tags and rollback deliberately:

- tag known good release points before or after important production changes
- if a release is broken, prefer rolling back to the last known good deploy instead of patching blindly under pressure
- record the rollback reason in the next changelog or release note

Suggested release habit:

1. identify the last known good commit or tag
2. use Netlify rollback or redeploy that artifact if production is broken
3. fix forward only after the site is stable again

Needs confirmation:

- exact historical tag naming convention
- whether rollbacks are typically done from Git or directly from Netlify

## What Not To Deploy Casually

- changes to shared metadata logic without rerunning `npm run verify`
- changes to calculator formulas without explicit validation
- large registry refactors
- topic-link rewrites without rerunning `npm run audit:seo`
- partial programmatic SEO cluster launches
- newsletter CTA changes without checking live acquisition surfaces

## Minimal Release Checklist

Use this as the short operational checklist:

1. Run `npm run verify`.
2. Run `git diff --check`.
3. Confirm `git status` only contains intentional changes.
4. Commit and push the intended release.
5. Confirm the Netlify production deploy succeeds.
6. Smoke-test the live site.
7. Open `/status/` and confirm the status page renders with the expected counts and smoke-test links.
8. Confirm `https://automatorlabs.com/sitemap-index.xml` loads.
9. Resubmit the sitemap in Google Search Console if the release affects discovery or indexing.
10. Resubmit the sitemap in Bing Webmaster Tools if the release affects discovery or indexing.
11. Confirm GA4 realtime receives a live page view.
12. Confirm Microsoft Clarity still receives production traffic.
