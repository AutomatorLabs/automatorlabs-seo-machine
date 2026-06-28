export type CreditCardMinimumPaymentSeoIntent =
  | 'starter-balance'
  | 'average-balance'
  | 'high-apr'
  | 'low-floor'
  | 'higher-percent';

export interface CreditCardMinimumPaymentSeoRecord {
  slug: string;
  question: string;
  intent: CreditCardMinimumPaymentSeoIntent;
  balance: number;
  aprPercent: number;
  minimumPaymentPercent: number;
  minimumPaymentFloor: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_CREDIT_CARD_MINIMUM_PAYMENT_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) => String(rate).replace('.', '-');

function record(
  intent: CreditCardMinimumPaymentSeoIntent,
  balance: number,
  aprPercent: number,
  minimumPaymentPercent: number,
  minimumPaymentFloor: number,
  featured = false,
): CreditCardMinimumPaymentSeoRecord {
  return {
    slug: `${intent}-${balance}-balance-at-${rateSlug(aprPercent)}-apr-${rateSlug(minimumPaymentPercent)}-percent-minimum-${minimumPaymentFloor}-floor`,
    question: `Minimum Payment on ${money(balance)} at ${aprPercent}% APR With a ${minimumPaymentPercent}% Minimum and ${money(minimumPaymentFloor)} Floor`,
    intent,
    balance,
    aprPercent,
    minimumPaymentPercent,
    minimumPaymentFloor,
    scenarioLabel: intent.replace(/-/g, ' '),
    featured,
  };
}

const starterBalances = [500, 1000, 1500, 2000, 2500];
const starterScenarios = [
  { aprPercent: 14.99, minimumPaymentPercent: 1.5, minimumPaymentFloor: 25 },
  { aprPercent: 16.99, minimumPaymentPercent: 1.75, minimumPaymentFloor: 25 },
  { aprPercent: 18.99, minimumPaymentPercent: 2, minimumPaymentFloor: 25 },
  { aprPercent: 19.99, minimumPaymentPercent: 2, minimumPaymentFloor: 35 },
  { aprPercent: 21.99, minimumPaymentPercent: 2.25, minimumPaymentFloor: 35 },
  { aprPercent: 23.99, minimumPaymentPercent: 2.5, minimumPaymentFloor: 35 },
  { aprPercent: 24.99, minimumPaymentPercent: 2.5, minimumPaymentFloor: 40 },
  { aprPercent: 26.99, minimumPaymentPercent: 3, minimumPaymentFloor: 40 },
];

const averageBalances = [3000, 5000, 7000, 9000, 12000];
const averageScenarios = [
  { aprPercent: 14.99, minimumPaymentPercent: 1.5, minimumPaymentFloor: 35 },
  { aprPercent: 16.99, minimumPaymentPercent: 1.75, minimumPaymentFloor: 35 },
  { aprPercent: 18.99, minimumPaymentPercent: 2, minimumPaymentFloor: 35 },
  { aprPercent: 19.99, minimumPaymentPercent: 2, minimumPaymentFloor: 40 },
  { aprPercent: 21.99, minimumPaymentPercent: 2.25, minimumPaymentFloor: 40 },
  { aprPercent: 23.99, minimumPaymentPercent: 2.5, minimumPaymentFloor: 40 },
  { aprPercent: 24.99, minimumPaymentPercent: 2.75, minimumPaymentFloor: 45 },
  { aprPercent: 26.99, minimumPaymentPercent: 3, minimumPaymentFloor: 50 },
];

const highAprBalances = [1500, 3000, 5000, 8000, 10000];
const highAprScenarios = [
  { aprPercent: 22.99, minimumPaymentPercent: 1.5, minimumPaymentFloor: 35 },
  { aprPercent: 24.99, minimumPaymentPercent: 1.75, minimumPaymentFloor: 35 },
  { aprPercent: 26.99, minimumPaymentPercent: 2, minimumPaymentFloor: 40 },
  { aprPercent: 27.99, minimumPaymentPercent: 2, minimumPaymentFloor: 45 },
  { aprPercent: 28.99, minimumPaymentPercent: 2.25, minimumPaymentFloor: 45 },
  { aprPercent: 29.99, minimumPaymentPercent: 2.5, minimumPaymentFloor: 50 },
  { aprPercent: 31.99, minimumPaymentPercent: 2.75, minimumPaymentFloor: 50 },
  { aprPercent: 34.99, minimumPaymentPercent: 3, minimumPaymentFloor: 60 },
];

const lowFloorBalances = [1000, 2500, 5000, 7500, 10000];
const lowFloorScenarios = [
  { aprPercent: 12.99, minimumPaymentPercent: 1, minimumPaymentFloor: 15 },
  { aprPercent: 14.99, minimumPaymentPercent: 1.25, minimumPaymentFloor: 20 },
  { aprPercent: 16.99, minimumPaymentPercent: 1.5, minimumPaymentFloor: 20 },
  { aprPercent: 18.99, minimumPaymentPercent: 1.5, minimumPaymentFloor: 25 },
  { aprPercent: 19.99, minimumPaymentPercent: 1.75, minimumPaymentFloor: 25 },
  { aprPercent: 21.99, minimumPaymentPercent: 2, minimumPaymentFloor: 25 },
  { aprPercent: 23.99, minimumPaymentPercent: 2.25, minimumPaymentFloor: 30 },
  { aprPercent: 24.99, minimumPaymentPercent: 2.5, minimumPaymentFloor: 30 },
];

const higherPercentBalances = [2000, 4000, 6000, 8000, 12000];
const higherPercentScenarios = [
  { aprPercent: 12.99, minimumPaymentPercent: 2.5, minimumPaymentFloor: 35 },
  { aprPercent: 14.99, minimumPaymentPercent: 3, minimumPaymentFloor: 35 },
  { aprPercent: 16.99, minimumPaymentPercent: 3, minimumPaymentFloor: 40 },
  { aprPercent: 18.99, minimumPaymentPercent: 3.5, minimumPaymentFloor: 40 },
  { aprPercent: 19.99, minimumPaymentPercent: 3.5, minimumPaymentFloor: 45 },
  { aprPercent: 21.99, minimumPaymentPercent: 4, minimumPaymentFloor: 45 },
  { aprPercent: 23.99, minimumPaymentPercent: 4, minimumPaymentFloor: 50 },
  { aprPercent: 24.99, minimumPaymentPercent: 4.5, minimumPaymentFloor: 50 },
];

export const creditCardMinimumPaymentSeoRecords: CreditCardMinimumPaymentSeoRecord[] =
  [
    ...starterBalances.flatMap((balance) =>
      starterScenarios.map((scenario) =>
        record(
          'starter-balance',
          balance,
          scenario.aprPercent,
          scenario.minimumPaymentPercent,
          scenario.minimumPaymentFloor,
          balance === 1500 &&
            scenario.aprPercent === 18.99 &&
            scenario.minimumPaymentPercent === 2,
        ),
      ),
    ),
    ...averageBalances.flatMap((balance) =>
      averageScenarios.map((scenario) =>
        record(
          'average-balance',
          balance,
          scenario.aprPercent,
          scenario.minimumPaymentPercent,
          scenario.minimumPaymentFloor,
        ),
      ),
    ),
    ...highAprBalances.flatMap((balance) =>
      highAprScenarios.map((scenario) =>
        record(
          'high-apr',
          balance,
          scenario.aprPercent,
          scenario.minimumPaymentPercent,
          scenario.minimumPaymentFloor,
        ),
      ),
    ),
    ...lowFloorBalances.flatMap((balance) =>
      lowFloorScenarios.map((scenario) =>
        record(
          'low-floor',
          balance,
          scenario.aprPercent,
          scenario.minimumPaymentPercent,
          scenario.minimumPaymentFloor,
        ),
      ),
    ),
    ...higherPercentBalances.flatMap((balance) =>
      higherPercentScenarios.map((scenario) =>
        record(
          'higher-percent',
          balance,
          scenario.aprPercent,
          scenario.minimumPaymentPercent,
          scenario.minimumPaymentFloor,
        ),
      ),
    ),
  ];
