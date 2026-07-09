export type CreditCardExtraPaymentSeoIntent =
  | 'starter-balance'
  | 'average-balance'
  | 'high-apr'
  | 'aggressive-extra'
  | 'large-balance';

export interface CreditCardExtraPaymentSeoRecord {
  slug: string;
  question: string;
  intent: CreditCardExtraPaymentSeoIntent;
  balance: number;
  aprPercent: number;
  monthlyPayment: number;
  extraMonthlyPayment: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_CREDIT_CARD_EXTRA_PAYMENT_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) => String(rate).replace('.', '-');

function record(
  intent: CreditCardExtraPaymentSeoIntent,
  balance: number,
  aprPercent: number,
  monthlyPayment: number,
  extraMonthlyPayment: number,
  featured = false,
): CreditCardExtraPaymentSeoRecord {
  return {
    slug: `${intent}-${balance}-balance-at-${rateSlug(aprPercent)}-apr-${monthlyPayment}-payment-${extraMonthlyPayment}-extra`,
    question: `Extra Payment on ${money(balance)} at ${aprPercent}% APR Paying ${money(monthlyPayment)} Plus ${money(extraMonthlyPayment)} Extra`,
    intent,
    balance,
    aprPercent,
    monthlyPayment,
    extraMonthlyPayment,
    scenarioLabel: intent.replace(/-/g, ' '),
    featured,
  };
}

const starterBalances = [1000, 2000, 3000, 4000, 5000];
const starterScenarios = [
  { aprPercent: 14.99, monthlyPayment: 75, extraMonthlyPayment: 25 },
  { aprPercent: 16.99, monthlyPayment: 100, extraMonthlyPayment: 25 },
  { aprPercent: 18.99, monthlyPayment: 125, extraMonthlyPayment: 25 },
  { aprPercent: 19.99, monthlyPayment: 125, extraMonthlyPayment: 50 },
  { aprPercent: 21.99, monthlyPayment: 150, extraMonthlyPayment: 50 },
  { aprPercent: 23.99, monthlyPayment: 175, extraMonthlyPayment: 50 },
  { aprPercent: 24.99, monthlyPayment: 175, extraMonthlyPayment: 75 },
  { aprPercent: 26.99, monthlyPayment: 200, extraMonthlyPayment: 75 },
];

const averageBalances = [6000, 8000, 10000, 12000, 15000];
const averageScenarios = [
  { aprPercent: 14.99, monthlyPayment: 175, extraMonthlyPayment: 25 },
  { aprPercent: 16.99, monthlyPayment: 200, extraMonthlyPayment: 25 },
  { aprPercent: 18.99, monthlyPayment: 225, extraMonthlyPayment: 50 },
  { aprPercent: 19.99, monthlyPayment: 250, extraMonthlyPayment: 50 },
  { aprPercent: 21.99, monthlyPayment: 275, extraMonthlyPayment: 50 },
  { aprPercent: 23.99, monthlyPayment: 300, extraMonthlyPayment: 75 },
  { aprPercent: 24.99, monthlyPayment: 325, extraMonthlyPayment: 75 },
  { aprPercent: 26.99, monthlyPayment: 350, extraMonthlyPayment: 100 },
];

const highAprBalances = [3000, 5000, 7000, 9000, 12000];
const highAprScenarios = [
  { aprPercent: 22.99, monthlyPayment: 150, extraMonthlyPayment: 25 },
  { aprPercent: 24.99, monthlyPayment: 175, extraMonthlyPayment: 25 },
  { aprPercent: 26.99, monthlyPayment: 200, extraMonthlyPayment: 50 },
  { aprPercent: 27.99, monthlyPayment: 225, extraMonthlyPayment: 50 },
  { aprPercent: 28.99, monthlyPayment: 250, extraMonthlyPayment: 75 },
  { aprPercent: 29.99, monthlyPayment: 275, extraMonthlyPayment: 75 },
  { aprPercent: 31.99, monthlyPayment: 300, extraMonthlyPayment: 100 },
  { aprPercent: 34.99, monthlyPayment: 325, extraMonthlyPayment: 100 },
];

const aggressiveExtraBalances = [4000, 7000, 10000, 15000, 20000];
const aggressiveExtraScenarios = [
  { aprPercent: 15.99, monthlyPayment: 150, extraMonthlyPayment: 75 },
  { aprPercent: 17.99, monthlyPayment: 175, extraMonthlyPayment: 75 },
  { aprPercent: 19.99, monthlyPayment: 200, extraMonthlyPayment: 100 },
  { aprPercent: 21.99, monthlyPayment: 250, extraMonthlyPayment: 100 },
  { aprPercent: 22.99, monthlyPayment: 275, extraMonthlyPayment: 125 },
  { aprPercent: 24.99, monthlyPayment: 300, extraMonthlyPayment: 125 },
  { aprPercent: 26.99, monthlyPayment: 350, extraMonthlyPayment: 150 },
  { aprPercent: 28.99, monthlyPayment: 400, extraMonthlyPayment: 150 },
];

const largeBalanceBalances = [15000, 20000, 25000, 30000, 40000];
const largeBalanceScenarios = [
  { aprPercent: 14.99, monthlyPayment: 400, extraMonthlyPayment: 50 },
  { aprPercent: 16.99, monthlyPayment: 450, extraMonthlyPayment: 50 },
  { aprPercent: 18.99, monthlyPayment: 500, extraMonthlyPayment: 75 },
  { aprPercent: 19.99, monthlyPayment: 550, extraMonthlyPayment: 75 },
  { aprPercent: 21.99, monthlyPayment: 600, extraMonthlyPayment: 100 },
  { aprPercent: 22.99, monthlyPayment: 650, extraMonthlyPayment: 100 },
  { aprPercent: 24.99, monthlyPayment: 700, extraMonthlyPayment: 125 },
  { aprPercent: 26.99, monthlyPayment: 800, extraMonthlyPayment: 150 },
];

export const creditCardExtraPaymentSeoRecords: CreditCardExtraPaymentSeoRecord[] =
  [
    ...starterBalances.flatMap((balance) =>
      starterScenarios.map((scenario) =>
        record(
          'starter-balance',
          balance,
          scenario.aprPercent,
          scenario.monthlyPayment,
          scenario.extraMonthlyPayment,
          balance === 3000 &&
            scenario.aprPercent === 18.99 &&
            scenario.extraMonthlyPayment === 25,
        ),
      ),
    ),
    ...averageBalances.flatMap((balance) =>
      averageScenarios.map((scenario) =>
        record(
          'average-balance',
          balance,
          scenario.aprPercent,
          scenario.monthlyPayment,
          scenario.extraMonthlyPayment,
        ),
      ),
    ),
    ...highAprBalances.flatMap((balance) =>
      highAprScenarios.map((scenario) =>
        record(
          'high-apr',
          balance,
          scenario.aprPercent,
          scenario.monthlyPayment,
          scenario.extraMonthlyPayment,
        ),
      ),
    ),
    ...aggressiveExtraBalances.flatMap((balance) =>
      aggressiveExtraScenarios.map((scenario) =>
        record(
          'aggressive-extra',
          balance,
          scenario.aprPercent,
          scenario.monthlyPayment,
          scenario.extraMonthlyPayment,
        ),
      ),
    ),
    ...largeBalanceBalances.flatMap((balance) =>
      largeBalanceScenarios.map((scenario) =>
        record(
          'large-balance',
          balance,
          scenario.aprPercent,
          scenario.monthlyPayment,
          scenario.extraMonthlyPayment,
        ),
      ),
    ),
  ];

export const featuredCreditCardExtraPaymentSeoRecords = creditCardExtraPaymentSeoRecords.filter((record) =>
  [
    'starter-balance-3000-balance-at-21-99-apr-150-payment-50-extra',
    'average-balance-10000-balance-at-21-99-apr-275-payment-50-extra',
    'high-apr-7000-balance-at-28-99-apr-250-payment-75-extra',
    'aggressive-extra-10000-balance-at-22-99-apr-275-payment-125-extra',
    'large-balance-25000-balance-at-21-99-apr-600-payment-100-extra',
  ].includes(record.slug),
);
