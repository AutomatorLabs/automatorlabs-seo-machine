import type { RentVsBuySeoRecord } from '../../data/programmatic-seo/rent-vs-buy';
import { calculateRentVsBuy } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoChartPoint,
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
  ProgrammaticSeoProjectionRow,
} from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const wholeCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const clusterPath = 'calculators/rent-vs-buy';

export function createRentVsBuyCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createProjectionRows(
  record: RentVsBuySeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.comparisonYears }, (_, index) => {
    const year = index + 1;
    const result = calculateRentVsBuy({ ...record, comparisonYears: year });

    return {
      period: year,
      contributions: result.totalCostOfRenting,
      growth: result.rentVsBuyDifference,
      endingBalance: result.totalCostOfBuying,
    };
  });
}

function createChartPoints(
  projectionRows: ProgrammaticSeoProjectionRow[],
): ProgrammaticSeoChartPoint[] {
  return projectionRows.map((row) => ({
    period: row.period,
    value: row.growth,
  }));
}

function createRelatedPages(
  record: RentVsBuySeoRecord,
  records: RentVsBuySeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.homePurchasePrice - record.homePurchasePrice) /
          Math.max(record.homePurchasePrice, 1) +
        Math.abs(candidate.monthlyRent - record.monthlyRent) /
          Math.max(record.monthlyRent, 1) +
        Math.abs(candidate.comparisonYears - record.comparisonYears) /
          Math.max(record.comparisonYears, 1) +
        Math.abs(
          candidate.mortgageInterestRatePercent -
            record.mortgageInterestRatePercent,
        ) / 10,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createRentVsBuyCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.homePurchasePrice)} home, ${wholeCurrency.format(candidate.monthlyRent)}/mo rent, ${candidate.comparisonYears}-year horizon.`,
    }));
}

export function createRentVsBuySeoPage(
  record: RentVsBuySeoRecord,
  records: RentVsBuySeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateRentVsBuy(record);
  const projectionRows = createProjectionRows(record);
  const betterOptionLabel =
    result.betterOption === 'equal'
      ? 'about equal'
      : result.betterOption === 'buy'
        ? 'cheaper to buy'
        : 'cheaper to rent';
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${record.scenarioLabel} rent-vs-buy scenario: renting at ${wholeCurrency.format(record.monthlyRent)}/mo versus buying a ${wholeCurrency.format(record.homePurchasePrice)} home over ${record.comparisonYears} years is estimated to be ${betterOptionLabel}, a difference of about ${currency.format(Math.abs(result.rentVsBuyDifference))}.`,
  });

  return {
    slug: record.slug,
    url: createRentVsBuyCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Rent vs buy example',
    intro: `This worked example compares renting at ${wholeCurrency.format(record.monthlyRent)} per month with buying a ${wholeCurrency.format(record.homePurchasePrice)} home over ${record.comparisonYears} years, using a ${wholeCurrency.format(record.downPayment)} down payment, a ${record.mortgageInterestRatePercent}% mortgage rate, ${record.propertyTaxRatePercent}% property tax, ${currency.format(record.homeInsurancePerYear)} annual insurance, ${currency.format(record.hoaPerMonth)} monthly HOA, ${record.maintenanceRatePercent}% annual maintenance, ${record.homeAppreciationPercent}% home appreciation, and a ${record.investmentReturnPercent}% alternative investment return on the down payment.`,
    summary:
      result.betterOption === 'equal'
        ? `Under these assumptions, renting and buying cost about the same over ${record.comparisonYears} years, each estimated near ${currency.format(result.totalCostOfBuying)}.`
        : `Under these assumptions, it is estimated to be ${betterOptionLabel} over ${record.comparisonYears} years, by about ${currency.format(Math.abs(result.rentVsBuyDifference))}.`,
    results: [
      {
        label: 'Better option under these assumptions',
        value:
          result.betterOption === 'equal'
            ? 'About equal'
            : result.betterOption === 'buy'
              ? 'Buy'
              : 'Rent',
        primary: true,
      },
      {
        label: 'Total cost of renting',
        value: currency.format(result.totalCostOfRenting),
      },
      {
        label: 'Total cost of buying (net of equity)',
        value: currency.format(result.totalCostOfBuying),
      },
      {
        label: 'Estimated home equity',
        value: currency.format(result.estimatedHomeEquity),
      },
      {
        label: 'Rent vs buy difference',
        value: currency.format(result.rentVsBuyDifference),
      },
    ],
    formula: {
      heading: 'How This Rent vs Buy Example Works',
      expression:
        'Cost of buying = down payment + mortgage payments + taxes + insurance + HOA + maintenance + down-payment opportunity cost − estimated home equity',
      explanation:
        'The page reuses the shared Rent vs Buy Calculator assumptions to compare total renting cost with the net cost of buying, after subtracting the estimated home equity retained at the end of the comparison period.',
      steps: [
        `Total renting cost is ${wholeCurrency.format(record.monthlyRent)} per month for ${record.comparisonYears} years, or ${currency.format(result.totalCostOfRenting)}.`,
        `Buying costs combine the ${wholeCurrency.format(record.downPayment)} down payment, mortgage payments, property taxes, insurance, HOA, and maintenance over the same period.`,
        `The ${record.downPayment > 0 ? `${wholeCurrency.format(record.downPayment)} down payment` : 'down payment'} could have grown at ${record.investmentReturnPercent}% if invested instead, so that foregone growth is added as an opportunity cost.`,
        `Estimated home equity of ${currency.format(result.estimatedHomeEquity)}, based on ${record.homeAppreciationPercent}% annual appreciation, is subtracted to reach a net cost of buying of ${currency.format(result.totalCostOfBuying)}.`,
      ],
    },
    projectionHeading: 'Year-by-Year Rent vs Buy Projection',
    projectionRows,
    table: {
      heading: 'Year-by-Year Rent vs Buy Projection',
      columns: [
        'Year',
        'Cumulative Rent Cost',
        'Cumulative Buy Cost (Net of Equity)',
        'Buy Advantage (Rent − Buy)',
      ],
      rows: projectionRows.map((row) => ({
        label: `Year ${row.period}`,
        cells: [
          currency.format(row.contributions),
          currency.format(row.endingBalance),
          currency.format(row.growth),
        ],
      })),
    },
    chartPoints: createChartPoints(projectionRows),
    chartLabel: `${record.comparisonYears}-year rent vs buy advantage for a ${wholeCurrency.format(record.homePurchasePrice)} home versus ${wholeCurrency.format(record.monthlyRent)}/mo rent`,
    chartHeading: 'Buy Advantage by Year',
    chartDescription:
      'The chart shows the estimated advantage of buying over renting in each year. A positive value means buying is ahead; a negative value means renting is ahead.',
    sections: [
      {
        heading: 'Why home equity is subtracted from buying costs',
        paragraphs: [
          'Home equity is an asset retained after the comparison period, so treating principal payments and appreciation as a pure expense would overstate the true cost of buying.',
          'This example nets out estimated home equity, which is why the "total cost of buying" figure can end up lower than the sum of every individual ownership cost.',
        ],
      },
      {
        heading: 'How to use this example',
        paragraphs: [
          'Treat this result as a planning baseline, not a certainty. Home prices, rents, and investment returns can all move in ways this fixed-assumption model does not capture.',
          'Use the full calculator if you need to test a different home price, rent, down payment, rate, or time horizon.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this example assume rent stays the same every year?',
        answer:
          'Yes. This example holds the monthly rent fixed for the full comparison period rather than modeling rent inflation.',
      },
      {
        question: 'Does property tax grow with home appreciation in this example?',
        answer:
          'No. Property tax is modeled as a fixed percentage of the original purchase price each year, not the appreciated value.',
      },
      {
        question: 'Why does the down payment opportunity cost matter?',
        answer:
          'Money used for a down payment cannot also be invested elsewhere. This example estimates what that money could have grown to at the entered investment return and counts the foregone growth as a cost of buying.',
      },
      {
        question: 'Does this include selling costs if the home is sold at the end of the period?',
        answer:
          'No. This example estimates ongoing costs and ending equity, not the transaction costs of a future sale.',
      },
      {
        question: `What does this ${record.scenarioLabel.replace(/-/g, ' ')} scenario emphasize?`,
        answer:
          record.intent === 'short-hold'
            ? 'A short comparison horizon like this one means less time for mortgage principal and home appreciation to build equity, which often favors renting.'
            : record.intent === 'long-hold'
              ? 'A longer comparison horizon like this one gives home equity more time to build through principal payments and appreciation, which often favors buying.'
              : record.intent === 'high-cost-metro'
                ? 'A higher-priced market like this one carries larger absolute ownership costs, including property tax, insurance, and HOA dues.'
                : record.intent === 'high-rent-market'
                  ? 'A market where rent is high relative to the home price like this one tends to favor buying sooner than a market with proportionally lower rent.'
                  : 'A starter-home price range like this one uses a smaller down payment and more typical ownership cost assumptions.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Rent vs Buy Calculator',
        url: '/calculators/rent-vs-buy-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/rent-vs-buy/examples/',
      },
      { name: record.question, url: createRentVsBuyCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Rent vs Buy Examples',
    relatedCalculators: [
      {
        title: 'Rent vs Buy Calculator',
        url: '/calculators/rent-vs-buy-calculator/',
        description:
          'Change the home price, rent, down payment, rate, and time horizon.',
      },
      {
        title: 'Home Affordability Calculator',
        url: '/calculators/home-affordability-calculator/',
        description:
          'Check whether a purchase price fits your income and debt before comparing it with renting.',
      },
      {
        title: 'Closing Cost Calculator',
        url: '/calculators/closing-cost-calculator/',
        description:
          'Estimate the upfront cash needed to close, which this example does not include.',
      },
    ],
    relatedGuides: [
      {
        title: 'Rent vs Buy: How to Compare the Real Cost',
        url: '/guides/rent-vs-buy/',
        description:
          'Read the full walkthrough of mortgage costs, taxes, maintenance, equity, and opportunity cost behind this comparison.',
      },
      {
        title: 'A Practical Guide to Buying a Home',
        url: '/guides/home-buying/',
        description:
          'See renting-versus-buying in the context of a broader home-purchase plan.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Rent vs Buy Scenario',
      description:
        'Use the calculator to change the home price, rent, down payment, rate, and time horizon.',
      url: '/calculators/rent-vs-buy-calculator/',
      label: 'Open the Rent vs Buy Calculator',
      examplesUrl: '/calculators/rent-vs-buy/examples/',
      examplesLabel: 'Browse All Rent vs Buy Examples',
    },
  };
}

export function auditRentVsBuySeoRecords(
  records: RentVsBuySeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'rent vs buy',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.scenarioLabel} scenario. ${record.question} using ${record.homePurchasePrice} home price, ${record.monthlyRent} monthly rent, ${record.mortgageInterestRatePercent}% rate, and ${record.comparisonYears} years.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createRentVsBuyCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createRentVsBuyCanonicalPath,
  });
}
