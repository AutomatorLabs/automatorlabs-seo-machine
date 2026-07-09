export type FireSeoIntent =
  | 'lean-spending-target'
  | 'regular-spending-target'
  | 'fat-spending-target'
  | 'underfunded-portfolio-check'
  | 'funded-portfolio-check';

export interface FireSeoRecord {
  slug: string;
  question: string;
  intent: FireSeoIntent;
  annualSpending: number;
  withdrawalRatePercent: number;
  portfolioValue?: number;
  featured?: boolean;
}

export const EXPECTED_FIRE_SEO_PAGE_COUNT = 69;

function spendingStyle(annualSpending: number): 'lean' | 'regular' | 'fat' {
  if (annualSpending <= 50000) return 'lean';
  if (annualSpending >= 125000) return 'fat';
  return 'regular';
}

function spendingTargetRecord(
  annualSpending: number,
  featured = false,
): FireSeoRecord {
  const style = spendingStyle(annualSpending);
  const intent = `${style}-spending-target` as FireSeoIntent;
  const styleLabel =
    style === 'lean'
      ? 'Lean FIRE'
      : style === 'fat'
        ? 'Fat FIRE'
        : 'Regular FIRE';
  const spending = annualSpending.toLocaleString('en-US');

  return {
    slug: `${intent}-annual-spending-${annualSpending}`,
    question: `${styleLabel} Number for $${spending} Annual Spending`,
    intent,
    annualSpending,
    withdrawalRatePercent: 4,
    featured,
  };
}

function portfolioCheckRecord(
  portfolioValue: number,
  annualSpending: number,
  featured = false,
): FireSeoRecord {
  const fireNumberAt4 = annualSpending / 0.04;
  const intent: FireSeoIntent =
    portfolioValue < fireNumberAt4
      ? 'underfunded-portfolio-check'
      : 'funded-portfolio-check';
  const label =
    intent === 'underfunded-portfolio-check' ? 'Underfunded' : 'Funded';
  const portfolio = portfolioValue.toLocaleString('en-US');
  const spending = annualSpending.toLocaleString('en-US');

  return {
    slug: `${intent}-portfolio-${portfolioValue}-spending-${annualSpending}`,
    question: `${label} Check: Can I Retire With $${portfolio} and $${spending} Annual Spending?`,
    intent,
    annualSpending,
    withdrawalRatePercent: 4,
    portfolioValue,
    featured,
  };
}

// 29 unique annual-spending amounts, mechanically de-duplicated from the
// prior 200-record set's withdrawal-rate variants (10 lean / 15 regular /
// 4 fat once split by spendingStyle's thresholds).
const spendingTargetAmounts = [
  24000, 30000, 32000, 35000, 36000, 40000, 42000, 45000, 48000, 50000, 52000,
  55000, 58000, 60000, 65000, 68000, 70000, 75000, 80000, 85000, 90000, 95000,
  100000, 110000, 120000, 125000, 150000, 175000, 200000,
];

// Featured picks: 2 lean, 2 regular, 1 fat — carried forward from the prior
// cluster's featured set (40000, 50000, 60000, 80000, 100000 all mapped
// cleanly to surviving amounts) with 100000 swapped for 150000 to add fat
// tier representation, since the old featured set had none.
const featuredSpendingAmounts = new Set([40000, 50000, 60000, 80000, 150000]);

export const fireSpendingTargetSeoRecords: FireSeoRecord[] =
  spendingTargetAmounts.map((amount) =>
    spendingTargetRecord(amount, featuredSpendingAmounts.has(amount)),
  );

// 40 unique (portfolioValue, annualSpending) pairs, mechanically
// de-duplicated the same way (19 underfunded / 21 funded once classified
// against the 4% FIRE number).
const portfolioCheckPairs: [number, number][] = [
  [625000, 25000],
  [750000, 30000],
  [750000, 35000],
  [750000, 40000],
  [750000, 45000],
  [750000, 50000],
  [750000, 60000],
  [875000, 35000],
  [900000, 36000],
  [1000000, 40000],
  [1000000, 50000],
  [1100000, 44000],
  [1100000, 45000],
  [1200000, 60000],
  [1250000, 40000],
  [1250000, 50000],
  [1250000, 62500],
  [1400000, 55000],
  [1500000, 50000],
  [1500000, 60000],
  [1500000, 75000],
  [1500000, 90000],
  [1500000, 100000],
  [1500000, 120000],
  [1600000, 64000],
  [1750000, 70000],
  [1800000, 90000],
  [2000000, 60000],
  [2000000, 75000],
  [2000000, 80000],
  [2000000, 90000],
  [2000000, 100000],
  [2000000, 125000],
  [2000000, 150000],
  [2200000, 88000],
  [2500000, 100000],
  [2500000, 120000],
  [3000000, 120000],
  [3500000, 140000],
  [4000000, 160000],
];

// Featured picks: 2 previously-featured pairs (1000000/40000 and
// 1500000/60000, both land on funded-portfolio-check) plus one new
// underfunded pick (750000/45000) for outcome diversity.
const featuredPortfolioPairs = new Set([
  '1000000-40000',
  '1500000-60000',
  '750000-45000',
]);

export const firePortfolioCheckSeoRecords: FireSeoRecord[] =
  portfolioCheckPairs.map(([portfolioValue, annualSpending]) =>
    portfolioCheckRecord(
      portfolioValue,
      annualSpending,
      featuredPortfolioPairs.has(`${portfolioValue}-${annualSpending}`),
    ),
  );

export const fireSeoRecords: FireSeoRecord[] = [
  ...fireSpendingTargetSeoRecords,
  ...firePortfolioCheckSeoRecords,
];

export const featuredFireSeoRecords = fireSeoRecords.filter(
  (record) => record.featured,
);
