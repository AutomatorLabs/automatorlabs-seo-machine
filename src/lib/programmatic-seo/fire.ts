import type { FireSeoRecord } from '../../data/programmatic-seo/fire';
import {
  calculateFireNumber,
  calculateWithdrawalIncome,
  calculateWithdrawalPlan,
} from '../math';
import { createProgrammaticMetadata } from './metadata';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
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

const sensitivityRates = [3, 3.5, 4, 4.5, 5];
const fireClusterPath = 'calculators/fire';

export function createFireCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(fireClusterPath, slug);
}

function intentLabel(intent: FireSeoRecord['intent']): string {
  switch (intent) {
    case 'lean-spending-target':
      return 'Lean FIRE spending example';
    case 'regular-spending-target':
      return 'Regular FIRE spending example';
    case 'fat-spending-target':
      return 'Fat FIRE spending example';
    case 'underfunded-portfolio-check':
      return 'Underfunded portfolio check';
    case 'funded-portfolio-check':
      return 'Funded portfolio check';
  }
}

function styleFraming(intent: FireSeoRecord['intent']): string {
  switch (intent) {
    case 'lean-spending-target':
      return 'This spending level is on the leaner end of FIRE planning, which usually means a smaller required portfolio but less cushion for discretionary spending or unexpected costs.';
    case 'regular-spending-target':
      return 'This spending level sits in a common middle range for FIRE planning, balancing portfolio size against day-to-day flexibility.';
    case 'fat-spending-target':
      return 'This spending level is on the higher end of FIRE planning, which requires a larger portfolio but leaves more room for discretionary spending.';
    case 'underfunded-portfolio-check':
    case 'funded-portfolio-check':
      return '';
  }
}

function relatedPages(
  record: FireSeoRecord,
  records: FireSeoRecord[],
): ProgrammaticSeoLink[] {
  const family = (intent: FireSeoRecord['intent']) =>
    intent.endsWith('spending-target') ? 'spending-target' : 'portfolio-check';
  const recordFamily = family(record.intent);

  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.annualSpending - record.annualSpending) /
          Math.max(record.annualSpending, 1) +
        (candidate.intent === record.intent
          ? 0
          : family(candidate.intent) === recordFamily
            ? 0.2
            : 0.6) +
        Math.abs(
          (candidate.portfolioValue ?? 0) - (record.portfolioValue ?? 0),
        ) /
          Math.max(record.portfolioValue ?? 1, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createFireCanonicalPath(candidate.slug),
      description:
        candidate.portfolioValue !== undefined
          ? `${currency.format(candidate.portfolioValue)} portfolio with ${currency.format(candidate.annualSpending)} annual spending.`
          : `${currency.format(candidate.annualSpending)} annual spending at a ${percentage.format(candidate.withdrawalRatePercent)}% planning rate.`,
    }));
}

function createSensitivityTable(record: FireSeoRecord): ProgrammaticSeoTable {
  if (record.portfolioValue !== undefined) {
    const portfolio = record.portfolioValue;

    return {
      heading: 'Withdrawal-Rate Comparison',
      columns: [
        'Withdrawal rate',
        'Annual income supported',
        'Spending assumption',
        'Annual margin',
      ],
      rows: sensitivityRates.map((rate) => {
        const income = calculateWithdrawalIncome(portfolio, rate);

        return {
          label: `${percentage.format(rate)}%`,
          cells: [
            currency.format(income.annualWithdrawal),
            currency.format(record.annualSpending),
            currency.format(income.annualWithdrawal - record.annualSpending),
          ],
        };
      }),
    };
  }

  return {
    heading: 'FIRE Number by Withdrawal Rate',
    columns: ['Withdrawal rate', 'Annual spending', 'Required portfolio'],
    rows: sensitivityRates.map((rate) => ({
      label: `${percentage.format(rate)}%`,
      cells: [
        currency.format(record.annualSpending),
        currency.format(calculateFireNumber(record.annualSpending, rate)),
      ],
    })),
  };
}

function createFaq(
  record: FireSeoRecord,
  fireNumber: number,
  plan: ReturnType<typeof calculateWithdrawalPlan> | null,
) {
  const spending = currency.format(record.annualSpending);
  const rate = `${percentage.format(record.withdrawalRatePercent)}%`;

  const base = [
    {
      question: `What is the FIRE number for ${spending} in annual spending?`,
      answer: `At a ${rate} planning withdrawal rate, the simple FIRE number is ${currency.format(fireNumber)}. This is a starting estimate rather than a guarantee.`,
    },
    {
      question: `How is this FIRE number calculated?`,
      answer: `Annual spending is divided by the withdrawal rate as a decimal. For this example, ${spending} is divided by ${rate}.`,
    },
    {
      question: 'Is the 4% rule guaranteed to work?',
      answer:
        'No. It is a historical planning guideline. Retirement length, asset allocation, fees, taxes, inflation, spending flexibility, and the sequence of returns can change outcomes.',
    },
    {
      question:
        'Should taxes and health care be included in annual spending?',
      answer:
        'Yes, when they are expected to be paid from the portfolio. Include recurring taxes, insurance, health care, housing, and irregular expenses that the retirement plan needs to support.',
    },
    {
      question: 'What happens if I use a lower withdrawal rate?',
      answer:
        'A lower withdrawal rate produces a larger FIRE number for the same spending. It may create more planning margin, but no rate eliminates investment or longevity risk.',
    },
  ];

  if (plan) {
    const isFunded = plan.portfolioGap >= 0;
    base.push({
      question: isFunded
        ? 'What if my portfolio is already above the FIRE number?'
        : 'What if my portfolio is below the FIRE number?',
      answer: isFunded
        ? `A portfolio above the FIRE number, like this one by ${currency.format(plan.portfolioGap)}, suggests the current plan is funded at this withdrawal rate and spending level — though a margin of safety, not a guarantee against market or spending changes, still matters.`
        : `A portfolio below the FIRE number, like this one by ${currency.format(Math.abs(plan.portfolioGap))}, does not mean a plan has failed — it means the gap needs to close through more contributions, more time, lower planned spending, or some combination before this withdrawal rate is comfortably supported.`,
    });
  } else {
    base.push({
      question: `Is ${spending} a lean, regular, or fat FIRE spending level?`,
      answer: styleFraming(record.intent),
    });
  }

  return base;
}

export function createFireSeoPage(
  record: FireSeoRecord,
  records: FireSeoRecord[],
): ProgrammaticSeoPageModel {
  const fireNumber = calculateFireNumber(
    record.annualSpending,
    record.withdrawalRatePercent,
  );
  const spending = currency.format(record.annualSpending);
  const rate = `${percentage.format(record.withdrawalRatePercent)}%`;
  const portfolio = record.portfolioValue ?? 0;
  const plan =
    record.portfolioValue !== undefined
      ? calculateWithdrawalPlan({
          portfolioValue: portfolio,
          withdrawalRatePercent: record.withdrawalRatePercent,
          annualExpenses: record.annualSpending,
        })
      : null;
  const supportedIncome =
    record.portfolioValue !== undefined
      ? calculateWithdrawalIncome(portfolio, record.withdrawalRatePercent)
          .annualWithdrawal
      : 0;
  const isFunded = plan !== null && plan.portfolioGap >= 0;
  const title = record.question;
  const metaDescription =
    plan !== null
      ? `${currency.format(portfolio)} supports about ${currency.format(supportedIncome)} yearly at ${rate}. Compare that with ${spending} spending, the FIRE target, gap, and assumptions.`
      : `${spending} of yearly retirement spending produces a ${currency.format(fireNumber)} FIRE number at ${rate}. Compare withdrawal rates, assumptions, and planning risks.`;
  const metadata = createProgrammaticMetadata({
    title,
    description: metaDescription,
  });

  return {
    slug: record.slug,
    url: createFireCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record.intent),
    intro:
      (plan !== null
        ? `This example compares a ${currency.format(portfolio)} invested portfolio with ${spending} of annual retirement spending using a ${rate} planning withdrawal rate.`
        : `This example estimates the invested portfolio associated with ${spending} of annual retirement spending using a ${rate} planning withdrawal rate.`) +
      (styleFraming(record.intent) ? ` ${styleFraming(record.intent)}` : ''),
    summary:
      plan !== null
        ? isFunded
          ? `At ${rate}, ${currency.format(portfolio)} supports about ${currency.format(supportedIncome)} per year before taxes and fees. The simple FIRE target for ${spending} of spending is ${currency.format(fireNumber)}, so this portfolio is funded — it clears the target by ${currency.format(plan.portfolioGap)}. A funded result is a planning signal, not a guarantee: it does not account for sequence-of-returns risk, taxes, fees, or a spending level that changes after retirement.`
          : `At ${rate}, ${currency.format(portfolio)} supports about ${currency.format(supportedIncome)} per year before taxes and fees. The simple FIRE target for ${spending} of spending is ${currency.format(fireNumber)}, so this portfolio is underfunded — it falls short of the target by ${currency.format(Math.abs(plan.portfolioGap))}. An underfunded result is not a failed plan; it points to a gap that more contributions, more time, or a lower spending target can close before this withdrawal rate is comfortably supported.`
        : `Dividing ${spending} by a ${rate} withdrawal rate gives a simple FIRE number of ${currency.format(fireNumber)}. The result is a planning reference, not a promise that the portfolio will sustain every retirement path.`,
    results:
      plan !== null
        ? [
            {
              label: 'Estimated FIRE number',
              value: currency.format(fireNumber),
              primary: true,
            },
            {
              label: 'Portfolio value',
              value: currency.format(portfolio),
            },
            {
              label: isFunded ? 'Amount above target' : 'Amount below target',
              value: currency.format(Math.abs(plan.portfolioGap)),
            },
            {
              label: `Annual income at ${rate}`,
              value: currency.format(supportedIncome),
            },
          ]
        : [
            {
              label: 'Estimated FIRE number',
              value: currency.format(fireNumber),
              primary: true,
            },
            {
              label: 'Annual spending assumption',
              value: spending,
            },
            {
              label: 'Monthly spending assumption',
              value: currency.format(record.annualSpending / 12),
            },
            {
              label: 'Withdrawal rate',
              value: rate,
            },
          ],
    formula: {
      heading: 'FIRE Number and Withdrawal Rate',
      expression: 'FIRE number = annual spending ÷ withdrawal rate',
      explanation: `The calculation converts ${rate} to a decimal and divides ${spending} of annual spending by that rate.`,
      steps: [
        `Start with estimated annual retirement spending of ${spending}.`,
        `Convert the ${rate} withdrawal rate to ${record.withdrawalRatePercent / 100}.`,
        `Divide ${spending} by ${record.withdrawalRatePercent / 100}.`,
        `Use ${currency.format(fireNumber)} as a starting portfolio estimate, then test taxes, fees, inflation, and different withdrawal rates.`,
      ],
    },
    showChart: false,
    projectionHeading: 'FIRE Planning Comparison',
    projectionRows: [],
    table: createSensitivityTable(record),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Spending assumptions in this example',
        paragraphs: [
          `${spending} is treated as the amount the portfolio must support each year. A useful spending estimate includes housing, food, transportation, insurance, health care, taxes paid from withdrawals, travel, repairs, and irregular expenses.`,
          `The figure should reflect the retirement lifestyle being planned, not automatically current income. Some costs may fall after leaving work while health care, travel, or taxes may rise.`,
        ],
      },
      {
        heading: 'How to interpret the withdrawal-rate comparison',
        paragraphs: [
          `The table above is the core of this example: it shows how the same spending or portfolio holds up across a 3%-5% range of planning withdrawal rates, instead of treating one rate as the only answer.`,
          `Lower rates create larger portfolio targets. Higher rates create smaller targets but generally leave less room for weak returns, high inflation, fees, taxes, or a long retirement.`,
        ],
      },
      {
        heading: 'Important risks and limitations',
        paragraphs: [
          `This simple calculation does not model the order of market returns, changing spending, Social Security, pensions, taxes, investment fees, required distributions, or one-time expenses.`,
          `Use the result to compare scenarios and identify the assumptions that matter. Before relying on a retirement plan, consider a fuller cash-flow and withdrawal analysis.`,
        ],
      },
    ],
    faq: createFaq(record, fireNumber, plan),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'FIRE Calculator', url: '/calculators/fire-calculator/' },
      { name: 'FIRE Examples', url: '/calculators/fire/examples/' },
      { name: title, url: createFireCanonicalPath(record.slug) },
    ],
    relatedPages: relatedPages(record, records),
    relatedPagesHeading: 'Related FIRE Examples',
    relatedCalculators: [
      {
        title: 'FIRE Calculator',
        url: '/calculators/fire-calculator/',
        description:
          'Estimate a FIRE number and accumulation timeline using your assets, contributions, and return assumption.',
      },
      {
        title: 'Safe Withdrawal Rate Calculator',
        url: '/calculators/safe-withdrawal-rate-calculator/',
        description:
          'Compare portfolio withdrawals with annual spending and planning rates.',
      },
      {
        title: 'Coast FIRE Calculator',
        url: '/calculators/coast-fire-calculator/',
        description:
          'Estimate whether current investments could grow toward a later FIRE target.',
      },
      {
        title: 'Lean FIRE Calculator',
        url: '/calculators/lean-fire-calculator/',
        description:
          'Estimate a lean-spending FIRE portfolio target, remaining amount, and potential date.',
      },
      {
        title: 'Fat FIRE Calculator',
        url: '/calculators/fat-fire-calculator/',
        description:
          'Estimate a higher-spending FIRE portfolio target, remaining amount, and potential date.',
      },
    ],
    relatedGuides: [
      {
        title: 'A Beginner\'s Guide to FIRE',
        url: '/guides/fire/',
        description:
          'Connect spending, savings rate, investments, and withdrawal planning.',
      },
      {
        title: 'What Is FIRE?',
        url: '/guides/what-is-fire/',
        description:
          'Review FIRE calculator inputs, outputs, examples, and limitations.',
      },
      {
        title: 'FIRE vs Coast FIRE',
        url: '/guides/fire-vs-coast-fire/',
        description:
          'Compare immediate financial independence with a future coast milestone.',
      },
    ],
    calculatorCta: {
      heading: 'Calculate Your Own FIRE Number',
      description:
        'Use the full calculator to change annual spending, withdrawal rate, current assets, monthly contributions, and expected return.',
      url: '/calculators/fire-calculator/',
      label: 'Open the FIRE Calculator',
      examplesUrl: '/calculators/fire/examples/',
      examplesLabel: 'Browse All FIRE Examples',
    },
  };
}

export type FireSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditFireSeoRecords(
  records: FireSeoRecord[],
  expectedCount: number,
): FireSeoAuditResult {
  const pages = records.map((record) => createFireSeoPage(record, records));

  const result = auditProgrammaticSeoRecords({
    clusterName: 'FIRE',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createFireCanonicalPath,
  });

  const signErrors: string[] = [];
  records.forEach((record) => {
    if (record.portfolioValue === undefined) return;

    const plan = calculateWithdrawalPlan({
      portfolioValue: record.portfolioValue,
      withdrawalRatePercent: record.withdrawalRatePercent,
      annualExpenses: record.annualSpending,
    });

    if (
      record.intent === 'underfunded-portfolio-check' &&
      plan.portfolioGap >= 0
    ) {
      signErrors.push(
        `Expected negative portfolio gap for underfunded-portfolio-check record ${record.slug}, got ${plan.portfolioGap}`,
      );
    }

    if (record.intent === 'funded-portfolio-check' && plan.portfolioGap < 0) {
      signErrors.push(
        `Expected non-negative portfolio gap for funded-portfolio-check record ${record.slug}, got ${plan.portfolioGap}`,
      );
    }
  });

  if (signErrors.length > 0) {
    throw new Error(
      `FIRE programmatic SEO sign-invariant audit failed:\n- ${signErrors.join('\n- ')}`,
    );
  }

  return result;
}
