export type RealRateOfReturnSeoIntent =
  | 'savings-account'
  | 'bond-portfolio'
  | 'balanced-portfolio'
  | 'stock-portfolio'
  | 'retirement-planning';

export interface RealRateOfReturnSeoRecord {
  slug: string;
  question: string;
  intent: RealRateOfReturnSeoIntent;
  nominalAnnualReturnPercent: number;
  inflationRatePercent: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_REAL_RATE_OF_RETURN_SEO_PAGE_COUNT = 200;

const formatRate = (rate: number) => rate.toLocaleString('en-US');
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function createRecord(
  intent: RealRateOfReturnSeoIntent,
  scenarioLabel: string,
  slugPrefix: string,
  questionPrefix: string,
  nominalAnnualReturnPercent: number,
  inflationRatePercent: number,
  featured = false,
): RealRateOfReturnSeoRecord {
  return {
    slug: `${slugPrefix}-${rateSlug(nominalAnnualReturnPercent)}-nominal-return-with-${rateSlug(inflationRatePercent)}-inflation`,
    question: `${questionPrefix} at ${formatRate(nominalAnnualReturnPercent)}% Nominal Return With ${formatRate(inflationRatePercent)}% Inflation?`,
    intent,
    nominalAnnualReturnPercent,
    inflationRatePercent,
    scenarioLabel,
    featured,
  };
}

const savingsAccountReturns = [2, 2.5, 3, 3.5, 4];
const savingsAccountInflationRates = [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export const savingsAccountRealRateSeoRecords = savingsAccountReturns.flatMap(
  (nominalAnnualReturnPercent) =>
    savingsAccountInflationRates.map((inflationRatePercent) =>
      createRecord(
        'savings-account',
        'savings account real return example',
        'savings-account-real-return',
        'What Is the Real Return on a Savings Account',
        nominalAnnualReturnPercent,
        inflationRatePercent,
        nominalAnnualReturnPercent === 4 && inflationRatePercent === 3,
      ),
    ),
);

const bondPortfolioReturns = [3, 3.5, 4, 4.5, 5];
const bondPortfolioInflationRates = [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export const bondPortfolioRealRateSeoRecords = bondPortfolioReturns.flatMap(
  (nominalAnnualReturnPercent) =>
    bondPortfolioInflationRates.map((inflationRatePercent) =>
      createRecord(
        'bond-portfolio',
        'bond portfolio real return example',
        'bond-portfolio-real-return',
        'What Is the Real Return on a Bond Portfolio',
        nominalAnnualReturnPercent,
        inflationRatePercent,
        nominalAnnualReturnPercent === 5 && inflationRatePercent === 3,
      ),
    ),
);

const balancedPortfolioReturns = [5, 5.5, 6, 6.5, 7];
const balancedPortfolioInflationRates = [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export const balancedPortfolioRealRateSeoRecords = balancedPortfolioReturns.flatMap(
  (nominalAnnualReturnPercent) =>
    balancedPortfolioInflationRates.map((inflationRatePercent) =>
      createRecord(
        'balanced-portfolio',
        'balanced portfolio real return example',
        'balanced-portfolio-real-return',
        'What Is the Real Return on a Balanced Portfolio',
        nominalAnnualReturnPercent,
        inflationRatePercent,
        nominalAnnualReturnPercent === 6 && inflationRatePercent === 2.5,
      ),
    ),
);

const stockPortfolioReturns = [7, 8, 9, 10, 11];
const stockPortfolioInflationRates = [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export const stockPortfolioRealRateSeoRecords = stockPortfolioReturns.flatMap(
  (nominalAnnualReturnPercent) =>
    stockPortfolioInflationRates.map((inflationRatePercent) =>
      createRecord(
        'stock-portfolio',
        'stock portfolio real return example',
        'stock-portfolio-real-return',
        'What Is the Real Return on a Stock Portfolio',
        nominalAnnualReturnPercent,
        inflationRatePercent,
        nominalAnnualReturnPercent === 8 && inflationRatePercent === 3,
      ),
    ),
);

const retirementPlanningReturns = [4, 5, 6, 7, 8];
const retirementPlanningInflationRates = [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export const retirementPlanningRealRateSeoRecords =
  retirementPlanningReturns.flatMap((nominalAnnualReturnPercent) =>
    retirementPlanningInflationRates.map((inflationRatePercent) =>
      createRecord(
        'retirement-planning',
        'retirement planning real return example',
        'retirement-real-return',
        'What Is the Real Return for a Retirement Portfolio',
        nominalAnnualReturnPercent,
        inflationRatePercent,
        nominalAnnualReturnPercent === 6 &&
          inflationRatePercent === 3,
      ),
    ),
  );

export const realRateOfReturnSeoRecords: RealRateOfReturnSeoRecord[] = [
  ...savingsAccountRealRateSeoRecords,
  ...bondPortfolioRealRateSeoRecords,
  ...balancedPortfolioRealRateSeoRecords,
  ...stockPortfolioRealRateSeoRecords,
  ...retirementPlanningRealRateSeoRecords,
];
