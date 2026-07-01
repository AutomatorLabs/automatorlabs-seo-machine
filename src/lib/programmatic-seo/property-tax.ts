import type { PropertyTaxSeoRecord } from '../../data/programmatic-seo/property-tax';
import { calculatePropertyTax } from '../math';
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

const clusterPath = 'calculators/property-tax';

export function createPropertyTaxCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function intentFraming(record: PropertyTaxSeoRecord): string {
  switch (record.intent) {
    case 'starter-home':
      return 'A starter-home price range like this one usually carries a lower absolute tax bill, but the same percentage assumptions still apply.';
    case 'move-up-home':
      return 'A move-up home price range like this one raises the absolute tax bill even if the local rate and assessment ratio stay similar to a smaller home.';
    case 'high-tax-area':
      return 'A higher local tax rate like this one means property taxes make up a larger share of the total cost of owning the home.';
    case 'assessment-growth':
      return 'The assessment growth rate is the main driver of how much this tax bill rises over time, more so than the starting rate itself.';
    case 'long-horizon':
      return 'Over a longer time horizon like this one, even a modest annual assessment growth rate compounds into a substantially higher tax bill by the final year.';
  }
}

function intentFaqFraming(record: PropertyTaxSeoRecord): string {
  switch (record.intent) {
    case 'starter-home':
      return 'This example models a starter-home price range, one of the lower absolute tax bills in this cluster of examples.';
    case 'move-up-home':
      return 'This example models a move-up home price range, which raises the absolute tax bill compared with a starter-home scenario.';
    case 'high-tax-area':
      return 'This example models a higher local tax rate than most of this cluster of examples.';
    case 'assessment-growth':
      return 'This example emphasizes how the assessment growth rate compounds the tax bill over time.';
    case 'long-horizon':
      return 'This example uses a longer time horizon than most of this cluster of examples, so compounding assessment growth has more time to raise the bill.';
  }
}

function createProjectionRows(
  record: PropertyTaxSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  const firstYearTax =
    record.homeValue *
    (record.assessedValuePercent / 100) *
    (record.propertyTaxRatePercent / 100);

  let runningTotal = 0;

  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const annualTax =
      firstYearTax *
      Math.pow(1 + record.annualAssessmentGrowthPercent / 100, index);
    runningTotal += annualTax;

    return {
      period,
      contributions: record.homeValue,
      growth: annualTax,
      endingBalance: runningTotal,
    };
  });
}

function createChartPoints(
  projectionRows: ProgrammaticSeoProjectionRow[],
): ProgrammaticSeoChartPoint[] {
  return projectionRows.map((row) => ({
    period: row.period,
    value: row.growth,
  }));
}

function createRelatedPages(
  record: PropertyTaxSeoRecord,
  records: PropertyTaxSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.homeValue - record.homeValue) /
          Math.max(record.homeValue, 1) +
        Math.abs(
          candidate.propertyTaxRatePercent - record.propertyTaxRatePercent,
        ) /
          0.5 +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createPropertyTaxCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.homeValue)} home, ${candidate.propertyTaxRatePercent}% rate, ${candidate.years}-year horizon.`,
    }));
}

export function createPropertyTaxSeoPage(
  record: PropertyTaxSeoRecord,
  records: PropertyTaxSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculatePropertyTax(record);
  const projectionRows = createProjectionRows(record);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${record.scenarioLabel} property-tax scenario: ${wholeCurrency.format(record.homeValue)} home at ${record.propertyTaxRatePercent}% property tax with ${record.assessedValuePercent}% assessment produces about ${currency.format(result.firstYearPropertyTax)} in year-one taxes and ${currency.format(result.totalPropertyTax)} over ${record.years} years.`,
  });

  return {
    slug: record.slug,
    url: createPropertyTaxCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Property tax example',
    intro: `This worked example estimates property taxes for a ${wholeCurrency.format(record.homeValue)} home using a ${record.propertyTaxRatePercent}% local tax rate, ${record.assessedValuePercent}% assessed value, and ${record.annualAssessmentGrowthPercent}% annual assessment growth over ${record.years} years. ${intentFraming(record)}`,
    summary: `The first-year property tax is about ${currency.format(result.firstYearPropertyTax)}, which implies a monthly escrow estimate near ${currency.format(result.monthlyEscrowEstimate)}. Over ${record.years} years, the total projected property tax is about ${currency.format(result.totalPropertyTax)} under fixed assumptions.`,
    results: [
      {
        label: 'First-year property tax',
        value: currency.format(result.firstYearPropertyTax),
        primary: true,
      },
      {
        label: 'Monthly escrow estimate',
        value: currency.format(result.monthlyEscrowEstimate),
      },
      {
        label: 'Projected final-year tax',
        value: currency.format(result.projectedFinalYearTax),
      },
      {
        label: 'Projected total property tax',
        value: currency.format(result.totalPropertyTax),
      },
    ],
    formula: {
      heading: 'How This Property Tax Example Works',
      expression:
        'Property tax = home value × assessed value % × local property tax rate',
      explanation:
        'The page uses the shared Property Tax Calculator logic, then compounds the tax bill forward using the annual assessment growth assumption.',
      steps: [
        `Start with a home value of ${wholeCurrency.format(record.homeValue)}.`,
        `Apply the ${record.assessedValuePercent}% assessment ratio to estimate the taxable assessed value.`,
        `Apply the ${record.propertyTaxRatePercent}% tax rate to estimate the first-year tax bill.`,
        `Increase the assessed value by ${record.annualAssessmentGrowthPercent}% each year for ${record.years} years.`,
      ],
    },
    projectionHeading: 'Year-by-Year Property Tax Projection',
    projectionRows,
    chartPoints: createChartPoints(projectionRows),
    chartLabel: `${record.years}-year property tax projection for a ${wholeCurrency.format(record.homeValue)} home`,
    chartHeading: 'Annual Property Tax by Year',
    chartDescription:
      'The chart shows the projected annual property tax bill in each year under the fixed assessment-growth assumption.',
    sections: [
      {
        heading: 'What this scenario captures',
        paragraphs: [
          'Property taxes often feel smaller in the monthly payment than they really are, so a worked example can help translate the annual rate into an escrow number and a long-run ownership cost.',
          'Assessment rules vary by jurisdiction, so this example is most useful as a planning model rather than a tax notice prediction.',
        ],
      },
      {
        heading: 'How to use the result',
        paragraphs: [
          'Compare the monthly escrow estimate with the broader mortgage payment, insurance, HOA dues, and maintenance costs before deciding a home is affordable.',
          'If you know your county or city uses a different assessment method, use the full calculator to match those assumptions more closely.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this reflect exemptions or assessment caps?',
        answer:
          'No. It uses a simplified assessed-value percentage and annual growth assumption rather than local exemption rules or statutory caps.',
      },
      {
        question: 'Why is there a monthly escrow estimate?',
        answer:
          'Many mortgage servicers collect property taxes monthly through escrow, so converting the annual bill into a monthly figure helps with budgeting.',
      },
      {
        question: 'Can property taxes rise even if the tax rate does not change?',
        answer:
          'Yes. A higher assessed value can raise the tax bill even when the tax rate itself stays the same.',
      },
      {
        question: 'Does this include homeowners insurance or HOA dues?',
        answer:
          'No. This page focuses on property taxes only.',
      },
      {
        question: `What does this ${record.scenarioLabel} scenario emphasize?`,
        answer: intentFaqFraming(record),
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Property Tax Calculator',
        url: '/calculators/property-tax-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/property-tax/examples/',
      },
      { name: record.question, url: createPropertyTaxCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Property Tax Examples',
    relatedCalculators: [
      {
        title: 'Property Tax Calculator',
        url: '/calculators/property-tax-calculator/',
        description:
          'Change the tax rate, assessed value assumption, assessment growth, and time horizon.',
      },
      {
        title: 'Mortgage Payment Calculator',
        url: '/calculators/mortgage-payment-calculator/',
        description:
          'See how taxes combine with principal, interest, and insurance in a full monthly payment.',
      },
      {
        title: 'Home Affordability Calculator',
        url: '/calculators/home-affordability-calculator/',
        description:
          'Compare property-tax assumptions against a broader housing budget.',
      },
    ],
    relatedGuides: [
      {
        title: 'Mortgage and Home Buying Guide Hub',
        url: '/guides/mortgage/',
        description:
          'Review property taxes alongside affordability, mortgage payments, and closing costs.',
      },
      {
        title: 'A Practical Guide to Buying a Home',
        url: '/guides/home-buying/',
        description:
          'See how ongoing ownership costs fit into a broader home-buying plan.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Property Tax Scenario',
      description:
        'Use the calculator to change the home value, tax rate, assessment percentage, and horizon.',
      url: '/calculators/property-tax-calculator/',
      label: 'Open the Property Tax Calculator',
      examplesUrl: '/calculators/property-tax/examples/',
      examplesLabel: 'Browse All Property Tax Examples',
    },
  };
}

export function auditPropertyTaxSeoRecords(
  records: PropertyTaxSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'property tax',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.scenarioLabel} scenario. ${record.question} using ${record.homeValue} home value, ${record.propertyTaxRatePercent}% tax rate, ${record.assessedValuePercent}% assessed value, ${record.annualAssessmentGrowthPercent}% growth, and ${record.years} years.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createPropertyTaxCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createPropertyTaxCanonicalPath,
  });
}
