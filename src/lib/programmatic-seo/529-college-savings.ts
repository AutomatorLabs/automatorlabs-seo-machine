import type { CollegeSavings529SeoRecord } from '../../data/programmatic-seo/529-college-savings';
import { calculate529CollegeSavings } from '../math';
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

const clusterPath = 'calculators/529-college-savings';

export function createCollegeSavings529CanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function intentLabel(record: CollegeSavings529SeoRecord): string {
  switch (record.intent) {
    case 'newborn-saver':
      return 'Newborn 529 saver example';
    case 'early-childhood-saver':
      return 'Early childhood 529 saver example';
    case 'tween-steady-saver':
      return 'Tween 529 saver example';
    case 'high-school-final-stretch':
      return 'High school final stretch example';
    case 'catch-up-late-start':
      return 'Catch-up late start example';
  }
}

export function createCollegeSavings529Projection(
  record: CollegeSavings529SeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.yearsUntilCollege }, (_, index) => {
    const period = index + 1;
    const result = calculate529CollegeSavings({
      currentBalance: record.currentBalance,
      monthlyContribution: record.monthlyContribution,
      expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
      yearsUntilCollege: period,
      targetCollegeCost: record.targetCollegeCost,
    });

    return {
      period,
      contributions: result.totalContributions,
      growth: result.investmentGrowth,
      endingBalance: result.projectedBalance,
    };
  });
}

function createRelatedPages(
  record: CollegeSavings529SeoRecord,
  records: CollegeSavings529SeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.currentBalance - record.currentBalance) /
          Math.max(record.currentBalance || 1, 1) +
        Math.abs(
          candidate.monthlyContribution - record.monthlyContribution,
        ) / Math.max(record.monthlyContribution, 1) +
        Math.abs(
          candidate.expectedAnnualReturnPercent -
            record.expectedAnnualReturnPercent,
        ) / 10 +
        Math.abs(candidate.yearsUntilCollege - record.yearsUntilCollege) /
          Math.max(record.yearsUntilCollege, 1) +
        Math.abs(candidate.targetCollegeCost - record.targetCollegeCost) /
          Math.max(record.targetCollegeCost, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createCollegeSavings529CanonicalPath(candidate.slug),
      description: `${currency.format(candidate.currentBalance)} balance, ${currency.format(candidate.monthlyContribution)}/month, ${candidate.expectedAnnualReturnPercent}% return, ${candidate.yearsUntilCollege} years, ${currency.format(candidate.targetCollegeCost)} target.`,
    }));
}

export function createCollegeSavings529SeoPage(
  record: CollegeSavings529SeoRecord,
  records: CollegeSavings529SeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculate529CollegeSavings({
    currentBalance: record.currentBalance,
    monthlyContribution: record.monthlyContribution,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    yearsUntilCollege: record.yearsUntilCollege,
    targetCollegeCost: record.targetCollegeCost,
  });
  const projectionRows = createCollegeSavings529Projection(record);
  const title = record.question;
  const isSurplus = result.surplusOrShortfall >= 0;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.monthlyContribution)}/month into a 529 plan with a ${currency.format(record.currentBalance)} starting balance at an assumed ${record.expectedAnnualReturnPercent}% annual return grows to about ${currency.format(result.projectedBalance)} over ${record.yearsUntilCollege} years, a ${isSurplus ? 'surplus' : 'shortfall'} of about ${currency.format(Math.abs(result.surplusOrShortfall))} versus the ${currency.format(record.targetCollegeCost)} target. See the formula, annual projection, chart, and assumptions.`,
  });

  return {
    slug: record.slug,
    url: createCollegeSavings529CanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the 529 College Savings Calculator assumptions to show how a ${record.scenarioLabel} saving ${currency.format(record.monthlyContribution)} per month from a ${currency.format(record.currentBalance)} starting balance at an assumed ${record.expectedAnnualReturnPercent}% annual return could grow over ${record.yearsUntilCollege} years toward a ${currency.format(record.targetCollegeCost)} target.`,
    summary: isSurplus
      ? `Under these assumptions, the projected balance of ${currency.format(result.projectedBalance)} covers the ${currency.format(record.targetCollegeCost)} target with a surplus of about ${currency.format(result.surplusOrShortfall)}.`
      : `Under these assumptions, the projected balance of ${currency.format(result.projectedBalance)} falls short of the ${currency.format(record.targetCollegeCost)} target by about ${currency.format(Math.abs(result.surplusOrShortfall))}.`,
    results: [
      {
        label: 'Projected 529 balance',
        value: currency.format(result.projectedBalance),
        primary: true,
      },
      {
        label: 'Total contributions',
        value: currency.format(result.totalContributions),
      },
      {
        label: 'Investment growth',
        value: currency.format(result.investmentGrowth),
      },
      {
        label: 'Surplus or shortfall vs target cost',
        value: currency.format(result.surplusOrShortfall),
      },
    ],
    formula: {
      heading: 'How This 529 College Savings Projection Works',
      expression:
        'Projected balance = future value of (current balance + monthly contributions) compounded monthly; surplus or shortfall = projected balance − target cost',
      explanation: `The page reuses the shared 529 College Savings Calculator assumptions. It compounds the ${currency.format(record.currentBalance)} starting balance and ${currency.format(record.monthlyContribution)} monthly contribution at ${record.expectedAnnualReturnPercent}% annually, then compares the projected balance with the ${currency.format(record.targetCollegeCost)} target.`,
      steps: [
        `Start with ${currency.format(record.currentBalance)} in the 529 account.`,
        `Add ${currency.format(record.monthlyContribution)} each month and compound at ${record.expectedAnnualReturnPercent}% annually for ${record.yearsUntilCollege} years.`,
        `Reach a projected balance of ${currency.format(result.projectedBalance)}, including ${currency.format(result.totalContributions)} in total contributions and ${currency.format(result.investmentGrowth)} in investment growth.`,
        `Compare the projected balance with the ${currency.format(record.targetCollegeCost)} target to find a ${isSurplus ? 'surplus' : 'shortfall'} of about ${currency.format(Math.abs(result.surplusOrShortfall))}.`,
      ],
    },
    projectionHeading: 'Year-by-Year 529 Balance Projection',
    projectionRows,
    chartHeading: 'Projected 529 Balance Over Time',
    chartDescription: `The chart shows the projected year-end 529 balance if the starting amount, contribution plan, and annual return assumption remain unchanged. The ${currency.format(record.targetCollegeCost)} target cost is shown for comparison in the results above.`,
    chartPoints: [
      { period: 0, value: record.currentBalance },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This scenario isolates the math behind a ${record.scenarioLabel} saving for college. The ending balance reflects both the amount contributed and the compounding effect of leaving prior gains invested.`,
          `Because the same assumed return is applied every month, the path is smoother than real markets. The point of the example is to show sensitivity to starting balance, contribution size, return assumptions, and time horizon against a fixed target cost.`,
        ],
      },
      {
        heading: 'Assumptions and limitations',
        paragraphs: [
          `The example assumes ${currency.format(record.monthlyContribution)} contributed every month, full reinvestment, and a constant ${record.expectedAnnualReturnPercent}% annual return with monthly compounding. It does not include taxes, fees, financial aid, or periods of negative returns.`,
          `The ${currency.format(record.targetCollegeCost)} target cost is treated as fixed. If your real target should grow with education inflation, adjust it separately before comparing it with this projection.`,
        ],
      },
      {
        heading: 'How families use a projection like this',
        paragraphs: [
          'Use the result as a benchmark, then test more conservative and more optimistic cases in the main calculator. Changing one assumption at a time makes it easier to see whether starting balance, contribution size, or time horizon matters most for reaching the target.',
          'A projected surplus is not a guarantee, and a projected shortfall does not mean a plan has failed — both are simplified projections meant to guide how much to contribute, not a promise of the actual balance at enrollment.',
        ],
      },
    ],
    faq: [
      {
        question: `How does this ${record.scenarioLabel} 529 projection work?`,
        answer: `It compounds the ${currency.format(record.currentBalance)} starting balance monthly, adds the ${currency.format(record.monthlyContribution)} contribution at the end of each month, and compares the projected balance with the ${currency.format(record.targetCollegeCost)} target cost.`,
      },
      {
        question: 'What is a 529 plan?',
        answer:
          'A 529 plan is a tax-advantaged education savings account. Qualified withdrawals can generally be used tax-free for eligible education expenses, subject to plan and tax rules.',
      },
      {
        question: 'Does the target college cost increase with inflation?',
        answer:
          "No. This example uses a fixed future target cost. If your estimate is in today's dollars, adjust it separately for expected education inflation.",
      },
      {
        question: 'What does the surplus or shortfall show?',
        answer:
          'It is the projected 529 balance minus the target college cost. A positive amount is a surplus, while a negative amount is a shortfall.',
      },
      {
        question: 'Does this example include taxes, fees, or financial aid?',
        answer:
          'No. It does not model plan fees, taxes on nonqualified withdrawals, financial aid effects, changing contributions, or variable investment returns.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: '529 College Savings Calculator',
        url: '/calculators/529-college-savings-calculator/',
      },
      { name: 'Examples', url: '/calculators/529-college-savings/examples/' },
      { name: title, url: createCollegeSavings529CanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related 529 College Savings Examples',
    relatedCalculators: [
      {
        title: '529 College Savings Calculator',
        url: '/calculators/529-college-savings-calculator/',
        description:
          'Change the starting balance, monthly contribution, return assumption, timeline, and target cost.',
      },
      {
        title: 'Compound Interest Calculator',
        url: '/calculators/compound-interest/',
        description:
          'Compare the same growth math with different compounding assumptions.',
      },
      {
        title: 'Savings Goal Calculator',
        url: '/calculators/savings-goal-calculator/',
        description:
          'Work out a monthly savings plan for any target amount and timeline.',
      },
      {
        title: 'Investment Fee Calculator',
        url: '/calculators/investment-fee-calculator/',
        description: 'See how fees can affect long-term account growth.',
      },
      {
        title: 'College Cost Inflation Calculator',
        url: '/calculators/college-cost-inflation-calculator/',
        description:
          'Estimate how your target college cost could itself grow with education inflation before you need it.',
      },
    ],
    relatedGuides: [
      {
        title: 'Savings Planning Guide Hub',
        url: '/guides/savings/',
        description:
          'Review savings strategies, timelines, and target-setting across common goals.',
      },
    ],
    chartLabel: `${record.scenarioLabel} 529 projection from ${currency.format(record.currentBalance)} at ${record.expectedAnnualReturnPercent}% for ${record.yearsUntilCollege} years`,
    calculatorCta: {
      heading: 'Run Your Own 529 College Savings Plan',
      description:
        'Open the full calculator to change the starting balance, monthly contribution, return assumption, timeline, and target cost.',
      url: '/calculators/529-college-savings-calculator/',
      label: 'Open the 529 College Savings Calculator',
      examplesUrl: '/calculators/529-college-savings/examples/',
      examplesLabel: 'Browse All 529 College Savings Examples',
    },
  };
}

export function auditCollegeSavings529SeoRecords(
  records: CollegeSavings529SeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createCollegeSavings529SeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'college savings 529',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createCollegeSavings529CanonicalPath,
  });
}
