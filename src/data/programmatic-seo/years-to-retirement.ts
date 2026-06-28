export interface YearsToRetirementSeoRecord {
  slug: string;
  question: string;
  currentAge: number;
  targetRetirementAge: number;
  currentInvestedAssets: number;
  targetRetirementPortfolio: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
  featured?: boolean;
}

export const EXPECTED_YEARS_TO_RETIREMENT_SEO_PAGE_COUNT = 200;

const rateSlug = (value: number) => value.toString().replace('.', '-');
const yearsMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function yearsToRetirementRecord(
  currentAge: number,
  currentInvestedAssets: number,
  targetRetirementPortfolio: number,
  targetRetirementAge: number,
  monthlyContribution: number,
  expectedAnnualReturnPercent: number,
  featured = false,
): YearsToRetirementSeoRecord {
  return {
    slug: `retire-by-${targetRetirementAge}-starting-age-${currentAge}-with-${currentInvestedAssets}-saved-target-${targetRetirementPortfolio}-and-${monthlyContribution}-monthly-at-${rateSlug(expectedAnnualReturnPercent)}-percent`,
    question: `Can I Retire by ${targetRetirementAge} Starting at Age ${currentAge} With ${yearsMoney(currentInvestedAssets)} Saved, ${yearsMoney(monthlyContribution)} Monthly Contributions, and ${expectedAnnualReturnPercent}% Growth to Reach ${yearsMoney(targetRetirementPortfolio)}?`,
    currentAge,
    targetRetirementAge,
    currentInvestedAssets,
    targetRetirementPortfolio,
    monthlyContribution,
    expectedAnnualReturnPercent,
    featured,
  };
}

const ytrCurrentAges = [30, 35, 40, 45, 50];
const ytrSaved = [50000, 100000, 250000, 500000];
const ytrTargets = [1000000, 2000000];
const ytrAssumptionSets = [
  { targetRetirementAge: 55, monthlyContribution: 1000, expectedAnnualReturnPercent: 6 },
  { targetRetirementAge: 60, monthlyContribution: 1000, expectedAnnualReturnPercent: 7 },
  { targetRetirementAge: 60, monthlyContribution: 1500, expectedAnnualReturnPercent: 7 },
  { targetRetirementAge: 65, monthlyContribution: 1000, expectedAnnualReturnPercent: 6.5 },
  { targetRetirementAge: 65, monthlyContribution: 2000, expectedAnnualReturnPercent: 7 },
];

export const yearsToRetirementSeoRecords: YearsToRetirementSeoRecord[] =
  ytrCurrentAges.flatMap((currentAge) =>
    ytrSaved.flatMap((saved) =>
      ytrTargets.flatMap((target) =>
        ytrAssumptionSets.map((assumption) =>
          yearsToRetirementRecord(
            currentAge,
            saved,
            target,
            assumption.targetRetirementAge,
            assumption.monthlyContribution,
            assumption.expectedAnnualReturnPercent,
            currentAge === 40 &&
              saved === 250000 &&
              target === 1500000 ? false : currentAge === 40 &&
              saved === 250000 &&
              target === 2000000 &&
              assumption.targetRetirementAge === 60 &&
              assumption.monthlyContribution === 1500 &&
              assumption.expectedAnnualReturnPercent === 7,
          ),
        ),
      ),
    ),
  );

export const featuredYearsToRetirementSeoRecords =
  yearsToRetirementSeoRecords.filter((record) => record.featured);
