export type ExpenseRatioSeoIntent =
  | 'annual-fund-fees'
  | 'etf-expense-ratio'
  | 'mutual-fund-expense-ratio'
  | 'retirement-portfolio-fees'
  | 'taxable-brokerage-fees';

export interface ExpenseRatioSeoRecord {
  slug: string;
  question: string;
  intent: ExpenseRatioSeoIntent;
  investmentAmount: number;
  expenseRatioPercent: number;
  years: number;
  expectedAnnualReturnPercent: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_EXPENSE_RATIO_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const ratioSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function annualFundFeesRecord(
  investmentAmount: number,
  expenseRatioPercent: number,
  years: number,
  expectedAnnualReturnPercent: number,
  featured = false,
): ExpenseRatioSeoRecord {
  return {
    slug: `annual-fund-fees-${investmentAmount}-at-${ratioSlug(expenseRatioPercent)}-expense-ratio-for-${years}-years`,
    question: `How Much Could Annual Fund Fees Cost on ${money(investmentAmount)} at a ${expenseRatioPercent}% Expense Ratio Over ${years} Years?`,
    intent: 'annual-fund-fees',
    investmentAmount,
    expenseRatioPercent,
    years,
    expectedAnnualReturnPercent,
    scenarioLabel: 'annual fund fee example',
    featured,
  };
}

function etfExpenseRatioRecord(
  investmentAmount: number,
  expenseRatioPercent: number,
  years: number,
  expectedAnnualReturnPercent: number,
  featured = false,
): ExpenseRatioSeoRecord {
  return {
    slug: `etf-expense-ratio-${investmentAmount}-at-${ratioSlug(expenseRatioPercent)}-percent-for-${years}-years`,
    question: `What Could an ETF Expense Ratio of ${expenseRatioPercent}% Cost on ${money(investmentAmount)} Over ${years} Years?`,
    intent: 'etf-expense-ratio',
    investmentAmount,
    expenseRatioPercent,
    years,
    expectedAnnualReturnPercent,
    scenarioLabel: 'ETF expense ratio example',
    featured,
  };
}

function mutualFundExpenseRatioRecord(
  investmentAmount: number,
  expenseRatioPercent: number,
  years: number,
  expectedAnnualReturnPercent: number,
  featured = false,
): ExpenseRatioSeoRecord {
  return {
    slug: `mutual-fund-expense-ratio-${investmentAmount}-at-${ratioSlug(expenseRatioPercent)}-percent-for-${years}-years`,
    question: `What Could a Mutual Fund Expense Ratio of ${expenseRatioPercent}% Cost on ${money(investmentAmount)} Over ${years} Years?`,
    intent: 'mutual-fund-expense-ratio',
    investmentAmount,
    expenseRatioPercent,
    years,
    expectedAnnualReturnPercent,
    scenarioLabel: 'mutual fund expense ratio example',
    featured,
  };
}

function retirementPortfolioFeesRecord(
  investmentAmount: number,
  expenseRatioPercent: number,
  years: number,
  expectedAnnualReturnPercent: number,
  featured = false,
): ExpenseRatioSeoRecord {
  return {
    slug: `retirement-portfolio-fees-${investmentAmount}-at-${ratioSlug(expenseRatioPercent)}-expense-ratio-for-${years}-years`,
    question: `How Much Could Retirement Portfolio Fees Cost on ${money(investmentAmount)} at a ${expenseRatioPercent}% Expense Ratio Over ${years} Years?`,
    intent: 'retirement-portfolio-fees',
    investmentAmount,
    expenseRatioPercent,
    years,
    expectedAnnualReturnPercent,
    scenarioLabel: 'retirement portfolio fee example',
    featured,
  };
}

function taxableBrokerageFeesRecord(
  investmentAmount: number,
  expenseRatioPercent: number,
  years: number,
  expectedAnnualReturnPercent: number,
  featured = false,
): ExpenseRatioSeoRecord {
  return {
    slug: `taxable-brokerage-fees-${investmentAmount}-at-${ratioSlug(expenseRatioPercent)}-expense-ratio-for-${years}-years`,
    question: `How Much Could Taxable Brokerage Fund Fees Cost on ${money(investmentAmount)} at a ${expenseRatioPercent}% Expense Ratio Over ${years} Years?`,
    intent: 'taxable-brokerage-fees',
    investmentAmount,
    expenseRatioPercent,
    years,
    expectedAnnualReturnPercent,
    scenarioLabel: 'taxable brokerage fee example',
    featured,
  };
}

const annualFundInvestments = [10000, 25000, 50000, 100000, 250000];
const annualFundScenarios = [
  { expenseRatioPercent: 0.03, years: 5, expectedAnnualReturnPercent: 6 },
  { expenseRatioPercent: 0.08, years: 10, expectedAnnualReturnPercent: 6.5 },
  { expenseRatioPercent: 0.12, years: 15, expectedAnnualReturnPercent: 7 },
  { expenseRatioPercent: 0.2, years: 20, expectedAnnualReturnPercent: 7 },
  { expenseRatioPercent: 0.35, years: 25, expectedAnnualReturnPercent: 7.5 },
  { expenseRatioPercent: 0.5, years: 30, expectedAnnualReturnPercent: 7.5 },
  { expenseRatioPercent: 0.75, years: 35, expectedAnnualReturnPercent: 8 },
  { expenseRatioPercent: 1, years: 40, expectedAnnualReturnPercent: 8 },
];

export const annualFundFeesSeoRecords = annualFundInvestments.flatMap(
  (investmentAmount) =>
    annualFundScenarios.map((scenario) =>
      annualFundFeesRecord(
        investmentAmount,
        scenario.expenseRatioPercent,
        scenario.years,
        scenario.expectedAnnualReturnPercent,
        investmentAmount === 100000 &&
          scenario.expenseRatioPercent === 0.5 &&
          scenario.years === 30,
      ),
    ),
);

const etfInvestments = [10000, 25000, 50000, 100000, 250000];
const etfScenarios = [
  { expenseRatioPercent: 0.03, years: 5, expectedAnnualReturnPercent: 6.5 },
  { expenseRatioPercent: 0.05, years: 10, expectedAnnualReturnPercent: 6.5 },
  { expenseRatioPercent: 0.07, years: 15, expectedAnnualReturnPercent: 7 },
  { expenseRatioPercent: 0.09, years: 20, expectedAnnualReturnPercent: 7 },
  { expenseRatioPercent: 0.12, years: 25, expectedAnnualReturnPercent: 7.5 },
  { expenseRatioPercent: 0.15, years: 30, expectedAnnualReturnPercent: 7.5 },
  { expenseRatioPercent: 0.2, years: 35, expectedAnnualReturnPercent: 8 },
  { expenseRatioPercent: 0.3, years: 40, expectedAnnualReturnPercent: 8 },
];

export const etfExpenseRatioSeoRecords = etfInvestments.flatMap(
  (investmentAmount) =>
    etfScenarios.map((scenario) =>
      etfExpenseRatioRecord(
        investmentAmount,
        scenario.expenseRatioPercent,
        scenario.years,
        scenario.expectedAnnualReturnPercent,
        investmentAmount === 100000 &&
          scenario.expenseRatioPercent === 0.15 &&
          scenario.years === 30,
      ),
    ),
);

const mutualFundInvestments = [10000, 25000, 50000, 100000, 250000];
const mutualFundScenarios = [
  { expenseRatioPercent: 0.35, years: 5, expectedAnnualReturnPercent: 6 },
  { expenseRatioPercent: 0.5, years: 10, expectedAnnualReturnPercent: 6.5 },
  { expenseRatioPercent: 0.65, years: 15, expectedAnnualReturnPercent: 6.5 },
  { expenseRatioPercent: 0.8, years: 20, expectedAnnualReturnPercent: 7 },
  { expenseRatioPercent: 0.95, years: 25, expectedAnnualReturnPercent: 7 },
  { expenseRatioPercent: 1.1, years: 30, expectedAnnualReturnPercent: 7.5 },
  { expenseRatioPercent: 1.25, years: 35, expectedAnnualReturnPercent: 7.5 },
  { expenseRatioPercent: 1.5, years: 40, expectedAnnualReturnPercent: 8 },
];

export const mutualFundExpenseRatioSeoRecords = mutualFundInvestments.flatMap(
  (investmentAmount) =>
    mutualFundScenarios.map((scenario) =>
      mutualFundExpenseRatioRecord(
        investmentAmount,
        scenario.expenseRatioPercent,
        scenario.years,
        scenario.expectedAnnualReturnPercent,
        investmentAmount === 100000 &&
          scenario.expenseRatioPercent === 1.1 &&
          scenario.years === 30,
      ),
    ),
);

const retirementInvestments = [50000, 100000, 250000, 500000, 1000000];
const retirementScenarios = [
  { expenseRatioPercent: 0.04, years: 10, expectedAnnualReturnPercent: 5.5 },
  { expenseRatioPercent: 0.08, years: 15, expectedAnnualReturnPercent: 6 },
  { expenseRatioPercent: 0.12, years: 20, expectedAnnualReturnPercent: 6 },
  { expenseRatioPercent: 0.2, years: 25, expectedAnnualReturnPercent: 6.5 },
  { expenseRatioPercent: 0.35, years: 30, expectedAnnualReturnPercent: 6.5 },
  { expenseRatioPercent: 0.5, years: 35, expectedAnnualReturnPercent: 7 },
  { expenseRatioPercent: 0.75, years: 40, expectedAnnualReturnPercent: 7 },
  { expenseRatioPercent: 1, years: 45, expectedAnnualReturnPercent: 7.5 },
];

export const retirementPortfolioFeesSeoRecords = retirementInvestments.flatMap(
  (investmentAmount) =>
    retirementScenarios.map((scenario) =>
      retirementPortfolioFeesRecord(
        investmentAmount,
        scenario.expenseRatioPercent,
        scenario.years,
        scenario.expectedAnnualReturnPercent,
        investmentAmount === 500000 &&
          scenario.expenseRatioPercent === 0.35 &&
          scenario.years === 30,
      ),
    ),
);

const taxableInvestments = [10000, 25000, 50000, 100000, 250000];
const taxableScenarios = [
  { expenseRatioPercent: 0.03, years: 5, expectedAnnualReturnPercent: 6.5 },
  { expenseRatioPercent: 0.07, years: 10, expectedAnnualReturnPercent: 6.5 },
  { expenseRatioPercent: 0.12, years: 15, expectedAnnualReturnPercent: 7 },
  { expenseRatioPercent: 0.18, years: 20, expectedAnnualReturnPercent: 7 },
  { expenseRatioPercent: 0.25, years: 25, expectedAnnualReturnPercent: 7.5 },
  { expenseRatioPercent: 0.4, years: 30, expectedAnnualReturnPercent: 7.5 },
  { expenseRatioPercent: 0.6, years: 35, expectedAnnualReturnPercent: 8 },
  { expenseRatioPercent: 0.85, years: 40, expectedAnnualReturnPercent: 8 },
];

export const taxableBrokerageFeesSeoRecords = taxableInvestments.flatMap(
  (investmentAmount) =>
    taxableScenarios.map((scenario) =>
      taxableBrokerageFeesRecord(
        investmentAmount,
        scenario.expenseRatioPercent,
        scenario.years,
        scenario.expectedAnnualReturnPercent,
        investmentAmount === 100000 &&
          scenario.expenseRatioPercent === 0.4 &&
          scenario.years === 30,
      ),
    ),
);

export const expenseRatioSeoRecords: ExpenseRatioSeoRecord[] = [
  ...annualFundFeesSeoRecords,
  ...etfExpenseRatioSeoRecords,
  ...mutualFundExpenseRatioSeoRecords,
  ...retirementPortfolioFeesSeoRecords,
  ...taxableBrokerageFeesSeoRecords,
];
