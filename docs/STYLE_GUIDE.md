# Style Guide

## Product Voice

AutomatorLabs should sound:

- practical
- calm
- plain-English
- educational
- scenario-based
- non-promotional

The tone should help users understand tradeoffs without sounding like financial advice.

## Writing Principles

- Explain what the number means, not just how it is computed.
- Prefer concrete examples over abstract claims.
- Use caution language where outcomes are assumption-driven.
- Distinguish estimates from guarantees.
- Avoid pretending simplified calculators model the full real world.

## Repeated Messaging Themes

The repo consistently emphasizes:

- "use this as a scenario"
- "change one assumption at a time"
- "this is educational, not advice"
- "consider taxes, fees, inflation, and timing"

New content should preserve that framing.

## Naming And Copy Standards

- Use title case for page titles and section headings.
- Keep route slugs in lowercase kebab-case.
- Use consistent financial terminology across pages:
  - annual return
  - withdrawal rate
  - monthly contribution
  - total interest
  - portfolio value
- Keep descriptions compact and search-intent aligned.

## Design Philosophy

The current design system is:

- static-first
- card-based
- readable on mobile
- intentionally simple
- consistent across calculators, guides, and examples

Patterns visible across the site:

- shared `Layout.astro`
- restrained blue-accent palette
- light/dark theme support
- strong use of cards, panels, breadcrumbs, and CTA blocks

## Code Style Expectations

- Prefer shared page shells over repeated markup.
- Put canonical content/config in `src/data/*`.
- Put math and helper logic in `src/lib/*`.
- Reuse existing page patterns before creating new ones.
- Prefer typed registries over ad hoc objects.

## SEO Copy Standards

- Titles and meta descriptions should be specific to the page type.
- Programmatic pages must avoid duplicate visible titles and duplicate metadata.
- Example pages should sound like specific scenarios, not template placeholders.
- Guides should link back into calculators and examples where relevant.
