import type { StudentLoanSeoRecord } from '../../data/programmatic-seo/student-loan';
import { calculateMortgagePayoff } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type { ProgrammaticSeoLink, ProgrammaticSeoPageModel } from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const clusterPath = 'calculators/student-loan';

export function createStudentLoanCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

type StudentExtraPaymentProfile = 'none' | 'modest' | 'moderate' | 'aggressive';
type StudentBalanceProfile = 'small' | 'moderate' | 'large';

function studentExtraPaymentProfile(
  record: StudentLoanSeoRecord,
): StudentExtraPaymentProfile {
  if (record.monthlyExtraPayment === 0) return 'none';
  if (record.monthlyExtraPayment <= 50) return 'modest';
  if (record.monthlyExtraPayment <= 150) return 'moderate';
  return 'aggressive';
}

function studentBalanceProfile(
  record: StudentLoanSeoRecord,
): StudentBalanceProfile {
  if (record.studentLoanBalance <= 20000) return 'small';
  if (record.studentLoanBalance <= 45000) return 'moderate';
  return 'large';
}

function studentExtraPaymentFraming(profile: StudentExtraPaymentProfile): string {
  switch (profile) {
    case 'none':
      return 'This example uses the standard scheduled payment with no extra principal, so it shows the baseline timeline before any acceleration strategy.';
    case 'modest':
      return 'A modest extra payment like this one produces a gradual but real reduction in payoff time and total interest.';
    case 'moderate':
      return 'A moderate extra payment like this one is usually large enough to meaningfully shorten the payoff timeline.';
    case 'aggressive':
      return 'An aggressive extra payment like this one can substantially cut both the payoff time and the total interest paid.';
  }
}

function studentBalanceFraming(profile: StudentBalanceProfile): string {
  switch (profile) {
    case 'small':
      return 'A balance in this range is often manageable on a standard term even without extra payments.';
    case 'moderate':
      return 'A balance in this range benefits noticeably from extra payments, since there is a meaningful amount of interest still ahead.';
    case 'large':
      return 'A larger balance like this one means even small extra payments can add up to substantial interest savings over the full repayment period.';
  }
}

function studentBalanceSectionFraming(profile: StudentBalanceProfile): string {
  switch (profile) {
    case 'small':
      return 'Smaller balances like this one are often paid off well within a standard term, so the case for extra payments usually comes down to interest saved rather than avoiding a long repayment tail.';
    case 'moderate':
      return 'Mid-sized balances like this one sit at a point where extra payments start to meaningfully shorten the repayment period without requiring a large monthly commitment.';
    case 'large':
      return 'Larger balances like this one carry more total interest at stake, so even a modest extra payment strategy can be worth comparing against other financial goals.';
  }
}

function studentExtraPaymentSectionFraming(profile: StudentExtraPaymentProfile): string {
  switch (profile) {
    case 'none':
      return 'Without an extra payment, this example shows what the standard schedule alone produces, which is a useful baseline before testing acceleration strategies.';
    case 'modest':
      return 'A smaller extra payment strategy like this one is a reasonable starting point for borrowers who are still building other savings.';
    case 'moderate':
      return 'A mid-sized extra payment strategy like this one balances faster payoff against keeping room in the budget for other goals.';
    case 'aggressive':
      return 'A larger extra payment strategy like this one prioritizes paying off the loan quickly, which may trade off against other uses for the same money.';
  }
}

function studentExtraPaymentFaqFraming(profile: StudentExtraPaymentProfile): string {
  switch (profile) {
    case 'none':
      return 'No extra payment is applied in this example, so it reflects the standard scheduled repayment only.';
    case 'modest':
      return "It's on the smaller end of the extra payments modeled across this cluster of examples, but it still compounds into real savings over the repayment period.";
    case 'moderate':
      return 'It falls in the middle of the extra payments modeled across this cluster of examples.';
    case 'aggressive':
      return "It's on the larger end of the extra payments modeled across this cluster of examples, so it is worth weighing against other financial priorities.";
  }
}

function createRelatedPages(
  record: StudentLoanSeoRecord,
  records: StudentLoanSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.studentLoanBalance - record.studentLoanBalance) / Math.max(record.studentLoanBalance, 1) +
        Math.abs(candidate.loanTermYears - record.loanTermYears) +
        Math.abs(candidate.monthlyExtraPayment - record.monthlyExtraPayment) / 50,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createStudentLoanCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.studentLoanBalance)} balance, ${candidate.annualInterestRatePercent}% rate, ${candidate.loanTermYears}-year term, ${currency.format(candidate.monthlyExtraPayment)} extra.`,
    }));
}

export function createStudentLoanSeoPage(
  record: StudentLoanSeoRecord,
  records: StudentLoanSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateMortgagePayoff({
    loanAmount: record.studentLoanBalance,
    annualInterestRatePercent: record.annualInterestRatePercent,
    loanTermYears: record.loanTermYears,
    extraMonthlyPayment: record.monthlyExtraPayment,
  });
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${currency.format(record.studentLoanBalance)} in student loans at ${record.annualInterestRatePercent}% over ${record.loanTermYears} years with ${currency.format(record.monthlyExtraPayment)} extra monthly.`,
  });
  const extraProfile = studentExtraPaymentProfile(record);
  const balanceProfile = studentBalanceProfile(record);

  return {
    slug: record.slug,
    url: createStudentLoanCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Student loan example',
    intro: `This worked example estimates how a ${currency.format(record.studentLoanBalance)} student loan could behave under a fixed repayment term and an optional extra monthly payment. ${studentBalanceFraming(balanceProfile)} ${studentExtraPaymentFraming(extraProfile)}`,
    summary: `At ${record.annualInterestRatePercent}% interest over ${record.loanTermYears} years, the scheduled payment starts near ${currency.format(result.requiredMonthlyPayment)} per month. Adding ${currency.format(record.monthlyExtraPayment)} extra each month produces an estimated payoff time of ${result.payoffTimeMonths} months and about ${currency.format(result.interestSaved)} in reduced interest.`,
    results: [
      { label: 'Required monthly payment', value: currency.format(result.requiredMonthlyPayment), primary: true },
      { label: 'Estimated payoff time', value: `${result.payoffTimeMonths} months` },
      { label: 'Estimated total interest', value: currency.format(result.totalInterestPaid) },
      { label: 'Interest saved with extra payment', value: currency.format(result.interestSaved) },
    ],
    formula: {
      heading: 'How This Student Loan Example Works',
      expression: 'Fixed-rate loan payment + optional extra payment = faster student loan payoff',
      explanation:
        'The example reuses the site’s fixed-rate payoff math to compare a standard term with a version that adds extra monthly principal.',
      steps: [
        `Start with ${currency.format(record.studentLoanBalance)} in student debt.`,
        `Apply ${record.annualInterestRatePercent}% interest over ${record.loanTermYears} years.`,
        `Compute the required payment, then add ${currency.format(record.monthlyExtraPayment)} extra each month.`,
        'Compare the payoff time and total interest with the baseline schedule.',
      ],
    },
    showChart: false,
    projectionHeading: 'Student Loan Payoff Comparison',
    projectionRows: [],
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why student loan scenarios need context',
        paragraphs: [
          'Student loan decisions often compete with emergency savings, employer match, and other financial goals.',
          'That makes worked examples useful for pressure-testing whether extra payments are likely to create meaningful time or interest savings.',
          studentBalanceSectionFraming(balanceProfile),
          studentExtraPaymentSectionFraming(extraProfile),
        ],
      },
    ],
    faq: [
      {
        question: 'Does this model income-driven or forgiveness programs?',
        answer:
          'No. It is a fixed-rate repayment example and does not include IDR formulas, forgiveness, deferment, subsidies, or variable-rate changes.',
      },
      {
        question: 'Can extra payments always be applied to principal?',
        answer:
          'Servicer practices vary, so borrowers should confirm how extra payments are applied and whether special instructions are needed.',
      },
      {
        question: `Is ${currency.format(record.monthlyExtraPayment)} extra a small or large payment in this example?`,
        answer: studentExtraPaymentFaqFraming(extraProfile),
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Student Loan Calculator', url: '/calculators/student-loan-calculator/' },
      { name: 'Examples', url: '/calculators/student-loan/examples/' },
      { name: record.question, url: createStudentLoanCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Student Loan Calculator',
        url: '/calculators/student-loan-calculator/',
        description: 'Model your own balance, rate, term, and extra-payment assumptions.',
      },
      {
        title: 'Student Loan Payoff Calculator',
        url: '/calculators/student-loan-payoff-calculator/',
        description: 'Compare a current monthly payment with a payoff plan that adds extra principal.',
      },
      {
        title: 'Loan Payment Calculator',
        url: '/calculators/loan-payment-calculator/',
        description: 'Compare student-loan framing with a more generic fixed-rate loan scenario.',
      },
    ],
    relatedGuides: [
      {
        title: 'Debt Payoff Guide',
        url: '/guides/debt-payoff/',
        description: 'See how student debt fits into a broader repayment plan.',
      },
      {
        title: 'Debt Payoff and Credit Card Planning Hub',
        url: '/guides/debt/',
        description: 'Connect student debt scenarios with other payoff tools and strategies.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Student Loan Scenario',
      description: 'Use the full calculator to change the balance, rate, term, and extra-payment amount.',
      url: '/calculators/student-loan-calculator/',
      label: 'Open the Student Loan Calculator',
      examplesUrl: '/calculators/student-loan/examples/',
      examplesLabel: 'Browse All Student Loan Examples',
    },
    relatedPagesHeading: 'Related Student Loan Examples',
  };
}

export function auditStudentLoanSeoRecords(
  records: StudentLoanSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'student loan',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.studentLoanBalance} balance, ${record.annualInterestRatePercent}% rate, ${record.loanTermYears} years, and ${record.monthlyExtraPayment} extra monthly.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createStudentLoanCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createStudentLoanCanonicalPath,
  });
}
