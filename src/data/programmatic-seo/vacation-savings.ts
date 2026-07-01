export type VacationSavingsSeoIntent =
  | 'weekend-getaway'
  | 'family-vacation'
  | 'international-trip'
  | 'luxury-vacation'
  | 'retirement-travel';

export interface VacationSavingsSeoRecord {
  slug: string;
  question: string;
  intent: VacationSavingsSeoIntent;
  goalAmount: number;
  currentSavings: number;
  years: number;
  annualReturnPercent: number;
  scenarioLabel: string;
  purposeLabel: string;
  featured?: boolean;
}

export const EXPECTED_VACATION_SAVINGS_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const formatRate = (rate: number) => rate.toLocaleString('en-US');
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');
const capitalizeWords = (value: string) =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());

function createRecord(
  intent: VacationSavingsSeoIntent,
  scenarioLabel: string,
  purposeLabel: string,
  slugPrefix: string,
  goalAmount: number,
  currentSavings: number,
  years: number,
  annualReturnPercent: number,
  featured = false,
): VacationSavingsSeoRecord {
  return {
    slug: `${slugPrefix}-${goalAmount}-goal-${years}-years-${currentSavings}-saved-at-${rateSlug(annualReturnPercent)}-percent`,
    question: `Monthly Vacation Savings for ${money(goalAmount)} ${capitalizeWords(purposeLabel)} in ${years} ${years === 1 ? 'Year' : 'Years'} With ${money(currentSavings)} Already Saved at ${formatRate(annualReturnPercent)}%`,
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

const weekendGetawayAmounts = [1000, 1500, 2000, 2500, 3000];
const weekendGetawayScenarios = [
  { years: 1, currentSavings: 0, annualReturnPercent: 2 },
  { years: 1, currentSavings: 250, annualReturnPercent: 2 },
  { years: 1, currentSavings: 500, annualReturnPercent: 2.25 },
  { years: 2, currentSavings: 500, annualReturnPercent: 2.25 },
  { years: 2, currentSavings: 750, annualReturnPercent: 2.5 },
  { years: 2, currentSavings: 1000, annualReturnPercent: 2.5 },
  { years: 3, currentSavings: 1250, annualReturnPercent: 2.75 },
  { years: 3, currentSavings: 1500, annualReturnPercent: 3 },
];

export const weekendGetawayVacationSavingsSeoRecords =
  weekendGetawayAmounts.flatMap((goalAmount) =>
    weekendGetawayScenarios.map((scenario) =>
      createRecord(
        'weekend-getaway',
        'weekend getaway savings example',
        'weekend getaway fund',
        'weekend-getaway-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
      ),
    ),
  );

const familyVacationAmounts = [4000, 5000, 6000, 8000, 10000];
const familyVacationScenarios = [
  { years: 1, currentSavings: 500, annualReturnPercent: 2 },
  { years: 1, currentSavings: 1000, annualReturnPercent: 2.25 },
  { years: 2, currentSavings: 1500, annualReturnPercent: 2.5 },
  { years: 2, currentSavings: 2000, annualReturnPercent: 2.75 },
  { years: 2, currentSavings: 2500, annualReturnPercent: 3 },
  { years: 3, currentSavings: 3000, annualReturnPercent: 3 },
  { years: 3, currentSavings: 4000, annualReturnPercent: 3.25 },
  { years: 4, currentSavings: 5000, annualReturnPercent: 3.5 },
];

export const familyVacationSavingsSeoRecords = familyVacationAmounts.flatMap(
  (goalAmount) =>
    familyVacationScenarios.map((scenario) =>
      createRecord(
        'family-vacation',
        'family vacation savings example',
        'family vacation fund',
        'family-vacation-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
        goalAmount === 6000 &&
          scenario.currentSavings === 3000 &&
          scenario.years === 3 &&
          scenario.annualReturnPercent === 3,
      ),
    ),
);

const internationalTripAmounts = [5000, 7000, 9000, 12000, 15000];
const internationalTripScenarios = [
  { years: 1, currentSavings: 1000, annualReturnPercent: 2 },
  { years: 2, currentSavings: 1500, annualReturnPercent: 2.25 },
  { years: 2, currentSavings: 2500, annualReturnPercent: 2.5 },
  { years: 3, currentSavings: 3000, annualReturnPercent: 2.75 },
  { years: 3, currentSavings: 4000, annualReturnPercent: 3 },
  { years: 4, currentSavings: 5000, annualReturnPercent: 3.25 },
  { years: 5, currentSavings: 6000, annualReturnPercent: 3.5 },
  { years: 6, currentSavings: 7500, annualReturnPercent: 3.75 },
];

export const internationalTripVacationSavingsSeoRecords =
  internationalTripAmounts.flatMap((goalAmount) =>
    internationalTripScenarios.map((scenario) =>
      createRecord(
        'international-trip',
        'international trip savings example',
        'international trip fund',
        'international-trip-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
      ),
    ),
  );

const luxuryVacationAmounts = [10000, 15000, 20000, 25000, 30000];
const luxuryVacationScenarios = [
  { years: 2, currentSavings: 1500, annualReturnPercent: 2.25 },
  { years: 3, currentSavings: 2500, annualReturnPercent: 2.5 },
  { years: 3, currentSavings: 5000, annualReturnPercent: 2.75 },
  { years: 4, currentSavings: 7500, annualReturnPercent: 3 },
  { years: 5, currentSavings: 10000, annualReturnPercent: 3.25 },
  { years: 6, currentSavings: 12500, annualReturnPercent: 3.5 },
  { years: 7, currentSavings: 15000, annualReturnPercent: 3.75 },
  { years: 8, currentSavings: 20000, annualReturnPercent: 4 },
];

export const luxuryVacationSavingsSeoRecords = luxuryVacationAmounts.flatMap(
  (goalAmount) =>
    luxuryVacationScenarios.map((scenario) =>
      createRecord(
        'luxury-vacation',
        'luxury vacation savings example',
        'bucket-list vacation fund',
        'luxury-vacation-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
      ),
    ),
);

const retirementTravelAmounts = [15000, 20000, 30000, 40000, 50000];
const retirementTravelScenarios = [
  { years: 3, currentSavings: 5000, annualReturnPercent: 2.5 },
  { years: 4, currentSavings: 7500, annualReturnPercent: 2.75 },
  { years: 5, currentSavings: 10000, annualReturnPercent: 3 },
  { years: 6, currentSavings: 12500, annualReturnPercent: 3.25 },
  { years: 7, currentSavings: 15000, annualReturnPercent: 3.5 },
  { years: 8, currentSavings: 20000, annualReturnPercent: 3.75 },
  { years: 10, currentSavings: 25000, annualReturnPercent: 4 },
  { years: 12, currentSavings: 30000, annualReturnPercent: 4.25 },
];

export const retirementTravelVacationSavingsSeoRecords =
  retirementTravelAmounts.flatMap((goalAmount) =>
    retirementTravelScenarios.map((scenario) =>
      createRecord(
        'retirement-travel',
        'retirement travel savings example',
        'retirement travel fund',
        'retirement-travel-savings',
        goalAmount,
        scenario.currentSavings,
        scenario.years,
        scenario.annualReturnPercent,
      ),
    ),
  );

export const vacationSavingsSeoRecords: VacationSavingsSeoRecord[] = [
  ...weekendGetawayVacationSavingsSeoRecords,
  ...familyVacationSavingsSeoRecords,
  ...internationalTripVacationSavingsSeoRecords,
  ...luxuryVacationSavingsSeoRecords,
  ...retirementTravelVacationSavingsSeoRecords,
];

export const featuredVacationSavingsSeoRecords =
  vacationSavingsSeoRecords.filter((record) => record.featured);
