export type EmergencyFundSeoIntent =
  | 'starter-emergency-fund'
  | 'three-month-buffer'
  | 'six-month-buffer'
  | 'job-transition-buffer'
  | 'family-emergency-fund';

export interface EmergencyFundSeoRecord {
  slug: string;
  question: string;
  intent: EmergencyFundSeoIntent;
  monthlyEssentialExpenses: number;
  targetMonths: number;
  currentEmergencySavings: number;
  monthlySavingsContribution: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_EMERGENCY_FUND_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function createRecord(
  intent: EmergencyFundSeoIntent,
  scenarioLabel: string,
  slugPrefix: string,
  questionPrefix: string,
  monthlyEssentialExpenses: number,
  targetMonths: number,
  currentEmergencySavings: number,
  monthlySavingsContribution: number,
  featured = false,
): EmergencyFundSeoRecord {
  return {
    slug: `${slugPrefix}-${monthlyEssentialExpenses}-monthly-expenses-${targetMonths}-months-${currentEmergencySavings}-saved-${monthlySavingsContribution}-monthly`,
    question: `${questionPrefix} ${money(monthlyEssentialExpenses)} Monthly Expenses, ${targetMonths} Months of Coverage, ${money(currentEmergencySavings)} Saved, and ${money(monthlySavingsContribution)} Monthly Saving?`,
    intent,
    monthlyEssentialExpenses,
    targetMonths,
    currentEmergencySavings,
    monthlySavingsContribution,
    scenarioLabel,
    featured,
  };
}

const starterExpenses = [1500, 2000, 2500, 3000, 4000];
const starterScenarios = [
  { targetMonths: 1, currentEmergencySavings: 0, monthlySavingsContribution: 150 },
  { targetMonths: 1, currentEmergencySavings: 250, monthlySavingsContribution: 250 },
  { targetMonths: 1, currentEmergencySavings: 500, monthlySavingsContribution: 300 },
  { targetMonths: 2, currentEmergencySavings: 500, monthlySavingsContribution: 400 },
  { targetMonths: 2, currentEmergencySavings: 750, monthlySavingsContribution: 500 },
  { targetMonths: 2, currentEmergencySavings: 1000, monthlySavingsContribution: 600 },
  { targetMonths: 3, currentEmergencySavings: 1000, monthlySavingsContribution: 700 },
  { targetMonths: 3, currentEmergencySavings: 1500, monthlySavingsContribution: 800 },
];

export const starterEmergencyFundSeoRecords = starterExpenses.flatMap(
  (monthlyEssentialExpenses) =>
    starterScenarios.map((scenario) =>
      createRecord(
        'starter-emergency-fund',
        'starter emergency fund example',
        'starter-emergency-fund',
        'How Long to Build a Starter Emergency Fund With',
        monthlyEssentialExpenses,
        scenario.targetMonths,
        scenario.currentEmergencySavings,
        scenario.monthlySavingsContribution,
        monthlyEssentialExpenses === 3000 &&
          scenario.targetMonths === 3 &&
          scenario.currentEmergencySavings === 1500 &&
          scenario.monthlySavingsContribution === 800,
      ),
    ),
);

const threeMonthExpenses = [2000, 2500, 3000, 4000, 5000];
const threeMonthScenarios = [
  { targetMonths: 3, currentEmergencySavings: 500, monthlySavingsContribution: 300 },
  { targetMonths: 3, currentEmergencySavings: 1000, monthlySavingsContribution: 400 },
  { targetMonths: 3, currentEmergencySavings: 1500, monthlySavingsContribution: 500 },
  { targetMonths: 3, currentEmergencySavings: 2000, monthlySavingsContribution: 600 },
  { targetMonths: 3, currentEmergencySavings: 2500, monthlySavingsContribution: 700 },
  { targetMonths: 4, currentEmergencySavings: 2500, monthlySavingsContribution: 800 },
  { targetMonths: 4, currentEmergencySavings: 3000, monthlySavingsContribution: 900 },
  { targetMonths: 4, currentEmergencySavings: 4000, monthlySavingsContribution: 1000 },
];

export const threeMonthBufferEmergencyFundSeoRecords = threeMonthExpenses.flatMap(
  (monthlyEssentialExpenses) =>
    threeMonthScenarios.map((scenario) =>
      createRecord(
        'three-month-buffer',
        'three-month emergency fund example',
        'three-month-emergency-fund',
        'How Long to Build a Three-Month Emergency Fund With',
        monthlyEssentialExpenses,
        scenario.targetMonths,
        scenario.currentEmergencySavings,
        scenario.monthlySavingsContribution,
        monthlyEssentialExpenses === 3000 &&
          scenario.targetMonths === 4 &&
          scenario.currentEmergencySavings === 3000 &&
          scenario.monthlySavingsContribution === 900,
      ),
    ),
);

const sixMonthExpenses = [2500, 3000, 4000, 5000, 6000];
const sixMonthScenarios = [
  { targetMonths: 5, currentEmergencySavings: 2500, monthlySavingsContribution: 500 },
  { targetMonths: 5, currentEmergencySavings: 5000, monthlySavingsContribution: 700 },
  { targetMonths: 6, currentEmergencySavings: 5000, monthlySavingsContribution: 800 },
  { targetMonths: 6, currentEmergencySavings: 7500, monthlySavingsContribution: 900 },
  { targetMonths: 6, currentEmergencySavings: 10000, monthlySavingsContribution: 1000 },
  { targetMonths: 6, currentEmergencySavings: 12500, monthlySavingsContribution: 1200 },
  { targetMonths: 7, currentEmergencySavings: 15000, monthlySavingsContribution: 1400 },
  { targetMonths: 7, currentEmergencySavings: 20000, monthlySavingsContribution: 1600 },
];

export const sixMonthBufferEmergencyFundSeoRecords = sixMonthExpenses.flatMap(
  (monthlyEssentialExpenses) =>
    sixMonthScenarios.map((scenario) =>
      createRecord(
        'six-month-buffer',
        'six-month emergency fund example',
        'six-month-emergency-fund',
        'How Long to Build a Six-Month Emergency Fund With',
        monthlyEssentialExpenses,
        scenario.targetMonths,
        scenario.currentEmergencySavings,
        scenario.monthlySavingsContribution,
        monthlyEssentialExpenses === 4000 &&
          scenario.targetMonths === 6 &&
          scenario.currentEmergencySavings === 10000 &&
          scenario.monthlySavingsContribution === 1000,
      ),
    ),
);

const jobTransitionExpenses = [2500, 3000, 3500, 4500, 5500];
const jobTransitionScenarios = [
  { targetMonths: 4, currentEmergencySavings: 1000, monthlySavingsContribution: 400 },
  { targetMonths: 4, currentEmergencySavings: 2000, monthlySavingsContribution: 600 },
  { targetMonths: 5, currentEmergencySavings: 3000, monthlySavingsContribution: 700 },
  { targetMonths: 5, currentEmergencySavings: 4000, monthlySavingsContribution: 800 },
  { targetMonths: 6, currentEmergencySavings: 5000, monthlySavingsContribution: 900 },
  { targetMonths: 6, currentEmergencySavings: 6000, monthlySavingsContribution: 1000 },
  { targetMonths: 7, currentEmergencySavings: 8000, monthlySavingsContribution: 1200 },
  { targetMonths: 8, currentEmergencySavings: 10000, monthlySavingsContribution: 1400 },
];

export const jobTransitionEmergencyFundSeoRecords = jobTransitionExpenses.flatMap(
  (monthlyEssentialExpenses) =>
    jobTransitionScenarios.map((scenario) =>
      createRecord(
        'job-transition-buffer',
        'job transition emergency fund example',
        'job-transition-emergency-fund',
        'How Long to Build a Job-Transition Emergency Fund With',
        monthlyEssentialExpenses,
        scenario.targetMonths,
        scenario.currentEmergencySavings,
        scenario.monthlySavingsContribution,
        monthlyEssentialExpenses === 3500 &&
          scenario.targetMonths === 6 &&
          scenario.currentEmergencySavings === 5000 &&
          scenario.monthlySavingsContribution === 900,
      ),
    ),
);

const familyExpenses = [4000, 5000, 6000, 7000, 8000];
const familyScenarios = [
  { targetMonths: 4, currentEmergencySavings: 2000, monthlySavingsContribution: 700 },
  { targetMonths: 4, currentEmergencySavings: 4000, monthlySavingsContribution: 900 },
  { targetMonths: 5, currentEmergencySavings: 5000, monthlySavingsContribution: 1100 },
  { targetMonths: 5, currentEmergencySavings: 7000, monthlySavingsContribution: 1300 },
  { targetMonths: 6, currentEmergencySavings: 8000, monthlySavingsContribution: 1500 },
  { targetMonths: 6, currentEmergencySavings: 10000, monthlySavingsContribution: 1700 },
  { targetMonths: 7, currentEmergencySavings: 12000, monthlySavingsContribution: 1900 },
  { targetMonths: 8, currentEmergencySavings: 15000, monthlySavingsContribution: 2200 },
];

export const familyEmergencyFundSeoRecords = familyExpenses.flatMap(
  (monthlyEssentialExpenses) =>
    familyScenarios.map((scenario) =>
      createRecord(
        'family-emergency-fund',
        'family emergency fund example',
        'family-emergency-fund',
        'How Long to Build a Family Emergency Fund With',
        monthlyEssentialExpenses,
        scenario.targetMonths,
        scenario.currentEmergencySavings,
        scenario.monthlySavingsContribution,
        monthlyEssentialExpenses === 6000 &&
          scenario.targetMonths === 6 &&
          scenario.currentEmergencySavings === 10000 &&
          scenario.monthlySavingsContribution === 1700,
      ),
    ),
);

export const emergencyFundSeoRecords: EmergencyFundSeoRecord[] = [
  ...starterEmergencyFundSeoRecords,
  ...threeMonthBufferEmergencyFundSeoRecords,
  ...sixMonthBufferEmergencyFundSeoRecords,
  ...jobTransitionEmergencyFundSeoRecords,
  ...familyEmergencyFundSeoRecords,
];

export const featuredEmergencyFundSeoRecords = emergencyFundSeoRecords.filter((record) =>
  [
    'starter-emergency-fund-2500-monthly-expenses-2-months-750-saved-500-monthly',
    'three-month-emergency-fund-3000-monthly-expenses-3-months-2500-saved-700-monthly',
    'six-month-emergency-fund-4000-monthly-expenses-6-months-10000-saved-1000-monthly',
    'job-transition-emergency-fund-3500-monthly-expenses-6-months-5000-saved-900-monthly',
    'family-emergency-fund-6000-monthly-expenses-6-months-8000-saved-1500-monthly',
  ].includes(record.slug),
);
