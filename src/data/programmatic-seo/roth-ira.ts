export interface RothIraSeoRecord {
  slug: string;
  question: string;
  currentBalance: number;
  contributionPerPeriod: number;
  periodsPerYear: number;
  expectedAnnualReturnPercent: number;
  years: number;
  featured?: boolean;
}

export const EXPECTED_ROTH_IRA_SEO_PAGE_COUNT = 200;

const rateSlug = (value: number) => value.toString().replace('.', '-');
const yearsMoney = (value: number) => `$${value.toLocaleString('en-US')}`;
const capitalizeWords = (value: string) =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());

function rothIraRecord(
  currentBalance: number,
  contributionPerPeriod: number,
  periodsPerYear: number,
  expectedAnnualReturnPercent: number,
  years: number,
  featured = false,
): RothIraSeoRecord {
  const contributionLabel =
    periodsPerYear === 12
      ? `${yearsMoney(contributionPerPeriod)} monthly`
      : `${yearsMoney(contributionPerPeriod)} yearly`;

  return {
    slug: `roth-ira-${currentBalance}-starting-${contributionPerPeriod}-${periodsPerYear === 12 ? 'monthly' : 'yearly'}-at-${rateSlug(expectedAnnualReturnPercent)}-percent-for-${years}-years`,
    question: `How Could a Roth IRA Grow From ${yearsMoney(currentBalance)} With ${capitalizeWords(contributionLabel)} for ${years} Years?`,
    currentBalance,
    contributionPerPeriod,
    periodsPerYear,
    expectedAnnualReturnPercent,
    years,
    featured,
  };
}

const rothBalances = [0, 10000, 25000, 50000, 100000];
const rothContributionPerPeriod = [250, 500, 750, 1000];
const rothPeriodsPerYear = [12, 1];
const rothAssumptions = [
  { expectedAnnualReturnPercent: 5, years: 10 },
  { expectedAnnualReturnPercent: 6, years: 15 },
  { expectedAnnualReturnPercent: 7, years: 20 },
  { expectedAnnualReturnPercent: 7, years: 30 },
  { expectedAnnualReturnPercent: 8, years: 25 },
];

export const rothIraSeoRecords: RothIraSeoRecord[] = rothBalances.flatMap(
  (currentBalance) =>
    rothContributionPerPeriod.flatMap((contributionPerPeriod) =>
      rothPeriodsPerYear.flatMap((periodsPerYear) =>
        rothAssumptions.map((assumption) =>
          rothIraRecord(
            currentBalance,
            contributionPerPeriod,
            periodsPerYear,
            assumption.expectedAnnualReturnPercent,
            assumption.years,
            currentBalance === 25000 &&
              contributionPerPeriod === 500 &&
              periodsPerYear === 12 &&
              assumption.expectedAnnualReturnPercent === 7 &&
              assumption.years === 20,
          ),
        ),
      ),
    ),
);

export const featuredRothIraSeoRecords = rothIraSeoRecords.filter(
  (record) => record.featured,
);
