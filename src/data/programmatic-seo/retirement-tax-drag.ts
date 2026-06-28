export interface RetirementTaxDragSeoRecord {
  slug: string;
  question: string;
  annualRetirementWithdrawal: number;
  estimatedTaxRatePercent: number;
  yearsInRetirement: number;
  inflationRatePercent: number;
  featured?: boolean;
}

export const EXPECTED_RETIREMENT_TAX_DRAG_SEO_PAGE_COUNT = 200;

const rateSlug = (value: number) => value.toString().replace('.', '-');
const yearsMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function retirementTaxDragRecord(
  annualRetirementWithdrawal: number,
  estimatedTaxRatePercent: number,
  yearsInRetirement: number,
  inflationRatePercent: number,
  featured = false,
): RetirementTaxDragSeoRecord {
  return {
    slug: `retirement-tax-drag-${annualRetirementWithdrawal}-withdrawal-${rateSlug(estimatedTaxRatePercent)}-tax-for-${yearsInRetirement}-years-at-${rateSlug(inflationRatePercent)}-inflation`,
    question: `How Much Tax Drag Comes From ${yearsMoney(annualRetirementWithdrawal)} of Retirement Withdrawals at ${estimatedTaxRatePercent}% Tax Over ${yearsInRetirement} Years With ${inflationRatePercent}% Inflation?`,
    annualRetirementWithdrawal,
    estimatedTaxRatePercent,
    yearsInRetirement,
    inflationRatePercent,
    featured,
  };
}

const taxDragWithdrawals = [30000, 50000, 75000, 100000, 150000];
const taxDragRates = [10, 15, 20, 25];
const taxDragYears = [20, 30];
const taxDragInflationRates = [2, 2.5, 3, 3.5, 4];

export const retirementTaxDragSeoRecords: RetirementTaxDragSeoRecord[] =
  taxDragWithdrawals.flatMap((annualRetirementWithdrawal) =>
    taxDragRates.flatMap((estimatedTaxRatePercent) =>
      taxDragYears.flatMap((yearsInRetirement) =>
        taxDragInflationRates.map((inflationRatePercent) =>
          retirementTaxDragRecord(
            annualRetirementWithdrawal,
            estimatedTaxRatePercent,
            yearsInRetirement,
            inflationRatePercent,
            annualRetirementWithdrawal === 75000 &&
              estimatedTaxRatePercent === 20 &&
              yearsInRetirement === 30 &&
              inflationRatePercent === 3,
          ),
        ),
      ),
    ),
  );

export const featuredRetirementTaxDragSeoRecords =
  retirementTaxDragSeoRecords.filter((record) => record.featured);
