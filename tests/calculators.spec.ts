import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { calculatorConfigs } from '../src/data/calculators';
import { calculatorCategories } from '../src/data/calculator-categories';
import {
  compoundInterestSeoRecords,
  EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
  expandedCompoundInterestSeoRecords,
  originalCompoundInterestSeoRecords,
} from '../src/data/programmatic-seo/compound-interest';
import { auditCompoundInterestSeoRecords } from '../src/lib/programmatic-seo/compound-interest';
import {
  EXPECTED_FIRE_SEO_PAGE_COUNT,
  fireSeoRecords,
} from '../src/data/programmatic-seo/fire';
import { auditFireSeoRecords } from '../src/lib/programmatic-seo/fire';
import { programmaticSeoClusters } from '../src/data/programmatic-seo/clusters';
import {
  EXPECTED_MORTGAGE_SEO_PAGE_COUNT,
  mortgageSeoRecords,
} from '../src/data/programmatic-seo/mortgage';
import { auditMortgageSeoRecords } from '../src/lib/programmatic-seo/mortgage';

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

test.describe('compound interest programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditCompoundInterestSeoRecords(
      compoundInterestSeoRecords,
      EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: 100,
      actualCount: 100,
      uniqueSlugCount: 100,
      uniqueTitleCount: 100,
      uniqueDescriptionCount: 100,
      uniqueCanonicalPathCount: 100,
    });
  });

  test('examples index groups, exposes, and searches every page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto('/calculators/compound-interest/examples/', {
      waitUntil: 'domcontentloaded',
    });

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Compound Interest Examples',
      }),
    ).toBeVisible();
    await expect(page.locator('[data-example-group]')).toHaveCount(4);
    await expect(page.locator('[data-example-card]')).toHaveCount(100);
    await expect(page.locator('[data-example-card] a')).toHaveCount(100);
    await expect(page.locator('#example-count')).toHaveText(
      'Showing 100 examples',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/compound-interest/examples/',
    );

    const hrefs = await page
      .locator('[data-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(100);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search compound interest examples',
    });
    await searchBox.fill('125,000');
    await expect(page.locator('[data-example-card]:visible')).toHaveCount(7);
    await expect(page.locator('#example-count')).toHaveText(
      'Showing 7 examples',
    );

    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(searchBox).toHaveValue('');
    await expect(page.locator('[data-example-card]:visible')).toHaveCount(100);
    await expect(
      page.getByRole('link', { name: 'Browse all financial examples' }),
    ).toHaveAttribute('href', '/examples/');
    expect(pageErrors).toEqual([]);
  });

  const representativeRecords = [
    originalCompoundInterestSeoRecords[0],
    originalCompoundInterestSeoRecords.at(-1),
    expandedCompoundInterestSeoRecords[0],
    expandedCompoundInterestSeoRecords.at(-1),
  ].filter((record) => record !== undefined);

  for (const record of representativeRecords) {
    test(`renders generated example ${record.slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      const url = `/calculators/compound-interest/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      expect(
        await page.evaluate(() => document.querySelectorAll('h1').length),
      ).toBe(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://automatorlabs.co${url}`,
      );
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        /See the formula, annual projection, chart, interest earned, and assumptions\.$/,
      );
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
      await expect(
        page.getByRole('link', {
          name: 'Browse All Compound Interest Examples',
        }),
      ).toHaveAttribute(
        'href',
        '/calculators/compound-interest/examples/',
      );
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('FIRE programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditFireSeoRecords(
      fireSeoRecords,
      EXPECTED_FIRE_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: 30,
      actualCount: 30,
      uniqueSlugCount: 30,
      uniqueTitleCount: 30,
      uniqueDescriptionCount: 30,
      uniqueCanonicalPathCount: 30,
    });
  });

  test('FIRE examples index exposes and searches all generated pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/fire/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'FIRE Number Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('[data-fire-example-group]')).toHaveCount(2);
    await expect(page.locator('[data-fire-example-card]')).toHaveCount(30);
    await expect(page.locator('[data-fire-example-card] a')).toHaveCount(30);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/fire/examples/',
    );
    await expect(
      page.getByRole('link', { name: 'Calculate your FIRE number' }),
    ).toHaveAttribute('href', '/calculators/fire-calculator/');
    await expect(
      page.getByRole('link', { name: 'Browse all financial examples' }),
    ).toHaveAttribute('href', '/examples/');

    const hrefs = await page
      .locator('[data-fire-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(30);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search FIRE examples',
    });
    await searchBox.fill('1,000,000');
    await expect(page.locator('[data-fire-example-card]:visible')).toHaveCount(
      2,
    );
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(page.locator('[data-fire-example-card]:visible')).toHaveCount(
      30,
    );
    expect(pageErrors).toEqual([]);
  });

  test('renders a generated FIRE page with canonical and calculator link', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const record = fireSeoRecords.find(
      (candidate) =>
        candidate.slug ===
        'can-i-retire-with-1000000-and-40000-spending',
    );
    if (!record) throw new Error('Missing representative FIRE SEO record');

    const url = `/calculators/fire/${record.slug}/`;
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1, name: record.question }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://automatorlabs.co${url}`,
    );
    await expect(
      page.getByRole('link', { name: 'Open the FIRE Calculator' }),
    ).toHaveAttribute('href', '/calculators/fire-calculator/');
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Withdrawal-Rate Comparison',
      }),
    ).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(5);
    expect(pageErrors).toEqual([]);
  });
});

test.describe('mortgage programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditMortgageSeoRecords(
      mortgageSeoRecords,
      EXPECTED_MORTGAGE_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: 40,
      actualCount: 40,
      uniqueSlugCount: 40,
      uniqueTitleCount: 40,
      uniqueDescriptionCount: 40,
      uniqueCanonicalPathCount: 40,
    });
  });

  test('mortgage examples index exposes and searches all generated pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/mortgage/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Mortgage Payment Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('[data-mortgage-example-group]')).toHaveCount(
      3,
    );
    await expect(page.locator('[data-mortgage-example-card]')).toHaveCount(
      40,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/mortgage/examples/',
    );
    await expect(
      page.getByRole('link', { name: 'Calculate your mortgage payment' }),
    ).toHaveAttribute('href', '/calculators/mortgage-payoff-calculator/');

    const hrefs = await page
      .locator('[data-mortgage-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(40);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search mortgage examples',
    });
    await searchBox.fill('750,000');
    await expect(
      page.locator('[data-mortgage-example-card]:visible'),
    ).toHaveCount(2);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-mortgage-example-card]:visible'),
    ).toHaveCount(40);
    expect(pageErrors).toEqual([]);
  });

  test('renders a generated mortgage page with canonical and calculator backlink', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const record = mortgageSeoRecords.find(
      (candidate) =>
        candidate.slug ===
        '300000-mortgage-at-6-percent-for-30-years',
    );
    if (!record) throw new Error('Missing representative mortgage record');

    const url = `/calculators/mortgage/${record.slug}/`;
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1, name: record.question }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://automatorlabs.co${url}`,
    );
    await expect(
      page.getByRole('link', { name: 'Open the Mortgage Calculator' }),
    ).toHaveAttribute('href', '/calculators/mortgage-payoff-calculator/');
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Mortgage Payment Summary',
      }),
    ).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(3);
    expect(pageErrors).toEqual([]);
  });
});

test.describe('global programmatic examples hub', () => {
  test('links to every cluster and representative generated pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Financial Examples' }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/examples/',
    );
    await expect(page.locator('.cluster-card')).toHaveCount(
      programmaticSeoClusters.length,
    );

    for (const cluster of programmaticSeoClusters) {
      await expect(
        page.getByRole('link', {
          name: `Browse ${cluster.title}`,
          exact: true,
        }),
      ).toHaveAttribute('href', cluster.examplesUrl);
      await expect(
        page.getByRole('link', {
          name: cluster.calculator.title,
          exact: true,
        }),
      ).toHaveAttribute('href', cluster.calculator.url);
      await expect(
        page.getByRole('link', {
          name: cluster.guide.title,
          exact: true,
        }),
      ).toHaveAttribute('href', cluster.guide.url);

      for (const representativePage of cluster.representativePages) {
        await expect(
          page.getByRole('link', {
            name: representativePage.title,
            exact: true,
          }),
        ).toHaveAttribute('href', representativePage.url);
      }
    }

    expect(pageErrors).toEqual([]);
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
