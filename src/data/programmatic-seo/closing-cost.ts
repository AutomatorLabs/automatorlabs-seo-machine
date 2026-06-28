export type ClosingCostSeoIntent =
  | 'starter-home'
  | 'conventional'
  | 'lender-credit'
  | 'high-prepaids'
  | 'jumbo-home';

export interface ClosingCostSeoRecord {
  slug: string;
  question: string;
  intent: ClosingCostSeoIntent;
  homePurchasePrice: number;
  downPayment: number;
  closingCostPercent: number;
  fixedClosingCosts: number;
  prepaidEscrowAndTaxes: number;
  lenderCredits: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_CLOSING_COST_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) => String(rate).replace('.', '-');

function record(
  intent: ClosingCostSeoIntent,
  homePurchasePrice: number,
  downPayment: number,
  closingCostPercent: number,
  fixedClosingCosts: number,
  prepaidEscrowAndTaxes: number,
  lenderCredits: number,
  featured = false,
): ClosingCostSeoRecord {
  return {
    slug: `${intent}-${homePurchasePrice}-price-${downPayment}-down-${rateSlug(closingCostPercent)}-closing-${fixedClosingCosts}-fixed-${prepaidEscrowAndTaxes}-prepaids-${lenderCredits}-credits`,
    question: `${intent.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())} Closing Costs on ${money(homePurchasePrice)} With ${money(downPayment)} Down and ${closingCostPercent}% Variable Costs`,
    intent,
    homePurchasePrice,
    downPayment,
    closingCostPercent,
    fixedClosingCosts,
    prepaidEscrowAndTaxes,
    lenderCredits,
    scenarioLabel: intent.replace(/-/g, ' '),
    featured,
  };
}

const starterPrices = [250000, 300000, 350000, 400000, 450000];
const starterScenarios = [
  { downPaymentRate: 0.03, closingCostPercent: 1.5, fixedClosingCosts: 2500, prepaidEscrowAndTaxes: 3000, lenderCredits: 0 },
  { downPaymentRate: 0.05, closingCostPercent: 1.75, fixedClosingCosts: 3000, prepaidEscrowAndTaxes: 3500, lenderCredits: 0 },
  { downPaymentRate: 0.1, closingCostPercent: 2, fixedClosingCosts: 3500, prepaidEscrowAndTaxes: 4000, lenderCredits: 0 },
  { downPaymentRate: 0.1, closingCostPercent: 2.25, fixedClosingCosts: 4000, prepaidEscrowAndTaxes: 4500, lenderCredits: 500 },
  { downPaymentRate: 0.15, closingCostPercent: 2.5, fixedClosingCosts: 4500, prepaidEscrowAndTaxes: 5000, lenderCredits: 500 },
  { downPaymentRate: 0.2, closingCostPercent: 2.75, fixedClosingCosts: 5000, prepaidEscrowAndTaxes: 5500, lenderCredits: 1000 },
  { downPaymentRate: 0.2, closingCostPercent: 3, fixedClosingCosts: 5500, prepaidEscrowAndTaxes: 6000, lenderCredits: 1000 },
  { downPaymentRate: 0.25, closingCostPercent: 3.25, fixedClosingCosts: 6000, prepaidEscrowAndTaxes: 6500, lenderCredits: 1500 },
];

const conventionalPrices = [500000, 600000, 700000, 800000, 900000];
const conventionalScenarios = [
  { downPaymentRate: 0.1, closingCostPercent: 1.75, fixedClosingCosts: 3500, prepaidEscrowAndTaxes: 5000, lenderCredits: 0 },
  { downPaymentRate: 0.15, closingCostPercent: 2, fixedClosingCosts: 4000, prepaidEscrowAndTaxes: 5500, lenderCredits: 0 },
  { downPaymentRate: 0.2, closingCostPercent: 2.25, fixedClosingCosts: 4500, prepaidEscrowAndTaxes: 6000, lenderCredits: 0 },
  { downPaymentRate: 0.2, closingCostPercent: 2.5, fixedClosingCosts: 5000, prepaidEscrowAndTaxes: 7000, lenderCredits: 500 },
  { downPaymentRate: 0.25, closingCostPercent: 2.5, fixedClosingCosts: 5500, prepaidEscrowAndTaxes: 7500, lenderCredits: 500 },
  { downPaymentRate: 0.25, closingCostPercent: 2.75, fixedClosingCosts: 6000, prepaidEscrowAndTaxes: 8000, lenderCredits: 1000 },
  { downPaymentRate: 0.3, closingCostPercent: 3, fixedClosingCosts: 6500, prepaidEscrowAndTaxes: 8500, lenderCredits: 1000 },
  { downPaymentRate: 0.3, closingCostPercent: 3.25, fixedClosingCosts: 7000, prepaidEscrowAndTaxes: 9000, lenderCredits: 1500 },
];

const lenderCreditPrices = [300000, 450000, 600000, 750000, 900000];
const lenderCreditScenarios = [
  { downPaymentRate: 0.05, closingCostPercent: 2, fixedClosingCosts: 3500, prepaidEscrowAndTaxes: 4000, lenderCredits: 1000 },
  { downPaymentRate: 0.1, closingCostPercent: 2.25, fixedClosingCosts: 4000, prepaidEscrowAndTaxes: 5000, lenderCredits: 1500 },
  { downPaymentRate: 0.15, closingCostPercent: 2.5, fixedClosingCosts: 4500, prepaidEscrowAndTaxes: 6000, lenderCredits: 2000 },
  { downPaymentRate: 0.2, closingCostPercent: 2.5, fixedClosingCosts: 5000, prepaidEscrowAndTaxes: 7000, lenderCredits: 2500 },
  { downPaymentRate: 0.2, closingCostPercent: 2.75, fixedClosingCosts: 5500, prepaidEscrowAndTaxes: 8000, lenderCredits: 3000 },
  { downPaymentRate: 0.25, closingCostPercent: 3, fixedClosingCosts: 6000, prepaidEscrowAndTaxes: 9000, lenderCredits: 3500 },
  { downPaymentRate: 0.3, closingCostPercent: 3, fixedClosingCosts: 6500, prepaidEscrowAndTaxes: 10000, lenderCredits: 4000 },
  { downPaymentRate: 0.3, closingCostPercent: 3.25, fixedClosingCosts: 7000, prepaidEscrowAndTaxes: 11000, lenderCredits: 5000 },
];

const highPrepaidsPrices = [350000, 500000, 650000, 800000, 950000];
const highPrepaidsScenarios = [
  { downPaymentRate: 0.1, closingCostPercent: 1.75, fixedClosingCosts: 3500, prepaidEscrowAndTaxes: 7000, lenderCredits: 0 },
  { downPaymentRate: 0.15, closingCostPercent: 2, fixedClosingCosts: 4000, prepaidEscrowAndTaxes: 8000, lenderCredits: 0 },
  { downPaymentRate: 0.2, closingCostPercent: 2.25, fixedClosingCosts: 4500, prepaidEscrowAndTaxes: 9000, lenderCredits: 500 },
  { downPaymentRate: 0.2, closingCostPercent: 2.5, fixedClosingCosts: 5000, prepaidEscrowAndTaxes: 10000, lenderCredits: 500 },
  { downPaymentRate: 0.25, closingCostPercent: 2.75, fixedClosingCosts: 5500, prepaidEscrowAndTaxes: 11000, lenderCredits: 1000 },
  { downPaymentRate: 0.25, closingCostPercent: 3, fixedClosingCosts: 6000, prepaidEscrowAndTaxes: 12000, lenderCredits: 1000 },
  { downPaymentRate: 0.3, closingCostPercent: 3, fixedClosingCosts: 6500, prepaidEscrowAndTaxes: 13000, lenderCredits: 1500 },
  { downPaymentRate: 0.3, closingCostPercent: 3.25, fixedClosingCosts: 7000, prepaidEscrowAndTaxes: 14000, lenderCredits: 1500 },
];

const jumboPrices = [1000000, 1250000, 1500000, 1750000, 2000000];
const jumboScenarios = [
  { downPaymentRate: 0.1, closingCostPercent: 2, fixedClosingCosts: 6000, prepaidEscrowAndTaxes: 9000, lenderCredits: 0 },
  { downPaymentRate: 0.15, closingCostPercent: 2.25, fixedClosingCosts: 7000, prepaidEscrowAndTaxes: 11000, lenderCredits: 0 },
  { downPaymentRate: 0.2, closingCostPercent: 2.5, fixedClosingCosts: 8000, prepaidEscrowAndTaxes: 13000, lenderCredits: 0 },
  { downPaymentRate: 0.2, closingCostPercent: 2.75, fixedClosingCosts: 9000, prepaidEscrowAndTaxes: 15000, lenderCredits: 1000 },
  { downPaymentRate: 0.25, closingCostPercent: 3, fixedClosingCosts: 10000, prepaidEscrowAndTaxes: 17000, lenderCredits: 1000 },
  { downPaymentRate: 0.3, closingCostPercent: 3, fixedClosingCosts: 11000, prepaidEscrowAndTaxes: 19000, lenderCredits: 1500 },
  { downPaymentRate: 0.3, closingCostPercent: 3.25, fixedClosingCosts: 12000, prepaidEscrowAndTaxes: 21000, lenderCredits: 2000 },
  { downPaymentRate: 0.35, closingCostPercent: 3.5, fixedClosingCosts: 13000, prepaidEscrowAndTaxes: 23000, lenderCredits: 2500 },
];

function downPayment(price: number, downPaymentRate: number): number {
  return Math.round(price * downPaymentRate);
}

export const closingCostSeoRecords: ClosingCostSeoRecord[] = [
  ...starterPrices.flatMap((homePurchasePrice) =>
    starterScenarios.map((scenario) =>
      record(
        'starter-home',
        homePurchasePrice,
        downPayment(homePurchasePrice, scenario.downPaymentRate),
        scenario.closingCostPercent,
        scenario.fixedClosingCosts,
        scenario.prepaidEscrowAndTaxes,
        scenario.lenderCredits,
        homePurchasePrice === 350000 &&
          scenario.closingCostPercent === 2 &&
          scenario.fixedClosingCosts === 3500,
      ),
    ),
  ),
  ...conventionalPrices.flatMap((homePurchasePrice) =>
    conventionalScenarios.map((scenario) =>
      record(
        'conventional',
        homePurchasePrice,
        downPayment(homePurchasePrice, scenario.downPaymentRate),
        scenario.closingCostPercent,
        scenario.fixedClosingCosts,
        scenario.prepaidEscrowAndTaxes,
        scenario.lenderCredits,
      ),
    ),
  ),
  ...lenderCreditPrices.flatMap((homePurchasePrice) =>
    lenderCreditScenarios.map((scenario) =>
      record(
        'lender-credit',
        homePurchasePrice,
        downPayment(homePurchasePrice, scenario.downPaymentRate),
        scenario.closingCostPercent,
        scenario.fixedClosingCosts,
        scenario.prepaidEscrowAndTaxes,
        scenario.lenderCredits,
      ),
    ),
  ),
  ...highPrepaidsPrices.flatMap((homePurchasePrice) =>
    highPrepaidsScenarios.map((scenario) =>
      record(
        'high-prepaids',
        homePurchasePrice,
        downPayment(homePurchasePrice, scenario.downPaymentRate),
        scenario.closingCostPercent,
        scenario.fixedClosingCosts,
        scenario.prepaidEscrowAndTaxes,
        scenario.lenderCredits,
      ),
    ),
  ),
  ...jumboPrices.flatMap((homePurchasePrice) =>
    jumboScenarios.map((scenario) =>
      record(
        'jumbo-home',
        homePurchasePrice,
        downPayment(homePurchasePrice, scenario.downPaymentRate),
        scenario.closingCostPercent,
        scenario.fixedClosingCosts,
        scenario.prepaidEscrowAndTaxes,
        scenario.lenderCredits,
      ),
    ),
  ),
];
