export type InflationAdjustedReturnSeoIntent =
  | 'conservative-portfolio'
  | 'balanced-portfolio'
  | 'growth-portfolio'
  | 'retirement-portfolio'
  | 'taxable-brokerage';

export interface InflationAdjustedReturnSeoRecord {
  slug: string;
  question: string;
  intent: InflationAdjustedReturnSeoIntent;
  startingInvestment: number;
  nominalAnnualReturnPercent: number;
  inflationRatePercent: number;
  years: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_INFLATION_ADJUSTED_RETURN_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const formatRate = (rate: number) => rate.toLocaleString('en-US');
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function createRecord(
  intent: InflationAdjustedReturnSeoIntent,
  scenarioLabel: string,
  slugPrefix: string,
  questionPrefix: string,
  startingInvestment: number,
  nominalAnnualReturnPercent: number,
  inflationRatePercent: number,
  years: number,
  featured = false,
): InflationAdjustedReturnSeoRecord {
  return {
    slug: `${slugPrefix}-${startingInvestment}-at-${rateSlug(nominalAnnualReturnPercent)}-percent-with-${rateSlug(inflationRatePercent)}-inflation-for-${years}-years`,
    question: `${questionPrefix} ${money(startingInvestment)} at ${formatRate(nominalAnnualReturnPercent)}% With ${formatRate(inflationRatePercent)}% Inflation Over ${years} Years?`,
    intent,
    startingInvestment,
    nominalAnnualReturnPercent,
    inflationRatePercent,
    years,
    scenarioLabel,
    featured,
  };
}

const conservativeInvestments = [10000, 25000, 50000, 100000, 250000];
const conservativeScenarios = [
  { nominalAnnualReturnPercent: 3, inflationRatePercent: 1.5, years: 5 },
  { nominalAnnualReturnPercent: 3.5, inflationRatePercent: 2, years: 10 },
  { nominalAnnualReturnPercent: 4, inflationRatePercent: 2.5, years: 15 },
  { nominalAnnualReturnPercent: 4, inflationRatePercent: 3, years: 20 },
  { nominalAnnualReturnPercent: 4.5, inflationRatePercent: 3, years: 25 },
  { nominalAnnualReturnPercent: 5, inflationRatePercent: 3.5, years: 30 },
  { nominalAnnualReturnPercent: 5, inflationRatePercent: 4, years: 35 },
  { nominalAnnualReturnPercent: 5.5, inflationRatePercent: 4.5, years: 40 },
];

export const conservativePortfolioInflationAdjustedReturnSeoRecords =
  conservativeInvestments.flatMap((startingInvestment) =>
    conservativeScenarios.map((scenario) =>
      createRecord(
        'conservative-portfolio',
        'conservative portfolio inflation-adjusted return example',
        'conservative-inflation-adjusted-return',
        'What Is the Inflation-Adjusted Return on',
        startingInvestment,
        scenario.nominalAnnualReturnPercent,
        scenario.inflationRatePercent,
        scenario.years,
        startingInvestment === 100000 &&
          scenario.nominalAnnualReturnPercent === 5 &&
          scenario.inflationRatePercent === 3.5 &&
          scenario.years === 30,
      ),
    ),
  );

const balancedInvestments = [10000, 25000, 50000, 100000, 250000];
const balancedScenarios = [
  { nominalAnnualReturnPercent: 5, inflationRatePercent: 1.5, years: 5 },
  { nominalAnnualReturnPercent: 5.5, inflationRatePercent: 2, years: 10 },
  { nominalAnnualReturnPercent: 6, inflationRatePercent: 2.5, years: 15 },
  { nominalAnnualReturnPercent: 6, inflationRatePercent: 3, years: 20 },
  { nominalAnnualReturnPercent: 6.5, inflationRatePercent: 3, years: 25 },
  { nominalAnnualReturnPercent: 7, inflationRatePercent: 3.5, years: 30 },
  { nominalAnnualReturnPercent: 7, inflationRatePercent: 4, years: 35 },
  { nominalAnnualReturnPercent: 7.5, inflationRatePercent: 4.5, years: 40 },
];

export const balancedPortfolioInflationAdjustedReturnSeoRecords =
  balancedInvestments.flatMap((startingInvestment) =>
    balancedScenarios.map((scenario) =>
      createRecord(
        'balanced-portfolio',
        'balanced portfolio inflation-adjusted return example',
        'balanced-inflation-adjusted-return',
        'What Is the Inflation-Adjusted Return on',
        startingInvestment,
        scenario.nominalAnnualReturnPercent,
        scenario.inflationRatePercent,
        scenario.years,
        startingInvestment === 100000 &&
          scenario.nominalAnnualReturnPercent === 7 &&
          scenario.inflationRatePercent === 3.5 &&
          scenario.years === 30,
      ),
    ),
  );

const growthInvestments = [10000, 25000, 50000, 100000, 250000];
const growthScenarios = [
  { nominalAnnualReturnPercent: 7, inflationRatePercent: 1.5, years: 5 },
  { nominalAnnualReturnPercent: 7.5, inflationRatePercent: 2, years: 10 },
  { nominalAnnualReturnPercent: 8, inflationRatePercent: 2.5, years: 15 },
  { nominalAnnualReturnPercent: 8, inflationRatePercent: 3, years: 20 },
  { nominalAnnualReturnPercent: 8.5, inflationRatePercent: 3, years: 25 },
  { nominalAnnualReturnPercent: 9, inflationRatePercent: 3.5, years: 30 },
  { nominalAnnualReturnPercent: 9, inflationRatePercent: 4, years: 35 },
  { nominalAnnualReturnPercent: 9.5, inflationRatePercent: 4.5, years: 40 },
];

export const growthPortfolioInflationAdjustedReturnSeoRecords =
  growthInvestments.flatMap((startingInvestment) =>
    growthScenarios.map((scenario) =>
      createRecord(
        'growth-portfolio',
        'growth portfolio inflation-adjusted return example',
        'growth-inflation-adjusted-return',
        'What Is the Inflation-Adjusted Return on',
        startingInvestment,
        scenario.nominalAnnualReturnPercent,
        scenario.inflationRatePercent,
        scenario.years,
        startingInvestment === 100000 &&
          scenario.nominalAnnualReturnPercent === 9 &&
          scenario.inflationRatePercent === 3.5 &&
          scenario.years === 30,
      ),
    ),
  );

const retirementInvestments = [50000, 100000, 250000, 500000, 1000000];
const retirementScenarios = [
  { nominalAnnualReturnPercent: 4.5, inflationRatePercent: 1.5, years: 10 },
  { nominalAnnualReturnPercent: 5, inflationRatePercent: 2, years: 15 },
  { nominalAnnualReturnPercent: 5.5, inflationRatePercent: 2.5, years: 20 },
  { nominalAnnualReturnPercent: 6, inflationRatePercent: 3, years: 25 },
  { nominalAnnualReturnPercent: 6, inflationRatePercent: 3.5, years: 30 },
  { nominalAnnualReturnPercent: 6.5, inflationRatePercent: 3.5, years: 35 },
  { nominalAnnualReturnPercent: 7, inflationRatePercent: 4, years: 40 },
  { nominalAnnualReturnPercent: 7, inflationRatePercent: 4.5, years: 45 },
];

export const retirementPortfolioInflationAdjustedReturnSeoRecords =
  retirementInvestments.flatMap((startingInvestment) =>
    retirementScenarios.map((scenario) =>
      createRecord(
        'retirement-portfolio',
        'retirement portfolio inflation-adjusted return example',
        'retirement-inflation-adjusted-return',
        'What Is the Inflation-Adjusted Return on',
        startingInvestment,
        scenario.nominalAnnualReturnPercent,
        scenario.inflationRatePercent,
        scenario.years,
        startingInvestment === 500000 &&
          scenario.nominalAnnualReturnPercent === 6 &&
          scenario.inflationRatePercent === 3.5 &&
          scenario.years === 30,
      ),
    ),
  );

const taxableInvestments = [10000, 25000, 50000, 100000, 250000];
const taxableScenarios = [
  { nominalAnnualReturnPercent: 5.5, inflationRatePercent: 1.5, years: 5 },
  { nominalAnnualReturnPercent: 6, inflationRatePercent: 2, years: 10 },
  { nominalAnnualReturnPercent: 6.5, inflationRatePercent: 2.5, years: 15 },
  { nominalAnnualReturnPercent: 7, inflationRatePercent: 3, years: 20 },
  { nominalAnnualReturnPercent: 7, inflationRatePercent: 3.5, years: 25 },
  { nominalAnnualReturnPercent: 7.5, inflationRatePercent: 3.5, years: 30 },
  { nominalAnnualReturnPercent: 8, inflationRatePercent: 4, years: 35 },
  { nominalAnnualReturnPercent: 8, inflationRatePercent: 4.5, years: 40 },
];

export const taxableBrokerageInflationAdjustedReturnSeoRecords =
  taxableInvestments.flatMap((startingInvestment) =>
    taxableScenarios.map((scenario) =>
      createRecord(
        'taxable-brokerage',
        'taxable brokerage inflation-adjusted return example',
        'taxable-inflation-adjusted-return',
        'What Is the Inflation-Adjusted Return on',
        startingInvestment,
        scenario.nominalAnnualReturnPercent,
        scenario.inflationRatePercent,
        scenario.years,
        startingInvestment === 100000 &&
          scenario.nominalAnnualReturnPercent === 7.5 &&
          scenario.inflationRatePercent === 3.5 &&
          scenario.years === 30,
      ),
    ),
  );

export const inflationAdjustedReturnSeoRecords: InflationAdjustedReturnSeoRecord[] =
  [
    ...conservativePortfolioInflationAdjustedReturnSeoRecords,
    ...balancedPortfolioInflationAdjustedReturnSeoRecords,
    ...growthPortfolioInflationAdjustedReturnSeoRecords,
    ...retirementPortfolioInflationAdjustedReturnSeoRecords,
    ...taxableBrokerageInflationAdjustedReturnSeoRecords,
  ];

export const featuredInflationAdjustedReturnSeoRecords = inflationAdjustedReturnSeoRecords.filter((record) =>
  [
    'conservative-inflation-adjusted-return-50000-at-4-5-percent-with-3-inflation-for-25-years',
    'balanced-inflation-adjusted-return-50000-at-6-5-percent-with-3-inflation-for-25-years',
    'growth-inflation-adjusted-return-50000-at-8-5-percent-with-3-inflation-for-25-years',
    'retirement-inflation-adjusted-return-250000-at-6-percent-with-3-5-inflation-for-30-years',
    'taxable-inflation-adjusted-return-50000-at-7-percent-with-3-5-inflation-for-25-years',
  ].includes(record.slug),
);
