export interface AutoLoanSeoRecord {
  slug: string;
  question: string;
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxRatePercent: number;
  loanTermYears: number;
  annualInterestRatePercent: number;
  featured?: boolean;
}

export const EXPECTED_AUTO_LOAN_SEO_PAGE_COUNT = 200;

const rateSlug = (value: number) => value.toString().replace('.', '-');
const money = (value: number) => `$${value.toLocaleString('en-US')}`;

function autoLoanRecord(
  vehiclePrice: number,
  downPayment: number,
  tradeInValue: number,
  salesTaxRatePercent: number,
  loanTermYears: number,
  annualInterestRatePercent: number,
  featured = false,
): AutoLoanSeoRecord {
  return {
    slug: `auto-loan-${vehiclePrice}-price-${downPayment}-down-${tradeInValue}-trade-in-${rateSlug(annualInterestRatePercent)}-percent-for-${loanTermYears}-years`,
    question: `What Is the Auto Loan Payment on ${money(vehiclePrice)} With ${money(downPayment)} Down, ${money(tradeInValue)} Trade-In, and ${annualInterestRatePercent}% for ${loanTermYears} Years?`,
    vehiclePrice,
    downPayment,
    tradeInValue,
    salesTaxRatePercent,
    loanTermYears,
    annualInterestRatePercent,
    featured,
  };
}

const vehiclePrices = [20000, 30000, 40000, 55000, 70000];
const downPayments = [2000, 4000, 6000, 8000, 10000];
const autoAssumptions = [
  { tradeInValue: 0, salesTaxRatePercent: 4, loanTermYears: 3, annualInterestRatePercent: 4.5 },
  { tradeInValue: 1000, salesTaxRatePercent: 5, loanTermYears: 4, annualInterestRatePercent: 5 },
  { tradeInValue: 2000, salesTaxRatePercent: 6, loanTermYears: 5, annualInterestRatePercent: 5.5 },
  { tradeInValue: 3000, salesTaxRatePercent: 6.5, loanTermYears: 5, annualInterestRatePercent: 6 },
  { tradeInValue: 4000, salesTaxRatePercent: 7, loanTermYears: 6, annualInterestRatePercent: 6.5 },
  { tradeInValue: 5000, salesTaxRatePercent: 7.5, loanTermYears: 6, annualInterestRatePercent: 7 },
  { tradeInValue: 6000, salesTaxRatePercent: 8, loanTermYears: 7, annualInterestRatePercent: 7.5 },
  { tradeInValue: 8000, salesTaxRatePercent: 8.5, loanTermYears: 7, annualInterestRatePercent: 8 },
];

export const autoLoanSeoRecords: AutoLoanSeoRecord[] = vehiclePrices.flatMap(
  (vehiclePrice) =>
    downPayments.flatMap((downPayment) =>
      autoAssumptions.map((assumption) =>
        autoLoanRecord(
          vehiclePrice,
          Math.min(downPayment, vehiclePrice - assumption.tradeInValue),
          assumption.tradeInValue,
          assumption.salesTaxRatePercent,
          assumption.loanTermYears,
          assumption.annualInterestRatePercent,
          vehiclePrice === 30000 &&
            downPayment === 6000 &&
            assumption.loanTermYears === 5 &&
            assumption.annualInterestRatePercent === 5.5,
        ),
      ),
    ),
);

export const featuredAutoLoanSeoRecords = autoLoanSeoRecords.filter(
  (record) => record.featured,
);
