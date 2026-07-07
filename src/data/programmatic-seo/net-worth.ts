export type NetWorthSeoIntent =
  | 'young-professional'
  | 'new-homeowner'
  | 'debt-free-saver'
  | 'high-net-worth-investor'
  | 'underwater-household';

export interface NetWorthSeoRecord {
  slug: string;
  question: string;
  intent: NetWorthSeoIntent;
  cash: number;
  investments: number;
  realEstate: number;
  crypto: number;
  creditCardDebt: number;
  loans: number;
  mortgage: number;
  scenarioLabel: string;
}

export const EXPECTED_NET_WORTH_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function record(
  intent: NetWorthSeoIntent,
  label: string,
  scenarioLabel: string,
  cash: number,
  investments: number,
  realEstate: number,
  crypto: number,
  creditCardDebt: number,
  loans: number,
  mortgage: number,
): NetWorthSeoRecord {
  return {
    slug: `${intent}-cash-${cash}-investments-${investments}-realestate-${realEstate}-crypto-${crypto}-creditcarddebt-${creditCardDebt}-loans-${loans}-mortgage-${mortgage}`,
    question: `${label}: ${money(cash)} Cash, ${money(investments)} Investments, ${money(realEstate)} Real Estate, ${money(crypto)} Crypto, ${money(creditCardDebt)} Credit Card Debt, ${money(loans)} Loans, ${money(mortgage)} Mortgage`,
    intent,
    cash,
    investments,
    realEstate,
    crypto,
    creditCardDebt,
    loans,
    mortgage,
    scenarioLabel,
  };
}

// Intent 1: young-professional — no real estate, small investments/crypto,
// student loans + credit card debt. Not sign-asserted: this persona
// realistically includes both positive and negative net-worth outcomes.
const youngProfessionalAmounts = [500, 1500, 3000, 5000, 8000];
const youngProfessionalBundles = [
  { investments: 3000, realEstate: 0, crypto: 500, creditCardDebt: 2000, loans: 15000, mortgage: 0 },
  { investments: 5000, realEstate: 0, crypto: 1000, creditCardDebt: 3000, loans: 20000, mortgage: 0 },
  { investments: 2000, realEstate: 0, crypto: 0, creditCardDebt: 1500, loans: 12000, mortgage: 0 },
  { investments: 8000, realEstate: 0, crypto: 1500, creditCardDebt: 2500, loans: 25000, mortgage: 0 },
  { investments: 1000, realEstate: 0, crypto: 2000, creditCardDebt: 1000, loans: 8000, mortgage: 0 },
  { investments: 6000, realEstate: 0, crypto: 500, creditCardDebt: 4000, loans: 18000, mortgage: 0 },
  { investments: 4000, realEstate: 0, crypto: 0, creditCardDebt: 2000, loans: 10000, mortgage: 0 },
  { investments: 7000, realEstate: 0, crypto: 3000, creditCardDebt: 3500, loans: 22000, mortgage: 0 },
];

// Intent 2: new-homeowner — real estate + mortgage dominant, light other debt.
const newHomeownerAmounts = [2000, 4000, 6000, 8000, 12000];
const newHomeownerBundles = [
  { investments: 15000, realEstate: 350000, crypto: 0, creditCardDebt: 500, loans: 8000, mortgage: 280000 },
  { investments: 25000, realEstate: 400000, crypto: 1000, creditCardDebt: 1000, loans: 12000, mortgage: 320000 },
  { investments: 10000, realEstate: 300000, crypto: 0, creditCardDebt: 0, loans: 5000, mortgage: 240000 },
  { investments: 30000, realEstate: 450000, crypto: 2000, creditCardDebt: 1500, loans: 15000, mortgage: 360000 },
  { investments: 20000, realEstate: 380000, crypto: 0, creditCardDebt: 800, loans: 10000, mortgage: 300000 },
  { investments: 12000, realEstate: 320000, crypto: 500, creditCardDebt: 500, loans: 6000, mortgage: 260000 },
  { investments: 35000, realEstate: 500000, crypto: 3000, creditCardDebt: 2000, loans: 18000, mortgage: 400000 },
  { investments: 18000, realEstate: 360000, crypto: 0, creditCardDebt: 1000, loans: 9000, mortgage: 290000 },
];

// Intent 3: debt-free-saver — solid assets, zero liabilities everywhere.
// Only investments/realEstate/crypto vary; creditCardDebt/loans/mortgage
// are fixed at 0 across all 8 bundles. Sign-asserted: netWorth > 0 always
// (trivially true since liabilities are always 0).
const debtFreeSaverAmounts = [10000, 15000, 20000, 25000, 35000];
const debtFreeSaverBundles = [
  { investments: 50000, realEstate: 0, crypto: 2000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 80000, realEstate: 200000, crypto: 5000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 100000, realEstate: 0, crypto: 3000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 60000, realEstate: 150000, crypto: 1000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 120000, realEstate: 250000, crypto: 8000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 70000, realEstate: 0, crypto: 0, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 90000, realEstate: 180000, crypto: 4000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 110000, realEstate: 220000, crypto: 6000, creditCardDebt: 0, loans: 0, mortgage: 0 },
];

// Intent 4: high-net-worth-investor — large everything, moderate leverage.
const highNetWorthInvestorAmounts = [15000, 25000, 40000, 60000, 90000];
const highNetWorthInvestorBundles = [
  { investments: 400000, realEstate: 500000, crypto: 20000, creditCardDebt: 2000, loans: 5000, mortgage: 300000 },
  { investments: 600000, realEstate: 700000, crypto: 35000, creditCardDebt: 3000, loans: 10000, mortgage: 400000 },
  { investments: 350000, realEstate: 450000, crypto: 15000, creditCardDebt: 1500, loans: 0, mortgage: 250000 },
  { investments: 800000, realEstate: 900000, crypto: 50000, creditCardDebt: 5000, loans: 15000, mortgage: 500000 },
  { investments: 500000, realEstate: 600000, crypto: 25000, creditCardDebt: 2500, loans: 8000, mortgage: 350000 },
  { investments: 1000000, realEstate: 1200000, crypto: 75000, creditCardDebt: 8000, loans: 20000, mortgage: 600000 },
  { investments: 450000, realEstate: 550000, crypto: 18000, creditCardDebt: 2000, loans: 6000, mortgage: 300000 },
  { investments: 700000, realEstate: 800000, crypto: 40000, creditCardDebt: 4000, loans: 12000, mortgage: 450000 },
];

// Intent 5: underwater-household — liabilities exceed assets. Sign-asserted:
// netWorth < 0 always. Worst case (bundle 3 at max cash 2500) is assets
// 2500+500+150000=153000 vs liabilities 6000+15000+160000=181000, still
// clearly negative (-28000).
const underwaterHouseholdAmounts = [200, 500, 1000, 1500, 2500];
const underwaterHouseholdBundles = [
  { investments: 0, realEstate: 0, crypto: 0, creditCardDebt: 8000, loans: 20000, mortgage: 0 },
  { investments: 1000, realEstate: 0, crypto: 0, creditCardDebt: 12000, loans: 25000, mortgage: 0 },
  { investments: 500, realEstate: 150000, crypto: 0, creditCardDebt: 6000, loans: 15000, mortgage: 160000 },
  { investments: 0, realEstate: 0, crypto: 0, creditCardDebt: 15000, loans: 30000, mortgage: 0 },
  { investments: 2000, realEstate: 0, crypto: 500, creditCardDebt: 10000, loans: 22000, mortgage: 0 },
  { investments: 0, realEstate: 100000, crypto: 0, creditCardDebt: 9000, loans: 18000, mortgage: 115000 },
  { investments: 1500, realEstate: 0, crypto: 0, creditCardDebt: 18000, loans: 35000, mortgage: 0 },
  { investments: 500, realEstate: 0, crypto: 1000, creditCardDebt: 7000, loans: 12000, mortgage: 0 },
];

export const netWorthSeoRecords: NetWorthSeoRecord[] = [
  ...youngProfessionalAmounts.flatMap((cash) =>
    youngProfessionalBundles.map((bundle) =>
      record(
        'young-professional',
        'Young Professional Net Worth Example',
        'young professional',
        cash,
        bundle.investments,
        bundle.realEstate,
        bundle.crypto,
        bundle.creditCardDebt,
        bundle.loans,
        bundle.mortgage,
      ),
    ),
  ),
  ...newHomeownerAmounts.flatMap((cash) =>
    newHomeownerBundles.map((bundle) =>
      record(
        'new-homeowner',
        'New Homeowner Net Worth Example',
        'new homeowner',
        cash,
        bundle.investments,
        bundle.realEstate,
        bundle.crypto,
        bundle.creditCardDebt,
        bundle.loans,
        bundle.mortgage,
      ),
    ),
  ),
  ...debtFreeSaverAmounts.flatMap((cash) =>
    debtFreeSaverBundles.map((bundle) =>
      record(
        'debt-free-saver',
        'Debt-Free Saver Net Worth Example',
        'debt-free saver',
        cash,
        bundle.investments,
        bundle.realEstate,
        bundle.crypto,
        bundle.creditCardDebt,
        bundle.loans,
        bundle.mortgage,
      ),
    ),
  ),
  ...highNetWorthInvestorAmounts.flatMap((cash) =>
    highNetWorthInvestorBundles.map((bundle) =>
      record(
        'high-net-worth-investor',
        'High-Net-Worth Investor Net Worth Example',
        'high-net-worth investor',
        cash,
        bundle.investments,
        bundle.realEstate,
        bundle.crypto,
        bundle.creditCardDebt,
        bundle.loans,
        bundle.mortgage,
      ),
    ),
  ),
  ...underwaterHouseholdAmounts.flatMap((cash) =>
    underwaterHouseholdBundles.map((bundle) =>
      record(
        'underwater-household',
        'Underwater Household Net Worth Example',
        'underwater household',
        cash,
        bundle.investments,
        bundle.realEstate,
        bundle.crypto,
        bundle.creditCardDebt,
        bundle.loans,
        bundle.mortgage,
      ),
    ),
  ),
];

export const featuredNetWorthSeoRecords = netWorthSeoRecords.filter((record) =>
  [
    'debt-free-saver-cash-20000-investments-100000-realestate-0-crypto-3000-creditcarddebt-0-loans-0-mortgage-0',
    'underwater-household-cash-1000-investments-500-realestate-150000-crypto-0-creditcarddebt-6000-loans-15000-mortgage-160000',
  ].includes(record.slug),
);
