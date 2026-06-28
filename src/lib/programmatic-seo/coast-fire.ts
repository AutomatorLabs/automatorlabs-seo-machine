import type { CoastFireSeoRecord } from '../../data/programmatic-seo/coast-fire';
import { calculateCoastFireNumber, calculateFireNumber } from '../math';
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

const clusterPath = 'calculators/coast-fire';

export function createCoastFireCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: CoastFireSeoRecord,
  records: CoastFireSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.currentAge - record.currentAge) +
        Math.abs(candidate.retirementAge - record.retirementAge) +
        Math.abs(
          candidate.currentInvestedAssets - record.currentInvestedAssets,
        ) /
          Math.max(record.currentInvestedAssets, 1) +
        Math.abs(candidate.annualExpenses - record.annualExpenses) /
          Math.max(record.annualExpenses, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createCoastFireCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.currentInvestedAssets)} saved at age ${candidate.currentAge} for ${currency.format(candidate.annualExpenses)} spending at ${candidate.retirementAge}.`,
    }));
}

function createTable(
  record: CoastFireSeoRecord,
  fireNumber: number,
  coastFireNumber: number,
): ProgrammaticSeoTable {
  const retirementWindows = [55, 60, 65, 70];

  return {
    heading: 'Coast FIRE Age Comparison',
    columns: ['Required coast number', 'Gap vs current assets'],
    rows: retirementWindows.map((retirementAge) => {
      const yearsUntilRetirement = retirementAge - record.currentAge;
      const requiredCoastNumber = calculateCoastFireNumber(
        fireNumber,
        record.expectedAnnualReturnPercent,
        yearsUntilRetirement,
      );

      return {
        label: `Retire at age ${retirementAge}`,
        cells: [
          currency.format(requiredCoastNumber),
          currency.format(record.currentInvestedAssets - requiredCoastNumber),
        ],
      };
    }),
  };
}

export function createCoastFireSeoPage(
  record: CoastFireSeoRecord,
  records: CoastFireSeoRecord[],
): ProgrammaticSeoPageModel {
  const fireNumber = calculateFireNumber(
    record.annualExpenses,
    record.withdrawalRatePercent,
  );
  const yearsUntilRetirement = record.retirementAge - record.currentAge;
  const coastFireNumber = calculateCoastFireNumber(
    fireNumber,
    record.expectedAnnualReturnPercent,
    yearsUntilRetirement,
  );
  const gap = record.currentInvestedAssets - coastFireNumber;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.currentInvestedAssets)} saved at age ${record.currentAge} is compared with a ${currency.format(coastFireNumber)} coast FIRE number for age ${record.retirementAge}, ${currency.format(record.annualExpenses)} spending, and ${percentage.format(record.expectedAnnualReturnPercent)}% growth.`,
  });

  return {
    slug: record.slug,
    url: createCoastFireCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Coast FIRE example',
    intro: `This worked example checks whether ${currency.format(record.currentInvestedAssets)} invested at age ${record.currentAge} could grow toward a retirement target by age ${record.retirementAge} without additional required contributions.`,
    summary: `At ${percentage.format(record.withdrawalRatePercent)}% spending support, ${currency.format(record.annualExpenses)} of annual retirement expenses points to a simple FIRE number of ${currency.format(fireNumber)}. Discounted back ${yearsUntilRetirement} years at ${percentage.format(record.expectedAnnualReturnPercent)}%, the coast FIRE threshold is ${currency.format(coastFireNumber)}, so this scenario is ${gap >= 0 ? `${currency.format(gap)} ahead` : `${currency.format(Math.abs(gap))} short`} of the coast target.`,
    results: [
      { label: 'Coast FIRE number', value: currency.format(coastFireNumber), primary: true },
      { label: 'Full FIRE number', value: currency.format(fireNumber) },
      { label: 'Current invested assets', value: currency.format(record.currentInvestedAssets) },
      { label: gap >= 0 ? 'Amount above coast target' : 'Amount below coast target', value: currency.format(Math.abs(gap)) },
    ],
    formula: {
      heading: 'How the Coast FIRE Number Is Estimated',
      expression: 'Coast FIRE number = FIRE number ÷ (1 + return)^years until retirement',
      explanation:
        'The example first estimates the full FIRE number from annual spending, then discounts that target back to today using the expected annual return and years until retirement.',
      steps: [
        `Estimate the full FIRE target from ${currency.format(record.annualExpenses)} of annual spending and a ${percentage.format(record.withdrawalRatePercent)}% withdrawal rate.`,
        `Count ${yearsUntilRetirement} years from age ${record.currentAge} to age ${record.retirementAge}.`,
        `Discount the future FIRE target back at ${percentage.format(record.expectedAnnualReturnPercent)}% annual growth.`,
        `Compare the resulting ${currency.format(coastFireNumber)} coast target with the current ${currency.format(record.currentInvestedAssets)} invested balance.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Coast FIRE Comparison',
    projectionRows: [],
    table: createTable(record, fireNumber, coastFireNumber),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What this coast FIRE example is testing',
        paragraphs: [
          `The question is whether ${currency.format(record.currentInvestedAssets)} already invested could plausibly compound into a future retirement target by age ${record.retirementAge} if contributions slowed or stopped.`,
          'This is a simplified framing tool. Real outcomes depend on taxes, fees, actual returns, spending changes, and whether contributions continue in practice.',
        ],
      },
      {
        heading: 'How spending assumptions change the answer',
        paragraphs: [
          `Annual retirement spending of ${currency.format(record.annualExpenses)} is the main driver of the future FIRE number. Higher spending raises the target and usually makes coast FIRE harder to reach.`,
          'Small changes in the withdrawal rate or retirement age can also change the coast threshold materially because the invested balance has more or less time to compound.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does reaching coast FIRE mean I can stop saving immediately?',
        answer:
          'Not necessarily. Coast FIRE is a planning milestone showing that current invested assets may compound toward a future target. Continuing to save can create more margin and flexibility.',
      },
      {
        question: 'What if my retirement spending estimate changes?',
        answer:
          'The coast threshold should be recalculated. Higher future spending raises the FIRE number and the present-day coast target.',
      },
      {
        question: 'Does this example include taxes or employer retirement plans?',
        answer:
          'No. It uses a simple growth and withdrawal-rate framework. Account type, taxes, employer matches, and asset allocation are not modeled directly here.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Coast FIRE Calculator', url: '/calculators/coast-fire-calculator/' },
      { name: 'Examples', url: '/calculators/coast-fire/examples/' },
      { name: title, url: createCoastFireCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Coast FIRE Calculator',
        url: '/calculators/coast-fire-calculator/',
        description: 'Change ages, spending, return assumptions, and invested assets with your own numbers.',
      },
      {
        title: 'FIRE Calculator',
        url: '/calculators/fire-calculator/',
        description: 'Estimate the full FIRE portfolio target from annual spending and a withdrawal rate.',
      },
      {
        title: 'Years to Retirement Calculator',
        url: '/calculators/years-to-retirement-calculator/',
        description: 'Compare a retirement-age target with a specific portfolio goal and contribution plan.',
      },
    ],
    relatedGuides: [
      {
        title: 'FIRE vs Coast FIRE',
        url: '/guides/fire-vs-coast-fire/',
        description: 'See how Coast FIRE differs from a full FIRE target and when each framework is useful.',
      },
      {
        title: 'A Beginner’s Guide to FIRE',
        url: '/guides/fire/',
        description: 'Connect annual spending, portfolio size, contributions, and withdrawal assumptions.',
      },
      {
        title: 'Retirement Planning Guide Hub',
        url: '/guides/retirement/',
        description: 'Browse retirement calculators, examples, and practical planning guides in one place.',
      },
    ],
    calculatorCta: {
      heading: 'Test Your Own Coast FIRE Inputs',
      description:
        'Use the full calculator to change your age, retirement date, spending target, expected return, and invested balance.',
      url: '/calculators/coast-fire-calculator/',
      label: 'Open the Coast FIRE Calculator',
      examplesUrl: '/calculators/coast-fire/examples/',
      examplesLabel: 'Browse All Coast FIRE Examples',
    },
    relatedPagesHeading: 'Related Coast FIRE Examples',
  };
}

export function auditCoastFireSeoRecords(
  records: CoastFireSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'coast FIRE',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} with ${record.currentInvestedAssets} invested, ${record.annualExpenses} annual expenses, retirement at ${record.retirementAge}, and ${record.expectedAnnualReturnPercent}% growth.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createCoastFireCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createCoastFireCanonicalPath,
  });
}
