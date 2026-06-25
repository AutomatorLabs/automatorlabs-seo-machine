export type RuleOf72SeoIntent =
  | 'doubling-money'
  | 'investment-growth'
  | 'savings-growth'
  | 'inflation'
  | 'portfolio-growth'
  | 'retirement-planning'
  | 'index-fund'
  | 'high-yield-savings';

export interface RuleOf72SeoRecord {
  slug: string;
  question: string;
  intent: RuleOf72SeoIntent;
  annualReturnPercent: number;
  startingAmount: number;
  contextLabel: string;
  featured?: boolean;
}

export const EXPECTED_RULE_OF_72_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const formatRate = (rate: number) => rate.toLocaleString('en-US');
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function createDoublingMoneyRecord(
  startingAmount: number,
  annualReturnPercent: number,
  featured = false,
): RuleOf72SeoRecord {
  return {
    slug: `double-${startingAmount}-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `How Long Could ${money(startingAmount)} Take to Double at ${formatRate(annualReturnPercent)}%?`,
    intent: 'doubling-money',
    annualReturnPercent,
    startingAmount,
    contextLabel: 'money doubling estimate',
    featured,
  };
}

function createInvestmentGrowthRecord(
  startingAmount: number,
  annualReturnPercent: number,
  featured = false,
): RuleOf72SeoRecord {
  return {
    slug: `investment-growth-${startingAmount}-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `How Many Years Could an Investment of ${money(startingAmount)} Take to Double at ${formatRate(annualReturnPercent)}%?`,
    intent: 'investment-growth',
    annualReturnPercent,
    startingAmount,
    contextLabel: 'investment growth estimate',
    featured,
  };
}

function createSavingsGrowthRecord(
  startingAmount: number,
  annualReturnPercent: number,
  featured = false,
): RuleOf72SeoRecord {
  return {
    slug: `savings-growth-${startingAmount}-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `How Long Could Savings of ${money(startingAmount)} Take to Double at ${formatRate(annualReturnPercent)}%?`,
    intent: 'savings-growth',
    annualReturnPercent,
    startingAmount,
    contextLabel: 'savings growth estimate',
    featured,
  };
}

function createInflationRecord(
  startingAmount: number,
  annualReturnPercent: number,
  featured = false,
): RuleOf72SeoRecord {
  return {
    slug: `inflation-${startingAmount}-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `How Long Could ${formatRate(annualReturnPercent)}% Inflation Take to Double Costs and Cut the Purchasing Power of ${money(startingAmount)} in Half?`,
    intent: 'inflation',
    annualReturnPercent,
    startingAmount,
    contextLabel: 'inflation doubling estimate',
    featured,
  };
}

function createPortfolioGrowthRecord(
  startingAmount: number,
  annualReturnPercent: number,
  featured = false,
): RuleOf72SeoRecord {
  return {
    slug: `portfolio-growth-${startingAmount}-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `How Long Could a Portfolio of ${money(startingAmount)} Take to Double at ${formatRate(annualReturnPercent)}%?`,
    intent: 'portfolio-growth',
    annualReturnPercent,
    startingAmount,
    contextLabel: 'portfolio growth estimate',
    featured,
  };
}

function createRetirementPlanningRecord(
  startingAmount: number,
  annualReturnPercent: number,
  featured = false,
): RuleOf72SeoRecord {
  return {
    slug: `retirement-${startingAmount}-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `In Retirement Planning, How Long Could ${money(startingAmount)} Take to Double at ${formatRate(annualReturnPercent)}%?`,
    intent: 'retirement-planning',
    annualReturnPercent,
    startingAmount,
    contextLabel: 'retirement planning estimate',
    featured,
  };
}

function createIndexFundRecord(
  startingAmount: number,
  annualReturnPercent: number,
  featured = false,
): RuleOf72SeoRecord {
  return {
    slug: `index-fund-${startingAmount}-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `How Long Could an Index Fund Balance of ${money(startingAmount)} Take to Double at ${formatRate(annualReturnPercent)}%?`,
    intent: 'index-fund',
    annualReturnPercent,
    startingAmount,
    contextLabel: 'index fund doubling estimate',
    featured,
  };
}

function createHighYieldSavingsRecord(
  startingAmount: number,
  annualReturnPercent: number,
  featured = false,
): RuleOf72SeoRecord {
  return {
    slug: `high-yield-savings-${startingAmount}-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `How Long Could a High-Yield Savings Balance of ${money(startingAmount)} Take to Double at ${formatRate(annualReturnPercent)}%?`,
    intent: 'high-yield-savings',
    annualReturnPercent,
    startingAmount,
    contextLabel: 'high-yield savings estimate',
    featured,
  };
}

const doublingAmounts = [1000, 5000, 10000, 25000, 50000];
const doublingRates = [3, 4, 6, 8, 12];

export const doublingMoneyRuleOf72SeoRecords = doublingAmounts.flatMap(
  (startingAmount) =>
    doublingRates.map((annualReturnPercent) =>
      createDoublingMoneyRecord(
        startingAmount,
        annualReturnPercent,
        startingAmount === 10000 && annualReturnPercent === 8,
      ),
    ),
);

const investmentAmounts = [5000, 10000, 25000, 50000, 100000];
const investmentRates = [5, 7, 9, 10, 12];

export const investmentGrowthRuleOf72SeoRecords = investmentAmounts.flatMap(
  (startingAmount) =>
    investmentRates.map((annualReturnPercent) =>
      createInvestmentGrowthRecord(
        startingAmount,
        annualReturnPercent,
        startingAmount === 25000 && annualReturnPercent === 7,
      ),
    ),
);

const savingsAmounts = [1000, 5000, 10000, 20000, 50000];
const savingsRates = [1, 2, 3, 4, 5];

export const savingsGrowthRuleOf72SeoRecords = savingsAmounts.flatMap(
  (startingAmount) =>
    savingsRates.map((annualReturnPercent) =>
      createSavingsGrowthRecord(
        startingAmount,
        annualReturnPercent,
        startingAmount === 10000 && annualReturnPercent === 4,
      ),
    ),
);

const inflationAmounts = [1000, 5000, 10000, 25000, 50000];
const inflationRates = [2, 2.5, 3, 4, 6];

export const inflationRuleOf72SeoRecords = inflationAmounts.flatMap(
  (startingAmount) =>
    inflationRates.map((annualReturnPercent) =>
      createInflationRecord(
        startingAmount,
        annualReturnPercent,
        startingAmount === 10000 && annualReturnPercent === 3,
      ),
    ),
);

const portfolioAmounts = [50000, 100000, 250000, 500000, 1000000];
const portfolioRates = [4, 6, 7, 8, 10];

export const portfolioGrowthRuleOf72SeoRecords = portfolioAmounts.flatMap(
  (startingAmount) =>
    portfolioRates.map((annualReturnPercent) =>
      createPortfolioGrowthRecord(
        startingAmount,
        annualReturnPercent,
        startingAmount === 250000 && annualReturnPercent === 8,
      ),
    ),
);

const retirementAmounts = [100000, 250000, 500000, 750000, 1000000];
const retirementRates = [5, 6, 7, 8, 9];

export const retirementPlanningRuleOf72SeoRecords = retirementAmounts.flatMap(
  (startingAmount) =>
    retirementRates.map((annualReturnPercent) =>
      createRetirementPlanningRecord(
        startingAmount,
        annualReturnPercent,
        startingAmount === 500000 && annualReturnPercent === 7,
      ),
    ),
);

const indexFundAmounts = [10000, 25000, 50000, 100000, 250000];
const indexFundRates = [6, 7, 8, 9, 10];

export const indexFundRuleOf72SeoRecords = indexFundAmounts.flatMap(
  (startingAmount) =>
    indexFundRates.map((annualReturnPercent) =>
      createIndexFundRecord(
        startingAmount,
        annualReturnPercent,
        startingAmount === 25000 && annualReturnPercent === 8,
      ),
    ),
);

const highYieldSavingsAmounts = [1000, 5000, 10000, 25000, 50000];
const highYieldSavingsRates = [3.5, 4, 4.5, 5, 5.25];

export const highYieldSavingsRuleOf72SeoRecords =
  highYieldSavingsAmounts.flatMap((startingAmount) =>
    highYieldSavingsRates.map((annualReturnPercent) =>
      createHighYieldSavingsRecord(
        startingAmount,
        annualReturnPercent,
        startingAmount === 10000 && annualReturnPercent === 5,
      ),
    ),
  );

export const ruleOf72SeoRecords: RuleOf72SeoRecord[] = [
  ...doublingMoneyRuleOf72SeoRecords,
  ...investmentGrowthRuleOf72SeoRecords,
  ...savingsGrowthRuleOf72SeoRecords,
  ...inflationRuleOf72SeoRecords,
  ...portfolioGrowthRuleOf72SeoRecords,
  ...retirementPlanningRuleOf72SeoRecords,
  ...indexFundRuleOf72SeoRecords,
  ...highYieldSavingsRuleOf72SeoRecords,
];

export const featuredRuleOf72SeoRecords = ruleOf72SeoRecords.filter(
  (record) => record.featured,
);
