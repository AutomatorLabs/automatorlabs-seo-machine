export interface StudentLoanSeoRecord {
  slug: string;
  question: string;
  studentLoanBalance: number;
  annualInterestRatePercent: number;
  loanTermYears: number;
  monthlyExtraPayment: number;
  featured?: boolean;
}

export const EXPECTED_STUDENT_LOAN_SEO_PAGE_COUNT = 200;

const studentRateSlug = (value: number) => value.toString().replace('.', '-');
const studentMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function studentLoanRecord(
  studentLoanBalance: number,
  annualInterestRatePercent: number,
  loanTermYears: number,
  monthlyExtraPayment: number,
  featured = false,
): StudentLoanSeoRecord {
  return {
    slug: `student-loan-${studentLoanBalance}-at-${studentRateSlug(annualInterestRatePercent)}-percent-for-${loanTermYears}-years-with-${monthlyExtraPayment}-extra`,
    question: `What Happens to ${studentMoney(studentLoanBalance)} in Student Loans at ${annualInterestRatePercent}% Over ${loanTermYears} Years With ${studentMoney(monthlyExtraPayment)} Extra Monthly?`,
    studentLoanBalance,
    annualInterestRatePercent,
    loanTermYears,
    monthlyExtraPayment,
    featured,
  };
}

const studentBalances = [
  10000, 12500, 15000, 17500, 20000,
  22500, 25000, 27500, 30000, 32500,
  35000, 37500, 40000, 42500, 45000,
  47500, 50000, 52500, 55000, 57500,
  60000, 62500, 65000, 70000, 75000,
];
const studentAssumptions = [
  { annualInterestRatePercent: 4.5, loanTermYears: 5, monthlyExtraPayment: 0 },
  { annualInterestRatePercent: 5, loanTermYears: 7, monthlyExtraPayment: 25 },
  { annualInterestRatePercent: 5.5, loanTermYears: 10, monthlyExtraPayment: 50 },
  { annualInterestRatePercent: 6, loanTermYears: 10, monthlyExtraPayment: 100 },
  { annualInterestRatePercent: 6.5, loanTermYears: 12, monthlyExtraPayment: 150 },
  { annualInterestRatePercent: 7, loanTermYears: 15, monthlyExtraPayment: 200 },
  { annualInterestRatePercent: 7.5, loanTermYears: 20, monthlyExtraPayment: 250 },
  { annualInterestRatePercent: 8, loanTermYears: 20, monthlyExtraPayment: 300 },
];

export const studentLoanSeoRecords: StudentLoanSeoRecord[] =
  studentBalances.flatMap((studentLoanBalance) =>
    studentAssumptions.map((assumption) =>
      studentLoanRecord(
        studentLoanBalance,
        assumption.annualInterestRatePercent,
        assumption.loanTermYears,
        assumption.monthlyExtraPayment,
        studentLoanBalance === 40000 &&
          assumption.annualInterestRatePercent === 6,
      ),
    ),
  );

export const featuredStudentLoanSeoRecords = studentLoanSeoRecords.filter(
  (record) => record.featured,
);
