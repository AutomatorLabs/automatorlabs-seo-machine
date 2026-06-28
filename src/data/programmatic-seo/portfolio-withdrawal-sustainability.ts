export interface PortfolioWithdrawalSustainabilitySeoRecord {
  slug: string;
  question: string;
  portfolioValue: number;
  annualWithdrawalAmount: number;
  expectedAnnualReturnPercent: number;
  inflationRatePercent: number;
  years: number;
  featured?: boolean;
}

export const EXPECTED_PORTFOLIO_WITHDRAWAL_SUSTAINABILITY_SEO_PAGE_COUNT =
  200;

const rateSlug = (value: number) => value.toString().replace('.', '-');
const yearsMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function portfolioWithdrawalSustainabilityRecord(
  portfolioValue: number,
  annualWithdrawalAmount: number,
  years: number,
  expectedAnnualReturnPercent: number,
  inflationRatePercent: number,
  featured = false,
): PortfolioWithdrawalSustainabilitySeoRecord {
  return {
    slug: `portfolio-withdrawal-sustainability-${portfolioValue}-with-${annualWithdrawalAmount}-annual-for-${years}-years-at-${rateSlug(expectedAnnualReturnPercent)}-return-${rateSlug(inflationRatePercent)}-inflation`,
    question: `Will ${yearsMoney(portfolioValue)} Last With ${yearsMoney(annualWithdrawalAmount)} Withdrawn Each Year for ${years} Years at ${expectedAnnualReturnPercent}% Return and ${inflationRatePercent}% Inflation?`,
    portfolioValue,
    annualWithdrawalAmount,
    expectedAnnualReturnPercent,
    inflationRatePercent,
    years,
    featured,
  };
}

const pwsPortfolioValues = [750000, 1000000, 1500000, 2000000, 3000000];
const pwsWithdrawals = [30000, 50000, 75000, 100000];
const pwsYears = [20, 30];
const pwsAssumptions = [
  { expectedAnnualReturnPercent: 5, inflationRatePercent: 2 },
  { expectedAnnualReturnPercent: 6, inflationRatePercent: 2.5 },
  { expectedAnnualReturnPercent: 6, inflationRatePercent: 3 },
  { expectedAnnualReturnPercent: 7, inflationRatePercent: 2.5 },
  { expectedAnnualReturnPercent: 7, inflationRatePercent: 3 },
];

export const portfolioWithdrawalSustainabilitySeoRecords: PortfolioWithdrawalSustainabilitySeoRecord[] =
  pwsPortfolioValues.flatMap((portfolioValue) =>
    pwsWithdrawals.flatMap((annualWithdrawalAmount) =>
      pwsYears.flatMap((years) =>
        pwsAssumptions.map((assumption) =>
          portfolioWithdrawalSustainabilityRecord(
            portfolioValue,
            annualWithdrawalAmount,
            years,
            assumption.expectedAnnualReturnPercent,
            assumption.inflationRatePercent,
            portfolioValue === 1000000 &&
              annualWithdrawalAmount === 40000 ? false : portfolioValue ===
                1000000 &&
              annualWithdrawalAmount === 50000 &&
              years === 30 &&
              assumption.expectedAnnualReturnPercent === 7 &&
              assumption.inflationRatePercent === 3,
          ),
        ),
      ),
    ),
  );

export const featuredPortfolioWithdrawalSustainabilitySeoRecords =
  portfolioWithdrawalSustainabilitySeoRecords.filter(
    (record) => record.featured,
  );
