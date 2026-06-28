import type { RothIraSeoRecord } from '../../data/programmatic-seo/roth-ira';
import { calculateRothIraProjection } from '../math';
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

const clusterPath = 'calculators/roth-ira';

export function createRothIraCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createProjectionRows(record: RothIraSeoRecord): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const years = index + 1;
    const result = calculateRothIraProjection({
      currentBalance: record.currentBalance,
      contributionPerPeriod: record.contributionPerPeriod,
      expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
      years,
      periodsPerYear: record.periodsPerYear,
    });
    const annualContribution =
      record.contributionPerPeriod * record.periodsPerYear;

    return {
      period: years,
      contributions: record.currentBalance + annualContribution * years,
      growth:
        result.endingBalance -
        (record.currentBalance + annualContribution * years),
      endingBalance: result.endingBalance,
    };
  });
}

function createRelatedPages(
  record: RothIraSeoRecord,
  records: RothIraSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.currentBalance - record.currentBalance) /
          Math.max(record.currentBalance, 1) +
        Math.abs(
          candidate.contributionPerPeriod - record.contributionPerPeriod,
        ) / Math.max(record.contributionPerPeriod, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createRothIraCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.currentBalance)} starting balance with ${currency.format(candidate.contributionPerPeriod)} ${candidate.periodsPerYear === 12 ? 'monthly' : 'yearly'} contributions.`,
    }));
}

export function createRothIraSeoPage(
  record: RothIraSeoRecord,
  records: RothIraSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateRothIraProjection({
    currentBalance: record.currentBalance,
    contributionPerPeriod: record.contributionPerPeriod,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    years: record.years,
    periodsPerYear: record.periodsPerYear,
  });
  const projectionRows = createProjectionRows(record);
  const contributionLabel =
    record.periodsPerYear === 12
      ? `${currency.format(record.contributionPerPeriod)} monthly`
      : `${currency.format(record.contributionPerPeriod)} yearly`;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.currentBalance)} in a Roth IRA with ${contributionLabel} contributions is projected for ${record.years} years at ${percentage.format(record.expectedAnnualReturnPercent)}% growth.`,
  });

  return {
    slug: record.slug,
    url: createRothIraCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Roth IRA growth example',
    intro: `This worked example projects how a Roth IRA balance could grow from ${currency.format(record.currentBalance)} with ${contributionLabel} contributions over ${record.years} years.`,
    summary: `At ${percentage.format(record.expectedAnnualReturnPercent)}% annual growth, the projected Roth IRA balance reaches about ${currency.format(result.endingBalance)}. Future contributions total ${currency.format(result.futureContributions)} and modeled investment growth adds ${currency.format(result.investmentGrowth)}.`,
    results: [
      { label: 'Projected Roth IRA balance', value: currency.format(result.endingBalance), primary: true },
      { label: 'Future contributions', value: currency.format(result.futureContributions) },
      { label: 'Investment growth', value: currency.format(result.investmentGrowth) },
      { label: 'Contribution schedule', value: contributionLabel },
    ],
    formula: {
      heading: 'How This Roth IRA Example Works',
      expression: 'Ending balance = current balance + future contributions + compound growth',
      explanation:
        'The shared Roth IRA projection math combines the existing balance with recurring contributions and compounds the full balance at the chosen annual return.',
      steps: [
        `Start with ${currency.format(record.currentBalance)} already in the Roth IRA.`,
        `Add ${contributionLabel} contributions for ${record.years} years.`,
        `Compound the balance at ${percentage.format(record.expectedAnnualReturnPercent)}% annual growth.`,
        `Separate the ending value into contributed dollars and modeled investment growth.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Roth IRA Projection',
    projectionRows,
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why Roth IRA examples are useful',
        paragraphs: [
          'Roth IRA pages are often used for long-horizon planning because contribution timing and consistent saving habits can matter as much as return assumptions.',
          'Examples make it easier to compare how a starting balance and recurring contributions interact over a decade or more.',
        ],
      },
      {
        heading: 'What this simplified example does not cover',
        paragraphs: [
          'The model does not enforce contribution eligibility, annual limits, tax-law changes, penalties, or withdrawal-order rules.',
          'It should be treated as an educational growth scenario rather than a compliance or tax-planning tool.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this example use monthly or annual contributions?',
        answer:
          record.periodsPerYear === 12
            ? 'This scenario uses monthly contributions.'
            : 'This scenario uses annual contributions.',
      },
      {
        question: 'Does the example check Roth IRA contribution limits?',
        answer:
          'No. It assumes the entered contribution pattern continues unchanged and does not enforce annual IRS limits or eligibility rules.',
      },
      {
        question: 'Can I use this examples cluster for the Roth IRA growth and contribution calculators too?',
        answer:
          'Yes. This family-level worked-example cluster is intended to support the broader Roth IRA calculator set.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Roth IRA Calculator', url: '/calculators/roth-ira-calculator/' },
      { name: 'Examples', url: '/calculators/roth-ira/examples/' },
      { name: title, url: createRothIraCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Roth IRA Calculator',
        url: '/calculators/roth-ira-calculator/',
        description: 'Test your own balance, contribution pattern, and expected annual return.',
      },
      {
        title: 'Roth IRA Contribution Calculator',
        url: '/calculators/roth-ira-contribution-calculator/',
        description: 'Translate a contribution target into paycheck-level progress under a simplified plan.',
      },
      {
        title: 'Roth vs Traditional IRA Calculator',
        url: '/calculators/roth-vs-traditional-ira-calculator/',
        description: 'Compare paying taxes now with paying them later under simplified IRA assumptions.',
      },
    ],
    relatedGuides: [
      {
        title: 'Roth IRA vs Traditional IRA',
        url: '/guides/roth-vs-traditional-ira/',
        description: 'Understand the high-level tax tradeoffs between Roth and traditional retirement accounts.',
      },
      {
        title: 'Retirement Planning Guide Hub',
        url: '/guides/retirement/',
        description: 'Connect Roth IRA planning with the rest of the retirement toolset.',
      },
      {
        title: 'Planning Retirement Withdrawals',
        url: '/guides/retirement-withdrawals/',
        description: 'Keep long-term Roth growth in the context of future spendable retirement income.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Roth IRA Scenario',
      description:
        'Use the full calculator to change starting balance, contribution schedule, annual return, and time horizon.',
      url: '/calculators/roth-ira-calculator/',
      label: 'Open the Roth IRA Calculator',
      examplesUrl: '/calculators/roth-ira/examples/',
      examplesLabel: 'Browse All Roth IRA Examples',
    },
    relatedPagesHeading: 'Related Roth IRA Examples',
  };
}

export function auditRothIraSeoRecords(
  records: RothIraSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'Roth IRA',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.currentBalance} starting balance, ${record.contributionPerPeriod} per period, ${record.periodsPerYear} periods per year, and ${record.expectedAnnualReturnPercent}% growth.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createRothIraCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createRothIraCanonicalPath,
  });
}
