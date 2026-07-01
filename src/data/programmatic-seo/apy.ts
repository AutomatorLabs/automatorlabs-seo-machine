export type ApySeoIntent =
  | 'savings-account'
  | 'high-yield-savings'
  | 'certificate-of-deposit'
  | 'money-market'
  | 'checking-account'
  | 'monthly-compounding'
  | 'daily-compounding'
  | 'stated-rate-comparison';

export interface ApySeoRecord {
  slug: string;
  question: string;
  intent: ApySeoIntent;
  nominalRatePercent: number;
  periodsPerYear: number;
  startingBalance: number;
  accountLabel: string;
  frequencyLabel: string;
  featured?: boolean;
}

export const EXPECTED_APY_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const formatRate = (rate: number) => rate.toLocaleString('en-US');
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');
const capitalizeWords = (value: string) =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());

function frequencySlug(periodsPerYear: number): string {
  switch (periodsPerYear) {
    case 365:
      return 'daily';
    case 12:
      return 'monthly';
    case 4:
      return 'quarterly';
    case 1:
      return 'annual';
    default:
      return `${periodsPerYear}-times`;
  }
}

function frequencyLabel(periodsPerYear: number): string {
  switch (periodsPerYear) {
    case 365:
      return 'daily compounding';
    case 12:
      return 'monthly compounding';
    case 4:
      return 'quarterly compounding';
    case 1:
      return 'annual compounding';
    default:
      return `${periodsPerYear} times per year`;
  }
}

function createSavingsAccountRecord(
  startingBalance: number,
  nominalRatePercent: number,
  periodsPerYear: number,
  featured = false,
): ApySeoRecord {
  return {
    slug: `savings-apy-${startingBalance}-at-${rateSlug(nominalRatePercent)}-percent-${frequencySlug(periodsPerYear)}`,
    question: `What APY Does a Savings Account Paying ${formatRate(nominalRatePercent)}% With ${capitalizeWords(frequencyLabel(periodsPerYear))} Produce on ${money(startingBalance)}?`,
    intent: 'savings-account',
    nominalRatePercent,
    periodsPerYear,
    startingBalance,
    accountLabel: 'savings account',
    frequencyLabel: frequencyLabel(periodsPerYear),
    featured,
  };
}

function createHighYieldSavingsRecord(
  startingBalance: number,
  nominalRatePercent: number,
  periodsPerYear: number,
  featured = false,
): ApySeoRecord {
  return {
    slug: `high-yield-savings-apy-${startingBalance}-at-${rateSlug(nominalRatePercent)}-percent-${frequencySlug(periodsPerYear)}`,
    question: `What APY Does a High-Yield Savings Account Paying ${formatRate(nominalRatePercent)}% With ${capitalizeWords(frequencyLabel(periodsPerYear))} Produce on ${money(startingBalance)}?`,
    intent: 'high-yield-savings',
    nominalRatePercent,
    periodsPerYear,
    startingBalance,
    accountLabel: 'high-yield savings account',
    frequencyLabel: frequencyLabel(periodsPerYear),
    featured,
  };
}

function createCdRecord(
  startingBalance: number,
  nominalRatePercent: number,
  periodsPerYear: number,
  featured = false,
): ApySeoRecord {
  return {
    slug: `cd-apy-${startingBalance}-at-${rateSlug(nominalRatePercent)}-percent-${frequencySlug(periodsPerYear)}`,
    question: `What APY Does a CD Paying ${formatRate(nominalRatePercent)}% With ${capitalizeWords(frequencyLabel(periodsPerYear))} Produce on ${money(startingBalance)}?`,
    intent: 'certificate-of-deposit',
    nominalRatePercent,
    periodsPerYear,
    startingBalance,
    accountLabel: 'certificate of deposit',
    frequencyLabel: frequencyLabel(periodsPerYear),
    featured,
  };
}

function createMoneyMarketRecord(
  startingBalance: number,
  nominalRatePercent: number,
  periodsPerYear: number,
  featured = false,
): ApySeoRecord {
  return {
    slug: `money-market-apy-${startingBalance}-at-${rateSlug(nominalRatePercent)}-percent-${frequencySlug(periodsPerYear)}`,
    question: `What APY Does a Money Market Account Paying ${formatRate(nominalRatePercent)}% With ${capitalizeWords(frequencyLabel(periodsPerYear))} Produce on ${money(startingBalance)}?`,
    intent: 'money-market',
    nominalRatePercent,
    periodsPerYear,
    startingBalance,
    accountLabel: 'money market account',
    frequencyLabel: frequencyLabel(periodsPerYear),
    featured,
  };
}

function createCheckingRecord(
  startingBalance: number,
  nominalRatePercent: number,
  periodsPerYear: number,
  featured = false,
): ApySeoRecord {
  return {
    slug: `checking-apy-${startingBalance}-at-${rateSlug(nominalRatePercent)}-percent-${frequencySlug(periodsPerYear)}`,
    question: `What APY Does an Interest Checking Account Paying ${formatRate(nominalRatePercent)}% With ${capitalizeWords(frequencyLabel(periodsPerYear))} Produce on ${money(startingBalance)}?`,
    intent: 'checking-account',
    nominalRatePercent,
    periodsPerYear,
    startingBalance,
    accountLabel: 'interest checking account',
    frequencyLabel: frequencyLabel(periodsPerYear),
    featured,
  };
}

function createMonthlyCompoundingRecord(
  startingBalance: number,
  nominalRatePercent: number,
  featured = false,
): ApySeoRecord {
  return {
    slug: `monthly-compounding-apy-${startingBalance}-at-${rateSlug(nominalRatePercent)}-percent`,
    question: `What APY Does ${formatRate(nominalRatePercent)}% Nominal Interest With Monthly Compounding Produce on ${money(startingBalance)}?`,
    intent: 'monthly-compounding',
    nominalRatePercent,
    periodsPerYear: 12,
    startingBalance,
    accountLabel: 'monthly compounding example',
    frequencyLabel: 'monthly compounding',
    featured,
  };
}

function createDailyCompoundingRecord(
  startingBalance: number,
  nominalRatePercent: number,
  featured = false,
): ApySeoRecord {
  return {
    slug: `daily-compounding-apy-${startingBalance}-at-${rateSlug(nominalRatePercent)}-percent`,
    question: `What APY Does ${formatRate(nominalRatePercent)}% Nominal Interest With Daily Compounding Produce on ${money(startingBalance)}?`,
    intent: 'daily-compounding',
    nominalRatePercent,
    periodsPerYear: 365,
    startingBalance,
    accountLabel: 'daily compounding example',
    frequencyLabel: 'daily compounding',
    featured,
  };
}

function createStatedRateComparisonRecord(
  startingBalance: number,
  nominalRatePercent: number,
  periodsPerYear: number,
  featured = false,
): ApySeoRecord {
  return {
    slug: `stated-rate-vs-apy-${startingBalance}-at-${rateSlug(nominalRatePercent)}-percent-${frequencySlug(periodsPerYear)}`,
    question: `If a Bank States ${formatRate(nominalRatePercent)}% Annual Interest With ${capitalizeWords(frequencyLabel(periodsPerYear))}, What APY Does ${money(startingBalance)} Actually Earn?`,
    intent: 'stated-rate-comparison',
    nominalRatePercent,
    periodsPerYear,
    startingBalance,
    accountLabel: 'stated-rate versus APY comparison',
    frequencyLabel: frequencyLabel(periodsPerYear),
    featured,
  };
}

const balances = [1000, 5000, 10000, 25000, 50000];
const savingsScenarios = [
  { nominalRatePercent: 1.5, periodsPerYear: 1 },
  { nominalRatePercent: 2.25, periodsPerYear: 4 },
  { nominalRatePercent: 3.0, periodsPerYear: 12 },
  { nominalRatePercent: 3.75, periodsPerYear: 365 },
  { nominalRatePercent: 4.1, periodsPerYear: 12 },
];
const highYieldScenarios = [
  { nominalRatePercent: 3.8, periodsPerYear: 4 },
  { nominalRatePercent: 4.15, periodsPerYear: 12 },
  { nominalRatePercent: 4.35, periodsPerYear: 365 },
  { nominalRatePercent: 4.55, periodsPerYear: 12 },
  { nominalRatePercent: 4.75, periodsPerYear: 365 },
];
const cdScenarios = [
  { nominalRatePercent: 3.9, periodsPerYear: 1 },
  { nominalRatePercent: 4.2, periodsPerYear: 4 },
  { nominalRatePercent: 4.45, periodsPerYear: 12 },
  { nominalRatePercent: 4.7, periodsPerYear: 12 },
  { nominalRatePercent: 5.0, periodsPerYear: 1 },
];
const moneyMarketScenarios = [
  { nominalRatePercent: 2.0, periodsPerYear: 4 },
  { nominalRatePercent: 2.75, periodsPerYear: 12 },
  { nominalRatePercent: 3.4, periodsPerYear: 12 },
  { nominalRatePercent: 4.0, periodsPerYear: 365 },
  { nominalRatePercent: 4.35, periodsPerYear: 12 },
];
const checkingScenarios = [
  { nominalRatePercent: 0.1, periodsPerYear: 1 },
  { nominalRatePercent: 0.35, periodsPerYear: 4 },
  { nominalRatePercent: 0.6, periodsPerYear: 12 },
  { nominalRatePercent: 1.0, periodsPerYear: 12 },
  { nominalRatePercent: 1.25, periodsPerYear: 365 },
];
const monthlyRates = [1.0, 2.5, 3.75, 4.5, 5.25];
const dailyRates = [1.0, 2.5, 3.75, 4.5, 5.25];
const statedRateScenarios = [
  { nominalRatePercent: 1.25, periodsPerYear: 1 },
  { nominalRatePercent: 2.8, periodsPerYear: 4 },
  { nominalRatePercent: 4.0, periodsPerYear: 12 },
  { nominalRatePercent: 4.85, periodsPerYear: 365 },
  { nominalRatePercent: 5.25, periodsPerYear: 12 },
];

export const savingsAccountApySeoRecords = balances.flatMap((startingBalance) =>
  savingsScenarios.map(({ nominalRatePercent, periodsPerYear }) =>
    createSavingsAccountRecord(
      startingBalance,
      nominalRatePercent,
      periodsPerYear,
      startingBalance === 10000 &&
        nominalRatePercent === 4.1 &&
        periodsPerYear === 12,
    ),
  ),
);

export const highYieldSavingsApySeoRecords = balances.flatMap(
  (startingBalance) =>
    highYieldScenarios.map(({ nominalRatePercent, periodsPerYear }) =>
      createHighYieldSavingsRecord(
        startingBalance,
        nominalRatePercent,
        periodsPerYear,
        startingBalance === 25000 &&
          nominalRatePercent === 4.35 &&
          periodsPerYear === 365,
      ),
    ),
);

export const cdApySeoRecords = balances.flatMap((startingBalance) =>
  cdScenarios.map(({ nominalRatePercent, periodsPerYear }) =>
    createCdRecord(
      startingBalance,
      nominalRatePercent,
      periodsPerYear,
      startingBalance === 10000 &&
        nominalRatePercent === 5 &&
        periodsPerYear === 1,
    ),
  ),
);

export const moneyMarketApySeoRecords = balances.flatMap((startingBalance) =>
  moneyMarketScenarios.map(({ nominalRatePercent, periodsPerYear }) =>
    createMoneyMarketRecord(
      startingBalance,
      nominalRatePercent,
      periodsPerYear,
      startingBalance === 5000 &&
        nominalRatePercent === 4 &&
        periodsPerYear === 365,
    ),
  ),
);

export const checkingApySeoRecords = balances.flatMap((startingBalance) =>
  checkingScenarios.map(({ nominalRatePercent, periodsPerYear }) =>
    createCheckingRecord(startingBalance, nominalRatePercent, periodsPerYear),
  ),
);

export const monthlyCompoundingApySeoRecords = balances.flatMap(
  (startingBalance) =>
    monthlyRates.map((nominalRatePercent) =>
      createMonthlyCompoundingRecord(
        startingBalance,
        nominalRatePercent,
        startingBalance === 10000 && nominalRatePercent === 5.25,
      ),
    ),
);

export const dailyCompoundingApySeoRecords = balances.flatMap(
  (startingBalance) =>
    dailyRates.map((nominalRatePercent) =>
      createDailyCompoundingRecord(
        startingBalance,
        nominalRatePercent,
        startingBalance === 10000 && nominalRatePercent === 5.25,
      ),
    ),
);

export const statedRateComparisonApySeoRecords = balances.flatMap(
  (startingBalance) =>
    statedRateScenarios.map(({ nominalRatePercent, periodsPerYear }) =>
      createStatedRateComparisonRecord(
        startingBalance,
        nominalRatePercent,
        periodsPerYear,
      ),
    ),
);

export const apySeoRecords: ApySeoRecord[] = [
  ...savingsAccountApySeoRecords,
  ...highYieldSavingsApySeoRecords,
  ...cdApySeoRecords,
  ...moneyMarketApySeoRecords,
  ...checkingApySeoRecords,
  ...monthlyCompoundingApySeoRecords,
  ...dailyCompoundingApySeoRecords,
  ...statedRateComparisonApySeoRecords,
];

export const featuredApySeoRecords = apySeoRecords.filter(
  (record) => record.featured,
);
