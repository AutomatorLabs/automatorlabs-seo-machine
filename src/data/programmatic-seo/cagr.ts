export type CagrSeoIntent =
  | 'stocks'
  | 'etfs'
  | 'index-funds'
  | 'real-estate'
  | 'cryptocurrency'
  | 'business-growth'
  | 'revenue-growth'
  | 'portfolio-growth';

export interface CagrSeoRecord {
  slug: string;
  question: string;
  intent: CagrSeoIntent;
  startingValue: number;
  endingValue: number;
  years: number;
  assetLabel: string;
  featured?: boolean;
}

export const EXPECTED_CAGR_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function createStocksRecord(
  startingValue: number,
  endingValue: number,
  years: number,
  featured = false,
): CagrSeoRecord {
  return {
    slug: `stock-cagr-${startingValue}-to-${endingValue}-over-${years}-years`,
    question: `What Was the CAGR of a Stock Position Growing From ${money(startingValue)} to ${money(endingValue)} in ${years} Years?`,
    intent: 'stocks',
    startingValue,
    endingValue,
    years,
    assetLabel: 'stock position',
    featured,
  };
}

function createEtfRecord(
  startingValue: number,
  endingValue: number,
  years: number,
  featured = false,
): CagrSeoRecord {
  return {
    slug: `etf-cagr-${startingValue}-to-${endingValue}-over-${years}-years`,
    question: `What CAGR Takes an ETF Investment From ${money(startingValue)} to ${money(endingValue)} Over ${years} Years?`,
    intent: 'etfs',
    startingValue,
    endingValue,
    years,
    assetLabel: 'ETF investment',
    featured,
  };
}

function createIndexFundRecord(
  startingValue: number,
  endingValue: number,
  years: number,
  featured = false,
): CagrSeoRecord {
  return {
    slug: `index-fund-cagr-${startingValue}-to-${endingValue}-over-${years}-years`,
    question: `What Was the CAGR of an Index Fund Growing From ${money(startingValue)} to ${money(endingValue)} in ${years} Years?`,
    intent: 'index-funds',
    startingValue,
    endingValue,
    years,
    assetLabel: 'index fund investment',
    featured,
  };
}

function createRealEstateRecord(
  startingValue: number,
  endingValue: number,
  years: number,
  featured = false,
): CagrSeoRecord {
  return {
    slug: `real-estate-cagr-${startingValue}-to-${endingValue}-over-${years}-years`,
    question: `What Was the CAGR of a Real Estate Investment Rising From ${money(startingValue)} to ${money(endingValue)} in ${years} Years?`,
    intent: 'real-estate',
    startingValue,
    endingValue,
    years,
    assetLabel: 'real estate investment',
    featured,
  };
}

function createCryptocurrencyRecord(
  startingValue: number,
  endingValue: number,
  years: number,
  featured = false,
): CagrSeoRecord {
  return {
    slug: `crypto-cagr-${startingValue}-to-${endingValue}-over-${years}-years`,
    question: `What CAGR Turns a Cryptocurrency Position From ${money(startingValue)} Into ${money(endingValue)} Over ${years} Years?`,
    intent: 'cryptocurrency',
    startingValue,
    endingValue,
    years,
    assetLabel: 'cryptocurrency position',
    featured,
  };
}

function createBusinessGrowthRecord(
  startingValue: number,
  endingValue: number,
  years: number,
  featured = false,
): CagrSeoRecord {
  return {
    slug: `business-growth-cagr-${startingValue}-to-${endingValue}-over-${years}-years`,
    question: `What Was the CAGR of a Business Growing From ${money(startingValue)} to ${money(endingValue)} in ${years} Years?`,
    intent: 'business-growth',
    startingValue,
    endingValue,
    years,
    assetLabel: 'business value',
    featured,
  };
}

function createRevenueGrowthRecord(
  startingValue: number,
  endingValue: number,
  years: number,
  featured = false,
): CagrSeoRecord {
  return {
    slug: `revenue-cagr-${startingValue}-to-${endingValue}-over-${years}-years`,
    question: `What Was the CAGR of Revenue Growing From ${money(startingValue)} to ${money(endingValue)} in ${years} Years?`,
    intent: 'revenue-growth',
    startingValue,
    endingValue,
    years,
    assetLabel: 'annual revenue',
    featured,
  };
}

function createPortfolioGrowthRecord(
  startingValue: number,
  endingValue: number,
  years: number,
  featured = false,
): CagrSeoRecord {
  return {
    slug: `portfolio-cagr-${startingValue}-to-${endingValue}-over-${years}-years`,
    question: `What Was the CAGR of a Portfolio Growing From ${money(startingValue)} to ${money(endingValue)} in ${years} Years?`,
    intent: 'portfolio-growth',
    startingValue,
    endingValue,
    years,
    assetLabel: 'investment portfolio',
    featured,
  };
}

const stockValuePairs = [
  { startingValue: 5000, endingValue: 7500 },
  { startingValue: 10000, endingValue: 18000 },
  { startingValue: 15000, endingValue: 27000 },
  { startingValue: 25000, endingValue: 52000 },
  { startingValue: 50000, endingValue: 120000 },
];
const stockPeriods = [3, 5, 7, 10, 15];

export const stockCagrSeoRecords = stockValuePairs.flatMap(
  ({ startingValue, endingValue }) =>
    stockPeriods.map((years) =>
      createStocksRecord(
        startingValue,
        endingValue,
        years,
        startingValue === 10000 && endingValue === 18000 && years === 5,
      ),
    ),
);

const etfValuePairs = [
  { startingValue: 10000, endingValue: 14500 },
  { startingValue: 20000, endingValue: 32000 },
  { startingValue: 30000, endingValue: 48000 },
  { startingValue: 50000, endingValue: 90000 },
  { startingValue: 80000, endingValue: 150000 },
];
const etfPeriods = [4, 6, 8, 12, 16];

export const etfCagrSeoRecords = etfValuePairs.flatMap(
  ({ startingValue, endingValue }) =>
    etfPeriods.map((years) =>
      createEtfRecord(
        startingValue,
        endingValue,
        years,
        startingValue === 50000 && endingValue === 90000 && years === 12,
      ),
    ),
);

const indexFundValuePairs = [
  { startingValue: 5000, endingValue: 9000 },
  { startingValue: 15000, endingValue: 28000 },
  { startingValue: 25000, endingValue: 45000 },
  { startingValue: 40000, endingValue: 82000 },
  { startingValue: 75000, endingValue: 160000 },
];
const indexFundPeriods = [5, 10, 15, 20, 25];

export const indexFundCagrSeoRecords = indexFundValuePairs.flatMap(
  ({ startingValue, endingValue }) =>
    indexFundPeriods.map((years) =>
      createIndexFundRecord(
        startingValue,
        endingValue,
        years,
        startingValue === 25000 && endingValue === 45000 && years === 15,
      ),
    ),
);

const realEstateValuePairs = [
  { startingValue: 150000, endingValue: 210000 },
  { startingValue: 220000, endingValue: 320000 },
  { startingValue: 300000, endingValue: 480000 },
  { startingValue: 450000, endingValue: 700000 },
  { startingValue: 600000, endingValue: 980000 },
];
const realEstatePeriods = [3, 7, 10, 15, 20];

export const realEstateCagrSeoRecords = realEstateValuePairs.flatMap(
  ({ startingValue, endingValue }) =>
    realEstatePeriods.map((years) =>
      createRealEstateRecord(
        startingValue,
        endingValue,
        years,
        startingValue === 300000 && endingValue === 480000 && years === 10,
      ),
    ),
);

const cryptocurrencyValuePairs = [
  { startingValue: 2000, endingValue: 8000 },
  { startingValue: 5000, endingValue: 30000 },
  { startingValue: 10000, endingValue: 45000 },
  { startingValue: 15000, endingValue: 90000 },
  { startingValue: 25000, endingValue: 200000 },
];
const cryptocurrencyPeriods = [2, 3, 5, 7, 10];

export const cryptocurrencyCagrSeoRecords = cryptocurrencyValuePairs.flatMap(
  ({ startingValue, endingValue }) =>
    cryptocurrencyPeriods.map((years) =>
      createCryptocurrencyRecord(
        startingValue,
        endingValue,
        years,
        startingValue === 5000 && endingValue === 30000 && years === 5,
      ),
    ),
);

const businessGrowthValuePairs = [
  { startingValue: 100000, endingValue: 160000 },
  { startingValue: 250000, endingValue: 420000 },
  { startingValue: 500000, endingValue: 900000 },
  { startingValue: 1000000, endingValue: 1800000 },
  { startingValue: 2000000, endingValue: 3800000 },
];
const businessGrowthPeriods = [3, 5, 7, 10, 12];

export const businessGrowthCagrSeoRecords = businessGrowthValuePairs.flatMap(
  ({ startingValue, endingValue }) =>
    businessGrowthPeriods.map((years) =>
      createBusinessGrowthRecord(
        startingValue,
        endingValue,
        years,
        startingValue === 500000 && endingValue === 900000 && years === 7,
      ),
    ),
);

const revenueGrowthValuePairs = [
  { startingValue: 500000, endingValue: 900000 },
  { startingValue: 1000000, endingValue: 1800000 },
  { startingValue: 2500000, endingValue: 4300000 },
  { startingValue: 5000000, endingValue: 9000000 },
  { startingValue: 10000000, endingValue: 19000000 },
];
const revenueGrowthPeriods = [2, 4, 6, 8, 10];

export const revenueGrowthCagrSeoRecords = revenueGrowthValuePairs.flatMap(
  ({ startingValue, endingValue }) =>
    revenueGrowthPeriods.map((years) =>
      createRevenueGrowthRecord(
        startingValue,
        endingValue,
        years,
        startingValue === 1000000 &&
          endingValue === 1800000 &&
          years === 4,
      ),
    ),
);

const portfolioGrowthValuePairs = [
  { startingValue: 50000, endingValue: 85000 },
  { startingValue: 100000, endingValue: 170000 },
  { startingValue: 250000, endingValue: 430000 },
  { startingValue: 500000, endingValue: 900000 },
  { startingValue: 1000000, endingValue: 1900000 },
];
const portfolioGrowthPeriods = [4, 8, 12, 16, 20];

export const portfolioGrowthCagrSeoRecords = portfolioGrowthValuePairs.flatMap(
  ({ startingValue, endingValue }) =>
    portfolioGrowthPeriods.map((years) =>
      createPortfolioGrowthRecord(
        startingValue,
        endingValue,
        years,
        startingValue === 250000 && endingValue === 430000 && years === 12,
      ),
    ),
);

export const cagrSeoRecords: CagrSeoRecord[] = [
  ...stockCagrSeoRecords,
  ...etfCagrSeoRecords,
  ...indexFundCagrSeoRecords,
  ...realEstateCagrSeoRecords,
  ...cryptocurrencyCagrSeoRecords,
  ...businessGrowthCagrSeoRecords,
  ...revenueGrowthCagrSeoRecords,
  ...portfolioGrowthCagrSeoRecords,
];

export const featuredCagrSeoRecords = cagrSeoRecords.filter(
  (record) => record.featured,
);
