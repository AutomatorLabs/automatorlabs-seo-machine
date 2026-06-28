export interface HelocSeoRecord {
  slug: string;
  question: string;
  homeValue: number;
  currentMortgageBalance: number;
  maximumCltvPercent: number;
  requestedHelocAmount: number;
  annualInterestRatePercent: number;
  featured?: boolean;
}

export const EXPECTED_HELOC_SEO_PAGE_COUNT = 200;

const helocRateSlug = (value: number) => value.toString().replace('.', '-');
const helocMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function helocRecord(
  homeValue: number,
  currentMortgageBalance: number,
  maximumCltvPercent: number,
  requestedHelocAmount: number,
  annualInterestRatePercent: number,
  featured = false,
): HelocSeoRecord {
  return {
    slug: `heloc-${homeValue}-home-value-${currentMortgageBalance}-mortgage-${maximumCltvPercent}-cltv-${requestedHelocAmount}-requested-at-${helocRateSlug(annualInterestRatePercent)}-percent`,
    question: `How Much HELOC Could Fit on ${helocMoney(homeValue)} With ${helocMoney(currentMortgageBalance)} on the Mortgage, ${maximumCltvPercent}% CLTV, and ${helocMoney(requestedHelocAmount)} Requested?`,
    homeValue,
    currentMortgageBalance,
    maximumCltvPercent,
    requestedHelocAmount,
    annualInterestRatePercent,
    featured,
  };
}

const homeValues = [300000, 450000, 600000, 800000, 1000000];
const mortgageBalancePercents = [35, 45, 50, 60, 70];
const helocAssumptions = [
  { maximumCltvPercent: 75, requestedHelocAmount: 25000, annualInterestRatePercent: 7 },
  { maximumCltvPercent: 80, requestedHelocAmount: 40000, annualInterestRatePercent: 7.25 },
  { maximumCltvPercent: 80, requestedHelocAmount: 60000, annualInterestRatePercent: 7.5 },
  { maximumCltvPercent: 85, requestedHelocAmount: 75000, annualInterestRatePercent: 7.75 },
  { maximumCltvPercent: 85, requestedHelocAmount: 100000, annualInterestRatePercent: 8 },
  { maximumCltvPercent: 90, requestedHelocAmount: 125000, annualInterestRatePercent: 8.25 },
  { maximumCltvPercent: 90, requestedHelocAmount: 150000, annualInterestRatePercent: 8.5 },
  { maximumCltvPercent: 95, requestedHelocAmount: 200000, annualInterestRatePercent: 8.75 },
];

export const helocSeoRecords: HelocSeoRecord[] = homeValues.flatMap(
  (homeValue) =>
    mortgageBalancePercents.flatMap((mortgageBalancePercent) =>
      helocAssumptions.map((assumption) =>
        helocRecord(
          homeValue,
          Math.round(homeValue * (mortgageBalancePercent / 100)),
          assumption.maximumCltvPercent,
          assumption.requestedHelocAmount,
          assumption.annualInterestRatePercent,
          homeValue === 600000 &&
            mortgageBalancePercent === 50 &&
            assumption.maximumCltvPercent === 85 &&
            assumption.requestedHelocAmount === 75000,
        ),
      ),
    ),
);

export const featuredHelocSeoRecords = helocSeoRecords.filter(
  (record) => record.featured,
);
