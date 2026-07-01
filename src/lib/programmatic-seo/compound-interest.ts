import {
  calculateCompoundInterest,
  type CompoundInterestResult,
} from '../math';
import type { CompoundInterestSeoRecord } from '../../data/programmatic-seo/compound-interest';
import { createProgrammaticMetadata } from './metadata';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticCanonicalPath } from './paths';
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
const compoundInterestClusterPath = 'calculators/compound-interest';

export function createCompoundInterestCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(compoundInterestClusterPath, slug);
}

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

type CompoundRateProfile = 'modest' | 'moderate' | 'strong';
type CompoundHorizonProfile = 'short' | 'medium' | 'long';

function compoundRateProfile(record: CompoundInterestSeoRecord): CompoundRateProfile {
  if (record.annualRatePercent <= 6) return 'modest';
  if (record.annualRatePercent <= 10) return 'moderate';
  return 'strong';
}

function compoundHorizonProfile(record: CompoundInterestSeoRecord): CompoundHorizonProfile {
  if (record.years <= 15) return 'short';
  if (record.years <= 25) return 'medium';
  return 'long';
}

function compoundRateFraming(profile: CompoundRateProfile): string {
  switch (profile) {
    case 'modest':
      return 'A more modest assumed rate keeps the projection closer to what conservative, lower-volatility holdings have historically produced.';
    case 'moderate':
      return 'A moderate assumed rate lands in a range often associated with diversified long-term equity portfolios.';
    case 'strong':
      return 'A stronger assumed rate produces a noticeably larger projection, but it is also less conservative than typical long-run historical averages.';
  }
}

function compoundHorizonFraming(profile: CompoundHorizonProfile): string {
  switch (profile) {
    case 'short':
      return 'Over a shorter horizon like this one, the ending balance is driven more by the starting principal than by compounding.';
    case 'medium':
      return 'Over a medium horizon like this one, compounding starts to contribute a substantial share of the ending balance.';
    case 'long':
      return 'Over a longer horizon like this one, compounding usually accounts for the majority of the ending balance rather than the original principal.';
  }
}

function compoundRateSectionFraming(profile: CompoundRateProfile): string {
  switch (profile) {
    case 'modest':
      return 'A more modest rate assumption is a reasonable choice when stress-testing a plan against a more conservative future, rather than assuming the best case holds.';
    case 'moderate':
      return 'A moderate rate assumption is a common middle-ground choice for long-term diversified portfolio projections.';
    case 'strong':
      return 'A stronger rate assumption should be treated as an optimistic case rather than a typical expectation, since sustained high returns are less common over long periods.';
  }
}

function compoundHorizonFaqFraming(profile: CompoundHorizonProfile): string {
  switch (profile) {
    case 'short':
      return 'This time horizon is on the shorter end of what this cluster of examples models, so the principal itself plays a bigger role than compounding.';
    case 'medium':
      return 'This time horizon sits in the middle of what this cluster of examples models.';
    case 'long':
      return 'This time horizon is on the longer end of what this cluster of examples models, so compounding plays a bigger role than the original principal.';
  }
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
    {
      question: `Is ${record.years} years a short or long horizon for this example?`,
      answer: compoundHorizonFaqFraming(compoundHorizonProfile(record)),
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
      url: createCompoundInterestCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.principal)} at ${percentage.format(candidate.annualRatePercent)}% for ${candidate.years} years.`,
    }));
}

function frequencyVariantCalculatorFor(
  record: CompoundInterestSeoRecord,
): ProgrammaticSeoLink {
  switch (record.years % 4) {
    case 1:
      return {
        title: 'Daily Compound Interest Calculator',
        url: '/calculators/daily-compound-interest-calculator/',
        description:
          'Run the same balance and rate with interest compounding daily instead of once a year.',
      };
    case 2:
      return {
        title: 'Monthly Compound Interest Calculator',
        url: '/calculators/monthly-compound-interest-calculator/',
        description:
          'Run the same balance and rate with interest compounding monthly instead of once a year.',
      };
    case 3:
      return {
        title: 'Quarterly Compound Interest Calculator',
        url: '/calculators/quarterly-compound-interest-calculator/',
        description:
          'Run the same balance and rate with interest compounding quarterly instead of once a year.',
      };
    default:
      return {
        title: 'Annual Compound Interest Calculator',
        url: '/calculators/annual-compound-interest-calculator/',
        description:
          "Use a calculator locked to annual compounding if you don't need to change the frequency.",
      };
  }
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
  const rateProfile = compoundRateProfile(record);
  const horizonProfile = compoundHorizonProfile(record);

  return {
    slug: record.slug,
    url: createCompoundInterestCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Compound interest example',
    intro: `This worked example estimates the future value of ${principal} earning a constant ${rate}% annual return for ${record.years} years. It compounds ${frequency} and shows how the balance develops one year at a time. ${compoundRateFraming(rateProfile)} ${compoundHorizonFraming(horizonProfile)}`,
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
          compoundRateSectionFraming(rateProfile),
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
      {
        name: 'Examples',
        url: '/calculators/compound-interest/examples/',
      },
      { name: title, url: createCompoundInterestCanonicalPath(record.slug) },
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
      frequencyVariantCalculatorFor(record),
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

export type CompoundInterestSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditCompoundInterestSeoRecords(
  records: CompoundInterestSeoRecord[],
  expectedCount: number,
): CompoundInterestSeoAuditResult {
  const pages = records.map((record) =>
    createCompoundInterestSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Compound-interest',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createCompoundInterestCanonicalPath,
  });
}
