export type DripSeoIntent =
  | 'stock-drip'
  | 'etf-drip'
  | 'portfolio-growth-drip'
  | 'dividend-snowball-drip'
  | 'retirement-income-drip';

export interface DripSeoRecord {
  slug: string;
  question: string;
  intent: DripSeoIntent;
  initialInvestment: number;
  startingShares: number;
  assumedSharePrice: number;
  annualDividendYieldPercent: number;
  annualSharePriceAppreciationPercent: number;
  annualDividendGrowthRatePercent: number;
  monthlyContribution: number;
  years: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_DRIP_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const numberSlug = (value: number) =>
  value.toString().replace('.', '-').replace(/-0$/, '');

function stockDripRecord(
  startingShares: number,
  assumedSharePrice: number,
  annualDividendYieldPercent: number,
  annualSharePriceAppreciationPercent: number,
  annualDividendGrowthRatePercent: number,
  monthlyContribution: number,
  years: number,
  featured = false,
): DripSeoRecord {
  const initialInvestment = startingShares * assumedSharePrice;

  return {
    slug: `stock-drip-${startingShares}-shares-${assumedSharePrice}-share-price-${numberSlug(annualDividendYieldPercent)}-yield-${years}-years`,
    question: `How Could ${startingShares.toLocaleString('en-US')} Stock Shares at ${money(assumedSharePrice)} With a ${annualDividendYieldPercent}% Yield Grow in a DRIP Over ${years} Years?`,
    intent: 'stock-drip',
    initialInvestment,
    startingShares,
    assumedSharePrice,
    annualDividendYieldPercent,
    annualSharePriceAppreciationPercent,
    annualDividendGrowthRatePercent,
    monthlyContribution,
    years,
    scenarioLabel: 'stock DRIP example',
    featured,
  };
}

function etfDripRecord(
  startingShares: number,
  assumedSharePrice: number,
  annualDividendYieldPercent: number,
  annualSharePriceAppreciationPercent: number,
  annualDividendGrowthRatePercent: number,
  monthlyContribution: number,
  years: number,
  featured = false,
): DripSeoRecord {
  const initialInvestment = startingShares * assumedSharePrice;

  return {
    slug: `etf-drip-${startingShares}-shares-${assumedSharePrice}-share-price-${numberSlug(annualDividendYieldPercent)}-yield-${years}-years`,
    question: `How Could ${startingShares.toLocaleString('en-US')} ETF Shares at ${money(assumedSharePrice)} With a ${annualDividendYieldPercent}% Yield Grow in a DRIP Over ${years} Years?`,
    intent: 'etf-drip',
    initialInvestment,
    startingShares,
    assumedSharePrice,
    annualDividendYieldPercent,
    annualSharePriceAppreciationPercent,
    annualDividendGrowthRatePercent,
    monthlyContribution,
    years,
    scenarioLabel: 'ETF DRIP example',
    featured,
  };
}

function portfolioGrowthDripRecord(
  initialInvestment: number,
  assumedSharePrice: number,
  annualDividendYieldPercent: number,
  annualSharePriceAppreciationPercent: number,
  annualDividendGrowthRatePercent: number,
  monthlyContribution: number,
  years: number,
  featured = false,
): DripSeoRecord {
  const startingShares = Math.round(initialInvestment / assumedSharePrice);

  return {
    slug: `portfolio-drip-${initialInvestment}-starting-${numberSlug(annualDividendYieldPercent)}-yield-${monthlyContribution}-monthly-${years}-years`,
    question: `How Could a ${money(initialInvestment)} Portfolio Grow With a ${annualDividendYieldPercent}% Yield DRIP Over ${years} Years?`,
    intent: 'portfolio-growth-drip',
    initialInvestment,
    startingShares,
    assumedSharePrice,
    annualDividendYieldPercent,
    annualSharePriceAppreciationPercent,
    annualDividendGrowthRatePercent,
    monthlyContribution,
    years,
    scenarioLabel: 'portfolio growth DRIP example',
    featured,
  };
}

function dividendSnowballDripRecord(
  startingShares: number,
  assumedSharePrice: number,
  annualDividendYieldPercent: number,
  annualSharePriceAppreciationPercent: number,
  annualDividendGrowthRatePercent: number,
  monthlyContribution: number,
  years: number,
  featured = false,
): DripSeoRecord {
  const initialInvestment = startingShares * assumedSharePrice;

  return {
    slug: `dividend-snowball-${startingShares}-shares-${assumedSharePrice}-share-price-${numberSlug(annualDividendYieldPercent)}-yield-${years}-years`,
    question: `How Could Reinvesting Dividends Turn ${startingShares.toLocaleString('en-US')} Shares at ${money(assumedSharePrice)} Into a Dividend Snowball Over ${years} Years?`,
    intent: 'dividend-snowball-drip',
    initialInvestment,
    startingShares,
    assumedSharePrice,
    annualDividendYieldPercent,
    annualSharePriceAppreciationPercent,
    annualDividendGrowthRatePercent,
    monthlyContribution,
    years,
    scenarioLabel: 'dividend snowball DRIP example',
    featured,
  };
}

function retirementIncomeDripRecord(
  initialInvestment: number,
  assumedSharePrice: number,
  annualDividendYieldPercent: number,
  annualSharePriceAppreciationPercent: number,
  annualDividendGrowthRatePercent: number,
  monthlyContribution: number,
  years: number,
  featured = false,
): DripSeoRecord {
  const startingShares = Math.round(initialInvestment / assumedSharePrice);

  return {
    slug: `retirement-drip-${initialInvestment}-starting-${numberSlug(annualDividendYieldPercent)}-yield-${years}-years`,
    question: `How Could a ${money(initialInvestment)} Retirement Portfolio Using a ${annualDividendYieldPercent}% Yield DRIP Grow Over ${years} Years?`,
    intent: 'retirement-income-drip',
    initialInvestment,
    startingShares,
    assumedSharePrice,
    annualDividendYieldPercent,
    annualSharePriceAppreciationPercent,
    annualDividendGrowthRatePercent,
    monthlyContribution,
    years,
    scenarioLabel: 'retirement DRIP example',
    featured,
  };
}

const stockSharePrices = [25, 50, 75, 100, 150];
const stockScenarios = [
  { startingShares: 100, annualDividendYieldPercent: 2.5, annualSharePriceAppreciationPercent: 4, annualDividendGrowthRatePercent: 2, monthlyContribution: 100, years: 10 },
  { startingShares: 150, annualDividendYieldPercent: 3, annualSharePriceAppreciationPercent: 5, annualDividendGrowthRatePercent: 3, monthlyContribution: 150, years: 12 },
  { startingShares: 200, annualDividendYieldPercent: 3.5, annualSharePriceAppreciationPercent: 5, annualDividendGrowthRatePercent: 4, monthlyContribution: 200, years: 15 },
  { startingShares: 250, annualDividendYieldPercent: 4, annualSharePriceAppreciationPercent: 6, annualDividendGrowthRatePercent: 4, monthlyContribution: 250, years: 18 },
  { startingShares: 300, annualDividendYieldPercent: 4.5, annualSharePriceAppreciationPercent: 6, annualDividendGrowthRatePercent: 5, monthlyContribution: 300, years: 20 },
  { startingShares: 350, annualDividendYieldPercent: 5, annualSharePriceAppreciationPercent: 7, annualDividendGrowthRatePercent: 5, monthlyContribution: 350, years: 22 },
  { startingShares: 400, annualDividendYieldPercent: 5.5, annualSharePriceAppreciationPercent: 7, annualDividendGrowthRatePercent: 6, monthlyContribution: 400, years: 25 },
  { startingShares: 500, annualDividendYieldPercent: 6, annualSharePriceAppreciationPercent: 8, annualDividendGrowthRatePercent: 6, monthlyContribution: 500, years: 30 },
];

export const stockDripSeoRecords = stockSharePrices.flatMap(
  (assumedSharePrice) =>
    stockScenarios.map((scenario) =>
      stockDripRecord(
        scenario.startingShares,
        assumedSharePrice,
        scenario.annualDividendYieldPercent,
        scenario.annualSharePriceAppreciationPercent,
        scenario.annualDividendGrowthRatePercent,
        scenario.monthlyContribution,
        scenario.years,
        assumedSharePrice === 50 &&
          scenario.startingShares === 200 &&
          scenario.annualDividendYieldPercent === 3.5,
      ),
    ),
);

const etfSharePrices = [20, 35, 50, 75, 100];
const etfScenarios = [
  { startingShares: 150, annualDividendYieldPercent: 2.8, annualSharePriceAppreciationPercent: 4, annualDividendGrowthRatePercent: 2, monthlyContribution: 150, years: 10 },
  { startingShares: 200, annualDividendYieldPercent: 3.2, annualSharePriceAppreciationPercent: 4.5, annualDividendGrowthRatePercent: 2.5, monthlyContribution: 200, years: 12 },
  { startingShares: 250, annualDividendYieldPercent: 3.6, annualSharePriceAppreciationPercent: 5, annualDividendGrowthRatePercent: 3, monthlyContribution: 250, years: 15 },
  { startingShares: 300, annualDividendYieldPercent: 4, annualSharePriceAppreciationPercent: 5.5, annualDividendGrowthRatePercent: 3, monthlyContribution: 300, years: 18 },
  { startingShares: 400, annualDividendYieldPercent: 4.2, annualSharePriceAppreciationPercent: 5.5, annualDividendGrowthRatePercent: 3.5, monthlyContribution: 350, years: 20 },
  { startingShares: 500, annualDividendYieldPercent: 4.5, annualSharePriceAppreciationPercent: 6, annualDividendGrowthRatePercent: 4, monthlyContribution: 400, years: 22 },
  { startingShares: 600, annualDividendYieldPercent: 4.8, annualSharePriceAppreciationPercent: 6.5, annualDividendGrowthRatePercent: 4, monthlyContribution: 500, years: 25 },
  { startingShares: 750, annualDividendYieldPercent: 5.2, annualSharePriceAppreciationPercent: 7, annualDividendGrowthRatePercent: 4.5, monthlyContribution: 600, years: 30 },
];

export const etfDripSeoRecords = etfSharePrices.flatMap((assumedSharePrice) =>
  etfScenarios.map((scenario) =>
    etfDripRecord(
      scenario.startingShares,
      assumedSharePrice,
      scenario.annualDividendYieldPercent,
      scenario.annualSharePriceAppreciationPercent,
      scenario.annualDividendGrowthRatePercent,
      scenario.monthlyContribution,
      scenario.years,
      assumedSharePrice === 50 &&
        scenario.startingShares === 300 &&
        scenario.annualDividendYieldPercent === 4,
    ),
  ),
);

const portfolioInitialInvestments = [10000, 25000, 50000, 100000, 250000];
const portfolioScenarios = [
  { assumedSharePrice: 25, annualDividendYieldPercent: 2.5, annualSharePriceAppreciationPercent: 4, annualDividendGrowthRatePercent: 2, monthlyContribution: 100, years: 10 },
  { assumedSharePrice: 40, annualDividendYieldPercent: 3, annualSharePriceAppreciationPercent: 4.5, annualDividendGrowthRatePercent: 2.5, monthlyContribution: 250, years: 12 },
  { assumedSharePrice: 50, annualDividendYieldPercent: 3.5, annualSharePriceAppreciationPercent: 5, annualDividendGrowthRatePercent: 3, monthlyContribution: 500, years: 15 },
  { assumedSharePrice: 60, annualDividendYieldPercent: 4, annualSharePriceAppreciationPercent: 5.5, annualDividendGrowthRatePercent: 3.5, monthlyContribution: 750, years: 18 },
  { assumedSharePrice: 75, annualDividendYieldPercent: 4.5, annualSharePriceAppreciationPercent: 6, annualDividendGrowthRatePercent: 4, monthlyContribution: 1000, years: 20 },
  { assumedSharePrice: 90, annualDividendYieldPercent: 5, annualSharePriceAppreciationPercent: 6.5, annualDividendGrowthRatePercent: 4, monthlyContribution: 1250, years: 22 },
  { assumedSharePrice: 100, annualDividendYieldPercent: 5.5, annualSharePriceAppreciationPercent: 7, annualDividendGrowthRatePercent: 4.5, monthlyContribution: 1500, years: 25 },
  { assumedSharePrice: 125, annualDividendYieldPercent: 6, annualSharePriceAppreciationPercent: 7.5, annualDividendGrowthRatePercent: 5, monthlyContribution: 2000, years: 30 },
];

export const portfolioGrowthDripSeoRecords = portfolioInitialInvestments.flatMap(
  (initialInvestment) =>
    portfolioScenarios.map((scenario) =>
      portfolioGrowthDripRecord(
        initialInvestment,
        scenario.assumedSharePrice,
        scenario.annualDividendYieldPercent,
        scenario.annualSharePriceAppreciationPercent,
        scenario.annualDividendGrowthRatePercent,
        scenario.monthlyContribution,
        scenario.years,
        initialInvestment === 50000 &&
          scenario.assumedSharePrice === 50 &&
          scenario.annualDividendYieldPercent === 3.5,
      ),
    ),
);

const snowballSharePrices = [20, 35, 50, 75, 100];
const snowballScenarios = [
  { startingShares: 120, annualDividendYieldPercent: 3, annualSharePriceAppreciationPercent: 5, annualDividendGrowthRatePercent: 4, monthlyContribution: 150, years: 12 },
  { startingShares: 160, annualDividendYieldPercent: 3.5, annualSharePriceAppreciationPercent: 5.5, annualDividendGrowthRatePercent: 4.5, monthlyContribution: 200, years: 15 },
  { startingShares: 200, annualDividendYieldPercent: 4, annualSharePriceAppreciationPercent: 6, annualDividendGrowthRatePercent: 5, monthlyContribution: 250, years: 18 },
  { startingShares: 240, annualDividendYieldPercent: 4.5, annualSharePriceAppreciationPercent: 6.5, annualDividendGrowthRatePercent: 5.5, monthlyContribution: 300, years: 20 },
  { startingShares: 300, annualDividendYieldPercent: 5, annualSharePriceAppreciationPercent: 7, annualDividendGrowthRatePercent: 6, monthlyContribution: 350, years: 22 },
  { startingShares: 360, annualDividendYieldPercent: 5.5, annualSharePriceAppreciationPercent: 7, annualDividendGrowthRatePercent: 6.5, monthlyContribution: 400, years: 25 },
  { startingShares: 450, annualDividendYieldPercent: 6, annualSharePriceAppreciationPercent: 7.5, annualDividendGrowthRatePercent: 7, monthlyContribution: 500, years: 28 },
  { startingShares: 600, annualDividendYieldPercent: 6.5, annualSharePriceAppreciationPercent: 8, annualDividendGrowthRatePercent: 7.5, monthlyContribution: 600, years: 30 },
];

export const dividendSnowballDripSeoRecords = snowballSharePrices.flatMap(
  (assumedSharePrice) =>
    snowballScenarios.map((scenario) =>
      dividendSnowballDripRecord(
        scenario.startingShares,
        assumedSharePrice,
        scenario.annualDividendYieldPercent,
        scenario.annualSharePriceAppreciationPercent,
        scenario.annualDividendGrowthRatePercent,
        scenario.monthlyContribution,
        scenario.years,
        assumedSharePrice === 50 &&
          scenario.startingShares === 200 &&
          scenario.annualDividendYieldPercent === 4,
      ),
    ),
);

const retirementInitialInvestments = [100000, 250000, 500000, 750000, 1000000];
const retirementScenarios = [
  { assumedSharePrice: 25, annualDividendYieldPercent: 3, annualSharePriceAppreciationPercent: 3, annualDividendGrowthRatePercent: 2, monthlyContribution: 0, years: 10 },
  { assumedSharePrice: 40, annualDividendYieldPercent: 3.5, annualSharePriceAppreciationPercent: 3.5, annualDividendGrowthRatePercent: 2, monthlyContribution: 250, years: 12 },
  { assumedSharePrice: 50, annualDividendYieldPercent: 4, annualSharePriceAppreciationPercent: 4, annualDividendGrowthRatePercent: 2.5, monthlyContribution: 500, years: 15 },
  { assumedSharePrice: 60, annualDividendYieldPercent: 4.5, annualSharePriceAppreciationPercent: 4.5, annualDividendGrowthRatePercent: 3, monthlyContribution: 750, years: 18 },
  { assumedSharePrice: 75, annualDividendYieldPercent: 5, annualSharePriceAppreciationPercent: 5, annualDividendGrowthRatePercent: 3, monthlyContribution: 1000, years: 20 },
  { assumedSharePrice: 90, annualDividendYieldPercent: 5.25, annualSharePriceAppreciationPercent: 5.5, annualDividendGrowthRatePercent: 3.5, monthlyContribution: 1250, years: 22 },
  { assumedSharePrice: 100, annualDividendYieldPercent: 5.5, annualSharePriceAppreciationPercent: 6, annualDividendGrowthRatePercent: 4, monthlyContribution: 1500, years: 25 },
  { assumedSharePrice: 125, annualDividendYieldPercent: 6, annualSharePriceAppreciationPercent: 6, annualDividendGrowthRatePercent: 4, monthlyContribution: 2000, years: 30 },
];

export const retirementIncomeDripSeoRecords = retirementInitialInvestments.flatMap(
  (initialInvestment) =>
    retirementScenarios.map((scenario) =>
      retirementIncomeDripRecord(
        initialInvestment,
        scenario.assumedSharePrice,
        scenario.annualDividendYieldPercent,
        scenario.annualSharePriceAppreciationPercent,
        scenario.annualDividendGrowthRatePercent,
        scenario.monthlyContribution,
        scenario.years,
        initialInvestment === 500000 &&
          scenario.assumedSharePrice === 50 &&
          scenario.annualDividendYieldPercent === 4,
      ),
    ),
);

export const dripSeoRecords: DripSeoRecord[] = [
  ...stockDripSeoRecords,
  ...etfDripSeoRecords,
  ...portfolioGrowthDripSeoRecords,
  ...dividendSnowballDripSeoRecords,
  ...retirementIncomeDripSeoRecords,
];

export const featuredDripSeoRecords = dripSeoRecords.filter((record) =>
  [
    'stock-drip-300-shares-75-share-price-4-5-yield-20-years',
    'etf-drip-400-shares-50-share-price-4-2-yield-20-years',
    'portfolio-drip-50000-starting-4-5-yield-1000-monthly-20-years',
    'dividend-snowball-300-shares-50-share-price-5-yield-22-years',
    'retirement-drip-500000-starting-5-yield-20-years',
  ].includes(record.slug),
);
