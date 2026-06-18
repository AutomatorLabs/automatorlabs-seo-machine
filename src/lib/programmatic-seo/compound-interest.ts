import {
  calculateCompoundInterest,
  type CompoundInterestResult,
} from '../math';
import type { CompoundInterestSeoRecord } from '../../data/programmatic-seo/compound-interest';
import { createProgrammaticMetadata } from './metadata';
import type {
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

const percentage = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

export function createCompoundInterestProjection(
  record: CompoundInterestSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const result = calculateCompoundInterest({
      principal: record.principal,
      monthlyContribution: record.monthlyContribution,
      annualRatePercent: record.annualRatePercent,
      years: period,
      periodsPerYear: record.periodsPerYear,
    });

    return {
      period,
      contributions: result.totalContributions,
      growth: result.totalInterest,
      endingBalance: result.finalBalance,
    };
  });
}

function frequencyLabel(periodsPerYear: number): string {
  if (periodsPerYear === 12) return 'monthly';
  if (periodsPerYear === 4) return 'quarterly';
  return 'annually';
}

function resultSummary(
  record: CompoundInterestSeoRecord,
  result: CompoundInterestResult,
): string {
  const contributionText =
    record.monthlyContribution > 0
      ? ` and ${wholeCurrency.format(record.monthlyContribution)} added each month`
      : ' and no additional contributions';

  return `${wholeCurrency.format(record.principal)} growing at ${percentage.format(record.annualRatePercent)}% for ${record.years} years${contributionText} reaches approximately ${currency.format(result.finalBalance)} when compounded ${frequencyLabel(record.periodsPerYear)}. Of that amount, ${currency.format(result.totalInterest)} is growth above the money contributed.`;
}

function createFaq(
  record: CompoundInterestSeoRecord,
  result: CompoundInterestResult,
) {
  const frequency = frequencyLabel(record.periodsPerYear);
  const principal = wholeCurrency.format(record.principal);
  const rate = `${percentage.format(record.annualRatePercent)}%`;

  return [
    {
      question: `How much does ${principal} become at ${rate} after ${record.years} years?`,
      answer: `Under the assumptions on this page, it becomes approximately ${currency.format(result.finalBalance)} when compounded ${frequency} with ${record.monthlyContribution > 0 ? `${wholeCurrency.format(record.monthlyContribution)} monthly contributions` : 'no additional contributions'}.`,
    },
    {
      question: `How much compound interest is earned in this example?`,
      answer: `The estimated growth above total contributions is ${currency.format(result.totalInterest)}. This is a mathematical projection using a constant rate, not a guaranteed investment return.`,
    },
    {
      question: `Does the ${rate} return stay constant in real investments?`,
      answer: `Not necessarily. Market returns vary and can be negative. The fixed rate is useful for understanding the compound-interest relationship and comparing scenarios.`,
    },
    {
      question: 'Does this result account for inflation, taxes, or fees?',
      answer: 'No. The projection is nominal and excludes inflation, taxes, investment fees, and transaction costs. Those factors can reduce the value retained or its future purchasing power.',
    },
    {
      question: 'What happens if the rate or time period changes?',
      answer: `A higher rate or longer period generally increases the result because growth has more opportunities to compound. Use the main Compound Interest Calculator to test different assumptions.`,
    },
  ];
}

function createRelatedPages(
  record: CompoundInterestSeoRecord,
  records: CompoundInterestSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      record: candidate,
      score:
        Math.abs(candidate.principal - record.principal) /
          Math.max(record.principal, 1) +
        Math.abs(candidate.annualRatePercent - record.annualRatePercent) / 10 +
        Math.abs(candidate.years - record.years) / 40,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ record: candidate }) => ({
      title: candidate.question,
      url: `/calculators/compound-interest/${candidate.slug}/`,
      description: `${wholeCurrency.format(candidate.principal)} at ${percentage.format(candidate.annualRatePercent)}% for ${candidate.years} years.`,
    }));
}

export function createCompoundInterestSeoPage(
  record: CompoundInterestSeoRecord,
  records: CompoundInterestSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateCompoundInterest({
    principal: record.principal,
    monthlyContribution: record.monthlyContribution,
    annualRatePercent: record.annualRatePercent,
    years: record.years,
    periodsPerYear: record.periodsPerYear,
  });
  const projectionRows = createCompoundInterestProjection(record);
  const rate = percentage.format(record.annualRatePercent);
  const principal = wholeCurrency.format(record.principal);
  const frequency = frequencyLabel(record.periodsPerYear);
  const title = record.question;
  const metaDescription = `${principal} at ${rate}% for ${record.years} years grows to about ${currency.format(result.finalBalance)}. See the formula, annual projection, chart, interest earned, and assumptions.`;
  const metadata = createProgrammaticMetadata({
    title,
    description: metaDescription,
  });
  const contributionDescription =
    record.monthlyContribution > 0
      ? `${wholeCurrency.format(record.monthlyContribution)} is added at the end of each month.`
      : 'No additional deposits or withdrawals are included.';

  return {
    slug: record.slug,
    url: `/calculators/compound-interest/${record.slug}/`,
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Compound interest example',
    intro: `This worked example estimates the future value of ${principal} earning a constant ${rate}% annual return for ${record.years} years. It compounds ${frequency} and shows how the balance develops one year at a time.`,
    summary: resultSummary(record, result),
    results: [
      {
        label: 'Estimated ending balance',
        value: currency.format(result.finalBalance),
        primary: true,
      },
      {
        label: 'Total contributions',
        value: currency.format(result.totalContributions),
      },
      {
        label: 'Estimated compound growth',
        value: currency.format(result.totalInterest),
      },
    ],
    formula: {
      expression: 'A = P(1 + r / n)^(nt) + contribution growth',
      explanation: `The formula compounds the principal at ${rate}% across ${record.periodsPerYear} period${record.periodsPerYear === 1 ? '' : 's'} per year. ${contributionDescription}`,
      steps: [
        `Start with principal P = ${currency.format(record.principal)}.`,
        `Convert ${rate}% to a decimal and divide it across ${record.periodsPerYear} compounding period${record.periodsPerYear === 1 ? '' : 's'} per year.`,
        `Apply that periodic rate for ${record.years * record.periodsPerYear} total periods.`,
        `Separate total contributions from the final balance to find ${currency.format(result.totalInterest)} of estimated growth.`,
      ],
    },
    projectionHeading: 'Year-by-Year Projection',
    projectionRows,
    chartPoints: [
      { period: 0, value: record.principal },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    sections: [
      {
        heading: 'What this result means',
        paragraphs: [
          `The account begins with ${principal} and ends at an estimated ${currency.format(result.finalBalance)}. The difference is not created all at once. Early growth is relatively modest, while later years benefit from a larger balance earning the same assumed rate.`,
          `The projection uses a smooth ${rate}% rate to make the compounding relationship easy to inspect. A real investment would usually follow an uneven path, and the actual ending value could be higher or lower.`,
        ],
      },
      {
        heading: 'Assumptions behind the estimate',
        paragraphs: [
          `${contributionDescription} The annual return remains fixed, interest is reinvested, and the rate compounds ${frequency}. The calculation does not include taxes, fees, inflation, or investment losses.`,
          `Because this is a nominal projection, ${currency.format(result.finalBalance)} represents future dollars. Its purchasing power may be lower after inflation. The related inflation and real-return tools can add that context.`,
        ],
      },
      {
        heading: 'How to use this example',
        paragraphs: [
          `Use this page as a reference point, then change one assumption at a time in the main calculator. Comparing ${rate}% with a lower rate shows return sensitivity, while changing ${record.years} years shows how strongly time influences compound growth.`,
          `Do not treat the result as a promise or target recommendation. It is most useful for understanding the formula, checking a scenario, and framing better questions about contributions, risk, fees, and purchasing power.`,
        ],
      },
    ],
    faq: createFaq(record, result),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Compound Interest Calculator',
        url: '/calculators/compound-interest/',
      },
      { name: title, url: `/calculators/compound-interest/${record.slug}/` },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Compound Interest Calculator',
        url: '/calculators/compound-interest/',
        description: 'Change the principal, contribution, rate, time, and compounding frequency.',
      },
      {
        title: 'Inflation Calculator',
        url: '/calculators/inflation-calculator/',
        description: 'Estimate how inflation changes future purchasing power.',
      },
      {
        title: 'CAGR Calculator',
        url: '/calculators/cagr-calculator/',
        description: 'Measure the annualized growth between a starting and ending value.',
      },
    ],
    relatedGuides: [
      {
        title: 'What Is Compound Interest?',
        url: '/guides/what-is-compound-interest/',
        description: 'Learn how principal, rates, contributions, and time work together.',
      },
      {
        title: 'CAGR vs Compound Interest',
        url: '/guides/cagr-vs-compound-interest/',
        description: 'Compare a growth measurement with the compounding process.',
      },
      {
        title: 'How Inflation Affects Compound Interest',
        url: '/guides/inflation-and-compound-interest/',
        description: 'Put nominal account growth into purchasing-power context.',
      },
    ],
    chartLabel: `${principal} compound-interest projection at ${rate}% for ${record.years} years`,
  };
}
