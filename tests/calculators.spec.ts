import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { calculatorConfigs } from '../src/data/calculators';
import { calculatorCategories } from '../src/data/calculator-categories';

const calculators = Object.values(calculatorConfigs).sort((a, b) =>
  a.title.localeCompare(b.title),
);

test.describe('calculator index search and filters', () => {
  const calculatorCards = '[data-calculator-card]';
  const searchBox = (page: Page) =>
    page.getByRole('searchbox', { name: 'Search calculators' });

  test.beforeEach(async ({ page }) => {
    await page.route('https://www.googletagmanager.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
      });
    });
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

test.describe('calculator QA', () => {
  for (const calculator of calculators) {
    test(`${calculator.title} (${calculator.url})`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });
      page.on('pageerror', (error) => {
        pageErrors.push(error.message);
      });

      await page.addInitScript(() => {
        localStorage.setItem('automatorlabs-theme', 'light');
      });
      await page.route(
        'https://www.googletagmanager.com/**',
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/javascript',
            body: '',
          });
        },
      );

      const response = await page.goto(calculator.url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response, 'The route should return a document response').not.toBeNull();
      expect(response?.ok(), `Expected ${calculator.url} to load successfully`).toBe(
        true,
      );
      const documentHeadingCount = await page.evaluate(
        () => document.querySelectorAll('h1').length,
      );
      expect(documentHeadingCount, 'The document should contain exactly one h1').toBe(
        1,
      );

      const calculateButton = page.getByRole('button', {
        name: 'Calculate',
        exact: true,
      });
      await expect(calculateButton).toBeVisible();

      const numericInputs = page.locator(
        '#calculator-form input[type="number"], #calculator-form input[data-currency-input]',
      );
      const numericInputCount = await numericInputs.count();
      expect(numericInputCount).toBeGreaterThan(0);

      for (let index = 0; index < numericInputCount; index += 1) {
        const input = numericInputs.nth(index);
        const currentValue = (await input.inputValue()).replace(/[$,\s]/g, '');
        const parsedValue = Number(currentValue);
        const positiveValue =
          Number.isFinite(parsedValue) && parsedValue > 0
            ? currentValue
            : '1';

        await input.fill(positiveValue);
      }

      await calculateButton.click();

      await expect(
        page.locator('#form-error:not([hidden])'),
        'Reasonable positive inputs should complete without validation errors',
      ).toHaveCount(0);
      expect(
        new URL(page.url()).searchParams.size,
        'A successful calculation should add the inputs to the URL',
      ).toBeGreaterThan(0);

      const results = page.locator('.results dd');
      expect(await results.count()).toBeGreaterThan(0);
      await expect(results.first()).toBeVisible();

      const renderedResults = await results.allTextContents();
      expect(
        renderedResults.some((value) => value.trim().length > 0),
        'At least one calculator output should render',
      ).toBe(true);

      const themeToggle = page.locator('#theme-toggle');
      await expect(themeToggle).toBeVisible();
      await themeToggle.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(page.locator('main')).toBeVisible();

      await themeToggle.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      await expect(page.locator('main')).toBeVisible();

      expect(pageErrors, 'No uncaught JavaScript exceptions').toEqual([]);
      expect(consoleErrors, 'No browser console errors').toEqual([]);
    });
  }

  test('prefills inputs from the URL and copies the share link', async ({
    context,
    page,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: 'http://127.0.0.1:4321',
    });
    await page.route('https://www.googletagmanager.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
      });
    });

    await page.goto(
      '/calculators/fire-calculator/?annualExpenses=40000&withdrawalRate=4',
      { waitUntil: 'domcontentloaded' },
    );

    await expect(page.locator('[name="annualExpenses"]')).toHaveValue('40000');
    await expect(page.locator('[name="withdrawalRate"]')).toHaveValue('4');

    const shareButton = page.getByRole('button', {
      name: 'Share calculation',
      exact: true,
    });
    await expect(shareButton).toBeHidden();

    await page.getByRole('button', { name: 'Calculate', exact: true }).click();

    const currentUrl = page.url();
    await expect(shareButton).toBeVisible();
    await shareButton.click();
    await expect(page.locator('#share-calculation-status')).toHaveText(
      '✓ Copied!',
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      currentUrl,
    );
  });
});

test.describe('calculator result tables', () => {
  const tableCases = [
    {
      title: 'Compound Interest',
      url: '/calculators/compound-interest/',
      firstCell: '1',
    },
    {
      title: 'FIRE',
      url: '/calculators/fire-calculator/',
      firstCell: '0',
    },
    {
      title: 'Mortgage Payoff',
      url: '/calculators/mortgage-payoff-calculator/',
      firstCell: '1',
    },
    {
      title: 'Debt Payoff',
      url: '/calculators/debt-payoff-calculator/',
      firstCell: '1',
    },
    {
      title: 'DRIP',
      url: '/calculators/drip-calculator/',
      firstCell: '1',
    },
  ];

  for (const tableCase of tableCases) {
    test(`${tableCase.title} table appears after calculation`, async ({
      page,
    }) => {
      await page.route('https://www.googletagmanager.com/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/javascript',
          body: '',
        });
      });
      await page.goto(tableCase.url, { waitUntil: 'domcontentloaded' });

      const tableSection = page.locator('#result-table-section');
      await expect(tableSection).toBeHidden();

      await page.getByRole('button', { name: 'Calculate', exact: true }).click();

      await expect(tableSection).toBeVisible();
      await expect(tableSection.locator('table')).toBeVisible();
      await expect(tableSection.locator('tbody tr').first()).toBeVisible();
      await expect(
        tableSection.locator('tbody tr').first().locator('th'),
      ).toHaveText(tableCase.firstCell);
    });
  }
});
