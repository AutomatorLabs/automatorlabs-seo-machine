export interface MortgagePayoffSeoRecord {
  slug: string;
  question: string;
  loanAmount: number;
  annualInterestRatePercent: number;
  loanTermYears: number;
  extraMonthlyPayment: number;
  featured?: boolean;
}

export const EXPECTED_MORTGAGE_PAYOFF_SEO_PAGE_COUNT = 200;

const mortgageRateSlug = (value: number) => value.toString().replace('.', '-');
const mortgageMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function mortgagePayoffRecord(
  loanAmount: number,
  annualInterestRatePercent: number,
  loanTermYears: number,
  extraMonthlyPayment: number,
  featured = false,
): MortgagePayoffSeoRecord {
  return {
    slug: `mortgage-payoff-${loanAmount}-at-${mortgageRateSlug(annualInterestRatePercent)}-percent-for-${loanTermYears}-years-with-${extraMonthlyPayment}-extra`,
    question: `How Fast Could ${mortgageMoney(loanAmount)} Be Paid Off at ${annualInterestRatePercent}% Over ${loanTermYears} Years With ${mortgageMoney(extraMonthlyPayment)} Extra Monthly?`,
    loanAmount,
    annualInterestRatePercent,
    loanTermYears,
    extraMonthlyPayment,
    featured,
  };
}

const mortgageAmounts = [150000, 250000, 350000, 500000, 750000];
const mortgageExtraPayments = [100, 200, 300, 500, 750];
const mortgageAssumptions = [
  { annualInterestRatePercent: 5.5, loanTermYears: 15 },
  { annualInterestRatePercent: 6, loanTermYears: 15 },
  { annualInterestRatePercent: 5.75, loanTermYears: 20 },
  { annualInterestRatePercent: 6.25, loanTermYears: 20 },
  { annualInterestRatePercent: 6, loanTermYears: 30 },
  { annualInterestRatePercent: 6.5, loanTermYears: 30 },
  { annualInterestRatePercent: 6.75, loanTermYears: 30 },
  { annualInterestRatePercent: 7, loanTermYears: 30 },
];

export const mortgagePayoffSeoRecords: MortgagePayoffSeoRecord[] =
  mortgageAmounts.flatMap((loanAmount) =>
    mortgageExtraPayments.flatMap((extraMonthlyPayment) =>
      mortgageAssumptions.map((assumption) =>
        mortgagePayoffRecord(
          loanAmount,
          assumption.annualInterestRatePercent,
          assumption.loanTermYears,
          extraMonthlyPayment,
          loanAmount === 350000 &&
            extraMonthlyPayment === 300 &&
            assumption.annualInterestRatePercent === 6.5 &&
            assumption.loanTermYears === 30,
        ),
      ),
    ),
  );

export const featuredMortgagePayoffSeoRecords = mortgagePayoffSeoRecords.filter(
  (record) => record.featured,
);
