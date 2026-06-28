export type MonthlySavingsSeoIntent =
  | 'starter-fund'
  | 'milestone-fund'
  | 'major-purchase'
  | 'family-goal'
  | 'catch-up-plan';

export interface MonthlySavingsSeoRecord {
  slug: string;
  question: string;
  intent: MonthlySavingsSeoIntent;
  goalAmount: number;
  currentSavings: number;
  years: number;
  annualReturnPercent: number;
  scenarioLabel: string;
  purposeLabel: string;
  featured?: boolean;
}

export const EXPECTED_MONTHLY_SAVINGS_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const formatRate = (rate: number) => rate.toLocaleString('en-US');
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function createRecord(
  intent: MonthlySavingsSeoIntent,
  scenarioLabel: string,
  purposeLabel: string,
  slugPrefix: string,
  goalAmount: number,
  currentSavings: number,
  years: number,
  annualReturnPercent: number,
  featured = false,
): MonthlySavingsSeoRecord {
  return {
    slug: `${slugPrefix}-${goalAmount}-goal-${years}-years-${currentSavings}-saved-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `Monthly Savings Plan for ${money(goalAmount)} ${purposeLabel} in ${years} ${years === 1 ? 'Year' : 'Years'} With ${money(currentSavings)} Already Saved at ${formatRate(annualReturnPercent)}%`,
    intent,
    goalAmount,
    currentSavings,
    years,
    annualReturnPercent,
    scenarioLabel,
    purposeLabel,
    featured,
  };
}

const starterFundAmounts = [1000, 2500, 5000, 7500, 10000];
const starterFundScenarios = [
  { years: 1, currentSavings: 0, annualReturnPercent: 2 },
  { years: 1, currentSavings: 250, annualReturnPercent: 2 },
  { years: 2, currentSavings: 500, annualReturnPercent: 2.25 },
  { years: 2, currentSavings: 750, annualReturnPercent: 2.5 },
  { years: 2, currentSavings: 1000, annualReturnPercent: 2.75 },
  { years: 3, currentSavings: 1500, annualReturnPercent: 3 },
  { years: 3, currentSavings: 2000, annualReturnPercent: 3 },
  { years: 4, currentSavings: 2500, annualReturnPercent: 3.25 },
];

export const starterFundMonthlySavingsSeoRecords = starterFundAmounts.flatMap(
  (goalAmount) =>
    starterFundScenarios.map((scenario) =>
      createRecord(
        'starter-fund',
        'starter monthly savings example',
        'starter savings fund',
        'starter-monthly-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
      ),
    ),
);

const milestoneFundAmounts = [15000, 20000, 25000, 30000, 40000];
const milestoneFundScenarios = [
  { years: 2, currentSavings: 0, annualReturnPercent: 2.5 },
  { years: 2, currentSavings: 1000, annualReturnPercent: 2.75 },
  { years: 3, currentSavings: 2500, annualReturnPercent: 3 },
  { years: 3, currentSavings: 5000, annualReturnPercent: 3.25 },
  { years: 4, currentSavings: 7500, annualReturnPercent: 3.5 },
  { years: 5, currentSavings: 10000, annualReturnPercent: 4 },
  { years: 6, currentSavings: 12500, annualReturnPercent: 4 },
  { years: 7, currentSavings: 15000, annualReturnPercent: 4.25 },
];

export const milestoneFundMonthlySavingsSeoRecords =
  milestoneFundAmounts.flatMap((goalAmount) =>
    milestoneFundScenarios.map((scenario) =>
      createRecord(
        'milestone-fund',
        'milestone monthly savings example',
        'milestone savings fund',
        'milestone-monthly-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
        goalAmount === 25000 &&
          scenario.currentSavings === 5000 &&
          scenario.years === 3 &&
          scenario.annualReturnPercent === 3.25,
      ),
    ),
  );

const majorPurchaseAmounts = [25000, 50000, 75000, 100000, 150000];
const majorPurchaseScenarios = [
  { years: 2, currentSavings: 2500, annualReturnPercent: 2.5 },
  { years: 3, currentSavings: 5000, annualReturnPercent: 3 },
  { years: 4, currentSavings: 10000, annualReturnPercent: 3.5 },
  { years: 5, currentSavings: 15000, annualReturnPercent: 4 },
  { years: 6, currentSavings: 20000, annualReturnPercent: 4 },
  { years: 7, currentSavings: 25000, annualReturnPercent: 4.25 },
  { years: 8, currentSavings: 30000, annualReturnPercent: 4.5 },
  { years: 10, currentSavings: 40000, annualReturnPercent: 4.5 },
];

export const majorPurchaseMonthlySavingsSeoRecords =
  majorPurchaseAmounts.flatMap((goalAmount) =>
    majorPurchaseScenarios.map((scenario) =>
      createRecord(
        'major-purchase',
        'major purchase monthly savings example',
        'major purchase fund',
        'major-purchase-monthly-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
      ),
    ),
  );

const familyGoalAmounts = [5000, 10000, 15000, 20000, 30000];
const familyGoalScenarios = [
  { years: 1, currentSavings: 500, annualReturnPercent: 2 },
  { years: 2, currentSavings: 1000, annualReturnPercent: 2.25 },
  { years: 2, currentSavings: 2000, annualReturnPercent: 2.5 },
  { years: 3, currentSavings: 3000, annualReturnPercent: 2.75 },
  { years: 3, currentSavings: 4000, annualReturnPercent: 3 },
  { years: 4, currentSavings: 5000, annualReturnPercent: 3.25 },
  { years: 5, currentSavings: 7500, annualReturnPercent: 3.5 },
  { years: 6, currentSavings: 10000, annualReturnPercent: 3.75 },
];

export const familyGoalMonthlySavingsSeoRecords = familyGoalAmounts.flatMap(
  (goalAmount) =>
    familyGoalScenarios.map((scenario) =>
      createRecord(
        'family-goal',
        'family monthly savings example',
        'family savings goal',
        'family-monthly-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
      ),
    ),
);

const catchUpPlanAmounts = [20000, 30000, 50000, 75000, 100000];
const catchUpPlanScenarios = [
  { years: 1, currentSavings: 2500, annualReturnPercent: 2 },
  { years: 2, currentSavings: 5000, annualReturnPercent: 2.5 },
  { years: 3, currentSavings: 10000, annualReturnPercent: 3 },
  { years: 4, currentSavings: 15000, annualReturnPercent: 3.5 },
  { years: 5, currentSavings: 20000, annualReturnPercent: 4 },
  { years: 6, currentSavings: 25000, annualReturnPercent: 4.25 },
  { years: 7, currentSavings: 30000, annualReturnPercent: 4.5 },
  { years: 8, currentSavings: 40000, annualReturnPercent: 4.75 },
];

export const catchUpPlanMonthlySavingsSeoRecords = catchUpPlanAmounts.flatMap(
  (goalAmount) =>
    catchUpPlanScenarios.map((scenario) =>
      createRecord(
        'catch-up-plan',
        'catch-up monthly savings example',
        'catch-up savings plan',
        'catch-up-monthly-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
        goalAmount === 50000 &&
          scenario.currentSavings === 15000 &&
          scenario.years === 4 &&
          scenario.annualReturnPercent === 3.5,
      ),
    ),
);

export const monthlySavingsSeoRecords: MonthlySavingsSeoRecord[] = [
  ...starterFundMonthlySavingsSeoRecords,
  ...milestoneFundMonthlySavingsSeoRecords,
  ...majorPurchaseMonthlySavingsSeoRecords,
  ...familyGoalMonthlySavingsSeoRecords,
  ...catchUpPlanMonthlySavingsSeoRecords,
];

export const featuredMonthlySavingsSeoRecords = monthlySavingsSeoRecords.filter(
  (record) => record.featured,
);
