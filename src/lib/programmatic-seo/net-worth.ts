import type { NetWorthSeoRecord } from '../../data/programmatic-seo/net-worth';
import { calculateNetWorth } from '../math';
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

const percentage = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const clusterPath = 'calculators/net-worth';

export function createNetWorthCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function intentLabel(record: NetWorthSeoRecord): string {
  switch (record.intent) {
    case 'young-professional':
      return 'Young professional net worth example';
    case 'new-homeowner':
      return 'New homeowner net worth example';
    case 'debt-free-saver':
      return 'Debt-free saver net worth example';
    case 'high-net-worth-investor':
      return 'High-net-worth investor net worth example';
    case 'underwater-household':
      return 'Underwater household net worth example';
  }
}

function computeResult(record: NetWorthSeoRecord) {
  return calculateNetWorth({
    assets: [record.cash, record.investments, record.realEstate, record.crypto, 0],
    liabilities: [record.creditCardDebt, record.loans, record.mortgage, 0],
  });
}

function createRelatedPages(
  record: NetWorthSeoRecord,
  records: NetWorthSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.cash - record.cash) / Math.max(record.cash || 1, 1) +
        Math.abs(candidate.investments - record.investments) /
          Math.max(record.investments || 1, 1) +
        Math.abs(candidate.realEstate - record.realEstate) /
          Math.max(record.realEstate || 1, 1) +
        Math.abs(candidate.crypto - record.crypto) /
          Math.max(record.crypto || 1, 1) +
        Math.abs(candidate.creditCardDebt - record.creditCardDebt) /
          Math.max(record.creditCardDebt || 1, 1) +
        Math.abs(candidate.loans - record.loans) /
          Math.max(record.loans || 1, 1) +
        Math.abs(candidate.mortgage - record.mortgage) /
          Math.max(record.mortgage || 1, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createNetWorthCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.cash)} cash, ${currency.format(candidate.investments)} investments, ${currency.format(candidate.realEstate)} real estate against ${currency.format(candidate.creditCardDebt)} credit card debt, ${currency.format(candidate.loans)} loans, ${currency.format(candidate.mortgage)} mortgage.`,
    }));
}

export function createNetWorthSeoPage(
  record: NetWorthSeoRecord,
  records: NetWorthSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = computeResult(record);
  const isPositive = result.netWorth >= 0;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `A ${record.scenarioLabel} scenario: ${currency.format(record.cash)} cash, ${currency.format(record.investments)} investments, ${currency.format(record.realEstate)} real estate, and ${currency.format(record.crypto)} crypto against ${currency.format(record.creditCardDebt)} credit card debt, ${currency.format(record.loans)} loans, and ${currency.format(record.mortgage)} mortgage nets to ${currency.format(result.netWorth)} net worth.`,
  });

  return {
    slug: record.slug,
    url: createNetWorthCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the Net Worth Calculator assumptions to show a ${record.scenarioLabel} snapshot: ${currency.format(record.cash)} cash, ${currency.format(record.investments)} investments, ${currency.format(record.realEstate)} real estate, and ${currency.format(record.crypto)} crypto, against ${currency.format(record.creditCardDebt)} credit card debt, ${currency.format(record.loans)} loans, and ${currency.format(record.mortgage)} mortgage.`,
    summary: isPositive
      ? `Under these ${record.scenarioLabel} assumptions, total assets of ${currency.format(result.totalAssets)} exceed total liabilities of ${currency.format(result.totalLiabilities)}, for a positive net worth of ${currency.format(result.netWorth)}.`
      : `Under these ${record.scenarioLabel} assumptions, total liabilities of ${currency.format(result.totalLiabilities)} exceed total assets of ${currency.format(result.totalAssets)}, for a negative net worth of ${currency.format(Math.abs(result.netWorth))}.`,
    results: [
      {
        label: 'Net worth',
        value: currency.format(result.netWorth),
        primary: true,
      },
      {
        label: 'Total assets',
        value: currency.format(result.totalAssets),
      },
      {
        label: 'Total liabilities',
        value: currency.format(result.totalLiabilities),
      },
      {
        label: 'Debt-to-asset ratio',
        value: `${percentage.format(result.debtToAssetRatio)}%`,
      },
    ],
    formula: {
      heading: 'How This Net Worth Snapshot Works',
      expression:
        'Net worth = total assets − total liabilities; debt-to-asset ratio = total liabilities ÷ total assets',
      explanation: `The page reuses the shared Net Worth Calculator assumptions. It adds ${currency.format(record.cash)} cash, ${currency.format(record.investments)} investments, ${currency.format(record.realEstate)} real estate, and ${currency.format(record.crypto)} crypto to reach total assets, then adds ${currency.format(record.creditCardDebt)} credit card debt, ${currency.format(record.loans)} loans, and ${currency.format(record.mortgage)} mortgage to reach total liabilities.`,
      steps: [
        `Add the asset amounts: ${currency.format(record.cash)} cash + ${currency.format(record.investments)} investments + ${currency.format(record.realEstate)} real estate + ${currency.format(record.crypto)} crypto = ${currency.format(result.totalAssets)} total assets.`,
        `Add the liability amounts: ${currency.format(record.creditCardDebt)} credit card debt + ${currency.format(record.loans)} loans + ${currency.format(record.mortgage)} mortgage = ${currency.format(result.totalLiabilities)} total liabilities.`,
        `Subtract: ${currency.format(result.totalAssets)} − ${currency.format(result.totalLiabilities)} = ${currency.format(result.netWorth)} net worth.`,
        `Divide liabilities by assets to reach a ${percentage.format(result.debtToAssetRatio)}% debt-to-asset ratio.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Scenario Summary',
    projectionRows: [],
    table: {
      heading: 'Scenario Summary',
      columns: ['Metric', 'Value'],
      rows: [
        { label: 'Cash', cells: [currency.format(record.cash)] },
        { label: 'Investments', cells: [currency.format(record.investments)] },
        { label: 'Real estate', cells: [currency.format(record.realEstate)] },
        { label: 'Crypto', cells: [currency.format(record.crypto)] },
        { label: 'Credit card debt', cells: [currency.format(record.creditCardDebt)] },
        { label: 'Loans', cells: [currency.format(record.loans)] },
        { label: 'Mortgage', cells: [currency.format(record.mortgage)] },
        { label: 'Total assets', cells: [currency.format(result.totalAssets)] },
        { label: 'Total liabilities', cells: [currency.format(result.totalLiabilities)] },
        { label: 'Net worth', cells: [currency.format(result.netWorth)] },
        { label: 'Debt-to-asset ratio', cells: [`${percentage.format(result.debtToAssetRatio)}%`] },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This scenario isolates the math behind a ${record.scenarioLabel} net worth snapshot. The result reflects the assets and liabilities entered, not investment growth or debt paydown over time — net worth is a point-in-time measurement, not a projection.`,
          isPositive
            ? `Because total assets exceed total liabilities here, the household has a positive net worth cushion under these assumptions.`
            : `Because total liabilities exceed total assets here, the household has a negative net worth under these assumptions — a common and recoverable position, not a permanent one.`,
        ],
      },
      {
        heading: 'Assumptions and limitations',
        paragraphs: [
          'The example treats every entered amount as a current-value snapshot: no appreciation, depreciation, interest accrual, or debt paydown is modeled between now and the next time you calculate. Other assets and other liabilities are not modeled in this example.',
          'Net worth is only as accurate as the valuations behind it — use consistent, up-to-date figures (e.g. current account balances, a recent home appraisal or market estimate, current loan payoff amounts) for a meaningful comparison over time.',
        ],
      },
      {
        heading: 'How people use a snapshot like this',
        paragraphs: [
          'Use the result as a single data point, then recalculate on a consistent schedule (monthly, quarterly, or annually) to see the trend rather than one number in isolation.',
          'Comparing the debt-to-asset ratio over time can be as informative as the net worth figure itself — a shrinking ratio generally means debt is falling relative to assets, even before net worth turns positive.',
        ],
      },
    ],
    faq: [
      {
        question: 'What is net worth?',
        answer:
          'Net worth is the value of everything you own minus everything you owe. It provides a broad snapshot of your financial position.',
      },
      {
        question: 'What should I include as an asset?',
        answer: `This ${record.scenarioLabel} example includes ${currency.format(record.cash)} cash, ${currency.format(record.investments)} investments, ${currency.format(record.realEstate)} real estate, and ${currency.format(record.crypto)} crypto. Common assets more broadly include retirement accounts, vehicles, and other property with meaningful resale value.`,
      },
      {
        question: 'Which debts count as liabilities?',
        answer: `This example includes ${currency.format(record.creditCardDebt)} credit card debt, ${currency.format(record.loans)} loans, and ${currency.format(record.mortgage)} mortgage. Common liabilities more broadly include auto loans, taxes owed, and other amounts you are responsible for repaying.`,
      },
      {
        question: 'What does the debt-to-asset ratio show?',
        answer:
          'It shows what percentage of your assets would be offset by liabilities. A lower ratio generally indicates less debt relative to the assets you own.',
      },
      {
        question: 'How often should I calculate my net worth?',
        answer:
          'Reviewing it monthly, quarterly, or annually can help you track progress. Use consistent valuations so changes reflect real financial movement.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Net Worth Calculator', url: '/calculators/net-worth-calculator/' },
      { name: 'Examples', url: '/calculators/net-worth/examples/' },
      { name: title, url: createNetWorthCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Net Worth Examples',
    relatedCalculators: [
      {
        title: 'Net Worth Calculator',
        url: '/calculators/net-worth-calculator/',
        description: 'Change any asset or liability amount to calculate your own net worth.',
      },
      {
        title: 'Savings Rate Calculator',
        url: '/calculators/savings-rate/',
        description: 'See what percentage of income is going toward savings each month.',
      },
      {
        title: 'FIRE Calculator',
        url: '/calculators/fire-calculator/',
        description: 'Project when a growing portfolio could support financial independence.',
      },
      {
        title: 'Investment Fee Calculator',
        url: '/calculators/investment-fee-calculator/',
        description: 'See how fees can affect long-term account growth.',
      },
    ],
    relatedGuides: [
      {
        title: "A Beginner's Guide to FIRE",
        url: '/guides/fire/',
        description: 'See how tracking net worth over time fits into a broader financial independence plan.',
      },
    ],
    calculatorCta: {
      heading: 'Calculate Your Own Net Worth',
      description: 'Open the full calculator to enter your own asset and liability amounts.',
      url: '/calculators/net-worth-calculator/',
      label: 'Open the Net Worth Calculator',
      examplesUrl: '/calculators/net-worth/examples/',
      examplesLabel: 'Browse All Net Worth Examples',
    },
  };
}

export function auditNetWorthSeoRecords(
  records: NetWorthSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) => createNetWorthSeoPage(record, records));

  const result = auditProgrammaticSeoRecords({
    clusterName: 'net worth',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createNetWorthCanonicalPath,
  });

  const signErrors: string[] = [];
  records.forEach((record) => {
    const netWorthResult = computeResult(record);

    if (record.intent === 'underwater-household' && netWorthResult.netWorth >= 0) {
      signErrors.push(
        `Expected negative net worth for underwater-household record ${record.slug}, got ${netWorthResult.netWorth}`,
      );
    }

    if (record.intent === 'debt-free-saver' && netWorthResult.netWorth <= 0) {
      signErrors.push(
        `Expected positive net worth for debt-free-saver record ${record.slug}, got ${netWorthResult.netWorth}`,
      );
    }
  });

  if (signErrors.length > 0) {
    throw new Error(
      `net worth programmatic SEO sign-invariant audit failed:\n- ${signErrors.join('\n- ')}`,
    );
  }

  return result;
}
