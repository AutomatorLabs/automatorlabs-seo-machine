import { expect, test } from '@playwright/test';
import { stubAnalytics } from './helpers/calculator-test-helpers';

test.describe('wealth rank mobile layout (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const getHorizontalOverflow = (page: import('@playwright/test').Page) =>
    page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

  test('no horizontal overflow in light or dark mode, and Picture It cards stack to one column', async ({
    page,
  }) => {
    await stubAnalytics(page);
    await page.goto('/where-do-you-rank/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.wrap h1')).toContainText('Where Do You Actually Rank');
    await expect(page.locator('#pics .pic').first()).toBeVisible();

    expect(
      await getHorizontalOverflow(page),
      'Light mode should not overflow horizontally at 390px',
    ).toBeLessThanOrEqual(1);

    const picsColumns = await page
      .locator('#pics')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(picsColumns, 'Picture It cards should stack to a single column at 390px').toBe(1);

    await page.screenshot({ path: 'test-results/wealth-rank-mobile-light.png', fullPage: true });

    const themeToggle = page.locator('#theme-toggle');
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    expect(
      await getHorizontalOverflow(page),
      'Dark mode should not overflow horizontally at 390px',
    ).toBeLessThanOrEqual(1);
    await page.screenshot({ path: 'test-results/wealth-rank-mobile-dark.png', fullPage: true });
  });
});
