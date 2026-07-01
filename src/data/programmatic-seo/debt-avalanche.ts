export interface DebtAvalancheSeoRecord {
  slug: string;
  question: string;
  profileLabel: string;
  debt1Name: string;
  debt1Balance: number;
  debt1InterestRate: number;
  debt1MinimumPayment: number;
  debt2Name: string;
  debt2Balance: number;
  debt2InterestRate: number;
  debt2MinimumPayment: number;
  debt3Name: string;
  debt3Balance: number;
  debt3InterestRate: number;
  debt3MinimumPayment: number;
  extraMonthlyPayment: number;
  featured?: boolean;
}

export const EXPECTED_DEBT_AVALANCHE_SEO_PAGE_COUNT = 200;

const avalancheMoney = (value: number) => `$${value.toLocaleString('en-US')}`;
const capitalizeWords = (value: string) =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());

function debtAvalancheRecord(
  profileLabel: string,
  scale: number,
  extraMonthlyPayment: number,
  featured = false,
): DebtAvalancheSeoRecord {
  const profiles = {
    starter: ['Store Card', 1200, 24, 45, 'Medical Bill', 2600, 9, 80, 'Personal Loan', 5400, 12, 150],
    family: ['Rewards Card', 4200, 26, 120, 'Auto Loan', 9800, 7, 260, 'Student Loan', 14000, 5.5, 175],
    rebuild: ['Card A', 3500, 22, 110, 'Card B', 6100, 18, 180, 'Installment Loan', 12000, 10, 310],
    catchup: ['Travel Card', 2400, 28, 85, 'Medical Plan', 4700, 0, 140, 'Personal Loan', 8900, 14, 255],
    mixed: ['Card', 2800, 25, 95, 'Auto Repair Loan', 5200, 11, 165, 'Consolidation Loan', 10500, 8.5, 290],
  } as const;
  const profile = profiles[profileLabel as keyof typeof profiles];
  const debt1Balance = Math.round(profile[1] * scale);
  const debt1MinimumPayment = Math.round(profile[3] * scale);
  const debt2Balance = Math.round(profile[5] * scale);
  const debt2MinimumPayment = Math.round(profile[7] * scale);
  const debt3Balance = Math.round(profile[9] * scale);
  const debt3MinimumPayment = Math.round(profile[11] * scale);
  const totalDebt = debt1Balance + debt2Balance + debt3Balance;

  return {
    slug: `debt-avalanche-${profileLabel}-${Math.round(scale * 100)}-scale-with-${extraMonthlyPayment}-extra`,
    question: `What Debt Avalanche Timeline Fits the ${capitalizeWords(profileLabel)} Profile With ${avalancheMoney(totalDebt)} Total Debt and ${avalancheMoney(extraMonthlyPayment)} Extra Each Month?`,
    profileLabel,
    debt1Name: profile[0],
    debt1Balance,
    debt1InterestRate: profile[2],
    debt1MinimumPayment,
    debt2Name: profile[4],
    debt2Balance,
    debt2InterestRate: profile[6],
    debt2MinimumPayment,
    debt3Name: profile[8],
    debt3Balance,
    debt3InterestRate: profile[10],
    debt3MinimumPayment,
    extraMonthlyPayment,
    featured,
  };
}

const avalancheProfiles = ['starter', 'family', 'rebuild', 'catchup', 'mixed'] as const;
const avalancheScales = [0.8, 1, 1.2, 1.4, 1.6];
const avalancheExtraPayments = [0, 50, 100, 150, 200, 250, 300, 400];

export const debtAvalancheSeoRecords: DebtAvalancheSeoRecord[] =
  avalancheProfiles.flatMap((profileLabel) =>
    avalancheScales.flatMap((scale) =>
      avalancheExtraPayments.map((extraMonthlyPayment) =>
        debtAvalancheRecord(
          profileLabel,
          scale,
          extraMonthlyPayment,
          profileLabel === 'family' &&
            scale === 1 &&
            extraMonthlyPayment === 200,
        ),
      ),
    ),
  );

export const featuredDebtAvalancheSeoRecords = debtAvalancheSeoRecords.filter(
  (record) => record.featured,
);
