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
import {
  auditCompoundInterestSeoRecords,
  createCompoundInterestSeoPage,
} from '../src/lib/programmatic-seo/compound-interest';
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
  dripSeoRecords,
  EXPECTED_DRIP_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/drip';
import { auditDripSeoRecords } from '../src/lib/programmatic-seo/drip';
import {
  dividendGrowthSeoRecords,
  EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/dividend-growth';
import { auditDividendGrowthSeoRecords } from '../src/lib/programmatic-seo/dividend-growth';
import {
  dividendYieldSeoRecords,
  EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/dividend-yield';
import { auditDividendYieldSeoRecords } from '../src/lib/programmatic-seo/dividend-yield';
import {
  emergencyFundSeoRecords,
  EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/emergency-fund';
import { auditEmergencyFundSeoRecords } from '../src/lib/programmatic-seo/emergency-fund';
import {
  etfFeeDragSeoRecords,
  EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/etf-fee-drag';
import { auditEtfFeeDragSeoRecords } from '../src/lib/programmatic-seo/etf-fee-drag';
import {
  expenseRatioSeoRecords,
  EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/expense-ratio';
import { auditExpenseRatioSeoRecords } from '../src/lib/programmatic-seo/expense-ratio';
import {
  EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT,
  inflationAdjustedReturnSeoRecords,
} from '../src/data/programmatic-seo/inflation-adjusted-return';
import { auditInflationAdjustedReturnSeoRecords } from '../src/lib/programmatic-seo/inflation-adjusted-return';
import {
  EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT,
  investmentFeeSeoRecords,
} from '../src/data/programmatic-seo/investment-fee';
import { auditInvestmentFeeSeoRecords } from '../src/lib/programmatic-seo/investment-fee';
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
  creditCardInterestSeoRecords,
  EXPECTED_CREDIT_CARD_INTEREST_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/credit-card-interest';
import {
  creditCardMinimumPaymentSeoRecords,
  EXPECTED_CREDIT_CARD_MINIMUM_PAYMENT_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/credit-card-minimum-payment';
import {
  creditCardExtraPaymentSeoRecords,
  EXPECTED_CREDIT_CARD_EXTRA_PAYMENT_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/credit-card-extra-payment';
import {
  auditBalanceTransferSeoRecords,
  auditCreditCardPayoffSeoRecords,
} from '../src/lib/programmatic-seo/debt';
import { auditCreditCardInterestSeoRecords } from '../src/lib/programmatic-seo/credit-card-interest';
import { auditCreditCardMinimumPaymentSeoRecords } from '../src/lib/programmatic-seo/credit-card-minimum-payment';
import { auditCreditCardExtraPaymentSeoRecords } from '../src/lib/programmatic-seo/credit-card-extra-payment';
import {
  autoLoanSeoRecords,
  EXPECTED_AUTO_LOAN_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/auto-loan';
import { auditAutoLoanSeoRecords } from '../src/lib/programmatic-seo/auto-loan';
import {
  debtAvalancheSeoRecords,
  EXPECTED_DEBT_AVALANCHE_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/debt-avalanche';
import { auditDebtAvalancheSeoRecords } from '../src/lib/programmatic-seo/debt-avalanche';
import {
  debtPayoffSeoRecords,
  EXPECTED_DEBT_PAYOFF_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/debt-payoff';
import { auditDebtPayoffSeoRecords } from '../src/lib/programmatic-seo/debt-payoff';
import {
  debtSnowballSeoRecords,
  EXPECTED_DEBT_SNOWBALL_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/debt-snowball';
import { auditDebtSnowballSeoRecords } from '../src/lib/programmatic-seo/debt-snowball';
import {
  EXPECTED_FIRE_SEO_PAGE_COUNT,
  fireSeoRecords,
} from '../src/data/programmatic-seo/fire';
import { auditFireSeoRecords } from '../src/lib/programmatic-seo/fire';
import {
  EXPECTED_HELOC_SEO_PAGE_COUNT,
  helocSeoRecords,
} from '../src/data/programmatic-seo/heloc';
import { auditHelocSeoRecords } from '../src/lib/programmatic-seo/heloc';
import {
  coastFireSeoRecords,
  EXPECTED_COAST_FIRE_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/coast-fire';
import { auditCoastFireSeoRecords } from '../src/lib/programmatic-seo/coast-fire';
import {
  EXPECTED_401K_SEO_PAGE_COUNT,
  fourOhOneKSeoRecords,
} from '../src/data/programmatic-seo/401k';
import {
  audit401kSeoRecords,
  create401kSeoPage,
} from '../src/lib/programmatic-seo/401k';
import {
  EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT,
  investmentGrowthSeoRecords,
} from '../src/data/programmatic-seo/investment-growth';
import {
  auditInvestmentGrowthSeoRecords,
  createInvestmentGrowthSeoPage,
} from '../src/lib/programmatic-seo/investment-growth';
import {
  EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT,
  lumpSumVsDcaSeoRecords,
} from '../src/data/programmatic-seo/lump-sum-vs-dca';
import { auditLumpSumVsDcaSeoRecords } from '../src/lib/programmatic-seo/lump-sum-vs-dca';
import {
  EXPECTED_LOAN_PAYMENT_SEO_PAGE_COUNT,
  loanPaymentSeoRecords,
} from '../src/data/programmatic-seo/loan-payment';
import { auditLoanPaymentSeoRecords } from '../src/lib/programmatic-seo/loan-payment';
import { programmaticSeoClusters } from '../src/data/programmatic-seo/clusters';
import {
  EXPECTED_MORTGAGE_SEO_PAGE_COUNT,
  mortgageSeoRecords,
} from '../src/data/programmatic-seo/mortgage';
import { auditMortgageSeoRecords } from '../src/lib/programmatic-seo/mortgage';
import {
  EXPECTED_MORTGAGE_PAYOFF_SEO_PAGE_COUNT,
  mortgagePayoffSeoRecords,
} from '../src/data/programmatic-seo/mortgage-payoff';
import { auditMortgagePayoffSeoRecords } from '../src/lib/programmatic-seo/mortgage-payoff';
import {
  EXPECTED_MORTGAGE_RECAST_SEO_PAGE_COUNT,
  mortgageRecastSeoRecords,
} from '../src/data/programmatic-seo/mortgage-recast';
import { auditMortgageRecastSeoRecords } from '../src/lib/programmatic-seo/mortgage-recast';
import {
  EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT,
  monthlySavingsSeoRecords,
} from '../src/data/programmatic-seo/monthly-savings';
import { auditMonthlySavingsSeoRecords } from '../src/lib/programmatic-seo/monthly-savings';
import {
  EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT,
  realRateOfReturnSeoRecords,
} from '../src/data/programmatic-seo/real-rate-of-return';
import { auditRealRateOfReturnSeoRecords } from '../src/lib/programmatic-seo/real-rate-of-return';
import {
  EXPECTED_PROPERTY_TAX_SEO_PAGE_COUNT,
  propertyTaxSeoRecords,
} from '../src/data/programmatic-seo/property-tax';
import { auditPropertyTaxSeoRecords } from '../src/lib/programmatic-seo/property-tax';
import {
  EXPECTED_RETIREMENT_INCOME_GAP_SEO_PAGE_COUNT,
  retirementIncomeGapSeoRecords,
} from '../src/data/programmatic-seo/retirement-income-gap';
import { auditRetirementIncomeGapSeoRecords } from '../src/lib/programmatic-seo/retirement-income-gap';
import {
  EXPECTED_RETIREMENT_TAX_DRAG_SEO_PAGE_COUNT,
  retirementTaxDragSeoRecords,
} from '../src/data/programmatic-seo/retirement-tax-drag';
import { auditRetirementTaxDragSeoRecords } from '../src/lib/programmatic-seo/retirement-tax-drag';
import {
  EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT,
  retirementWithdrawalSeoRecords,
} from '../src/data/programmatic-seo/retirement-withdrawal';
import { auditRetirementWithdrawalSeoRecords } from '../src/lib/programmatic-seo/retirement-withdrawal';
import {
  EXPECTED_ROTH_IRA_SEO_PAGE_COUNT,
  rothIraSeoRecords,
} from '../src/data/programmatic-seo/roth-ira';
import { auditRothIraSeoRecords } from '../src/lib/programmatic-seo/roth-ira';
import {
  EXPECTED_ROTH_EARLY_WITHDRAWAL_SEO_PAGE_COUNT,
  rothEarlyWithdrawalSeoRecords,
} from '../src/data/programmatic-seo/roth-ira-early-withdrawal';
import { auditRothEarlyWithdrawalSeoRecords } from '../src/lib/programmatic-seo/roth-ira-early-withdrawal';
import {
  EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
  traditionalVsRoth401kSeoRecords,
} from '../src/data/programmatic-seo/traditional-vs-roth-401k';
import { auditTraditionalVsRoth401kSeoRecords } from '../src/lib/programmatic-seo/traditional-vs-roth-401k';
import {
  EXPECTED_RENT_VS_BUY_SEO_PAGE_COUNT,
  rentVsBuySeoRecords,
} from '../src/data/programmatic-seo/rent-vs-buy';
import { auditRentVsBuySeoRecords } from '../src/lib/programmatic-seo/rent-vs-buy';
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
  EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT,
  savingsGrowthSeoRecords,
} from '../src/data/programmatic-seo/savings-growth';
import {
  auditSavingsGrowthSeoRecords,
  createSavingsGrowthSeoPage,
} from '../src/lib/programmatic-seo/savings-growth';
import {
  EXPECTED_STUDENT_LOAN_PAYOFF_SEO_PAGE_COUNT,
  studentLoanPayoffSeoRecords,
} from '../src/data/programmatic-seo/student-loan-payoff';
import { auditStudentLoanPayoffSeoRecords } from '../src/lib/programmatic-seo/student-loan-payoff';
import {
  EXPECTED_STUDENT_LOAN_SEO_PAGE_COUNT,
  studentLoanSeoRecords,
} from '../src/data/programmatic-seo/student-loan';
import { auditStudentLoanSeoRecords } from '../src/lib/programmatic-seo/student-loan';
import {
  closingCostSeoRecords,
  EXPECTED_CLOSING_COST_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/closing-cost';
import { auditClosingCostSeoRecords } from '../src/lib/programmatic-seo/closing-cost';
import {
  EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT,
  vacationSavingsSeoRecords,
} from '../src/data/programmatic-seo/vacation-savings';
import { auditVacationSavingsSeoRecords } from '../src/lib/programmatic-seo/vacation-savings';
import {
  EXPECTED_PORTFOLIO_WITHDRAWAL_SUSTAINABILITY_SEO_PAGE_COUNT,
  portfolioWithdrawalSustainabilitySeoRecords,
} from '../src/data/programmatic-seo/portfolio-withdrawal-sustainability';
import { auditPortfolioWithdrawalSustainabilitySeoRecords } from '../src/lib/programmatic-seo/portfolio-withdrawal-sustainability';
import {
  carSavingsSeoRecords,
  EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/car-savings';
import { auditCarSavingsSeoRecords } from '../src/lib/programmatic-seo/car-savings';
import {
  EXPECTED_YEARS_TO_RETIREMENT_SEO_PAGE_COUNT,
  yearsToRetirementSeoRecords,
} from '../src/data/programmatic-seo/years-to-retirement';
import { auditYearsToRetirementSeoRecords } from '../src/lib/programmatic-seo/years-to-retirement';
import { newsletterCta } from './helpers/calculator-test-helpers';

const safeBatchProgrammaticConfigs = [
  {
    label: 'credit card interest',
    records: creditCardInterestSeoRecords,
    expectedCount: EXPECTED_CREDIT_CARD_INTEREST_SEO_PAGE_COUNT,
    audit: auditCreditCardInterestSeoRecords,
    calculatorPath: '/calculators/credit-card-interest-calculator/',
    examplesPath: '/calculators/credit-card-interest/examples/',
    exampleLinkName: 'Browse all 200 credit card interest examples',
    representativeSlug:
      'monthly-interest-5000-balance-at-24-99-apr-paying-225-with-50-extra',
    pagePrefix: '/calculators/credit-card-interest/',
    ctaName: 'Open the Credit Card Interest Calculator',
  },
  {
    label: 'credit card minimum payment',
    records: creditCardMinimumPaymentSeoRecords,
    expectedCount: EXPECTED_CREDIT_CARD_MINIMUM_PAYMENT_SEO_PAGE_COUNT,
    audit: auditCreditCardMinimumPaymentSeoRecords,
    calculatorPath: '/calculators/credit-card-minimum-payment-calculator/',
    examplesPath: '/calculators/credit-card-minimum-payment/examples/',
    exampleLinkName: 'Browse all 200 credit card minimum payment examples',
    representativeSlug:
      'starter-balance-1500-balance-at-18-99-apr-2-percent-minimum-25-floor',
    pagePrefix: '/calculators/credit-card-minimum-payment/',
    ctaName: 'Open the Credit Card Minimum Payment Calculator',
  },
  {
    label: 'credit card extra payment',
    records: creditCardExtraPaymentSeoRecords,
    expectedCount: EXPECTED_CREDIT_CARD_EXTRA_PAYMENT_SEO_PAGE_COUNT,
    audit: auditCreditCardExtraPaymentSeoRecords,
    calculatorPath: '/calculators/credit-card-extra-payment-calculator/',
    examplesPath: '/calculators/credit-card-extra-payment/examples/',
    exampleLinkName: 'Browse all 200 credit card extra payment examples',
    representativeSlug:
      'starter-balance-3000-balance-at-18-99-apr-125-payment-25-extra',
    pagePrefix: '/calculators/credit-card-extra-payment/',
    ctaName: 'Open the Credit Card Extra Payment Calculator',
  },
  {
    label: 'mortgage recast',
    records: mortgageRecastSeoRecords,
    expectedCount: EXPECTED_MORTGAGE_RECAST_SEO_PAGE_COUNT,
    audit: auditMortgageRecastSeoRecords,
    calculatorPath: '/calculators/mortgage-recast-calculator/',
    examplesPath: '/calculators/mortgage-recast/examples/',
    exampleLinkName: 'Browse all 200 mortgage recast examples',
    representativeSlug:
      'starter-recast-300000-balance-5-rate-25-years-20000-recast-250-fee',
    pagePrefix: '/calculators/mortgage-recast/',
    ctaName: 'Open the Mortgage Recast Calculator',
  },
  {
    label: 'property tax',
    records: propertyTaxSeoRecords,
    expectedCount: EXPECTED_PROPERTY_TAX_SEO_PAGE_COUNT,
    audit: auditPropertyTaxSeoRecords,
    calculatorPath: '/calculators/property-tax-calculator/',
    examplesPath: '/calculators/property-tax/examples/',
    exampleLinkName: 'Browse all 200 property tax examples',
    representativeSlug:
      'starter-home-350000-home-0-95-tax-90-assessed-2-5-growth-15-years',
    pagePrefix: '/calculators/property-tax/',
    ctaName: 'Open the Property Tax Calculator',
  },
  {
    label: 'closing cost',
    records: closingCostSeoRecords,
    expectedCount: EXPECTED_CLOSING_COST_SEO_PAGE_COUNT,
    audit: auditClosingCostSeoRecords,
    calculatorPath: '/calculators/closing-cost-calculator/',
    examplesPath: '/calculators/closing-cost/examples/',
    exampleLinkName: 'Browse all 200 closing cost examples',
    representativeSlug:
      'starter-home-350000-price-35000-down-2-closing-3500-fixed-4000-prepaids-0-credits',
    pagePrefix: '/calculators/closing-cost/',
    ctaName: 'Open the Closing Cost Calculator',
  },
  {
    label: 'roth ira early withdrawal',
    records: rothEarlyWithdrawalSeoRecords,
    expectedCount: EXPECTED_ROTH_EARLY_WITHDRAWAL_SEO_PAGE_COUNT,
    audit: auditRothEarlyWithdrawalSeoRecords,
    calculatorPath: '/calculators/roth-ira-early-withdrawal-calculator/',
    examplesPath: '/calculators/roth-ira-early-withdrawal/examples/',
    exampleLinkName: 'Browse all 200 Roth IRA Early Withdrawal examples',
    representativeSlug:
      'contributions-only-withdraw-6000-with-12000-basis-1800-earnings-22-tax-10-penalty',
    pagePrefix: '/calculators/roth-ira-early-withdrawal/',
    ctaName: 'Open the Roth IRA Early Withdrawal Calculator',
  },
  {
    label: 'traditional vs roth 401k',
    records: traditionalVsRoth401kSeoRecords,
    expectedCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
    audit: auditTraditionalVsRoth401kSeoRecords,
    calculatorPath: '/calculators/traditional-vs-roth-401k-calculator/',
    examplesPath: '/calculators/traditional-vs-roth-401k/examples/',
    exampleLinkName: 'Browse all 200 Traditional vs Roth 401(k) examples',
    representativeSlug:
      'equal-bracket-contribute-10000-current-22-retirement-22-return-6-years-15',
    pagePrefix: '/calculators/traditional-vs-roth-401k/',
    ctaName: 'Open the Traditional vs Roth 401(k) Calculator',
  },
  {
    label: 'rent vs buy',
    records: rentVsBuySeoRecords,
    expectedCount: EXPECTED_RENT_VS_BUY_SEO_PAGE_COUNT,
    audit: auditRentVsBuySeoRecords,
    calculatorPath: '/calculators/rent-vs-buy-calculator/',
    examplesPath: '/calculators/rent-vs-buy/examples/',
    exampleLinkName: 'Browse all 200 rent vs buy examples',
    representativeSlug: 'short-hold-375000-home-2000-rent-6-5-rate-3-years',
    pagePrefix: '/calculators/rent-vs-buy/',
    ctaName: 'Open the Rent vs Buy Calculator',
  },
] as const;

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

  test('relatedCalculators links the frequency variant matching years % 4', () => {
    const expectedByRemainder: Record<number, string> = {
      0: '/calculators/annual-compound-interest-calculator/',
      1: '/calculators/daily-compound-interest-calculator/',
      2: '/calculators/monthly-compound-interest-calculator/',
      3: '/calculators/quarterly-compound-interest-calculator/',
    };

    for (const years of [8, 9, 10, 11]) {
      const record = {
        slug: `test-compound-interest-${years}`,
        question: 'Test question?',
        principal: 10000,
        annualRatePercent: 7,
        years,
        monthlyContribution: 0,
        periodsPerYear: 1,
      };
      const page = createCompoundInterestSeoPage(record, [record]);
      const urls = page.relatedCalculators.map((link) => link.url);
      expect(urls).toContain(expectedByRemainder[years % 4]);
    }
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

test.describe('coast FIRE programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    expect(
      auditCoastFireSeoRecords(
        coastFireSeoRecords,
        EXPECTED_COAST_FIRE_SEO_PAGE_COUNT,
      ),
    ).toEqual({
      expectedCount: EXPECTED_COAST_FIRE_SEO_PAGE_COUNT,
      actualCount: EXPECTED_COAST_FIRE_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_COAST_FIRE_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_COAST_FIRE_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_COAST_FIRE_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_COAST_FIRE_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the Coast FIRE examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/coast-fire-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', { name: 'Browse all 200 Coast FIRE examples' }),
    ).toHaveAttribute('href', '/calculators/coast-fire/examples/');
  });

  test('examples index exposes every Coast FIRE page', async ({ page }) => {
    const response = await page.goto('/calculators/coast-fire/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Coast FIRE Examples' }),
    ).toBeVisible();
    await expect(page.locator('[data-example-group]')).toHaveCount(3);
    await expect(page.locator('[data-example-card]')).toHaveCount(
      EXPECTED_COAST_FIRE_SEO_PAGE_COUNT,
    );
  });

  test('renders a generated Coast FIRE page', async ({ page }) => {
    const record = coastFireSeoRecords.find(
      (candidate) =>
        candidate.slug ===
        'coast-fire-age-35-retire-60-with-100000-saved-for-40000-spending-at-7-percent',
    );
    if (!record) throw new Error('Missing representative Coast FIRE SEO record');

    const url = `/calculators/coast-fire/${record.slug}/`;
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1, name: record.question }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Open the Coast FIRE Calculator' }),
    ).toHaveAttribute('href', '/calculators/coast-fire-calculator/');
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

  test('relatedCalculators links matching compound-interest frequency variant for monthly/annual investing intents', () => {
    const monthlyRecord = {
      slug: 'test-investment-growth-monthly',
      question: 'Test question?',
      intent: 'monthly-investing' as const,
      initialInvestment: 10000,
      monthlyContribution: 500,
      annualReturnPercent: 7,
      years: 20,
      accountLabel: 'monthly investing plan',
    };
    const monthlyPage = createInvestmentGrowthSeoPage(monthlyRecord, [monthlyRecord]);
    expect(monthlyPage.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/monthly-compound-interest-calculator/',
    );

    const annualRecord = {
      slug: 'test-investment-growth-annual',
      question: 'Test question?',
      intent: 'annual-investing' as const,
      initialInvestment: 10000,
      monthlyContribution: 500,
      annualReturnPercent: 7,
      years: 20,
      accountLabel: 'annual investing plan',
      annualContribution: 6000,
    };
    const annualPage = createInvestmentGrowthSeoPage(annualRecord, [annualRecord]);
    expect(annualPage.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/annual-compound-interest-calculator/',
    );

    const lumpSumRecord = {
      slug: 'test-investment-growth-lump-sum',
      question: 'Test question?',
      intent: 'lump-sum' as const,
      initialInvestment: 10000,
      monthlyContribution: 0,
      annualReturnPercent: 7,
      years: 20,
      accountLabel: 'lump-sum investment',
    };
    const lumpSumPage = createInvestmentGrowthSeoPage(lumpSumRecord, [lumpSumRecord]);
    expect(lumpSumPage.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/lump-sum-vs-dca-calculator/',
    );
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

test.describe('savings growth programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditSavingsGrowthSeoRecords(
      savingsGrowthSeoRecords,
      EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT,
      actualCount: EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT,
    });
  });

  test('relatedCalculators alternates daily/weekly savings by years % 2', () => {
    const buildRecord = (years: number) => ({
      slug: `test-savings-growth-${years}`,
      question: 'Test question?',
      intent: 'existing-savings-growth' as const,
      startingSavings: 10000,
      monthlyContribution: 500,
      annualReturnPercent: 4,
      years,
      scenarioLabel: 'test scenario',
    });

    const evenRecord = buildRecord(10);
    const evenPage = createSavingsGrowthSeoPage(evenRecord, [evenRecord]);
    expect(evenPage.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/daily-savings-calculator/',
    );

    const oddRecord = buildRecord(11);
    const oddPage = createSavingsGrowthSeoPage(oddRecord, [oddRecord]);
    expect(oddPage.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/weekly-savings-calculator/',
    );
  });

  test('calculator page links to the savings growth examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/savings-growth-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 savings growth examples',
      }),
    ).toHaveAttribute('href', '/calculators/savings-growth/examples/');
  });

  test('examples index exposes, groups, and searches every savings growth page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/savings-growth/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Savings Growth Examples',
      }),
    ).toBeVisible();
    await expect(
      page.locator('[data-savings-growth-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-savings-growth-example-card]'),
    ).toHaveCount(EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/savings-growth/examples/',
    );

    const hrefs = await page
      .locator('[data-savings-growth-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(
      EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search savings growth examples',
    });
    await searchBox.fill('retirement');
    await expect(
      page.locator('[data-savings-growth-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-savings-growth-example-card]:visible'),
    ).toHaveCount(EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', { name: 'Project your own savings growth' }),
    ).toHaveAttribute('href', '/calculators/savings-growth-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'savings-growth-10000-starting-500-monthly-at-3-5-percent-for-10-years',
    'high-yield-savings-growth-25000-starting-500-monthly-at-4-25-percent-for-10-years',
    'retirement-savings-growth-100000-starting-1000-monthly-at-5-5-percent-for-20-years',
  ]) {
    test(`renders generated savings growth page ${slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = savingsGrowthSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) throw new Error(`Missing savings growth record: ${slug}`);

      const url = `/calculators/savings-growth/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://automatorlabs.co${url}`,
      );
      await expect(
        page.getByRole('link', {
          name: 'Open the Savings Growth Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/savings-growth-calculator/');
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('401(k) programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    expect(
      audit401kSeoRecords(fourOhOneKSeoRecords, EXPECTED_401K_SEO_PAGE_COUNT),
    ).toEqual({
      expectedCount: EXPECTED_401K_SEO_PAGE_COUNT,
      actualCount: EXPECTED_401K_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_401K_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_401K_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_401K_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_401K_SEO_PAGE_COUNT,
    });
  });

  test('relatedCalculators links the 401(k) Growth Calculator', () => {
    const record = {
      slug: 'test-401k-growth',
      question: 'Test question?',
      currentBalance: 50000,
      employeeMonthlyContribution: 500,
      employerMonthlyMatch: 100,
      expectedAnnualReturnPercent: 7,
      years: 20,
    };
    const page = create401kSeoPage(record, [record]);
    expect(page.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/401k-growth-calculator/',
    );
  });

  test('retirement account pages link to the 401(k) examples cluster', async ({
    page,
  }) => {
    for (const path of [
      '/calculators/401k-calculator/',
      '/calculators/401k-growth-calculator/',
      '/calculators/employer-match-calculator/',
    ]) {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('link', { name: 'Browse all 200 401(k) examples' }),
      ).toHaveAttribute('href', '/calculators/401k/examples/');
    }
  });

  test('renders a generated 401(k) page', async ({ page }) => {
    const record = fourOhOneKSeoRecords.find(
      (candidate) =>
        candidate.slug ===
        '401k-growth-75000-starting-1000-employee-250-match-at-7-percent-for-20-years',
    );
    if (!record) throw new Error('Missing representative 401(k) SEO record');

    const url = `/calculators/401k/${record.slug}/`;
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', { name: 'Open the 401(k) Calculator' }),
    ).toHaveAttribute('href', '/calculators/401k-calculator/');
  });
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

test.describe('dividend growth programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditDividendGrowthSeoRecords(
      dividendGrowthSeoRecords,
      EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT,
      actualCount: EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the dividend growth examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/dividend-growth-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 dividend growth examples',
      }),
    ).toHaveAttribute('href', '/calculators/dividend-growth/examples/');
  });

  test('examples index exposes, groups, and searches every dividend growth page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/dividend-growth/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Dividend Growth Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('[data-dividend-growth-example-group]')).toHaveCount(5);
    await expect(page.locator('[data-dividend-growth-example-card]')).toHaveCount(
      EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/dividend-growth/examples/',
    );

    const hrefs = await page
      .locator('[data-dividend-growth-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search dividend growth examples',
    });
    await searchBox.fill('retirement');
    await expect(
      page.locator('[data-dividend-growth-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-dividend-growth-example-card]:visible'),
    ).toHaveCount(EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', {
        name: 'Model your own dividend income growth',
      }),
    ).toHaveAttribute('href', '/calculators/dividend-growth-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'annual-dividend-income-2400-growing-at-7-percent-for-10-years',
    'reinvested-dividend-income-2400-at-8-percent-for-15-years',
    'dividend-snowball-1200-at-9-percent-for-20-years',
    'retirement-dividend-income-24000-at-4-percent-for-15-years',
  ]) {
    test(`renders generated dividend growth page ${slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = dividendGrowthSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing dividend growth record: ${slug}`);
      }

      const url = `/calculators/dividend-growth/${record.slug}/`;
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
          name: 'Open the Dividend Growth Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/dividend-growth-calculator/');
      await expect(
        page.getByRole('link', {
          name: 'Browse All Dividend Growth Examples',
        }),
      ).toHaveAttribute('href', '/calculators/dividend-growth/examples/');
      await expect(
        page.locator('a[href="/guides/how-to-use-dividend-growth-calculator/"]').first(),
      ).toBeVisible();
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('expense ratio programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditExpenseRatioSeoRecords(
      expenseRatioSeoRecords,
      EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT,
      actualCount: EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the expense ratio examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/expense-ratio-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 expense ratio examples',
      }),
    ).toHaveAttribute('href', '/calculators/expense-ratio/examples/');
  });

  test('examples index exposes, groups, and searches every expense ratio page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/expense-ratio/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Expense Ratio Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('[data-expense-ratio-example-group]')).toHaveCount(5);
    await expect(page.locator('[data-expense-ratio-example-card]')).toHaveCount(
      EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT,
    );
    await expect(page.locator('#expense-ratio-example-count')).toHaveText(
      `Showing ${EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT} examples`,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/expense-ratio/examples/',
    );

    const hrefs = await page
      .locator('[data-expense-ratio-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search expense ratio examples',
    });
    await searchBox.fill('retirement');
    await expect(
      page.locator('[data-expense-ratio-example-card]:visible'),
    ).toHaveCount(40);
    await expect(page.locator('#expense-ratio-example-count')).toHaveText(
      'Showing 40 examples',
    );

    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(searchBox).toHaveValue('');
    await expect(
      page.locator('[data-expense-ratio-example-card]:visible'),
    ).toHaveCount(EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', {
        name: 'Model your own expense ratio scenario',
      }),
    ).toHaveAttribute('href', '/calculators/expense-ratio-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'annual-fund-fees-100000-at-0-5-expense-ratio-for-30-years',
    'etf-expense-ratio-100000-at-0-15-percent-for-30-years',
    'mutual-fund-expense-ratio-100000-at-1-1-percent-for-30-years',
    'retirement-portfolio-fees-500000-at-0-35-expense-ratio-for-30-years',
  ]) {
    test(`renders generated expense ratio page ${slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = expenseRatioSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing expense ratio record: ${slug}`);
      }

      const url = `/calculators/expense-ratio/${record.slug}/`;
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
          name: 'Open the Expense Ratio Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/expense-ratio-calculator/');
      await expect(
        page.getByRole('link', {
          name: 'Browse All Expense Ratio Examples',
        }),
      ).toHaveAttribute('href', '/calculators/expense-ratio/examples/');
      await expect(
        page.locator('a[href="/guides/what-is-expense-ratio/"]').first(),
      ).toBeVisible();
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('DRIP programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditDripSeoRecords(
      dripSeoRecords,
      EXPECTED_DRIP_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_DRIP_SEO_PAGE_COUNT,
      actualCount: EXPECTED_DRIP_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_DRIP_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_DRIP_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_DRIP_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_DRIP_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the DRIP examples cluster', async ({
    page,
  }) => {
    await page.goto('/calculators/drip-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    await expect(
      page.getByRole('link', { name: 'Browse all 200 DRIP examples' }),
    ).toHaveAttribute('href', '/calculators/drip/examples/');
  });

  test('examples index exposes, groups, and searches every DRIP page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/drip/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'DRIP Examples',
      }),
    ).toBeVisible();
    await expect(page.locator('[data-drip-example-group]')).toHaveCount(5);
    await expect(page.locator('[data-drip-example-card]')).toHaveCount(
      EXPECTED_DRIP_SEO_PAGE_COUNT,
    );
    await expect(page.locator('#drip-example-count')).toHaveText(
      `Showing ${EXPECTED_DRIP_SEO_PAGE_COUNT} examples`,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/drip/examples/',
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search DRIP examples',
    });
    await searchBox.fill('retirement');
    await expect(page.locator('[data-drip-example-card]:visible')).toHaveCount(
      40,
    );
    await expect(page.locator('#drip-example-count')).toHaveText(
      'Showing 40 examples',
    );

    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(searchBox).toHaveValue('');
    await expect(page.locator('[data-drip-example-card]:visible')).toHaveCount(
      EXPECTED_DRIP_SEO_PAGE_COUNT,
    );
    expect(pageErrors).toEqual([]);
  });

  const representativeRecords = [
    dripSeoRecords.find(
      (record) =>
        record.slug ===
        'stock-drip-200-shares-50-share-price-3-5-yield-15-years',
    ),
    dripSeoRecords.find(
      (record) =>
        record.slug ===
        'etf-drip-300-shares-50-share-price-4-yield-18-years',
    ),
    dripSeoRecords.find(
      (record) =>
        record.slug ===
        'portfolio-drip-50000-starting-3-5-yield-500-monthly-15-years',
    ),
    dripSeoRecords.find(
      (record) =>
        record.slug ===
        'retirement-drip-500000-starting-4-yield-15-years',
    ),
  ].filter((record) => record !== undefined);

  for (const record of representativeRecords) {
    test(`renders generated DRIP page ${record.slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      const url = `/calculators/drip/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://automatorlabs.co${url}`,
      );
      await expect(
        page.getByRole('link', { name: 'Browse All DRIP Examples' }),
      ).toHaveAttribute('href', '/calculators/drip/examples/');
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('dividend yield programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditDividendYieldSeoRecords(
      dividendYieldSeoRecords,
      EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT,
      actualCount: EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the dividend yield examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/dividend-yield-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 dividend yield examples',
      }),
    ).toHaveAttribute('href', '/calculators/dividend-yield/examples/');
  });

  test('examples index exposes, groups, and searches every dividend yield page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/dividend-yield/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Dividend Yield Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('[data-dividend-yield-example-group]')).toHaveCount(5);
    await expect(page.locator('[data-dividend-yield-example-card]')).toHaveCount(
      EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/dividend-yield/examples/',
    );

    const hrefs = await page
      .locator('[data-dividend-yield-example-card] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search dividend yield examples',
    });
    await searchBox.fill('retirement');
    await expect(
      page.locator('[data-dividend-yield-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-dividend-yield-example-card]:visible'),
    ).toHaveCount(EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', {
        name: 'Model your own dividend yield',
      }),
    ).toHaveAttribute('href', '/calculators/dividend-yield-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'stock-dividend-yield-2-4-annual-dividend-40-share-price-200-shares',
    'etf-dividend-yield-3-annual-dividend-50-share-price-300-shares',
    'portfolio-dividend-yield-100000-portfolio-3-annual-dividend-50-share-price',
    'retirement-dividend-yield-3500-shares-4-annual-dividend-50-share-price',
  ]) {
    test(`renders generated dividend yield page ${slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = dividendYieldSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing dividend yield record: ${slug}`);
      }

      const url = `/calculators/dividend-yield/${record.slug}/`;
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
          name: 'Open the Dividend Yield Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/dividend-yield-calculator/');
      await expect(
        page.getByRole('link', {
          name: 'Browse All Dividend Yield Examples',
        }),
      ).toHaveAttribute('href', '/calculators/dividend-yield/examples/');
      await expect(
        page.locator('a[href="/guides/how-to-use-dividend-yield-calculator/"]').first(),
      ).toBeVisible();
      await expect(page.locator('tbody tr')).toHaveCount(3);
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
    ).toHaveAttribute('href', '/calculators/mortgage-payment-calculator/');

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
      page.getByRole('link', { name: 'Open the Mortgage Payment Calculator' }),
    ).toHaveAttribute('href', '/calculators/mortgage-payment-calculator/');
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

test.describe('mortgage payoff programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditMortgagePayoffSeoRecords(
      mortgagePayoffSeoRecords,
      EXPECTED_MORTGAGE_PAYOFF_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_MORTGAGE_PAYOFF_SEO_PAGE_COUNT,
      actualCount: EXPECTED_MORTGAGE_PAYOFF_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_MORTGAGE_PAYOFF_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_MORTGAGE_PAYOFF_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_MORTGAGE_PAYOFF_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_MORTGAGE_PAYOFF_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the mortgage payoff examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/mortgage-payoff-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 mortgage payoff examples',
      }),
    ).toHaveAttribute('href', '/calculators/mortgage-payoff/examples/');
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

test.describe('monthly savings programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditMonthlySavingsSeoRecords(
      monthlySavingsSeoRecords,
      EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT,
      actualCount: EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the monthly savings examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/monthly-savings-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 monthly savings examples',
      }),
    ).toHaveAttribute('href', '/calculators/monthly-savings/examples/');
  });

  test('examples index exposes, groups, and searches every monthly savings page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/monthly-savings/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Monthly Savings Examples',
      }),
    ).toBeVisible();
    await expect(
      page.locator('[data-monthly-savings-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-monthly-savings-example-card]'),
    ).toHaveCount(EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search monthly savings examples',
    });
    await searchBox.fill('catch-up');
    await expect(
      page.locator('[data-monthly-savings-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-monthly-savings-example-card]:visible'),
    ).toHaveCount(EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', { name: 'Build your own monthly savings plan' }),
    ).toHaveAttribute('href', '/calculators/monthly-savings-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'milestone-monthly-savings-25000-goal-3-years-5000-saved-at-3-25-percent',
    'family-monthly-savings-15000-goal-3-years-3000-saved-at-2-75-percent',
    'catch-up-monthly-savings-50000-goal-4-years-15000-saved-at-3-5-percent',
  ]) {
    test(`renders generated monthly savings page ${slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = monthlySavingsSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) throw new Error(`Missing monthly savings record: ${slug}`);

      const url = `/calculators/monthly-savings/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', {
          name: 'Open the Monthly Savings Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/monthly-savings-calculator/');
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('vacation savings programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditVacationSavingsSeoRecords(
      vacationSavingsSeoRecords,
      EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT,
      actualCount: EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the vacation savings examples cluster', async ({
    page,
  }) => {
    const response = await page.goto(
      '/calculators/vacation-savings-calculator/',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 vacation savings examples',
      }),
    ).toHaveAttribute('href', '/calculators/vacation-savings/examples/');
  });

  test('examples index exposes, groups, and searches every vacation savings page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(
      '/calculators/vacation-savings/examples/',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Vacation Savings Examples',
      }),
    ).toBeVisible();
    await expect(
      page.locator('[data-vacation-savings-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-vacation-savings-example-card]'),
    ).toHaveCount(EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search vacation savings examples',
    });
    await searchBox.fill('family');
    await expect(
      page.locator('[data-vacation-savings-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-vacation-savings-example-card]:visible'),
    ).toHaveCount(EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', { name: 'Plan your own vacation savings goal' }),
    ).toHaveAttribute('href', '/calculators/vacation-savings-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'family-vacation-savings-6000-goal-3-years-3000-saved-at-3-percent',
    'international-trip-savings-12000-goal-4-years-5000-saved-at-3-25-percent',
    'luxury-vacation-savings-20000-goal-5-years-10000-saved-at-3-25-percent',
  ]) {
    test(`renders generated vacation savings page ${slug}`, async ({
      page,
    }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = vacationSavingsSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) throw new Error(`Missing vacation savings record: ${slug}`);

      const url = `/calculators/vacation-savings/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', {
          name: 'Open the Vacation Savings Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/vacation-savings-calculator/');
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('car savings programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditCarSavingsSeoRecords(
      carSavingsSeoRecords,
      EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT,
      actualCount: EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the car savings examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/car-savings-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 car savings examples',
      }),
    ).toHaveAttribute('href', '/calculators/car-savings/examples/');
  });

  test('examples index exposes, groups, and searches every car savings page', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/car-savings/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Car Savings Examples',
      }),
    ).toBeVisible();
    await expect(
      page.locator('[data-car-savings-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-car-savings-example-card]'),
    ).toHaveCount(EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT);

    const searchBox = page.getByRole('searchbox', {
      name: 'Search car savings examples',
    });
    await searchBox.fill('new car');
    await expect(
      page.locator('[data-car-savings-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-car-savings-example-card]:visible'),
    ).toHaveCount(EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT);
    await expect(
      page.getByRole('link', { name: 'Plan your own car savings goal' }),
    ).toHaveAttribute('href', '/calculators/car-savings-calculator/');
    expect(pageErrors).toEqual([]);
  });

  for (const slug of [
    'car-down-payment-savings-10000-goal-2-years-2000-saved-at-2-75-percent',
    'new-car-savings-30000-goal-5-years-10000-saved-at-3-percent',
    'family-suv-savings-50000-goal-6-years-20000-saved-at-3-25-percent',
  ]) {
    test(`renders generated car savings page ${slug}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const record = carSavingsSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) throw new Error(`Missing car savings record: ${slug}`);

      const url = `/calculators/car-savings/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', {
          name: 'Open the Car Savings Calculator',
        }),
      ).toHaveAttribute('href', '/calculators/car-savings-calculator/');
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

for (const config of safeBatchProgrammaticConfigs) {
  test.describe(`${config.label} programmatic SEO`, () => {
    test('record audit enforces count and unique metadata', () => {
      expect(config.audit(config.records, config.expectedCount)).toEqual({
        expectedCount: config.expectedCount,
        actualCount: config.expectedCount,
        uniqueSlugCount: config.expectedCount,
        uniqueTitleCount: config.expectedCount,
        uniqueDescriptionCount: config.expectedCount,
        uniqueCanonicalPathCount: config.expectedCount,
      });
    });

    test('calculator page links to the examples cluster', async ({ page }) => {
      const response = await page.goto(config.calculatorPath, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('link', { name: config.exampleLinkName }),
      ).toHaveAttribute('href', config.examplesPath);
    });

    test('renders a representative generated page', async ({ page }) => {
      const record = config.records.find(
        (candidate) => candidate.slug === config.representativeSlug,
      );
      if (!record) {
        throw new Error(
          `Missing ${config.label} record: ${config.representativeSlug}`,
        );
      }

      const url = `${config.pagePrefix}${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://automatorlabs.co${url}`,
      );
      await expect(
        page.getByRole('link', { name: config.ctaName }),
      ).toHaveAttribute('href', config.calculatorPath);
      expect(await page.locator('tbody tr').count()).toBeGreaterThan(0);
    });
  });
}

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

test.describe('retirement income gap programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    expect(
      auditRetirementIncomeGapSeoRecords(
        retirementIncomeGapSeoRecords,
        EXPECTED_RETIREMENT_INCOME_GAP_SEO_PAGE_COUNT,
      ),
    ).toEqual({
      expectedCount: EXPECTED_RETIREMENT_INCOME_GAP_SEO_PAGE_COUNT,
      actualCount: EXPECTED_RETIREMENT_INCOME_GAP_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_RETIREMENT_INCOME_GAP_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_RETIREMENT_INCOME_GAP_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_RETIREMENT_INCOME_GAP_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount:
        EXPECTED_RETIREMENT_INCOME_GAP_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to retirement income gap examples', async ({
    page,
  }) => {
    const response = await page.goto(
      '/calculators/retirement-income-gap-calculator/',
      { waitUntil: 'domcontentloaded' },
    );
    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 retirement income gap examples',
      }),
    ).toHaveAttribute('href', '/calculators/retirement-income-gap/examples/');
  });
});

test.describe('portfolio withdrawal sustainability programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    expect(
      auditPortfolioWithdrawalSustainabilitySeoRecords(
        portfolioWithdrawalSustainabilitySeoRecords,
        EXPECTED_PORTFOLIO_WITHDRAWAL_SUSTAINABILITY_SEO_PAGE_COUNT,
      ),
    ).toEqual({
      expectedCount:
        EXPECTED_PORTFOLIO_WITHDRAWAL_SUSTAINABILITY_SEO_PAGE_COUNT,
      actualCount:
        EXPECTED_PORTFOLIO_WITHDRAWAL_SUSTAINABILITY_SEO_PAGE_COUNT,
      uniqueSlugCount:
        EXPECTED_PORTFOLIO_WITHDRAWAL_SUSTAINABILITY_SEO_PAGE_COUNT,
      uniqueTitleCount:
        EXPECTED_PORTFOLIO_WITHDRAWAL_SUSTAINABILITY_SEO_PAGE_COUNT,
      uniqueDescriptionCount:
        EXPECTED_PORTFOLIO_WITHDRAWAL_SUSTAINABILITY_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount:
        EXPECTED_PORTFOLIO_WITHDRAWAL_SUSTAINABILITY_SEO_PAGE_COUNT,
    });
  });
});

test.describe('retirement tax drag programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    expect(
      auditRetirementTaxDragSeoRecords(
        retirementTaxDragSeoRecords,
        EXPECTED_RETIREMENT_TAX_DRAG_SEO_PAGE_COUNT,
      ),
    ).toEqual({
      expectedCount: EXPECTED_RETIREMENT_TAX_DRAG_SEO_PAGE_COUNT,
      actualCount: EXPECTED_RETIREMENT_TAX_DRAG_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_RETIREMENT_TAX_DRAG_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_RETIREMENT_TAX_DRAG_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_RETIREMENT_TAX_DRAG_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_RETIREMENT_TAX_DRAG_SEO_PAGE_COUNT,
    });
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

test.describe('Roth IRA programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    expect(
      auditRothIraSeoRecords(rothIraSeoRecords, EXPECTED_ROTH_IRA_SEO_PAGE_COUNT),
    ).toEqual({
      expectedCount: EXPECTED_ROTH_IRA_SEO_PAGE_COUNT,
      actualCount: EXPECTED_ROTH_IRA_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_ROTH_IRA_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_ROTH_IRA_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_ROTH_IRA_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_ROTH_IRA_SEO_PAGE_COUNT,
    });
  });

  test('retirement account pages link to the Roth IRA examples cluster', async ({
    page,
  }) => {
    for (const path of [
      '/calculators/roth-ira-calculator/',
      '/calculators/roth-ira-growth-calculator/',
      '/calculators/roth-vs-traditional-ira-calculator/',
    ]) {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('link', { name: 'Browse all 200 Roth IRA examples' }),
      ).toHaveAttribute('href', '/calculators/roth-ira/examples/');
    }
  });
});

test.describe('years to retirement programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    expect(
      auditYearsToRetirementSeoRecords(
        yearsToRetirementSeoRecords,
        EXPECTED_YEARS_TO_RETIREMENT_SEO_PAGE_COUNT,
      ),
    ).toEqual({
      expectedCount: EXPECTED_YEARS_TO_RETIREMENT_SEO_PAGE_COUNT,
      actualCount: EXPECTED_YEARS_TO_RETIREMENT_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_YEARS_TO_RETIREMENT_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_YEARS_TO_RETIREMENT_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_YEARS_TO_RETIREMENT_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_YEARS_TO_RETIREMENT_SEO_PAGE_COUNT,
    });
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

test.describe('ETF fee drag programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditEtfFeeDragSeoRecords(
      etfFeeDragSeoRecords,
      EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT,
      actualCount: EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the ETF fee drag examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/etf-fee-drag-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 ETF fee drag examples',
      }),
    ).toHaveAttribute('href', '/calculators/etf-fee-drag/examples/');
  });

  test('examples index exposes, groups, and searches every ETF fee drag page', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/etf-fee-drag/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'ETF Fee Drag Examples',
      }),
    ).toBeVisible();
    await expect(page.locator('[data-etf-fee-drag-example-group]')).toHaveCount(
      5,
    );
    await expect(page.locator('[data-etf-fee-drag-example-card]')).toHaveCount(
      EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT,
    );
    await expect(page.locator('#etf-fee-drag-example-count')).toHaveText(
      `Showing ${EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT} examples`,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search ETF fee drag examples',
    });
    await searchBox.fill('retirement');
    await expect(
      page.locator('[data-etf-fee-drag-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-etf-fee-drag-example-card]:visible'),
    ).toHaveCount(EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT);
  });

  for (const slug of [
    'low-cost-etf-fee-drag-100000-starting-1000-monthly-0-05-vs-0-2-for-30-years',
    'index-fund-fee-drag-50000-starting-500-monthly-0-06-vs-0-15-for-20-years',
    'retirement-etf-fee-drag-500000-starting-1000-monthly-0-07-vs-0-22-for-25-years',
    'taxable-etf-fee-drag-100000-starting-1000-monthly-0-09-vs-0-24-for-30-years',
  ]) {
    test(`renders generated ETF fee drag page ${slug}`, async ({ page }) => {
      const record = etfFeeDragSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing ETF fee drag record: ${slug}`);
      }

      const url = `/calculators/etf-fee-drag/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Browse All ETF Fee Drag Examples' }),
      ).toHaveAttribute('href', '/calculators/etf-fee-drag/examples/');
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
    });
  }
});

test.describe('debt payoff programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditDebtPayoffSeoRecords(
      debtPayoffSeoRecords,
      EXPECTED_DEBT_PAYOFF_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_DEBT_PAYOFF_SEO_PAGE_COUNT,
      actualCount: EXPECTED_DEBT_PAYOFF_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_DEBT_PAYOFF_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_DEBT_PAYOFF_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_DEBT_PAYOFF_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_DEBT_PAYOFF_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the debt payoff examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/debt-payoff-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 debt payoff examples',
      }),
    ).toHaveAttribute('href', '/calculators/debt-payoff/examples/');
  });
});

test.describe('debt snowball programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditDebtSnowballSeoRecords(
      debtSnowballSeoRecords,
      EXPECTED_DEBT_SNOWBALL_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_DEBT_SNOWBALL_SEO_PAGE_COUNT,
      actualCount: EXPECTED_DEBT_SNOWBALL_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_DEBT_SNOWBALL_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_DEBT_SNOWBALL_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_DEBT_SNOWBALL_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_DEBT_SNOWBALL_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the debt snowball examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/debt-snowball-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 debt snowball examples',
      }),
    ).toHaveAttribute('href', '/calculators/debt-snowball/examples/');
  });
});

test.describe('debt avalanche programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditDebtAvalancheSeoRecords(
      debtAvalancheSeoRecords,
      EXPECTED_DEBT_AVALANCHE_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_DEBT_AVALANCHE_SEO_PAGE_COUNT,
      actualCount: EXPECTED_DEBT_AVALANCHE_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_DEBT_AVALANCHE_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_DEBT_AVALANCHE_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_DEBT_AVALANCHE_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_DEBT_AVALANCHE_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the debt avalanche examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/debt-avalanche-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 debt avalanche examples',
      }),
    ).toHaveAttribute('href', '/calculators/debt-avalanche/examples/');
  });
});

test.describe('loan payment programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditLoanPaymentSeoRecords(
      loanPaymentSeoRecords,
      EXPECTED_LOAN_PAYMENT_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_LOAN_PAYMENT_SEO_PAGE_COUNT,
      actualCount: EXPECTED_LOAN_PAYMENT_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_LOAN_PAYMENT_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_LOAN_PAYMENT_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_LOAN_PAYMENT_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_LOAN_PAYMENT_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the loan payment examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/loan-payment-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 loan payment examples',
      }),
    ).toHaveAttribute('href', '/calculators/loan-payment/examples/');
  });
});

test.describe('auto loan programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditAutoLoanSeoRecords(
      autoLoanSeoRecords,
      EXPECTED_AUTO_LOAN_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_AUTO_LOAN_SEO_PAGE_COUNT,
      actualCount: EXPECTED_AUTO_LOAN_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_AUTO_LOAN_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_AUTO_LOAN_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_AUTO_LOAN_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_AUTO_LOAN_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the auto loan examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/auto-loan-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 auto loan examples',
      }),
    ).toHaveAttribute('href', '/calculators/auto-loan/examples/');
  });
});

test.describe('student loan programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditStudentLoanSeoRecords(
      studentLoanSeoRecords,
      EXPECTED_STUDENT_LOAN_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_STUDENT_LOAN_SEO_PAGE_COUNT,
      actualCount: EXPECTED_STUDENT_LOAN_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_STUDENT_LOAN_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_STUDENT_LOAN_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_STUDENT_LOAN_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_STUDENT_LOAN_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the student loan examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/student-loan-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 student loan examples',
      }),
    ).toHaveAttribute('href', '/calculators/student-loan/examples/');
  });
});

test.describe('student loan payoff programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditStudentLoanPayoffSeoRecords(
      studentLoanPayoffSeoRecords,
      EXPECTED_STUDENT_LOAN_PAYOFF_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_STUDENT_LOAN_PAYOFF_SEO_PAGE_COUNT,
      actualCount: EXPECTED_STUDENT_LOAN_PAYOFF_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_STUDENT_LOAN_PAYOFF_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_STUDENT_LOAN_PAYOFF_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_STUDENT_LOAN_PAYOFF_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_STUDENT_LOAN_PAYOFF_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the student loan payoff examples cluster', async ({
    page,
  }) => {
    const response = await page.goto(
      '/calculators/student-loan-payoff-calculator/',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 student loan payoff examples',
      }),
    ).toHaveAttribute('href', '/calculators/student-loan-payoff/examples/');
  });
});

test.describe('heloc programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditHelocSeoRecords(
      helocSeoRecords,
      EXPECTED_HELOC_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_HELOC_SEO_PAGE_COUNT,
      actualCount: EXPECTED_HELOC_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_HELOC_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_HELOC_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_HELOC_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_HELOC_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the heloc examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/heloc-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 HELOC examples',
      }),
    ).toHaveAttribute('href', '/calculators/heloc/examples/');
  });
});

test.describe('investment fee programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditInvestmentFeeSeoRecords(
      investmentFeeSeoRecords,
      EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT,
      actualCount: EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the investment fee examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/investment-fee-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 investment fee examples',
      }),
    ).toHaveAttribute('href', '/calculators/investment-fee/examples/');
  });

  test('examples index exposes, groups, and searches every investment fee page', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/investment-fee/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Investment Fee Examples',
      }),
    ).toBeVisible();
    await expect(
      page.locator('[data-investment-fee-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-investment-fee-example-card]'),
    ).toHaveCount(EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT);
    await expect(page.locator('#investment-fee-example-count')).toHaveText(
      `Showing ${EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT} examples`,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search investment fee examples',
    });
    await searchBox.fill('retirement');
    await expect(
      page.locator('[data-investment-fee-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-investment-fee-example-card]:visible'),
    ).toHaveCount(EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT);
  });

  for (const slug of [
    'investment-fees-100000-starting-1000-monthly-0-75-fee-for-30-years',
    'retirement-investment-fees-500000-starting-1250-monthly-0-75-fee-for-30-years',
    'advisor-fee-drag-100000-starting-1000-monthly-1-15-fee-for-25-years',
    'taxable-investment-fees-100000-starting-1000-monthly-0-8-fee-for-30-years',
  ]) {
    test(`renders generated investment fee page ${slug}`, async ({ page }) => {
      const record = investmentFeeSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing investment fee record: ${slug}`);
      }

      const url = `/calculators/investment-fee/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Browse All Investment Fee Examples' }),
      ).toHaveAttribute('href', '/calculators/investment-fee/examples/');
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
    });
  }
});

test.describe('lump sum vs DCA programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditLumpSumVsDcaSeoRecords(
      lumpSumVsDcaSeoRecords,
      EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT,
      actualCount: EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the lump sum vs DCA examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/lump-sum-vs-dca-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 lump sum vs DCA examples',
      }),
    ).toHaveAttribute('href', '/calculators/lump-sum-vs-dca/examples/');
  });

  test('examples index exposes, groups, and searches every lump sum vs DCA page', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/lump-sum-vs-dca/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Lump Sum vs DCA Examples',
      }),
    ).toBeVisible();
    await expect(
      page.locator('[data-lump-sum-vs-dca-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-lump-sum-vs-dca-example-card]'),
    ).toHaveCount(EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT);
    await expect(page.locator('#lump-sum-vs-dca-example-count')).toHaveText(
      `Showing ${EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT} examples`,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search lump sum vs DCA examples',
    });
    await searchBox.fill('retirement');
    await expect(
      page.locator('[data-lump-sum-vs-dca-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-lump-sum-vs-dca-example-card]:visible'),
    ).toHaveCount(EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT);
  });

  for (const slug of [
    'lump-sum-vs-dca-120000-at-2000-monthly-8-percent-for-6-years',
    'windfall-lump-sum-vs-dca-100000-at-2000-monthly-7-percent-for-5-years',
    'retirement-rollover-lump-sum-vs-dca-250000-at-7000-monthly-8-percent-for-8-years',
    'taxable-lump-sum-vs-dca-50000-at-1000-monthly-5-5-percent-for-4-years',
  ]) {
    test(`renders generated lump sum vs DCA page ${slug}`, async ({ page }) => {
      const record = lumpSumVsDcaSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing lump sum vs DCA record: ${slug}`);
      }

      const url = `/calculators/lump-sum-vs-dca/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Browse All Lump Sum vs DCA Examples' }),
      ).toHaveAttribute('href', '/calculators/lump-sum-vs-dca/examples/');
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
    });
  }
});

test.describe('real rate of return programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditRealRateOfReturnSeoRecords(
      realRateOfReturnSeoRecords,
      EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT,
      actualCount: EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the real rate of return examples cluster', async ({
    page,
  }) => {
    const response = await page.goto(
      '/calculators/real-rate-of-return-calculator/',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 real rate of return examples',
      }),
    ).toHaveAttribute('href', '/calculators/real-rate-of-return/examples/');
  });

  test('examples index exposes, groups, and searches every real return page', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/real-rate-of-return/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Real Rate of Return Examples',
      }),
    ).toBeVisible();
    await expect(
      page.locator('[data-real-rate-of-return-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-real-rate-of-return-example-card]'),
    ).toHaveCount(EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT);
    await expect(page.locator('#real-rate-of-return-example-count')).toHaveText(
      `Showing ${EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT} examples`,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search real return examples',
    });
    await searchBox.fill('retirement');
    await expect(
      page.locator('[data-real-rate-of-return-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-real-rate-of-return-example-card]:visible'),
    ).toHaveCount(EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT);
  });

  for (const slug of [
    'savings-account-real-return-4-nominal-return-with-3-inflation',
    'bond-portfolio-real-return-5-nominal-return-with-3-inflation',
    'balanced-portfolio-real-return-6-nominal-return-with-2-5-inflation',
    'retirement-real-return-6-nominal-return-with-3-inflation',
  ]) {
    test(`renders generated real return page ${slug}`, async ({ page }) => {
      const record = realRateOfReturnSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing real return record: ${slug}`);
      }

      const url = `/calculators/real-rate-of-return/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', {
          name: 'Browse All Real Rate of Return Examples',
        }),
      ).toHaveAttribute('href', '/calculators/real-rate-of-return/examples/');
      await expect(page.locator('tbody tr')).toHaveCount(4);
    });
  }
});

test.describe('inflation-adjusted return programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditInflationAdjustedReturnSeoRecords(
      inflationAdjustedReturnSeoRecords,
      EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT,
      actualCount: EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount:
        EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the inflation-adjusted return examples cluster', async ({
    page,
  }) => {
    const response = await page.goto(
      '/calculators/inflation-adjusted-return-calculator/',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 inflation-adjusted return examples',
      }),
    ).toHaveAttribute(
      'href',
      '/calculators/inflation-adjusted-return/examples/',
    );
  });

  test('examples index exposes, groups, and searches every inflation-adjusted return page', async ({
    page,
  }) => {
    const response = await page.goto(
      '/calculators/inflation-adjusted-return/examples/',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Inflation-Adjusted Return Examples',
      }),
    ).toBeVisible();
    await expect(
      page.locator('[data-inflation-adjusted-return-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-inflation-adjusted-return-example-card]'),
    ).toHaveCount(EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT);
    await expect(
      page.locator('#inflation-adjusted-return-example-count'),
    ).toHaveText(
      `Showing ${EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT} examples`,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search inflation-adjusted return examples',
    });
    await searchBox.fill('retirement');
    await expect(
      page.locator('[data-inflation-adjusted-return-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-inflation-adjusted-return-example-card]:visible'),
    ).toHaveCount(EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT);
  });

  for (const slug of [
    'conservative-inflation-adjusted-return-100000-at-5-percent-with-3-5-inflation-for-30-years',
    'balanced-inflation-adjusted-return-100000-at-7-percent-with-3-5-inflation-for-30-years',
    'growth-inflation-adjusted-return-100000-at-9-percent-with-3-5-inflation-for-30-years',
    'retirement-inflation-adjusted-return-500000-at-6-percent-with-3-5-inflation-for-30-years',
  ]) {
    test(`renders generated inflation-adjusted return page ${slug}`, async ({
      page,
    }) => {
      const record = inflationAdjustedReturnSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(
          `Missing inflation-adjusted return record: ${slug}`,
        );
      }

      const url = `/calculators/inflation-adjusted-return/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', {
          name: 'Browse All Inflation-Adjusted Return Examples',
        }),
      ).toHaveAttribute(
        'href',
        '/calculators/inflation-adjusted-return/examples/',
      );
      await expect(page.locator('tbody tr')).toHaveCount(record.years);
    });
  }
});

test.describe('emergency fund programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditEmergencyFundSeoRecords(
      emergencyFundSeoRecords,
      EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT,
      actualCount: EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT,
    });
  });

  test('calculator page links to the emergency fund examples cluster', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/emergency-fund-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('link', {
        name: 'Browse all 200 emergency fund examples',
      }),
    ).toHaveAttribute('href', '/calculators/emergency-fund/examples/');
  });

  test('examples index exposes, groups, and searches every emergency fund page', async ({
    page,
  }) => {
    const response = await page.goto('/calculators/emergency-fund/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Emergency Fund Examples',
      }),
    ).toBeVisible();
    await expect(
      page.locator('[data-emergency-fund-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-emergency-fund-example-card]'),
    ).toHaveCount(EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT);
    await expect(page.locator('#emergency-fund-example-count')).toHaveText(
      `Showing ${EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT} examples`,
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search emergency fund examples',
    });
    await searchBox.fill('family');
    await expect(
      page.locator('[data-emergency-fund-example-card]:visible'),
    ).toHaveCount(40);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-emergency-fund-example-card]:visible'),
    ).toHaveCount(EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT);
  });

  for (const slug of [
    'starter-emergency-fund-3000-monthly-expenses-3-months-1500-saved-800-monthly',
    'three-month-emergency-fund-3000-monthly-expenses-4-months-3000-saved-900-monthly',
    'six-month-emergency-fund-4000-monthly-expenses-6-months-10000-saved-1000-monthly',
    'family-emergency-fund-6000-monthly-expenses-6-months-10000-saved-1700-monthly',
  ]) {
    test(`renders generated emergency fund page ${slug}`, async ({ page }) => {
      const record = emergencyFundSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing emergency fund record: ${slug}`);
      }

      const url = `/calculators/emergency-fund/${record.slug}/`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Browse All Emergency Fund Examples' }),
      ).toHaveAttribute('href', '/calculators/emergency-fund/examples/');
      await expect(page.locator('tbody tr')).toHaveCount(7);
    });
  }
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

test.describe('traditional vs roth 401k programmatic SEO extra coverage', () => {
  test('examples index exposes and searches all traditional vs roth 401k pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(
      '/calculators/traditional-vs-roth-401k/examples/',
      { waitUntil: 'domcontentloaded' },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Traditional vs Roth 401(k) Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-traditional-vs-roth-401k-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-traditional-vs-roth-401k-example-card]'),
    ).toHaveCount(EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/traditional-vs-roth-401k/examples/',
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search Traditional vs Roth 401(k) examples',
    });
    await searchBox.fill('peak-earner');
    const visibleCount = await page
      .locator('[data-traditional-vs-roth-401k-example-card]:visible')
      .count();
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThan(
      EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
    );
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-traditional-vs-roth-401k-example-card]:visible'),
    ).toHaveCount(EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT);
    expect(pageErrors).toEqual([]);
  });

  const oneSlugPerIntent = [
    {
      intent: 'rising-earner',
      slug: 'rising-earner-contribute-9000-current-12-retirement-22-return-6-years-20',
    },
    {
      intent: 'peak-earner',
      slug: 'peak-earner-contribute-16000-current-32-retirement-22-return-6-years-15',
    },
    {
      intent: 'equal-bracket',
      slug: 'equal-bracket-contribute-10000-current-22-retirement-22-return-6-years-15',
    },
    {
      intent: 'long-horizon-compounding',
      slug: 'long-horizon-compounding-contribute-14000-current-12-retirement-24-return-7-years-25',
    },
    {
      intent: 'catch-up-contributor',
      slug: 'catch-up-contributor-contribute-27000-current-32-retirement-22-return-6-years-10',
    },
  ] as const;

  for (const { intent, slug } of oneSlugPerIntent) {
    test(`renders the ${intent} representative page`, async ({ page }) => {
      const record = traditionalVsRoth401kSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing traditional vs roth 401k record: ${slug}`);
      }

      const url = `/calculators/traditional-vs-roth-401k/${record.slug}/`;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      expect(await page.locator('tbody tr').count()).toBeGreaterThan(0);

      if (intent === 'equal-bracket') {
        await expect(
          page.getByRole('heading', {
            level: 2,
            name: 'Equivalent under these assumptions',
          }),
        ).toBeVisible();
      }
    });
  }
});
