export interface CoastFireSeoRecord {
  slug: string;
  question: string;
  currentAge: number;
  retirementAge: number;
  annualExpenses: number;
  withdrawalRatePercent: number;
  expectedAnnualReturnPercent: number;
  currentInvestedAssets: number;
  featured?: boolean;
}

export const EXPECTED_COAST_FIRE_SEO_PAGE_COUNT = 200;

const rateSlug = (value: number) => value.toString().replace('.', '-');
const money = (value: number) => `$${value.toLocaleString('en-US')}`;

function coastFireRecord(
  currentAge: number,
  currentInvestedAssets: number,
  annualExpenses: number,
  retirementAge: number,
  withdrawalRatePercent: number,
  expectedAnnualReturnPercent: number,
  featured = false,
): CoastFireSeoRecord {
  return {
    slug: `coast-fire-age-${currentAge}-retire-${retirementAge}-with-${currentInvestedAssets}-saved-for-${annualExpenses}-spending-at-${rateSlug(expectedAnnualReturnPercent)}-percent`,
    question: `Can I Coast FIRE at Age ${currentAge} With ${money(currentInvestedAssets)} Saved for ${money(annualExpenses)} Spending at ${retirementAge} Using ${expectedAnnualReturnPercent}% Growth and a ${withdrawalRatePercent}% Withdrawal Rate?`,
    currentAge,
    retirementAge,
    annualExpenses,
    withdrawalRatePercent,
    expectedAnnualReturnPercent,
    currentInvestedAssets,
    featured,
  };
}

const currentAges = [25, 30, 35, 40, 45];
const currentInvestedAssets = [25000, 50000, 100000, 250000];
const annualExpenses = [40000, 80000];
const assumptionSets = [
  { retirementAge: 55, withdrawalRatePercent: 4, expectedAnnualReturnPercent: 7 },
  { retirementAge: 60, withdrawalRatePercent: 4, expectedAnnualReturnPercent: 7 },
  { retirementAge: 60, withdrawalRatePercent: 3.5, expectedAnnualReturnPercent: 6.5 },
  { retirementAge: 65, withdrawalRatePercent: 4, expectedAnnualReturnPercent: 7 },
  { retirementAge: 65, withdrawalRatePercent: 3.5, expectedAnnualReturnPercent: 6 },
];

export const coastFireSeoRecords: CoastFireSeoRecord[] = currentAges.flatMap((currentAge) =>
  currentInvestedAssets.flatMap((saved) =>
    annualExpenses.flatMap((spending) =>
      assumptionSets.map((assumption) =>
        coastFireRecord(
          currentAge,
          saved,
          spending,
          assumption.retirementAge,
          assumption.withdrawalRatePercent,
          assumption.expectedAnnualReturnPercent,
          currentAge === 35 &&
            saved === 100000 &&
            spending === 40000 &&
            assumption.retirementAge === 60 &&
            assumption.expectedAnnualReturnPercent === 7,
        ),
      ),
    ),
  ),
);

export const featuredCoastFireSeoRecords = coastFireSeoRecords.filter(
  (record) => record.featured,
);
