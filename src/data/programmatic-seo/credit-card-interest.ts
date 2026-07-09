export type CreditCardInterestSeoIntent =
  | 'monthly-interest'
  | 'payoff-timeline'
  | 'extra-payment'
  | 'high-apr'
  | 'large-balance';

export interface CreditCardInterestSeoRecord {
  slug: string;
  question: string;
  intent: CreditCardInterestSeoIntent;
  balance: number;
  aprPercent: number;
  monthlyPayment: number;
  extraMonthlyPayment: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_CREDIT_CARD_INTEREST_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) => String(rate).replace('.', '-');

function record(
  intent: CreditCardInterestSeoIntent,
  balance: number,
  aprPercent: number,
  monthlyPayment: number,
  extraMonthlyPayment: number,
  featured = false,
): CreditCardInterestSeoRecord {
  const extraSuffix =
    extraMonthlyPayment > 0 ? `-with-${extraMonthlyPayment}-extra` : '';
  const extraQuestion =
    extraMonthlyPayment > 0 ? ` and ${money(extraMonthlyPayment)} Extra` : '';

  return {
    slug: `${intent}-${balance}-balance-at-${rateSlug(aprPercent)}-apr-paying-${monthlyPayment}${extraSuffix}`,
    question: `Credit Card Interest on ${money(balance)} at ${aprPercent}% APR Paying ${money(monthlyPayment)}${extraQuestion} per Month`,
    intent,
    balance,
    aprPercent,
    monthlyPayment,
    extraMonthlyPayment,
    scenarioLabel: intent.replace(/-/g, ' '),
    featured,
  };
}

const monthlyInterestBalances = [1000, 2500, 5000, 7500, 10000];
const monthlyInterestScenarios = [
  { aprPercent: 14.99, monthlyPayment: 75, extraMonthlyPayment: 0 },
  { aprPercent: 16.99, monthlyPayment: 100, extraMonthlyPayment: 0 },
  { aprPercent: 18.99, monthlyPayment: 125, extraMonthlyPayment: 0 },
  { aprPercent: 19.99, monthlyPayment: 150, extraMonthlyPayment: 0 },
  { aprPercent: 21.99, monthlyPayment: 175, extraMonthlyPayment: 25 },
  { aprPercent: 23.99, monthlyPayment: 200, extraMonthlyPayment: 25 },
  { aprPercent: 24.99, monthlyPayment: 225, extraMonthlyPayment: 50 },
  { aprPercent: 26.99, monthlyPayment: 250, extraMonthlyPayment: 50 },
];

const payoffTimelineBalances = [3000, 5000, 7000, 9000, 12000];
const payoffTimelineScenarios = [
  { aprPercent: 12.99, monthlyPayment: 100, extraMonthlyPayment: 0 },
  { aprPercent: 14.99, monthlyPayment: 125, extraMonthlyPayment: 0 },
  { aprPercent: 16.99, monthlyPayment: 150, extraMonthlyPayment: 25 },
  { aprPercent: 18.99, monthlyPayment: 175, extraMonthlyPayment: 25 },
  { aprPercent: 19.99, monthlyPayment: 200, extraMonthlyPayment: 25 },
  { aprPercent: 21.99, monthlyPayment: 225, extraMonthlyPayment: 50 },
  { aprPercent: 23.99, monthlyPayment: 250, extraMonthlyPayment: 50 },
  { aprPercent: 24.99, monthlyPayment: 275, extraMonthlyPayment: 75 },
];

const extraPaymentBalances = [4000, 6000, 8000, 10000, 15000];
const extraPaymentScenarios = [
  { aprPercent: 15.99, monthlyPayment: 125, extraMonthlyPayment: 25 },
  { aprPercent: 17.99, monthlyPayment: 150, extraMonthlyPayment: 25 },
  { aprPercent: 19.99, monthlyPayment: 175, extraMonthlyPayment: 50 },
  { aprPercent: 21.99, monthlyPayment: 200, extraMonthlyPayment: 50 },
  { aprPercent: 22.99, monthlyPayment: 225, extraMonthlyPayment: 75 },
  { aprPercent: 24.99, monthlyPayment: 250, extraMonthlyPayment: 75 },
  { aprPercent: 26.99, monthlyPayment: 275, extraMonthlyPayment: 100 },
  { aprPercent: 28.99, monthlyPayment: 300, extraMonthlyPayment: 100 },
];

const highAprBalances = [2000, 4000, 6000, 8000, 10000];
const highAprScenarios = [
  { aprPercent: 22.99, monthlyPayment: 100, extraMonthlyPayment: 0 },
  { aprPercent: 24.99, monthlyPayment: 125, extraMonthlyPayment: 0 },
  { aprPercent: 26.99, monthlyPayment: 150, extraMonthlyPayment: 25 },
  { aprPercent: 27.99, monthlyPayment: 175, extraMonthlyPayment: 25 },
  { aprPercent: 28.99, monthlyPayment: 200, extraMonthlyPayment: 25 },
  { aprPercent: 29.99, monthlyPayment: 225, extraMonthlyPayment: 50 },
  { aprPercent: 31.99, monthlyPayment: 250, extraMonthlyPayment: 50 },
  { aprPercent: 34.99, monthlyPayment: 275, extraMonthlyPayment: 75 },
];

const largeBalanceBalances = [12000, 15000, 20000, 25000, 30000];
const largeBalanceScenarios = [
  { aprPercent: 14.99, monthlyPayment: 300, extraMonthlyPayment: 25 },
  { aprPercent: 16.99, monthlyPayment: 350, extraMonthlyPayment: 25 },
  { aprPercent: 18.99, monthlyPayment: 400, extraMonthlyPayment: 50 },
  { aprPercent: 19.99, monthlyPayment: 450, extraMonthlyPayment: 50 },
  { aprPercent: 21.99, monthlyPayment: 500, extraMonthlyPayment: 75 },
  { aprPercent: 22.99, monthlyPayment: 550, extraMonthlyPayment: 75 },
  { aprPercent: 24.99, monthlyPayment: 600, extraMonthlyPayment: 100 },
  { aprPercent: 26.99, monthlyPayment: 650, extraMonthlyPayment: 100 },
];

export const creditCardInterestSeoRecords: CreditCardInterestSeoRecord[] = [
  ...monthlyInterestBalances.flatMap((balance) =>
    monthlyInterestScenarios.map((scenario) =>
      record(
        'monthly-interest',
        balance,
        scenario.aprPercent,
        scenario.monthlyPayment,
        scenario.extraMonthlyPayment,
        balance === 5000 &&
          scenario.aprPercent === 24.99 &&
          scenario.monthlyPayment === 225,
      ),
    ),
  ),
  ...payoffTimelineBalances.flatMap((balance) =>
    payoffTimelineScenarios.map((scenario) =>
      record(
        'payoff-timeline',
        balance,
        scenario.aprPercent,
        scenario.monthlyPayment,
        scenario.extraMonthlyPayment,
      ),
    ),
  ),
  ...extraPaymentBalances.flatMap((balance) =>
    extraPaymentScenarios.map((scenario) =>
      record(
        'extra-payment',
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

export const featuredCreditCardInterestSeoRecords = creditCardInterestSeoRecords.filter((record) =>
  [
    'monthly-interest-5000-balance-at-21-99-apr-paying-175-with-25-extra',
    'payoff-timeline-7000-balance-at-19-99-apr-paying-200-with-25-extra',
    'extra-payment-8000-balance-at-22-99-apr-paying-225-with-75-extra',
    'high-apr-6000-balance-at-28-99-apr-paying-200-with-25-extra',
    'large-balance-20000-balance-at-21-99-apr-paying-500-with-75-extra',
  ].includes(record.slug),
);
