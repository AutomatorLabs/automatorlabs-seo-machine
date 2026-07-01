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

function intentFraming(record: CreditCardExtraPaymentSeoRecord): string {
  switch (record.intent) {
    case 'starter-balance':
      return 'This is a smaller starter balance, so an extra payment can pay it off in a relatively short window even without a large recurring amount.';
    case 'average-balance':
      return 'This balance sits in a common middle range, where a modest recurring extra payment can still noticeably change the payoff timeline.';
    case 'high-apr':
      return 'A high APR like this one means interest compounds quickly, so extra principal payments have an outsized effect on the total interest paid.';
    case 'aggressive-extra':
      return 'The extra payment here is large relative to the base payment, which prioritizes a fast payoff over keeping cash available for other goals.';
    case 'large-balance':
      return 'A larger balance like this one carries substantial total interest at stake, so even a modest extra payment strategy is worth comparing against other financial priorities.';
  }
}

function intentSectionFraming(record: CreditCardExtraPaymentSeoRecord): string {
  switch (record.intent) {
    case 'starter-balance':
      return 'Because the balance here is on the smaller side, the case for an extra payment often comes down to building good habits early rather than urgent interest savings.';
    case 'average-balance':
      return 'For a balance in this range, extra payments tend to shave a meaningful chunk of time and interest without requiring a dramatic budget change.';
    case 'high-apr':
      return 'At an APR this high, prioritizing this balance ahead of lower-rate debt is usually the more efficient use of extra cash.';
    case 'aggressive-extra':
      return 'An aggressive extra payment strategy like this one is worth weighing against building an emergency fund or contributing to tax-advantaged retirement accounts.';
    case 'large-balance':
      return 'For a balance this large, it can help to combine an extra-payment plan with a look at whether a lower-rate balance transfer or consolidation loan is available.';
  }
}

function intentFaqFraming(record: CreditCardExtraPaymentSeoRecord): string {
  switch (record.intent) {
    case 'starter-balance':
      return 'This example models a smaller starter balance, which is one of the faster-paying-off cases in this cluster of examples.';
    case 'average-balance':
      return 'This example models a balance in the common middle range covered by this cluster of examples.';
    case 'high-apr':
      return "This example models a higher APR than most of this cluster's other scenarios, which increases how much extra payments matter.";
    case 'aggressive-extra':
      return "This example models a larger extra payment relative to the base payment than most of this cluster's other scenarios.";
    case 'large-balance':
      return 'This example models one of the larger balances in this cluster of examples, where total interest at stake is highest.';
  }
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
    intro: `This worked example shows how a recurring extra payment changes payoff timing on a ${wholeCurrency.format(record.balance)} balance at ${record.aprPercent}% APR when the base monthly payment is ${currency.format(record.monthlyPayment)}. ${intentFraming(record)}`,
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
          intentSectionFraming(record),
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
      {
        question: `How does this ${record.scenarioLabel} scenario compare with other examples in this cluster?`,
        answer: intentFaqFraming(record),
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
