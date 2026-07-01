export type TraditionalVsRoth401kSeoIntent =
  | 'rising-earner'
  | 'peak-earner'
  | 'equal-bracket'
  | 'long-horizon-compounding'
  | 'catch-up-contributor';

export interface TraditionalVsRoth401kSeoRecord {
  slug: string;
  question: string;
  intent: TraditionalVsRoth401kSeoIntent;
  annualContribution: number;
  currentTaxRatePercent: number;
  retirementTaxRatePercent: number;
  expectedAnnualReturnPercent: number;
  years: number;
  scenarioLabel: string;
}

export const EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function record(
  intent: TraditionalVsRoth401kSeoIntent,
  question: string,
  scenarioLabel: string,
  annualContribution: number,
  currentTaxRatePercent: number,
  retirementTaxRatePercent: number,
  expectedAnnualReturnPercent: number,
  years: number,
): TraditionalVsRoth401kSeoRecord {
  return {
    slug: `${intent}-contribute-${annualContribution}-current-${currentTaxRatePercent}-retirement-${retirementTaxRatePercent}-return-${expectedAnnualReturnPercent}-years-${years}`,
    question,
    intent,
    annualContribution,
    currentTaxRatePercent,
    retirementTaxRatePercent,
    expectedAnnualReturnPercent,
    years,
    scenarioLabel,
  };
}

// Intent 1: rising-earner — current tax rate is always below the retirement
// tax rate, so Roth always wins under these assumptions.
const risingEarnerAmounts = [3000, 6000, 9000, 12000, 15000];
const risingEarnerBundles = [
  { currentTaxRatePercent: 12, retirementTaxRatePercent: 22, expectedAnnualReturnPercent: 6, years: 20 },
  { currentTaxRatePercent: 12, retirementTaxRatePercent: 24, expectedAnnualReturnPercent: 7, years: 25 },
  { currentTaxRatePercent: 12, retirementTaxRatePercent: 32, expectedAnnualReturnPercent: 6, years: 15 },
  { currentTaxRatePercent: 22, retirementTaxRatePercent: 24, expectedAnnualReturnPercent: 7, years: 20 },
  { currentTaxRatePercent: 22, retirementTaxRatePercent: 32, expectedAnnualReturnPercent: 6, years: 25 },
  { currentTaxRatePercent: 22, retirementTaxRatePercent: 35, expectedAnnualReturnPercent: 7, years: 15 },
  { currentTaxRatePercent: 12, retirementTaxRatePercent: 22, expectedAnnualReturnPercent: 8, years: 30 },
  { currentTaxRatePercent: 22, retirementTaxRatePercent: 24, expectedAnnualReturnPercent: 6, years: 10 },
];

// Intent 2: peak-earner — current tax rate is always above the retirement
// tax rate, so Traditional always wins under these assumptions.
const peakEarnerAmounts = [8000, 12000, 16000, 20000, 23000];
const peakEarnerBundles = [
  { currentTaxRatePercent: 32, retirementTaxRatePercent: 22, expectedAnnualReturnPercent: 6, years: 15 },
  { currentTaxRatePercent: 35, retirementTaxRatePercent: 24, expectedAnnualReturnPercent: 7, years: 20 },
  { currentTaxRatePercent: 37, retirementTaxRatePercent: 24, expectedAnnualReturnPercent: 6, years: 10 },
  { currentTaxRatePercent: 24, retirementTaxRatePercent: 12, expectedAnnualReturnPercent: 7, years: 25 },
  { currentTaxRatePercent: 32, retirementTaxRatePercent: 12, expectedAnnualReturnPercent: 6, years: 20 },
  { currentTaxRatePercent: 35, retirementTaxRatePercent: 22, expectedAnnualReturnPercent: 7, years: 15 },
  { currentTaxRatePercent: 24, retirementTaxRatePercent: 22, expectedAnnualReturnPercent: 6, years: 10 },
  { currentTaxRatePercent: 37, retirementTaxRatePercent: 32, expectedAnnualReturnPercent: 7, years: 25 },
];

// Intent 3: equal-bracket — current and retirement tax rates are equal, so
// the modeled comparison is always a tie ("equivalent under these
// assumptions").
const equalBracketAmounts = [4000, 7000, 10000, 13000, 17000];
const equalBracketBundles = [
  { ratePercent: 12, expectedAnnualReturnPercent: 6, years: 10 },
  { ratePercent: 12, expectedAnnualReturnPercent: 7, years: 20 },
  { ratePercent: 22, expectedAnnualReturnPercent: 6, years: 15 },
  { ratePercent: 22, expectedAnnualReturnPercent: 7, years: 25 },
  { ratePercent: 24, expectedAnnualReturnPercent: 6, years: 20 },
  { ratePercent: 24, expectedAnnualReturnPercent: 8, years: 30 },
  { ratePercent: 32, expectedAnnualReturnPercent: 7, years: 15 },
  { ratePercent: 35, expectedAnnualReturnPercent: 6, years: 10 },
];

// Intent 4: long-horizon-compounding — fixed Roth-favorable gap (12% now,
// 24% in retirement); years spans 10-40 to show the gap widening with time.
const LONG_HORIZON_CURRENT_RATE = 12;
const LONG_HORIZON_RETIREMENT_RATE = 24;
const longHorizonAmounts = [5000, 8000, 11000, 14000, 18000];
const longHorizonBundles = [
  { years: 10, expectedAnnualReturnPercent: 6 },
  { years: 15, expectedAnnualReturnPercent: 6 },
  { years: 20, expectedAnnualReturnPercent: 7 },
  { years: 25, expectedAnnualReturnPercent: 7 },
  { years: 30, expectedAnnualReturnPercent: 7 },
  { years: 35, expectedAnnualReturnPercent: 8 },
  { years: 40, expectedAnnualReturnPercent: 8 },
  { years: 20, expectedAnnualReturnPercent: 5 },
];

// Intent 5: catch-up-contributor — fixed Traditional-favorable gap (32% now,
// 22% in retirement); larger, catch-up-eligible contributions and a short
// years-to-retirement horizon.
const CATCH_UP_CURRENT_RATE = 32;
const CATCH_UP_RETIREMENT_RATE = 22;
const catchUpAmounts = [20000, 24000, 27000, 30000, 34000];
const catchUpBundles = [
  { years: 3, expectedAnnualReturnPercent: 5 },
  { years: 5, expectedAnnualReturnPercent: 6 },
  { years: 7, expectedAnnualReturnPercent: 6 },
  { years: 10, expectedAnnualReturnPercent: 6 },
  { years: 12, expectedAnnualReturnPercent: 7 },
  { years: 15, expectedAnnualReturnPercent: 7 },
  { years: 8, expectedAnnualReturnPercent: 5 },
  { years: 4, expectedAnnualReturnPercent: 6 },
];

export const traditionalVsRoth401kSeoRecords: TraditionalVsRoth401kSeoRecord[] = [
  ...risingEarnerAmounts.flatMap((annualContribution) =>
    risingEarnerBundles.map((bundle) =>
      record(
        'rising-earner',
        `Rising Earner 401(k) Choice: ${money(annualContribution)}/Year at ${bundle.currentTaxRatePercent}% Now vs ${bundle.retirementTaxRatePercent}% Later, ${bundle.expectedAnnualReturnPercent}% Return Over ${bundle.years} Years`,
        'rising earner',
        annualContribution,
        bundle.currentTaxRatePercent,
        bundle.retirementTaxRatePercent,
        bundle.expectedAnnualReturnPercent,
        bundle.years,
      ),
    ),
  ),
  ...peakEarnerAmounts.flatMap((annualContribution) =>
    peakEarnerBundles.map((bundle) =>
      record(
        'peak-earner',
        `Peak-Earner 401(k) Choice: ${money(annualContribution)}/Year at ${bundle.currentTaxRatePercent}% Now vs ${bundle.retirementTaxRatePercent}% Later, ${bundle.expectedAnnualReturnPercent}% Return Over ${bundle.years} Years`,
        'peak earner',
        annualContribution,
        bundle.currentTaxRatePercent,
        bundle.retirementTaxRatePercent,
        bundle.expectedAnnualReturnPercent,
        bundle.years,
      ),
    ),
  ),
  ...equalBracketAmounts.flatMap((annualContribution) =>
    equalBracketBundles.map((bundle) =>
      record(
        'equal-bracket',
        `Same Tax Bracket 401(k) Choice: ${money(annualContribution)}/Year at ${bundle.ratePercent}% Now and Later, ${bundle.expectedAnnualReturnPercent}% Return Over ${bundle.years} Years`,
        'equal tax bracket',
        annualContribution,
        bundle.ratePercent,
        bundle.ratePercent,
        bundle.expectedAnnualReturnPercent,
        bundle.years,
      ),
    ),
  ),
  ...longHorizonAmounts.flatMap((annualContribution) =>
    longHorizonBundles.map((bundle) =>
      record(
        'long-horizon-compounding',
        `Long-Horizon 401(k) Choice: ${money(annualContribution)}/Year at ${LONG_HORIZON_CURRENT_RATE}% Now vs ${LONG_HORIZON_RETIREMENT_RATE}% Later, ${bundle.expectedAnnualReturnPercent}% Return Over ${bundle.years} Years`,
        'long-horizon compounding',
        annualContribution,
        LONG_HORIZON_CURRENT_RATE,
        LONG_HORIZON_RETIREMENT_RATE,
        bundle.expectedAnnualReturnPercent,
        bundle.years,
      ),
    ),
  ),
  ...catchUpAmounts.flatMap((annualContribution) =>
    catchUpBundles.map((bundle) =>
      record(
        'catch-up-contributor',
        `Catch-Up 401(k) Choice: ${money(annualContribution)}/Year at ${CATCH_UP_CURRENT_RATE}% Now vs ${CATCH_UP_RETIREMENT_RATE}% Later, ${bundle.expectedAnnualReturnPercent}% Return Over ${bundle.years} Years`,
        'catch-up contributor',
        annualContribution,
        CATCH_UP_CURRENT_RATE,
        CATCH_UP_RETIREMENT_RATE,
        bundle.expectedAnnualReturnPercent,
        bundle.years,
      ),
    ),
  ),
];

export const featuredTraditionalVsRoth401kSeoRecords =
  traditionalVsRoth401kSeoRecords.filter((record) =>
    [
      'rising-earner-contribute-9000-current-12-retirement-22-return-6-years-20',
      'peak-earner-contribute-16000-current-32-retirement-22-return-6-years-15',
    ].includes(record.slug),
  );
