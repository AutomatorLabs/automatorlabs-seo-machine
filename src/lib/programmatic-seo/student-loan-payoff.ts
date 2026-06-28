import type { StudentLoanPayoffSeoRecord } from '../../data/programmatic-seo/student-loan-payoff';
import { calculateDebtPayoff } from '../math';
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

const clusterPath = 'calculators/student-loan-payoff';

export function createStudentLoanPayoffCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: StudentLoanPayoffSeoRecord,
  records: StudentLoanPayoffSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.studentLoanBalance - record.studentLoanBalance) / Math.max(record.studentLoanBalance, 1) +
        Math.abs(candidate.currentMonthlyPayment - record.currentMonthlyPayment) / 50 +
        Math.abs(candidate.extraMonthlyPayment - record.extraMonthlyPayment) / 50,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createStudentLoanPayoffCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.studentLoanBalance)} balance, ${candidate.annualInterestRatePercent}% rate, ${currency.format(candidate.currentMonthlyPayment)} current payment, ${currency.format(candidate.extraMonthlyPayment)} extra.`,
    }));
}

export function createStudentLoanPayoffSeoPage(
  record: StudentLoanPayoffSeoRecord,
  records: StudentLoanPayoffSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateDebtPayoff({
    debtBalance: record.studentLoanBalance,
    annualInterestRatePercent: record.annualInterestRatePercent,
    monthlyPayment: record.currentMonthlyPayment,
    extraMonthlyPayment: record.extraMonthlyPayment,
  });
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${currency.format(record.studentLoanBalance)} in student loans at ${record.annualInterestRatePercent}% with ${currency.format(record.currentMonthlyPayment)} monthly payments and ${currency.format(record.extraMonthlyPayment)} extra.`,
  });

  return {
    slug: record.slug,
    url: createStudentLoanPayoffCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Student loan payoff example',
    intro: `This worked example compares a current student loan payment with an accelerated version that adds extra principal each month.`,
    summary: `On a ${currency.format(record.studentLoanBalance)} balance at ${record.annualInterestRatePercent}% interest, the baseline payment is ${currency.format(record.currentMonthlyPayment)} per month. Adding ${currency.format(record.extraMonthlyPayment)} extra changes the payoff path to ${result.accelerated.payoffTimeMonths ?? 0} months and an estimated interest cost of ${result.accelerated.totalInterestPaid == null ? 'no finite payoff under the current assumptions' : currency.format(result.accelerated.totalInterestPaid)}.`,
    results: [
      { label: 'Current-payment payoff time', value: result.baseline.payoffTimeMonths == null ? 'Not reached' : `${result.baseline.payoffTimeMonths} months`, primary: true },
      { label: 'Accelerated payoff time', value: result.accelerated.payoffTimeMonths == null ? 'Not reached' : `${result.accelerated.payoffTimeMonths} months` },
      { label: 'Accelerated interest cost', value: result.accelerated.totalInterestPaid == null ? 'Not reached' : currency.format(result.accelerated.totalInterestPaid) },
      { label: 'Interest saved', value: result.interestSaved == null ? 'No finite payoff path' : currency.format(result.interestSaved) },
    ],
    formula: {
      heading: 'How This Student Loan Payoff Example Works',
      expression: 'Current payment vs current payment plus extra principal',
      explanation:
        'The shared debt-payoff simulation compares the existing payment with an accelerated payment to estimate whether the extra amount meaningfully changes the timeline.',
      steps: [
        `Start with ${currency.format(record.studentLoanBalance)} at ${record.annualInterestRatePercent}% interest.`,
        `Run the balance using the current payment of ${currency.format(record.currentMonthlyPayment)}.`,
        `Run a second version using ${currency.format(record.currentMonthlyPayment + record.extraMonthlyPayment)} each month.`,
        'Compare payoff timing and interest between the two schedules.',
      ],
    },
    showChart: false,
    projectionHeading: 'Student Loan Payoff Comparison',
    projectionRows: [],
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What this payoff framing answers',
        paragraphs: [
          'This example is useful when you already know the current payment and want to see whether adding more each month could materially change the timeline.',
          'That makes it a useful complement to the broader student loan calculator, which starts from the original balance, rate, and term.',
        ],
      },
    ],
    faq: [
      {
        question: 'What if the current payment does not create a payoff path?',
        answer:
          'The example will show that the baseline payment does not fully retire the balance under the current assumptions. An extra payment may create a payoff path, but that still depends on the amount.',
      },
      {
        question: 'Does this include forgiveness or subsidy rules?',
        answer:
          'No. It is a simple payoff example focused on balance, rate, payment, and extra principal.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Student Loan Payoff Calculator', url: '/calculators/student-loan-payoff-calculator/' },
      { name: 'Examples', url: '/calculators/student-loan-payoff/examples/' },
      { name: record.question, url: createStudentLoanPayoffCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Student Loan Payoff Calculator',
        url: '/calculators/student-loan-payoff-calculator/',
        description: 'Compare a current payment with an accelerated student loan payoff plan.',
      },
      {
        title: 'Student Loan Calculator',
        url: '/calculators/student-loan-calculator/',
        description: 'Start from the original balance, rate, term, and extra-payment assumptions.',
      },
      {
        title: 'Debt Payoff Calculator',
        url: '/calculators/debt-payoff-calculator/',
        description: 'Compare the same payoff logic in a more generic debt setting.',
      },
    ],
    relatedGuides: [
      {
        title: 'Debt Payoff Guide',
        url: '/guides/debt-payoff/',
        description: 'See how student debt fits into a larger payoff and cash-flow plan.',
      },
      {
        title: 'Debt Payoff and Credit Card Planning Hub',
        url: '/guides/debt/',
        description: 'Explore related debt calculators, examples, and payoff methods.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Student Loan Payoff Plan',
      description: 'Use the full calculator to change the balance, rate, current payment, and extra amount.',
      url: '/calculators/student-loan-payoff-calculator/',
      label: 'Open the Student Loan Payoff Calculator',
      examplesUrl: '/calculators/student-loan-payoff/examples/',
      examplesLabel: 'Browse All Student Loan Payoff Examples',
    },
    relatedPagesHeading: 'Related Student Loan Payoff Examples',
  };
}

export function auditStudentLoanPayoffSeoRecords(
  records: StudentLoanPayoffSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'student loan payoff',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.studentLoanBalance} balance, ${record.annualInterestRatePercent}% rate, ${record.currentMonthlyPayment} monthly payment, and ${record.extraMonthlyPayment} extra monthly.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createStudentLoanPayoffCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createStudentLoanPayoffCanonicalPath,
  });
}
