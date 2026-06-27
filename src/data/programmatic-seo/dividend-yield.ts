export type DividendYieldSeoIntent =
  | 'stock-dividend-yield'
  | 'etf-dividend-yield'
  | 'portfolio-dividend-yield'
  | 'monthly-income-dividend-yield'
  | 'retirement-income-dividend-yield';

export interface DividendYieldSeoRecord {
  slug: string;
  question: string;
  intent: DividendYieldSeoIntent;
  sharePrice: number;
  annualDividendPerShare: number;
  numberOfShares: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_DIVIDEND_YIELD_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function stockDividendYieldRecord(
  annualDividendPerShare: number,
  sharePrice: number,
  numberOfShares: number,
  featured = false,
): DividendYieldSeoRecord {
  return {
    slug: `stock-dividend-yield-${rateSlug(annualDividendPerShare)}-annual-dividend-${sharePrice}-share-price-${numberOfShares}-shares`,
    question: `What Is the Dividend Yield on a Stock Paying ${money(annualDividendPerShare)} per Share at a ${money(sharePrice)} Share Price With ${numberOfShares.toLocaleString('en-US')} Shares?`,
    intent: 'stock-dividend-yield',
    annualDividendPerShare,
    sharePrice,
    numberOfShares,
    scenarioLabel: 'stock dividend yield example',
    featured,
  };
}

function etfDividendYieldRecord(
  annualDividendPerShare: number,
  sharePrice: number,
  numberOfShares: number,
  featured = false,
): DividendYieldSeoRecord {
  return {
    slug: `etf-dividend-yield-${rateSlug(annualDividendPerShare)}-annual-dividend-${sharePrice}-share-price-${numberOfShares}-shares`,
    question: `What Is the Dividend Yield on an ETF Paying ${money(annualDividendPerShare)} per Share at a ${money(sharePrice)} Share Price With ${numberOfShares.toLocaleString('en-US')} Shares?`,
    intent: 'etf-dividend-yield',
    annualDividendPerShare,
    sharePrice,
    numberOfShares,
    scenarioLabel: 'ETF dividend yield example',
    featured,
  };
}

function portfolioDividendYieldRecord(
  annualDividendPerShare: number,
  sharePrice: number,
  numberOfShares: number,
  featured = false,
): DividendYieldSeoRecord {
  const portfolioValue = sharePrice * numberOfShares;

  return {
    slug: `portfolio-dividend-yield-${portfolioValue}-portfolio-${rateSlug(annualDividendPerShare)}-annual-dividend-${sharePrice}-share-price`,
    question: `What Dividend Yield Does a ${money(portfolioValue)} Portfolio Produce if It Pays ${money(annualDividendPerShare)} per Share at ${money(sharePrice)} per Share?`,
    intent: 'portfolio-dividend-yield',
    annualDividendPerShare,
    sharePrice,
    numberOfShares,
    scenarioLabel: 'portfolio dividend yield example',
    featured,
  };
}

function monthlyIncomeDividendYieldRecord(
  annualDividendPerShare: number,
  sharePrice: number,
  numberOfShares: number,
  featured = false,
): DividendYieldSeoRecord {
  return {
    slug: `monthly-dividend-income-${numberOfShares}-shares-${rateSlug(annualDividendPerShare)}-annual-dividend-${sharePrice}-share-price`,
    question: `How Much Monthly Dividend Income Could ${numberOfShares.toLocaleString('en-US')} Shares Paying ${money(annualDividendPerShare)} per Share Generate at a ${money(sharePrice)} Share Price?`,
    intent: 'monthly-income-dividend-yield',
    annualDividendPerShare,
    sharePrice,
    numberOfShares,
    scenarioLabel: 'monthly dividend income example',
    featured,
  };
}

function retirementIncomeDividendYieldRecord(
  annualDividendPerShare: number,
  sharePrice: number,
  numberOfShares: number,
  featured = false,
): DividendYieldSeoRecord {
  return {
    slug: `retirement-dividend-yield-${numberOfShares}-shares-${rateSlug(annualDividendPerShare)}-annual-dividend-${sharePrice}-share-price`,
    question: `What Dividend Yield and Income Could Support Retirement if ${numberOfShares.toLocaleString('en-US')} Shares Pay ${money(annualDividendPerShare)} per Share at ${money(sharePrice)} per Share?`,
    intent: 'retirement-income-dividend-yield',
    annualDividendPerShare,
    sharePrice,
    numberOfShares,
    scenarioLabel: 'retirement income yield example',
    featured,
  };
}

const stockSharePrices = [20, 40, 60, 80, 100];
const stockScenarios = [
  { annualDividendPerShare: 0.6, numberOfShares: 100 },
  { annualDividendPerShare: 1.2, numberOfShares: 150 },
  { annualDividendPerShare: 2.4, numberOfShares: 200 },
  { annualDividendPerShare: 4.8, numberOfShares: 250 },
  { annualDividendPerShare: 7.2, numberOfShares: 300 },
  { annualDividendPerShare: 9.6, numberOfShares: 400 },
  { annualDividendPerShare: 12, numberOfShares: 500 },
  { annualDividendPerShare: 16, numberOfShares: 600 },
];

export const stockDividendYieldSeoRecords = stockSharePrices.flatMap(
  (sharePrice) =>
    stockScenarios.map(({ annualDividendPerShare, numberOfShares }) =>
      stockDividendYieldRecord(
        annualDividendPerShare,
        sharePrice,
        numberOfShares,
        sharePrice === 40 &&
          annualDividendPerShare === 2.4 &&
          numberOfShares === 200,
      ),
    ),
);

const etfSharePrices = [25, 50, 75, 100, 125];
const etfScenarios = [
  { annualDividendPerShare: 0.75, numberOfShares: 120 },
  { annualDividendPerShare: 1.5, numberOfShares: 180 },
  { annualDividendPerShare: 2.25, numberOfShares: 240 },
  { annualDividendPerShare: 3, numberOfShares: 300 },
  { annualDividendPerShare: 4.5, numberOfShares: 360 },
  { annualDividendPerShare: 6, numberOfShares: 420 },
  { annualDividendPerShare: 7.5, numberOfShares: 480 },
  { annualDividendPerShare: 9, numberOfShares: 540 },
];

export const etfDividendYieldSeoRecords = etfSharePrices.flatMap(
  (sharePrice) =>
    etfScenarios.map(({ annualDividendPerShare, numberOfShares }) =>
      etfDividendYieldRecord(
        annualDividendPerShare,
        sharePrice,
        numberOfShares,
        sharePrice === 50 &&
          annualDividendPerShare === 3 &&
          numberOfShares === 300,
      ),
    ),
);

const portfolioScenarios = [
  { sharePrice: 20, annualDividendPerShare: 0.8, numberOfShares: 500 },
  { sharePrice: 25, annualDividendPerShare: 1, numberOfShares: 1000 },
  { sharePrice: 40, annualDividendPerShare: 1.6, numberOfShares: 1500 },
  { sharePrice: 50, annualDividendPerShare: 2, numberOfShares: 2000 },
  { sharePrice: 60, annualDividendPerShare: 3, numberOfShares: 2500 },
  { sharePrice: 75, annualDividendPerShare: 4.5, numberOfShares: 3000 },
  { sharePrice: 80, annualDividendPerShare: 5.6, numberOfShares: 3500 },
  { sharePrice: 100, annualDividendPerShare: 7, numberOfShares: 4000 },
];

const portfolioVariants = [1, 1.25, 1.5, 1.75, 2];

export const portfolioDividendYieldSeoRecords = portfolioScenarios.flatMap(
  ({ sharePrice, annualDividendPerShare, numberOfShares }) =>
    portfolioVariants.map((variant) =>
      portfolioDividendYieldRecord(
        Number((annualDividendPerShare * variant).toFixed(2)),
        sharePrice,
        numberOfShares,
        sharePrice === 50 &&
          annualDividendPerShare === 2 &&
          numberOfShares === 2000 &&
          variant === 1.5,
      ),
    ),
);

const monthlyIncomeSharePrices = [30, 45, 60, 75, 90];
const monthlyIncomeScenarios = [
  { annualDividendPerShare: 0.9, numberOfShares: 120 },
  { annualDividendPerShare: 1.8, numberOfShares: 240 },
  { annualDividendPerShare: 3, numberOfShares: 360 },
  { annualDividendPerShare: 4.5, numberOfShares: 480 },
  { annualDividendPerShare: 6, numberOfShares: 600 },
  { annualDividendPerShare: 7.5, numberOfShares: 720 },
  { annualDividendPerShare: 9, numberOfShares: 900 },
  { annualDividendPerShare: 12, numberOfShares: 1200 },
];

export const monthlyIncomeDividendYieldSeoRecords = monthlyIncomeSharePrices.flatMap(
  (sharePrice) =>
    monthlyIncomeScenarios.map(({ annualDividendPerShare, numberOfShares }) =>
      monthlyIncomeDividendYieldRecord(
        annualDividendPerShare,
        sharePrice,
        numberOfShares,
        sharePrice === 60 &&
          annualDividendPerShare === 6 &&
          numberOfShares === 600,
      ),
    ),
);

const retirementIncomeSharePrices = [25, 40, 50, 80, 100];
const retirementIncomeScenarios = [
  { annualDividendPerShare: 1.25, numberOfShares: 2000 },
  { annualDividendPerShare: 2, numberOfShares: 2500 },
  { annualDividendPerShare: 3, numberOfShares: 3000 },
  { annualDividendPerShare: 4, numberOfShares: 3500 },
  { annualDividendPerShare: 5, numberOfShares: 4000 },
  { annualDividendPerShare: 6.5, numberOfShares: 4500 },
  { annualDividendPerShare: 8, numberOfShares: 5000 },
  { annualDividendPerShare: 10, numberOfShares: 6000 },
];

export const retirementIncomeDividendYieldSeoRecords =
  retirementIncomeSharePrices.flatMap((sharePrice) =>
    retirementIncomeScenarios.map(
      ({ annualDividendPerShare, numberOfShares }) =>
        retirementIncomeDividendYieldRecord(
          annualDividendPerShare,
          sharePrice,
          numberOfShares,
          sharePrice === 50 &&
            annualDividendPerShare === 4 &&
            numberOfShares === 3500,
        ),
    ),
  );

export const dividendYieldSeoRecords: DividendYieldSeoRecord[] = [
  ...stockDividendYieldSeoRecords,
  ...etfDividendYieldSeoRecords,
  ...portfolioDividendYieldSeoRecords,
  ...monthlyIncomeDividendYieldSeoRecords,
  ...retirementIncomeDividendYieldSeoRecords,
];
