import type { MortgagePayoffSeoRecord } from '../../data/programmatic-seo/mortgage-payoff';
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

const clusterPath = 'calculators/mortgage-payoff';

export function createMortgagePayoffCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: MortgagePayoffSeoRecord,
  records: MortgagePayoffSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.loanAmount - record.loanAmount) / Math.max(record.loanAmount, 1) +
        Math.abs(candidate.loanTermYears - record.loanTermYears) +
        Math.abs(candidate.extraMonthlyPayment - record.extraMonthlyPayment) / 100,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createMortgagePayoffCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.loanAmount)} mortgage, ${candidate.annualInterestRatePercent}% APR, ${candidate.loanTermYears}-year term, ${currency.format(candidate.extraMonthlyPayment)} extra monthly.`,
    }));
}

export function createMortgagePayoffSeoPage(
  record: MortgagePayoffSeoRecord,
  records: MortgagePayoffSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateMortgagePayoff({
    loanAmount: record.loanAmount,
    annualInterestRatePercent: record.annualInterestRatePercent,
    loanTermYears: record.loanTermYears,
    extraMonthlyPayment: record.extraMonthlyPayment,
  });
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${currency.format(record.loanAmount)} mortgage at ${record.annualInterestRatePercent}% over ${record.loanTermYears} years with ${currency.format(record.extraMonthlyPayment)} extra principal each month.`,
  });

  return {
    slug: record.slug,
    url: createMortgagePayoffCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Mortgage payoff example',
    intro: `This worked example shows how an extra-payment mortgage strategy changes the payoff timeline on a ${currency.format(record.loanAmount)} home loan.`,
    summary: `At ${record.annualInterestRatePercent}% APR on a ${record.loanTermYears}-year mortgage, the required payment starts near ${currency.format(result.requiredMonthlyPayment)} per month. Adding ${currency.format(record.extraMonthlyPayment)} extra principal each month creates an estimated time savings of ${result.timeSavedMonths} months and about ${currency.format(result.interestSaved)} in avoided interest.`,
    results: [
      { label: 'Required monthly payment', value: currency.format(result.requiredMonthlyPayment), primary: true },
      { label: 'Estimated payoff time', value: `${result.payoffTimeMonths} months` },
      { label: 'Time saved', value: `${result.timeSavedMonths} months` },
      { label: 'Interest saved', value: currency.format(result.interestSaved) },
    ],
    formula: {
      heading: 'How This Mortgage Payoff Example Works',
      expression: 'Baseline mortgage payment + extra principal = shorter amortization schedule',
      explanation:
        'The shared mortgage-payoff math compares the standard amortization schedule with an accelerated schedule that includes a fixed extra monthly payment.',
      steps: [
        `Calculate the required payment for ${currency.format(record.loanAmount)} over ${record.loanTermYears} years at ${record.annualInterestRatePercent}% APR.`,
        `Apply ${currency.format(record.extraMonthlyPayment)} in extra principal every month.`,
        'Recompute the payoff month, total interest, and total amount paid.',
        'Compare the accelerated schedule against the original mortgage timeline.',
      ],
    },
    showChart: false,
    projectionHeading: 'Mortgage Payoff Comparison',
    projectionRows: [],
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'When extra mortgage payments matter most',
        paragraphs: [
          'Extra principal can have its biggest impact when the remaining balance is high and many years of interest are still ahead.',
          'That is why payoff examples can be useful even before deciding whether to recast, refinance, or simply keep the existing loan.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this example include taxes, insurance, or HOA dues?',
        answer:
          'No. It focuses on the principal-and-interest payoff path only, because extra payments apply to the loan balance rather than escrowed housing costs.',
      },
      {
        question: 'Is this the same as a mortgage recast?',
        answer:
          'No. A payoff strategy keeps paying extra principal, while a recast usually lowers the required payment after a lump-sum reduction.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Mortgage Payoff Calculator', url: '/calculators/mortgage-payoff-calculator/' },
      { name: 'Examples', url: '/calculators/mortgage-payoff/examples/' },
      { name: record.question, url: createMortgagePayoffCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Mortgage Payoff Calculator',
        url: '/calculators/mortgage-payoff-calculator/',
        description: 'Model extra principal, payoff time, and interest savings using your own mortgage assumptions.',
      },
      {
        title: 'Mortgage Payment Calculator',
        url: '/calculators/mortgage-payment-calculator/',
        description: 'Estimate the underlying monthly payment before comparing payoff strategies.',
      },
      {
        title: 'Mortgage Recast Calculator',
        url: '/calculators/mortgage-recast-calculator/',
        description: 'Compare a lump-sum recast with a recurring extra-payment plan.',
      },
    ],
    relatedGuides: [
      {
        title: 'Mortgage and Home Buying Guide Hub',
        url: '/guides/mortgage/',
        description: 'Connect mortgage payments, payoff plans, refinance tradeoffs, and worked housing examples.',
      },
      {
        title: 'How to Use Mortgage Payoff Calculator',
        url: '/guides/how-to-use-mortgage-payoff-calculator/',
        description: 'Understand how extra principal changes the amortization path.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Mortgage Payoff Plan',
      description: 'Use the full calculator to test a different balance, rate, term, or extra-payment strategy.',
      url: '/calculators/mortgage-payoff-calculator/',
      label: 'Open the Mortgage Payoff Calculator',
      examplesUrl: '/calculators/mortgage-payoff/examples/',
      examplesLabel: 'Browse All Mortgage Payoff Examples',
    },
    relatedPagesHeading: 'Related Mortgage Payoff Examples',
  };
}

export function auditMortgagePayoffSeoRecords(
  records: MortgagePayoffSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'mortgage payoff',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.loanAmount} financed, ${record.annualInterestRatePercent}% APR, ${record.loanTermYears} years, and ${record.extraMonthlyPayment} extra monthly.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createMortgagePayoffCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createMortgagePayoffCanonicalPath,
  });
}
