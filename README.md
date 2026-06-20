# AutomatorLabs SEO Machine

Astro static site for AutomatorLabs calculators, guides, examples, and
programmatic SEO clusters.

## Commands

Run commands from the project root:

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local Astro dev server |
| `npm run build` | Build the production site to `dist/` |
| `npm run audit:seo` | Audit built output for common SEO issues |
| `npm run test:calculators` | Run calculator Playwright coverage |
| `npm run preview` | Preview the built site locally |

## SEO audit

Build before running the audit:

```sh
npm run build
npm run audit:seo
```

The local audit inspects `dist/` plus central calculator data. It checks for
duplicate titles/descriptions/canonicals, canonical and H1 issues, calculator
FAQ and breadcrumb schema, broken internal links, calculator category coverage,
newsletter CTAs on calculator pages, and sitemap output.

The audit is intentionally static and dependency-free. It does not make network
calls and does not replace the browser-based calculator test suite.

## Project notes

- Calculator definitions live in `src/data/calculators.ts`.
- Calculator category membership lives in `src/data/calculator-categories.ts`.
- Programmatic SEO implementation notes live in `docs/programmatic-seo.md`.
