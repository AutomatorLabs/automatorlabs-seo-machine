import type { TraditionalVsRoth401kSeoRecord } from '../../data/programmatic-seo/traditional-vs-roth-401k';
import { calculateRothVsTraditionalIra } from '../math';
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

const clusterPath = 'calculators/traditional-vs-roth-401k';

export function createTraditionalVsRoth401kCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function betterOptionLabel(betterOption: 'roth' | 'traditional' | 'equal'): string {
  if (betterOption === 'roth') return 'Roth 401(k)';
  if (betterOption === 'traditional') return 'Traditional 401(k)';
  return 'Equivalent under these assumptions';
}

function createRelatedPages(
  record: TraditionalVsRoth401kSeoRecord,
  records: TraditionalVsRoth401kSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.annualContribution - record.annualContribution) /
          Math.max(record.annualContribution, 1) +
        Math.abs(
          candidate.currentTaxRatePercent - record.currentTaxRatePercent,
        ) / 100 +
        Math.abs(
          candidate.retirementTaxRatePercent -
            record.retirementTaxRatePercent,
        ) / 100 +
        Math.abs(
          candidate.expectedAnnualReturnPercent -
            record.expectedAnnualReturnPercent,
        ) / 10 +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createTraditionalVsRoth401kCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.annualContribution)}/year at ${candidate.currentTaxRatePercent}% now vs ${candidate.retirementTaxRatePercent}% in retirement, ${candidate.expectedAnnualReturnPercent}% return, ${candidate.years} years.`,
    }));
}

export function createTraditionalVsRoth401kSeoPage(
  record: TraditionalVsRoth401kSeoRecord,
  records: TraditionalVsRoth401kSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateRothVsTraditionalIra({
    annualContribution: record.annualContribution,
    currentTaxRatePercent: record.currentTaxRatePercent,
    retirementTaxRatePercent: record.retirementTaxRatePercent,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    years: record.years,
  });
  const winnerLabel = betterOptionLabel(result.betterOption);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `Contributing ${currency.format(record.annualContribution)} per year for ${record.years} years at an assumed ${record.currentTaxRatePercent}% current tax rate and ${record.retirementTaxRatePercent}% retirement tax rate, the ${record.scenarioLabel} scenario projects the Roth 401(k) at ${currency.format(result.rothEndingValue)} versus ${currency.format(result.traditionalAfterTaxEndingValue)} after-tax for Traditional, a difference of ${currency.format(Math.abs(result.difference))}.`,
  });

  return {
    slug: record.slug,
    url: createTraditionalVsRoth401kCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Traditional vs Roth 401(k) example',
    intro: `This worked example compares a Traditional and Roth 401(k) using the ${record.scenarioLabel} scenario: ${currency.format(record.annualContribution)} contributed each year for ${record.years} years, an assumed ${record.currentTaxRatePercent}% current tax rate, a ${record.retirementTaxRatePercent}% assumed retirement tax rate, and a constant ${record.expectedAnnualReturnPercent}% annual return.`,
    summary:
      result.betterOption === 'equal'
        ? `Under these assumptions, the modeled Roth and Traditional 401(k) values are equivalent: both reach approximately ${currency.format(result.rothEndingValue)} after tax.`
        : `Under these assumptions, the ${winnerLabel} ends with about ${currency.format(Math.abs(result.difference))} more than the alternative, reaching roughly ${currency.format(result.betterOption === 'roth' ? result.rothEndingValue : result.traditionalAfterTaxEndingValue)} after tax.`,
    results: [
      {
        label: 'Higher value under assumptions',
        value: winnerLabel,
        primary: true,
      },
      {
        label: 'Projected Roth 401(k) value',
        value: currency.format(result.rothEndingValue),
      },
      {
        label: 'Projected Traditional 401(k) after-tax value',
        value: currency.format(result.traditionalAfterTaxEndingValue),
      },
      {
        label: 'Difference',
        value: currency.format(result.difference),
      },
    ],
    formula: {
      heading: 'How This Traditional vs Roth 401(k) Comparison Works',
      expression:
        'Roth ending value = future value of (contribution × (1 − current tax rate)); Traditional after-tax ending value = future value of contribution × (1 − retirement tax rate)',
      explanation:
        'The page reuses the shared Traditional vs Roth 401(k) Calculator assumptions. The Roth contribution is taxed at the current rate before it is invested, while the Traditional contribution is invested pre-tax and taxed at the assumed retirement rate when it is withdrawn. Both amounts compound at the same assumed annual return over the same number of years.',
      steps: [
        `Reduce the ${currency.format(record.annualContribution)} annual contribution by the assumed ${record.currentTaxRatePercent}% current tax rate to get the after-tax Roth contribution.`,
        `Compound the after-tax Roth contribution at ${record.expectedAnnualReturnPercent}% for ${record.years} years to reach ${currency.format(result.rothEndingValue)}.`,
        `Compound the full pre-tax ${currency.format(record.annualContribution)} contribution at ${record.expectedAnnualReturnPercent}% for ${record.years} years, then apply the assumed ${record.retirementTaxRatePercent}% retirement tax rate to reach ${currency.format(result.traditionalAfterTaxEndingValue)} after-tax.`,
        `Compare the two ending values: ${winnerLabel} is worth about ${currency.format(Math.abs(result.difference))} more under these assumptions.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Scenario Summary',
    projectionRows: [],
    table: {
      heading: 'Scenario Summary',
      columns: ['Metric', 'Value'],
      rows: [
        { label: 'Annual contribution', cells: [currency.format(record.annualContribution)] },
        { label: 'Current assumed tax rate', cells: [`${record.currentTaxRatePercent}%`] },
        { label: 'Retirement assumed tax rate', cells: [`${record.retirementTaxRatePercent}%`] },
        { label: 'Expected annual return', cells: [`${record.expectedAnnualReturnPercent}%`] },
        { label: 'Years invested', cells: [String(record.years)] },
        { label: 'Projected Roth 401(k) value', cells: [currency.format(result.rothEndingValue)] },
        { label: 'Projected Traditional 401(k) after-tax value', cells: [currency.format(result.traditionalAfterTaxEndingValue)] },
        { label: 'Difference', cells: [currency.format(result.difference)] },
        { label: 'Higher value under assumptions', cells: [winnerLabel] },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This scenario isolates how the timing of taxation changes the comparison between a Traditional and Roth 401(k) for the ${record.scenarioLabel} persona. The same pre-tax dollars are contributed either way; the difference comes entirely from when the tax is paid and at what assumed rate.`,
          result.betterOption === 'equal'
            ? 'Because the current and assumed retirement tax rates are equal here, the two accounts land on the same after-tax value under this simplified model.'
            : `Because the assumed ${result.betterOption === 'roth' ? 'current' : 'retirement'} tax rate is lower here, the ${winnerLabel} comes out ahead under these assumptions.`,
        ],
      },
      {
        heading: 'Assumptions and limitations',
        paragraphs: [
          'The example assumes a constant contribution, a constant annual return, and fixed current and retirement tax rates with no employer match, contribution limits, plan fees, or required minimum distributions.',
          'It is an educational scenario, not tax, legal, investment, or retirement-plan advice. Actual tax rates, brackets, and account rules can change and differ from these assumptions.',
        ],
      },
      {
        heading: 'How savers use a comparison like this',
        paragraphs: [
          'Use the result as a starting point, then test your own best estimate of your current and future tax rates in the full calculator. The relative direction of the two rates matters more to this comparison than their exact level.',
          'Many savers split contributions between Traditional and Roth accounts specifically because future tax rates are uncertain. This example only models an all-or-nothing choice between the two.',
        ],
      },
    ],
    faq: [
      {
        question: `How does this ${record.scenarioLabel} comparison work?`,
        answer: `It reduces the Roth contribution for the ${record.currentTaxRatePercent}% current tax rate before compounding, and applies the ${record.retirementTaxRatePercent}% retirement tax rate to the compounded Traditional balance, then compares the two after-tax results.`,
      },
      {
        question: 'Does this determine which 401(k) type I should choose?',
        answer:
          'No. This is an educational scenario, not tax, legal, investment, or retirement-plan advice.',
      },
      {
        question: 'Are employer matches, contribution limits, or fees included?',
        answer:
          'No. The comparison isolates employee contributions and tax-rate assumptions. It excludes employer match, contribution limits, plan fees, penalties, and required minimum distributions.',
      },
      {
        question: 'Why do the current and retirement tax rates matter so much?',
        answer:
          'The model pays tax on the Roth contribution now and on the Traditional balance later, so whichever rate is lower determines which account keeps more value under these assumptions.',
      },
      {
        question: 'What does "equivalent under these assumptions" mean?',
        answer:
          'When the current and retirement tax rates are equal, the model produces the same after-tax ending value for both account types, so neither has a mathematical advantage in this simplified comparison.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Traditional vs Roth 401(k) Calculator',
        url: '/calculators/traditional-vs-roth-401k-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/traditional-vs-roth-401k/examples/',
      },
      { name: record.question, url: createTraditionalVsRoth401kCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Traditional vs Roth 401(k) Examples',
    relatedCalculators: [
      {
        title: '401(k) Calculator',
        url: '/calculators/401k-calculator/',
        description: 'Model 401(k) growth with an employer match.',
      },
      {
        title: '401(k) Growth Calculator',
        url: '/calculators/401k-growth-calculator/',
        description: 'Project 401(k) growth from a current balance and contributions.',
      },
      {
        title: 'Roth IRA Calculator',
        url: '/calculators/roth-ira-calculator/',
        description: 'Project Roth IRA growth from contributions and an expected return.',
      },
      {
        title: 'Roth vs Traditional IRA Calculator',
        url: '/calculators/roth-vs-traditional-ira-calculator/',
        description: 'Compare paying taxes now with paying them later in an IRA.',
      },
      {
        title: 'Retirement Withdrawal Calculator',
        url: '/calculators/retirement-withdrawal-calculator/',
        description: 'Estimate how long a retirement portfolio can sustain withdrawals.',
      },
    ],
    relatedGuides: [
      {
        title: 'Roth IRA vs Traditional IRA',
        url: '/guides/roth-vs-traditional-ira/',
        description: 'Understand the high-level tax tradeoffs between Roth and traditional retirement accounts.',
      },
      {
        title: 'Planning Retirement Withdrawals',
        url: '/guides/retirement-withdrawals/',
        description: 'See this account choice in the context of a broader retirement income plan.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Traditional vs Roth 401(k) Comparison',
      description:
        'Open the full calculator to change the contribution, current and retirement tax rate assumptions, return, and years invested.',
      url: '/calculators/traditional-vs-roth-401k-calculator/',
      label: 'Open the Traditional vs Roth 401(k) Calculator',
      examplesUrl: '/calculators/traditional-vs-roth-401k/examples/',
      examplesLabel: 'Browse All Traditional vs Roth 401(k) Examples',
    },
  };
}

export function auditTraditionalVsRoth401kSeoRecords(
  records: TraditionalVsRoth401kSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createTraditionalVsRoth401kSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'traditional vs roth 401k',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createTraditionalVsRoth401kCanonicalPath,
  });
}
