export interface FourOhOneKSeoRecord {
  slug: string;
  question: string;
  currentBalance: number;
  employeeMonthlyContribution: number;
  employerMonthlyMatch: number;
  expectedAnnualReturnPercent: number;
  years: number;
  featured?: boolean;
}

export const EXPECTED_401K_SEO_PAGE_COUNT = 200;

const rateSlug = (value: number) => value.toString().replace('.', '-');
const yearsMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function fourOhOneKRecord(
  currentBalance: number,
  employeeMonthlyContribution: number,
  employerMonthlyMatch: number,
  expectedAnnualReturnPercent: number,
  years: number,
  featured = false,
): FourOhOneKSeoRecord {
  return {
    slug: `401k-growth-${currentBalance}-starting-${employeeMonthlyContribution}-employee-${employerMonthlyMatch}-match-at-${rateSlug(expectedAnnualReturnPercent)}-percent-for-${years}-years`,
    question: `How Could a 401(k) Grow From ${yearsMoney(currentBalance)} With ${yearsMoney(employeeMonthlyContribution)} Monthly and ${yearsMoney(employerMonthlyMatch)} Match for ${years} Years?`,
    currentBalance,
    employeeMonthlyContribution,
    employerMonthlyMatch,
    expectedAnnualReturnPercent,
    years,
    featured,
  };
}

const fourOhOneKBalances = [0, 25000, 75000, 150000, 300000];
const fourOhOneKEmployeeContributions = [500, 750, 1000, 1500];
const fourOhOneKEmployerMatch = [0, 250];
const fourOhOneKAssumptions = [
  { expectedAnnualReturnPercent: 5, years: 10 },
  { expectedAnnualReturnPercent: 6, years: 15 },
  { expectedAnnualReturnPercent: 7, years: 20 },
  { expectedAnnualReturnPercent: 7, years: 30 },
  { expectedAnnualReturnPercent: 8, years: 25 },
];

export const fourOhOneKSeoRecords: FourOhOneKSeoRecord[] =
  fourOhOneKBalances.flatMap((currentBalance) =>
    fourOhOneKEmployeeContributions.flatMap((employeeMonthlyContribution) =>
      fourOhOneKEmployerMatch.flatMap((employerMonthlyMatch) =>
        fourOhOneKAssumptions.map((assumption) =>
          fourOhOneKRecord(
            currentBalance,
            employeeMonthlyContribution,
            employerMonthlyMatch,
            assumption.expectedAnnualReturnPercent,
            assumption.years,
            currentBalance === 75000 &&
              employeeMonthlyContribution === 1000 &&
              employerMonthlyMatch === 250 &&
              assumption.expectedAnnualReturnPercent === 7 &&
              assumption.years === 20,
          ),
        ),
      ),
    ),
  );

export const featuredFourOhOneKSeoRecords = fourOhOneKSeoRecords.filter(
  (record) => record.featured,
);
