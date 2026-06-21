export interface FourPercentRuleSeoRecord {
  slug: string;
  question: string;
  portfolioValue: number;
  annualSpending: number;
  years: number;
  featured?: boolean;
}

export const EXPECTED_FOUR_PERCENT_RULE_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function fourPercentRuleRecord(
  portfolioValue: number,
  annualSpending: number,
  years: number,
  featured = false,
): FourPercentRuleSeoRecord {
  return {
    slug: `4-percent-rule-${portfolioValue}-portfolio-${annualSpending}-spending-${years}-years`,
    question: `Can I Retire With ${money(portfolioValue)} and Spend ${money(annualSpending)} per Year Using the 4% Rule for ${years} Years?`,
    portfolioValue,
    annualSpending,
    years,
    featured,
  };
}

const annualSpendingTargets = [
  30000,
  40000,
  50000,
  60000,
  80000,
  100000,
  150000,
];

const portfolioValues = [
  500000,
  750000,
  1000000,
  1500000,
  2000000,
  3000000,
];

const retirementDurations = [25, 30, 35, 40, 45];

const portfolioSpendingPairs = annualSpendingTargets
  .flatMap((annualSpending) =>
    portfolioValues.map((portfolioValue) => ({
      portfolioValue,
      annualSpending,
    })),
  )
  .filter(
    ({ portfolioValue, annualSpending }) =>
      !(
        annualSpending === 150000 &&
        (portfolioValue === 500000 || portfolioValue === 750000)
      ),
  );

export const fourPercentRuleSeoRecords: FourPercentRuleSeoRecord[] =
  portfolioSpendingPairs.flatMap(({ portfolioValue, annualSpending }) =>
    retirementDurations.map((years) =>
      fourPercentRuleRecord(
        portfolioValue,
        annualSpending,
        years,
        portfolioValue === 1000000 &&
          annualSpending === 40000 &&
          years === 30,
      ),
    ),
  );

export const featuredFourPercentRuleSeoRecords =
  fourPercentRuleSeoRecords.filter((record) => record.featured);
