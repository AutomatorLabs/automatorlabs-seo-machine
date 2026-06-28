export type MortgageRecastSeoIntent =
  | 'starter-recast'
  | 'move-up-home'
  | 'retirement-cashflow'
  | 'low-fee'
  | 'large-balance';

export interface MortgageRecastSeoRecord {
  slug: string;
  question: string;
  intent: MortgageRecastSeoIntent;
  currentMortgageBalance: number;
  annualInterestRatePercent: number;
  remainingLoanTermYears: number;
  lumpSumRecastPayment: number;
  recastFee: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_MORTGAGE_RECAST_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) => String(rate).replace('.', '-');

function record(
  intent: MortgageRecastSeoIntent,
  currentMortgageBalance: number,
  annualInterestRatePercent: number,
  remainingLoanTermYears: number,
  lumpSumRecastPayment: number,
  recastFee: number,
  featured = false,
): MortgageRecastSeoRecord {
  return {
    slug: `${intent}-${currentMortgageBalance}-balance-${rateSlug(annualInterestRatePercent)}-rate-${remainingLoanTermYears}-years-${lumpSumRecastPayment}-recast-${recastFee}-fee`,
    question: `${intent.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())} Mortgage Recast on ${money(currentMortgageBalance)} at ${annualInterestRatePercent}% With ${money(lumpSumRecastPayment)} Lump Sum`,
    intent,
    currentMortgageBalance,
    annualInterestRatePercent,
    remainingLoanTermYears,
    lumpSumRecastPayment,
    recastFee,
    scenarioLabel: intent.replace(/-/g, ' '),
    featured,
  };
}

const starterBalances = [200000, 250000, 300000, 350000, 400000];
const starterScenarios = [
  { annualInterestRatePercent: 4.5, remainingLoanTermYears: 20, lumpSumRecastPayment: 10000, recastFee: 250 },
  { annualInterestRatePercent: 4.75, remainingLoanTermYears: 20, lumpSumRecastPayment: 15000, recastFee: 250 },
  { annualInterestRatePercent: 5, remainingLoanTermYears: 25, lumpSumRecastPayment: 20000, recastFee: 250 },
  { annualInterestRatePercent: 5.25, remainingLoanTermYears: 25, lumpSumRecastPayment: 25000, recastFee: 300 },
  { annualInterestRatePercent: 5.5, remainingLoanTermYears: 25, lumpSumRecastPayment: 30000, recastFee: 300 },
  { annualInterestRatePercent: 5.75, remainingLoanTermYears: 30, lumpSumRecastPayment: 35000, recastFee: 350 },
  { annualInterestRatePercent: 6, remainingLoanTermYears: 30, lumpSumRecastPayment: 40000, recastFee: 350 },
  { annualInterestRatePercent: 6.25, remainingLoanTermYears: 30, lumpSumRecastPayment: 50000, recastFee: 400 },
];

const moveUpBalances = [450000, 550000, 650000, 750000, 850000];
const moveUpScenarios = [
  { annualInterestRatePercent: 4.75, remainingLoanTermYears: 20, lumpSumRecastPayment: 20000, recastFee: 250 },
  { annualInterestRatePercent: 5, remainingLoanTermYears: 20, lumpSumRecastPayment: 30000, recastFee: 250 },
  { annualInterestRatePercent: 5.25, remainingLoanTermYears: 25, lumpSumRecastPayment: 40000, recastFee: 300 },
  { annualInterestRatePercent: 5.5, remainingLoanTermYears: 25, lumpSumRecastPayment: 50000, recastFee: 300 },
  { annualInterestRatePercent: 5.75, remainingLoanTermYears: 25, lumpSumRecastPayment: 60000, recastFee: 350 },
  { annualInterestRatePercent: 6, remainingLoanTermYears: 30, lumpSumRecastPayment: 75000, recastFee: 350 },
  { annualInterestRatePercent: 6.25, remainingLoanTermYears: 30, lumpSumRecastPayment: 90000, recastFee: 400 },
  { annualInterestRatePercent: 6.5, remainingLoanTermYears: 30, lumpSumRecastPayment: 100000, recastFee: 450 },
];

const retirementBalances = [300000, 400000, 500000, 600000, 700000];
const retirementScenarios = [
  { annualInterestRatePercent: 4.25, remainingLoanTermYears: 10, lumpSumRecastPayment: 25000, recastFee: 250 },
  { annualInterestRatePercent: 4.5, remainingLoanTermYears: 12, lumpSumRecastPayment: 40000, recastFee: 250 },
  { annualInterestRatePercent: 4.75, remainingLoanTermYears: 15, lumpSumRecastPayment: 50000, recastFee: 300 },
  { annualInterestRatePercent: 5, remainingLoanTermYears: 15, lumpSumRecastPayment: 75000, recastFee: 300 },
  { annualInterestRatePercent: 5.25, remainingLoanTermYears: 18, lumpSumRecastPayment: 100000, recastFee: 350 },
  { annualInterestRatePercent: 5.5, remainingLoanTermYears: 20, lumpSumRecastPayment: 125000, recastFee: 350 },
  { annualInterestRatePercent: 5.75, remainingLoanTermYears: 20, lumpSumRecastPayment: 150000, recastFee: 400 },
  { annualInterestRatePercent: 6, remainingLoanTermYears: 25, lumpSumRecastPayment: 175000, recastFee: 450 },
];

const lowFeeBalances = [250000, 350000, 450000, 550000, 650000];
const lowFeeScenarios = [
  { annualInterestRatePercent: 4.5, remainingLoanTermYears: 15, lumpSumRecastPayment: 15000, recastFee: 0 },
  { annualInterestRatePercent: 4.75, remainingLoanTermYears: 20, lumpSumRecastPayment: 20000, recastFee: 0 },
  { annualInterestRatePercent: 5, remainingLoanTermYears: 20, lumpSumRecastPayment: 30000, recastFee: 100 },
  { annualInterestRatePercent: 5.25, remainingLoanTermYears: 25, lumpSumRecastPayment: 40000, recastFee: 100 },
  { annualInterestRatePercent: 5.5, remainingLoanTermYears: 25, lumpSumRecastPayment: 50000, recastFee: 150 },
  { annualInterestRatePercent: 5.75, remainingLoanTermYears: 30, lumpSumRecastPayment: 60000, recastFee: 150 },
  { annualInterestRatePercent: 6, remainingLoanTermYears: 30, lumpSumRecastPayment: 75000, recastFee: 200 },
  { annualInterestRatePercent: 6.25, remainingLoanTermYears: 30, lumpSumRecastPayment: 90000, recastFee: 200 },
];

const largeBalanceBalances = [800000, 1000000, 1200000, 1400000, 1600000];
const largeBalanceScenarios = [
  { annualInterestRatePercent: 5, remainingLoanTermYears: 20, lumpSumRecastPayment: 50000, recastFee: 300 },
  { annualInterestRatePercent: 5.25, remainingLoanTermYears: 20, lumpSumRecastPayment: 75000, recastFee: 350 },
  { annualInterestRatePercent: 5.5, remainingLoanTermYears: 25, lumpSumRecastPayment: 100000, recastFee: 350 },
  { annualInterestRatePercent: 5.75, remainingLoanTermYears: 25, lumpSumRecastPayment: 150000, recastFee: 400 },
  { annualInterestRatePercent: 6, remainingLoanTermYears: 30, lumpSumRecastPayment: 200000, recastFee: 400 },
  { annualInterestRatePercent: 6.25, remainingLoanTermYears: 30, lumpSumRecastPayment: 250000, recastFee: 450 },
  { annualInterestRatePercent: 6.5, remainingLoanTermYears: 30, lumpSumRecastPayment: 300000, recastFee: 500 },
  { annualInterestRatePercent: 6.75, remainingLoanTermYears: 30, lumpSumRecastPayment: 350000, recastFee: 500 },
];

export const mortgageRecastSeoRecords: MortgageRecastSeoRecord[] = [
  ...starterBalances.flatMap((currentMortgageBalance) =>
    starterScenarios.map((scenario) =>
      record(
        'starter-recast',
        currentMortgageBalance,
        scenario.annualInterestRatePercent,
        scenario.remainingLoanTermYears,
        scenario.lumpSumRecastPayment,
        scenario.recastFee,
        currentMortgageBalance === 300000 &&
          scenario.annualInterestRatePercent === 5 &&
          scenario.lumpSumRecastPayment === 20000,
      ),
    ),
  ),
  ...moveUpBalances.flatMap((currentMortgageBalance) =>
    moveUpScenarios.map((scenario) =>
      record(
        'move-up-home',
        currentMortgageBalance,
        scenario.annualInterestRatePercent,
        scenario.remainingLoanTermYears,
        scenario.lumpSumRecastPayment,
        scenario.recastFee,
      ),
    ),
  ),
  ...retirementBalances.flatMap((currentMortgageBalance) =>
    retirementScenarios.map((scenario) =>
      record(
        'retirement-cashflow',
        currentMortgageBalance,
        scenario.annualInterestRatePercent,
        scenario.remainingLoanTermYears,
        scenario.lumpSumRecastPayment,
        scenario.recastFee,
      ),
    ),
  ),
  ...lowFeeBalances.flatMap((currentMortgageBalance) =>
    lowFeeScenarios.map((scenario) =>
      record(
        'low-fee',
        currentMortgageBalance,
        scenario.annualInterestRatePercent,
        scenario.remainingLoanTermYears,
        scenario.lumpSumRecastPayment,
        scenario.recastFee,
      ),
    ),
  ),
  ...largeBalanceBalances.flatMap((currentMortgageBalance) =>
    largeBalanceScenarios.map((scenario) =>
      record(
        'large-balance',
        currentMortgageBalance,
        scenario.annualInterestRatePercent,
        scenario.remainingLoanTermYears,
        scenario.lumpSumRecastPayment,
        scenario.recastFee,
      ),
    ),
  ),
];
