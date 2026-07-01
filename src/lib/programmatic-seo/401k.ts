import type { FourOhOneKSeoRecord } from '../../data/programmatic-seo/401k';
import { calculate401kGrowth } from '../math';
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
  maximumFractionDigits: 0,
});

const percentage = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const clusterPath = 'calculators/401k';

export function create401kCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createProjectionRows(
  record: FourOhOneKSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const years = index + 1;
    const result = calculate401kGrowth({
      currentBalance: record.currentBalance,
      employeeMonthlyContribution: record.employeeMonthlyContribution,
      employerMonthlyMatch: record.employerMonthlyMatch,
      expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
      years,
    });

    return {
      period: years,
      contributions:
        record.currentBalance +
        (record.employeeMonthlyContribution + record.employerMonthlyMatch) *
          12 *
          years,
      growth:
        result.endingBalance -
        (record.currentBalance +
          (record.employeeMonthlyContribution + record.employerMonthlyMatch) *
            12 *
            years),
      endingBalance: result.endingBalance,
    };
  });
}

function createRelatedPages(
  record: FourOhOneKSeoRecord,
  records: FourOhOneKSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.currentBalance - record.currentBalance) /
          Math.max(record.currentBalance, 1) +
        Math.abs(
          candidate.employeeMonthlyContribution -
            record.employeeMonthlyContribution,
        ) / Math.max(record.employeeMonthlyContribution, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: create401kCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.currentBalance)} starting balance, ${currency.format(candidate.employeeMonthlyContribution)} employee contribution, ${currency.format(candidate.employerMonthlyMatch)} employer match.`,
    }));
}

export function create401kSeoPage(
  record: FourOhOneKSeoRecord,
  records: FourOhOneKSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculate401kGrowth({
    currentBalance: record.currentBalance,
    employeeMonthlyContribution: record.employeeMonthlyContribution,
    employerMonthlyMatch: record.employerMonthlyMatch,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    years: record.years,
  });
  const projectionRows = createProjectionRows(record);
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.currentBalance)} in a 401(k) with ${currency.format(record.employeeMonthlyContribution)} monthly employee contributions and ${currency.format(record.employerMonthlyMatch)} monthly match is projected for ${record.years} years at ${percentage.format(record.expectedAnnualReturnPercent)}% growth.`,
  });

  return {
    slug: record.slug,
    url: create401kCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: '401(k) growth example',
    intro: `This worked example projects how a 401(k) balance could grow from ${currency.format(record.currentBalance)} with recurring employee contributions and employer match.`,
    summary: `At ${percentage.format(record.expectedAnnualReturnPercent)}% annual growth, ${currency.format(record.currentBalance)} invested today plus ${currency.format(record.employeeMonthlyContribution)} per month and ${currency.format(record.employerMonthlyMatch)} in monthly employer match grows to about ${currency.format(result.endingBalance)} in ${record.years} years.`,
    results: [
      { label: 'Projected 401(k) balance', value: currency.format(result.endingBalance), primary: true },
      { label: 'Employee contributions', value: currency.format(result.totalEmployeeContributions) },
      { label: 'Employer match', value: currency.format(result.totalEmployerMatch) },
      { label: 'Investment growth', value: currency.format(result.investmentGrowth) },
    ],
    formula: {
      heading: 'How This 401(k) Example Works',
      expression: 'Ending balance = starting balance + employee contributions + employer match + investment growth',
      explanation:
        'The example uses the shared 401(k) growth math, combining recurring employee savings, recurring employer match, and compound growth over time.',
      steps: [
        `Start with ${currency.format(record.currentBalance)} already invested.`,
        `Add ${currency.format(record.employeeMonthlyContribution)} of employee contributions each month.`,
        `Add ${currency.format(record.employerMonthlyMatch)} of employer match each month.`,
        `Compound the balance at ${percentage.format(record.expectedAnnualReturnPercent)}% annually for ${record.years} years.`,
      ],
    },
    showChart: false,
    projectionHeading: '401(k) Growth Projection',
    projectionRows,
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why employer match changes the picture',
        paragraphs: [
          'Employer match can materially improve long-term retirement outcomes because the extra contributions compound for the same amount of time as employee savings.',
          'That is why even simple 401(k) examples are useful for comparing the value of saving enough to capture more or all of a match formula.',
        ],
      },
      {
        heading: 'What this simplified 401(k) example leaves out',
        paragraphs: [
          'The model does not adjust contribution limits, salary changes, vesting schedules, taxes, fees, or changing employer-match formulas over time.',
          'It should be treated as a planning scenario rather than an exact workplace-plan forecast.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this example include contribution limits?',
        answer:
          'No. It assumes the entered employee and employer amounts continue for the full time period without checking annual plan limits or catch-up rules.',
      },
      {
        question: 'Why show employee contributions separately from employer match?',
        answer:
          'Separating them makes it easier to see how much of the ending balance comes from personal saving versus employer support.',
      },
      {
        question: 'Can I use these examples for 401(k) growth and employer-match planning together?',
        answer:
          'Yes. This family-level cluster is intended to support the broader 401(k) calculators, including growth, contribution, and employer-match comparisons.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: '401(k) Calculator', url: '/calculators/401k-calculator/' },
      { name: 'Examples', url: '/calculators/401k/examples/' },
      { name: title, url: create401kCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: '401(k) Calculator',
        url: '/calculators/401k-calculator/',
        description: 'Model your own starting balance, contributions, employer match, and time horizon.',
      },
      {
        title: '401(k) Contribution Calculator',
        url: '/calculators/401k-contribution-calculator/',
        description: 'Turn salary and contribution percentages into annual and paycheck-level savings amounts.',
      },
      {
        title: 'Employer Match Calculator',
        url: '/calculators/employer-match-calculator/',
        description: 'Estimate how much employer match a contribution strategy could unlock.',
      },
      {
        title: '401(k) Growth Calculator',
        url: '/calculators/401k-growth-calculator/',
        description: 'Model the same starting balance, contributions, and employer match with this dedicated growth-focused calculator.',
      },
    ],
    relatedGuides: [
      {
        title: 'Retirement Planning Guide Hub',
        url: '/guides/retirement/',
        description: 'Connect workplace retirement accounts with withdrawal planning and long-term retirement goals.',
      },
      {
        title: 'A Beginner’s Guide to FIRE',
        url: '/guides/fire/',
        description: 'See how retirement account contributions can support long-term independence planning.',
      },
      {
        title: 'Planning Retirement Withdrawals',
        url: '/guides/retirement-withdrawals/',
        description: 'Keep long-term account growth connected to future spendable retirement income.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own 401(k) Scenario',
      description:
        'Use the full 401(k) calculator to change contributions, employer match, return assumptions, and years invested.',
      url: '/calculators/401k-calculator/',
      label: 'Open the 401(k) Calculator',
      examplesUrl: '/calculators/401k/examples/',
      examplesLabel: 'Browse All 401(k) Examples',
    },
    relatedPagesHeading: 'Related 401(k) Examples',
  };
}

export function audit401kSeoRecords(
  records: FourOhOneKSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: '401(k)',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.currentBalance} starting balance, ${record.employeeMonthlyContribution} monthly employee contributions, ${record.employerMonthlyMatch} monthly match, and ${record.expectedAnnualReturnPercent}% growth.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: create401kCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: create401kCanonicalPath,
  });
}
