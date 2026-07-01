import type { RothEarlyWithdrawalSeoRecord } from '../../data/programmatic-seo/roth-ira-early-withdrawal';
import { calculateRothEarlyWithdrawal } from '../math';
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

const wholeCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const clusterPath = 'calculators/roth-ira-early-withdrawal';

export function createRothEarlyWithdrawalCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: RothEarlyWithdrawalSeoRecord,
  records: RothEarlyWithdrawalSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.withdrawalAmount - record.withdrawalAmount) /
          Math.max(record.withdrawalAmount, 1) +
        Math.abs(
          candidate.contributionBasisAvailable -
            record.contributionBasisAvailable,
        ) / Math.max(record.contributionBasisAvailable, 1) +
        Math.abs(
          candidate.assumedTaxRatePercent - record.assumedTaxRatePercent,
        ) / 100 +
        Math.abs(
          candidate.assumedPenaltyRatePercent -
            record.assumedPenaltyRatePercent,
        ) / 100,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createRothEarlyWithdrawalCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.withdrawalAmount)} withdrawal, ${wholeCurrency.format(candidate.contributionBasisAvailable)} basis, ${candidate.assumedTaxRatePercent}% tax, ${candidate.assumedPenaltyRatePercent}% penalty.`,
    }));
}

export function createRothEarlyWithdrawalSeoPage(
  record: RothEarlyWithdrawalSeoRecord,
  records: RothEarlyWithdrawalSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateRothEarlyWithdrawal(record);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${record.scenarioLabel} Roth IRA early withdrawal scenario: a ${wholeCurrency.format(record.withdrawalAmount)} withdrawal against ${wholeCurrency.format(record.contributionBasisAvailable)} in contribution basis produces about ${currency.format(result.estimatedNetWithdrawal)} net after an assumed ${record.assumedTaxRatePercent}% tax rate and ${record.assumedPenaltyRatePercent}% penalty rate on the earnings portion.`,
  });

  return {
    slug: record.slug,
    url: createRothEarlyWithdrawalCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Roth IRA early withdrawal example',
    intro: `This worked example estimates the tax and penalty impact of withdrawing ${wholeCurrency.format(record.withdrawalAmount)} from a Roth IRA before qualified-distribution rules apply, using ${wholeCurrency.format(record.contributionBasisAvailable)} in available contribution basis, ${currency.format(record.earningsAmountSubjectToTaxAndPenalty)} in earnings potentially subject to tax and penalty, an assumed ${record.assumedTaxRatePercent}% tax rate, and an assumed ${record.assumedPenaltyRatePercent}% penalty rate.`,
    summary:
      result.earningsPortion === 0
        ? `Because the withdrawal stays within available contribution basis, the modeled tax and penalty are both $0, leaving the full ${currency.format(result.estimatedNetWithdrawal)} available.`
        : `The modeled contribution portion (${currency.format(result.contributionPortion)}) comes out tax- and penalty-free, while the ${currency.format(result.earningsPortion)} earnings portion produces about ${currency.format(result.estimatedTax)} in tax and ${currency.format(result.estimatedPenalty)} in penalty, leaving roughly ${currency.format(result.estimatedNetWithdrawal)} net.`,
    results: [
      {
        label: 'Estimated net withdrawal',
        value: currency.format(result.estimatedNetWithdrawal),
        primary: true,
      },
      {
        label: 'Modeled contribution portion',
        value: currency.format(result.contributionPortion),
      },
      {
        label: 'Modeled earnings portion',
        value: currency.format(result.earningsPortion),
      },
      {
        label: 'Estimated tax',
        value: currency.format(result.estimatedTax),
      },
      {
        label: 'Estimated penalty',
        value: currency.format(result.estimatedPenalty),
      },
    ],
    formula: {
      heading: 'How This Roth IRA Early Withdrawal Example Works',
      expression:
        'Contribution portion = min(withdrawal, basis); earnings portion = min(withdrawal − contribution portion, earnings available); tax = earnings portion × tax rate; penalty = earnings portion × penalty rate',
      explanation:
        'The page reuses the shared Roth IRA Early Withdrawal Calculator assumptions and applies Roth ordering rules: contribution basis is treated as coming out first, tax- and penalty-free, before any withdrawal reaches earnings.',
      steps: [
        `Start with a planned withdrawal of ${wholeCurrency.format(record.withdrawalAmount)} against ${wholeCurrency.format(record.contributionBasisAvailable)} in available contribution basis.`,
        `Draw from basis first: ${currency.format(result.contributionPortion)} comes out tax- and penalty-free.`,
        `Any remaining withdrawal draws from earnings, capped at ${currency.format(record.earningsAmountSubjectToTaxAndPenalty)} available: ${currency.format(result.earningsPortion)} here.`,
        `Apply the assumed ${record.assumedTaxRatePercent}% tax rate and ${record.assumedPenaltyRatePercent}% penalty rate to the earnings portion to estimate ${currency.format(result.estimatedTax)} in tax and ${currency.format(result.estimatedPenalty)} in penalty.`,
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
          label: 'Planned withdrawal',
          cells: [currency.format(record.withdrawalAmount)],
        },
        {
          label: 'Contribution basis available',
          cells: [currency.format(record.contributionBasisAvailable)],
        },
        {
          label: 'Earnings subject to tax and penalty',
          cells: [
            currency.format(record.earningsAmountSubjectToTaxAndPenalty),
          ],
        },
        {
          label: 'Assumed tax rate',
          cells: [`${record.assumedTaxRatePercent}%`],
        },
        {
          label: 'Assumed penalty rate',
          cells: [`${record.assumedPenaltyRatePercent}%`],
        },
        {
          label: 'Modeled contribution portion',
          cells: [currency.format(result.contributionPortion)],
        },
        {
          label: 'Modeled earnings portion',
          cells: [currency.format(result.earningsPortion)],
        },
        {
          label: 'Estimated tax',
          cells: [currency.format(result.estimatedTax)],
        },
        {
          label: 'Estimated penalty',
          cells: [currency.format(result.estimatedPenalty)],
        },
        {
          label: 'Estimated net withdrawal',
          cells: [currency.format(result.estimatedNetWithdrawal)],
        },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why basis-versus-earnings ordering matters',
        paragraphs: [
          'Roth IRA contributions can typically be withdrawn at any time without tax or penalty, since they were already made with after-tax dollars. Earnings are treated differently, especially before age 59½ or before a Roth account has been open for five years.',
          'A withdrawal that stays within contribution basis avoids tax and penalty entirely. Once a withdrawal exceeds basis, the excess is treated as earnings and may be taxed, penalized, or both, depending on individual circumstances and any applicable exception.',
        ],
      },
      {
        heading: 'How to use this example',
        paragraphs: [
          'Treat this result as a planning baseline, not a final answer. Confirm your actual contribution basis, prior withdrawals, and any qualifying exception with your account records and a qualified tax professional.',
          'Use the full calculator if you need to test a different withdrawal amount, basis, earnings exposure, or rate assumption.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this example reflect the real tax treatment of my withdrawal?',
        answer:
          'No. It applies the entered basis, earnings, tax rate, and penalty rate as a simplified estimate, not a legal or tax determination.',
      },
      {
        question: 'Why does the contribution portion avoid tax and penalty?',
        answer:
          'Roth IRA contributions are made with after-tax dollars and can generally be withdrawn without additional tax or penalty, which is why this example draws from contribution basis first.',
      },
      {
        question: 'Does this model ordering rules, conversions, or the five-year rule automatically?',
        answer:
          'No. Roth IRA ordering rules, conversion basis, holding periods, age, and exceptions are not automatically modeled here.',
      },
      {
        question: 'What if a penalty exception applies to my withdrawal?',
        answer:
          'Some withdrawals qualify for an exception that removes the penalty while tax may still apply. This example only reflects the tax and penalty rates entered into the scenario.',
      },
      {
        question: 'Should I rely on this estimate before taking a distribution?',
        answer:
          'No. Confirm current rules and your account history with authoritative guidance or a qualified tax professional before acting.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Roth IRA Early Withdrawal Calculator',
        url: '/calculators/roth-ira-early-withdrawal-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/roth-ira-early-withdrawal/examples/',
      },
      {
        name: record.question,
        url: createRothEarlyWithdrawalCanonicalPath(record.slug),
      },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Roth IRA Early Withdrawal Examples',
    relatedCalculators: [
      {
        title: 'Roth IRA Early Withdrawal Calculator',
        url: '/calculators/roth-ira-early-withdrawal-calculator/',
        description:
          'Change the withdrawal amount, contribution basis, earnings exposure, tax rate, and penalty rate.',
      },
      {
        title: 'Roth IRA Calculator',
        url: '/calculators/roth-ira-calculator/',
        description:
          'Project long-term Roth IRA growth from a starting balance, contributions, and expected return.',
      },
      {
        title: 'Roth vs Traditional IRA Calculator',
        url: '/calculators/roth-vs-traditional-ira-calculator/',
        description:
          'Compare paying taxes now with paying them later under simplified IRA assumptions.',
      },
    ],
    relatedGuides: [
      {
        title: 'Roth IRA vs Traditional IRA',
        url: '/guides/roth-vs-traditional-ira/',
        description:
          'Understand the high-level tax tradeoffs between Roth and traditional retirement accounts.',
      },
      {
        title: 'Planning Retirement Withdrawals',
        url: '/guides/retirement-withdrawals/',
        description:
          'See early withdrawals in the context of a broader retirement income plan.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Roth IRA Early Withdrawal Scenario',
      description:
        'Use the calculator to change the withdrawal amount, contribution basis, earnings exposure, and rate assumptions.',
      url: '/calculators/roth-ira-early-withdrawal-calculator/',
      label: 'Open the Roth IRA Early Withdrawal Calculator',
      examplesUrl: '/calculators/roth-ira-early-withdrawal/examples/',
      examplesLabel: 'Browse All Roth IRA Early Withdrawal Examples',
    },
  };
}

export function auditRothEarlyWithdrawalSeoRecords(
  records: RothEarlyWithdrawalSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'roth ira early withdrawal',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.scenarioLabel} scenario. ${record.question} using ${record.withdrawalAmount} withdrawal, ${record.contributionBasisAvailable} basis, ${record.earningsAmountSubjectToTaxAndPenalty} earnings, ${record.assumedTaxRatePercent}% tax, and ${record.assumedPenaltyRatePercent}% penalty.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createRothEarlyWithdrawalCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createRothEarlyWithdrawalCanonicalPath,
  });
}
