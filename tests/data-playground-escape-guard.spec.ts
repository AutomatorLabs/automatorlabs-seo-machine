import { expect, test } from '@playwright/test';
import { stubAnalytics } from './helpers/calculator-test-helpers';

/**
 * Guards against literal `\uXXXX` escape sequences leaking into rendered HTML
 * outside <script> blocks (they render as visible garbage like `u2190` or
 * `↻` instead of decoding) — a bug class that has shipped three times
 * across the Data Playground tools.
 */
const PLAYGROUND_PAGES = ['/birth-lottery/', '/purple-star-chart/', '/where-do-you-rank/'];

const stripScriptBlocks = (html: string) =>
  html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

test.describe('Data Playground escape guard', () => {
  for (const path of PLAYGROUND_PAGES) {
    test(`${path} has no literal \\uXXXX escape sequences outside <script> blocks`, async ({
      page,
    }) => {
      await stubAnalytics(page);
      await page.goto(path, { waitUntil: 'networkidle' });

      const html = await page.content();
      const withoutScripts = stripScriptBlocks(html);
      const matches = withoutScripts.match(/\\u[0-9a-fA-F]{4}/g) ?? [];

      expect(matches, `Found literal escape sequences on ${path}: ${matches.join(', ')}`).toEqual(
        [],
      );
    });
  }
});
