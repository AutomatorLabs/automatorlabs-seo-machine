import type { DebtPayoffSeoRecord } from '../../data/programmatic-seo/debt-payoff';
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

const clusterPath = 'calculators/debt-payoff';

export function createDebtPayoffCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: DebtPayoffSeoRecord,
  records: DebtPayoffSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.debtBalance - record.debtBalance) / Math.max(record.debtBalance, 1) +
        Math.abs(candidate.monthlyPayment - record.monthlyPayment) / 50 +
        Math.abs(candidate.extraMonthlyPayment - record.extraMonthlyPayment) / 50,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createDebtPayoffCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.debtBalance)} balance, ${candidate.annualInterestRatePercent}% APR, ${currency.format(candidate.monthlyPayment)} payment, ${currency.format(candidate.extraMonthlyPayment)} extra.`,
    }));
}

export function createDebtPayoffSeoPage(
  record: DebtPayoffSeoRecord,
  records: DebtPayoffSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateDebtPayoff({
    debtBalance: record.debtBalance,
    annualInterestRatePercent: record.annualInterestRatePercent,
    monthlyPayment: record.monthlyPayment,
    extraMonthlyPayment: record.extraMonthlyPayment,
  });
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${currency.format(record.debtBalance)} at ${record.annualInterestRatePercent}% APR with ${currency.format(record.monthlyPayment)} monthly payments and ${currency.format(record.extraMonthlyPayment)} extra principal.`,
  });

  return {
    slug: record.slug,
    url: createDebtPayoffCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Debt payoff example',
    intro: `This worked example shows how a recurring payment and optional extra principal can change the payoff path on a ${currency.format(record.debtBalance)} debt balance.`,
    summary: `With ${currency.format(record.monthlyPayment)} monthly payments and ${currency.format(record.extraMonthlyPayment)} in extra principal, the accelerated schedule reaches payoff in ${result.accelerated.payoffTimeMonths ?? 0} months and saves about ${currency.format(result.interestSaved ?? 0)} in interest compared with the baseline payment.`,
    results: [
      { label: 'Baseline payoff time', value: result.baseline.payoffTimeMonths == null ? 'Not reached' : `${result.baseline.payoffTimeMonths} months`, primary: true },
      { label: 'Accelerated payoff time', value: result.accelerated.payoffTimeMonths == null ? 'Not reached' : `${result.accelerated.payoffTimeMonths} months` },
      { label: 'Accelerated interest cost', value: result.accelerated.totalInterestPaid == null ? 'Not reached' : currency.format(result.accelerated.totalInterestPaid) },
      { label: 'Interest saved', value: result.interestSaved == null ? 'No finite payoff path' : currency.format(result.interestSaved) },
    ],
    formula: {
      heading: 'How This Debt Payoff Example Works',
      expression: 'Monthly interest accrues on the balance, then payments and extra principal reduce the debt',
      explanation:
        'The shared debt-payoff math simulates the baseline payment and an accelerated payment with extra principal to compare payoff timing and total interest.',
      steps: [
        `Start with a debt balance of ${currency.format(record.debtBalance)} at ${record.annualInterestRatePercent}% APR.`,
        `Apply the baseline payment of ${currency.format(record.monthlyPayment)} each month.`,
        `Run a second schedule using ${currency.format(record.monthlyPayment + record.extraMonthlyPayment)} each month.`,
        'Compare the payoff month and total interest between the two schedules.',
      ],
    },
    showChart: false,
    projectionHeading: 'Debt Payoff Comparison',
    projectionRows: [],
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why payment size matters',
        paragraphs: [
          'A debt payoff plan can look very different when the payment is only slightly above monthly interest versus meaningfully above it.',
          'That is why worked examples are helpful for comparing whether the current payment is merely maintaining the balance or actually accelerating progress.',
        ],
      },
    ],
    faq: [
      {
        question: 'What if the payment does not create a payoff path?',
        answer:
          'If the payment is too low to outpace interest, the model reports that the debt is not paid off under the current assumptions.',
      },
      {
        question: 'Does this include fees or new charges?',
        answer:
          'No. It assumes no new borrowing, late fees, penalty APR changes, or one-time charges while the balance is being repaid.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Debt Payoff Calculator', url: '/calculators/debt-payoff-calculator/' },
      { name: 'Examples', url: '/calculators/debt-payoff/examples/' },
      { name: record.question, url: createDebtPayoffCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Debt Payoff Calculator',
        url: '/calculators/debt-payoff-calculator/',
        description: 'Model your own balance, APR, payment, and extra-payment plan.',
      },
      {
        title: 'Debt Snowball Calculator',
        url: '/calculators/debt-snowball-calculator/',
        description: 'Compare single-balance payoff math with a multi-debt smallest-balance strategy.',
      },
      {
        title: 'Debt Avalanche Calculator',
        url: '/calculators/debt-avalanche-calculator/',
        description: 'Compare single-balance payoff math with a highest-interest-first multi-debt plan.',
      },
    ],
    relatedGuides: [
      {
        title: 'Debt Payoff Guide',
        url: '/guides/debt-payoff/',
        description: 'Build a practical repayment plan that fits a real monthly budget.',
      },
      {
        title: 'Debt Payoff and Credit Card Planning Hub',
        url: '/guides/debt/',
        description: 'Explore the larger debt calculator and guide ecosystem around payoff planning.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Debt Payoff Plan',
      description: 'Use the full calculator to change the balance, APR, payment, and extra-payment strategy.',
      url: '/calculators/debt-payoff-calculator/',
      label: 'Open the Debt Payoff Calculator',
      examplesUrl: '/calculators/debt-payoff/examples/',
      examplesLabel: 'Browse All Debt Payoff Examples',
    },
    relatedPagesHeading: 'Related Debt Payoff Examples',
  };
}

export function auditDebtPayoffSeoRecords(
  records: DebtPayoffSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'debt payoff',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.debtBalance} balance, ${record.annualInterestRatePercent}% APR, ${record.monthlyPayment} monthly payment, and ${record.extraMonthlyPayment} extra monthly.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createDebtPayoffCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createDebtPayoffCanonicalPath,
  });
}
