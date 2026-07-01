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

type ExtraPaymentTier = 'modest' | 'moderate' | 'aggressive';
type PayoffTermProfile = 'short' | 'mid' | 'long';

function extraPaymentTier(record: MortgagePayoffSeoRecord): ExtraPaymentTier {
  if (record.extraMonthlyPayment <= 200) return 'modest';
  if (record.extraMonthlyPayment <= 300) return 'moderate';
  return 'aggressive';
}

function payoffTermProfile(record: MortgagePayoffSeoRecord): PayoffTermProfile {
  if (record.loanTermYears <= 15) return 'short';
  if (record.loanTermYears === 20) return 'mid';
  return 'long';
}

function extraPaymentFraming(tier: ExtraPaymentTier): string {
  switch (tier) {
    case 'modest':
      return 'A modest extra payment like this one chips away at the balance gradually, producing a smaller but still meaningful reduction in payoff time and total interest.';
    case 'moderate':
      return 'A moderate extra payment like this one makes a clearly noticeable dent in both the payoff timeline and the total interest paid.';
    case 'aggressive':
      return 'An aggressive extra payment like this one can meaningfully shorten the loan and cut a large share of the remaining interest.';
  }
}

function extraPaymentFaqFraming(tier: ExtraPaymentTier): string {
  switch (tier) {
    case 'modest':
      return "It's on the smaller end of the extra payments modeled across this cluster of examples, but it still compounds into real savings over the life of the loan.";
    case 'moderate':
      return "It falls in the middle of the extra payments modeled across this cluster of examples, which is usually enough to shift the payoff date by a year or more.";
    case 'aggressive':
      return "It's on the larger end of the extra payments modeled across this cluster of examples, so it is worth weighing against other financial priorities before committing to it long-term.";
  }
}

function payoffTermFraming(profile: PayoffTermProfile): string {
  switch (profile) {
    case 'short':
      return 'Because the baseline term is already short, extra payments here have less remaining interest to work against than on a longer original term.';
    case 'mid':
      return 'With a mid-length original term, extra payments still have a meaningful amount of remaining interest to reduce.';
    case 'long':
      return 'Because the baseline term is long, extra payments made early can remove a large share of the total interest still ahead.';
  }
}

function extraPaymentSectionFraming(tier: ExtraPaymentTier): string {
  switch (tier) {
    case 'modest':
      return 'Since the extra amount here is on the smaller side, expect the payoff-date shift to be measured in months rather than years.';
    case 'moderate':
      return 'An extra payment in this range is usually large enough to move the payoff date by a year or more without straining the household budget.';
    case 'aggressive':
      return 'An extra payment this large is worth comparing against other goals, since the same money could also go toward investing or other debt.';
  }
}

function payoffTermSectionFraming(profile: PayoffTermProfile): string {
  switch (profile) {
    case 'short':
      return 'A 15-year baseline already limits how much total interest is on the table, so the payoff shift from extra payments will look smaller in dollar terms than on a 30-year loan of the same size.';
    case 'mid':
      return 'A 20-year baseline sits between the two extremes, so the dollar impact of extra payments here is typically more than a 15-year loan but less than a 30-year loan.';
    case 'long':
      return 'A 30-year baseline carries the most total interest of the common terms, so the same extra payment tends to save more in dollar terms here than on a shorter original term.';
  }
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
  const extraTier = extraPaymentTier(record);
  const termProfile = payoffTermProfile(record);

  return {
    slug: record.slug,
    url: createMortgagePayoffCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Mortgage payoff example',
    intro: `This worked example shows how an extra-payment mortgage strategy changes the payoff timeline on a ${currency.format(record.loanAmount)} home loan. ${extraPaymentFraming(extraTier)} ${payoffTermFraming(termProfile)}`,
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
      {
        heading: 'How the extra payment and term shape this example',
        paragraphs: [
          extraPaymentSectionFraming(extraTier),
          payoffTermSectionFraming(termProfile),
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
      {
        question: `Is ${currency.format(record.extraMonthlyPayment)} extra a small or large payment in this example?`,
        answer: extraPaymentFaqFraming(extraTier),
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
