export interface MortgageSeoRecord {
  slug: string;
  question: string;
  loanAmount: number;
  annualInterestRatePercent: number;
  loanTermYears: number;
  featured?: boolean;
}

export const EXPECTED_MORTGAGE_SEO_PAGE_COUNT = 200;

function rateSlug(rate: number): string {
  return String(rate).replace('.', '-');
}

function record(
  loanAmount: number,
  annualInterestRatePercent: number,
  loanTermYears: number,
  featured = false,
): MortgageSeoRecord {
  const amount = loanAmount.toLocaleString('en-US');

  return {
    slug: `${loanAmount}-mortgage-at-${rateSlug(annualInterestRatePercent)}-percent-for-${loanTermYears}-years`,
    question: `Monthly Payment on a $${amount} Mortgage at ${annualInterestRatePercent}% for ${loanTermYears} Years`,
    loanAmount,
    annualInterestRatePercent,
    loanTermYears,
    featured,
  };
}

export const coreMortgageSeoRecords: MortgageSeoRecord[] = [
  record(150000, 4.5, 30),
  record(175000, 5, 30),
  record(200000, 5.5, 30),
  record(225000, 6, 30),
  record(250000, 4.5, 30, true),
  record(250000, 6.5, 30),
  record(275000, 5.5, 30),
  record(300000, 5, 30),
  record(300000, 6, 30, true),
  record(300000, 7, 30),
  record(325000, 6.25, 30),
  record(350000, 5.5, 30),
  record(350000, 6.5, 30),
  record(375000, 6.75, 30),
  record(400000, 5.5, 30),
  record(400000, 6.5, 30, true),
  record(425000, 6.25, 30),
  record(450000, 6, 30),
  record(450000, 7, 30),
  record(475000, 6.75, 30),
  record(500000, 5.5, 30),
  record(500000, 6.5, 30),
  record(500000, 7, 30, true),
  record(550000, 6.25, 30),
  record(600000, 6, 30),
  record(600000, 7, 30),
  record(650000, 6.5, 30),
  record(700000, 6.75, 30),
  record(750000, 7, 30),
  record(800000, 7.25, 30),
  record(250000, 5, 20),
  record(350000, 5.75, 20),
  record(450000, 6.25, 20),
  record(550000, 6.75, 20),
  record(200000, 4.5, 15),
  record(300000, 5, 15),
  record(400000, 5.5, 15),
  record(500000, 6, 15),
  record(600000, 6.5, 15),
  record(750000, 5.5, 15, true),
];

export const jumboMortgageSeoRecords: MortgageSeoRecord[] = [
  record(450000, 6.5, 30),
  record(900000, 6.5, 30),
  record(900000, 7, 30),
  record(950000, 6.75, 30),
  record(1000000, 6.5, 30),
  record(1100000, 7, 30),
  record(1200000, 6.75, 30),
  record(650000, 5.75, 20),
  record(775000, 6.25, 20),
  record(850000, 6.75, 20),
  record(900000, 6, 20),
  record(650000, 5.75, 15),
  record(700000, 6, 15),
  record(850000, 6.5, 15),
  record(900000, 6.75, 15),
];

const affordableMarketMortgageAmounts = [
  125000,
  150000,
  175000,
  200000,
  225000,
  250000,
  275000,
  300000,
  325000,
  350000,
  375000,
  400000,
];

const affordableMarketMortgageRates = [5.25, 5.875, 6.375, 7.125];

const conventionalMortgageAmounts = [
  180000,
  220000,
  260000,
  320000,
  380000,
  420000,
  480000,
  520000,
  580000,
  625000,
];

const conventionalMortgageRates = [5.99, 6.49, 6.99, 7.49];

const twentyYearMortgageAmounts = [
  275000,
  325000,
  375000,
  425000,
  475000,
  525000,
  575000,
  625000,
  675000,
  725000,
  825000,
  925000,
];

const twentyYearMortgageRates = [5.25, 5.875, 6.125, 6.625];

const fifteenYearMortgageAmounts = [
  225000,
  275000,
  325000,
  375000,
  425000,
  475000,
  525000,
  575000,
  625000,
];

export const expandedMortgageSeoRecords: MortgageSeoRecord[] = [
  ...affordableMarketMortgageAmounts.flatMap((amount) =>
    affordableMarketMortgageRates.map((rate) => record(amount, rate, 30)),
  ),
  ...conventionalMortgageAmounts.flatMap((amount) =>
    conventionalMortgageRates.map((rate) => record(amount, rate, 30)),
  ),
  ...twentyYearMortgageAmounts.flatMap((amount) =>
    twentyYearMortgageRates.map((rate) => record(amount, rate, 20)),
  ),
  ...fifteenYearMortgageAmounts.map((amount) =>
    record(amount, 5.875, 15),
  ),
];

export const mortgageSeoRecords: MortgageSeoRecord[] = [
  ...coreMortgageSeoRecords,
  ...jumboMortgageSeoRecords,
  ...expandedMortgageSeoRecords,
];

export const featuredMortgageSeoRecords = mortgageSeoRecords.filter(
  (record) => record.featured,
);
