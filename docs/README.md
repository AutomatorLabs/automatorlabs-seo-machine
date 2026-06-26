# AutomatorLabs Developer Handbook

This `/docs` directory is the repo-local handbook for humans and AI agents working on AutomatorLabs.

The project is a static Astro site for:

- financial calculators
- guide hubs, topical guides, and comparison guides
- worked-example clusters used for programmatic SEO
- newsletter acquisition

Everything important is source-controlled in this repo. There is no visible CMS, API, or backend in the inspected codebase.

## Read Order

Read these files in this order before making meaningful changes:

1. [PROJECT.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/PROJECT.md)
2. [BUSINESS.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/BUSINESS.md)
3. [ARCHITECTURE.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/ARCHITECTURE.md)
4. [CONTENT.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/CONTENT.md)
5. [SEO.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/SEO.md)
6. [programmatic-seo.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/programmatic-seo.md)
7. [STYLE_GUIDE.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/STYLE_GUIDE.md)
8. [AI_WORKFLOW.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/AI_WORKFLOW.md)
9. [CONTRIBUTING.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/CONTRIBUTING.md)
10. [DECISIONS.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/DECISIONS.md)

Use these as supporting or historical references:

- [PROMPTS.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/PROMPTS.md)
- [TASKS.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/TASKS.md)
- [ROADMAP.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/ROADMAP.md)
- [CHANGELOG.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/CHANGELOG.md)
- [DEPLOYMENT.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/DEPLOYMENT.md)
- [calculator-qa-checklist.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/calculator-qa-checklist.md)
- [email-marketing.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/email-marketing.md)
- [local-release-report.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/local-release-report.md)
- [next-seo-roadmap.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/next-seo-roadmap.md)

## Current Repo Facts

Verified from source on 2026-06-27:

- 84 calculator entries in `src/data/content.ts`
- 84 calculator configs in `src/data/calculators.ts`
- 6 calculator category pages
- 10 guide hubs
- 17 topical guides
- 7 comparison guides
- generated calculator guides built from calculator configs
- 13 programmatic SEO clusters
- 200 records per cluster
- 2,600 generated example pages total

## What Future Agents Need To Understand

- Calculators are registry-driven. A new calculator is rarely "done" after adding one route file.
- `src/data/content.ts` is the public index and discovery registry.
- `src/data/calculators.ts` is the shared calculator configuration source of truth.
- Category assignment lives in `src/data/calculator-categories.ts`.
- Generated calculator guides come from `src/data/calculator-guides.ts`.
- Programmatic SEO is controlled and typed, not free-form bulk generation.
- Internal linking is part of the product, not just a nice-to-have.
- Documentation must stay synchronized with counts, route families, and workflows.

## Documentation Rules

- Prefer verified facts over assumptions.
- Use `Needs confirmation` when the repo does not prove a claim.
- Update docs in the same session as architecture, content-model, SEO-system, or workflow changes.
- Do not describe planned work as if it is live.
- Keep examples current with actual route patterns and counts.

## Known Unknowns

These items are still not confirmed by inspected source:

- deployment platform
- deployment trigger workflow
- monetization beyond SEO and newsletter acquisition
- external analytics or Search Console reporting workflow beyond embedded scripts
