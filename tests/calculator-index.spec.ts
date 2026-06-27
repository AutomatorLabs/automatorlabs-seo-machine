import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { calculatorCategories } from '../src/data/calculator-categories';
import { calculators, stubAnalytics } from './helpers/calculator-test-helpers';

test.describe('calculator index search and filters', () => {
  const calculatorCards = '[data-calculator-card]';
  const searchBox = (page: Page) =>
    page.getByRole('searchbox', { name: 'Search calculators' });

  test.beforeEach(async ({ page }) => {
    await stubAnalytics(page);
    await page.goto('/calculators/', { waitUntil: 'domcontentloaded' });
  });

  test('shows every calculator by default', async ({ page }) => {
    await expect(page.locator(calculatorCards)).toHaveCount(calculators.length);
    await expect(page.locator(`${calculatorCards}:visible`)).toHaveCount(
      calculators.length,
    );
    await expect(page.locator('#calculator-count')).toHaveText(
      `Showing ${calculators.length} calculators`,
    );
  });

  for (const query of ['fire', 'mortgage']) {
    test(`searching "${query}" filters calculator cards`, async ({ page }) => {
      await searchBox(page).fill(query);

      const visibleCards = page.locator(`${calculatorCards}:visible`);
      const visibleCount = await visibleCards.count();
      expect(visibleCount).toBeGreaterThan(0);
      expect(visibleCount).toBeLessThan(calculators.length);

      const searchText = await visibleCards.evaluateAll((cards) =>
        cards.map((card) => card.getAttribute('data-search-text') ?? ''),
      );
      expect(searchText.every((text) => text.includes(query))).toBe(true);
      await expect(page.locator('#calculator-count')).toHaveText(
        `Showing ${visibleCount} calculators`,
      );
    });
  }

  test('Debt & Loans category filter shows only that category', async ({
    page,
  }) => {
    const debtCategory = calculatorCategories.find(
      (category) => category.slug === 'debt-loans',
    );
    if (!debtCategory) throw new Error('Missing Debt & Loans category');

    const filter = page.getByRole('button', {
      name: 'Debt & Loans',
      exact: true,
    });
    await filter.click();

    await expect(filter).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`${calculatorCards}:visible`)).toHaveCount(
      debtCategory.ids.length,
    );
    await expect(
      page.locator(
        `${calculatorCards}:visible:not([data-category="debt-loans"])`,
      ),
    ).toHaveCount(0);
  });

  test('nonsense search shows the accessible empty state', async ({ page }) => {
    await searchBox(page).fill('zzzz-no-calculator');

    await expect(page.locator(`${calculatorCards}:visible`)).toHaveCount(0);
    await expect(page.locator('#no-calculators-found')).toBeVisible();
    await expect(page.locator('#no-calculators-found')).toHaveText(
      'No calculators found. Try a different search.',
    );
    await expect(page.locator('#calculator-count')).toHaveText(
      'Showing 0 calculators',
    );
  });

  test('clear search restores every calculator and the All filter', async ({
    page,
  }) => {
    await page.getByRole('button', {
      name: 'Debt & Loans',
      exact: true,
    }).click();
    await searchBox(page).fill('zzzz-no-calculator');

    const clearButton = page.getByRole('button', {
      name: 'Clear search',
      exact: true,
    });
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    await expect(searchBox(page)).toHaveValue('');
    await expect(
      page.getByRole('button', { name: 'All', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`${calculatorCards}:visible`)).toHaveCount(
      calculators.length,
    );
    await expect(clearButton).toBeHidden();
  });
});
