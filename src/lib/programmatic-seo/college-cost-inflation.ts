import type { CollegeCostInflationSeoRecord } from '../../data/programmatic-seo/college-cost-inflation';
import { calculateCollegeCostInflation } from '../math';
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

const multiplier = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const clusterPath = 'calculators/college-cost-inflation';

export function createCollegeCostInflationCanonicalPath(
  slug: string,
): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function intentLabel(record: CollegeCostInflationSeoRecord): string {
  switch (record.intent) {
    case 'community-college':
      return 'Community college example';
    case 'in-state-public':
      return 'In-state public college example';
    case 'out-of-state-public':
      return 'Out-of-state public college example';
    case 'private-university':
      return 'Private university example';
    case 'high-inflation-scenario':
      return 'High-inflation scenario example';
  }
}

function createRelatedPages(
  record: CollegeCostInflationSeoRecord,
  records: CollegeCostInflationSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(
          candidate.currentAnnualCollegeCost -
            record.currentAnnualCollegeCost,
        ) / Math.max(record.currentAnnualCollegeCost, 1) +
        Math.abs(
          candidate.educationInflationRatePercent -
            record.educationInflationRatePercent,
        ) / 10 +
        Math.abs(candidate.yearsUntilCollege - record.yearsUntilCollege) /
          Math.max(record.yearsUntilCollege, 1) +
        Math.abs(
          candidate.numberOfCollegeYears - record.numberOfCollegeYears,
        ) / Math.max(record.numberOfCollegeYears, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createCollegeCostInflationCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.currentAnnualCollegeCost)}/year today, ${candidate.educationInflationRatePercent}% inflation, enrolling in ${candidate.yearsUntilCollege} years for ${candidate.numberOfCollegeYears} years.`,
    }));
}

export function createCollegeCostInflationSeoPage(
  record: CollegeCostInflationSeoRecord,
  records: CollegeCostInflationSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateCollegeCostInflation({
    currentAnnualCollegeCost: record.currentAnnualCollegeCost,
    educationInflationRatePercent: record.educationInflationRatePercent,
    yearsUntilCollege: record.yearsUntilCollege,
    numberOfCollegeYears: record.numberOfCollegeYears,
  });
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `A ${record.scenarioLabel} scenario: ${currency.format(record.currentAnnualCollegeCost)}/year today at an assumed ${record.educationInflationRatePercent}% education inflation rate grows to about ${currency.format(result.firstYearCollegeCost)} in the first year, for an estimated total of ${currency.format(result.totalCollegeCost)} across ${record.numberOfCollegeYears} years starting ${record.yearsUntilCollege} years from now.`,
  });

  return {
    slug: record.slug,
    url: createCollegeCostInflationCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the College Cost Inflation Calculator assumptions to project how a ${record.scenarioLabel} costing ${currency.format(record.currentAnnualCollegeCost)} per year today could change by the time enrollment begins in ${record.yearsUntilCollege} years, assuming a constant ${record.educationInflationRatePercent}% annual education inflation rate across ${record.numberOfCollegeYears} years of attendance.`,
    summary: `Under these assumptions, the first year of attendance costs about ${currency.format(result.firstYearCollegeCost)}, and the full ${record.numberOfCollegeYears}-year estimated cost is about ${currency.format(result.totalCollegeCost)} — an increase of about ${currency.format(result.totalIncrease)} over paying today's cost for the same number of years (a ${multiplier.format(result.inflationMultiplier)}x multiplier).`,
    results: [
      {
        label: 'Estimated total college cost',
        value: currency.format(result.totalCollegeCost),
        primary: true,
      },
      {
        label: 'Estimated first-year college cost',
        value: currency.format(result.firstYearCollegeCost),
      },
      {
        label: "Total increase from today's cost",
        value: currency.format(result.totalIncrease),
      },
      {
        label: 'Inflation multiplier',
        value: `${multiplier.format(result.inflationMultiplier)}x`,
      },
    ],
    formula: {
      heading: 'How This College Cost Inflation Projection Works',
      expression:
        "First-year cost = today's cost × (1 + inflation rate)^years until college; total cost = sum of each attendance year's inflated cost",
      explanation: `The page reuses the shared College Cost Inflation Calculator assumptions. It grows ${currency.format(record.currentAnnualCollegeCost)} at ${record.educationInflationRatePercent}% annually until the ${record.yearsUntilCollege}th year, then applies the same rate to each of the following ${record.numberOfCollegeYears} attendance years and sums the result.`,
      steps: [
        `Start with ${currency.format(record.currentAnnualCollegeCost)} as today's annual college cost.`,
        `Compound it at ${record.educationInflationRatePercent}% annually for ${record.yearsUntilCollege} years to reach a first-year cost of ${currency.format(result.firstYearCollegeCost)}.`,
        `Apply the same ${record.educationInflationRatePercent}% rate to each of the following ${record.numberOfCollegeYears} attendance years and sum them to reach an estimated total of ${currency.format(result.totalCollegeCost)}.`,
        `Compare that with ${record.numberOfCollegeYears} years at today's cost to find an increase of ${currency.format(result.totalIncrease)}, a ${multiplier.format(result.inflationMultiplier)}x multiplier.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Scenario Summary',
    projectionRows: [],
    table: {
      heading: 'Scenario Summary',
      columns: ['Metric', 'Value'],
      rows: [
        {
          label: "Current annual college cost",
          cells: [currency.format(record.currentAnnualCollegeCost)],
        },
        {
          label: 'Education inflation rate',
          cells: [`${record.educationInflationRatePercent}%`],
        },
        {
          label: 'Years until college',
          cells: [String(record.yearsUntilCollege)],
        },
        {
          label: 'Number of college years',
          cells: [String(record.numberOfCollegeYears)],
        },
        {
          label: 'Estimated first-year college cost',
          cells: [currency.format(result.firstYearCollegeCost)],
        },
        {
          label: 'Estimated total college cost',
          cells: [currency.format(result.totalCollegeCost)],
        },
        {
          label: "Total increase from today's cost",
          cells: [currency.format(result.totalIncrease)],
        },
        {
          label: 'Inflation multiplier',
          cells: [`${multiplier.format(result.inflationMultiplier)}x`],
        },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This scenario isolates how education inflation compounds for a ${record.scenarioLabel} over the years leading up to enrollment. The first-year cost grows before enrollment even begins, and each subsequent attendance year grows again on top of that.`,
          `Because the same assumed rate is applied every year, the projection is smoother than real tuition and fee changes, which vary by institution and by year. The point of the example is to show sensitivity to today's cost, the inflation rate assumption, the horizon until enrollment, and the number of attendance years.`,
        ],
      },
      {
        heading: 'Assumptions and limitations',
        paragraphs: [
          `The example assumes a constant ${record.educationInflationRatePercent}% annual education inflation rate applied uniformly to every year, with no scholarships, grants, financial aid, or changes in attendance plans.`,
          'It does not model 529 or other investment growth toward this cost — pair it with a savings projection separately if you want to compare a growing target against a growing savings balance.',
        ],
      },
      {
        heading: 'How families use a projection like this',
        paragraphs: [
          'Use the result as a planning input for a savings target, then test more conservative and more aggressive inflation assumptions in the main calculator. Education inflation has historically differed from general consumer inflation, so a dedicated assumption can be more useful than a general inflation rate.',
          'Treat the total as a scenario, not a guarantee — actual costs depend on the specific institution, program, aid received, and how tuition policy changes over the relevant years.',
        ],
      },
    ],
    faq: [
      {
        question: `How does this ${record.scenarioLabel} college cost inflation example work?`,
        answer: `It grows today's ${currency.format(record.currentAnnualCollegeCost)} annual cost until enrollment, then applies the same ${record.educationInflationRatePercent}% education inflation rate to each following college year and sums those projected costs.`,
      },
      {
        question: "What should today's annual college cost include?",
        answer:
          'Use the annual amount you want to plan for, which may include tuition, fees, housing, meals, books, transportation, and other expected education expenses.',
      },
      {
        question: 'Why can education inflation differ from general inflation?',
        answer:
          'Tuition and other education expenses can change at a different pace than the broad consumer price index, so a separate planning assumption may be useful.',
      },
      {
        question: 'What does the inflation multiplier mean?',
        answer: `It compares the projected total college cost with the same number of years at today's annual cost. Here, ${multiplier.format(result.inflationMultiplier)}x means the projection is about ${multiplier.format((result.inflationMultiplier - 1) * 100)}% higher than paying today's rate for the same years.`,
      },
      {
        question: 'Does this example include financial aid or investment growth?',
        answer:
          'No. It estimates future costs only and does not model scholarships, grants, loans, taxes, 529 investment returns, or changes in attendance plans.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'College Cost Inflation Calculator',
        url: '/calculators/college-cost-inflation-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/college-cost-inflation/examples/',
      },
      {
        name: title,
        url: createCollegeCostInflationCanonicalPath(record.slug),
      },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related College Cost Inflation Examples',
    relatedCalculators: [
      {
        title: 'College Cost Inflation Calculator',
        url: '/calculators/college-cost-inflation-calculator/',
        description:
          "Change today's cost, the inflation rate assumption, years until college, and number of college years.",
      },
      {
        title: 'Inflation Calculator',
        url: '/calculators/inflation-calculator/',
        description:
          'Apply general consumer inflation to any dollar amount and time horizon.',
      },
      {
        title: 'Savings Goal Calculator',
        url: '/calculators/savings-goal-calculator/',
        description: 'Work out a monthly savings plan for any target amount and timeline.',
      },
      {
        title: '529 College Savings Calculator',
        url: '/calculators/529-college-savings-calculator/',
        description:
          'Project 529 plan growth toward a target cost like the one estimated here.',
      },
    ],
    relatedGuides: [
      {
        title: 'How Inflation Affects Compound Interest',
        url: '/guides/inflation-and-compound-interest/',
        description:
          'See how inflation reduces the purchasing power of a growing balance over time.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own College Cost Inflation Projection',
      description:
        "Open the full calculator to change today's cost, the inflation rate assumption, years until college, and number of college years.",
      url: '/calculators/college-cost-inflation-calculator/',
      label: 'Open the College Cost Inflation Calculator',
      examplesUrl: '/calculators/college-cost-inflation/examples/',
      examplesLabel: 'Browse All College Cost Inflation Examples',
    },
  };
}

export function auditCollegeCostInflationSeoRecords(
  records: CollegeCostInflationSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createCollegeCostInflationSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'college cost inflation',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createCollegeCostInflationCanonicalPath,
  });
}
