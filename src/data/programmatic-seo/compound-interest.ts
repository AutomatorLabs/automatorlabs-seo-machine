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

export const compoundInterestSeoRecords: CompoundInterestSeoRecord[] = [
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

export const featuredCompoundInterestSeoRecords =
  compoundInterestSeoRecords.filter((record) => record.featured);
