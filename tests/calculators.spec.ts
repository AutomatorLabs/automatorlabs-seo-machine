import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { calculatorConfigs } from '../src/data/calculators';
import { calculatorCategories } from '../src/data/calculator-categories';
import {
  EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT,
  fourPercentRuleSeoRecords,
} from '../src/data/programmatic-seo/four-percent-rule';
import { auditFourPercentRuleSeoRecords } from '../src/lib/programmatic-seo/four-percent-rule';
import {
  compoundInterestSeoRecords,
  EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
  expandedCompoundInterestSeoRecords,
  originalCompoundInterestSeoRecords,
} from '../src/data/programmatic-seo/compound-interest';
import { auditCompoundInterestSeoRecords } from '../src/lib/programmatic-seo/compound-interest';
import {
  balanceTransferSeoRecords,
  creditCardPayoffSeoRecords,
  EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT,
  EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/debt';
import {
  auditBalanceTransferSeoRecords,
  auditCreditCardPayoffSeoRecords,
} from '../src/lib/programmatic-seo/debt';
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
import {
  EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT,
  retirementWithdrawalSeoRecords,
} from '../src/data/programmatic-seo/retirement-withdrawal';
import { auditRetirementWithdrawalSeoRecords } from '../src/lib/programmatic-seo/retirement-withdrawal';
import {
  EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT,
  safeWithdrawalRateSeoRecords,
} from '../src/data/programmatic-seo/safe-withdrawal-rate';
import { auditSafeWithdrawalRateSeoRecords } from '../src/lib/programmatic-seo/safe-withdrawal-rate';
import {
  EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT,
  savingsGoalSeoRecords,
} from '../src/data/programmatic-seo/savings-goal';
import {
  auditSavingsGoalSeoRecords,
  calculateRequiredMonthlySavings,
} from '../src/lib/programmatic-seo/savings-goal';
import {
  createCalculatorFaqs,
  createCalculatorHowItWorks,
} from '../src/lib/calculator-education';
import { createRelatedCalculatorLinks } from '../src/lib/related-calculators';
import {
  calculateApy,
  calculateCompoundInterest,
  calculateRequiredPeriodicSavings,
} from '../src/lib/math';
import { newsletterConfig } from '../src/data/newsletter';
import { rothIraPlanningDefaults } from '../src/config/roth-ira';
import { fourOhOneKPlanningDefaults } from '../src/config/401k';

const calculators = Object.values(calculatorConfigs).sort((a, b) =>
  a.title.localeCompare(b.title),
);
const newsletterLink = (page: Page) =>
  page.getByRole('link', { name: 'Subscribe to the newsletter' });
const newsletterCta = (page: Page) =>
  page.locator('aside[aria-label="AutomatorLabs newsletter signup"]');

test.describe('newsletter acquisition', () => {
  test('newsletter landing page loads with hosted signup CTA, canonical, and key tools', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/newsletter/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Practical financial tools, delivered when they are useful',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/newsletter/',
    );
    await expect(newsletterCta(page)).toBeVisible();
    await expect(newsletterLink(page)).toBeVisible();
    await expect(newsletterLink(page)).toHaveAttribute(
      'href',
      newsletterConfig.publicationUrl,
    );
    await expect(
      page.locator('a[href="/calculators/compound-interest/"]'),
    ).toContainText('Compound Interest Calculator');
    await expect(
      page.locator('a[href="/calculators/fire-calculator/"]'),
    ).toContainText('FIRE Calculator');
    await expect(
      page.locator('a[href="/calculators/mortgage-payoff-calculator/"]'),
    ).toContainText('Mortgage Calculator');
    await expect(page.locator('a[href="/examples/"]').first()).toContainText(
      'Examples Hub',
    );
    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => script.textContent ?? '').join('\n'),
      );
    expect(structuredData).toContain('"@type":"FAQPage"');
    expect(pageErrors).toEqual([]);
  });

  for (const route of ['/', '/examples/']) {
    test(`${route} includes the shared hosted newsletter CTA`, async ({
      page,
    }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      const response = await page.goto(route, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(newsletterCta(page)).toBeVisible();
      await expect(newsletterLink(page)).toBeVisible();
      await expect(newsletterLink(page)).toHaveAttribute(
        'href',
        newsletterConfig.publicationUrl,
      );
      expect(pageErrors).toEqual([]);
    });
  }
});

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
      expectedCount: EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
      actualCount: EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
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
    await expect(page.locator('[data-example-card]')).toHaveCount(
      EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
    );
    await expect(page.locator('[data-example-card] a')).toHaveCount(
      EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
    );
    await expect(page.locator('#example-count')).toHaveText(
      `Showing ${EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT} examples`,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/compound-interest/examples/',
    );

    const hrefs = await page
      .locator('[data-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(
      EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
    );

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
    await expect(page.locator('[data-example-card]:visible')).toHaveCount(
      EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT,
    );
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
      expectedCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
      actualCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
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
    await expect(page.locator('[data-fire-example-card]')).toHaveCount(
      EXPECTED_FIRE_SEO_PAGE_COUNT,
    );
    await expect(page.locator('[data-fire-example-card] a')).toHaveCount(
      EXPECTED_FIRE_SEO_PAGE_COUNT,
    );
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
    expect(new Set(hrefs).size).toBe(EXPECTED_FIRE_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search FIRE examples',
    });
    await searchBox.fill('1,000,000');
    await expect(page.locator('[data-fire-example-card]:visible')).toHaveCount(
      2,
    );
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(page.locator('[data-fire-example-card]:visible')).toHaveCount(
      EXPECTED_FIRE_SEO_PAGE_COUNT,
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
      expectedCount: EXPECTED_MORTGAGE_SEO_PAGE_COUNT,
      actualCount: EXPECTED_MORTGAGE_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_MORTGAGE_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_MORTGAGE_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_MORTGAGE_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_MORTGAGE_SEO_PAGE_COUNT,
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
      EXPECTED_MORTGAGE_SEO_PAGE_COUNT,
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
    expect(new Set(hrefs).size).toBe(EXPECTED_MORTGAGE_SEO_PAGE_COUNT);

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
    ).toHaveCount(EXPECTED_MORTGAGE_SEO_PAGE_COUNT);
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

test.describe('savings goal programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditSavingsGoalSeoRecords(
      savingsGoalSeoRecords,
      EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT,
      actualCount: EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT,
    });
  });

  test('required monthly savings reuses the shared future-value behavior', () => {
    const record = savingsGoalSeoRecords.find(
      (candidate) => candidate.slug === 'save-100000-in-5-years',
    );
    if (!record) throw new Error('Missing representative savings goal record');

    const monthlySavings = calculateRequiredMonthlySavings(record);
    expect(monthlySavings).toBeGreaterThan(1400);
    expect(monthlySavings).toBeLessThan(1600);
  });

  test('examples index exposes, groups, and searches every savings page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/savings-goal/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Savings Goal Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-savings-goal-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-savings-goal-example-card]'),
    ).toHaveCount(EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/savings-goal/examples/',
    );

    const hrefs = await page
      .locator('[data-savings-goal-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search savings goal examples',
    });
    await searchBox.fill('down payment');
    await expect(
      page.locator('[data-savings-goal-example-card]:visible'),
    ).toHaveCount(18);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-savings-goal-example-card]:visible'),
    ).toHaveCount(EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', { name: 'Build your savings plan' }),
    ).toHaveAttribute('href', '/calculators/savings-goal-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'save-100000-in-5-years',
    'save-50000-for-down-payment-in-5-years',
    'save-1000000-by-age-65-starting-at-35',
  ]) {
    test(`renders generated savings goal page ${slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = savingsGoalSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) throw new Error(`Missing savings goal record: ${slug}`);

      const url = `/calculators/savings-goal/${record.slug}/`;
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

      const schemas = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => script.textContent ?? '').join('\n'),
        );
      expect(schemas).toContain('"@type":"FAQPage"');
      expect(schemas).toContain('"@type":"BreadcrumbList"');
      await expect(
        page.getByRole('link', { name: 'Open the Savings Goal Calculator' }),
      ).toHaveAttribute('href', '/calculators/savings-goal-calculator/');
      await expect(
        page.locator('a[href="/calculators/compound-interest/"]').first(),
      ).toBeVisible();
      await expect(
        page.locator(
          'a[href="/calculators/investment-growth-calculator/"]',
        ),
      ).toBeVisible();
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('credit card payoff programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditCreditCardPayoffSeoRecords(
      creditCardPayoffSeoRecords,
      EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT,
      actualCount: EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT,
    });
  });

  test('examples index exposes and searches all credit card payoff pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/credit-card-payoff/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Credit Card Payoff Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-credit-card-payoff-example-group]'),
    ).toHaveCount(2);
    await expect(
      page.locator('[data-credit-card-payoff-example-card]'),
    ).toHaveCount(EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/credit-card-payoff/examples/',
    );

    const hrefs = await page
      .locator('[data-credit-card-payoff-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(
      EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search credit card payoff examples',
    });
    await searchBox.fill('10,000');
    await expect(
      page.locator('[data-credit-card-payoff-example-card]:visible'),
    ).toHaveCount(3);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-credit-card-payoff-example-card]:visible'),
    ).toHaveCount(EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', { name: 'Calculate your credit card payoff' }),
    ).toHaveAttribute('href', '/calculators/credit-card-payoff-calculator/');
    expect(pageErrors).toEqual([]);
  });

  test('renders a generated credit card payoff page with schemas and CTA', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const record = creditCardPayoffSeoRecords.find(
      (candidate) =>
        candidate.slug ===
        'pay-off-10000-credit-card-at-24-99-apr-with-300-per-month',
    );
    if (!record) throw new Error('Missing representative credit card record');

    const url = `/calculators/credit-card-payoff/${record.slug}/`;
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

    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => script.textContent ?? '').join('\n'),
      );
    expect(schemas).toContain('"@type":"FAQPage"');
    expect(schemas).toContain('"@type":"BreadcrumbList"');
    await expect(
      page.getByRole('link', {
        name: 'Open the Credit Card Payoff Calculator',
      }),
    ).toHaveAttribute('href', '/calculators/credit-card-payoff-calculator/');
    await expect(newsletterCta(page)).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(1);
    expect(pageErrors).toEqual([]);
  });
});

test.describe('balance transfer programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditBalanceTransferSeoRecords(
      balanceTransferSeoRecords,
      EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT,
      actualCount: EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT,
    });
  });

  test('examples index exposes and searches all balance transfer pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/balance-transfer/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Balance Transfer Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-balance-transfer-example-group]'),
    ).toHaveCount(2);
    await expect(
      page.locator('[data-balance-transfer-example-card]'),
    ).toHaveCount(EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/balance-transfer/examples/',
    );

    const hrefs = await page
      .locator('[data-balance-transfer-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(
      EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search balance transfer examples',
    });
    await searchBox.fill('3% fee');
    await expect(
      page.locator('[data-balance-transfer-example-card]:visible'),
    ).toHaveCount(14);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-balance-transfer-example-card]:visible'),
    ).toHaveCount(EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', { name: 'Calculate your balance transfer' }),
    ).toHaveAttribute('href', '/calculators/balance-transfer-calculator/');
    expect(pageErrors).toEqual([]);
  });

  test('renders a generated balance transfer page with schemas and CTA', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const record = balanceTransferSeoRecords.find(
      (candidate) =>
        candidate.slug ===
        'balance-transfer-8000-from-24-99-apr-with-3-fee-18-months',
    );
    if (!record) throw new Error('Missing representative transfer record');

    const url = `/calculators/balance-transfer/${record.slug}/`;
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

    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => script.textContent ?? '').join('\n'),
      );
    expect(schemas).toContain('"@type":"FAQPage"');
    expect(schemas).toContain('"@type":"BreadcrumbList"');
    await expect(
      page.getByRole('link', {
        name: 'Open the Balance Transfer Calculator',
      }),
    ).toHaveAttribute('href', '/calculators/balance-transfer-calculator/');
    await expect(newsletterCta(page)).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(2);
    expect(pageErrors).toEqual([]);
  });
});

test.describe('retirement withdrawal programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditRetirementWithdrawalSeoRecords(
      retirementWithdrawalSeoRecords,
      EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT,
      actualCount: EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount:
        EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT,
    });
  });

  test('examples index exposes and searches retirement withdrawal pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(
      '/calculators/retirement-withdrawal/examples/',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Retirement Withdrawal Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-retirement-withdrawal-example-group]'),
    ).toHaveCount(2);
    await expect(
      page.locator('[data-retirement-withdrawal-example-card]'),
    ).toHaveCount(EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/retirement-withdrawal/examples/',
    );

    const hrefs = await page
      .locator('[data-retirement-withdrawal-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(
      EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search retirement withdrawal examples',
    });
    await searchBox.fill('1,000,000');
    await expect(
      page.locator('[data-retirement-withdrawal-example-card]:visible'),
    ).not.toHaveCount(0);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-retirement-withdrawal-example-card]:visible'),
    ).toHaveCount(EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', {
        name: 'Calculate your retirement withdrawal',
      }),
    ).toHaveAttribute('href', '/calculators/retirement-withdrawal-calculator/');
    expect(pageErrors).toEqual([]);
  });

  test('renders a generated retirement withdrawal page with schemas and CTA', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const record = retirementWithdrawalSeoRecords.find(
      (candidate) =>
        candidate.slug ===
        'withdraw-40000-per-year-from-1000000-for-30-years-at-7-return-3-inflation',
    );
    if (!record) {
      throw new Error('Missing representative retirement withdrawal record');
    }

    const url = `/calculators/retirement-withdrawal/${record.slug}/`;
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

    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => script.textContent ?? '').join('\n'),
      );
    expect(schemas).toContain('"@type":"FAQPage"');
    expect(schemas).toContain('"@type":"BreadcrumbList"');
    await expect(
      page.getByRole('link', {
        name: 'Open the Retirement Withdrawal Calculator',
      }),
    ).toHaveAttribute('href', '/calculators/retirement-withdrawal-calculator/');
    await expect(newsletterCta(page)).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(6);
    expect(pageErrors).toEqual([]);
  });
});

test.describe('safe withdrawal rate programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditSafeWithdrawalRateSeoRecords(
      safeWithdrawalRateSeoRecords,
      EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT,
      actualCount: EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount:
        EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT,
    });
  });

  test('examples index exposes and searches safe withdrawal rate pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(
      '/calculators/safe-withdrawal-rate/examples/',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Safe Withdrawal Rate Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-safe-withdrawal-rate-example-group]'),
    ).toHaveCount(2);
    await expect(
      page.locator('[data-safe-withdrawal-rate-example-card]'),
    ).toHaveCount(EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/safe-withdrawal-rate/examples/',
    );

    const hrefs = await page
      .locator('[data-safe-withdrawal-rate-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(
      EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search safe withdrawal rate examples',
    });
    await searchBox.fill('1,000,000');
    await expect(
      page.locator('[data-safe-withdrawal-rate-example-card]:visible'),
    ).not.toHaveCount(0);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-safe-withdrawal-rate-example-card]:visible'),
    ).toHaveCount(EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', {
        name: 'Calculate your safe withdrawal rate',
      }),
    ).toHaveAttribute('href', '/calculators/safe-withdrawal-rate-calculator/');
    expect(pageErrors).toEqual([]);
  });

  test('renders a generated safe withdrawal rate page with schemas and CTA', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const record = safeWithdrawalRateSeoRecords.find(
      (candidate) =>
        candidate.slug ===
        'safe-withdrawal-rate-40000-spending-1000000-portfolio-4-percent-30-years',
    );
    if (!record) {
      throw new Error('Missing representative safe withdrawal rate record');
    }

    const url = `/calculators/safe-withdrawal-rate/${record.slug}/`;
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

    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => script.textContent ?? '').join('\n'),
      );
    expect(schemas).toContain('"@type":"FAQPage"');
    expect(schemas).toContain('"@type":"BreadcrumbList"');
    await expect(
      page.getByRole('link', {
        name: 'Open the Safe Withdrawal Rate Calculator',
      }),
    ).toHaveAttribute('href', '/calculators/safe-withdrawal-rate-calculator/');
    await expect(newsletterCta(page)).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(5);
    expect(pageErrors).toEqual([]);
  });
});

test.describe('4 percent rule programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditFourPercentRuleSeoRecords(
      fourPercentRuleSeoRecords,
      EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT,
      actualCount: EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount:
        EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT,
    });
  });

  test('examples index exposes and searches 4 percent rule pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/4-percent-rule/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: '4 Percent Rule Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-four-percent-rule-example-group]'),
    ).toHaveCount(2);
    await expect(
      page.locator('[data-four-percent-rule-example-card]'),
    ).toHaveCount(EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/4-percent-rule/examples/',
    );

    const hrefs = await page
      .locator('[data-four-percent-rule-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(
      EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search 4 percent rule examples',
    });
    await searchBox.fill('1,000,000');
    await expect(
      page.locator('[data-four-percent-rule-example-card]:visible'),
    ).not.toHaveCount(0);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-four-percent-rule-example-card]:visible'),
    ).toHaveCount(EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', {
        name: 'Calculate your 4% rule number',
      }),
    ).toHaveAttribute('href', '/calculators/4-percent-rule-calculator/');
    expect(pageErrors).toEqual([]);
  });

  test('renders a generated 4 percent rule page with schemas and CTA', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const record = fourPercentRuleSeoRecords.find(
      (candidate) =>
        candidate.slug ===
        '4-percent-rule-1000000-portfolio-40000-spending-30-years',
    );
    if (!record) {
      throw new Error('Missing representative 4 percent rule record');
    }

    const url = `/calculators/4-percent-rule/${record.slug}/`;
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

    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => script.textContent ?? '').join('\n'),
      );
    expect(schemas).toContain('"@type":"FAQPage"');
    expect(schemas).toContain('"@type":"BreadcrumbList"');
    await expect(
      page.getByRole('link', {
        name: 'Open the 4 Percent Rule Calculator',
      }),
    ).toHaveAttribute('href', '/calculators/4-percent-rule-calculator/');
    await expect(newsletterCta(page)).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(4);
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
      const clusterCard = page
        .locator('.cluster-card')
        .filter({
          has: page.getByRole('heading', {
            level: 2,
            name: cluster.title,
            exact: true,
          }),
        });

      await expect(
        clusterCard.getByRole('link', {
          name: `Browse ${cluster.title}`,
          exact: true,
        }),
      ).toHaveAttribute('href', cluster.examplesUrl);
      await expect(
        clusterCard.getByRole('link', {
          name: cluster.calculator.title,
          exact: true,
        }),
      ).toHaveAttribute('href', cluster.calculator.url);
      await expect(
        clusterCard.getByRole('link', {
          name: cluster.guide.title,
          exact: true,
        }),
      ).toHaveAttribute('href', cluster.guide.url);

      for (const representativePage of cluster.representativePages) {
        await expect(
          clusterCard.getByRole('link', {
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
  test('retirement withdrawal calculator cluster is registered and linked', () => {
    const expectedRoutes = [
      '/calculators/retirement-withdrawal-calculator/',
      '/calculators/safe-withdrawal-rate-calculator/',
      '/calculators/4-percent-rule-calculator/',
      '/calculators/coast-fire-calculator/',
    ];
    const requiredRelatedIds = [
      'fire-calculator',
      'roth-ira-calculator',
      '401k-calculator',
      'compound-interest-calculator',
      'investment-growth-calculator',
      'retirement-tax-drag-calculator',
    ];
    const calculatorUrls = new Set(calculators.map((item) => item.url));
    const fireRetirementCategory = calculatorCategories.find(
      (category) => category.slug === 'fire-retirement',
    );

    expect(expectedRoutes.every((route) => calculatorUrls.has(route))).toBe(
      true,
    );
    expect(fireRetirementCategory?.ids).toEqual(
      expect.arrayContaining([
        'retirement-withdrawal-calculator',
        'safe-withdrawal-rate-calculator',
        'four-percent-rule-calculator',
        'coast-fire-calculator',
      ]),
    );

    for (const route of expectedRoutes) {
      const config = calculators.find((calculator) => calculator.url === route);
      const relatedUrls = new Set(
        createRelatedCalculatorLinks(route).map((item) => item.url),
      );

      expect(config?.faq.length).toBeGreaterThanOrEqual(7);
      expect(config?.relatedIds).toEqual(
        expect.arrayContaining(requiredRelatedIds),
      );
      expect(relatedUrls.has('/calculators/fire-calculator/')).toBe(true);
      expect(
        relatedUrls.has('/calculators/retirement-withdrawal-calculator/') ||
          relatedUrls.has('/calculators/safe-withdrawal-rate-calculator/') ||
          relatedUrls.has('/calculators/4-percent-rule-calculator/') ||
          relatedUrls.has('/calculators/coast-fire-calculator/'),
      ).toBe(true);
    }
  });

  test('retirement withdrawal calculator cluster pages include related guides', async ({
    page,
  }) => {
    for (const route of [
      '/calculators/retirement-withdrawal-calculator/',
      '/calculators/safe-withdrawal-rate-calculator/',
      '/calculators/4-percent-rule-calculator/',
      '/calculators/coast-fire-calculator/',
    ]) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(
        page.getByRole('heading', { name: 'Related Guides' }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Planning Retirement Withdrawals' }),
      ).toHaveAttribute('href', '/guides/retirement-withdrawals/');
    }
  });

  test('rent vs buy and housing cluster routes and related tools are registered', () => {
    const expectedRoutes = [
      '/calculators/rent-vs-buy-calculator/',
      '/calculators/home-affordability-calculator/',
      '/calculators/down-payment-calculator/',
      '/calculators/mortgage-payment-calculator/',
      '/calculators/property-tax-calculator/',
      '/calculators/home-maintenance-cost-calculator/',
      '/calculators/closing-cost-calculator/',
    ];
    const calculatorUrls = new Set(calculators.map((item) => item.url));
    const homeMortgageCategory = calculatorCategories.find(
      (category) => category.slug === 'home-mortgage',
    );

    expect(expectedRoutes.every((route) => calculatorUrls.has(route))).toBe(
      true,
    );
    expect(homeMortgageCategory?.ids).toEqual(
      expect.arrayContaining([
        'rent-vs-buy-calculator',
        'home-affordability-calculator',
        'down-payment-calculator',
        'mortgage-payment-calculator',
        'property-tax-calculator',
        'home-maintenance-cost-calculator',
        'closing-cost-calculator',
        'mortgage-payoff-calculator',
        'mortgage-recast-calculator',
        'refinance-calculator',
      ]),
    );

    const clusterRelatedUrls = new Set<string>();

    for (const route of expectedRoutes) {
      const relatedUrls = new Set(
        createRelatedCalculatorLinks(route).map((item) => item.url),
      );

      for (const relatedUrl of relatedUrls) {
        clusterRelatedUrls.add(relatedUrl);
      }

      expect(
        relatedUrls.has('/calculators/rent-vs-buy-calculator/') ||
          relatedUrls.has('/calculators/home-affordability-calculator/') ||
          relatedUrls.has('/calculators/down-payment-calculator/') ||
          relatedUrls.has('/calculators/mortgage-payment-calculator/'),
      ).toBe(true);
    }

    expect(Array.from(clusterRelatedUrls)).toEqual(
      expect.arrayContaining([
        '/calculators/mortgage-payoff-calculator/',
        '/calculators/mortgage-recast-calculator/',
        '/calculators/refinance-calculator/',
        '/calculators/savings-goal-calculator/',
      ]),
    );
  });

  test('rent vs buy and housing calculator pages include the hosted newsletter CTA', async ({
    page,
  }) => {
    for (const route of [
      '/calculators/rent-vs-buy-calculator/',
      '/calculators/home-affordability-calculator/',
      '/calculators/down-payment-calculator/',
      '/calculators/mortgage-payment-calculator/',
      '/calculators/property-tax-calculator/',
      '/calculators/home-maintenance-cost-calculator/',
      '/calculators/closing-cost-calculator/',
    ]) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(newsletterCta(page)).toBeVisible();
      await expect(newsletterLink(page)).toHaveAttribute(
        'href',
        newsletterConfig.publicationUrl,
      );
    }
  });

  test('debt and credit-card payoff cluster routes and related tools are registered', () => {
    const expectedRoutes = [
      '/calculators/credit-card-payoff-calculator/',
      '/calculators/credit-card-minimum-payment-calculator/',
      '/calculators/credit-card-extra-payment-calculator/',
      '/calculators/balance-transfer-calculator/',
      '/calculators/debt-payoff-calculator/',
      '/calculators/debt-snowball-calculator/',
      '/calculators/debt-avalanche-calculator/',
    ];
    const calculatorUrls = new Set(calculators.map((item) => item.url));
    const debtCategory = calculatorCategories.find(
      (category) => category.slug === 'debt-loans',
    );

    expect(expectedRoutes.every((route) => calculatorUrls.has(route))).toBe(
      true,
    );
    expect(debtCategory?.ids).toEqual(
      expect.arrayContaining([
        'credit-card-payoff-calculator',
        'credit-card-minimum-payment-calculator',
        'credit-card-extra-payment-calculator',
        'balance-transfer-calculator',
        'debt-payoff-calculator',
        'debt-snowball-calculator',
        'debt-avalanche-calculator',
        'credit-card-interest-calculator',
      ]),
    );

    for (const route of expectedRoutes.slice(0, 4)) {
      const relatedUrls = new Set(
        createRelatedCalculatorLinks(route).map((item) => item.url),
      );

      expect(
        relatedUrls.has('/calculators/debt-payoff-calculator/') ||
          relatedUrls.has('/calculators/debt-avalanche-calculator/'),
      ).toBe(true);
      expect(
        relatedUrls.has('/calculators/credit-card-interest-calculator/'),
      ).toBe(true);
      expect(
        relatedUrls.has('/calculators/budget-calculator/') ||
          relatedUrls.has('/calculators/emergency-fund-calculator/'),
      ).toBe(true);
    }
  });

  test('debt and credit-card payoff pages include the hosted newsletter CTA', async ({
    page,
  }) => {
    for (const route of [
      '/calculators/credit-card-payoff-calculator/',
      '/calculators/credit-card-minimum-payment-calculator/',
      '/calculators/credit-card-extra-payment-calculator/',
      '/calculators/balance-transfer-calculator/',
      '/calculators/debt-payoff-calculator/',
      '/calculators/debt-snowball-calculator/',
      '/calculators/debt-avalanche-calculator/',
    ]) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(newsletterCta(page)).toBeVisible();
      await expect(newsletterLink(page)).toHaveAttribute(
        'href',
        newsletterConfig.publicationUrl,
      );
    }
  });

  test('401(k) cluster routes, editable defaults, and related tools are registered', () => {
    const expectedRoutes = [
      '/calculators/401k-calculator/',
      '/calculators/401k-growth-calculator/',
      '/calculators/401k-contribution-calculator/',
      '/calculators/employer-match-calculator/',
      '/calculators/traditional-vs-roth-401k-calculator/',
      '/calculators/401k-catch-up-contribution-calculator/',
    ];
    const calculatorUrls = new Set(calculators.map((item) => item.url));

    expect(expectedRoutes.every((route) => calculatorUrls.has(route))).toBe(
      true,
    );
    expect(
      fourOhOneKPlanningDefaults.assumedAnnualEmployeeContributionLimit,
    ).toBeGreaterThan(0);
    expect(
      fourOhOneKPlanningDefaults.assumedCatchUpContributionAmount,
    ).toBeGreaterThan(0);

    for (const route of expectedRoutes) {
      const relatedUrls = new Set(
        createRelatedCalculatorLinks(route).map((item) => item.url),
      );
      expect(relatedUrls.has('/calculators/roth-ira-calculator/')).toBe(true);
      expect(
        relatedUrls.has('/calculators/roth-ira-growth-calculator/'),
      ).toBe(true);
      expect(
        relatedUrls.has(
          '/calculators/roth-ira-vs-taxable-account-calculator/',
        ),
      ).toBe(true);
    }
  });

  test('401(k) calculator pages include the newsletter acquisition CTA', async ({
    page,
  }) => {
    for (const route of [
      '/calculators/401k-calculator/',
      '/calculators/401k-growth-calculator/',
      '/calculators/401k-contribution-calculator/',
      '/calculators/employer-match-calculator/',
      '/calculators/traditional-vs-roth-401k-calculator/',
      '/calculators/401k-catch-up-contribution-calculator/',
    ]) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(newsletterCta(page)).toBeVisible();
      await expect(newsletterLink(page)).toHaveAttribute(
        'href',
        newsletterConfig.publicationUrl,
      );
    }
  });

  test('Roth IRA cluster routes, editable defaults, and related tools are registered', () => {
    const expectedRoutes = [
      '/calculators/roth-ira-calculator/',
      '/calculators/roth-ira-growth-calculator/',
      '/calculators/roth-ira-contribution-calculator/',
      '/calculators/roth-ira-max-contribution-calculator/',
      '/calculators/roth-ira-vs-taxable-account-calculator/',
      '/calculators/roth-ira-early-withdrawal-calculator/',
    ];
    const calculatorUrls = new Set(calculators.map((item) => item.url));

    expect(expectedRoutes.every((route) => calculatorUrls.has(route))).toBe(
      true,
    );
    expect(rothIraPlanningDefaults.assumedAnnualContributionLimit).toBeGreaterThan(
      0,
    );

    for (const route of expectedRoutes) {
      const relatedUrls = new Set(
        createRelatedCalculatorLinks(route).map((item) => item.url),
      );
      expect(relatedUrls.has('/calculators/ira-growth-calculator/')).toBe(true);
      expect(
        relatedUrls.has('/calculators/roth-vs-traditional-ira-calculator/'),
      ).toBe(true);
      expect(relatedUrls.has('/calculators/401k-growth-calculator/')).toBe(
        true,
      );
    }
  });

  test('Roth IRA calculator pages include the newsletter acquisition CTA', async ({
    page,
  }) => {
    for (const route of [
      '/calculators/roth-ira-calculator/',
      '/calculators/roth-ira-growth-calculator/',
      '/calculators/roth-ira-contribution-calculator/',
      '/calculators/roth-ira-max-contribution-calculator/',
      '/calculators/roth-ira-vs-taxable-account-calculator/',
      '/calculators/roth-ira-early-withdrawal-calculator/',
    ]) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(newsletterCta(page)).toBeVisible();
      await expect(newsletterLink(page)).toHaveAttribute(
        'href',
        newsletterConfig.publicationUrl,
      );
    }
  });

  test('savings goal calculator cluster routes and relationships are registered', () => {
    const expectedRoutes = [
      '/calculators/monthly-savings-calculator/',
      '/calculators/weekly-savings-calculator/',
      '/calculators/daily-savings-calculator/',
      '/calculators/down-payment-calculator/',
      '/calculators/emergency-fund-calculator/',
      '/calculators/vacation-savings-calculator/',
      '/calculators/car-savings-calculator/',
    ];
    const configs = expectedRoutes.map((route) =>
      calculators.find((calculator) => calculator.url === route),
    );

    expect(configs.every((config) => config !== undefined)).toBe(true);
    for (const config of configs) {
      if (config?.url === '/calculators/down-payment-calculator/') {
        expect(config.relatedIds).toEqual(
          expect.arrayContaining([
            'savings-goal-calculator',
            'home-affordability-calculator',
            'mortgage-payment-calculator',
            'closing-cost-calculator',
            'rent-vs-buy-calculator',
            'savings-growth-calculator',
          ]),
        );
      } else {
        expect(config?.relatedIds).toEqual(
          expect.arrayContaining([
            'savings-goal-calculator',
            'compound-interest-calculator',
            'savings-growth-calculator',
            'investment-growth-calculator',
            'fire-calculator',
          ]),
        );
      }
    }
  });

  test('periodic savings variants reuse the shared target math', () => {
    const input = {
      goalAmount: 25000,
      currentSavings: 2500,
      annualReturnPercent: 3,
      years: 3,
    };
    const monthly = calculateRequiredPeriodicSavings({
      ...input,
      periodsPerYear: 12,
    });
    const weekly = calculateRequiredPeriodicSavings({
      ...input,
      periodsPerYear: 52,
    });
    const daily = calculateRequiredPeriodicSavings({
      ...input,
      periodsPerYear: 365,
    });

    expect(monthly.requiredContribution).toBeGreaterThan(
      weekly.requiredContribution,
    );
    expect(weekly.requiredContribution).toBeGreaterThan(
      daily.requiredContribution,
    );
    expect(monthly.endingBalance).toBeCloseTo(input.goalAmount, 6);
    expect(weekly.endingBalance).toBeCloseTo(input.goalAmount, 6);
    expect(daily.endingBalance).toBeCloseTo(input.goalAmount, 6);
  });

  test('compound-interest cluster calculations reuse the shared math correctly', () => {
    const annual = calculateCompoundInterest({
      principal: 10000,
      monthlyContribution: 0,
      annualRatePercent: 6,
      years: 1,
      periodsPerYear: 1,
    });
    const quarterly = calculateCompoundInterest({
      principal: 10000,
      monthlyContribution: 0,
      annualRatePercent: 6,
      years: 1,
      periodsPerYear: 4,
    });
    const monthly = calculateCompoundInterest({
      principal: 10000,
      monthlyContribution: 0,
      annualRatePercent: 6,
      years: 1,
      periodsPerYear: 12,
    });
    const daily = calculateCompoundInterest({
      principal: 10000,
      monthlyContribution: 0,
      annualRatePercent: 6,
      years: 1,
      periodsPerYear: 365,
    });
    const apy = calculateApy(6, 12, 10000);

    expect(annual.finalBalance).toBeLessThan(quarterly.finalBalance);
    expect(quarterly.finalBalance).toBeLessThan(monthly.finalBalance);
    expect(monthly.finalBalance).toBeLessThan(daily.finalBalance);
    expect(apy.apyPercent).toBeCloseTo(6.1678, 3);
    expect(apy.endingBalance).toBeCloseTo(monthly.finalBalance, 8);
  });

  test('compound-interest cluster routes and internal-link targets are registered', () => {
    const expectedRoutes = [
      '/calculators/daily-compound-interest-calculator/',
      '/calculators/monthly-compound-interest-calculator/',
      '/calculators/quarterly-compound-interest-calculator/',
      '/calculators/annual-compound-interest-calculator/',
      '/calculators/apy-calculator/',
      '/calculators/investment-growth-calculator/',
      '/calculators/savings-growth-calculator/',
    ];
    const calculatorUrls = new Set(
      Object.values(calculatorConfigs).map((calculator) => calculator.url),
    );

    expect(expectedRoutes.every((route) => calculatorUrls.has(route))).toBe(
      true,
    );

    for (const route of expectedRoutes) {
      const related = createRelatedCalculatorLinks(route);
      const relatedUrls = new Set(related.map((item) => item.url));

      expect(relatedUrls.has('/calculators/compound-interest/')).toBe(true);
      expect(relatedUrls.has('/calculators/rule-of-72-calculator/')).toBe(true);
      expect(relatedUrls.has('/calculators/cagr-calculator/')).toBe(true);
    }
  });

  test('centralized calculator page content is complete and unique', () => {
    const allFaqQuestions: string[] = [];
    const calculatorUrls = new Set(calculators.map((calculator) => calculator.url));

    for (const calculator of calculators) {
      const faq = createCalculatorFaqs(
        calculator.title,
        calculator.description,
        calculator.inputs,
        calculator.outputs,
        calculator.faq,
      );
      const related = createRelatedCalculatorLinks(calculator.url);
      const howItWorks = createCalculatorHowItWorks(
        calculator.title,
        calculator.description,
        calculator.inputs,
        calculator.outputs,
      );

      expect(faq.length).toBeGreaterThanOrEqual(6);
      expect(faq.length).toBeLessThanOrEqual(8);
      expect(new Set(faq.map((item) => item.question)).size).toBe(faq.length);
      allFaqQuestions.push(...faq.map((item) => item.question));

      expect(related.length).toBeGreaterThanOrEqual(4);
      expect(related.length).toBeLessThanOrEqual(6);
      expect(new Set(related.map((item) => item.url)).size).toBe(related.length);
      expect(related.every((item) => calculatorUrls.has(item.url))).toBe(true);
      expect(related.some((item) => item.url === calculator.url)).toBe(false);

      expect(Object.values(howItWorks).every((value) => value.length > 0)).toBe(
        true,
      );
    }

    expect(new Set(allFaqQuestions).size).toBe(allFaqQuestions.length);
  });

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
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://automatorlabs.co${calculator.url}`,
      );
      await expect(
        page.getByRole('navigation', { name: 'Breadcrumb' }),
      ).toBeVisible();
      await expect(
        page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', {
          name: 'Home',
          exact: true,
        }),
      ).toHaveAttribute('href', '/');
      await expect(
        page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', {
          name: 'Calculators',
          exact: true,
        }),
      ).toHaveAttribute('href', '/calculators/');
      await expect(
        page.getByRole('heading', {
          level: 2,
          name: 'How this calculator works',
        }),
      ).toBeVisible();

      const faqItems = page.locator('.faq-list details');
      expect(await faqItems.count()).toBeGreaterThanOrEqual(6);
      expect(await faqItems.count()).toBeLessThanOrEqual(8);

      const relatedCalculatorLinks = page.locator(
        '.related-calculators .related-calculator-grid a',
      );
      expect(await relatedCalculatorLinks.count()).toBeGreaterThanOrEqual(4);
      expect(await relatedCalculatorLinks.count()).toBeLessThanOrEqual(6);
      const relatedHrefs = await relatedCalculatorLinks.evaluateAll((links) =>
        links.map((link) => link.getAttribute('href') ?? ''),
      );
      expect(
        relatedHrefs.every((href) =>
          calculators.some((candidate) => candidate.url === href),
        ),
      ).toBe(true);

      const schemas = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => script.textContent ?? '').join('\n'),
        );
      expect(schemas).toContain('"@type":"FAQPage"');
      expect(schemas).toContain('"@type":"BreadcrumbList"');

      const headingLevels = await page
        .locator('main h1, main h2, main h3, main h4, main h5, main h6')
        .evaluateAll((headings) =>
          headings.map((heading) => Number(heading.tagName.slice(1))),
        );
      expect(headingLevels[0]).toBe(1);
      for (let index = 1; index < headingLevels.length; index += 1) {
        expect(headingLevels[index] - headingLevels[index - 1]).toBeLessThanOrEqual(
          1,
        );
      }

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
      title: 'Mortgage Payment',
      url: '/calculators/mortgage-payment-calculator/',
      firstCell: 'Principal and interest',
    },
    {
      title: 'Property Tax',
      url: '/calculators/property-tax-calculator/',
      firstCell: '1',
    },
    {
      title: 'Home Maintenance Cost',
      url: '/calculators/home-maintenance-cost-calculator/',
      firstCell: '1',
    },
    {
      title: 'Closing Cost',
      url: '/calculators/closing-cost-calculator/',
      firstCell: 'Down payment',
    },
    {
      title: 'Rent vs Buy',
      url: '/calculators/rent-vs-buy-calculator/',
      firstCell: '1',
    },
    {
      title: 'Home Affordability',
      url: '/calculators/home-affordability-calculator/',
      firstCell: 'Principal and interest',
    },
    {
      title: 'Down Payment',
      url: '/calculators/down-payment-calculator/',
      firstCell: '1',
    },
    {
      title: 'Mortgage Recast',
      url: '/calculators/mortgage-recast-calculator/',
      firstCell: 'Before recast',
    },
    {
      title: 'Debt Payoff',
      url: '/calculators/debt-payoff-calculator/',
      firstCell: '1',
    },
    {
      title: 'Credit Card Payoff',
      url: '/calculators/credit-card-payoff-calculator/',
      firstCell: '1',
    },
    {
      title: 'Credit Card Minimum Payment',
      url: '/calculators/credit-card-minimum-payment-calculator/',
      firstCell: '1',
    },
    {
      title: 'Credit Card Extra Payment',
      url: '/calculators/credit-card-extra-payment-calculator/',
      firstCell: '1',
    },
    {
      title: 'Balance Transfer',
      url: '/calculators/balance-transfer-calculator/',
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
