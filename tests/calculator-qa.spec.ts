import { expect, test } from '@playwright/test';
import { calculatorConfigs } from '../src/data/calculators';
import { calculatorCategories } from '../src/data/calculator-categories';
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
import { rothIraPlanningDefaults } from '../src/config/roth-ira';
import { fourOhOneKPlanningDefaults } from '../src/config/401k';
import {
  calculators,
  clipboardOrigin,
  newsletterConfig,
  newsletterCta,
  newsletterLink,
  readStructuredData,
  stubAnalytics,
} from './helpers/calculator-test-helpers';

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

  test('explicit relatedIds keep priority over fallback relevance scoring', () => {
    const relatedUrls = createRelatedCalculatorLinks(
      '/calculators/401k-calculator/',
    ).map((item) => item.url);

    expect(relatedUrls.slice(0, 6)).toEqual([
      '/calculators/roth-ira-calculator/',
      '/calculators/roth-ira-growth-calculator/',
      '/calculators/roth-ira-vs-taxable-account-calculator/',
      '/calculators/ira-growth-calculator/',
      '/calculators/roth-vs-traditional-ira-calculator/',
      '/calculators/taxable-vs-tax-advantaged-calculator/',
    ]);
  });

  test('related calculator fallback prefers closer topical matches before broad category fallback', () => {
    const relatedUrls = createRelatedCalculatorLinks(
      '/calculators/retirement-income-gap-calculator/',
    ).map((item) => item.url);

    expect(relatedUrls).toEqual(
      expect.arrayContaining([
        '/calculators/retirement-withdrawal-calculator/',
        '/calculators/safe-withdrawal-rate-calculator/',
        '/calculators/fire-calculator/',
        '/calculators/portfolio-withdrawal-sustainability-calculator/',
      ]),
    );
    expect(relatedUrls).not.toEqual(
      expect.arrayContaining([
        '/calculators/roth-ira-calculator/',
        '/calculators/401k-calculator/',
      ]),
    );
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
      await stubAnalytics(page);

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

      const schemas = await readStructuredData(page);
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
      origin: clipboardOrigin,
    });
    await stubAnalytics(page);

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
