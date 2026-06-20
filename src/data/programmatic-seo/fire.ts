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

export const EXPECTED_FIRE_SEO_PAGE_COUNT = 45;

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

export const fireSeoRecords: FireSeoRecord[] = [
  ...coreFireSeoRecords,
  ...longTailFireSeoRecords,
];

export const featuredFireSeoRecords = fireSeoRecords.filter(
  (record) => record.featured,
);
