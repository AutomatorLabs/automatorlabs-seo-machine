export type CarSavingsSeoIntent =
  | 'down-payment'
  | 'used-car'
  | 'new-car'
  | 'family-suv'
  | 'retirement-replacement';

export interface CarSavingsSeoRecord {
  slug: string;
  question: string;
  intent: CarSavingsSeoIntent;
  goalAmount: number;
  currentSavings: number;
  years: number;
  annualReturnPercent: number;
  scenarioLabel: string;
  purposeLabel: string;
  featured?: boolean;
}

export const EXPECTED_CAR_SAVINGS_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const formatRate = (rate: number) => rate.toLocaleString('en-US');
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');
const capitalizeWords = (value: string) =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());

function createRecord(
  intent: CarSavingsSeoIntent,
  scenarioLabel: string,
  purposeLabel: string,
  slugPrefix: string,
  goalAmount: number,
  currentSavings: number,
  years: number,
  annualReturnPercent: number,
  featured = false,
): CarSavingsSeoRecord {
  return {
    slug: `${slugPrefix}-${goalAmount}-goal-${years}-years-${currentSavings}-saved-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `Monthly Car Savings for ${money(goalAmount)} ${capitalizeWords(purposeLabel)} in ${years} ${years === 1 ? 'Year' : 'Years'} With ${money(currentSavings)} Already Saved at ${formatRate(annualReturnPercent)}%`,
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

const downPaymentAmounts = [3000, 5000, 7500, 10000, 15000];
const downPaymentScenarios = [
  { years: 1, currentSavings: 500, annualReturnPercent: 2 },
  { years: 1, currentSavings: 1000, annualReturnPercent: 2.25 },
  { years: 2, currentSavings: 1500, annualReturnPercent: 2.5 },
  { years: 2, currentSavings: 2000, annualReturnPercent: 2.75 },
  { years: 3, currentSavings: 2500, annualReturnPercent: 3 },
  { years: 3, currentSavings: 3000, annualReturnPercent: 3 },
  { years: 4, currentSavings: 4000, annualReturnPercent: 3.25 },
  { years: 5, currentSavings: 5000, annualReturnPercent: 3.5 },
];

export const downPaymentCarSavingsSeoRecords = downPaymentAmounts.flatMap(
  (goalAmount) =>
    downPaymentScenarios.map((scenario) =>
      createRecord(
        'down-payment',
        'car down payment savings example',
        'car down payment',
        'car-down-payment-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
      ),
    ),
);

const usedCarAmounts = [10000, 15000, 20000, 25000, 30000];
const usedCarScenarios = [
  { years: 1, currentSavings: 1000, annualReturnPercent: 2 },
  { years: 2, currentSavings: 2000, annualReturnPercent: 2.25 },
  { years: 2, currentSavings: 3000, annualReturnPercent: 2.5 },
  { years: 3, currentSavings: 4000, annualReturnPercent: 2.75 },
  { years: 4, currentSavings: 5000, annualReturnPercent: 3 },
  { years: 5, currentSavings: 6000, annualReturnPercent: 3.25 },
  { years: 6, currentSavings: 7500, annualReturnPercent: 3.5 },
  { years: 7, currentSavings: 9000, annualReturnPercent: 3.75 },
];

export const usedCarSavingsSeoRecords = usedCarAmounts.flatMap((goalAmount) =>
  usedCarScenarios.map((scenario) =>
    createRecord(
      'used-car',
      'used car savings example',
      'used car fund',
      'used-car-savings',
      goalAmount,
      scenario.currentSavings,
      scenario.years,
      scenario.annualReturnPercent,
    ),
  ),
);

const newCarAmounts = [25000, 30000, 35000, 40000, 50000];
const newCarScenarios = [
  { years: 2, currentSavings: 2500, annualReturnPercent: 2.25 },
  { years: 3, currentSavings: 5000, annualReturnPercent: 2.5 },
  { years: 4, currentSavings: 7500, annualReturnPercent: 2.75 },
  { years: 5, currentSavings: 10000, annualReturnPercent: 3 },
  { years: 6, currentSavings: 12500, annualReturnPercent: 3.25 },
  { years: 7, currentSavings: 15000, annualReturnPercent: 3.5 },
  { years: 8, currentSavings: 17500, annualReturnPercent: 3.75 },
  { years: 10, currentSavings: 20000, annualReturnPercent: 4 },
];

export const newCarSavingsSeoRecords = newCarAmounts.flatMap((goalAmount) =>
  newCarScenarios.map((scenario) =>
    createRecord(
      'new-car',
      'new car savings example',
      'new car fund',
      'new-car-savings',
      goalAmount,
      scenario.currentSavings,
      scenario.years,
      scenario.annualReturnPercent,
      goalAmount === 30000 &&
        scenario.currentSavings === 10000 &&
        scenario.years === 5 &&
        scenario.annualReturnPercent === 3,
    ),
  ),
);

const familySuvAmounts = [30000, 40000, 50000, 60000, 70000];
const familySuvScenarios = [
  { years: 2, currentSavings: 5000, annualReturnPercent: 2.25 },
  { years: 3, currentSavings: 7500, annualReturnPercent: 2.5 },
  { years: 4, currentSavings: 10000, annualReturnPercent: 2.75 },
  { years: 5, currentSavings: 15000, annualReturnPercent: 3 },
  { years: 6, currentSavings: 20000, annualReturnPercent: 3.25 },
  { years: 7, currentSavings: 25000, annualReturnPercent: 3.5 },
  { years: 8, currentSavings: 30000, annualReturnPercent: 3.75 },
  { years: 10, currentSavings: 35000, annualReturnPercent: 4 },
];

export const familySuvSavingsSeoRecords = familySuvAmounts.flatMap(
  (goalAmount) =>
    familySuvScenarios.map((scenario) =>
      createRecord(
        'family-suv',
        'family suv savings example',
        'family SUV fund',
        'family-suv-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
      ),
    ),
);

const retirementReplacementAmounts = [15000, 20000, 25000, 30000, 40000];
const retirementReplacementScenarios = [
  { years: 3, currentSavings: 2500, annualReturnPercent: 2.25 },
  { years: 4, currentSavings: 5000, annualReturnPercent: 2.5 },
  { years: 5, currentSavings: 7500, annualReturnPercent: 2.75 },
  { years: 6, currentSavings: 10000, annualReturnPercent: 3 },
  { years: 7, currentSavings: 12500, annualReturnPercent: 3.25 },
  { years: 8, currentSavings: 15000, annualReturnPercent: 3.5 },
  { years: 10, currentSavings: 20000, annualReturnPercent: 3.75 },
  { years: 12, currentSavings: 25000, annualReturnPercent: 4 },
];

export const retirementReplacementCarSavingsSeoRecords =
  retirementReplacementAmounts.flatMap((goalAmount) =>
    retirementReplacementScenarios.map((scenario) =>
      createRecord(
        'retirement-replacement',
        'replacement car savings example',
        'replacement car fund',
        'replacement-car-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
      ),
    ),
  );

export const carSavingsSeoRecords: CarSavingsSeoRecord[] = [
  ...downPaymentCarSavingsSeoRecords,
  ...usedCarSavingsSeoRecords,
  ...newCarSavingsSeoRecords,
  ...familySuvSavingsSeoRecords,
  ...retirementReplacementCarSavingsSeoRecords,
];

export const featuredCarSavingsSeoRecords = carSavingsSeoRecords.filter(
  (record) => record.featured,
);
