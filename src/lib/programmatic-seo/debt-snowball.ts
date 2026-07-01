import type { DebtSnowballSeoRecord } from '../../data/programmatic-seo/debt-snowball';
import { calculateDebtSnowball } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type { ProgrammaticSeoLink, ProgrammaticSeoPageModel, ProgrammaticSeoTable } from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const clusterPath = 'calculators/debt-snowball';

export function createDebtSnowballCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function profileFraming(record: DebtSnowballSeoRecord): string {
  switch (record.profileLabel) {
    case 'starter':
      return 'This starter-sized debt mix is common earlier in a payoff journey, with smaller balances than a fuller household debt load.';
    case 'family':
      return 'This family-sized debt mix combines a card, an auto repair loan, and a furniture loan, a common household combination.';
    case 'rebuild':
      return 'This rebuild-focused debt mix concentrates on multiple cards and an installment loan, common when consolidating after a period of higher borrowing.';
    case 'catchup':
      return 'This catch-up debt mix reflects a period of higher balances across a travel card, a personal loan, and an auto loan.';
    case 'mixed':
      return 'This mixed debt profile spans medical debt, a credit card, and a student loan, a common blend of unplanned and planned borrowing.';
    default:
      return 'This debt mix reflects one of several common household debt combinations modeled in this cluster of examples.';
  }
}

function extraPaymentTierFraming(extraMonthlyPayment: number): string {
  if (extraMonthlyPayment === 0) {
    return 'With no extra payment in this example, only the required minimums are covering the debt budget, which is the slowest version of this payoff plan.';
  }
  if (extraMonthlyPayment <= 150) {
    return 'A modest extra payment like this one still creates an early win by clearing the smallest balance sooner.';
  }
  if (extraMonthlyPayment <= 300) {
    return 'A moderate extra payment like this one can noticeably speed up how quickly the first balance disappears.';
  }
  return 'An aggressive extra payment like this one can clear the smallest balance relatively quickly, then roll forward to the next target.';
}

function extraPaymentFaqFraming(extraMonthlyPayment: number): string {
  if (extraMonthlyPayment === 0) {
    return 'This example uses no extra payment, the slowest pace modeled in this cluster of examples.';
  }
  if (extraMonthlyPayment <= 150) {
    return 'This extra payment is on the smaller end of what this cluster of examples models.';
  }
  if (extraMonthlyPayment <= 300) {
    return 'This extra payment sits in the middle of what this cluster of examples models.';
  }
  return 'This extra payment is on the larger end of what this cluster of examples models.';
}

function createTable(record: DebtSnowballSeoRecord): ProgrammaticSeoTable {
  return {
    heading: 'Debt Lineup in This Snowball Example',
    columns: ['Balance', 'Minimum payment'],
    rows: [
      { label: record.debt1Name, cells: [currency.format(record.debt1Balance), currency.format(record.debt1MinimumPayment)] },
      { label: record.debt2Name, cells: [currency.format(record.debt2Balance), currency.format(record.debt2MinimumPayment)] },
      { label: record.debt3Name, cells: [currency.format(record.debt3Balance), currency.format(record.debt3MinimumPayment)] },
    ],
  };
}

function createRelatedPages(record: DebtSnowballSeoRecord, records: DebtSnowballSeoRecord[]): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.extraMonthlyPayment - record.extraMonthlyPayment) / 50 +
        Math.abs(
          candidate.debt1Balance + candidate.debt2Balance + candidate.debt3Balance -
            (record.debt1Balance + record.debt2Balance + record.debt3Balance),
        ) / 1000,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createDebtSnowballCanonicalPath(candidate.slug),
      description: `${candidate.profileLabel} debt mix with ${currency.format(candidate.extraMonthlyPayment)} extra each month.`,
    }));
}

export function createDebtSnowballSeoPage(
  record: DebtSnowballSeoRecord,
  records: DebtSnowballSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateDebtSnowball({
    debts: [
      { name: record.debt1Name, balance: record.debt1Balance, minimumMonthlyPayment: record.debt1MinimumPayment },
      { name: record.debt2Name, balance: record.debt2Balance, minimumMonthlyPayment: record.debt2MinimumPayment },
      { name: record.debt3Name, balance: record.debt3Balance, minimumMonthlyPayment: record.debt3MinimumPayment },
    ],
    extraMonthlyPayment: record.extraMonthlyPayment,
  });
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${record.profileLabel} debt snowball example with ${currency.format(record.extraMonthlyPayment)} extra monthly and ${currency.format(result.totalDebt)} total debt.`,
  });

  return {
    slug: record.slug,
    url: createDebtSnowballCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Debt snowball example',
    intro: `This worked example uses a three-debt lineup to show how a smallest-balance-first payoff plan may behave when ${currency.format(record.extraMonthlyPayment)} of extra cash is added each month. ${profileFraming(record)} ${extraPaymentTierFraming(record.extraMonthlyPayment)}`,
    summary: `The example debt stack totals ${currency.format(result.totalDebt)} with ${currency.format(result.totalMinimumPayments)} in required minimum payments. Under the debt snowball method, the estimated payoff time is ${result.estimatedPayoffMonths} months and the suggested payoff order is ${result.suggestedPayoffOrder.join(' -> ')}.`,
    results: [
      { label: 'Total debt', value: currency.format(result.totalDebt), primary: true },
      { label: 'Total minimum payments', value: currency.format(result.totalMinimumPayments) },
      { label: 'Extra monthly payment', value: currency.format(record.extraMonthlyPayment) },
      { label: 'Estimated payoff time', value: `${result.estimatedPayoffMonths} months` },
    ],
    formula: {
      heading: 'How This Snowball Example Works',
      expression: 'Minimum payments stay current while extra money goes to the smallest remaining balance',
      explanation:
        'The shared debt-snowball math keeps minimum payments on each active debt and rolls freed payments into the next-smallest balance after a debt is cleared.',
      steps: [
        'List each debt balance and minimum payment.',
        `Add ${currency.format(record.extraMonthlyPayment)} to the fixed monthly debt budget.`,
        'Pay minimums on every active debt.',
        'Send the remaining budget to the smallest balance and roll that payment forward after each payoff.',
      ],
    },
    showChart: false,
    projectionHeading: 'Debt Snowball Debt Mix',
    projectionRows: [],
    table: createTable(record),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What snowball examples are good for',
        paragraphs: [
          'A debt snowball plan is about payment order and momentum, not just interest math.',
          'Worked examples make it easier to see how a fixed debt budget behaves when small balances disappear and their payments roll into the next target.',
        ],
      },
    ],
    faq: [
      {
        question: 'Why does the smallest balance go first here?',
        answer:
          'That is the defining rule of the debt snowball method. The strategy prioritizes early wins and simpler monthly obligations as debts are cleared.',
      },
      {
        question: 'Does this prove snowball is cheaper than avalanche?',
        answer:
          'No. Avalanche often reduces interest more efficiently, while snowball may be easier for some people to stick with consistently.',
      },
      {
        question: `Is ${currency.format(record.extraMonthlyPayment)} extra a small or large payment in this example?`,
        answer: extraPaymentFaqFraming(record.extraMonthlyPayment),
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Debt Snowball Calculator', url: '/calculators/debt-snowball-calculator/' },
      { name: 'Examples', url: '/calculators/debt-snowball/examples/' },
      { name: record.question, url: createDebtSnowballCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Debt Snowball Calculator',
        url: '/calculators/debt-snowball-calculator/',
        description: 'Run your own balances, minimums, and extra-payment budget.',
      },
      {
        title: 'Debt Avalanche Calculator',
        url: '/calculators/debt-avalanche-calculator/',
        description: 'Compare a motivation-first snowball plan with a highest-interest-first strategy.',
      },
      {
        title: 'Debt Payoff Calculator',
        url: '/calculators/debt-payoff-calculator/',
        description: 'Zoom in on one balance before comparing multi-debt payoff order strategies.',
      },
    ],
    relatedGuides: [
      {
        title: 'Debt Snowball vs Debt Avalanche',
        url: '/guides/debt-snowball-vs-debt-avalanche/',
        description: 'Compare the behavioral and interest-cost tradeoffs between the two major payoff methods.',
      },
      {
        title: 'Debt Payoff Guide',
        url: '/guides/debt-payoff/',
        description: 'Build a larger payoff plan that fits your budget and cash reserves.',
      },
    ],
    calculatorCta: {
      heading: 'Build Your Own Snowball Plan',
      description: 'Use the full calculator to enter your own balances, minimums, and extra monthly payment.',
      url: '/calculators/debt-snowball-calculator/',
      label: 'Open the Debt Snowball Calculator',
      examplesUrl: '/calculators/debt-snowball/examples/',
      examplesLabel: 'Browse All Debt Snowball Examples',
    },
    relatedPagesHeading: 'Related Debt Snowball Examples',
  };
}

export function auditDebtSnowballSeoRecords(
  records: DebtSnowballSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'debt snowball',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using the ${record.profileLabel} debt mix and ${record.extraMonthlyPayment} extra monthly.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createDebtSnowballCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createDebtSnowballCanonicalPath,
  });
}
