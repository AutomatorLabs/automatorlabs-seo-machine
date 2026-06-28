export type SavingsGrowthSeoIntent =
  | 'existing-savings-growth'
  | 'monthly-contribution-growth'
  | 'high-yield-savings-growth'
  | 'conservative-savings-growth'
  | 'retirement-savings-growth';

export interface SavingsGrowthSeoRecord {
  slug: string;
  question: string;
  intent: SavingsGrowthSeoIntent;
  startingSavings: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  years: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_SAVINGS_GROWTH_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const formatRate = (rate: number) => rate.toLocaleString('en-US');
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function createRecord(
  intent: SavingsGrowthSeoIntent,
  scenarioLabel: string,
  slugPrefix: string,
  questionPrefix: string,
  startingSavings: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
  featured = false,
): SavingsGrowthSeoRecord {
  return {
    slug: `${slugPrefix}-${startingSavings}-starting-${monthlyContribution}-monthly-at-${rateSlug(annualReturnPercent)}-percent-for-${years}-years`,
    question: `${questionPrefix} ${money(startingSavings)} Starting Savings With ${money(monthlyContribution)} Saved Monthly at ${formatRate(annualReturnPercent)}% Over ${years} Years?`,
    intent,
    startingSavings,
    monthlyContribution,
    annualReturnPercent,
    years,
    scenarioLabel,
    featured,
  };
}

const existingSavingsBalances = [1000, 5000, 10000, 25000, 50000];
const existingSavingsScenarios = [
  { monthlyContribution: 100, annualReturnPercent: 2, years: 3 },
  { monthlyContribution: 250, annualReturnPercent: 2.5, years: 5 },
  { monthlyContribution: 400, annualReturnPercent: 3, years: 7 },
  { monthlyContribution: 500, annualReturnPercent: 3.5, years: 10 },
  { monthlyContribution: 750, annualReturnPercent: 4, years: 12 },
  { monthlyContribution: 1000, annualReturnPercent: 4.5, years: 15 },
  { monthlyContribution: 1500, annualReturnPercent: 5, years: 20 },
  { monthlyContribution: 2000, annualReturnPercent: 5.5, years: 25 },
];

export const existingSavingsGrowthSeoRecords = existingSavingsBalances.flatMap(
  (startingSavings) =>
    existingSavingsScenarios.map((scenario) =>
      createRecord(
        'existing-savings-growth',
        'existing savings growth example',
        'savings-growth',
        'How Much Could Savings Grow From',
        startingSavings,
        scenario.monthlyContribution,
        scenario.annualReturnPercent,
        scenario.years,
        startingSavings === 10000 &&
          scenario.monthlyContribution === 500 &&
          scenario.annualReturnPercent === 3.5 &&
          scenario.years === 10,
      ),
    ),
);

const monthlyContributionBalances = [0, 1000, 2500, 5000, 10000];
const monthlyContributionScenarios = [
  { monthlyContribution: 150, annualReturnPercent: 2.5, years: 5 },
  { monthlyContribution: 300, annualReturnPercent: 3, years: 7 },
  { monthlyContribution: 500, annualReturnPercent: 3.5, years: 10 },
  { monthlyContribution: 750, annualReturnPercent: 4, years: 12 },
  { monthlyContribution: 1000, annualReturnPercent: 4.5, years: 15 },
  { monthlyContribution: 1250, annualReturnPercent: 5, years: 18 },
  { monthlyContribution: 1500, annualReturnPercent: 5.5, years: 20 },
  { monthlyContribution: 2000, annualReturnPercent: 6, years: 25 },
];

export const monthlyContributionSavingsGrowthSeoRecords =
  monthlyContributionBalances.flatMap((startingSavings) =>
    monthlyContributionScenarios.map((scenario) =>
      createRecord(
        'monthly-contribution-growth',
        'monthly savings growth example',
        'monthly-savings-growth',
        'What Could a Monthly Savings Plan Grow to From',
        startingSavings,
        scenario.monthlyContribution,
        scenario.annualReturnPercent,
        scenario.years,
      ),
    ),
  );

const highYieldBalances = [5000, 10000, 25000, 50000, 75000];
const highYieldScenarios = [
  { monthlyContribution: 100, annualReturnPercent: 3.5, years: 3 },
  { monthlyContribution: 250, annualReturnPercent: 3.75, years: 5 },
  { monthlyContribution: 400, annualReturnPercent: 4, years: 7 },
  { monthlyContribution: 500, annualReturnPercent: 4.25, years: 10 },
  { monthlyContribution: 750, annualReturnPercent: 4.5, years: 12 },
  { monthlyContribution: 1000, annualReturnPercent: 4.75, years: 15 },
  { monthlyContribution: 1250, annualReturnPercent: 5, years: 18 },
  { monthlyContribution: 1500, annualReturnPercent: 5, years: 20 },
];

export const highYieldSavingsGrowthSeoRecords = highYieldBalances.flatMap(
  (startingSavings) =>
    highYieldScenarios.map((scenario) =>
      createRecord(
        'high-yield-savings-growth',
        'high-yield savings growth example',
        'high-yield-savings-growth',
        'How Much Could a High-Yield Savings Balance Grow From',
        startingSavings,
        scenario.monthlyContribution,
        scenario.annualReturnPercent,
        scenario.years,
      ),
    ),
);

const conservativeBalances = [10000, 25000, 50000, 75000, 100000];
const conservativeScenarios = [
  { monthlyContribution: 0, annualReturnPercent: 2, years: 3 },
  { monthlyContribution: 100, annualReturnPercent: 2.25, years: 5 },
  { monthlyContribution: 250, annualReturnPercent: 2.5, years: 7 },
  { monthlyContribution: 400, annualReturnPercent: 2.75, years: 10 },
  { monthlyContribution: 500, annualReturnPercent: 3, years: 12 },
  { monthlyContribution: 750, annualReturnPercent: 3.25, years: 15 },
  { monthlyContribution: 1000, annualReturnPercent: 3.5, years: 18 },
  { monthlyContribution: 1250, annualReturnPercent: 3.75, years: 20 },
];

export const conservativeSavingsGrowthSeoRecords = conservativeBalances.flatMap(
  (startingSavings) =>
    conservativeScenarios.map((scenario) =>
      createRecord(
        'conservative-savings-growth',
        'conservative savings growth example',
        'conservative-savings-growth',
        'What Could a Conservative Savings Plan Grow to From',
        startingSavings,
        scenario.monthlyContribution,
        scenario.annualReturnPercent,
        scenario.years,
      ),
    ),
);

const retirementBalances = [25000, 50000, 100000, 150000, 250000];
const retirementScenarios = [
  { monthlyContribution: 300, annualReturnPercent: 4, years: 10 },
  { monthlyContribution: 500, annualReturnPercent: 4.5, years: 15 },
  { monthlyContribution: 750, annualReturnPercent: 5, years: 18 },
  { monthlyContribution: 1000, annualReturnPercent: 5.5, years: 20 },
  { monthlyContribution: 1250, annualReturnPercent: 6, years: 22 },
  { monthlyContribution: 1500, annualReturnPercent: 6.5, years: 25 },
  { monthlyContribution: 2000, annualReturnPercent: 7, years: 27 },
  { monthlyContribution: 2500, annualReturnPercent: 7, years: 30 },
];

export const retirementSavingsGrowthSeoRecords = retirementBalances.flatMap(
  (startingSavings) =>
    retirementScenarios.map((scenario) =>
      createRecord(
        'retirement-savings-growth',
        'retirement savings growth example',
        'retirement-savings-growth',
        'How Much Could Retirement Savings Grow From',
        startingSavings,
        scenario.monthlyContribution,
        scenario.annualReturnPercent,
        scenario.years,
        startingSavings === 100000 &&
          scenario.monthlyContribution === 1000 &&
          scenario.annualReturnPercent === 5.5 &&
          scenario.years === 20,
      ),
    ),
);

export const savingsGrowthSeoRecords: SavingsGrowthSeoRecord[] = [
  ...existingSavingsGrowthSeoRecords,
  ...monthlyContributionSavingsGrowthSeoRecords,
  ...highYieldSavingsGrowthSeoRecords,
  ...conservativeSavingsGrowthSeoRecords,
  ...retirementSavingsGrowthSeoRecords,
];

export const featuredSavingsGrowthSeoRecords = savingsGrowthSeoRecords.filter(
  (record) => record.featured,
);
