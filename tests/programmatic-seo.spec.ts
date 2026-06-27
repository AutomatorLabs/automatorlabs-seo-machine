import { expect, test } from '@playwright/test';
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
  apySeoRecords,
  EXPECTED_APY_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/apy';
import { auditApySeoRecords } from '../src/lib/programmatic-seo/apy';
import {
  cagrSeoRecords,
  EXPECTED_CAGR_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/cagr';
import { auditCagrSeoRecords } from '../src/lib/programmatic-seo/cagr';
import {
  EXPECTED_RULE_OF_72_SEO_PAGE_COUNT,
  ruleOf72SeoRecords,
} from '../src/data/programmatic-seo/rule-of-72';
import { auditRuleOf72SeoRecords } from '../src/lib/programmatic-seo/rule-of-72';
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
import {
  EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT,
  investmentGrowthSeoRecords,
} from '../src/data/programmatic-seo/investment-growth';
import { auditInvestmentGrowthSeoRecords } from '../src/lib/programmatic-seo/investment-growth';
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
import { newsletterCta } from './helpers/calculator-test-helpers';

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

test.describe('investment growth programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditInvestmentGrowthSeoRecords(
      investmentGrowthSeoRecords,
      EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT,
      actualCount: EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the investment growth examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/investment-growth-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 investment growth examples',
      }),
    ).toHaveAttribute('href', '/calculators/investment-growth/examples/');
  });

  test('examples index exposes, groups, and searches every investment growth page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/investment-growth/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Investment Growth Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-investment-growth-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-investment-growth-example-card]'),
    ).toHaveCount(EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/investment-growth/examples/',
    );

    const hrefs = await page
      .locator('[data-investment-growth-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(
      EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search investment growth examples',
    });
    await searchBox.fill('taxable');
    await expect(
      page.locator(
        '[data-investment-growth-example-card]:visible',
      ),
    ).toHaveCount(12);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator(
        '[data-investment-growth-example-card]:visible',
      ),
    ).toHaveCount(EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', { name: 'Build your own projection' }),
    ).toHaveAttribute('href', '/calculators/investment-growth-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'lump-sum-10000-at-8-percent-for-30-years',
    'invest-25000-with-1000-monthly-at-7-percent-for-20-years',
    'retirement-investing-50000-with-1000-monthly-at-8-percent-for-30-years',
    'taxable-investing-50000-with-1500-monthly-at-7-percent-for-25-years',
  ]) {
    test(`renders generated investment growth page ${slug}`, async ({
      page,
    }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = investmentGrowthSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing investment growth record: ${slug}`);
      }

      const url = `/calculators/investment-growth/${record.slug}/`;
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
          name: 'Open the Investment Growth Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/investment-growth-calculator/');
      await expect(
        page.getByRole('link', {
          name: 'Browse All Investment Growth Examples',
        }),
      ).toHaveAttribute('href', '/calculators/investment-growth/examples/');
      await expect(
        page.locator(
          'a[href="/guides/investment-growth/"]',
        ).first(),
      ).toBeVisible();
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('cagr programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditCagrSeoRecords(
      cagrSeoRecords,
      EXPECTED_CAGR_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_CAGR_SEO_PAGE_COUNT,
      actualCount: EXPECTED_CAGR_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_CAGR_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_CAGR_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_CAGR_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_CAGR_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the cagr examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/cagr-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 CAGR examples',
      }),
    ).toHaveAttribute('href', '/calculators/cagr/examples/');
  });

  test('examples index exposes, groups, and searches every cagr page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/cagr/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'CAGR Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('[data-cagr-example-group]')).toHaveCount(4);
    await expect(page.locator('[data-cagr-example-card]')).toHaveCount(
      EXPECTED_CAGR_SEO_PAGE_COUNT,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/cagr/examples/',
    );

    const hrefs = await page
      .locator('[data-cagr-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(EXPECTED_CAGR_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search CAGR examples',
    });
    await searchBox.fill('crypto');
    await expect(page.locator('[data-cagr-example-card]:visible')).toHaveCount(
      25,
    );
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(page.locator('[data-cagr-example-card]:visible')).toHaveCount(
      EXPECTED_CAGR_SEO_PAGE_COUNT,
    );
    await expect(
      page.getByRole('link', { name: 'Calculate your own CAGR' }),
    ).toHaveAttribute('href', '/calculators/cagr-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'stock-cagr-10000-to-18000-over-5-years',
    'real-estate-cagr-300000-to-480000-over-10-years',
    'revenue-cagr-1000000-to-1800000-over-4-years',
    'portfolio-cagr-250000-to-430000-over-12-years',
  ]) {
    test(`renders generated cagr page ${slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = cagrSeoRecords.find((candidate) => candidate.slug === slug);
      if (!record) {
        throw new Error(`Missing cagr record: ${slug}`);
      }

      const url = `/calculators/cagr/${record.slug}/`;
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
          name: 'Open the CAGR Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/cagr-calculator/');
      await expect(
        page.getByRole('link', {
          name: 'Browse All CAGR Examples',
        }),
      ).toHaveAttribute('href', '/calculators/cagr/examples/');
      await expect(
        page.locator('a[href="/guides/what-is-cagr/"]').first(),
      ).toBeVisible();
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('apy programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditApySeoRecords(
      apySeoRecords,
      EXPECTED_APY_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_APY_SEO_PAGE_COUNT,
      actualCount: EXPECTED_APY_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_APY_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_APY_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_APY_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_APY_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the apy examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/apy-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 APY examples',
      }),
    ).toHaveAttribute('href', '/calculators/apy/examples/');
  });

  test('examples index exposes, groups, and searches every apy page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/apy/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'APY Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('[data-apy-example-group]')).toHaveCount(5);
    await expect(page.locator('[data-apy-example-card]')).toHaveCount(
      EXPECTED_APY_SEO_PAGE_COUNT,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/apy/examples/',
    );

    const hrefs = await page
      .locator('[data-apy-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(EXPECTED_APY_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search APY examples',
    });
    await searchBox.fill('checking');
    await expect(page.locator('[data-apy-example-card]:visible')).toHaveCount(
      25,
    );
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(page.locator('[data-apy-example-card]:visible')).toHaveCount(
      EXPECTED_APY_SEO_PAGE_COUNT,
    );
    await expect(
      page.getByRole('link', { name: 'Calculate your own APY' }),
    ).toHaveAttribute('href', '/calculators/apy-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'high-yield-savings-apy-25000-at-4-35-percent-daily',
    'cd-apy-10000-at-5-percent-annual',
    'daily-compounding-apy-10000-at-5-25-percent',
    'stated-rate-vs-apy-10000-at-4-percent-monthly',
  ]) {
    test(`renders generated apy page ${slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = apySeoRecords.find((candidate) => candidate.slug === slug);
      if (!record) {
        throw new Error(`Missing apy record: ${slug}`);
      }

      const url = `/calculators/apy/${record.slug}/`;
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
          name: 'Open the APY Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/apy-calculator/');
      await expect(
        page.getByRole('link', {
          name: 'Browse All APY Examples',
        }),
      ).toHaveAttribute('href', '/calculators/apy/examples/');
      await expect(
        page.locator('a[href="/guides/what-is-apy/"]').first(),
      ).toBeVisible();
      await expect(page.locator('tbody tr')).toHaveCount(12);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('rule of 72 programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditRuleOf72SeoRecords(
      ruleOf72SeoRecords,
      EXPECTED_RULE_OF_72_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_RULE_OF_72_SEO_PAGE_COUNT,
      actualCount: EXPECTED_RULE_OF_72_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_RULE_OF_72_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_RULE_OF_72_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_RULE_OF_72_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_RULE_OF_72_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the rule of 72 examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/rule-of-72-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 Rule of 72 examples',
      }),
    ).toHaveAttribute('href', '/calculators/rule-of-72/examples/');
  });

  test('examples index exposes, groups, and searches every rule of 72 page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/rule-of-72/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Rule of 72 Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('[data-rule-of-72-example-group]')).toHaveCount(
      5,
    );
    await expect(page.locator('[data-rule-of-72-example-card]')).toHaveCount(
      EXPECTED_RULE_OF_72_SEO_PAGE_COUNT,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/rule-of-72/examples/',
    );

    const hrefs = await page
      .locator('[data-rule-of-72-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(EXPECTED_RULE_OF_72_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search Rule of 72 examples',
    });
    await searchBox.fill('inflation');
    await expect(
      page.locator('[data-rule-of-72-example-card]:visible'),
    ).toHaveCount(25);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-rule-of-72-example-card]:visible'),
    ).toHaveCount(EXPECTED_RULE_OF_72_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', {
        name: 'Estimate your own doubling time',
      }),
    ).toHaveAttribute('href', '/calculators/rule-of-72-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'double-10000-at-8-percent',
    'inflation-10000-at-3-percent',
    'retirement-500000-at-7-percent',
    'high-yield-savings-10000-at-4-5-percent',
  ]) {
    test(`renders generated rule of 72 page ${slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = ruleOf72SeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing rule of 72 record: ${slug}`);
      }

      const url = `/calculators/rule-of-72/${record.slug}/`;
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
          name: 'Open the Rule of 72 Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/rule-of-72-calculator/');
      await expect(
        page.getByRole('link', {
          name: 'Browse All Rule of 72 Examples',
        }),
      ).toHaveAttribute('href', '/calculators/rule-of-72/examples/');
      await expect(
        page.locator('a[href="/guides/rule-of-72/"]').first(),
      ).toBeVisible();
      await expect(page.locator('tbody tr')).toHaveCount(
        Math.max(3, Math.ceil(72 / record.annualReturnPercent)),
      );
      expect(pageErrors).toEqual([]);
    });
  }
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
