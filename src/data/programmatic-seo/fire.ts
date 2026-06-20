export type FireSeoIntent = 'spending-target' | 'portfolio-check';

export interface FireSeoRecord {
  slug: string;
  question: string;
  intent: FireSeoIntent;
  annualSpending: number;
  withdrawalRatePercent: number;
  portfolioValue?: number;
  featured?: boolean;
}

export const EXPECTED_FIRE_SEO_PAGE_COUNT = 200;

const rateSlug = (rate: number) => rate.toString().replace('.', '-');
const styleSlug = (style: FireStyle) => style.toLowerCase().replace(/\s+/g, '-');

type FireStyle = 'Lean FIRE' | 'Regular FIRE' | 'Fat FIRE';

function fireStyleForSpending(annualSpending: number): FireStyle {
  if (annualSpending <= 50000) return 'Lean FIRE';
  if (annualSpending >= 125000) return 'Fat FIRE';
  return 'Regular FIRE';
}

function spendingTargetRecord(
  annualSpending: number,
  featured = false,
): FireSeoRecord {
  const spending = annualSpending.toLocaleString('en-US');

  return {
    slug: `retire-spending-${annualSpending}-per-year`,
    question: `How Much Do I Need to Retire Spending $${spending} per Year?`,
    intent: 'spending-target',
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
  const portfolio = portfolioValue.toLocaleString('en-US');
  const spending = annualSpending.toLocaleString('en-US');

  return {
    slug: `can-i-retire-with-${portfolioValue}-and-${annualSpending}-spending`,
    question: `Can I Retire With $${portfolio} and $${spending} Annual Spending?`,
    intent: 'portfolio-check',
    annualSpending,
    withdrawalRatePercent: 4,
    portfolioValue,
    featured,
  };
}

function spendingTargetVariantRecord(
  annualSpending: number,
  withdrawalRatePercent: number,
  style = fireStyleForSpending(annualSpending),
): FireSeoRecord {
  const spending = annualSpending.toLocaleString('en-US');

  return {
    slug: `${styleSlug(style)}-number-for-${annualSpending}-spending-at-${rateSlug(withdrawalRatePercent)}-percent`,
    question: `${style} Number for $${spending} Annual Spending at ${withdrawalRatePercent}%`,
    intent: 'spending-target',
    annualSpending,
    withdrawalRatePercent,
  };
}

function portfolioCheckVariantRecord(
  portfolioValue: number,
  annualSpending: number,
  withdrawalRatePercent: number,
  style = fireStyleForSpending(annualSpending),
): FireSeoRecord {
  const portfolio = portfolioValue.toLocaleString('en-US');
  const spending = annualSpending.toLocaleString('en-US');

  return {
    slug: `can-i-retire-with-${portfolioValue}-and-${annualSpending}-spending-at-${rateSlug(withdrawalRatePercent)}-percent-${styleSlug(style)}`,
    question: `Can I Retire With $${portfolio} and $${spending} Spending at ${withdrawalRatePercent}% for ${style}?`,
    intent: 'portfolio-check',
    annualSpending,
    withdrawalRatePercent,
    portfolioValue,
  };
}

export const coreFireSeoRecords: FireSeoRecord[] = [
  spendingTargetRecord(24000),
  spendingTargetRecord(30000),
  spendingTargetRecord(36000),
  spendingTargetRecord(40000, true),
  spendingTargetRecord(45000),
  spendingTargetRecord(48000),
  spendingTargetRecord(50000, true),
  spendingTargetRecord(55000),
  spendingTargetRecord(60000, true),
  spendingTargetRecord(65000),
  spendingTargetRecord(70000),
  spendingTargetRecord(75000),
  spendingTargetRecord(80000, true),
  spendingTargetRecord(90000),
  spendingTargetRecord(100000, true),
  spendingTargetRecord(110000),
  spendingTargetRecord(120000),
  spendingTargetRecord(125000),
  spendingTargetRecord(150000),
  spendingTargetRecord(200000),
  portfolioCheckRecord(750000, 30000),
  portfolioCheckRecord(1000000, 40000, true),
  portfolioCheckRecord(1000000, 50000),
  portfolioCheckRecord(1250000, 40000),
  portfolioCheckRecord(1250000, 50000),
  portfolioCheckRecord(1500000, 60000, true),
  portfolioCheckRecord(1500000, 75000),
  portfolioCheckRecord(2000000, 80000),
  portfolioCheckRecord(2000000, 100000),
  portfolioCheckRecord(2500000, 120000),
];

export const longTailFireSeoRecords: FireSeoRecord[] = [
  spendingTargetRecord(52000),
  spendingTargetRecord(58000),
  spendingTargetRecord(85000),
  spendingTargetRecord(95000),
  spendingTargetRecord(175000),
  portfolioCheckRecord(900000, 36000),
  portfolioCheckRecord(1100000, 45000),
  portfolioCheckRecord(1200000, 60000),
  portfolioCheckRecord(1400000, 55000),
  portfolioCheckRecord(1600000, 64000),
  portfolioCheckRecord(1750000, 70000),
  portfolioCheckRecord(1800000, 90000),
  portfolioCheckRecord(2200000, 88000),
  portfolioCheckRecord(3000000, 120000),
  portfolioCheckRecord(3500000, 140000),
];

const spendingTargetVariantAmounts = [
  30000,
  40000,
  50000,
  60000,
  75000,
  100000,
  32000,
  35000,
  42000,
  52000,
  68000,
  90000,
  125000,
  150000,
];

const spendingTargetVariantRates = [3, 3.5, 4.5, 5];

export const spendingTargetVariantFireSeoRecords: FireSeoRecord[] =
  spendingTargetVariantAmounts.flatMap((annualSpending) =>
    spendingTargetVariantRates.map((withdrawalRatePercent) =>
      spendingTargetVariantRecord(annualSpending, withdrawalRatePercent),
    ),
  );

const priorityPortfolioChecks: [number, number][] = [
  [750000, 30000],
  [750000, 35000],
  [750000, 40000],
  [750000, 45000],
  [750000, 50000],
  [750000, 60000],
  [1500000, 50000],
  [1500000, 60000],
  [1500000, 75000],
  [1500000, 90000],
  [1500000, 100000],
  [1500000, 120000],
  [2000000, 60000],
  [2000000, 75000],
  [2000000, 90000],
  [2000000, 100000],
  [2000000, 125000],
  [2000000, 150000],
];

const portfolioVariantRates = [3, 3.5, 4.5, 5];

export const priorityPortfolioFireSeoRecords: FireSeoRecord[] =
  priorityPortfolioChecks.flatMap(([portfolioValue, annualSpending]) =>
    portfolioVariantRates.map((withdrawalRatePercent) =>
      portfolioCheckVariantRecord(
        portfolioValue,
        annualSpending,
        withdrawalRatePercent,
      ),
    ),
  );

const additionalPortfolioChecks: [number, number][] = [
  [625000, 25000],
  [875000, 35000],
  [1100000, 44000],
  [1250000, 62500],
  [1750000, 70000],
  [2500000, 100000],
  [3000000, 120000],
  [3500000, 140000],
  [4000000, 160000],
];

const additionalPortfolioRates = [3.5, 4.5, 5];

export const additionalPortfolioFireSeoRecords: FireSeoRecord[] =
  additionalPortfolioChecks.flatMap(([portfolioValue, annualSpending]) =>
    additionalPortfolioRates.map((withdrawalRatePercent) =>
      portfolioCheckVariantRecord(
        portfolioValue,
        annualSpending,
        withdrawalRatePercent,
      ),
    ),
  );

export const fireSeoRecords: FireSeoRecord[] = [
  ...coreFireSeoRecords,
  ...longTailFireSeoRecords,
  ...spendingTargetVariantFireSeoRecords,
  ...priorityPortfolioFireSeoRecords,
  ...additionalPortfolioFireSeoRecords,
];

export const featuredFireSeoRecords = fireSeoRecords.filter(
  (record) => record.featured,
);
