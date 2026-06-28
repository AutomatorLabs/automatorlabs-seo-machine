import type { EmergencyFundSeoRecord } from '../../data/programmatic-seo/emergency-fund';
import { calculateEmergencyFund } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoChartPoint,
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
  ProgrammaticSeoProjectionRow,
  ProgrammaticSeoTable,
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

const emergencyFundClusterPath = 'calculators/emergency-fund';

export function createEmergencyFundCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(emergencyFundClusterPath, slug);
}

function createEmergencyFundProjection(
  record: EmergencyFundSeoRecord,
  estimatedMonthsToTarget: number,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: estimatedMonthsToTarget }, (_, index) => {
    const period = index + 1;
    const endingBalance =
      record.currentEmergencySavings +
      record.monthlySavingsContribution * period;

    return {
      period,
      contributions: record.currentEmergencySavings,
      growth:
        endingBalance - record.currentEmergencySavings,
      endingBalance,
    };
  });
}

function createComparisonTable(
  record: EmergencyFundSeoRecord,
  targetEmergencyFund: number,
  amountStillNeeded: number,
  estimatedMonthsToTarget: number,
): ProgrammaticSeoTable {
  return {
    heading: 'Emergency Fund Snapshot',
    columns: ['Value'],
    rows: [
      {
        label: 'Monthly essential expenses',
        cells: [currency.format(record.monthlyEssentialExpenses)],
      },
      {
        label: 'Coverage target',
        cells: [`${record.targetMonths} months`],
      },
      {
        label: 'Target emergency fund',
        cells: [currency.format(targetEmergencyFund)],
      },
      {
        label: 'Current emergency savings',
        cells: [currency.format(record.currentEmergencySavings)],
      },
      {
        label: 'Amount still needed',
        cells: [currency.format(amountStillNeeded)],
      },
      {
        label: 'Monthly savings contribution',
        cells: [currency.format(record.monthlySavingsContribution)],
      },
      {
        label: 'Estimated months to target',
        cells: [`${estimatedMonthsToTarget}`],
      },
    ],
  };
}

function createChartPoints(
  record: EmergencyFundSeoRecord,
  projectionRows: ProgrammaticSeoProjectionRow[],
): ProgrammaticSeoChartPoint[] {
  return [
    {
      period: 0,
      value: record.currentEmergencySavings,
    },
    ...projectionRows.map((row) => ({
      period: row.period,
      value: row.endingBalance,
    })),
  ];
}

function createRelatedPages(
  record: EmergencyFundSeoRecord,
  records: EmergencyFundSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 2) +
        Math.abs(
          candidate.monthlyEssentialExpenses -
            record.monthlyEssentialExpenses,
        ) /
          Math.max(record.monthlyEssentialExpenses, 1) +
        Math.abs(candidate.targetMonths - record.targetMonths) /
          Math.max(record.targetMonths, 1) +
        Math.abs(
          candidate.monthlySavingsContribution -
            record.monthlySavingsContribution,
        ) /
          Math.max(record.monthlySavingsContribution, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createEmergencyFundCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.monthlyEssentialExpenses)} monthly expenses, ${candidate.targetMonths} months of coverage, ${wholeCurrency.format(candidate.monthlySavingsContribution)} saved monthly.`,
    }));
}

function relatedCalculatorsFor(
  record: EmergencyFundSeoRecord,
): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'Emergency Fund Calculator',
      url: '/calculators/emergency-fund-calculator/',
      description:
        'Estimate your target cash buffer and how long it could take to build.',
    },
    {
      title: 'Savings Goal Calculator',
      url: '/calculators/savings-goal-calculator/',
      description:
        'Compare a general savings target with a broader goal-planning formula.',
    },
    {
      title: 'Monthly Savings Calculator',
      url: '/calculators/monthly-savings-calculator/',
      description:
        'Translate a target into recurring monthly savings requirements.',
    },
  ];

  calculators.push(
    record.intent === 'family-emergency-fund'
      ? {
          title: 'Budget Calculator',
          url: '/calculators/budget-calculator/',
          description:
            'Check whether the monthly savings target fits the rest of the household plan.',
        }
      : {
          title: 'Vacation Savings Calculator',
          url: '/calculators/vacation-savings-calculator/',
          description:
            'Compare emergency saving with a lower-priority short-term goal.',
        },
  );

  return calculators;
}

function relatedGuidesFor(): ProgrammaticSeoLink[] {
  return [
    {
      title: 'How to Use the Emergency Fund Calculator',
      url: '/guides/how-to-use-emergency-fund-calculator/',
      description:
        'Choose a coverage target and estimate how much cash reserve fits your situation.',
    },
    {
      title: 'Budgeting and Saving for Real Life',
      url: '/guides/budgeting/',
      description:
        'Create room for emergency savings without ignoring regular bills and other priorities.',
    },
    {
      title: 'How to Calculate Savings Rate',
      url: '/guides/how-to-calculate-savings-rate/',
      description:
        'Measure how much of income can realistically support recurring savings goals.',
    },
  ];
}

function createFaq(
  record: EmergencyFundSeoRecord,
  targetEmergencyFund: number,
  amountStillNeeded: number,
  estimatedMonthsToTarget: number,
) {
  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `With ${currency.format(record.monthlyEssentialExpenses)} of monthly essential expenses and a ${record.targetMonths}-month target, the emergency fund goal is ${currency.format(targetEmergencyFund)}. Starting with ${currency.format(record.currentEmergencySavings)} and saving ${currency.format(record.monthlySavingsContribution)} per month, the model estimates about ${estimatedMonthsToTarget} months to reach the target.`,
    },
    {
      question: 'Does this example include investment growth or interest?',
      answer:
        'No. It follows the shared Emergency Fund Calculator and assumes the balance grows only from current savings plus monthly contributions.',
    },
    {
      question: 'Why use months of expenses instead of one fixed dollar amount?',
      answer:
        'Coverage months scale the target with actual essential spending, which makes the buffer easier to compare across households and risk levels.',
    },
    {
      question: 'Should the emergency fund be invested?',
      answer:
        'Emergency savings are usually kept accessible and stable rather than exposed to market volatility, since the money may be needed on short notice.',
    },
    {
      question: 'What if the estimated monthly contribution feels too high?',
      answer:
        'Lowering the monthly expense target, starting with a smaller coverage goal, or improving cash flow through budgeting can make the plan more sustainable.',
    },
  ];
}

export function createEmergencyFundSeoPage(
  record: EmergencyFundSeoRecord,
  records: EmergencyFundSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateEmergencyFund({
    monthlyEssentialExpenses: record.monthlyEssentialExpenses,
    targetMonths: record.targetMonths,
    currentEmergencySavings: record.currentEmergencySavings,
    monthlySavingsContribution: record.monthlySavingsContribution,
  });
  const estimatedMonthsToTarget = result.estimatedMonthsToTarget ?? 0;
  const projectionRows = createEmergencyFundProjection(
    record,
    estimatedMonthsToTarget,
  );
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.monthlyEssentialExpenses)} of monthly essential expenses with a ${record.targetMonths}-month target creates an emergency fund goal of ${currency.format(result.targetEmergencyFund)}. With ${currency.format(record.currentEmergencySavings)} already saved and ${currency.format(record.monthlySavingsContribution)} saved monthly, this scenario takes about ${estimatedMonthsToTarget} months.`,
  });

  return {
    slug: record.slug,
    url: createEmergencyFundCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: record.scenarioLabel,
    intro: `This worked example estimates how long it could take to build an emergency fund for ${currency.format(record.monthlyEssentialExpenses)} of monthly essential expenses using a ${record.targetMonths}-month coverage target.`,
    summary: `The target emergency fund is about ${currency.format(result.targetEmergencyFund)}. With ${currency.format(record.currentEmergencySavings)} already set aside and ${currency.format(record.monthlySavingsContribution)} saved each month, the projected time to target is about ${estimatedMonthsToTarget} months.`,
    results: [
      {
        label: 'Estimated months to target',
        value: `${estimatedMonthsToTarget} months`,
        primary: true,
      },
      {
        label: 'Target emergency fund',
        value: currency.format(result.targetEmergencyFund),
      },
      {
        label: 'Amount still needed',
        value: currency.format(result.amountStillNeeded),
      },
      {
        label: 'Monthly savings contribution',
        value: currency.format(record.monthlySavingsContribution),
      },
    ],
    formula: {
      heading: 'How This Emergency Fund Calculation Works',
      expression:
        'Target fund = monthly essential expenses × coverage months',
      explanation:
        'The page reuses the shared Emergency Fund Calculator, which compares the target cash reserve with current savings and a fixed monthly contribution.',
      steps: [
        `Multiply ${currency.format(record.monthlyEssentialExpenses)} of monthly essential expenses by ${record.targetMonths} months of coverage.`,
        `Set the target emergency fund at ${currency.format(result.targetEmergencyFund)}.`,
        `Subtract the current savings balance of ${currency.format(record.currentEmergencySavings)}.`,
        `Divide the remaining gap by the monthly savings amount of ${currency.format(record.monthlySavingsContribution)} to estimate ${estimatedMonthsToTarget} months to target.`,
      ],
    },
    projectionHeading: 'Emergency Fund Progress by Month',
    projectionRows,
    table: createComparisonTable(
      record,
      result.targetEmergencyFund,
      result.amountStillNeeded,
      estimatedMonthsToTarget,
    ),
    chartPoints: createChartPoints(record, projectionRows),
    chartHeading: 'Emergency Fund Progress Over Time',
    chartDescription:
      'The chart tracks the projected emergency savings balance when the monthly contribution stays constant and no withdrawals are made.',
    chartLabel: `${title} emergency fund progress by month`,
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `A ${record.targetMonths}-month reserve against ${currency.format(record.monthlyEssentialExpenses)} of essential expenses produces a target of ${currency.format(result.targetEmergencyFund)}. The current balance and monthly savings rate determine how quickly that gap can close.`,
          'This kind of scenario is useful when choosing between a starter fund and a fuller multi-month cash buffer.',
        ],
      },
      {
        heading: 'Why the coverage target matters',
        paragraphs: [
          'A shorter target may be enough for households with stable income, strong insurance coverage, or access to backup support. A longer target may be more appropriate when income is variable or replacement costs are harder to predict.',
          'The right number is not universal, which is why using the calculator with several coverage levels is often more helpful than fixing on one default rule.',
        ],
      },
      {
        heading: 'How to use the result',
        paragraphs: [
          'Treat the monthly savings amount as a planning benchmark and compare it with the rest of your budget. If the timeline feels too long, increasing monthly savings or starting with a smaller initial target may be more realistic than ignoring the cash reserve entirely.',
          'Once the emergency fund is in place, the same monthly cash flow can often be redirected toward other savings goals.',
        ],
      },
    ],
    faq: createFaq(
      record,
      result.targetEmergencyFund,
      result.amountStillNeeded,
      estimatedMonthsToTarget,
    ),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Emergency Fund Calculator',
        url: '/calculators/emergency-fund-calculator/',
      },
      {
        name: 'Emergency Fund Examples',
        url: '/calculators/emergency-fund/examples/',
      },
      { name: title, url: createEmergencyFundCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Emergency Fund Examples',
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(),
    calculatorCta: {
      heading: 'Try Your Own Emergency Fund Target',
      description:
        'Use the full calculator to change monthly expenses, coverage months, current savings, and the monthly contribution.',
      url: '/calculators/emergency-fund-calculator/',
      label: 'Open the Emergency Fund Calculator',
      examplesUrl: '/calculators/emergency-fund/examples/',
      examplesLabel: 'Browse All Emergency Fund Examples',
    },
  };
}

export function auditEmergencyFundSeoRecords(
  records: EmergencyFundSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createEmergencyFundSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Emergency Fund',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createEmergencyFundCanonicalPath,
  });
}
