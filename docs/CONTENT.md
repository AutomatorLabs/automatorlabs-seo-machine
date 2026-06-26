# Content System

## Content Types

The site currently operates with six major content types:

1. Calculator pages
2. Calculator category pages
3. Guide hubs
4. Topical guides
5. Comparison guides
6. Programmatic worked examples

There is also a topics index that manually curates links across these types.

## Source Of Truth By Content Type

- Calculator configs: `src/data/calculators.ts`
- Calculator public index metadata: `src/data/content.ts`
  - current intent: live calculator discovery only
  - not a universal registry for guides, topics, or examples
- Calculator categories: `src/data/calculator-categories.ts`
- Generated calculator guides: `src/data/calculator-guides.ts`
- Guide hubs: `src/data/guide-hubs.ts`
- Topical guides: `src/data/topical-guides.ts`
- Comparison guides: `src/data/comparison-guides.ts`
- Worked examples on calculator pages: `src/data/calculator-examples.ts`
- Programmatic SEO cluster registry: `src/data/programmatic-seo/clusters.ts`
- Programmatic SEO records: `src/data/programmatic-seo/*.ts`

## Naming Conventions

### IDs

- Public calculator IDs usually end in `-calculator` inside `src/data/content.ts`.
- Internal calculator config IDs in `src/data/calculators.ts` are shorter, route-oriented IDs such as `compound-interest`, `fire`, or `apy`.
- Category slugs are kebab-case and used as route segments.

### Slugs

- Routes are kebab-case.
- Calculator detail routes typically end with `/calculators/<slug>/`.
- Guide routes typically end with `/guides/<slug>/`.
- Example indexes typically end with `/calculators/<cluster>/examples/`.
- Programmatic pages typically end with `/calculators/<cluster>/<slug>/`.

### Titles

- Calculator titles generally end in `Calculator`.
- Guide hub titles are broader educational titles.
- Comparison guide titles use `X vs Y` when helpful.
- Example page titles are scenario-specific and must remain unique within the cluster.

## Calculator Architecture

Every calculator has at least these layers:

1. Public discovery metadata in `src/data/content.ts`
2. Calculator config in `src/data/calculators.ts`
3. Category assignment in `src/data/calculator-categories.ts`
4. Route file under `src/pages/calculators/...`
5. Client-side calculation script inside the route or a shared page component

Today, every item in `src/data/content.ts` is both:

- `category: 'calculator'`
- `status: 'live'`

That means live/planned branching for calculator discovery should be treated as
legacy unless a real planned-content workflow is intentionally reintroduced.

Optional supporting layers:

- worked example in `src/data/calculator-examples.ts`
- featured programmatic example links
- related guide links
- chart rendering
- calculator-family wrapper components such as:
  - `src/components/CompoundGrowthCalculatorPage.astro`
  - `src/components/ApyCalculatorPage.astro`
  - `src/components/RetirementAccountCalculatorPage.astro`
  - `src/components/SavingsTargetCalculatorPage.astro`

## How Page Generation Works

### Calculators

- Astro route files render calculator pages statically.
- Shared layout comes from `src/components/CalculatorPage.astro`.
- Inputs, outputs, FAQs, and educational scaffolding come from data and helper functions.
- Calculation logic runs client-side via inline scripts importing from `src/lib/math.ts`.

### Generated Calculator Guides

- `src/data/calculator-guides.ts` derives guide data from calculator config and content metadata.
- `src/pages/guides/[slug].astro` uses `getStaticPaths()` to emit one route per generated calculator guide and per topical guide.

### Guide Hubs And Comparison Guides

- These use dedicated static route files under `src/pages/guides/...`.
- The route imports a data object or lookup and passes it to a shared page component.

### Programmatic SEO Pages

- Each cluster owns its typed record set and its page-model builder.
- Cluster routes call a cluster audit during `getStaticPaths()`.
- A failed cluster audit should block the build.

## Internal Linking Philosophy

Pages are expected to connect laterally and vertically:

- Homepage -> categories, guides, examples
- Calculator index -> calculators
- Category pages -> calculator details
- Calculator pages -> related calculators, related guides, examples, newsletter
- Guide pages -> matching calculators plus adjacent guides/examples
- Example pages -> parent calculator, examples index, related examples, related guides, related calculators
- Topics page -> manually curated cross-type bundles
- Examples hub -> all registered programmatic clusters

Good new content should improve this graph rather than create orphan pages.

## Common Content Mistakes

- Adding a calculator route without adding it to `src/data/content.ts`
- Adding a calculator to content but not to `src/data/calculators.ts`
- Forgetting category membership in `src/data/calculator-categories.ts`
- Adding new guides without considering the topics page or adjacent internal links
- Launching a new example cluster without linking it from calculator pages, hubs, or the global examples hub
- Leaving stale counts in docs after shipping more calculators or clusters
- Copying a formula into a cluster instead of reusing shared math helpers
