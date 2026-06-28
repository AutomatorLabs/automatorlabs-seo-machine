import type { CreditCardExtraPaymentSeoRecord } from '../../data/programmatic-seo/credit-card-extra-payment';
import { calculateCreditCardInterest } from '../math';
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

const clusterPath = 'calculators/credit-card-extra-payment';

function formatMonths(totalMonths: number | null): string {
  if (totalMonths == null) return 'No finite payoff';

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);

  return parts.length > 0 ? parts.join(', ') : '0 months';
}

export function createCreditCardExtraPaymentCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: CreditCardExtraPaymentSeoRecord,
  records: CreditCardExtraPaymentSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.balance - record.balance) / Math.max(record.balance, 1) +
        Math.abs(candidate.aprPercent - record.aprPercent) / 5 +
        Math.abs(candidate.monthlyPayment - record.monthlyPayment) / 100 +
        Math.abs(candidate.extraMonthlyPayment - record.extraMonthlyPayment) / 50,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createCreditCardExtraPaymentCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.balance)} balance, ${candidate.aprPercent}% APR, ${currency.format(candidate.monthlyPayment)} payment, ${currency.format(candidate.extraMonthlyPayment)} extra.`,
    }));
}

export function createCreditCardExtraPaymentSeoPage(
  record: CreditCardExtraPaymentSeoRecord,
  records: CreditCardExtraPaymentSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateCreditCardInterest({
    balance: record.balance,
    aprPercent: record.aprPercent,
    monthlyPayment: record.monthlyPayment,
    extraMonthlyPayment: record.extraMonthlyPayment,
  });
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${wholeCurrency.format(record.balance)} at ${record.aprPercent}% APR with ${currency.format(record.monthlyPayment)} monthly and ${currency.format(record.extraMonthlyPayment)} extra shortens payoff to ${formatMonths(result.accelerated.payoffTimeMonths)} and changes total interest by about ${currency.format(result.interestSaved ?? 0)}.`,
  });

  return {
    slug: record.slug,
    url: createCreditCardExtraPaymentCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Credit card extra payment example',
    intro: `This worked example shows how a recurring extra payment changes payoff timing on a ${wholeCurrency.format(record.balance)} balance at ${record.aprPercent}% APR when the base monthly payment is ${currency.format(record.monthlyPayment)}.`,
    summary: `Adding ${currency.format(record.extraMonthlyPayment)} extra each month changes the total payment to ${currency.format(record.monthlyPayment + record.extraMonthlyPayment)} and is estimated to pay the balance off in ${formatMonths(result.accelerated.payoffTimeMonths)}. That is about ${formatMonths(result.timeSavedMonths)} faster than the base-payment path.`,
    results: [
      {
        label: 'Estimated payoff time',
        value: formatMonths(result.accelerated.payoffTimeMonths),
        primary: true,
      },
      {
        label: 'Estimated time saved',
        value: formatMonths(result.timeSavedMonths),
      },
      {
        label: 'Estimated interest saved',
        value:
          result.interestSaved == null
            ? 'Extra payment creates the payoff path'
            : currency.format(result.interestSaved),
      },
      {
        label: 'Estimated total interest',
        value:
          result.accelerated.totalInterestPaid == null
            ? 'No finite total'
            : currency.format(result.accelerated.totalInterestPaid),
      },
    ],
    formula: {
      heading: 'How This Extra Payment Example Works',
      expression:
        'Faster payoff comes from sending extra principal each month after interest is applied',
      explanation:
        'The page uses the same debt-payoff engine as the calculator, comparing a base monthly payment with a higher payment created by a recurring extra amount.',
      steps: [
        `Start with a ${wholeCurrency.format(record.balance)} balance at ${record.aprPercent}% APR.`,
        `Model the base payment of ${currency.format(record.monthlyPayment)} by itself.`,
        `Model the accelerated payment of ${currency.format(record.monthlyPayment + record.extraMonthlyPayment)} including the extra amount.`,
        'Compare payoff time and total interest between the two paths.',
      ],
    },
    showChart: false,
    projectionHeading: 'Scenario Summary',
    projectionRows: [],
    table: {
      heading: 'Scenario Summary',
      columns: ['Metric', 'Value'],
      rows: [
        { label: 'Current balance', cells: [currency.format(record.balance)] },
        { label: 'APR', cells: [`${record.aprPercent}%`] },
        { label: 'Base monthly payment', cells: [currency.format(record.monthlyPayment)] },
        { label: 'Extra monthly payment', cells: [currency.format(record.extraMonthlyPayment)] },
        { label: 'Accelerated monthly payment', cells: [currency.format(record.monthlyPayment + record.extraMonthlyPayment)] },
        { label: 'Estimated payoff time', cells: [formatMonths(result.accelerated.payoffTimeMonths)] },
        { label: 'Estimated time saved', cells: [formatMonths(result.timeSavedMonths)] },
        {
          label: 'Estimated interest saved',
          cells: [
            result.interestSaved == null
              ? 'Extra payment creates the payoff path'
              : currency.format(result.interestSaved),
          ],
        },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why recurring extras matter',
        paragraphs: [
          'Extra payments reduce the principal balance sooner, which means later interest charges have a smaller base to compound against.',
          'That is why even modest recurring extras can change both the payoff timeline and the final interest total more than a one-time glance at the statement suggests.',
        ],
      },
      {
        heading: 'How to use this scenario',
        paragraphs: [
          'Use this page to sanity-check whether your planned extra amount is large enough to matter before you redesign a budget around it.',
          'If the extra payment is irregular, the full calculator is better because it lets you test alternative recurring amounts more directly.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this assume the extra payment happens every month?',
        answer:
          'Yes. The example assumes the same extra amount is added to every scheduled monthly payment.',
      },
      {
        question: 'Can a small extra payment still matter?',
        answer:
          'Often yes. The effect is larger on higher APR balances and longer payoff timelines because principal is reduced earlier.',
      },
      {
        question: 'What if the base payment does not create a payoff path?',
        answer:
          'Then the extra payment may be what makes the balance reachable, which is why time saved may be shown differently in some scenarios.',
      },
      {
        question: 'Does this include late fees, annual fees, or new purchases?',
        answer:
          'No. It assumes a fixed balance payoff path with no new charges and no added fees.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Credit Card Extra Payment Calculator',
        url: '/calculators/credit-card-extra-payment-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/credit-card-extra-payment/examples/',
      },
      { name: record.question, url: createCreditCardExtraPaymentCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Extra Payment Examples',
    relatedCalculators: [
      {
        title: 'Credit Card Extra Payment Calculator',
        url: '/calculators/credit-card-extra-payment-calculator/',
        description:
          'Change the balance, APR, base payment, and recurring extra amount.',
      },
      {
        title: 'Credit Card Interest Calculator',
        url: '/calculators/credit-card-interest-calculator/',
        description:
          'Compare first-month interest and long-run interest cost for a similar balance.',
      },
      {
        title: 'Credit Card Payoff Calculator',
        url: '/calculators/credit-card-payoff-calculator/',
        description:
          'Compare standard payoff plans across balances, APRs, and fixed monthly payments.',
      },
    ],
    relatedGuides: [
      {
        title: 'Minimum Payment vs Extra Payment',
        url: '/guides/minimum-payment-vs-extra-payment/',
        description:
          'See how a fixed extra payment compares with staying near the issuer minimum.',
      },
      {
        title: 'Debt Payoff Guide',
        url: '/guides/debt-payoff/',
        description:
          'Connect extra-payment math with budgeting, cash reserves, and debt priorities.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Extra Payment Scenario',
      description:
        'Use the calculator to test how much a recurring extra payment could save.',
      url: '/calculators/credit-card-extra-payment-calculator/',
      label: 'Open the Credit Card Extra Payment Calculator',
      examplesUrl: '/calculators/credit-card-extra-payment/examples/',
      examplesLabel: 'Browse All Extra Payment Examples',
    },
  };
}

export function auditCreditCardExtraPaymentSeoRecords(
  records: CreditCardExtraPaymentSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'credit card extra payment',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.balance} balance, ${record.aprPercent}% APR, ${record.monthlyPayment} monthly payment, and ${record.extraMonthlyPayment} recurring extra payment assumptions.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createCreditCardExtraPaymentCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createCreditCardExtraPaymentCanonicalPath,
  });
}
