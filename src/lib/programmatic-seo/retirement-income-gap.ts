import type { RetirementIncomeGapSeoRecord } from '../../data/programmatic-seo/retirement-income-gap';
import { calculateRetirementIncomeGap } from '../math';
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

const clusterPath = 'calculators/retirement-income-gap';

export function createRetirementIncomeGapCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: RetirementIncomeGapSeoRecord,
  records: RetirementIncomeGapSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(
          candidate.desiredAnnualRetirementIncome -
            record.desiredAnnualRetirementIncome,
        ) /
          record.desiredAnnualRetirementIncome +
        Math.abs(candidate.portfolioValue - record.portfolioValue) /
          Math.max(record.portfolioValue, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createRetirementIncomeGapCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.desiredAnnualRetirementIncome)} target income, ${currency.format(candidate.portfolioValue)} invested, ${percentage.format(candidate.withdrawalRatePercent)}% withdrawal rate.`,
    }));
}

function createTable(
  record: RetirementIncomeGapSeoRecord,
  totalNonPortfolioIncome: number,
): ProgrammaticSeoTable {
  return {
    heading: 'Retirement Income Sources',
    columns: ['Annual amount'],
    rows: [
      { label: 'Desired retirement income', cells: [currency.format(record.desiredAnnualRetirementIncome)] },
      { label: 'Social Security', cells: [currency.format(record.socialSecurityIncome)] },
      { label: 'Pension', cells: [currency.format(record.pensionIncome)] },
      { label: 'Rental income', cells: [currency.format(record.rentalIncome)] },
      { label: 'Dividend income', cells: [currency.format(record.dividendIncome)] },
      { label: 'Other passive income', cells: [currency.format(record.otherPassiveIncome)] },
      { label: 'Total non-portfolio income', cells: [currency.format(totalNonPortfolioIncome)] },
    ],
  };
}

export function createRetirementIncomeGapSeoPage(
  record: RetirementIncomeGapSeoRecord,
  records: RetirementIncomeGapSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateRetirementIncomeGap({
    desiredAnnualRetirementIncome: record.desiredAnnualRetirementIncome,
    nonPortfolioIncome: [
      record.socialSecurityIncome,
      record.pensionIncome,
      record.rentalIncome,
      record.dividendIncome,
      record.otherPassiveIncome,
    ],
    portfolioValue: record.portfolioValue,
    withdrawalRatePercent: record.withdrawalRatePercent,
  });
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.desiredAnnualRetirementIncome)} of target retirement income is compared with ${currency.format(result.totalNonPortfolioIncome)} from non-portfolio sources and ${currency.format(record.portfolioValue)} invested at a ${percentage.format(record.withdrawalRatePercent)}% withdrawal rate.`,
  });

  return {
    slug: record.slug,
    url: createRetirementIncomeGapCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Retirement income example',
    intro: `This worked example breaks ${currency.format(record.desiredAnnualRetirementIncome)} of desired retirement income into non-portfolio income and potential portfolio-supported income.`,
    summary: `The example includes ${currency.format(result.totalNonPortfolioIncome)} from Social Security, pension, rental, dividend, and other passive income sources. At ${percentage.format(record.withdrawalRatePercent)}%, a ${currency.format(record.portfolioValue)} portfolio supports about ${currency.format(result.portfolioWithdrawalSupported)} per year, leaving a ${result.surplusOrShortfall >= 0 ? `surplus of ${currency.format(result.surplusOrShortfall)}` : `shortfall of ${currency.format(Math.abs(result.surplusOrShortfall))}`}.`,
    results: [
      { label: 'Annual income gap', value: currency.format(result.annualIncomeGap), primary: true },
      { label: 'Non-portfolio income', value: currency.format(result.totalNonPortfolioIncome) },
      { label: 'Portfolio-supported income', value: currency.format(result.portfolioWithdrawalSupported) },
      { label: result.surplusOrShortfall >= 0 ? 'Surplus' : 'Shortfall', value: currency.format(Math.abs(result.surplusOrShortfall)) },
    ],
    formula: {
      heading: 'How the Retirement Income Gap Is Estimated',
      expression: 'Income gap = desired retirement income − non-portfolio income',
      explanation:
        'The portfolio is then checked separately by applying the chosen withdrawal rate to the invested balance.',
      steps: [
        `Start with a desired retirement income of ${currency.format(record.desiredAnnualRetirementIncome)} per year.`,
        `Add non-portfolio sources such as Social Security, pension, rental income, dividends, and other passive cash flow.`,
        `Subtract those sources to find the remaining gap.`,
        `Apply the ${percentage.format(record.withdrawalRatePercent)}% withdrawal rate to ${currency.format(record.portfolioValue)} to estimate how much the portfolio may cover.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Retirement Income Snapshot',
    projectionRows: [],
    table: createTable(record, result.totalNonPortfolioIncome),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why the income gap matters',
        paragraphs: [
          'Retirement planning often feels more practical when income sources are separated into dependable non-portfolio cash flow and the amount the portfolio must fund.',
          'That separation makes it easier to stress-test taxes, withdrawal rates, part-time work, and changes in spending assumptions.',
        ],
      },
      {
        heading: 'What this example leaves out',
        paragraphs: [
          'This simplified view does not model taxes on each income source, future benefit changes, sequence-of-returns risk, or spending that changes over time.',
          'It should be used as an educational planning snapshot rather than a full retirement cash-flow forecast.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is a zero gap always the goal?',
        answer:
          'Not always. Some retirees may want extra margin for taxes, health care, travel, or irregular expenses, while others may be comfortable with more flexible spending.',
      },
      {
        question: 'Why check the portfolio separately with a withdrawal rate?',
        answer:
          'Because the portfolio has to fund whatever non-portfolio income does not cover. The withdrawal rate gives a simple first-pass estimate of that spendable amount.',
      },
      {
        question: 'Does this example prove the income plan is sustainable?',
        answer:
          'No. Sustainability depends on return sequences, inflation, taxes, fees, and how spending changes over time. Use withdrawal and sustainability tools alongside this gap analysis.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Retirement Income Gap Calculator', url: '/calculators/retirement-income-gap-calculator/' },
      { name: 'Examples', url: '/calculators/retirement-income-gap/examples/' },
      { name: title, url: createRetirementIncomeGapCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Retirement Income Gap Calculator',
        url: '/calculators/retirement-income-gap-calculator/',
        description: 'Test your own retirement income target, non-portfolio income, and portfolio value.',
      },
      {
        title: 'Safe Withdrawal Rate Calculator',
        url: '/calculators/safe-withdrawal-rate-calculator/',
        description: 'Estimate how much annual spending a portfolio may support at different withdrawal assumptions.',
      },
      {
        title: 'Retirement Withdrawal Calculator',
        url: '/calculators/retirement-withdrawal-calculator/',
        description: 'Translate a portfolio into annual and monthly withdrawal figures.',
      },
    ],
    relatedGuides: [
      {
        title: 'Retirement Planning Guide Hub',
        url: '/guides/retirement/',
        description: 'Connect spending targets, retirement income sources, and portfolio planning.',
      },
      {
        title: 'Planning Retirement Withdrawals',
        url: '/guides/retirement-withdrawals/',
        description: 'See how withdrawal rates and portfolio size affect retirement income planning.',
      },
      {
        title: 'A Beginner’s Guide to FIRE',
        url: '/guides/fire/',
        description: 'Use spending and portfolio thinking together when defining long-term independence targets.',
      },
    ],
    calculatorCta: {
      heading: 'Model Your Own Retirement Income Mix',
      description:
        'Use the full calculator to change retirement income goals, income sources, portfolio size, and withdrawal assumptions.',
      url: '/calculators/retirement-income-gap-calculator/',
      label: 'Open the Retirement Income Gap Calculator',
      examplesUrl: '/calculators/retirement-income-gap/examples/',
      examplesLabel: 'Browse All Retirement Income Gap Examples',
    },
    relatedPagesHeading: 'Related Retirement Income Gap Examples',
  };
}

export function auditRetirementIncomeGapSeoRecords(
  records: RetirementIncomeGapSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'retirement income gap',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.desiredAnnualRetirementIncome} desired income, ${record.portfolioValue} invested, and a ${record.withdrawalRatePercent}% withdrawal rate.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createRetirementIncomeGapCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createRetirementIncomeGapCanonicalPath,
  });
}
