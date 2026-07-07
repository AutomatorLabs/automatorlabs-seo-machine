export type CollegeSavings529SeoIntent =
  | 'newborn-saver'
  | 'early-childhood-saver'
  | 'tween-steady-saver'
  | 'high-school-final-stretch'
  | 'catch-up-late-start';

export interface CollegeSavings529SeoRecord {
  slug: string;
  question: string;
  intent: CollegeSavings529SeoIntent;
  currentBalance: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
  yearsUntilCollege: number;
  targetCollegeCost: number;
  scenarioLabel: string;
}

export const EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function record(
  intent: CollegeSavings529SeoIntent,
  label: string,
  scenarioLabel: string,
  currentBalance: number,
  monthlyContribution: number,
  expectedAnnualReturnPercent: number,
  yearsUntilCollege: number,
  targetCollegeCost: number,
): CollegeSavings529SeoRecord {
  return {
    slug: `${intent}-balance-${currentBalance}-contribute-${monthlyContribution}-return-${expectedAnnualReturnPercent}-years-${yearsUntilCollege}-target-${targetCollegeCost}`,
    question: `${label}: ${money(monthlyContribution)}/Month From ${money(currentBalance)} Balance at ${expectedAnnualReturnPercent}% Return Toward ${money(targetCollegeCost)} in ${yearsUntilCollege} Years`,
    intent,
    currentBalance,
    monthlyContribution,
    expectedAnnualReturnPercent,
    yearsUntilCollege,
    targetCollegeCost,
    scenarioLabel,
  };
}

// Intent 1: newborn-saver — long horizon (16-18 years), near-zero starting balance.
const newbornSaverAmounts = [100, 200, 300, 400, 500];
const newbornSaverBundles = [
  { currentBalance: 0, expectedAnnualReturnPercent: 6, yearsUntilCollege: 18, targetCollegeCost: 80000 },
  { currentBalance: 500, expectedAnnualReturnPercent: 6, yearsUntilCollege: 17, targetCollegeCost: 100000 },
  { currentBalance: 1000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 18, targetCollegeCost: 120000 },
  { currentBalance: 0, expectedAnnualReturnPercent: 5, yearsUntilCollege: 16, targetCollegeCost: 60000 },
  { currentBalance: 2000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 17, targetCollegeCost: 150000 },
  { currentBalance: 1500, expectedAnnualReturnPercent: 6, yearsUntilCollege: 18, targetCollegeCost: 200000 },
  { currentBalance: 0, expectedAnnualReturnPercent: 7, yearsUntilCollege: 16, targetCollegeCost: 90000 },
  { currentBalance: 2500, expectedAnnualReturnPercent: 6, yearsUntilCollege: 17, targetCollegeCost: 130000 },
];

// Intent 2: early-childhood-saver — 10-14 years, small existing balance.
const earlyChildhoodSaverAmounts = [150, 250, 350, 450, 600];
const earlyChildhoodSaverBundles = [
  { currentBalance: 2000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 14, targetCollegeCost: 90000 },
  { currentBalance: 3000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 12, targetCollegeCost: 100000 },
  { currentBalance: 4000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 13, targetCollegeCost: 120000 },
  { currentBalance: 2500, expectedAnnualReturnPercent: 5, yearsUntilCollege: 11, targetCollegeCost: 80000 },
  { currentBalance: 5000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 14, targetCollegeCost: 150000 },
  { currentBalance: 3500, expectedAnnualReturnPercent: 6, yearsUntilCollege: 10, targetCollegeCost: 100000 },
  { currentBalance: 4500, expectedAnnualReturnPercent: 6, yearsUntilCollege: 12, targetCollegeCost: 130000 },
  { currentBalance: 6000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 11, targetCollegeCost: 160000 },
];

// Intent 3: tween-steady-saver — 6-9 years, meaningful existing balance.
const tweenSteadySaverAmounts = [300, 400, 500, 650, 800];
const tweenSteadySaverBundles = [
  { currentBalance: 8000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 9, targetCollegeCost: 100000 },
  { currentBalance: 10000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 8, targetCollegeCost: 120000 },
  { currentBalance: 12000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 7, targetCollegeCost: 130000 },
  { currentBalance: 9000, expectedAnnualReturnPercent: 5, yearsUntilCollege: 6, targetCollegeCost: 90000 },
  { currentBalance: 15000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 9, targetCollegeCost: 160000 },
  { currentBalance: 11000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 8, targetCollegeCost: 110000 },
  { currentBalance: 13000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 7, targetCollegeCost: 140000 },
  { currentBalance: 16000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 6, targetCollegeCost: 150000 },
];

// Intent 4: high-school-final-stretch — 2-5 years, larger balance needed, higher contributions.
const highSchoolFinalStretchAmounts = [500, 750, 1000, 1250, 1500];
const highSchoolFinalStretchBundles = [
  { currentBalance: 20000, expectedAnnualReturnPercent: 5, yearsUntilCollege: 5, targetCollegeCost: 130000 },
  { currentBalance: 25000, expectedAnnualReturnPercent: 5, yearsUntilCollege: 4, targetCollegeCost: 140000 },
  { currentBalance: 15000, expectedAnnualReturnPercent: 4, yearsUntilCollege: 3, targetCollegeCost: 100000 },
  { currentBalance: 30000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 5, targetCollegeCost: 160000 },
  { currentBalance: 10000, expectedAnnualReturnPercent: 4, yearsUntilCollege: 2, targetCollegeCost: 90000 },
  { currentBalance: 22000, expectedAnnualReturnPercent: 5, yearsUntilCollege: 4, targetCollegeCost: 150000 },
  { currentBalance: 18000, expectedAnnualReturnPercent: 4, yearsUntilCollege: 3, targetCollegeCost: 110000 },
  { currentBalance: 28000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 5, targetCollegeCost: 170000 },
];

// Intent 5: catch-up-late-start — 3-7 years, low starting balance, boosted contribution.
const catchUpLateStartAmounts = [700, 900, 1100, 1300, 1600];
const catchUpLateStartBundles = [
  { currentBalance: 5000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 7, targetCollegeCost: 130000 },
  { currentBalance: 3000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 6, targetCollegeCost: 120000 },
  { currentBalance: 8000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 5, targetCollegeCost: 140000 },
  { currentBalance: 2000, expectedAnnualReturnPercent: 5, yearsUntilCollege: 4, targetCollegeCost: 100000 },
  { currentBalance: 10000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 7, targetCollegeCost: 160000 },
  { currentBalance: 4000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 5, targetCollegeCost: 120000 },
  { currentBalance: 6000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 6, targetCollegeCost: 130000 },
  { currentBalance: 12000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 3, targetCollegeCost: 150000 },
];

export const collegeSavings529SeoRecords: CollegeSavings529SeoRecord[] = [
  ...newbornSaverAmounts.flatMap((monthlyContribution) =>
    newbornSaverBundles.map((bundle) =>
      record(
        'newborn-saver',
        'Newborn 529 Savings Plan',
        'newborn saver',
        bundle.currentBalance,
        monthlyContribution,
        bundle.expectedAnnualReturnPercent,
        bundle.yearsUntilCollege,
        bundle.targetCollegeCost,
      ),
    ),
  ),
  ...earlyChildhoodSaverAmounts.flatMap((monthlyContribution) =>
    earlyChildhoodSaverBundles.map((bundle) =>
      record(
        'early-childhood-saver',
        'Early Childhood 529 Savings Plan',
        'early childhood saver',
        bundle.currentBalance,
        monthlyContribution,
        bundle.expectedAnnualReturnPercent,
        bundle.yearsUntilCollege,
        bundle.targetCollegeCost,
      ),
    ),
  ),
  ...tweenSteadySaverAmounts.flatMap((monthlyContribution) =>
    tweenSteadySaverBundles.map((bundle) =>
      record(
        'tween-steady-saver',
        'Tween 529 Savings Plan',
        'tween steady saver',
        bundle.currentBalance,
        monthlyContribution,
        bundle.expectedAnnualReturnPercent,
        bundle.yearsUntilCollege,
        bundle.targetCollegeCost,
      ),
    ),
  ),
  ...highSchoolFinalStretchAmounts.flatMap((monthlyContribution) =>
    highSchoolFinalStretchBundles.map((bundle) =>
      record(
        'high-school-final-stretch',
        'High School 529 Final Stretch',
        'high school final stretch',
        bundle.currentBalance,
        monthlyContribution,
        bundle.expectedAnnualReturnPercent,
        bundle.yearsUntilCollege,
        bundle.targetCollegeCost,
      ),
    ),
  ),
  ...catchUpLateStartAmounts.flatMap((monthlyContribution) =>
    catchUpLateStartBundles.map((bundle) =>
      record(
        'catch-up-late-start',
        'Catch-Up 529 Savings Plan',
        'catch-up late start',
        bundle.currentBalance,
        monthlyContribution,
        bundle.expectedAnnualReturnPercent,
        bundle.yearsUntilCollege,
        bundle.targetCollegeCost,
      ),
    ),
  ),
];

export const featuredCollegeSavings529SeoRecords =
  collegeSavings529SeoRecords.filter((record) =>
    [
      'newborn-saver-balance-0-contribute-300-return-6-years-18-target-80000',
      'high-school-final-stretch-balance-20000-contribute-1000-return-5-years-5-target-130000',
    ].includes(record.slug),
  );
