export type RentVsBuySeoIntent =
  | 'starter-home'
  | 'high-cost-metro'
  | 'short-hold'
  | 'long-hold'
  | 'high-rent-market';

export interface RentVsBuySeoRecord {
  slug: string;
  question: string;
  intent: RentVsBuySeoIntent;
  monthlyRent: number;
  homePurchasePrice: number;
  downPayment: number;
  mortgageInterestRatePercent: number;
  loanTermYears: number;
  propertyTaxRatePercent: number;
  homeInsurancePerYear: number;
  hoaPerMonth: number;
  maintenanceRatePercent: number;
  homeAppreciationPercent: number;
  investmentReturnPercent: number;
  comparisonYears: number;
  scenarioLabel: string;
}

export const EXPECTED_RENT_VS_BUY_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) => String(rate).replace('.', '-');

interface RentVsBuyHousingProfile {
  loanTermYears: number;
  propertyTaxRatePercent: number;
  homeInsurancePerYear: number;
  hoaPerMonth: number;
  maintenanceRatePercent: number;
  downPaymentRatePercent: number;
}

interface RentVsBuyLeverBundle {
  mortgageInterestRatePercent: number;
  homeAppreciationPercent: number;
  investmentReturnPercent: number;
  comparisonYears: number;
}

const intentLabels: Record<RentVsBuySeoIntent, string> = {
  'starter-home': 'Starter-Home',
  'high-cost-metro': 'High-Cost-Metro',
  'short-hold': 'Short-Hold',
  'long-hold': 'Long-Hold',
  'high-rent-market': 'High-Rent-Market',
};

const housingProfiles: Record<RentVsBuySeoIntent, RentVsBuyHousingProfile> = {
  'starter-home': {
    loanTermYears: 30,
    propertyTaxRatePercent: 1.1,
    homeInsurancePerYear: 1800,
    hoaPerMonth: 0,
    maintenanceRatePercent: 1.0,
    downPaymentRatePercent: 10,
  },
  'high-cost-metro': {
    loanTermYears: 30,
    propertyTaxRatePercent: 1.3,
    homeInsurancePerYear: 2800,
    hoaPerMonth: 450,
    maintenanceRatePercent: 1.0,
    downPaymentRatePercent: 20,
  },
  'short-hold': {
    loanTermYears: 30,
    propertyTaxRatePercent: 1.15,
    homeInsurancePerYear: 1900,
    hoaPerMonth: 150,
    maintenanceRatePercent: 1.0,
    downPaymentRatePercent: 10,
  },
  'long-hold': {
    loanTermYears: 30,
    propertyTaxRatePercent: 1.2,
    homeInsurancePerYear: 2100,
    hoaPerMonth: 100,
    maintenanceRatePercent: 1.1,
    downPaymentRatePercent: 20,
  },
  'high-rent-market': {
    loanTermYears: 30,
    propertyTaxRatePercent: 1.1,
    homeInsurancePerYear: 1900,
    hoaPerMonth: 0,
    maintenanceRatePercent: 1.0,
    downPaymentRatePercent: 15,
  },
};

const pricesAndRents: Record<
  RentVsBuySeoIntent,
  { homePurchasePrice: number; monthlyRent: number }[]
> = {
  'starter-home': [
    { homePurchasePrice: 250000, monthlyRent: 1500 },
    { homePurchasePrice: 300000, monthlyRent: 1700 },
    { homePurchasePrice: 350000, monthlyRent: 1900 },
    { homePurchasePrice: 400000, monthlyRent: 2100 },
    { homePurchasePrice: 450000, monthlyRent: 2300 },
  ],
  'high-cost-metro': [
    { homePurchasePrice: 700000, monthlyRent: 2800 },
    { homePurchasePrice: 850000, monthlyRent: 3200 },
    { homePurchasePrice: 1000000, monthlyRent: 3600 },
    { homePurchasePrice: 1200000, monthlyRent: 4200 },
    { homePurchasePrice: 1500000, monthlyRent: 5000 },
  ],
  'short-hold': [
    { homePurchasePrice: 275000, monthlyRent: 1600 },
    { homePurchasePrice: 325000, monthlyRent: 1800 },
    { homePurchasePrice: 375000, monthlyRent: 2000 },
    { homePurchasePrice: 425000, monthlyRent: 2200 },
    { homePurchasePrice: 500000, monthlyRent: 2600 },
  ],
  'long-hold': [
    { homePurchasePrice: 350000, monthlyRent: 1900 },
    { homePurchasePrice: 450000, monthlyRent: 2300 },
    { homePurchasePrice: 550000, monthlyRent: 2700 },
    { homePurchasePrice: 650000, monthlyRent: 3100 },
    { homePurchasePrice: 800000, monthlyRent: 3600 },
  ],
  'high-rent-market': [
    { homePurchasePrice: 300000, monthlyRent: 2200 },
    { homePurchasePrice: 350000, monthlyRent: 2500 },
    { homePurchasePrice: 400000, monthlyRent: 2800 },
    { homePurchasePrice: 450000, monthlyRent: 3100 },
    { homePurchasePrice: 500000, monthlyRent: 3400 },
  ],
};

const leverBundles: Record<RentVsBuySeoIntent, RentVsBuyLeverBundle[]> = {
  'starter-home': [
    { mortgageInterestRatePercent: 6.0, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.0, comparisonYears: 5 },
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.0, comparisonYears: 6 },
    { mortgageInterestRatePercent: 6.75, homeAppreciationPercent: 3.5, investmentReturnPercent: 7.0, comparisonYears: 7 },
    { mortgageInterestRatePercent: 7.0, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.5, comparisonYears: 7 },
    { mortgageInterestRatePercent: 6.25, homeAppreciationPercent: 4.0, investmentReturnPercent: 6.5, comparisonYears: 8 },
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 2.5, investmentReturnPercent: 8.0, comparisonYears: 8 },
    { mortgageInterestRatePercent: 7.25, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.0, comparisonYears: 9 },
    { mortgageInterestRatePercent: 6.0, homeAppreciationPercent: 3.5, investmentReturnPercent: 7.0, comparisonYears: 10 },
  ],
  'high-cost-metro': [
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 4.0, investmentReturnPercent: 7.0, comparisonYears: 5 },
    { mortgageInterestRatePercent: 6.75, homeAppreciationPercent: 4.5, investmentReturnPercent: 7.0, comparisonYears: 6 },
    { mortgageInterestRatePercent: 7.0, homeAppreciationPercent: 3.5, investmentReturnPercent: 7.5, comparisonYears: 7 },
    { mortgageInterestRatePercent: 7.25, homeAppreciationPercent: 5.0, investmentReturnPercent: 7.0, comparisonYears: 7 },
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 3.0, investmentReturnPercent: 8.0, comparisonYears: 8 },
    { mortgageInterestRatePercent: 7.5, homeAppreciationPercent: 4.0, investmentReturnPercent: 7.0, comparisonYears: 8 },
    { mortgageInterestRatePercent: 6.75, homeAppreciationPercent: 4.5, investmentReturnPercent: 6.5, comparisonYears: 9 },
    { mortgageInterestRatePercent: 7.0, homeAppreciationPercent: 3.5, investmentReturnPercent: 7.5, comparisonYears: 10 },
  ],
  'short-hold': [
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.0, comparisonYears: 2 },
    { mortgageInterestRatePercent: 6.75, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.0, comparisonYears: 2 },
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 3.5, investmentReturnPercent: 7.0, comparisonYears: 3 },
    { mortgageInterestRatePercent: 7.0, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.5, comparisonYears: 3 },
    { mortgageInterestRatePercent: 6.25, homeAppreciationPercent: 2.5, investmentReturnPercent: 7.0, comparisonYears: 3 },
    { mortgageInterestRatePercent: 6.75, homeAppreciationPercent: 3.5, investmentReturnPercent: 6.5, comparisonYears: 4 },
    { mortgageInterestRatePercent: 7.0, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.0, comparisonYears: 4 },
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 4.0, investmentReturnPercent: 7.5, comparisonYears: 4 },
  ],
  'long-hold': [
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.0, comparisonYears: 12 },
    { mortgageInterestRatePercent: 6.75, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.0, comparisonYears: 15 },
    { mortgageInterestRatePercent: 6.25, homeAppreciationPercent: 3.5, investmentReturnPercent: 6.5, comparisonYears: 15 },
    { mortgageInterestRatePercent: 7.0, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.5, comparisonYears: 18 },
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 3.5, investmentReturnPercent: 7.0, comparisonYears: 20 },
    { mortgageInterestRatePercent: 6.0, homeAppreciationPercent: 4.0, investmentReturnPercent: 7.0, comparisonYears: 20 },
    { mortgageInterestRatePercent: 6.75, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.5, comparisonYears: 25 },
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 3.5, investmentReturnPercent: 7.0, comparisonYears: 30 },
  ],
  'high-rent-market': [
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.0, comparisonYears: 5 },
    { mortgageInterestRatePercent: 6.75, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.0, comparisonYears: 6 },
    { mortgageInterestRatePercent: 6.25, homeAppreciationPercent: 3.5, investmentReturnPercent: 6.5, comparisonYears: 6 },
    { mortgageInterestRatePercent: 7.0, homeAppreciationPercent: 3.0, investmentReturnPercent: 7.5, comparisonYears: 7 },
    { mortgageInterestRatePercent: 6.5, homeAppreciationPercent: 2.5, investmentReturnPercent: 7.0, comparisonYears: 8 },
    { mortgageInterestRatePercent: 6.75, homeAppreciationPercent: 3.5, investmentReturnPercent: 7.0, comparisonYears: 8 },
    { mortgageInterestRatePercent: 6.25, homeAppreciationPercent: 3.0, investmentReturnPercent: 6.5, comparisonYears: 9 },
    { mortgageInterestRatePercent: 7.0, homeAppreciationPercent: 4.0, investmentReturnPercent: 7.5, comparisonYears: 10 },
  ],
};

function record(
  intent: RentVsBuySeoIntent,
  homePurchasePrice: number,
  monthlyRent: number,
  bundle: RentVsBuyLeverBundle,
): RentVsBuySeoRecord {
  const profile = housingProfiles[intent];
  const downPayment = Math.round(
    (homePurchasePrice * profile.downPaymentRatePercent) / 100,
  );

  return {
    slug: `${intent}-${homePurchasePrice}-home-${monthlyRent}-rent-${rateSlug(bundle.mortgageInterestRatePercent)}-rate-${bundle.comparisonYears}-years`,
    question: `${intentLabels[intent]}: Renting at ${money(monthlyRent)}/mo vs Buying a ${money(homePurchasePrice)} Home Over ${bundle.comparisonYears} Years at ${bundle.mortgageInterestRatePercent}% Rate`,
    intent,
    monthlyRent,
    homePurchasePrice,
    downPayment,
    mortgageInterestRatePercent: bundle.mortgageInterestRatePercent,
    loanTermYears: profile.loanTermYears,
    propertyTaxRatePercent: profile.propertyTaxRatePercent,
    homeInsurancePerYear: profile.homeInsurancePerYear,
    hoaPerMonth: profile.hoaPerMonth,
    maintenanceRatePercent: profile.maintenanceRatePercent,
    homeAppreciationPercent: bundle.homeAppreciationPercent,
    investmentReturnPercent: bundle.investmentReturnPercent,
    comparisonYears: bundle.comparisonYears,
    scenarioLabel: intent.replace(/-/g, ' '),
  };
}

const intents: RentVsBuySeoIntent[] = [
  'starter-home',
  'high-cost-metro',
  'short-hold',
  'long-hold',
  'high-rent-market',
];

export const rentVsBuySeoRecords: RentVsBuySeoRecord[] = intents.flatMap(
  (intent) =>
    pricesAndRents[intent].flatMap(({ homePurchasePrice, monthlyRent }) =>
      leverBundles[intent].map((bundle) =>
        record(intent, homePurchasePrice, monthlyRent, bundle),
      ),
    ),
);

export const featuredRentVsBuySeoRecords = rentVsBuySeoRecords.filter(
  (record) =>
    [
      'short-hold-375000-home-2000-rent-6-5-rate-3-years',
      'long-hold-550000-home-2700-rent-6-5-rate-20-years',
    ].includes(record.slug),
);
