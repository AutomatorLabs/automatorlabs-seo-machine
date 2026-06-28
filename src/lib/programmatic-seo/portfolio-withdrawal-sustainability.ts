import type { PortfolioWithdrawalSustainabilitySeoRecord } from '../../data/programmatic-seo/portfolio-withdrawal-sustainability';
import { calculatePortfolioWithdrawalSustainability } from '../math';
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

const clusterPath = 'calculators/portfolio-withdrawal-sustainability';

export function createPortfolioWithdrawalSustainabilityCanonicalPath(
  slug: string,
): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: PortfolioWithdrawalSustainabilitySeoRecord,
  records: PortfolioWithdrawalSustainabilitySeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.portfolioValue - record.portfolioValue) /
          record.portfolioValue +
        Math.abs(
          candidate.annualWithdrawalAmount -
            record.annualWithdrawalAmount,
        ) / Math.max(record.annualWithdrawalAmount, 1) +
        Math.abs(candidate.years - record.years) / record.years,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createPortfolioWithdrawalSustainabilityCanonicalPath(
        candidate.slug,
      ),
      description: `${currency.format(candidate.portfolioValue)} portfolio, ${currency.format(candidate.annualWithdrawalAmount)} annual withdrawal, ${candidate.years} years.`,
    }));
}

function createTable(
  record: PortfolioWithdrawalSustainabilitySeoRecord,
): ProgrammaticSeoTable {
  const returns = [5, 6, 7, 8];

  return {
    heading: 'Return Assumption Comparison',
    columns: ['Inflation', 'Retirement length'],
    rows: returns.map((expectedAnnualReturnPercent) => ({
      label: `${percentage.format(expectedAnnualReturnPercent)}% return`,
      cells: [
        `${percentage.format(record.inflationRatePercent)}%`,
        `${record.years} years`,
      ],
    })),
  };
}

export function createPortfolioWithdrawalSustainabilitySeoPage(
  record: PortfolioWithdrawalSustainabilitySeoRecord,
  records: PortfolioWithdrawalSustainabilitySeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculatePortfolioWithdrawalSustainability({
    portfolioValue: record.portfolioValue,
    annualWithdrawalAmount: record.annualWithdrawalAmount,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    inflationRatePercent: record.inflationRatePercent,
    years: record.years,
  });
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.portfolioValue)} is tested against ${currency.format(record.annualWithdrawalAmount)} annual withdrawals for ${record.years} years using ${percentage.format(record.expectedAnnualReturnPercent)}% return and ${percentage.format(record.inflationRatePercent)}% inflation.`,
  });

  return {
    slug: record.slug,
    url: createPortfolioWithdrawalSustainabilityCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Withdrawal sustainability example',
    intro: `This worked example asks whether a ${currency.format(record.portfolioValue)} portfolio can keep funding ${currency.format(record.annualWithdrawalAmount)} annual withdrawals for ${record.years} years.`,
    summary: `Using ${percentage.format(record.expectedAnnualReturnPercent)}% expected annual return and ${percentage.format(record.inflationRatePercent)}% inflation, the model ends with ${currency.format(result.endingPortfolioBalance)} and classifies the scenario as ${result.status === 'sustainable' ? 'sustainable' : 'depleted'} under these assumptions.`,
    results: [
      { label: 'Ending portfolio balance', value: currency.format(result.endingPortfolioBalance), primary: true },
      { label: 'Total withdrawals', value: currency.format(result.totalWithdrawals) },
      { label: 'Real return', value: `${percentage.format(result.realReturnPercent)}%` },
      { label: 'Modeled status', value: result.status === 'sustainable' ? 'Sustainable' : 'Depleted' },
    ],
    formula: {
      heading: 'How the Sustainability Check Works',
      expression: 'Ending balance = prior balance × (1 + real return) − annual withdrawal',
      explanation:
        'The shared sustainability math converts nominal return and inflation into a real return, then applies the withdrawal over the selected retirement period.',
      steps: [
        `Start with ${currency.format(record.portfolioValue)} invested.`,
        `Withdraw ${currency.format(record.annualWithdrawalAmount)} per year for ${record.years} years.`,
        `Convert ${percentage.format(record.expectedAnnualReturnPercent)}% return and ${percentage.format(record.inflationRatePercent)}% inflation into a real return.`,
        'Check whether the modeled balance remains above zero through the full period.',
      ],
    },
    showChart: false,
    projectionHeading: 'Sustainability Snapshot',
    projectionRows: [],
    table: createTable(record),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why sustainability matters',
        paragraphs: [
          'A retirement withdrawal amount can look reasonable as a percentage and still fail over a long horizon if inflation, return assumptions, or the retirement length are unfavorable.',
          'This type of example helps separate a simple withdrawal-rate shortcut from a longer cash-flow stress test.',
        ],
      },
      {
        heading: 'What this simplified model does not cover',
        paragraphs: [
          'The example does not model taxes, fees, changing withdrawals, guardrails, required distributions, Social Security timing, or sequence-of-returns volatility.',
          'It is best used as an educational comparison page alongside broader retirement planning tools.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is a sustainable result a guarantee?',
        answer:
          'No. It only means the simplified model kept the portfolio above zero with the stated assumptions. Real retirement paths are more complex.',
      },
      {
        question: 'Why does inflation matter here?',
        answer:
          'Inflation reduces purchasing power, so the model adjusts the nominal return into a real return before judging how durable withdrawals may be.',
      },
      {
        question: 'How is this different from a simple retirement withdrawal calculator?',
        answer:
          'A withdrawal calculator often translates a portfolio into income. A sustainability example goes further by testing whether repeated withdrawals may exhaust the portfolio over time.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Portfolio Withdrawal Sustainability Calculator', url: '/calculators/portfolio-withdrawal-sustainability-calculator/' },
      { name: 'Examples', url: '/calculators/portfolio-withdrawal-sustainability/examples/' },
      { name: title, url: createPortfolioWithdrawalSustainabilityCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Portfolio Withdrawal Sustainability Calculator',
        url: '/calculators/portfolio-withdrawal-sustainability-calculator/',
        description: 'Test your own withdrawal amount, retirement length, and return assumptions.',
      },
      {
        title: 'Retirement Withdrawal Calculator',
        url: '/calculators/retirement-withdrawal-calculator/',
        description: 'Translate a portfolio balance into annual, monthly, and daily withdrawals.',
      },
      {
        title: 'Safe Withdrawal Rate Calculator',
        url: '/calculators/safe-withdrawal-rate-calculator/',
        description: 'Compare spending needs with portfolio size and a planning withdrawal rate.',
      },
    ],
    relatedGuides: [
      {
        title: 'Planning Retirement Withdrawals',
        url: '/guides/retirement-withdrawals/',
        description: 'Explore how inflation, taxes, sequence risk, and flexible spending affect retirement income.',
      },
      {
        title: 'Retirement Planning Guide Hub',
        url: '/guides/retirement/',
        description: 'Browse the broader retirement toolset and worked examples.',
      },
      {
        title: 'A Beginner’s Guide to FIRE',
        url: '/guides/fire/',
        description: 'Connect portfolio targets with sustainable spending assumptions.',
      },
    ],
    calculatorCta: {
      heading: 'Test Your Own Withdrawal Durability',
      description:
        'Use the full calculator to change portfolio size, annual withdrawals, return assumptions, inflation, and retirement length.',
      url: '/calculators/portfolio-withdrawal-sustainability-calculator/',
      label: 'Open the Portfolio Withdrawal Sustainability Calculator',
      examplesUrl: '/calculators/portfolio-withdrawal-sustainability/examples/',
      examplesLabel: 'Browse All Sustainability Examples',
    },
    relatedPagesHeading: 'Related Withdrawal Sustainability Examples',
  };
}

export function auditPortfolioWithdrawalSustainabilitySeoRecords(
  records: PortfolioWithdrawalSustainabilitySeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'portfolio withdrawal sustainability',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.portfolioValue} invested, ${record.annualWithdrawalAmount} annual withdrawals, ${record.years} years, and ${record.expectedAnnualReturnPercent}% return.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createPortfolioWithdrawalSustainabilityCanonicalPath(
          record.slug,
        ),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createPortfolioWithdrawalSustainabilityCanonicalPath,
  });
}
