export interface CompoundInterestSeoRecord {
  slug: string;
  question: string;
  principal: number;
  annualRatePercent: number;
  years: number;
  monthlyContribution: number;
  periodsPerYear: number;
  featured?: boolean;
}

export const EXPECTED_COMPOUND_INTEREST_SEO_PAGE_COUNT = 200;

function record(
  principal: number,
  annualRatePercent: number,
  years: number,
  featured = false,
): CompoundInterestSeoRecord {
  const amount = principal.toLocaleString('en-US');

  return {
    slug: `${principal}-at-${annualRatePercent}-percent-for-${years}-years`,
    question: `How Much Will $${amount} Grow at ${annualRatePercent}% for ${years} Years?`,
    principal,
    annualRatePercent,
    years,
    monthlyContribution: 0,
    periodsPerYear: 1,
    featured,
  };
}

export const originalCompoundInterestSeoRecords: CompoundInterestSeoRecord[] = [
  record(1000, 5, 10, true),
  record(1000, 8, 20),
  record(2500, 6, 15),
  record(2500, 10, 30),
  record(5000, 4, 20),
  record(5000, 7, 10, true),
  record(5000, 8, 30),
  record(7500, 6, 25),
  record(7500, 9, 15),
  record(10000, 5, 20),
  record(10000, 7, 10),
  record(10000, 8, 30, true),
  record(10000, 10, 15),
  record(15000, 6, 20),
  record(15000, 9, 25),
  record(20000, 4, 30),
  record(20000, 7, 15),
  record(25000, 5, 10),
  record(25000, 8, 20, true),
  record(25000, 10, 15),
  record(30000, 6, 30),
  record(40000, 7, 25),
  record(50000, 4, 15),
  record(50000, 7, 20, true),
  record(50000, 9, 30),
  record(75000, 5, 25),
  record(75000, 8, 15),
  record(100000, 6, 20),
  record(100000, 8, 30, true),
  record(100000, 10, 10),
];

const expansionPrincipals = [
  2000,
  3000,
  6000,
  12000,
  18000,
  35000,
  60000,
  80000,
  125000,
  150000,
];

const expansionScenarios = [
  { annualRatePercent: 3, years: 5 },
  { annualRatePercent: 4, years: 10 },
  { annualRatePercent: 5, years: 15 },
  { annualRatePercent: 6, years: 20 },
  { annualRatePercent: 7, years: 25 },
  { annualRatePercent: 8, years: 30 },
  { annualRatePercent: 9, years: 40 },
];

export const expandedCompoundInterestSeoRecords =
  expansionPrincipals.flatMap((principal) =>
    expansionScenarios.map(({ annualRatePercent, years }) =>
      record(principal, annualRatePercent, years),
    ),
  );

export const longTailCompoundInterestSeoRecords: CompoundInterestSeoRecord[] = [
  record(25000, 6, 20),
  record(25000, 7, 30),
  record(30000, 8, 20),
  record(40000, 6, 15),
  record(50000, 6, 25),
  record(75000, 7, 20),
  record(100000, 7, 25),
  record(175000, 6, 30),
  record(150000, 8, 20),
  record(200000, 5, 30),
  record(200000, 7, 20),
  record(250000, 6, 25),
  record(300000, 5, 20),
  record(500000, 4, 30),
  record(1000000, 5, 20),
];

const milestonePrincipals = [
  45000,
  90000,
  175000,
  225000,
  275000,
  350000,
  400000,
  750000,
];

const milestoneScenarios = [
  { annualRatePercent: 11, years: 10 },
  { annualRatePercent: 12, years: 15 },
  { annualRatePercent: 13, years: 20 },
  { annualRatePercent: 14, years: 25 },
  { annualRatePercent: 15, years: 30 },
];

export const milestoneCompoundInterestSeoRecords =
  milestonePrincipals.flatMap((principal) =>
    milestoneScenarios.map(({ annualRatePercent, years }) =>
      record(principal, annualRatePercent, years),
    ),
  );

const longHorizonPrincipals = [
  50000,
  100000,
  250000,
  500000,
  1000000,
];

const longHorizonScenarios = [
  { annualRatePercent: 10, years: 35 },
  { annualRatePercent: 11, years: 40 },
  { annualRatePercent: 12, years: 45 },
  { annualRatePercent: 13, years: 50 },
  { annualRatePercent: 14, years: 35 },
];

export const longHorizonCompoundInterestSeoRecords =
  longHorizonPrincipals.flatMap((principal) =>
    longHorizonScenarios.map(({ annualRatePercent, years }) =>
      record(principal, annualRatePercent, years),
    ),
  );

export const additionalCompoundInterestSeoRecords: CompoundInterestSeoRecord[] = [
  record(1500, 11, 8),
  record(4000, 12, 12),
  record(8500, 13, 18),
  record(16000, 11, 22),
  record(22000, 12, 28),
  record(32000, 13, 32),
  record(45000, 16, 18),
  record(90000, 17, 22),
  record(175000, 16, 28),
  record(225000, 17, 32),
  record(275000, 16, 18),
  record(350000, 17, 22),
  record(400000, 16, 28),
  record(750000, 17, 32),
  record(1000000, 16, 25),
  record(1500000, 11, 20),
  record(2000000, 12, 30),
  record(3000000, 11, 25),
  record(5000000, 10, 20),
  record(10000000, 10, 15),
];

export const compoundInterestSeoRecords: CompoundInterestSeoRecord[] = [
  ...originalCompoundInterestSeoRecords,
  ...expandedCompoundInterestSeoRecords,
  ...longTailCompoundInterestSeoRecords,
  ...milestoneCompoundInterestSeoRecords,
  ...longHorizonCompoundInterestSeoRecords,
  ...additionalCompoundInterestSeoRecords,
];

export const featuredCompoundInterestSeoRecords =
  compoundInterestSeoRecords.filter((record) => record.featured);
