import type { CreditCardMinimumPaymentSeoRecord } from '../../data/programmatic-seo/credit-card-minimum-payment';
import { calculateCreditCardMinimumPayment } from '../math';
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

const clusterPath = 'calculators/credit-card-minimum-payment';

function formatMonths(totalMonths: number | null): string {
  if (totalMonths == null) return 'No finite payoff';

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);

  return parts.length > 0 ? parts.join(', ') : '0 months';
}

export function createCreditCardMinimumPaymentCanonicalPath(
  slug: string,
): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: CreditCardMinimumPaymentSeoRecord,
  records: CreditCardMinimumPaymentSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.balance - record.balance) / Math.max(record.balance, 1) +
        Math.abs(candidate.aprPercent - record.aprPercent) / 5 +
        Math.abs(
          candidate.minimumPaymentPercent - record.minimumPaymentPercent,
        ) +
        Math.abs(candidate.minimumPaymentFloor - record.minimumPaymentFloor) / 10,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createCreditCardMinimumPaymentCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.balance)} balance, ${candidate.aprPercent}% APR, ${candidate.minimumPaymentPercent}% minimum, ${currency.format(candidate.minimumPaymentFloor)} floor.`,
    }));
}

export function createCreditCardMinimumPaymentSeoPage(
  record: CreditCardMinimumPaymentSeoRecord,
  records: CreditCardMinimumPaymentSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateCreditCardMinimumPayment({
    balance: record.balance,
    aprPercent: record.aprPercent,
    minimumPaymentPercent: record.minimumPaymentPercent,
    minimumPaymentFloor: record.minimumPaymentFloor,
  });
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${wholeCurrency.format(record.balance)} at ${record.aprPercent}% APR with a ${record.minimumPaymentPercent}% issuer minimum and ${currency.format(record.minimumPaymentFloor)} floor starts near ${currency.format(result.firstMinimumPayment)} and pays off in ${formatMonths(result.payoffTimeMonths)} under fixed assumptions.`,
  });

  return {
    slug: record.slug,
    url: createCreditCardMinimumPaymentCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Credit card minimum payment example',
    intro: `This worked example estimates how an issuer-style minimum payment behaves on a ${wholeCurrency.format(record.balance)} balance at ${record.aprPercent}% APR with a ${record.minimumPaymentPercent}% minimum payment rate and a ${currency.format(record.minimumPaymentFloor)} payment floor.`,
    summary: `The first minimum payment is about ${currency.format(result.firstMinimumPayment)}, with ${currency.format(result.firstMonthInterest)} going to interest in month one. Under fixed assumptions and no new purchases, the balance is estimated to pay off in ${formatMonths(result.payoffTimeMonths)}.`,
    results: [
      {
        label: 'First minimum payment',
        value: currency.format(result.firstMinimumPayment),
        primary: true,
      },
      {
        label: 'First-month interest',
        value: currency.format(result.firstMonthInterest),
      },
      {
        label: 'First-month principal',
        value: currency.format(result.firstMonthPrincipal),
      },
      {
        label: 'Estimated payoff time',
        value: formatMonths(result.payoffTimeMonths),
      },
    ],
    formula: {
      heading: 'How This Minimum Payment Example Works',
      expression:
        'Minimum payment = greater of balance × minimum % or the fixed dollar floor',
      explanation:
        'The page reuses the shared Credit Card Minimum Payment Calculator logic to estimate the first payment, first-month interest split, payoff time, and total interest under a fixed issuer-style minimum formula.',
      steps: [
        `Start with a ${wholeCurrency.format(record.balance)} balance at ${record.aprPercent}% APR.`,
        `Calculate the first payment as the greater of ${record.minimumPaymentPercent}% of the balance or ${currency.format(record.minimumPaymentFloor)}.`,
        'Apply monthly interest to the remaining balance and recalculate the issuer-style minimum payment each month.',
        'Continue until the balance reaches zero or the payment formula is too weak to create a finite payoff path.',
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
        { label: 'Minimum payment %', cells: [`${record.minimumPaymentPercent}%`] },
        { label: 'Minimum payment floor', cells: [currency.format(record.minimumPaymentFloor)] },
        { label: 'First minimum payment', cells: [currency.format(result.firstMinimumPayment)] },
        { label: 'First-month interest', cells: [currency.format(result.firstMonthInterest)] },
        { label: 'First-month principal', cells: [currency.format(result.firstMonthPrincipal)] },
        { label: 'Estimated payoff time', cells: [formatMonths(result.payoffTimeMonths)] },
        {
          label: 'Estimated total interest',
          cells: [
            result.totalInterestPaid == null
              ? 'No finite total'
              : currency.format(result.totalInterestPaid),
          ],
        },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why minimum-payment math matters',
        paragraphs: [
          'Minimum payments can feel manageable in the short term while still keeping a balance around for years because the required amount often falls as the balance declines.',
          'That makes worked examples useful when deciding whether the issuer minimum is enough or whether a fixed higher payment is safer.',
        ],
      },
      {
        heading: 'How to interpret the payoff estimate',
        paragraphs: [
          'The estimate assumes no new charges, no fees, and a fixed APR. Real statements may include new purchases, penalty pricing, or changing minimum formulas.',
          'Use the full calculator to compare different minimum percentages or floors if your issuer uses a different formula than this scenario.',
        ],
      },
    ],
    faq: [
      {
        question: 'Why does the minimum payment often shrink over time?',
        answer:
          'Many card issuers calculate the required payment as a percentage of the remaining balance, so the required amount can decline as the balance falls.',
      },
      {
        question: 'Does this example assume I stop using the card?',
        answer:
          'Yes. New purchases would increase the balance and change the timeline.',
      },
      {
        question: 'What if the minimum payment does not beat monthly interest?',
        answer:
          'Then the balance does not have a finite payoff path under the current assumptions, which is why higher floors or a higher payment percentage can matter.',
      },
      {
        question: 'Does this include fees or promotional APR changes?',
        answer:
          'No. It focuses on balance, APR, minimum payment percentage, and payment floor only.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Credit Card Minimum Payment Calculator',
        url: '/calculators/credit-card-minimum-payment-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/credit-card-minimum-payment/examples/',
      },
      {
        name: record.question,
        url: createCreditCardMinimumPaymentCanonicalPath(record.slug),
      },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Minimum Payment Examples',
    relatedCalculators: [
      {
        title: 'Credit Card Minimum Payment Calculator',
        url: '/calculators/credit-card-minimum-payment-calculator/',
        description:
          'Change the balance, APR, minimum payment percentage, and issuer floor.',
      },
      {
        title: 'Credit Card Interest Calculator',
        url: '/calculators/credit-card-interest-calculator/',
        description:
          'Switch to a fixed-payment view and compare first-month interest against a custom monthly payment.',
      },
      {
        title: 'Credit Card Extra Payment Calculator',
        url: '/calculators/credit-card-extra-payment-calculator/',
        description:
          'See how replacing the minimum with a fixed extra payment changes the payoff timeline.',
      },
    ],
    relatedGuides: [
      {
        title: 'Minimum Payment vs Extra Payment',
        url: '/guides/minimum-payment-vs-extra-payment/',
        description:
          'See why a small fixed extra payment often changes the outcome more than it first appears.',
      },
      {
        title: 'How Credit Card Interest Works',
        url: '/guides/how-credit-card-interest-works/',
        description:
          'Understand why balances with high APRs can linger when the minimum payment is too low.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Minimum Payment Scenario',
      description:
        'Use the calculator to test your balance, APR, issuer minimum percentage, and payment floor.',
      url: '/calculators/credit-card-minimum-payment-calculator/',
      label: 'Open the Credit Card Minimum Payment Calculator',
      examplesUrl: '/calculators/credit-card-minimum-payment/examples/',
      examplesLabel: 'Browse All Minimum Payment Examples',
    },
  };
}

export function auditCreditCardMinimumPaymentSeoRecords(
  records: CreditCardMinimumPaymentSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'credit card minimum payment',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.balance} balance, ${record.aprPercent}% APR, ${record.minimumPaymentPercent}% issuer minimum, and ${record.minimumPaymentFloor} minimum-payment floor assumptions.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createCreditCardMinimumPaymentCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createCreditCardMinimumPaymentCanonicalPath,
  });
}
