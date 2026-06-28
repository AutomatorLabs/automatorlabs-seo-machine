export interface LoanPaymentSeoRecord {
  slug: string;
  question: string;
  loanAmount: number;
  annualInterestRatePercent: number;
  loanTermYears: number;
  extraMonthlyPayment: number;
  featured?: boolean;
}

export const EXPECTED_LOAN_PAYMENT_SEO_PAGE_COUNT = 200;

const rateSlug = (value: number) => value.toString().replace('.', '-');
const money = (value: number) => `$${value.toLocaleString('en-US')}`;

function loanPaymentRecord(
  loanAmount: number,
  annualInterestRatePercent: number,
  loanTermYears: number,
  extraMonthlyPayment: number,
  featured = false,
): LoanPaymentSeoRecord {
  return {
    slug: `loan-payment-${loanAmount}-at-${rateSlug(annualInterestRatePercent)}-percent-for-${loanTermYears}-years-with-${extraMonthlyPayment}-extra`,
    question: `What Is the Payment on ${money(loanAmount)} at ${annualInterestRatePercent}% for ${loanTermYears} Years With ${money(extraMonthlyPayment)} Extra Each Month?`,
    loanAmount,
    annualInterestRatePercent,
    loanTermYears,
    extraMonthlyPayment,
    featured,
  };
}

const loanAmounts = [
  5000, 6500, 8000, 9500, 10000,
  11500, 13000, 14500, 16000, 17500,
  19000, 20500, 22000, 23500, 25000,
  27500, 30000, 32500, 35000, 37500,
  40000, 42500, 45000, 47500, 50000,
];
const loanAssumptions = [
  { annualInterestRatePercent: 4.5, loanTermYears: 2, extraMonthlyPayment: 0 },
  { annualInterestRatePercent: 5.5, loanTermYears: 3, extraMonthlyPayment: 25 },
  { annualInterestRatePercent: 6.5, loanTermYears: 4, extraMonthlyPayment: 50 },
  { annualInterestRatePercent: 7.5, loanTermYears: 5, extraMonthlyPayment: 75 },
  { annualInterestRatePercent: 8.5, loanTermYears: 6, extraMonthlyPayment: 100 },
  { annualInterestRatePercent: 9.5, loanTermYears: 7, extraMonthlyPayment: 125 },
  { annualInterestRatePercent: 10.5, loanTermYears: 8, extraMonthlyPayment: 150 },
  { annualInterestRatePercent: 11.5, loanTermYears: 10, extraMonthlyPayment: 200 },
];

export const loanPaymentSeoRecords: LoanPaymentSeoRecord[] = loanAmounts.flatMap(
  (loanAmount) =>
    loanAssumptions.map((assumption) =>
      loanPaymentRecord(
        loanAmount,
        assumption.annualInterestRatePercent,
        assumption.loanTermYears,
        assumption.extraMonthlyPayment,
        loanAmount === 10000 &&
          assumption.annualInterestRatePercent === 6.5 &&
          assumption.loanTermYears === 4,
      ),
    ),
);

export const featuredLoanPaymentSeoRecords = loanPaymentSeoRecords.filter(
  (record) => record.featured,
);
