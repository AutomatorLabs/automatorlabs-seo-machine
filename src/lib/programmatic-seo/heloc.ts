import type { HelocSeoRecord } from '../../data/programmatic-seo/heloc';
import { calculateHeloc } from '../math';
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
  maximumFractionDigits: 0,
});

const clusterPath = 'calculators/heloc';

export function createHelocCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: HelocSeoRecord,
  records: HelocSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.homeValue - record.homeValue) / Math.max(record.homeValue, 1) +
        Math.abs(candidate.currentMortgageBalance - record.currentMortgageBalance) / 10000 +
        Math.abs(candidate.requestedHelocAmount - record.requestedHelocAmount) / 10000,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createHelocCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.homeValue)} home value, ${currency.format(candidate.currentMortgageBalance)} mortgage balance, ${candidate.maximumCltvPercent}% CLTV cap.`,
    }));
}

export function createHelocSeoPage(
  record: HelocSeoRecord,
  records: HelocSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateHeloc(record);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${currency.format(record.homeValue)} home value, ${currency.format(record.currentMortgageBalance)} mortgage balance, ${record.maximumCltvPercent}% CLTV, ${currency.format(record.requestedHelocAmount)} requested, and ${record.annualInterestRatePercent}% rate.`,
  });

  return {
    slug: record.slug,
    url: createHelocCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'HELOC example',
    intro: `This worked example compares available home equity with a lender-style CLTV cap to estimate how much home equity line capacity may be available.`,
    summary: `With a home value of ${currency.format(record.homeValue)} and a current mortgage balance of ${currency.format(record.currentMortgageBalance)}, the estimated available HELOC limit is ${currency.format(result.maximumAvailableHeloc)}. A requested line of ${currency.format(record.requestedHelocAmount)} implies an approval buffer or shortfall of ${currency.format(result.approvalBufferOrShortfall)}.`,
    results: [
      { label: 'Estimated maximum HELOC', value: currency.format(result.maximumAvailableHeloc), primary: true },
      { label: 'Available equity', value: currency.format(result.availableEquity) },
      { label: 'Interest-only monthly payment', value: currency.format(result.interestOnlyMonthlyPayment) },
      { label: 'Approval buffer or shortfall', value: currency.format(result.approvalBufferOrShortfall) },
    ],
    formula: {
      heading: 'How This HELOC Example Works',
      expression: 'Maximum HELOC = (home value × CLTV cap) - current mortgage balance',
      explanation:
        'The shared HELOC math compares total secured debt allowed under the CLTV assumption with the current mortgage balance, then estimates the interest-only cost of the requested line amount.',
      steps: [
        `Start with a home value of ${currency.format(record.homeValue)} and a mortgage balance of ${currency.format(record.currentMortgageBalance)}.`,
        `Apply the CLTV cap of ${record.maximumCltvPercent}% to estimate the maximum total secured borrowing.`,
        `Subtract the current mortgage balance to estimate the maximum HELOC size.`,
        `Calculate the interest-only payment on the requested line at ${record.annualInterestRatePercent}% annual interest.`,
      ],
    },
    showChart: false,
    projectionHeading: 'HELOC Capacity Summary',
    projectionRows: [],
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why equity and borrowing capacity are not the same',
        paragraphs: [
          'Total home equity is simply home value minus the mortgage balance, but lenders usually cap borrowing below that full equity amount.',
          'Worked examples are useful for showing how CLTV policy can materially shrink or expand the amount a homeowner can actually request.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this guarantee HELOC approval?',
        answer:
          'No. Real approval also depends on income, credit, debt ratios, underwriting, property type, and lender policy.',
      },
      {
        question: 'Why is the payment interest-only here?',
        answer:
          'The calculator models the common draw-period framing of a HELOC, where minimum required payments may be interest-only.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'HELOC Calculator', url: '/calculators/heloc-calculator/' },
      { name: 'Examples', url: '/calculators/heloc/examples/' },
      { name: record.question, url: createHelocCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'HELOC Calculator',
        url: '/calculators/heloc-calculator/',
        description: 'Use your own home value, mortgage balance, CLTV, and requested line amount.',
      },
      {
        title: 'Mortgage Payoff Calculator',
        url: '/calculators/mortgage-payoff-calculator/',
        description: 'See how reducing the mortgage balance can change future borrowing capacity.',
      },
      {
        title: 'Home Affordability Calculator',
        url: '/calculators/home-affordability-calculator/',
        description: 'Connect home borrowing with broader monthly debt and cash-flow assumptions.',
      },
    ],
    relatedGuides: [
      {
        title: 'Mortgage and Home Buying Guide Hub',
        url: '/guides/mortgage/',
        description: 'Connect HELOC decisions with mortgage payments, payoff strategies, and housing tradeoffs.',
      },
      {
        title: 'Home Buying Guide Hub',
        url: '/guides/home-buying/',
        description: 'Use broader housing-cost planning before adding new debt secured by the home.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own HELOC Scenario',
      description: 'Use the full calculator to change home value, mortgage balance, CLTV cap, and requested line amount.',
      url: '/calculators/heloc-calculator/',
      label: 'Open the HELOC Calculator',
      examplesUrl: '/calculators/heloc/examples/',
      examplesLabel: 'Browse All HELOC Examples',
    },
    relatedPagesHeading: 'Related HELOC Examples',
  };
}

export function auditHelocSeoRecords(
  records: HelocSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'HELOC',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.homeValue} home value, ${record.currentMortgageBalance} mortgage balance, ${record.maximumCltvPercent}% CLTV, and ${record.requestedHelocAmount} requested.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createHelocCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createHelocCanonicalPath,
  });
}
