export interface RetirementWithdrawalSeoRecord {
  slug: string;
  question: string;
  portfolioValue: number;
  annualWithdrawalAmount: number;
  expectedAnnualReturnPercent: number;
  inflationRatePercent: number;
  years: number;
  featured?: boolean;
}

export const EXPECTED_RETIREMENT_WITHDRAWAL_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) => rate.toString().replace('.', '-');

function withdrawalRecord(
  portfolioValue: number,
  annualWithdrawalAmount: number,
  expectedAnnualReturnPercent: number,
  inflationRatePercent: number,
  years: number,
  featured = false,
): RetirementWithdrawalSeoRecord {
  return {
    slug: `withdraw-${annualWithdrawalAmount}-per-year-from-${portfolioValue}-for-${years}-years-at-${rateSlug(expectedAnnualReturnPercent)}-return-${rateSlug(inflationRatePercent)}-inflation`,
    question: `Can I Withdraw ${money(annualWithdrawalAmount)} per Year From ${money(portfolioValue)} for ${years} Years?`,
    portfolioValue,
    annualWithdrawalAmount,
    expectedAnnualReturnPercent,
    inflationRatePercent,
    years,
    featured,
  };
}

const withdrawalAmounts = [
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

const assumptionSets = [
  { expectedAnnualReturnPercent: 5, inflationRatePercent: 2, years: 20 },
  { expectedAnnualReturnPercent: 6, inflationRatePercent: 2.5, years: 25 },
  { expectedAnnualReturnPercent: 7, inflationRatePercent: 3, years: 30 },
  { expectedAnnualReturnPercent: 5.5, inflationRatePercent: 3, years: 35 },
  { expectedAnnualReturnPercent: 6.5, inflationRatePercent: 2.5, years: 40 },
];

const portfolioWithdrawalPairs = withdrawalAmounts
  .flatMap((annualWithdrawalAmount) =>
    portfolioValues.map((portfolioValue) => ({
      portfolioValue,
      annualWithdrawalAmount,
    })),
  )
  .filter(
    ({ portfolioValue, annualWithdrawalAmount }) =>
      !(
        annualWithdrawalAmount === 150000 &&
        (portfolioValue === 500000 || portfolioValue === 750000)
      ),
  );

export const retirementWithdrawalSeoRecords: RetirementWithdrawalSeoRecord[] =
  portfolioWithdrawalPairs.flatMap(
    ({ portfolioValue, annualWithdrawalAmount }) =>
      assumptionSets.map(
        ({ expectedAnnualReturnPercent, inflationRatePercent, years }) =>
          withdrawalRecord(
            portfolioValue,
            annualWithdrawalAmount,
            expectedAnnualReturnPercent,
            inflationRatePercent,
            years,
            portfolioValue === 1000000 &&
              annualWithdrawalAmount === 40000 &&
              years === 30,
          ),
      ),
  );

export const featuredRetirementWithdrawalSeoRecords =
  retirementWithdrawalSeoRecords.filter((record) => record.featured);
