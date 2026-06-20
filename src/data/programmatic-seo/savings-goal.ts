export type SavingsGoalSeoIntent =
  | 'general'
  | 'down-payment'
  | 'emergency-fund'
  | 'vacation'
  | 'vehicle'
  | 'retirement-age';

export interface SavingsGoalSeoRecord {
  slug: string;
  question: string;
  intent: SavingsGoalSeoIntent;
  goalAmount: number;
  years: number;
  currentSavings: number;
  annualReturnPercent: number;
  purpose: string;
  currentAge?: number;
  targetAge?: number;
  featured?: boolean;
}

export const EXPECTED_SAVINGS_GOAL_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function generalRecord(
  goalAmount: number,
  years: number,
  featured = false,
): SavingsGoalSeoRecord {
  const duration = `${years}-${years === 1 ? 'year' : 'years'}`;

  return {
    slug: `save-${goalAmount}-in-${duration}`,
    question: `How Much Should I Save Monthly to Reach ${money(goalAmount)} in ${years} ${years === 1 ? 'Year' : 'Years'}?`,
    intent: 'general',
    goalAmount,
    years,
    currentSavings: 0,
    annualReturnPercent: 4,
    purpose: 'savings goal',
    featured,
  };
}

function purposeRecord(
  intent: Exclude<SavingsGoalSeoIntent, 'general' | 'retirement-age'>,
  purpose: string,
  goalAmount: number,
  years: number,
  annualReturnPercent: number,
  featured = false,
): SavingsGoalSeoRecord {
  const duration = `${years}-${years === 1 ? 'year' : 'years'}`;

  return {
    slug: `save-${goalAmount}-for-${intent}-in-${duration}`,
    question: `Monthly Savings Needed for a ${money(goalAmount)} ${purpose} in ${years} ${years === 1 ? 'Year' : 'Years'}`,
    intent,
    goalAmount,
    years,
    currentSavings: 0,
    annualReturnPercent,
    purpose,
    featured,
  };
}

function retirementRecord(
  goalAmount: number,
  currentAge: number,
  targetAge: number,
  featured = false,
): SavingsGoalSeoRecord {
  return {
    slug: `save-${goalAmount}-by-age-${targetAge}-starting-at-${currentAge}`,
    question: `How Much to Save Monthly for ${money(goalAmount)} by Age ${targetAge} Starting at ${currentAge}`,
    intent: 'retirement-age',
    goalAmount,
    years: targetAge - currentAge,
    currentSavings: 0,
    annualReturnPercent: 7,
    purpose: 'retirement target',
    currentAge,
    targetAge,
    featured,
  };
}

function startingBalanceRecord(
  intent: SavingsGoalSeoIntent,
  purpose: string,
  goalAmount: number,
  years: number,
  currentSavings: number,
  annualReturnPercent: number,
): SavingsGoalSeoRecord {
  const duration = `${years}-${years === 1 ? 'year' : 'years'}`;

  return {
    slug: `save-${goalAmount}-for-${slugify(purpose)}-in-${duration}-starting-with-${currentSavings}-at-${annualReturnPercent}-percent`,
    question: `How Much to Save Monthly for a ${money(goalAmount)} ${purpose} in ${years} ${years === 1 ? 'Year' : 'Years'} Starting With ${money(currentSavings)} at ${annualReturnPercent}%?`,
    intent,
    goalAmount,
    years,
    currentSavings,
    annualReturnPercent,
    purpose,
  };
}

const generalScenarios: [number, number][] = [
  ...[1, 2, 3, 5].map((years) => [10000, years] as [number, number]),
  ...[1, 2, 3, 5].map((years) => [25000, years] as [number, number]),
  ...[2, 3, 5, 10].map((years) => [50000, years] as [number, number]),
  ...[2, 3, 5, 10].map((years) => [75000, years] as [number, number]),
  ...[3, 5, 7, 10].map((years) => [100000, years] as [number, number]),
  ...[3, 5, 7, 10].map((years) => [150000, years] as [number, number]),
  ...[5, 7, 10, 15].map((years) => [250000, years] as [number, number]),
  ...[10, 15, 20, 25].map((years) => [500000, years] as [number, number]),
  ...[10, 15, 20, 25].map((years) => [750000, years] as [number, number]),
  ...[10, 15, 20, 30].map((years) => [1000000, years] as [number, number]),
];

const downPaymentScenarios: [number, number][] = [20000, 30000, 40000, 50000, 75000]
  .flatMap((amount) => [2, 3, 5].map((years) => [amount, years] as [number, number]));

const emergencyFundScenarios: [number, number][] = [5000, 10000, 15000, 20000]
  .flatMap((amount) => [1, 2, 3].map((years) => [amount, years] as [number, number]));

const vacationScenarios: [number, number][] = [3000, 5000, 8000, 10000]
  .flatMap((amount) => [1, 2, 3].map((years) => [amount, years] as [number, number]));

const vehicleScenarios: [number, number][] = [
  [10000, 1],
  [10000, 2],
  [15000, 2],
  [15000, 3],
  [20000, 2],
  [20000, 3],
  [25000, 3],
  [25000, 4],
  [30000, 4],
  [40000, 5],
];

const retirementScenarios: [number, number, number][] = [
  [250000, 25, 55],
  [250000, 35, 55],
  [250000, 45, 55],
  [500000, 25, 60],
  [500000, 35, 60],
  [500000, 45, 60],
  [1000000, 25, 65],
  [1000000, 30, 65],
  [1000000, 35, 65],
  [1000000, 40, 65],
  [1000000, 45, 65],
];

const longTailSavingsGoalSeoRecords: SavingsGoalSeoRecord[] = [
  generalRecord(500000, 5),
  generalRecord(500000, 7),
  generalRecord(500000, 12),
  generalRecord(750000, 7),
  generalRecord(1000000, 5),
  purposeRecord('down-payment', 'house down payment', 100000, 5, 3.5),
  purposeRecord('down-payment', 'house down payment', 150000, 5, 3.5),
  purposeRecord('down-payment', 'house down payment', 200000, 7, 3.5),
  purposeRecord('emergency-fund', 'emergency fund', 25000, 2, 3),
  purposeRecord('emergency-fund', 'emergency fund', 30000, 3, 3),
  purposeRecord('vacation', 'vacation fund', 15000, 3, 2),
  purposeRecord('vacation', 'vacation fund', 20000, 4, 2),
  purposeRecord('vehicle', 'vehicle fund', 35000, 4, 3),
  purposeRecord('vehicle', 'vehicle fund', 50000, 5, 3),
  retirementRecord(750000, 30, 65),
];

const startingBalanceSavingsGoalSeoRecords: SavingsGoalSeoRecord[] = [
  startingBalanceRecord('emergency-fund', 'emergency fund', 25000, 1, 2500, 2),
  startingBalanceRecord('emergency-fund', 'emergency fund', 25000, 2, 5000, 3),
  startingBalanceRecord('emergency-fund', 'emergency fund', 25000, 3, 10000, 3),
  startingBalanceRecord('emergency-fund', 'emergency fund', 50000, 2, 5000, 2),
  startingBalanceRecord('emergency-fund', 'emergency fund', 50000, 3, 10000, 3),
  startingBalanceRecord('emergency-fund', 'emergency fund', 50000, 4, 15000, 3),
  startingBalanceRecord('emergency-fund', 'emergency fund', 75000, 3, 10000, 2),
  startingBalanceRecord('emergency-fund', 'emergency fund', 75000, 4, 15000, 3),
  startingBalanceRecord('emergency-fund', 'emergency fund', 75000, 5, 25000, 3),
  startingBalanceRecord('emergency-fund', 'emergency fund', 100000, 3, 15000, 2),
  startingBalanceRecord('emergency-fund', 'emergency fund', 100000, 5, 25000, 3),
  startingBalanceRecord('emergency-fund', 'emergency fund', 100000, 7, 40000, 4),
  startingBalanceRecord('general', 'home purchase fund', 50000, 3, 5000, 3),
  startingBalanceRecord('general', 'home purchase fund', 50000, 5, 10000, 4),
  startingBalanceRecord('general', 'home purchase fund', 75000, 3, 7500, 3),
  startingBalanceRecord('general', 'home purchase fund', 75000, 5, 15000, 4),
  startingBalanceRecord('general', 'home purchase fund', 75000, 7, 25000, 4),
  startingBalanceRecord('general', 'home purchase fund', 100000, 3, 10000, 3),
  startingBalanceRecord('general', 'home purchase fund', 100000, 5, 20000, 4),
  startingBalanceRecord('general', 'home purchase fund', 100000, 7, 30000, 4),
  startingBalanceRecord('general', 'home purchase fund', 250000, 5, 25000, 4),
  startingBalanceRecord('general', 'home purchase fund', 250000, 7, 50000, 5),
  startingBalanceRecord('general', 'home purchase fund', 250000, 10, 75000, 5),
  startingBalanceRecord('general', 'home purchase fund', 500000, 7, 50000, 4),
  startingBalanceRecord('general', 'home purchase fund', 500000, 10, 100000, 5),
  startingBalanceRecord('general', 'home purchase fund', 500000, 12, 150000, 5),
  startingBalanceRecord('general', 'home purchase fund', 1000000, 10, 200000, 5),
  startingBalanceRecord('vacation', 'vacation fund', 10000, 1, 1000, 2),
  startingBalanceRecord('vacation', 'vacation fund', 10000, 2, 2500, 2),
  startingBalanceRecord('vacation', 'vacation fund', 25000, 2, 2500, 2),
  startingBalanceRecord('vacation', 'vacation fund', 25000, 3, 5000, 3),
  startingBalanceRecord('vacation', 'vacation fund', 50000, 3, 5000, 3),
  startingBalanceRecord('vacation', 'vacation fund', 50000, 4, 10000, 3),
  startingBalanceRecord('vacation', 'vacation fund', 75000, 4, 10000, 3),
  startingBalanceRecord('vacation', 'vacation fund', 75000, 5, 15000, 4),
  startingBalanceRecord('vacation', 'vacation fund', 100000, 5, 15000, 4),
  startingBalanceRecord('vacation', 'vacation fund', 100000, 7, 25000, 4),
  startingBalanceRecord('vacation', 'vacation fund', 250000, 7, 50000, 4),
  startingBalanceRecord('vacation', 'vacation fund', 250000, 10, 75000, 5),
  startingBalanceRecord('vehicle', 'car purchase', 25000, 2, 2500, 3),
  startingBalanceRecord('vehicle', 'car purchase', 25000, 3, 5000, 3),
  startingBalanceRecord('vehicle', 'car purchase', 50000, 3, 5000, 3),
  startingBalanceRecord('vehicle', 'car purchase', 50000, 4, 10000, 4),
  startingBalanceRecord('vehicle', 'car purchase', 75000, 4, 10000, 4),
  startingBalanceRecord('vehicle', 'car purchase', 75000, 5, 15000, 4),
  startingBalanceRecord('vehicle', 'car purchase', 100000, 4, 15000, 4),
  startingBalanceRecord('vehicle', 'car purchase', 100000, 6, 25000, 5),
  startingBalanceRecord('vehicle', 'car purchase', 250000, 7, 50000, 5),
  startingBalanceRecord('vehicle', 'car purchase', 250000, 10, 75000, 5),
  startingBalanceRecord('vehicle', 'car purchase', 500000, 10, 100000, 5),
  startingBalanceRecord('vehicle', 'car purchase', 500000, 12, 150000, 5),
  startingBalanceRecord('general', 'wedding savings', 25000, 1, 2500, 2),
  startingBalanceRecord('general', 'wedding savings', 25000, 2, 5000, 3),
  startingBalanceRecord('general', 'wedding savings', 50000, 2, 5000, 3),
  startingBalanceRecord('general', 'wedding savings', 50000, 3, 10000, 3),
  startingBalanceRecord('general', 'wedding savings', 75000, 3, 10000, 3),
  startingBalanceRecord('general', 'wedding savings', 75000, 4, 15000, 4),
  startingBalanceRecord('general', 'wedding savings', 100000, 3, 15000, 4),
  startingBalanceRecord('general', 'wedding savings', 100000, 5, 25000, 4),
  startingBalanceRecord('general', 'wedding savings', 250000, 5, 50000, 4),
  startingBalanceRecord('general', 'wedding savings', 250000, 7, 75000, 5),
  startingBalanceRecord('general', 'education savings', 25000, 3, 2500, 4),
  startingBalanceRecord('general', 'education savings', 25000, 5, 5000, 5),
  startingBalanceRecord('general', 'education savings', 50000, 5, 5000, 5),
  startingBalanceRecord('general', 'education savings', 50000, 7, 10000, 5),
  startingBalanceRecord('general', 'education savings', 100000, 5, 10000, 5),
  startingBalanceRecord('general', 'education savings', 100000, 10, 25000, 6),
  startingBalanceRecord('general', 'education savings', 250000, 10, 25000, 6),
  startingBalanceRecord('general', 'education savings', 250000, 15, 50000, 6),
  startingBalanceRecord('general', 'education savings', 500000, 10, 75000, 6),
  startingBalanceRecord('general', 'education savings', 500000, 15, 100000, 6),
  startingBalanceRecord('general', 'education savings', 1000000, 15, 150000, 6),
  startingBalanceRecord('general', 'education savings', 1000000, 20, 250000, 7),
  startingBalanceRecord('retirement-age', 'retirement savings', 250000, 10, 25000, 5),
  startingBalanceRecord('retirement-age', 'retirement savings', 250000, 15, 50000, 6),
  startingBalanceRecord('retirement-age', 'retirement savings', 500000, 10, 50000, 5),
  startingBalanceRecord('retirement-age', 'retirement savings', 500000, 20, 100000, 6),
  startingBalanceRecord('retirement-age', 'retirement savings', 1000000, 15, 100000, 6),
  startingBalanceRecord('retirement-age', 'retirement savings', 1000000, 20, 250000, 7),
  startingBalanceRecord('retirement-age', 'retirement savings', 1000000, 30, 100000, 7),
  startingBalanceRecord('retirement-age', 'retirement savings', 250000, 20, 25000, 6),
  startingBalanceRecord('retirement-age', 'retirement savings', 500000, 15, 25000, 6),
  startingBalanceRecord('retirement-age', 'retirement savings', 500000, 30, 50000, 7),
  startingBalanceRecord('retirement-age', 'retirement savings', 1000000, 25, 50000, 7),
  startingBalanceRecord('retirement-age', 'retirement savings', 1000000, 35, 250000, 7),
];

export const savingsGoalSeoRecords: SavingsGoalSeoRecord[] = [
  ...generalScenarios.map(([amount, years]) =>
    generalRecord(
      amount,
      years,
      (amount === 10000 && years === 3) ||
        (amount === 100000 && years === 5) ||
        (amount === 250000 && years === 10),
    ),
  ),
  ...downPaymentScenarios.map(([amount, years]) =>
    purposeRecord(
      'down-payment',
      'house down payment',
      amount,
      years,
      3.5,
      amount === 50000 && years === 5,
    ),
  ),
  ...emergencyFundScenarios.map(([amount, years]) =>
    purposeRecord(
      'emergency-fund',
      'emergency fund',
      amount,
      years,
      3,
      amount === 15000 && years === 2,
    ),
  ),
  ...vacationScenarios.map(([amount, years]) =>
    purposeRecord(
      'vacation',
      'vacation fund',
      amount,
      years,
      2,
      amount === 5000 && years === 2,
    ),
  ),
  ...vehicleScenarios.map(([amount, years]) =>
    purposeRecord(
      'vehicle',
      'vehicle fund',
      amount,
      years,
      3,
      amount === 25000 && years === 3,
    ),
  ),
  ...retirementScenarios.map(([amount, currentAge, targetAge]) =>
    retirementRecord(
      amount,
      currentAge,
      targetAge,
      amount === 1000000 && currentAge === 35 && targetAge === 65,
    ),
  ),
  ...longTailSavingsGoalSeoRecords,
  ...startingBalanceSavingsGoalSeoRecords,
];

export const featuredSavingsGoalSeoRecords = savingsGoalSeoRecords.filter(
  (record) => record.featured,
);
