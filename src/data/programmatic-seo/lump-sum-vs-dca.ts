export type LumpSumVsDcaSeoIntent =
  | 'broad-market'
  | 'windfall-investing'
  | 'retirement-rollover'
  | 'taxable-investing'
  | 'volatile-market';

export interface LumpSumVsDcaSeoRecord {
  slug: string;
  question: string;
  intent: LumpSumVsDcaSeoIntent;
  totalAmount: number;
  dcaMonthlyAmount: number;
  expectedAnnualReturnPercent: number;
  years: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_LUMP_SUM_VS_DCA_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function createLumpSumVsDcaRecord(
  intent: LumpSumVsDcaSeoIntent,
  scenarioLabel: string,
  totalAmount: number,
  dcaMonthlyAmount: number,
  expectedAnnualReturnPercent: number,
  years: number,
  featured = false,
): LumpSumVsDcaSeoRecord {
  const prefix = {
    'broad-market': 'lump-sum-vs-dca',
    'windfall-investing': 'windfall-lump-sum-vs-dca',
    'retirement-rollover': 'retirement-rollover-lump-sum-vs-dca',
    'taxable-investing': 'taxable-lump-sum-vs-dca',
    'volatile-market': 'volatile-market-lump-sum-vs-dca',
  }[intent];
  const questionPrefix = {
    'broad-market': 'Broad Market Lump Sum vs DCA',
    'windfall-investing': 'Windfall Lump Sum vs DCA',
    'retirement-rollover': 'Retirement Rollover Lump Sum vs DCA',
    'taxable-investing': 'Taxable Investing Lump Sum vs DCA',
    'volatile-market': 'Volatile Market Lump Sum vs DCA',
  }[intent];

  return {
    slug: `${prefix}-${totalAmount}-at-${dcaMonthlyAmount}-monthly-${rateSlug(expectedAnnualReturnPercent)}-percent-for-${years}-years`,
    question: `${questionPrefix} for ${money(totalAmount)} at ${money(dcaMonthlyAmount)} per Month Over ${years} Years`,
    intent,
    totalAmount,
    dcaMonthlyAmount,
    expectedAnnualReturnPercent,
    years,
    scenarioLabel,
    featured,
  };
}

const baseAmounts = [12000, 24000, 36000, 60000, 120000];
const baseScenarios = [
  { dcaMonthlyAmount: 500, returnPercent: 5, years: 2 },
  { dcaMonthlyAmount: 750, returnPercent: 6, years: 3 },
  { dcaMonthlyAmount: 1000, returnPercent: 7, years: 4 },
  { dcaMonthlyAmount: 1500, returnPercent: 7.5, years: 5 },
  { dcaMonthlyAmount: 2000, returnPercent: 8, years: 6 },
  { dcaMonthlyAmount: 2500, returnPercent: 8.5, years: 7 },
  { dcaMonthlyAmount: 3000, returnPercent: 9, years: 8 },
  { dcaMonthlyAmount: 4000, returnPercent: 10, years: 10 },
];

export const broadMarketLumpSumVsDcaSeoRecords = baseAmounts.flatMap(
  (totalAmount) =>
    baseScenarios.map((scenario) =>
      createLumpSumVsDcaRecord(
        'broad-market',
        'broad market comparison',
        totalAmount,
        scenario.dcaMonthlyAmount,
        scenario.returnPercent,
        scenario.years,
        totalAmount === 120000 &&
          scenario.dcaMonthlyAmount === 2000 &&
          scenario.returnPercent === 8 &&
          scenario.years === 6,
      ),
    ),
);

const windfallAmounts = [25000, 50000, 75000, 100000, 150000];
const windfallScenarios = [
  { dcaMonthlyAmount: 1000, returnPercent: 5, years: 3 },
  { dcaMonthlyAmount: 1500, returnPercent: 6, years: 4 },
  { dcaMonthlyAmount: 2000, returnPercent: 7, years: 5 },
  { dcaMonthlyAmount: 2500, returnPercent: 7.5, years: 6 },
  { dcaMonthlyAmount: 3000, returnPercent: 8, years: 7 },
  { dcaMonthlyAmount: 4000, returnPercent: 8.5, years: 8 },
  { dcaMonthlyAmount: 5000, returnPercent: 9, years: 9 },
  { dcaMonthlyAmount: 6000, returnPercent: 10, years: 10 },
];

export const windfallLumpSumVsDcaSeoRecords = windfallAmounts.flatMap(
  (totalAmount) =>
    windfallScenarios.map((scenario) =>
      createLumpSumVsDcaRecord(
        'windfall-investing',
        'windfall investing comparison',
        totalAmount,
        scenario.dcaMonthlyAmount,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

const retirementAmounts = [50000, 100000, 150000, 250000, 500000];
const retirementScenarios = [
  { dcaMonthlyAmount: 2000, returnPercent: 5, years: 3 },
  { dcaMonthlyAmount: 3000, returnPercent: 6, years: 4 },
  { dcaMonthlyAmount: 4000, returnPercent: 6.5, years: 5 },
  { dcaMonthlyAmount: 5000, returnPercent: 7, years: 6 },
  { dcaMonthlyAmount: 6000, returnPercent: 7.5, years: 7 },
  { dcaMonthlyAmount: 7000, returnPercent: 8, years: 8 },
  { dcaMonthlyAmount: 8000, returnPercent: 8.5, years: 9 },
  { dcaMonthlyAmount: 10000, returnPercent: 9, years: 10 },
];

export const retirementLumpSumVsDcaSeoRecords = retirementAmounts.flatMap(
  (totalAmount) =>
    retirementScenarios.map((scenario) =>
      createLumpSumVsDcaRecord(
        'retirement-rollover',
        'retirement rollover comparison',
        totalAmount,
        scenario.dcaMonthlyAmount,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

const taxableAmounts = [15000, 30000, 50000, 80000, 120000];
const taxableScenarios = [
  { dcaMonthlyAmount: 750, returnPercent: 4.5, years: 3 },
  { dcaMonthlyAmount: 1000, returnPercent: 5.5, years: 4 },
  { dcaMonthlyAmount: 1500, returnPercent: 6.5, years: 5 },
  { dcaMonthlyAmount: 2000, returnPercent: 7, years: 6 },
  { dcaMonthlyAmount: 2500, returnPercent: 7.5, years: 7 },
  { dcaMonthlyAmount: 3000, returnPercent: 8, years: 8 },
  { dcaMonthlyAmount: 4000, returnPercent: 8.5, years: 9 },
  { dcaMonthlyAmount: 5000, returnPercent: 9, years: 10 },
];

export const taxableLumpSumVsDcaSeoRecords = taxableAmounts.flatMap(
  (totalAmount) =>
    taxableScenarios.map((scenario) =>
      createLumpSumVsDcaRecord(
        'taxable-investing',
        'taxable investing comparison',
        totalAmount,
        scenario.dcaMonthlyAmount,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

const volatileAmounts = [12000, 24000, 36000, 60000, 120000];
const volatileScenarios = [
  { dcaMonthlyAmount: 500, returnPercent: 3, years: 2 },
  { dcaMonthlyAmount: 750, returnPercent: 4, years: 3 },
  { dcaMonthlyAmount: 1000, returnPercent: 5, years: 4 },
  { dcaMonthlyAmount: 1500, returnPercent: 6, years: 5 },
  { dcaMonthlyAmount: 2000, returnPercent: 7, years: 6 },
  { dcaMonthlyAmount: 2500, returnPercent: 7.5, years: 7 },
  { dcaMonthlyAmount: 3000, returnPercent: 8, years: 8 },
  { dcaMonthlyAmount: 4000, returnPercent: 9, years: 10 },
];

export const volatileLumpSumVsDcaSeoRecords = volatileAmounts.flatMap(
  (totalAmount) =>
    volatileScenarios.map((scenario) =>
      createLumpSumVsDcaRecord(
        'volatile-market',
        'volatile market comparison',
        totalAmount,
        scenario.dcaMonthlyAmount,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

export const lumpSumVsDcaSeoRecords: LumpSumVsDcaSeoRecord[] = [
  ...broadMarketLumpSumVsDcaSeoRecords,
  ...windfallLumpSumVsDcaSeoRecords,
  ...retirementLumpSumVsDcaSeoRecords,
  ...taxableLumpSumVsDcaSeoRecords,
  ...volatileLumpSumVsDcaSeoRecords,
];
