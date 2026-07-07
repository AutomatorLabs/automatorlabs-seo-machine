export type CollegeCostInflationSeoIntent =
  | 'community-college'
  | 'in-state-public'
  | 'out-of-state-public'
  | 'private-university'
  | 'high-inflation-scenario';

export interface CollegeCostInflationSeoRecord {
  slug: string;
  question: string;
  intent: CollegeCostInflationSeoIntent;
  currentAnnualCollegeCost: number;
  educationInflationRatePercent: number;
  yearsUntilCollege: number;
  numberOfCollegeYears: number;
  scenarioLabel: string;
}

export const EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function record(
  intent: CollegeCostInflationSeoIntent,
  label: string,
  scenarioLabel: string,
  currentAnnualCollegeCost: number,
  educationInflationRatePercent: number,
  yearsUntilCollege: number,
  numberOfCollegeYears: number,
): CollegeCostInflationSeoRecord {
  return {
    slug: `${intent}-cost-${currentAnnualCollegeCost}-inflation-${educationInflationRatePercent}-years-${yearsUntilCollege}-duration-${numberOfCollegeYears}`,
    question: `${label}: ${money(currentAnnualCollegeCost)}/Year Today at ${educationInflationRatePercent}% Education Inflation, Enrolling in ${yearsUntilCollege} Years for ${numberOfCollegeYears} Years`,
    intent,
    currentAnnualCollegeCost,
    educationInflationRatePercent,
    yearsUntilCollege,
    numberOfCollegeYears,
    scenarioLabel,
  };
}

// Intent 1: community-college — low current cost tier.
const communityCollegeAmounts = [4000, 5000, 6000, 7000, 8000];
const communityCollegeBundles = [
  { educationInflationRatePercent: 4, yearsUntilCollege: 10, numberOfCollegeYears: 2 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 12, numberOfCollegeYears: 2 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 8, numberOfCollegeYears: 3 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 15, numberOfCollegeYears: 2 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 6, numberOfCollegeYears: 2 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 10, numberOfCollegeYears: 3 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 12, numberOfCollegeYears: 2 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 8, numberOfCollegeYears: 2 },
];

// Intent 2: in-state-public — moderate current cost tier.
const inStatePublicAmounts = [12000, 15000, 18000, 22000, 26000];
const inStatePublicBundles = [
  { educationInflationRatePercent: 5, yearsUntilCollege: 10, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 13, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 8, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 16, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 6, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 11, numberOfCollegeYears: 5 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 14, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 9, numberOfCollegeYears: 4 },
];

// Intent 3: out-of-state-public — higher current cost tier.
const outOfStatePublicAmounts = [22000, 26000, 30000, 34000, 38000];
const outOfStatePublicBundles = [
  { educationInflationRatePercent: 5, yearsUntilCollege: 9, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 12, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 7, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 15, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 5, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 10, numberOfCollegeYears: 5 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 13, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 8, numberOfCollegeYears: 4 },
];

// Intent 4: private-university — high current cost tier.
const privateUniversityAmounts = [40000, 48000, 55000, 62000, 70000];
const privateUniversityBundles = [
  { educationInflationRatePercent: 5, yearsUntilCollege: 8, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 11, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 6, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 14, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 4, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 9, numberOfCollegeYears: 5 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 12, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 7, numberOfCollegeYears: 4 },
];

// Intent 5: high-inflation-scenario — fixed elevated rate (7%), moderate cost
// tier, isolates rate sensitivity (holds education inflation rate fixed
// while varying years/duration, same "hold one variable fixed" idea as the
// Traditional vs Roth 401(k) cluster's long-horizon-compounding intent).
const HIGH_INFLATION_RATE = 7;
const highInflationScenarioAmounts = [12000, 15000, 18000, 22000, 26000];
const highInflationScenarioBundles = [
  { yearsUntilCollege: 6, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 8, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 10, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 12, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 14, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 16, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 10, numberOfCollegeYears: 5 },
  { yearsUntilCollege: 18, numberOfCollegeYears: 4 },
];

export const collegeCostInflationSeoRecords: CollegeCostInflationSeoRecord[] = [
  ...communityCollegeAmounts.flatMap((currentAnnualCollegeCost) =>
    communityCollegeBundles.map((bundle) =>
      record(
        'community-college',
        'Community College Cost Projection',
        'community college',
        currentAnnualCollegeCost,
        bundle.educationInflationRatePercent,
        bundle.yearsUntilCollege,
        bundle.numberOfCollegeYears,
      ),
    ),
  ),
  ...inStatePublicAmounts.flatMap((currentAnnualCollegeCost) =>
    inStatePublicBundles.map((bundle) =>
      record(
        'in-state-public',
        'In-State Public College Cost Projection',
        'in-state public',
        currentAnnualCollegeCost,
        bundle.educationInflationRatePercent,
        bundle.yearsUntilCollege,
        bundle.numberOfCollegeYears,
      ),
    ),
  ),
  ...outOfStatePublicAmounts.flatMap((currentAnnualCollegeCost) =>
    outOfStatePublicBundles.map((bundle) =>
      record(
        'out-of-state-public',
        'Out-of-State Public College Cost Projection',
        'out-of-state public',
        currentAnnualCollegeCost,
        bundle.educationInflationRatePercent,
        bundle.yearsUntilCollege,
        bundle.numberOfCollegeYears,
      ),
    ),
  ),
  ...privateUniversityAmounts.flatMap((currentAnnualCollegeCost) =>
    privateUniversityBundles.map((bundle) =>
      record(
        'private-university',
        'Private University Cost Projection',
        'private university',
        currentAnnualCollegeCost,
        bundle.educationInflationRatePercent,
        bundle.yearsUntilCollege,
        bundle.numberOfCollegeYears,
      ),
    ),
  ),
  ...highInflationScenarioAmounts.flatMap((currentAnnualCollegeCost) =>
    highInflationScenarioBundles.map((bundle) =>
      record(
        'high-inflation-scenario',
        'High-Inflation College Cost Scenario',
        'high-inflation scenario',
        currentAnnualCollegeCost,
        HIGH_INFLATION_RATE,
        bundle.yearsUntilCollege,
        bundle.numberOfCollegeYears,
      ),
    ),
  ),
];

export const featuredCollegeCostInflationSeoRecords =
  collegeCostInflationSeoRecords.filter((record) =>
    [
      'community-college-cost-6000-inflation-4-years-10-duration-2',
      'private-university-cost-55000-inflation-5-years-8-duration-4',
    ].includes(record.slug),
  );
