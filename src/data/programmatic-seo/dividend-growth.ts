export type DividendGrowthSeoIntent =
  | 'dividend-income-growth'
  | 'dividend-reinvestment'
  | 'dividend-snowball'
  | 'portfolio-income-growth'
  | 'retirement-income';

export interface DividendGrowthSeoRecord {
  slug: string;
  question: string;
  intent: DividendGrowthSeoIntent;
  startingAnnualDividendIncome: number;
  annualDividendGrowthRatePercent: number;
  years: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_DIVIDEND_GROWTH_SEO_PAGE_COUNT = 200;

const formatRate = (rate: number) => rate.toLocaleString('en-US');
const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function dividendIncomeGrowthRecord(
  startingAnnualDividendIncome: number,
  annualDividendGrowthRatePercent: number,
  years: number,
  featured = false,
): DividendGrowthSeoRecord {
  return {
    slug: `annual-dividend-income-${startingAnnualDividendIncome}-growing-at-${rateSlug(annualDividendGrowthRatePercent)}-percent-for-${years}-years`,
    question: `How Could ${money(startingAnnualDividendIncome)} of Annual Dividend Income Grow at ${formatRate(annualDividendGrowthRatePercent)}% Over ${years} Years?`,
    intent: 'dividend-income-growth',
    startingAnnualDividendIncome,
    annualDividendGrowthRatePercent,
    years,
    scenarioLabel: 'annual dividend income growth',
    featured,
  };
}

function dividendReinvestmentRecord(
  startingAnnualDividendIncome: number,
  annualDividendGrowthRatePercent: number,
  years: number,
  featured = false,
): DividendGrowthSeoRecord {
  return {
    slug: `reinvested-dividend-income-${startingAnnualDividendIncome}-at-${rateSlug(annualDividendGrowthRatePercent)}-percent-for-${years}-years`,
    question: `If Reinvested Dividends Help ${money(startingAnnualDividendIncome)} of Annual Income Grow at ${formatRate(annualDividendGrowthRatePercent)}% for ${years} Years, What Could It Reach?`,
    intent: 'dividend-reinvestment',
    startingAnnualDividendIncome,
    annualDividendGrowthRatePercent,
    years,
    scenarioLabel: 'dividend reinvestment example',
    featured,
  };
}

function dividendSnowballRecord(
  startingAnnualDividendIncome: number,
  annualDividendGrowthRatePercent: number,
  years: number,
  featured = false,
): DividendGrowthSeoRecord {
  return {
    slug: `dividend-snowball-${startingAnnualDividendIncome}-at-${rateSlug(annualDividendGrowthRatePercent)}-percent-for-${years}-years`,
    question: `What Could a Dividend Snowball Starting at ${money(startingAnnualDividendIncome)} per Year Grow to at ${formatRate(annualDividendGrowthRatePercent)}% Over ${years} Years?`,
    intent: 'dividend-snowball',
    startingAnnualDividendIncome,
    annualDividendGrowthRatePercent,
    years,
    scenarioLabel: 'dividend snowball scenario',
    featured,
  };
}

function portfolioIncomeGrowthRecord(
  startingAnnualDividendIncome: number,
  annualDividendGrowthRatePercent: number,
  years: number,
  featured = false,
): DividendGrowthSeoRecord {
  return {
    slug: `portfolio-dividend-income-${startingAnnualDividendIncome}-at-${rateSlug(annualDividendGrowthRatePercent)}-percent-for-${years}-years`,
    question: `How Could Portfolio Dividend Income of ${money(startingAnnualDividendIncome)} per Year Grow at ${formatRate(annualDividendGrowthRatePercent)}% Over ${years} Years?`,
    intent: 'portfolio-income-growth',
    startingAnnualDividendIncome,
    annualDividendGrowthRatePercent,
    years,
    scenarioLabel: 'portfolio income growth',
    featured,
  };
}

function retirementIncomeRecord(
  startingAnnualDividendIncome: number,
  annualDividendGrowthRatePercent: number,
  years: number,
  featured = false,
): DividendGrowthSeoRecord {
  return {
    slug: `retirement-dividend-income-${startingAnnualDividendIncome}-at-${rateSlug(annualDividendGrowthRatePercent)}-percent-for-${years}-years`,
    question: `How Could ${money(startingAnnualDividendIncome)} of Retirement Dividend Income Grow at ${formatRate(annualDividendGrowthRatePercent)}% Over ${years} Years?`,
    intent: 'retirement-income',
    startingAnnualDividendIncome,
    annualDividendGrowthRatePercent,
    years,
    scenarioLabel: 'retirement dividend income growth',
    featured,
  };
}

const dividendIncomeStarts = [1200, 2400, 3600, 6000, 12000];
const dividendIncomeRates = [3, 5, 7, 9];
const dividendIncomeYears = [5, 10];

export const dividendIncomeGrowthSeoRecords = dividendIncomeStarts.flatMap(
  (startingAnnualDividendIncome) =>
    dividendIncomeRates.flatMap((annualDividendGrowthRatePercent) =>
      dividendIncomeYears.map((years) =>
        dividendIncomeGrowthRecord(
          startingAnnualDividendIncome,
          annualDividendGrowthRatePercent,
          years,
          startingAnnualDividendIncome === 2400 &&
            annualDividendGrowthRatePercent === 7 &&
            years === 10,
        ),
      ),
    ),
);

const reinvestmentStarts = [600, 1200, 2400, 4800, 7200];
const reinvestmentRates = [4, 6, 8, 10];
const reinvestmentYears = [10, 15];

export const dividendReinvestmentSeoRecords = reinvestmentStarts.flatMap(
  (startingAnnualDividendIncome) =>
    reinvestmentRates.flatMap((annualDividendGrowthRatePercent) =>
      reinvestmentYears.map((years) =>
        dividendReinvestmentRecord(
          startingAnnualDividendIncome,
          annualDividendGrowthRatePercent,
          years,
          startingAnnualDividendIncome === 2400 &&
            annualDividendGrowthRatePercent === 8 &&
            years === 15,
        ),
      ),
    ),
);

const snowballStarts = [300, 600, 1200, 2400, 3600];
const snowballRates = [5, 7, 9, 11];
const snowballYears = [15, 20];

export const dividendSnowballSeoRecords = snowballStarts.flatMap(
  (startingAnnualDividendIncome) =>
    snowballRates.flatMap((annualDividendGrowthRatePercent) =>
      snowballYears.map((years) =>
        dividendSnowballRecord(
          startingAnnualDividendIncome,
          annualDividendGrowthRatePercent,
          years,
          startingAnnualDividendIncome === 1200 &&
            annualDividendGrowthRatePercent === 9 &&
            years === 20,
        ),
      ),
    ),
);

const portfolioIncomeStarts = [3000, 6000, 9000, 15000];
const portfolioIncomeRates = [3, 5, 7, 9, 11];
const portfolioIncomeYears = [10, 20];

export const portfolioIncomeGrowthSeoRecords = portfolioIncomeStarts.flatMap(
  (startingAnnualDividendIncome) =>
    portfolioIncomeRates.flatMap((annualDividendGrowthRatePercent) =>
      portfolioIncomeYears.map((years) =>
        portfolioIncomeGrowthRecord(
          startingAnnualDividendIncome,
          annualDividendGrowthRatePercent,
          years,
          startingAnnualDividendIncome === 9000 &&
            annualDividendGrowthRatePercent === 7 &&
            years === 20,
        ),
      ),
    ),
);

const retirementIncomeStarts = [12000, 18000, 24000, 36000, 48000];
const retirementIncomeRates = [2, 4, 6, 8];
const retirementIncomeYears = [10, 15];

export const retirementDividendIncomeSeoRecords = retirementIncomeStarts.flatMap(
  (startingAnnualDividendIncome) =>
    retirementIncomeRates.flatMap((annualDividendGrowthRatePercent) =>
      retirementIncomeYears.map((years) =>
        retirementIncomeRecord(
          startingAnnualDividendIncome,
          annualDividendGrowthRatePercent,
          years,
          startingAnnualDividendIncome === 24000 &&
            annualDividendGrowthRatePercent === 4 &&
            years === 15,
        ),
      ),
    ),
);

export const dividendGrowthSeoRecords: DividendGrowthSeoRecord[] = [
  ...dividendIncomeGrowthSeoRecords,
  ...dividendReinvestmentSeoRecords,
  ...dividendSnowballSeoRecords,
  ...portfolioIncomeGrowthSeoRecords,
  ...retirementDividendIncomeSeoRecords,
];
