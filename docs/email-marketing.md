# Email marketing

AutomatorLabs uses Beehiiv for subscriber capture.

## Current acquisition setup

- `/newsletter/` is the main newsletter acquisition page.
- Reusable newsletter CTAs link SEO visitors from calculators, guides,
  programmatic pages, the homepage, and content indexes to that page.
- Beehiiv automations are not available on the free plan, so the current focus
  is subscriber acquisition rather than automated email sequences.

## Beehiiv integration status

The newsletter page uses the verified hosted Beehiiv publication URL:
`https://newsletter.automatorlabs.co/`.

No publication ID or official embed code is stored in the repository, so the
page uses a clear hosted-signup CTA without adding an unverified script. If an
official embed is added later, verify form submission, consent language,
keyboard behavior, loading, and dark/light rendering before replacing the
hosted-link fallback.

## Future segmentation

When the Beehiiv plan and data model support it, add subscriber segmentation
by calculator category, such as investing, FIRE and retirement, mortgages,
savings, debt payoff, and home buying. Do not collect segmentation fields
until they map to an actual Beehiiv workflow.
