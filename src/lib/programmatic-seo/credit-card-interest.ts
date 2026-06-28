import type { CreditCardInterestSeoRecord } from '../../data/programmatic-seo/credit-card-interest';
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

const clusterPath = 'calculators/credit-card-interest';

function formatMonths(totalMonths: number | null): string {
  if (totalMonths == null) return 'No finite payoff';

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);

  return parts.length > 0 ? parts.join(', ') : '0 months';
}

export function createCreditCardInterestCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: CreditCardInterestSeoRecord,
  records: CreditCardInterestSeoRecord[],
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
      url: createCreditCardInterestCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.balance)} balance, ${candidate.aprPercent}% APR, ${currency.format(candidate.monthlyPayment)} payment, ${currency.format(candidate.extraMonthlyPayment)} extra.`,
    }));
}

export function createCreditCardInterestSeoPage(
  record: CreditCardInterestSeoRecord,
  records: CreditCardInterestSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateCreditCardInterest({
    balance: record.balance,
    aprPercent: record.aprPercent,
    monthlyPayment: record.monthlyPayment,
    extraMonthlyPayment: record.extraMonthlyPayment,
  });
  const totalPayment =
    record.monthlyPayment + record.extraMonthlyPayment;
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${wholeCurrency.format(record.balance)} at ${record.aprPercent}% APR with ${currency.format(totalPayment)} per month creates about ${currency.format(result.monthlyInterest)} in first-month interest and an estimated payoff time of ${formatMonths(result.accelerated.payoffTimeMonths)}.`,
  });

  return {
    slug: record.slug,
    url: createCreditCardInterestCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Credit card interest example',
    intro: `This worked example uses the live Credit Card Interest Calculator assumptions for a ${wholeCurrency.format(record.balance)} balance at ${record.aprPercent}% APR with ${currency.format(record.monthlyPayment)} in scheduled monthly payments and ${currency.format(record.extraMonthlyPayment)} in extra payments.`,
    summary: `The first month of interest is about ${currency.format(result.monthlyInterest)}. At a total monthly payment of ${currency.format(totalPayment)}, the balance is estimated to pay off in ${formatMonths(result.accelerated.payoffTimeMonths)} with about ${currency.format(result.accelerated.totalInterestPaid ?? 0)} in total interest.`,
    results: [
      {
        label: 'First-month interest',
        value: currency.format(result.monthlyInterest),
        primary: true,
      },
      {
        label: 'Estimated payoff time',
        value: formatMonths(result.accelerated.payoffTimeMonths),
      },
      {
        label: 'Estimated total interest',
        value:
          result.accelerated.totalInterestPaid == null
            ? 'No finite total'
            : currency.format(result.accelerated.totalInterestPaid),
      },
      {
        label: 'Interest saved vs base payment',
        value:
          result.interestSaved == null
            ? 'Extra payment creates the payoff path'
            : currency.format(result.interestSaved),
      },
    ],
    formula: {
      heading: 'How This Credit Card Interest Example Works',
      expression:
        'Monthly interest = balance × APR ÷ 12, then recurring payments reduce principal over time',
      explanation:
        'The page reuses the shared debt-payoff math from the calculator to estimate first-month interest, payoff time, total interest, and the effect of extra monthly payments.',
      steps: [
        `Start with a ${wholeCurrency.format(record.balance)} revolving balance.`,
        `Apply ${record.aprPercent}% APR as a monthly rate to estimate interest.`,
        `Subtract the scheduled payment of ${currency.format(record.monthlyPayment)} and any extra payment of ${currency.format(record.extraMonthlyPayment)} each month.`,
        'Repeat until the balance reaches zero or the payment is too small to produce a finite payoff.',
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
        { label: 'Scheduled monthly payment', cells: [currency.format(record.monthlyPayment)] },
        { label: 'Extra monthly payment', cells: [currency.format(record.extraMonthlyPayment)] },
        { label: 'First-month interest', cells: [currency.format(result.monthlyInterest)] },
        { label: 'Estimated payoff time', cells: [formatMonths(result.accelerated.payoffTimeMonths)] },
        {
          label: 'Estimated total interest',
          cells: [
            result.accelerated.totalInterestPaid == null
              ? 'No finite total'
              : currency.format(result.accelerated.totalInterestPaid),
          ],
        },
        {
          label: 'Interest saved vs base payment',
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
        heading: 'What this scenario shows',
        paragraphs: [
          'Credit card APR turns into a monthly interest charge on the remaining balance, which means the first months often feel slow when payments are modest.',
          'Worked examples are useful because a small extra payment can materially change the total interest and payoff timeline, especially on high-rate balances.',
        ],
      },
      {
        heading: 'How to use this result',
        paragraphs: [
          'Treat this page as a planning benchmark rather than a prediction. Real credit card balances can change with new purchases, fees, and variable APR changes.',
          'Use the full calculator to match your real payment pattern and compare whether minimums, fixed payments, or a larger extra payment create a better payoff path.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this page assume new charges stop?',
        answer:
          'Yes. The worked example assumes the balance only declines from interest and payments. New spending would change the payoff path.',
      },
      {
        question: 'Why is the first-month interest different from total interest?',
        answer:
          'First-month interest reflects one month on the current balance. Total interest adds up every month until the balance is gone.',
      },
      {
        question: 'What happens if the payment is too low?',
        answer:
          'If a payment does not exceed monthly interest, the balance does not have a finite payoff path under the current assumptions.',
      },
      {
        question: 'Does this include fees or penalty APRs?',
        answer:
          'No. It focuses on the balance, APR, monthly payment, and extra payment only.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Credit Card Interest Calculator',
        url: '/calculators/credit-card-interest-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/credit-card-interest/examples/',
      },
      { name: record.question, url: createCreditCardInterestCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Credit Card Interest Examples',
    relatedCalculators: [
      {
        title: 'Credit Card Interest Calculator',
        url: '/calculators/credit-card-interest-calculator/',
        description:
          'Change the balance, APR, monthly payment, and extra payment to fit your own card.',
      },
      {
        title: 'Credit Card Extra Payment Calculator',
        url: '/calculators/credit-card-extra-payment-calculator/',
        description:
          'Focus on how much faster a larger recurring extra payment could reduce the balance.',
      },
      {
        title: 'Credit Card Minimum Payment Calculator',
        url: '/calculators/credit-card-minimum-payment-calculator/',
        description:
          'Compare fixed payments with issuer-style minimum payment assumptions.',
      },
    ],
    relatedGuides: [
      {
        title: 'How Credit Card Interest Works',
        url: '/guides/how-credit-card-interest-works/',
        description:
          'Understand how APR turns into monthly interest charges and why balances can linger.',
      },
      {
        title: 'Minimum Payment vs Extra Payment',
        url: '/guides/minimum-payment-vs-extra-payment/',
        description:
          'Compare whether paying only the minimum or adding extra each month changes the path enough.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Credit Card Interest Scenario',
      description:
        'Use the calculator to change the balance, APR, minimum payment, and extra payment.',
      url: '/calculators/credit-card-interest-calculator/',
      label: 'Open the Credit Card Interest Calculator',
      examplesUrl: '/calculators/credit-card-interest/examples/',
      examplesLabel: 'Browse All Credit Card Interest Examples',
    },
  };
}

export function auditCreditCardInterestSeoRecords(
  records: CreditCardInterestSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'credit card interest',
    records,
    pages: records.map((record) => {
      const totalPayment = record.monthlyPayment + record.extraMonthlyPayment;
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.balance} balance, ${record.aprPercent}% APR, ${totalPayment} monthly payments, and ${record.extraMonthlyPayment} extra payment assumptions.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createCreditCardInterestCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createCreditCardInterestCanonicalPath,
  });
}
