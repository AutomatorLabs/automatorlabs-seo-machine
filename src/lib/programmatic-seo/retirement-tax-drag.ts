import type { RetirementTaxDragSeoRecord } from '../../data/programmatic-seo/retirement-tax-drag';
import { calculateRetirementTaxDrag } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
  ProgrammaticSeoTable,
} from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percentage = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const clusterPath = 'calculators/retirement-tax-drag';

export function createRetirementTaxDragCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

type TaxRateProfile = 'low' | 'moderate' | 'high';
type RetirementLengthProfile = 'standard' | 'extended';

function taxRateProfile(record: RetirementTaxDragSeoRecord): TaxRateProfile {
  if (record.estimatedTaxRatePercent <= 10) return 'low';
  if (record.estimatedTaxRatePercent <= 20) return 'moderate';
  return 'high';
}

function retirementLengthProfile(
  record: RetirementTaxDragSeoRecord,
): RetirementLengthProfile {
  return record.yearsInRetirement <= 20 ? 'standard' : 'extended';
}

function taxRateFraming(profile: TaxRateProfile): string {
  switch (profile) {
    case 'low':
      return 'A relatively low assumed tax rate keeps more of each withdrawal spendable, so the gap between pre-tax and after-tax income stays fairly narrow.';
    case 'moderate':
      return 'A moderate assumed tax rate takes a noticeable but not overwhelming share of each withdrawal.';
    case 'high':
      return 'A relatively high assumed tax rate takes a large share of each withdrawal, widening the gap between pre-tax and after-tax income.';
  }
}

function retirementLengthFraming(profile: RetirementLengthProfile): string {
  switch (profile) {
    case 'standard':
      return 'Over this retirement length, the annual tax bill has fewer years to compound into a large lifetime total than a longer retirement would produce.';
    case 'extended':
      return 'Over this longer retirement length, even a modest annual tax bill compounds into a substantially larger lifetime total.';
  }
}

function taxRateSectionFraming(profile: TaxRateProfile): string {
  switch (profile) {
    case 'low':
      return 'A tax rate in this range is typical of a retiree whose taxable income sits in a lower bracket, whether from a smaller withdrawal, tax-advantaged account mix, or lower non-retirement income.';
    case 'moderate':
      return 'A tax rate in this range is common for a retiree with a mix of taxable and tax-advantaged withdrawals landing in a middle bracket.';
    case 'high':
      return 'A tax rate in this range often reflects a larger taxable withdrawal, significant non-retirement income, or a less tax-efficient account mix.';
  }
}

function retirementLengthSectionFraming(profile: RetirementLengthProfile): string {
  switch (profile) {
    case 'standard':
      return 'A shorter retirement horizon still deserves a tax-aware plan, since even modest annual taxes reduce the portfolio available for spending each year.';
    case 'extended':
      return 'A longer retirement horizon raises the stakes of tax-aware planning, since small differences in the effective tax rate compound across many more years of withdrawals.';
  }
}

function taxRateFaqFraming(profile: TaxRateProfile): string {
  switch (profile) {
    case 'low':
      return "It's on the lower end of the tax rates modeled across this cluster of examples, which keeps more of each withdrawal spendable.";
    case 'moderate':
      return "It sits in the middle of the tax rates modeled across this cluster of examples.";
    case 'high':
      return "It's on the higher end of the tax rates modeled across this cluster of examples, which shrinks after-tax income by more than a lower-rate scenario would.";
  }
}

function createRelatedPages(
  record: RetirementTaxDragSeoRecord,
  records: RetirementTaxDragSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(
          candidate.annualRetirementWithdrawal -
            record.annualRetirementWithdrawal,
        ) / Math.max(record.annualRetirementWithdrawal, 1) +
        Math.abs(
          candidate.estimatedTaxRatePercent -
            record.estimatedTaxRatePercent,
        ),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createRetirementTaxDragCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.annualRetirementWithdrawal)} withdrawn yearly at ${percentage.format(candidate.estimatedTaxRatePercent)}% tax for ${candidate.yearsInRetirement} years.`,
    }));
}

function createTable(record: RetirementTaxDragSeoRecord): ProgrammaticSeoTable {
  return {
    heading: 'Tax Drag Assumptions',
    columns: ['Value'],
    rows: [
      { label: 'Annual retirement withdrawal', cells: [currency.format(record.annualRetirementWithdrawal)] },
      { label: 'Estimated tax rate', cells: [`${percentage.format(record.estimatedTaxRatePercent)}%`] },
      { label: 'Years in retirement', cells: [`${record.yearsInRetirement}`] },
      { label: 'Inflation assumption', cells: [`${percentage.format(record.inflationRatePercent)}%`] },
    ],
  };
}

export function createRetirementTaxDragSeoPage(
  record: RetirementTaxDragSeoRecord,
  records: RetirementTaxDragSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateRetirementTaxDrag({
    annualRetirementWithdrawal: record.annualRetirementWithdrawal,
    estimatedTaxRatePercent: record.estimatedTaxRatePercent,
    yearsInRetirement: record.yearsInRetirement,
    inflationRatePercent: record.inflationRatePercent,
  });
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.annualRetirementWithdrawal)} of annual retirement withdrawals at ${percentage.format(record.estimatedTaxRatePercent)}% tax are modeled for ${record.yearsInRetirement} years with ${percentage.format(record.inflationRatePercent)}% inflation.`,
  });
  const taxProfile = taxRateProfile(record);
  const lengthProfile = retirementLengthProfile(record);

  return {
    slug: record.slug,
    url: createRetirementTaxDragCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Retirement tax drag example',
    intro: `This worked example estimates how taxes can reduce spendable retirement income and add up over ${record.yearsInRetirement} years. ${taxRateFraming(taxProfile)} ${retirementLengthFraming(lengthProfile)}`,
    summary: `On ${currency.format(record.annualRetirementWithdrawal)} of annual retirement withdrawals at ${percentage.format(record.estimatedTaxRatePercent)}% tax, the modeled annual tax bill is ${currency.format(result.annualTaxesPaid)} and after-tax income is ${currency.format(result.afterTaxAnnualIncome)}. Across ${record.yearsInRetirement} years, total taxes reach ${currency.format(result.totalTaxes)} before inflation adjustment.`,
    results: [
      { label: 'Annual taxes paid', value: currency.format(result.annualTaxesPaid), primary: true },
      { label: 'After-tax annual income', value: currency.format(result.afterTaxAnnualIncome) },
      { label: 'Total taxes', value: currency.format(result.totalTaxes) },
      { label: 'Inflation-adjusted total taxes', value: currency.format(result.inflationAdjustedTotalTaxes) },
    ],
    formula: {
      heading: 'How Retirement Tax Drag Is Estimated',
      expression: 'Annual taxes = withdrawal × tax rate',
      explanation:
        'The shared tax-drag math applies the assumed tax rate to the annual withdrawal, then summarizes the multi-year effect with and without inflation adjustment.',
      steps: [
        `Start with an annual retirement withdrawal of ${currency.format(record.annualRetirementWithdrawal)}.`,
        `Apply the assumed ${percentage.format(record.estimatedTaxRatePercent)}% tax rate to estimate yearly taxes.`,
        `Subtract taxes to estimate after-tax spendable income.`,
        `Project the annual tax cost across ${record.yearsInRetirement} years and restate the total using ${percentage.format(record.inflationRatePercent)}% inflation.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Retirement Tax Snapshot',
    projectionRows: [],
    table: createTable(record),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why tax drag deserves attention',
        paragraphs: [
          'A retirement spending plan that looks comfortable before taxes can feel much tighter once income taxes are considered. Tax drag can also change how large a portfolio really needs to be.',
          taxRateSectionFraming(taxProfile),
          retirementLengthSectionFraming(lengthProfile),
        ],
      },
      {
        heading: 'Limits of this simplified example',
        paragraphs: [
          'The model uses one assumed tax rate, not a full tax return or account-order withdrawal strategy.',
          'Real-world retirement taxes depend on filing status, deductions, account types, Social Security taxation, state taxes, and changing tax brackets.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is one tax rate enough for a real retirement plan?',
        answer:
          'No. This example is a planning shortcut. Actual retirement taxes often vary by account type, benefit timing, filing status, and tax law.',
      },
      {
        question: 'Why show inflation-adjusted total taxes?',
        answer:
          'Inflation helps restate the long-run tax cost in a way that reflects changing purchasing power over time.',
      },
      {
        question: 'How can I reduce retirement tax drag?',
        answer:
          'Common levers include withdrawal sequencing, Roth and traditional account mix, taxable account use, spending flexibility, and tax-aware planning over multiple years.',
      },
      {
        question: `Is a ${percentage.format(record.estimatedTaxRatePercent)}% tax rate high or low for this example?`,
        answer: taxRateFaqFraming(taxProfile),
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Retirement Tax Drag Calculator', url: '/calculators/retirement-tax-drag-calculator/' },
      { name: 'Examples', url: '/calculators/retirement-tax-drag/examples/' },
      { name: title, url: createRetirementTaxDragCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Retirement Tax Drag Calculator',
        url: '/calculators/retirement-tax-drag-calculator/',
        description: 'Test your own withdrawal amount, tax rate, inflation, and retirement length.',
      },
      {
        title: 'Retirement Income Gap Calculator',
        url: '/calculators/retirement-income-gap-calculator/',
        description: 'See how taxes fit inside a broader retirement income plan.',
      },
      {
        title: 'Roth vs Traditional IRA Calculator',
        url: '/calculators/roth-vs-traditional-ira-calculator/',
        description: 'Compare paying taxes now with paying them later under a simplified IRA framework.',
      },
    ],
    relatedGuides: [
      {
        title: 'Retirement Planning Guide Hub',
        url: '/guides/retirement/',
        description: 'Explore the larger retirement-planning surface around taxes, withdrawals, and accounts.',
      },
      {
        title: 'Roth IRA vs Traditional IRA',
        url: '/guides/roth-vs-traditional-ira/',
        description: 'Understand one of the core tax tradeoffs in long-term retirement planning.',
      },
      {
        title: 'Planning Retirement Withdrawals',
        url: '/guides/retirement-withdrawals/',
        description: 'Connect taxes with withdrawal rates, account mix, and spendable retirement income.',
      },
    ],
    calculatorCta: {
      heading: 'Estimate Your Own Retirement Tax Drag',
      description:
        'Use the full calculator to change withdrawal amounts, assumed tax rates, inflation, and retirement length.',
      url: '/calculators/retirement-tax-drag-calculator/',
      label: 'Open the Retirement Tax Drag Calculator',
      examplesUrl: '/calculators/retirement-tax-drag/examples/',
      examplesLabel: 'Browse All Retirement Tax Drag Examples',
    },
    relatedPagesHeading: 'Related Retirement Tax Drag Examples',
  };
}

export function auditRetirementTaxDragSeoRecords(
  records: RetirementTaxDragSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'retirement tax drag',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.annualRetirementWithdrawal} annual withdrawals, ${record.estimatedTaxRatePercent}% tax, ${record.yearsInRetirement} years, and ${record.inflationRatePercent}% inflation.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createRetirementTaxDragCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createRetirementTaxDragCanonicalPath,
  });
}
