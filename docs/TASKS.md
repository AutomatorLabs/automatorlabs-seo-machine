# Tasks

## Immediate

- [ ] Confirm the deployment platform and capture the real deploy workflow.
- [ ] Audit `src/pages/topics/index.astro` against all currently live guides and calculators for stale or missing links.
- [ ] Review whether every new calculator has intentional related-guide and example links.

## Documentation Maintenance

- [ ] Keep current counts synchronized across `README.md`, `PROJECT.md`, `SEO.md`, and `programmatic-seo.md`.
- [ ] Update `CHANGELOG.md` whenever the handbook changes materially.
- [ ] Mark historical planning docs clearly when they no longer reflect live scope.

## SEO / Content Audits

- [ ] Review topic-page link coverage for recently added calculators and guides.
- [ ] Confirm that generated calculator guides remain aligned with the live calculator registry.
- [ ] Document any external Search Console or analytics workflow if it exists outside the repo.

## Engineering Audits

- [ ] Review whether any calculator routes exist that are intentionally not represented in `src/data/content.ts`.
- [ ] Map calculator-family wrapper components to the routes that use them.
- [ ] Document any release workflow outside local build, audit, and Playwright checks once confirmed.
