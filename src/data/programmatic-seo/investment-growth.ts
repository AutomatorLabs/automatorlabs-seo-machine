export type InvestmentGrowthSeoIntent =
  | 'lump-sum'
  | 'monthly-investing'
  | 'annual-investing'
  | 'retirement-investing'
  | 'taxable-investing'
  | 'index-fund-investing'
  | 'etf-investing'
  | 'wealth-accumulation';

export interface InvestmentGrowthSeoRecord {
  slug: string;
  question: string;
  intent: InvestmentGrowthSeoIntent;
  initialInvestment: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  years: number;
  accountLabel: string;
  featured?: boolean;
  annualContribution?: number;
}

export const EXPECTED_INVESTMENT_GROWTH_SEO_PAGE_COUNT = 200;

const formatRate = (rate: number) => rate.toLocaleString('en-US');
const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function lumpSumRecord(
  initialInvestment: number,
  annualReturnPercent: number,
  years: number,
  featured = false,
): InvestmentGrowthSeoRecord {
  return {
    slug: `lump-sum-${initialInvestment}-at-${rateSlug(annualReturnPercent)}-percent-for-${years}-years`,
    question: `How Much Could a ${money(initialInvestment)} Lump-Sum Investment Grow at ${formatRate(annualReturnPercent)}% Over ${years} Years?`,
    intent: 'lump-sum',
    initialInvestment,
    monthlyContribution: 0,
    annualReturnPercent,
    years,
    accountLabel: 'lump-sum investment',
    featured,
  };
}

function monthlyInvestingRecord(
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
  featured = false,
): InvestmentGrowthSeoRecord {
  return {
    slug: `invest-${initialInvestment}-with-${monthlyContribution}-monthly-at-${rateSlug(annualReturnPercent)}-percent-for-${years}-years`,
    question: `What Could ${money(initialInvestment)} Plus ${money(monthlyContribution)} Monthly Grow to in ${years} Years at ${formatRate(annualReturnPercent)}%?`,
    intent: 'monthly-investing',
    initialInvestment,
    monthlyContribution,
    annualReturnPercent,
    years,
    accountLabel: 'monthly investing plan',
    featured,
  };
}

function annualInvestingRecord(
  initialInvestment: number,
  annualContribution: number,
  annualReturnPercent: number,
  years: number,
  featured = false,
): InvestmentGrowthSeoRecord {
  const monthlyContribution = annualContribution / 12;

  return {
    slug: `invest-${initialInvestment}-with-${annualContribution}-per-year-at-${rateSlug(annualReturnPercent)}-percent-for-${years}-years`,
    question: `How Much Could ${money(initialInvestment)} Grow With ${money(annualContribution)} per Year Invested for ${years} Years at ${formatRate(annualReturnPercent)}%?`,
    intent: 'annual-investing',
    initialInvestment,
    monthlyContribution,
    annualReturnPercent,
    years,
    accountLabel: 'annual investing plan',
    annualContribution,
    featured,
  };
}

function retirementInvestingRecord(
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
  featured = false,
): InvestmentGrowthSeoRecord {
  return {
    slug: `retirement-investing-${initialInvestment}-with-${monthlyContribution}-monthly-at-${rateSlug(annualReturnPercent)}-percent-for-${years}-years`,
    question: `How Much Could a Retirement Portfolio Grow From ${money(initialInvestment)} With ${money(monthlyContribution)} Monthly for ${years} Years at ${formatRate(annualReturnPercent)}%?`,
    intent: 'retirement-investing',
    initialInvestment,
    monthlyContribution,
    annualReturnPercent,
    years,
    accountLabel: 'retirement portfolio',
    featured,
  };
}

function taxableInvestingRecord(
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
  featured = false,
): InvestmentGrowthSeoRecord {
  return {
    slug: `taxable-investing-${initialInvestment}-with-${monthlyContribution}-monthly-at-${rateSlug(annualReturnPercent)}-percent-for-${years}-years`,
    question: `How Much Could a Taxable Brokerage Account Grow From ${money(initialInvestment)} With ${money(monthlyContribution)} Monthly for ${years} Years at ${formatRate(annualReturnPercent)}%?`,
    intent: 'taxable-investing',
    initialInvestment,
    monthlyContribution,
    annualReturnPercent,
    years,
    accountLabel: 'taxable brokerage account',
    featured,
  };
}

function indexFundRecord(
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
  featured = false,
): InvestmentGrowthSeoRecord {
  return {
    slug: `index-fund-${initialInvestment}-with-${monthlyContribution}-monthly-at-${rateSlug(annualReturnPercent)}-percent-for-${years}-years`,
    question: `How Much Could an Index Fund Account Grow From ${money(initialInvestment)} With ${money(monthlyContribution)} Monthly for ${years} Years at ${formatRate(annualReturnPercent)}%?`,
    intent: 'index-fund-investing',
    initialInvestment,
    monthlyContribution,
    annualReturnPercent,
    years,
    accountLabel: 'index fund account',
    featured,
  };
}

function etfRecord(
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
  featured = false,
): InvestmentGrowthSeoRecord {
  return {
    slug: `etf-${initialInvestment}-with-${monthlyContribution}-monthly-at-${rateSlug(annualReturnPercent)}-percent-for-${years}-years`,
    question: `How Much Could an ETF Portfolio Grow From ${money(initialInvestment)} With ${money(monthlyContribution)} Monthly for ${years} Years at ${formatRate(annualReturnPercent)}%?`,
    intent: 'etf-investing',
    initialInvestment,
    monthlyContribution,
    annualReturnPercent,
    years,
    accountLabel: 'ETF portfolio',
    featured,
  };
}

function wealthAccumulationRecord(
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
  featured = false,
): InvestmentGrowthSeoRecord {
  return {
    slug: `build-wealth-from-${initialInvestment}-with-${monthlyContribution}-monthly-at-${rateSlug(annualReturnPercent)}-percent-for-${years}-years`,
    question: `How Much Wealth Could ${money(initialInvestment)} Plus ${money(monthlyContribution)} Monthly Build Over ${years} Years at ${formatRate(annualReturnPercent)}%?`,
    intent: 'wealth-accumulation',
    initialInvestment,
    monthlyContribution,
    annualReturnPercent,
    years,
    accountLabel: 'long-term wealth-building portfolio',
    featured,
  };
}

const lumpSumPrincipals = [
  5000,
  10000,
  25000,
  50000,
  75000,
  100000,
  150000,
  250000,
];
const lumpSumScenarios = [
  { annualReturnPercent: 4, years: 10 },
  { annualReturnPercent: 5, years: 15 },
  { annualReturnPercent: 6, years: 20 },
  { annualReturnPercent: 7, years: 25 },
  { annualReturnPercent: 8, years: 30 },
];

export const lumpSumInvestmentGrowthSeoRecords =
  lumpSumPrincipals.flatMap((initialInvestment) =>
    lumpSumScenarios.map(({ annualReturnPercent, years }) =>
      lumpSumRecord(
        initialInvestment,
        annualReturnPercent,
        years,
        initialInvestment === 10000 &&
          annualReturnPercent === 8 &&
          years === 30,
      ),
    ),
  );

const monthlyPrincipals = [0, 5000, 25000, 50000];
const monthlyContributionLevels = [250, 500, 1000, 1500, 2000];
const monthlyScenarios = [
  { annualReturnPercent: 5, years: 10 },
  { annualReturnPercent: 7, years: 20 },
  { annualReturnPercent: 9, years: 30 },
];

export const monthlyInvestmentGrowthSeoRecords =
  monthlyPrincipals.flatMap((initialInvestment) =>
    monthlyContributionLevels.flatMap((monthlyContribution) =>
      monthlyScenarios.map(({ annualReturnPercent, years }) =>
        monthlyInvestingRecord(
          initialInvestment,
          monthlyContribution,
          annualReturnPercent,
          years,
          initialInvestment === 25000 &&
            monthlyContribution === 1000 &&
            annualReturnPercent === 7 &&
            years === 20,
        ),
      ),
    ),
  );

const annualPrincipals = [0, 10000, 25000, 50000];
const annualContributionLevels = [6000, 12000, 18000];
const annualScenarios = [
  { annualReturnPercent: 6, years: 15 },
  { annualReturnPercent: 8, years: 25 },
];

export const annualInvestmentGrowthSeoRecords =
  annualPrincipals.flatMap((initialInvestment) =>
    annualContributionLevels.flatMap((annualContribution) =>
      annualScenarios.map(({ annualReturnPercent, years }) =>
        annualInvestingRecord(
          initialInvestment,
          annualContribution,
          annualReturnPercent,
          years,
          initialInvestment === 10000 &&
            annualContribution === 12000 &&
            annualReturnPercent === 8 &&
            years === 25,
        ),
      ),
    ),
  );

const retirementPrincipals = [25000, 50000, 100000, 150000];
const retirementMonthlyContributions = [500, 1000, 1500];
const retirementScenarios = [
  { annualReturnPercent: 7, years: 20 },
  { annualReturnPercent: 8, years: 30 },
];

export const retirementInvestmentGrowthSeoRecords =
  retirementPrincipals.flatMap((initialInvestment) =>
    retirementMonthlyContributions.flatMap((monthlyContribution) =>
      retirementScenarios.map(({ annualReturnPercent, years }) =>
        retirementInvestingRecord(
          initialInvestment,
          monthlyContribution,
          annualReturnPercent,
          years,
          initialInvestment === 50000 &&
            monthlyContribution === 1000 &&
            annualReturnPercent === 8 &&
            years === 30,
        ),
      ),
    ),
  );

const taxablePrincipals = [10000, 50000, 100000];
const taxableMonthlyContributions = [500, 1500];
const taxableScenarios = [
  { annualReturnPercent: 6, years: 15 },
  { annualReturnPercent: 7, years: 25 },
];

export const taxableInvestmentGrowthSeoRecords =
  taxablePrincipals.flatMap((initialInvestment) =>
    taxableMonthlyContributions.flatMap((monthlyContribution) =>
      taxableScenarios.map(({ annualReturnPercent, years }) =>
        taxableInvestingRecord(
          initialInvestment,
          monthlyContribution,
          annualReturnPercent,
          years,
          initialInvestment === 50000 &&
            monthlyContribution === 1500 &&
            annualReturnPercent === 7 &&
            years === 25,
        ),
      ),
    ),
  );

const indexFundPrincipals = [10000, 25000, 50000];
const indexFundMonthlyContributions = [250, 750];
const indexFundScenarios = [
  { annualReturnPercent: 7, years: 20 },
  { annualReturnPercent: 8, years: 30 },
];

export const indexFundInvestmentGrowthSeoRecords =
  indexFundPrincipals.flatMap((initialInvestment) =>
    indexFundMonthlyContributions.flatMap((monthlyContribution) =>
      indexFundScenarios.map(({ annualReturnPercent, years }) =>
        indexFundRecord(
          initialInvestment,
          monthlyContribution,
          annualReturnPercent,
          years,
          initialInvestment === 25000 &&
            monthlyContribution === 750 &&
            annualReturnPercent === 8 &&
            years === 30,
        ),
      ),
    ),
  );

const etfPrincipals = [10000, 25000, 50000];
const etfMonthlyContributions = [500, 1000];
const etfScenarios = [
  { annualReturnPercent: 6, years: 15 },
  { annualReturnPercent: 8, years: 25 },
];

export const etfInvestmentGrowthSeoRecords = etfPrincipals.flatMap(
  (initialInvestment) =>
    etfMonthlyContributions.flatMap((monthlyContribution) =>
      etfScenarios.map(({ annualReturnPercent, years }) =>
        etfRecord(
          initialInvestment,
          monthlyContribution,
          annualReturnPercent,
          years,
          initialInvestment === 10000 &&
            monthlyContribution === 500 &&
            annualReturnPercent === 8 &&
            years === 25,
        ),
      ),
    ),
);

const wealthPrincipals = [50000, 100000, 250000, 500000];
const wealthMonthlyContributions = [1000, 2500];
const wealthScenarios = [
  { annualReturnPercent: 6, years: 30 },
  { annualReturnPercent: 8, years: 40 },
];

export const wealthAccumulationInvestmentGrowthSeoRecords =
  wealthPrincipals.flatMap((initialInvestment) =>
    wealthMonthlyContributions.flatMap((monthlyContribution) =>
      wealthScenarios.map(({ annualReturnPercent, years }) =>
        wealthAccumulationRecord(
          initialInvestment,
          monthlyContribution,
          annualReturnPercent,
          years,
          initialInvestment === 250000 &&
            monthlyContribution === 2500 &&
            annualReturnPercent === 8 &&
            years === 40,
        ),
      ),
    ),
  );

export const investmentGrowthSeoRecords: InvestmentGrowthSeoRecord[] = [
  ...lumpSumInvestmentGrowthSeoRecords,
  ...monthlyInvestmentGrowthSeoRecords,
  ...annualInvestmentGrowthSeoRecords,
  ...retirementInvestmentGrowthSeoRecords,
  ...taxableInvestmentGrowthSeoRecords,
  ...indexFundInvestmentGrowthSeoRecords,
  ...etfInvestmentGrowthSeoRecords,
  ...wealthAccumulationInvestmentGrowthSeoRecords,
];

export const featuredInvestmentGrowthSeoRecords =
  investmentGrowthSeoRecords.filter((record) => record.featured);
