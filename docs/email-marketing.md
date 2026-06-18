# Email marketing

AutomatorLabs uses Beehiiv for subscriber capture.

## Current acquisition setup

- `/newsletter/` is the main newsletter acquisition page.
- Reusable newsletter CTAs link SEO visitors from calculators, guides,
  programmatic pages, the homepage, and content indexes to that page.
- Beehiiv automations are not available on the free plan, so the current focus
  is subscriber acquisition rather than automated email sequences.

## Beehiiv integration status

The repository does not currently contain a verified Beehiiv publication URL,
publication ID, or embed code. The newsletter page therefore contains an
accessible placeholder instead of an invented URL or broken third-party
script.

Future task:

1. Add the verified Beehiiv publication URL to
   `src/data/newsletter.ts`.
2. Replace the TODO placeholder in
   `src/pages/newsletter/index.astro` with the official Beehiiv embed.
3. Verify form submission, consent language, keyboard behavior, loading, and
   dark/light rendering.

## Future segmentation

When the Beehiiv plan and data model support it, add subscriber segmentation
by calculator category, such as investing, FIRE and retirement, mortgages,
savings, debt payoff, and home buying. Do not collect segmentation fields
until they map to an actual Beehiiv workflow.
