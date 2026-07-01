import type { DebtAvalancheSeoRecord } from '../../data/programmatic-seo/debt-avalanche';
import { calculateDebtAvalanche } from '../math';
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

const clusterPath = 'calculators/debt-avalanche';

export function createDebtAvalancheCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function profileFraming(record: DebtAvalancheSeoRecord): string {
  switch (record.profileLabel) {
    case 'starter':
      return 'This starter-sized debt mix is common for someone earlier in a payoff journey, with a smaller total balance than a fuller household debt load.';
    case 'family':
      return 'This family-sized debt mix combines a larger revolving balance with an auto loan and a student loan, which is a common household combination.';
    case 'rebuild':
      return 'This rebuild-focused debt mix concentrates on multiple cards and an installment loan, which is common when consolidating after a period of higher-rate borrowing.';
    case 'catchup':
      return 'This catch-up debt mix reflects a period of higher balances across cards and a personal loan, often after an unexpected expense.';
    case 'mixed':
      return 'This mixed debt profile spans a card, an auto repair loan, and a consolidation loan, which is a common blend of revolving and installment debt.';
  }
}

function extraPaymentTierFraming(extraMonthlyPayment: number): string {
  if (extraMonthlyPayment === 0) {
    return 'With no extra payment in this example, only the required minimums are covering the debt budget, which is the slowest version of this payoff plan.';
  }
  if (extraMonthlyPayment <= 150) {
    return 'A modest extra payment like this one still directs meaningful money toward the highest-rate balance ahead of the others.';
  }
  if (extraMonthlyPayment <= 300) {
    return 'A moderate extra payment like this one can noticeably shorten the time before the highest-rate balance is cleared.';
  }
  return 'An aggressive extra payment like this one can clear the highest-rate balance relatively quickly, then roll forward to the next target.';
}

function extraPaymentFaqFraming(extraMonthlyPayment: number): string {
  if (extraMonthlyPayment === 0) {
    return 'This example uses no extra payment, which is the slowest pace modeled in this cluster of examples.';
  }
  if (extraMonthlyPayment <= 150) {
    return 'This extra payment is on the smaller end of what this cluster of examples models.';
  }
  if (extraMonthlyPayment <= 300) {
    return 'This extra payment sits in the middle of what this cluster of examples models.';
  }
  return 'This extra payment is on the larger end of what this cluster of examples models.';
}

function createTable(record: DebtAvalancheSeoRecord): ProgrammaticSeoTable {
  return {
    heading: 'Debt Lineup in This Avalanche Example',
    columns: ['Balance', 'Interest rate', 'Minimum payment'],
    rows: [
      { label: record.debt1Name, cells: [currency.format(record.debt1Balance), `${record.debt1InterestRate}%`, currency.format(record.debt1MinimumPayment)] },
      { label: record.debt2Name, cells: [currency.format(record.debt2Balance), `${record.debt2InterestRate}%`, currency.format(record.debt2MinimumPayment)] },
      { label: record.debt3Name, cells: [currency.format(record.debt3Balance), `${record.debt3InterestRate}%`, currency.format(record.debt3MinimumPayment)] },
    ],
  };
}

function createRelatedPages(record: DebtAvalancheSeoRecord, records: DebtAvalancheSeoRecord[]): ProgrammaticSeoLink[] {
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
      url: createDebtAvalancheCanonicalPath(candidate.slug),
      description: `${candidate.profileLabel} debt mix with ${currency.format(candidate.extraMonthlyPayment)} extra each month.`,
    }));
}

export function createDebtAvalancheSeoPage(
  record: DebtAvalancheSeoRecord,
  records: DebtAvalancheSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateDebtAvalanche({
    debts: [
      { name: record.debt1Name, balance: record.debt1Balance, annualInterestRatePercent: record.debt1InterestRate, minimumMonthlyPayment: record.debt1MinimumPayment },
      { name: record.debt2Name, balance: record.debt2Balance, annualInterestRatePercent: record.debt2InterestRate, minimumMonthlyPayment: record.debt2MinimumPayment },
      { name: record.debt3Name, balance: record.debt3Balance, annualInterestRatePercent: record.debt3InterestRate, minimumMonthlyPayment: record.debt3MinimumPayment },
    ],
    extraMonthlyPayment: record.extraMonthlyPayment,
  });
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${record.profileLabel} debt avalanche example with ${currency.format(record.extraMonthlyPayment)} extra monthly and ${currency.format(result.totalDebt)} total debt.`,
  });

  return {
    slug: record.slug,
    url: createDebtAvalancheCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Debt avalanche example',
    intro: `This worked example shows how a highest-interest-first debt payoff plan may behave when a fixed extra payment is added to the monthly debt budget. ${profileFraming(record)} ${extraPaymentTierFraming(record.extraMonthlyPayment)}`,
    summary: `The example debt stack totals ${currency.format(result.totalDebt)} with ${currency.format(result.totalMinimumPayments)} in minimum payments. Under the debt avalanche method, the suggested order starts with ${result.highestInterestDebt}, and the estimated payoff time is ${result.estimatedPayoffMonths == null ? 'not reached under the current budget' : `${result.estimatedPayoffMonths} months`}.`,
    results: [
      { label: 'Total debt', value: currency.format(result.totalDebt), primary: true },
      { label: 'Total minimum payments', value: currency.format(result.totalMinimumPayments) },
      { label: 'Highest-interest debt first', value: result.highestInterestDebt },
      { label: 'Estimated payoff time', value: result.estimatedPayoffMonths == null ? 'Not reached' : `${result.estimatedPayoffMonths} months` },
    ],
    formula: {
      heading: 'How This Avalanche Example Works',
      expression: 'Minimum payments stay current while extra money attacks the highest interest rate first',
      explanation:
        'The shared debt-avalanche math accrues monthly interest, pays required minimums, and sends remaining budget toward the highest-rate active debt.',
      steps: [
        'List each debt balance, interest rate, and minimum payment.',
        `Add ${currency.format(record.extraMonthlyPayment)} to the total monthly debt budget.`,
        'Pay minimums on every active debt.',
        'Direct the remaining budget to the highest-interest balance, then roll that payment forward after payoff.',
      ],
    },
    showChart: false,
    projectionHeading: 'Debt Avalanche Debt Mix',
    projectionRows: [],
    table: createTable(record),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What avalanche examples help clarify',
        paragraphs: [
          'The debt avalanche method is most useful when the main goal is reducing interest cost rather than clearing the smallest balance first.',
          'Worked examples make that strategy easier to visualize by showing which debt becomes the first target and how a fixed debt budget gets reallocated over time.',
        ],
      },
    ],
    faq: [
      {
        question: 'Why does the highest interest rate go first here?',
        answer:
          'That is the defining rule of the debt avalanche method. The strategy sends extra money to the most expensive debt first while keeping minimums current on everything else.',
      },
      {
        question: 'Can an avalanche plan still fail to pay off debt?',
        answer:
          'Yes. If the combined monthly debt budget is too low to reduce balances after interest accrues, the payoff path may be unreachable under the current assumptions.',
      },
      {
        question: `Is ${currency.format(record.extraMonthlyPayment)} extra a small or large payment in this example?`,
        answer: extraPaymentFaqFraming(record.extraMonthlyPayment),
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Debt Avalanche Calculator', url: '/calculators/debt-avalanche-calculator/' },
      { name: 'Examples', url: '/calculators/debt-avalanche/examples/' },
      { name: record.question, url: createDebtAvalancheCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Debt Avalanche Calculator',
        url: '/calculators/debt-avalanche-calculator/',
        description: 'Run your own balances, rates, minimums, and extra-payment assumptions.',
      },
      {
        title: 'Debt Snowball Calculator',
        url: '/calculators/debt-snowball-calculator/',
        description: 'Compare highest-interest-first repayment with a smallest-balance-first strategy.',
      },
      {
        title: 'Debt Payoff Calculator',
        url: '/calculators/debt-payoff-calculator/',
        description: 'Zoom in on one debt before comparing broader multi-debt payoff order methods.',
      },
    ],
    relatedGuides: [
      {
        title: 'Debt Snowball vs Debt Avalanche',
        url: '/guides/debt-snowball-vs-debt-avalanche/',
        description: 'See the behavioral and interest-cost tradeoffs between the two major payoff frameworks.',
      },
      {
        title: 'Debt Payoff Guide',
        url: '/guides/debt-payoff/',
        description: 'Use a broader debt plan that still respects cash flow and emergency reserves.',
      },
    ],
    calculatorCta: {
      heading: 'Build Your Own Avalanche Plan',
      description: 'Use the full calculator to enter your own balances, rates, minimums, and extra monthly payment.',
      url: '/calculators/debt-avalanche-calculator/',
      label: 'Open the Debt Avalanche Calculator',
      examplesUrl: '/calculators/debt-avalanche/examples/',
      examplesLabel: 'Browse All Debt Avalanche Examples',
    },
    relatedPagesHeading: 'Related Debt Avalanche Examples',
  };
}

export function auditDebtAvalancheSeoRecords(
  records: DebtAvalancheSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'debt avalanche',
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
        url: createDebtAvalancheCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createDebtAvalancheCanonicalPath,
  });
}
