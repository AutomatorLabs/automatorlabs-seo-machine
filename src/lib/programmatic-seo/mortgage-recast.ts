import type { MortgageRecastSeoRecord } from '../../data/programmatic-seo/mortgage-recast';
import { calculateMortgageRecast } from '../math';
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
  maximumFractionDigits: 2,
});

const wholeCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const clusterPath = 'calculators/mortgage-recast';

export function createMortgageRecastCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: MortgageRecastSeoRecord,
  records: MortgageRecastSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(
          candidate.currentMortgageBalance - record.currentMortgageBalance,
        ) / Math.max(record.currentMortgageBalance, 1) +
        Math.abs(
          candidate.lumpSumRecastPayment - record.lumpSumRecastPayment,
        ) / Math.max(record.lumpSumRecastPayment, 1) +
        Math.abs(
          candidate.remainingLoanTermYears - record.remainingLoanTermYears,
        ),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createMortgageRecastCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.currentMortgageBalance)} balance, ${currency.format(candidate.lumpSumRecastPayment)} recast payment, ${candidate.remainingLoanTermYears} years remaining.`,
    }));
}

export function createMortgageRecastSeoPage(
  record: MortgageRecastSeoRecord,
  records: MortgageRecastSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateMortgageRecast(record);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${record.scenarioLabel} mortgage recast scenario: ${wholeCurrency.format(record.currentMortgageBalance)} mortgage balance with a ${currency.format(record.lumpSumRecastPayment)} recast payment lowers the monthly payment from about ${currency.format(result.currentMonthlyPayment)} to ${currency.format(result.newMonthlyPayment)} under the fixed assumptions used here.`,
  });

  return {
    slug: record.slug,
    url: createMortgageRecastCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Mortgage recast example',
    intro: `This worked example estimates how a ${currency.format(record.lumpSumRecastPayment)} lump-sum recast payment changes the payment on a ${wholeCurrency.format(record.currentMortgageBalance)} mortgage at ${record.annualInterestRatePercent}% with ${record.remainingLoanTermYears} years remaining and a ${currency.format(record.recastFee)} recast fee.`,
    summary: `The required monthly payment drops from about ${currency.format(result.currentMonthlyPayment)} to ${currency.format(result.newMonthlyPayment)}, reducing the payment by roughly ${currency.format(result.monthlyPaymentReduction)} per month while keeping the same remaining term.`,
    results: [
      {
        label: 'Current monthly payment',
        value: currency.format(result.currentMonthlyPayment),
        primary: true,
      },
      {
        label: 'New monthly payment',
        value: currency.format(result.newMonthlyPayment),
      },
      {
        label: 'Monthly payment reduction',
        value: currency.format(result.monthlyPaymentReduction),
      },
      {
        label: 'Estimated total interest saved',
        value: currency.format(result.totalInterestSaved),
      },
    ],
    formula: {
      heading: 'How This Mortgage Recast Example Works',
      expression:
        'Recast payment lowers the principal balance, then the mortgage payment is recalculated over the existing remaining term',
      explanation:
        'The page uses the shared Mortgage Recast Calculator assumptions, holding the interest rate and remaining term constant while applying a lump-sum principal reduction.',
      steps: [
        `Start with a remaining mortgage balance of ${wholeCurrency.format(record.currentMortgageBalance)}.`,
        `Subtract the ${currency.format(record.lumpSumRecastPayment)} lump-sum recast payment from principal.`,
        `Recalculate the monthly payment at ${record.annualInterestRatePercent}% over the remaining ${record.remainingLoanTermYears} years.`,
        `Include the ${currency.format(record.recastFee)} recast fee when estimating the total interest-saved effect.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Scenario Summary',
    projectionRows: [],
    table: {
      heading: 'Scenario Summary',
      columns: ['Metric', 'Value'],
      rows: [
        { label: 'Current mortgage balance', cells: [currency.format(record.currentMortgageBalance)] },
        { label: 'Interest rate', cells: [`${record.annualInterestRatePercent}%`] },
        { label: 'Remaining loan term', cells: [`${record.remainingLoanTermYears} years`] },
        { label: 'Lump-sum recast payment', cells: [currency.format(record.lumpSumRecastPayment)] },
        { label: 'Recast fee', cells: [currency.format(record.recastFee)] },
        { label: 'Current monthly payment', cells: [currency.format(result.currentMonthlyPayment)] },
        { label: 'New monthly payment', cells: [currency.format(result.newMonthlyPayment)] },
        { label: 'Monthly payment reduction', cells: [currency.format(result.monthlyPaymentReduction)] },
        { label: 'Estimated total interest saved', cells: [currency.format(result.totalInterestSaved)] },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What this recast scenario is useful for',
        paragraphs: [
          'Mortgage recasts are most useful when the goal is a lower required payment without replacing the mortgage entirely through a refinance.',
          'Worked examples help show the tradeoff between sending a large lump sum today and the monthly cash-flow relief that follows.',
        ],
      },
      {
        heading: 'How to use this result',
        paragraphs: [
          'Compare the payment reduction here with what that same lump sum could do if used for investing, an emergency reserve, or a refinance alternative.',
          'Use the full calculator if you need to test a different remaining term, interest rate, or recast fee structure.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does a recast change the mortgage interest rate?',
        answer:
          'No. A recast generally keeps the same mortgage and interest rate while recalculating the payment after a principal reduction.',
      },
      {
        question: 'How is this different from a refinance?',
        answer:
          'A refinance replaces the loan, while a recast keeps the current loan and simply recalculates the payment over the remaining term.',
      },
      {
        question: 'Why can a recast lower the payment?',
        answer:
          'The lump-sum payment reduces principal, so the amortized payment required over the remaining term falls as well.',
      },
      {
        question: 'Does this page include taxes and insurance?',
        answer:
          'No. It focuses on principal-and-interest mortgage payment changes only.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Mortgage Recast Calculator',
        url: '/calculators/mortgage-recast-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/mortgage-recast/examples/',
      },
      { name: record.question, url: createMortgageRecastCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Mortgage Recast Examples',
    relatedCalculators: [
      {
        title: 'Mortgage Recast Calculator',
        url: '/calculators/mortgage-recast-calculator/',
        description:
          'Change the remaining balance, rate, remaining term, lump sum, and recast fee.',
      },
      {
        title: 'Mortgage Payoff Calculator',
        url: '/calculators/mortgage-payoff-calculator/',
        description:
          'Compare a recast with a strategy that keeps the original payment and accelerates payoff.',
      },
      {
        title: 'Refinance Calculator',
        url: '/calculators/refinance-calculator/',
        description:
          'Compare a recast with replacing the existing mortgage altogether.',
      },
    ],
    relatedGuides: [
      {
        title: 'How to Use the Mortgage Recast Calculator',
        url: '/guides/how-to-use-mortgage-recast-calculator/',
        description:
          'Learn when a recast may make sense versus paying down principal without recalculating the payment.',
      },
      {
        title: 'Mortgage and Home Buying Guide Hub',
        url: '/guides/mortgage/',
        description:
          'See mortgage recasts alongside payoff, refinance, affordability, and closing-cost planning.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Mortgage Recast Scenario',
      description:
        'Use the calculator to change the remaining balance, rate, term, lump sum, and recast fee.',
      url: '/calculators/mortgage-recast-calculator/',
      label: 'Open the Mortgage Recast Calculator',
      examplesUrl: '/calculators/mortgage-recast/examples/',
      examplesLabel: 'Browse All Mortgage Recast Examples',
    },
  };
}

export function auditMortgageRecastSeoRecords(
  records: MortgageRecastSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'mortgage recast',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.scenarioLabel} scenario. ${record.question} using ${record.currentMortgageBalance} balance, ${record.annualInterestRatePercent}% rate, ${record.remainingLoanTermYears} years remaining, ${record.lumpSumRecastPayment} lump-sum recast payment, and ${record.recastFee} fee assumptions.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createMortgageRecastCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createMortgageRecastCanonicalPath,
  });
}
