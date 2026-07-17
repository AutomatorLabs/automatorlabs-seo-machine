import { expect, test } from '@playwright/test';
import { stubAnalytics } from './helpers/calculator-test-helpers';

test.describe('purple star chart mobile layout (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const getHorizontalOverflow = (page: import('@playwright/test').Page) =>
    page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

  test('no horizontal overflow in light mode, dark mode, or with a detail panel open', async ({
    page,
  }) => {
    await stubAnalytics(page);
    await page.goto('/purple-star-chart/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#board .cell').first()).toBeVisible();

    expect(
      await getHorizontalOverflow(page),
      'Light mode should not overflow horizontally at 390px',
    ).toBeLessThanOrEqual(1);
    await page.screenshot({
      path: 'test-results/purple-star-chart-mobile-light.png',
      fullPage: true,
    });

    const themeToggle = page.locator('#theme-toggle');
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    expect(
      await getHorizontalOverflow(page),
      'Dark mode should not overflow horizontally at 390px',
    ).toBeLessThanOrEqual(1);
    await page.screenshot({
      path: 'test-results/purple-star-chart-mobile-dark.png',
      fullPage: true,
    });

    await page.locator('#board .cell').first().click();
    await expect(page.locator('#detail h3')).not.toHaveText('Tap a box');

    expect(
      await getHorizontalOverflow(page),
      'A detail panel open should not overflow horizontally at 390px',
    ).toBeLessThanOrEqual(1);
    await page.screenshot({
      path: 'test-results/purple-star-chart-mobile-detail-open.png',
      fullPage: true,
    });
  });
});
