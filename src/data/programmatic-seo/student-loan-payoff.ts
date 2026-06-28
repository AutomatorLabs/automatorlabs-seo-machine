export interface StudentLoanPayoffSeoRecord {
  slug: string;
  question: string;
  studentLoanBalance: number;
  annualInterestRatePercent: number;
  currentMonthlyPayment: number;
  extraMonthlyPayment: number;
  featured?: boolean;
}

export const EXPECTED_STUDENT_LOAN_PAYOFF_SEO_PAGE_COUNT = 200;

const payoffStudentRateSlug = (value: number) => value.toString().replace('.', '-');
const payoffStudentMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function studentLoanPayoffRecord(
  studentLoanBalance: number,
  annualInterestRatePercent: number,
  currentMonthlyPayment: number,
  extraMonthlyPayment: number,
  featured = false,
): StudentLoanPayoffSeoRecord {
  return {
    slug: `student-loan-payoff-${studentLoanBalance}-at-${payoffStudentRateSlug(annualInterestRatePercent)}-percent-with-${currentMonthlyPayment}-payment-and-${extraMonthlyPayment}-extra`,
    question: `How Fast Could ${payoffStudentMoney(studentLoanBalance)} in Student Loans Be Paid Off at ${annualInterestRatePercent}% With ${payoffStudentMoney(currentMonthlyPayment)} Payments and ${payoffStudentMoney(extraMonthlyPayment)} Extra?`,
    studentLoanBalance,
    annualInterestRatePercent,
    currentMonthlyPayment,
    extraMonthlyPayment,
    featured,
  };
}

const payoffStudentBalances = [
  10000, 12500, 15000, 17500, 20000,
  22500, 25000, 27500, 30000, 32500,
  35000, 37500, 40000, 42500, 45000,
  47500, 50000, 52500, 55000, 57500,
  60000, 62500, 65000, 70000, 75000,
];
const payoffStudentAssumptions = [
  { annualInterestRatePercent: 4.5, currentMonthlyPayment: 125, extraMonthlyPayment: 0 },
  { annualInterestRatePercent: 5, currentMonthlyPayment: 175, extraMonthlyPayment: 25 },
  { annualInterestRatePercent: 5.5, currentMonthlyPayment: 225, extraMonthlyPayment: 50 },
  { annualInterestRatePercent: 6, currentMonthlyPayment: 275, extraMonthlyPayment: 75 },
  { annualInterestRatePercent: 6.5, currentMonthlyPayment: 325, extraMonthlyPayment: 100 },
  { annualInterestRatePercent: 7, currentMonthlyPayment: 400, extraMonthlyPayment: 125 },
  { annualInterestRatePercent: 7.5, currentMonthlyPayment: 475, extraMonthlyPayment: 150 },
  { annualInterestRatePercent: 8, currentMonthlyPayment: 550, extraMonthlyPayment: 200 },
];

export const studentLoanPayoffSeoRecords: StudentLoanPayoffSeoRecord[] =
  payoffStudentBalances.flatMap((studentLoanBalance) =>
    payoffStudentAssumptions.map((assumption) =>
      studentLoanPayoffRecord(
        studentLoanBalance,
        assumption.annualInterestRatePercent,
        assumption.currentMonthlyPayment,
        assumption.extraMonthlyPayment,
        studentLoanBalance === 30000 &&
          assumption.annualInterestRatePercent === 6,
      ),
    ),
  );

export const featuredStudentLoanPayoffSeoRecords =
  studentLoanPayoffSeoRecords.filter((record) => record.featured);
