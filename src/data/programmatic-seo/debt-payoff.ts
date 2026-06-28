export interface DebtPayoffSeoRecord {
  slug: string;
  question: string;
  debtBalance: number;
  annualInterestRatePercent: number;
  monthlyPayment: number;
  extraMonthlyPayment: number;
  featured?: boolean;
}

export const EXPECTED_DEBT_PAYOFF_SEO_PAGE_COUNT = 200;

const debtRateSlug = (value: number) => value.toString().replace('.', '-');
const debtMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function debtPayoffRecord(
  debtBalance: number,
  annualInterestRatePercent: number,
  monthlyPayment: number,
  extraMonthlyPayment: number,
  featured = false,
): DebtPayoffSeoRecord {
  return {
    slug: `debt-payoff-${debtBalance}-at-${debtRateSlug(annualInterestRatePercent)}-percent-with-${monthlyPayment}-payment-and-${extraMonthlyPayment}-extra`,
    question: `How Long to Pay Off ${debtMoney(debtBalance)} at ${annualInterestRatePercent}% With ${debtMoney(monthlyPayment)} Payments and ${debtMoney(extraMonthlyPayment)} Extra?`,
    debtBalance,
    annualInterestRatePercent,
    monthlyPayment,
    extraMonthlyPayment,
    featured,
  };
}

const debtBalances = [
  3000, 4000, 5000, 6000, 7000,
  8000, 9000, 10000, 11000, 12000,
  13000, 14000, 15000, 16000, 17000,
  18000, 19000, 20000, 21000, 22000,
  23000, 24000, 25000, 26000, 27000,
];
const debtAssumptions = [
  { annualInterestRatePercent: 8, monthlyPayment: 100, extraMonthlyPayment: 0 },
  { annualInterestRatePercent: 10, monthlyPayment: 150, extraMonthlyPayment: 25 },
  { annualInterestRatePercent: 12, monthlyPayment: 200, extraMonthlyPayment: 50 },
  { annualInterestRatePercent: 15, monthlyPayment: 250, extraMonthlyPayment: 75 },
  { annualInterestRatePercent: 18, monthlyPayment: 300, extraMonthlyPayment: 100 },
  { annualInterestRatePercent: 20, monthlyPayment: 350, extraMonthlyPayment: 125 },
  { annualInterestRatePercent: 22, monthlyPayment: 400, extraMonthlyPayment: 150 },
  { annualInterestRatePercent: 24, monthlyPayment: 500, extraMonthlyPayment: 200 },
];

export const debtPayoffSeoRecords: DebtPayoffSeoRecord[] = debtBalances.flatMap(
  (debtBalance) =>
    debtAssumptions.map((assumption) =>
      debtPayoffRecord(
        debtBalance,
        assumption.annualInterestRatePercent,
        assumption.monthlyPayment,
        assumption.extraMonthlyPayment,
        debtBalance === 10000 &&
          assumption.annualInterestRatePercent === 15,
      ),
    ),
);

export const featuredDebtPayoffSeoRecords = debtPayoffSeoRecords.filter(
  (record) => record.featured,
);
