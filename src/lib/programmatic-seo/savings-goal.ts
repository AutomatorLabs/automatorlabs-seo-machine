import type { SavingsGoalSeoRecord } from '../../data/programmatic-seo/savings-goal';
import { futureValue } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
  ProgrammaticSeoProjectionRow,
} from './types';

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

const percentage = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const savingsGoalClusterPath = 'calculators/savings-goal';

export function createSavingsGoalCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(savingsGoalClusterPath, slug);
}

export function calculateRequiredMonthlySavings(
  record: Pick<
    SavingsGoalSeoRecord,
    'goalAmount' | 'years' | 'currentSavings' | 'annualReturnPercent'
  >,
): number {
  const months = record.years * 12;
  const monthlyRate = record.annualReturnPercent / 100 / 12;
  const balanceWithoutContributions = futureValue({
    principal: record.currentSavings,
    contributionPerPeriod: 0,
    ratePerPeriod: monthlyRate,
    numberOfPeriods: months,
  });

  if (balanceWithoutContributions >= record.goalAmount) return 0;

  let low = 0;
  let high = Math.max(
    (record.goalAmount - record.currentSavings) / months,
    1,
  );

  while (
    futureValue({
      principal: record.currentSavings,
      contributionPerPeriod: high,
      ratePerPeriod: monthlyRate,
      numberOfPeriods: months,
    }) < record.goalAmount
  ) {
    high *= 2;
  }

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const midpoint = (low + high) / 2;
    const endingBalance = futureValue({
      principal: record.currentSavings,
      contributionPerPeriod: midpoint,
      ratePerPeriod: monthlyRate,
      numberOfPeriods: months,
    });

    if (endingBalance >= record.goalAmount) {
      high = midpoint;
    } else {
      low = midpoint;
    }
  }

  return high;
}

export function createSavingsGoalProjection(
  record: SavingsGoalSeoRecord,
  monthlySavings = calculateRequiredMonthlySavings(record),
): ProgrammaticSeoProjectionRow[] {
  const monthlyRate = record.annualReturnPercent / 100 / 12;

  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const months = period * 12;
    const endingBalance = futureValue({
      principal: record.currentSavings,
      contributionPerPeriod: monthlySavings,
      ratePerPeriod: monthlyRate,
      numberOfPeriods: months,
    });
    const contributions =
      record.currentSavings + monthlySavings * months;

    return {
      period,
      contributions,
      growth: endingBalance - contributions,
      endingBalance,
    };
  });
}

function createRelatedPages(
  record: SavingsGoalSeoRecord,
  records: SavingsGoalSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 2) +
        Math.abs(candidate.goalAmount - record.goalAmount) /
          Math.max(record.goalAmount, 1) +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createSavingsGoalCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.goalAmount)} over ${candidate.years} years for a ${candidate.purpose}.`,
    }));
}

function createFaq(
  record: SavingsGoalSeoRecord,
  monthlySavings: number,
  totalGrowth: number,
) {
  const goal = wholeCurrency.format(record.goalAmount);
  const rate = `${percentage.format(record.annualReturnPercent)}%`;

  return [
    {
      question: `How much should I save each month to reach ${goal} in ${record.years} years?`,
      answer: `With ${wholeCurrency.format(record.currentSavings)} already saved and a constant ${rate} annual return compounded monthly, the estimated monthly amount is ${currency.format(monthlySavings)}.`,
    },
    {
      question: `How much of the ${goal} target comes from estimated growth?`,
      answer: `Under these fixed assumptions, approximately ${currency.format(totalGrowth)} comes from growth. The rest comes from current savings and monthly deposits.`,
    },
    {
      question: 'Is the expected return guaranteed?',
      answer:
        'No. Savings yields and investment returns can change, and market investments can lose value. The rate is a planning assumption used to compare scenarios.',
    },
    {
      question: 'When are monthly deposits assumed to be made?',
      answer:
        'The projection assumes equal deposits at the end of each month and monthly compounding. Depositing earlier can produce a slightly different result.',
    },
    {
      question: 'Does this savings plan include taxes, fees, or inflation?',
      answer:
        'No. The figures are nominal and exclude taxes, account fees, inflation, withdrawals, and changes to the target or contribution amount.',
    },
    {
      question: 'What if I already have money saved?',
      answer:
        'Existing savings reduce the amount that monthly deposits must provide and may also earn growth. Use the full Savings Goal Calculator to enter your actual starting balance.',
    },
    {
      question: 'How can I make the monthly target more manageable?',
      answer:
        'A longer timeline, a smaller target, a larger starting balance, or occasional extra deposits can reduce the required monthly amount. Avoid assuming a higher return unless the added risk is appropriate.',
    },
  ];
}

export function createSavingsGoalSeoPage(
  record: SavingsGoalSeoRecord,
  records: SavingsGoalSeoRecord[],
): ProgrammaticSeoPageModel {
  const monthlySavings = calculateRequiredMonthlySavings(record);
  const projectionRows = createSavingsGoalProjection(record, monthlySavings);
  const finalRow = projectionRows.at(-1);
  const totalContributions =
    record.currentSavings + monthlySavings * record.years * 12;
  const totalGrowth = Math.max(
    (finalRow?.endingBalance ?? record.goalAmount) - totalContributions,
    0,
  );
  const goal = wholeCurrency.format(record.goalAmount);
  const rate = `${percentage.format(record.annualReturnPercent)}%`;
  const duration = `${record.years} ${record.years === 1 ? 'year' : 'years'}`;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `Save about ${currency.format(monthlySavings)} per month toward a ${goal} ${record.purpose} in ${duration} at an assumed ${rate} return. See the projection, assumptions, and FAQs.`,
  });

  return {
    slug: record.slug,
    url: createSavingsGoalCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: `${record.purpose} example`,
    intro: `This worked example estimates the monthly deposit needed to build a ${goal} ${record.purpose} over ${duration}, starting with ${wholeCurrency.format(record.currentSavings)} and assuming a constant ${rate} annual return.`,
    summary: `The estimated required monthly savings is ${currency.format(monthlySavings)}. If deposits are made at the end of each month and the balance earns the assumed return, the projected balance reaches approximately ${currency.format(finalRow?.endingBalance ?? record.goalAmount)} after ${record.years * 12} months.`,
    results: [
      {
        label: 'Required monthly savings',
        value: currency.format(monthlySavings),
        primary: true,
      },
      {
        label: 'Savings target',
        value: goal,
      },
      {
        label: 'Estimated deposits',
        value: currency.format(monthlySavings * record.years * 12),
      },
      {
        label: 'Estimated growth',
        value: currency.format(totalGrowth),
      },
    ],
    formula: {
      heading: 'How This Savings Goal Calculation Works',
      expression: 'Target = current savings growth + monthly deposit growth',
      explanation: `The page uses the shared future-value calculation to find the monthly deposit that reaches ${goal} after ${record.years * 12} months at ${rate}.`,
      steps: [
        `Start with ${currency.format(record.currentSavings)} already saved.`,
        `Apply a monthly rate derived from the ${rate} annual assumption.`,
        `Test equal end-of-month deposits across ${record.years * 12} months.`,
        `Find the monthly amount that brings the projected balance to ${goal}.`,
      ],
    },
    projectionHeading: 'Year-by-Year Savings Projection',
    projectionRows,
    chartPoints: [
      { period: 0, value: record.currentSavings },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    chartHeading: 'Savings Progress Over Time',
    chartDescription:
      'The chart shows the projected year-end balance when the estimated monthly deposit and return assumption remain unchanged.',
    chartLabel: `${goal} ${record.purpose} projection over ${record.years} years`,
    sections: [
      {
        heading: 'Assumptions behind this example',
        paragraphs: [
          `This example assumes ${currency.format(monthlySavings)} is deposited at the end of every month, the balance compounds monthly at a constant ${rate} annual rate, and no money is withdrawn.`,
          'It excludes taxes, fees, inflation, changing account yields, market volatility, and changes to the goal. A short-term goal may warrant a lower-risk assumption than a long-term investment goal.',
        ],
      },
      {
        heading: `Planning for a ${record.purpose}`,
        paragraphs: [
          `Treat ${currency.format(monthlySavings)} as a scenario benchmark rather than a recommendation. Compare it with available monthly cash flow, other goals, debt obligations, and the level of risk appropriate for the deadline.`,
          `If the amount is difficult to sustain, extend the deadline or revisit the target before relying on a more aggressive return assumption. Consistent deposits usually matter more than a precise forecast.`,
        ],
      },
      {
        heading: 'How to use the result',
        paragraphs: [
          'Use the full Savings Goal Calculator to enter current savings and test a contribution you can realistically repeat. Then compare the estimated completion date with the deadline shown here.',
          'Review the plan periodically. Extra deposits can create a buffer, while missed deposits, lower returns, fees, or a rising target can delay completion.',
        ],
      },
    ],
    faq: createFaq(record, monthlySavings, totalGrowth),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Savings Goal Calculator',
        url: '/calculators/savings-goal-calculator/',
      },
      {
        name: 'Savings Goal Examples',
        url: '/calculators/savings-goal/examples/',
      },
      { name: title, url: createSavingsGoalCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Savings Goal Examples',
    relatedCalculators: [
      {
        title: 'Compound Interest Calculator',
        url: '/calculators/compound-interest/',
        description:
          'Project how a starting balance and regular contributions may compound.',
      },
      {
        title: 'Investment Growth Calculator',
        url: '/calculators/investment-growth-calculator/',
        description:
          'Estimate long-term investment growth from contributions and return.',
      },
      {
        title: 'FIRE Calculator',
        url: '/calculators/fire-calculator/',
        description:
          'Connect retirement spending, invested assets, and monthly saving.',
      },
      {
        title: 'APY Calculator',
        url: '/calculators/apy-calculator/',
        description:
          'Convert a nominal rate and compounding frequency into annual yield.',
      },
      {
        title: 'Savings Growth Calculator',
        url: '/calculators/savings-growth-calculator/',
        description:
          'Project a savings balance using regular deposits and monthly growth.',
      },
    ],
    relatedGuides: [
      {
        title: 'Budgeting and Saving for Real Life',
        url: '/guides/budgeting/',
        description:
          'Turn financial priorities into repeatable monthly allocations.',
      },
      {
        title: 'What Is Compound Interest?',
        url: '/guides/what-is-compound-interest/',
        description:
          'Understand how time, contributions, and reinvested growth interact.',
      },
      {
        title: 'APR vs APY',
        url: '/guides/apr-vs-apy/',
        description:
          'Compare stated annual rates with effective yields after compounding.',
      },
    ],
    calculatorCta: {
      heading: 'Build Your Own Savings Plan',
      description:
        'Use the full calculator to enter your current savings, planned monthly contribution, target, and expected return.',
      url: '/calculators/savings-goal-calculator/',
      label: 'Open the Savings Goal Calculator',
      examplesUrl: '/calculators/savings-goal/examples/',
      examplesLabel: 'Browse All Savings Goal Examples',
    },
  };
}

export type SavingsGoalSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditSavingsGoalSeoRecords(
  records: SavingsGoalSeoRecord[],
  expectedCount: number,
): SavingsGoalSeoAuditResult {
  const pages = records.map((record) =>
    createSavingsGoalSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Savings Goal',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createSavingsGoalCanonicalPath,
  });
}
