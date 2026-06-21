export interface SafeWithdrawalRateSeoRecord {
  slug: string;
  question: string;
  portfolioValue: number;
  annualSpending: number;
  comparisonWithdrawalRatePercent: number;
  years: number;
  featured?: boolean;
}

export const EXPECTED_SAFE_WITHDRAWAL_RATE_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) => rate.toString().replace('.', '-');

function safeWithdrawalRateRecord(
  portfolioValue: number,
  annualSpending: number,
  comparisonWithdrawalRatePercent: number,
  years: number,
  featured = false,
): SafeWithdrawalRateSeoRecord {
  return {
    slug: `safe-withdrawal-rate-${annualSpending}-spending-${portfolioValue}-portfolio-${rateSlug(comparisonWithdrawalRatePercent)}-percent-${years}-years`,
    question: `Safe Withdrawal Rate for ${money(portfolioValue)} Portfolio and ${money(annualSpending)} Spending at ${comparisonWithdrawalRatePercent}% Over ${years} Years`,
    portfolioValue,
    annualSpending,
    comparisonWithdrawalRatePercent,
    years,
    featured,
  };
}

const annualSpendingTargets = [
  30000,
  40000,
  50000,
  60000,
  75000,
  100000,
  150000,
];

const portfolioValues = [
  500000,
  750000,
  1000000,
  1500000,
  2000000,
  3000000,
];

const planningAssumptions = [
  { comparisonWithdrawalRatePercent: 3, years: 25 },
  { comparisonWithdrawalRatePercent: 3.5, years: 30 },
  { comparisonWithdrawalRatePercent: 4, years: 30 },
  { comparisonWithdrawalRatePercent: 4.5, years: 35 },
  { comparisonWithdrawalRatePercent: 5, years: 40 },
];

const portfolioSpendingPairs = annualSpendingTargets
  .flatMap((annualSpending) =>
    portfolioValues.map((portfolioValue) => ({
      portfolioValue,
      annualSpending,
    })),
  )
  .filter(
    ({ portfolioValue, annualSpending }) =>
      !(
        annualSpending === 150000 &&
        (portfolioValue === 500000 || portfolioValue === 750000)
      ),
  );

export const safeWithdrawalRateSeoRecords: SafeWithdrawalRateSeoRecord[] =
  portfolioSpendingPairs.flatMap(({ portfolioValue, annualSpending }) =>
    planningAssumptions.map(
      ({ comparisonWithdrawalRatePercent, years }) =>
        safeWithdrawalRateRecord(
          portfolioValue,
          annualSpending,
          comparisonWithdrawalRatePercent,
          years,
          portfolioValue === 1000000 &&
            annualSpending === 40000 &&
            comparisonWithdrawalRatePercent === 4,
        ),
    ),
  );

export const featuredSafeWithdrawalRateSeoRecords =
  safeWithdrawalRateSeoRecords.filter((record) => record.featured);
