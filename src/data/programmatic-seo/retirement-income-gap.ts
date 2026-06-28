export interface RetirementIncomeGapSeoRecord {
  slug: string;
  question: string;
  desiredAnnualRetirementIncome: number;
  socialSecurityIncome: number;
  pensionIncome: number;
  rentalIncome: number;
  dividendIncome: number;
  otherPassiveIncome: number;
  portfolioValue: number;
  withdrawalRatePercent: number;
  featured?: boolean;
}

export const EXPECTED_RETIREMENT_INCOME_GAP_SEO_PAGE_COUNT = 200;

const rateSlug = (value: number) => value.toString().replace('.', '-');
const yearsMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function retirementIncomeGapRecord(
  desiredAnnualRetirementIncome: number,
  portfolioValue: number,
  incomes: Omit<
    RetirementIncomeGapSeoRecord,
    | 'slug'
    | 'question'
    | 'desiredAnnualRetirementIncome'
    | 'portfolioValue'
    | 'withdrawalRatePercent'
    | 'featured'
  >,
  withdrawalRatePercent: number,
  featured = false,
): RetirementIncomeGapSeoRecord {
  const nonPortfolioIncome =
    incomes.socialSecurityIncome +
    incomes.pensionIncome +
    incomes.rentalIncome +
    incomes.dividendIncome +
    incomes.otherPassiveIncome;

  return {
    slug: `retirement-income-gap-${desiredAnnualRetirementIncome}-income-with-${portfolioValue}-portfolio-and-${nonPortfolioIncome}-non-portfolio-income-at-${rateSlug(withdrawalRatePercent)}-percent`,
    question: `What Retirement Income Gap Is Left on ${yearsMoney(desiredAnnualRetirementIncome)} of Desired Income With ${yearsMoney(portfolioValue)} Invested, ${yearsMoney(nonPortfolioIncome)} of Non-Portfolio Income, and a ${withdrawalRatePercent}% Withdrawal Rate?`,
    desiredAnnualRetirementIncome,
    portfolioValue,
    withdrawalRatePercent,
    featured,
    ...incomes,
  };
}

const desiredIncomes = [50000, 75000, 100000, 125000, 150000];
const gapPortfolioValues = [500000, 1000000, 1500000, 2000000];
const incomeProfiles = [
  {
    socialSecurityIncome: 18000,
    pensionIncome: 0,
    rentalIncome: 0,
    dividendIncome: 0,
    otherPassiveIncome: 0,
  },
  {
    socialSecurityIncome: 30000,
    pensionIncome: 12000,
    rentalIncome: 6000,
    dividendIncome: 4000,
    otherPassiveIncome: 3000,
  },
];
const withdrawalRates = [3.5, 4, 4.5, 5, 5.5];

export const retirementIncomeGapSeoRecords: RetirementIncomeGapSeoRecord[] =
  desiredIncomes.flatMap((desiredIncome) =>
    gapPortfolioValues.flatMap((portfolioValue) =>
      incomeProfiles.flatMap((profile, index) =>
        withdrawalRates.map((withdrawalRatePercent, rateIndex) =>
          retirementIncomeGapRecord(
            desiredIncome,
            portfolioValue,
            profile,
            withdrawalRatePercent,
            desiredIncome === 100000 &&
              portfolioValue === 1500000 &&
              index === 1 &&
              rateIndex === 1,
          ),
        ),
      ),
    ),
  );

export const featuredRetirementIncomeGapSeoRecords =
  retirementIncomeGapSeoRecords.filter((record) => record.featured);
