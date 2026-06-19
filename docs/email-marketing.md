# Email marketing

AutomatorLabs uses Beehiiv for subscriber capture.

## Current acquisition setup

- `/newsletter/` is the main newsletter acquisition page.
- The shared `NewsletterSignup` component embeds email capture on calculators,
  guides, programmatic pages, the homepage, content indexes, and the newsletter
  landing page.
- Beehiiv automations are not available on the free plan, so the current focus
  is subscriber acquisition rather than automated email sequences.

## Beehiiv integration status

The shared form posts directly to the verified Beehiiv `/create` endpoint on
`https://newsletter.automatorlabs.co/` using Beehiiv's published form field
names. The response loads in a hidden frame, allowing the site to show an
inline confirmation without navigating away.

If the inline request times out, the component reveals the hosted Beehiiv
publication link as a fallback. The hosted link is also available when
JavaScript is disabled.

## Future segmentation

When the Beehiiv plan and data model support it, add subscriber segmentation
by calculator category, such as investing, FIRE and retirement, mortgages,
savings, debt payoff, and home buying. Do not collect segmentation fields
until they map to an actual Beehiiv workflow.
