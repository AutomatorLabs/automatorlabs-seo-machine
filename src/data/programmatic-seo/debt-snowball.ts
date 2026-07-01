export interface DebtSnowballSeoRecord {
  slug: string;
  question: string;
  profileLabel: string;
  debt1Name: string;
  debt1Balance: number;
  debt1MinimumPayment: number;
  debt2Name: string;
  debt2Balance: number;
  debt2MinimumPayment: number;
  debt3Name: string;
  debt3Balance: number;
  debt3MinimumPayment: number;
  extraMonthlyPayment: number;
  featured?: boolean;
}

export const EXPECTED_DEBT_SNOWBALL_SEO_PAGE_COUNT = 200;

const money = (value: number) => `$${value.toLocaleString('en-US')}`;
const capitalizeWords = (value: string) =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());

function debtSnowballRecord(
  profileLabel: string,
  scale: number,
  extraMonthlyPayment: number,
  featured = false,
): DebtSnowballSeoRecord {
  const profiles = {
    starter: ['Store Card', 900, 45, 'Medical Bill', 1800, 75, 'Personal Loan', 4200, 135],
    family: ['Credit Card', 2500, 95, 'Auto Repair Loan', 4800, 180, 'Furniture Loan', 7600, 240],
    rebuild: ['Card A', 3200, 110, 'Card B', 5600, 175, 'Installment Loan', 9800, 260],
    catchup: ['Travel Card', 1800, 65, 'Personal Loan', 6200, 210, 'Auto Loan', 12800, 320],
    mixed: ['Medical Debt', 1400, 55, 'Credit Card', 3900, 145, 'Student Loan', 11000, 285],
  } as const;
  const profile = profiles[profileLabel as keyof typeof profiles];
  const debt1Balance = Math.round(profile[1] * scale);
  const debt1MinimumPayment = Math.round(profile[2] * scale);
  const debt2Balance = Math.round(profile[4] * scale);
  const debt2MinimumPayment = Math.round(profile[5] * scale);
  const debt3Balance = Math.round(profile[7] * scale);
  const debt3MinimumPayment = Math.round(profile[8] * scale);
  const totalDebt = debt1Balance + debt2Balance + debt3Balance;

  return {
    slug: `debt-snowball-${profileLabel}-${Math.round(scale * 100)}-scale-with-${extraMonthlyPayment}-extra`,
    question: `What Debt Snowball Timeline Fits the ${capitalizeWords(profileLabel)} Profile With ${money(totalDebt)} Total Debt and ${money(extraMonthlyPayment)} Extra Each Month?`,
    profileLabel,
    debt1Name: profile[0],
    debt1Balance,
    debt1MinimumPayment,
    debt2Name: profile[3],
    debt2Balance,
    debt2MinimumPayment,
    debt3Name: profile[6],
    debt3Balance,
    debt3MinimumPayment,
    extraMonthlyPayment,
    featured,
  };
}

const snowballProfiles = ['starter', 'family', 'rebuild', 'catchup', 'mixed'] as const;
const snowballScales = [0.8, 1, 1.2, 1.4, 1.6];
const snowballExtraPayments = [0, 50, 100, 150, 200, 250, 300, 400];

export const debtSnowballSeoRecords: DebtSnowballSeoRecord[] =
  snowballProfiles.flatMap((profileLabel) =>
    snowballScales.flatMap((scale) =>
      snowballExtraPayments.map((extraMonthlyPayment) =>
        debtSnowballRecord(
          profileLabel,
          scale,
          extraMonthlyPayment,
          profileLabel === 'rebuild' &&
            scale === 1.2 &&
            extraMonthlyPayment === 200,
        ),
      ),
    ),
  );

export const featuredDebtSnowballSeoRecords = debtSnowballSeoRecords.filter(
  (record) => record.featured,
);
