import type { ClosingCostSeoRecord } from '../../data/programmatic-seo/closing-cost';
import { calculateClosingCost } from '../math';
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

const clusterPath = 'calculators/closing-cost';

export function createClosingCostCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: ClosingCostSeoRecord,
  records: ClosingCostSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.homePurchasePrice - record.homePurchasePrice) /
          Math.max(record.homePurchasePrice, 1) +
        Math.abs(candidate.downPayment - record.downPayment) /
          Math.max(record.downPayment, 1) +
        Math.abs(candidate.closingCostPercent - record.closingCostPercent) +
        Math.abs(candidate.lenderCredits - record.lenderCredits) / 1000,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createClosingCostCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.homePurchasePrice)} home, ${wholeCurrency.format(candidate.downPayment)} down, ${candidate.closingCostPercent}% variable closing costs.`,
    }));
}

export function createClosingCostSeoPage(
  record: ClosingCostSeoRecord,
  records: ClosingCostSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateClosingCost(record);
  const variableClosingCosts =
    record.homePurchasePrice * (record.closingCostPercent / 100);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${record.scenarioLabel} closing-cost scenario: ${wholeCurrency.format(record.homePurchasePrice)} purchase with ${wholeCurrency.format(record.downPayment)} down produces about ${currency.format(result.estimatedClosingCosts)} in closing costs and ${currency.format(result.cashToClose)} cash to close under the fixed assumptions used here.`,
  });

  return {
    slug: record.slug,
    url: createClosingCostCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Closing cost example',
    intro: `This worked example estimates cash to close on a ${wholeCurrency.format(record.homePurchasePrice)} purchase with ${wholeCurrency.format(record.downPayment)} down, ${record.closingCostPercent}% variable closing costs, ${currency.format(record.fixedClosingCosts)} in fixed fees, ${currency.format(record.prepaidEscrowAndTaxes)} in prepaids, and ${currency.format(record.lenderCredits)} in lender credits.`,
    summary: `Estimated closing costs are about ${currency.format(result.estimatedClosingCosts)}, which brings total cash to close to roughly ${currency.format(result.cashToClose)} when the down payment is included.`,
    results: [
      {
        label: 'Estimated closing costs',
        value: currency.format(result.estimatedClosingCosts),
        primary: true,
      },
      {
        label: 'Cash to close',
        value: currency.format(result.cashToClose),
      },
      {
        label: 'Estimated loan amount',
        value: currency.format(result.loanAmount),
      },
      {
        label: 'Closing costs as % of price',
        value: `${result.closingCostAsPercentOfPrice.toFixed(2)}%`,
      },
    ],
    formula: {
      heading: 'How This Closing Cost Example Works',
      expression:
        'Closing costs = variable cost % + fixed fees + prepaid items - lender credits',
      explanation:
        'The page reuses the shared Closing Cost Calculator assumptions to combine purchase-price-based costs, fixed fees, prepaid items, and lender credits into one cash-to-close estimate.',
      steps: [
        `Start with a purchase price of ${wholeCurrency.format(record.homePurchasePrice)} and a down payment of ${wholeCurrency.format(record.downPayment)}.`,
        `Estimate variable closing costs at ${record.closingCostPercent}% of the purchase price.`,
        `Add ${currency.format(record.fixedClosingCosts)} in fixed fees and ${currency.format(record.prepaidEscrowAndTaxes)} in prepaid escrow and tax items.`,
        `Subtract ${currency.format(record.lenderCredits)} in lender credits to estimate final closing costs and cash to close.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Scenario Summary',
    projectionRows: [],
    table: {
      heading: 'Scenario Summary',
      columns: ['Metric', 'Value'],
      rows: [
        { label: 'Purchase price', cells: [currency.format(record.homePurchasePrice)] },
        { label: 'Down payment', cells: [currency.format(record.downPayment)] },
        { label: 'Estimated loan amount', cells: [currency.format(result.loanAmount)] },
        { label: 'Variable closing costs', cells: [currency.format(variableClosingCosts)] },
        { label: 'Fixed closing costs', cells: [currency.format(record.fixedClosingCosts)] },
        { label: 'Prepaid escrow and taxes', cells: [currency.format(record.prepaidEscrowAndTaxes)] },
        { label: 'Lender credits', cells: [currency.format(record.lenderCredits)] },
        { label: 'Estimated closing costs', cells: [currency.format(result.estimatedClosingCosts)] },
        { label: 'Cash to close', cells: [currency.format(result.cashToClose)] },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why cash-to-close estimates matter',
        paragraphs: [
          'Many buyers focus on the down payment and underestimate the additional cash required to close a purchase. Worked examples help surface that gap early.',
          'Variable closing costs, prepaids, and credits can shift the final number materially even when the home price is unchanged.',
        ],
      },
      {
        heading: 'How to use this example',
        paragraphs: [
          'Treat this result as a planning baseline and compare it against your available cash, reserves after closing, and the rest of your move-in budget.',
          'Use the full calculator if you need to test different lender-credit structures, prepaid assumptions, or a different down payment.',
        ],
      },
    ],
    faq: [
      {
        question: 'Are closing costs the same as the down payment?',
        answer:
          'No. Closing costs are separate from the down payment, which is why the page shows both estimated closing costs and total cash to close.',
      },
      {
        question: 'Why can lender credits reduce cash to close?',
        answer:
          'Lender credits offset part of the closing-cost stack, though they may come with a different interest-rate tradeoff in a real mortgage offer.',
      },
      {
        question: 'Do prepaid taxes and escrow count as closing costs here?',
        answer:
          'Yes. They are included in the cash-to-close estimate because buyers often need that money at settlement even though it is not a lender fee.',
      },
      {
        question: 'Does this include inspection, appraisal, or moving costs outside settlement?',
        answer:
          'Only the amounts entered into the calculator assumptions are included here.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Closing Cost Calculator',
        url: '/calculators/closing-cost-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/closing-cost/examples/',
      },
      { name: record.question, url: createClosingCostCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Closing Cost Examples',
    relatedCalculators: [
      {
        title: 'Closing Cost Calculator',
        url: '/calculators/closing-cost-calculator/',
        description:
          'Change the purchase price, down payment, fee assumptions, and lender credits.',
      },
      {
        title: 'Down Payment Calculator',
        url: '/calculators/down-payment-calculator/',
        description:
          'Estimate how long it may take to save the down payment side of your cash-to-close target.',
      },
      {
        title: 'Mortgage Payment Calculator',
        url: '/calculators/mortgage-payment-calculator/',
        description:
          'Compare up-front cash needs with the ongoing monthly payment.',
      },
    ],
    relatedGuides: [
      {
        title: 'Mortgage and Home Buying Guide Hub',
        url: '/guides/mortgage/',
        description:
          'See closing costs in context with taxes, down payments, mortgage payments, and ownership costs.',
      },
      {
        title: 'A Practical Guide to Buying a Home',
        url: '/guides/home-buying/',
        description:
          'Use closing-cost estimates as part of a broader home-purchase planning process.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Closing Cost Scenario',
      description:
        'Use the calculator to change the purchase price, down payment, fees, prepaids, and credits.',
      url: '/calculators/closing-cost-calculator/',
      label: 'Open the Closing Cost Calculator',
      examplesUrl: '/calculators/closing-cost/examples/',
      examplesLabel: 'Browse All Closing Cost Examples',
    },
  };
}

export function auditClosingCostSeoRecords(
  records: ClosingCostSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'closing cost',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.scenarioLabel} scenario. ${record.question} using ${record.homePurchasePrice} purchase price, ${record.downPayment} down payment, ${record.closingCostPercent}% variable costs, ${record.fixedClosingCosts} fixed costs, ${record.prepaidEscrowAndTaxes} prepaids, and ${record.lenderCredits} credits.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createClosingCostCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createClosingCostCanonicalPath,
  });
}
