export type EtfFeeDragSeoIntent =
  | 'low-cost-etf'
  | 'index-fund-comparison'
  | 'retirement-etf'
  | 'taxable-etf'
  | 'high-fee-etf';

export interface EtfFeeDragSeoRecord {
  slug: string;
  question: string;
  intent: EtfFeeDragSeoIntent;
  investmentAmount: number;
  monthlyContribution: number;
  etfAExpenseRatioPercent: number;
  etfBExpenseRatioPercent: number;
  expectedAnnualReturnPercent: number;
  years: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_ETF_FEE_DRAG_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const ratioSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function createEtfFeeDragRecord(
  intent: EtfFeeDragSeoIntent,
  scenarioLabel: string,
  investmentAmount: number,
  monthlyContribution: number,
  etfAExpenseRatioPercent: number,
  etfBExpenseRatioPercent: number,
  expectedAnnualReturnPercent: number,
  years: number,
  featured = false,
): EtfFeeDragSeoRecord {
  const intentPrefix = {
    'low-cost-etf': 'low-cost-etf-fee-drag',
    'index-fund-comparison': 'index-fund-fee-drag',
    'retirement-etf': 'retirement-etf-fee-drag',
    'taxable-etf': 'taxable-etf-fee-drag',
    'high-fee-etf': 'high-fee-etf-difference',
  }[intent];

  return {
    slug: `${intentPrefix}-${investmentAmount}-starting-${monthlyContribution}-monthly-${ratioSlug(etfAExpenseRatioPercent)}-vs-${ratioSlug(etfBExpenseRatioPercent)}-for-${years}-years`,
    question: `How Much ETF Fee Drag Could ${money(investmentAmount)} Plus ${money(monthlyContribution)} Monthly See at ${etfAExpenseRatioPercent}% vs ${etfBExpenseRatioPercent}% Over ${years} Years?`,
    intent,
    investmentAmount,
    monthlyContribution,
    etfAExpenseRatioPercent,
    etfBExpenseRatioPercent,
    expectedAnnualReturnPercent,
    years,
    scenarioLabel,
    featured,
  };
}

const lowCostInvestments = [10000, 25000, 50000, 100000, 250000];
const lowCostScenarios = [
  { monthlyContribution: 100, a: 0.03, b: 0.08, returnPercent: 6.5, years: 10 },
  { monthlyContribution: 250, a: 0.03, b: 0.1, returnPercent: 7, years: 15 },
  { monthlyContribution: 500, a: 0.04, b: 0.12, returnPercent: 7, years: 20 },
  { monthlyContribution: 750, a: 0.05, b: 0.15, returnPercent: 7.5, years: 25 },
  { monthlyContribution: 1000, a: 0.05, b: 0.2, returnPercent: 7.5, years: 30 },
  { monthlyContribution: 1250, a: 0.06, b: 0.22, returnPercent: 8, years: 35 },
  { monthlyContribution: 1500, a: 0.07, b: 0.25, returnPercent: 8, years: 40 },
  { monthlyContribution: 2000, a: 0.08, b: 0.3, returnPercent: 8, years: 45 },
];

export const lowCostEtfFeeDragSeoRecords = lowCostInvestments.flatMap(
  (investmentAmount) =>
    lowCostScenarios.map((scenario) =>
      createEtfFeeDragRecord(
        'low-cost-etf',
        'low-cost ETF fee comparison',
        investmentAmount,
        scenario.monthlyContribution,
        scenario.a,
        scenario.b,
        scenario.returnPercent,
        scenario.years,
        investmentAmount === 100000 &&
          scenario.monthlyContribution === 1000 &&
          scenario.a === 0.05 &&
          scenario.b === 0.2 &&
          scenario.years === 30,
      ),
    ),
);

const indexFundInvestments = [10000, 25000, 50000, 100000, 250000];
const indexFundScenarios = [
  { monthlyContribution: 100, a: 0.04, b: 0.09, returnPercent: 6.5, years: 10 },
  { monthlyContribution: 250, a: 0.05, b: 0.12, returnPercent: 7, years: 15 },
  { monthlyContribution: 500, a: 0.06, b: 0.15, returnPercent: 7, years: 20 },
  { monthlyContribution: 750, a: 0.07, b: 0.18, returnPercent: 7.5, years: 25 },
  { monthlyContribution: 1000, a: 0.08, b: 0.2, returnPercent: 7.5, years: 30 },
  { monthlyContribution: 1250, a: 0.09, b: 0.25, returnPercent: 8, years: 35 },
  { monthlyContribution: 1500, a: 0.1, b: 0.3, returnPercent: 8, years: 40 },
  { monthlyContribution: 2000, a: 0.12, b: 0.35, returnPercent: 8, years: 45 },
];

export const indexFundFeeDragSeoRecords = indexFundInvestments.flatMap(
  (investmentAmount) =>
    indexFundScenarios.map((scenario) =>
      createEtfFeeDragRecord(
        'index-fund-comparison',
        'index fund ETF comparison',
        investmentAmount,
        scenario.monthlyContribution,
        scenario.a,
        scenario.b,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

const retirementInvestments = [50000, 100000, 250000, 500000, 1000000];
const retirementScenarios = [
  { monthlyContribution: 250, a: 0.04, b: 0.12, returnPercent: 6, years: 10 },
  { monthlyContribution: 500, a: 0.05, b: 0.15, returnPercent: 6, years: 15 },
  { monthlyContribution: 750, a: 0.06, b: 0.18, returnPercent: 6.5, years: 20 },
  { monthlyContribution: 1000, a: 0.07, b: 0.22, returnPercent: 6.5, years: 25 },
  { monthlyContribution: 1250, a: 0.08, b: 0.25, returnPercent: 7, years: 30 },
  { monthlyContribution: 1500, a: 0.09, b: 0.3, returnPercent: 7, years: 35 },
  { monthlyContribution: 1750, a: 0.1, b: 0.35, returnPercent: 7.5, years: 40 },
  { monthlyContribution: 2000, a: 0.12, b: 0.4, returnPercent: 7.5, years: 45 },
];

export const retirementEtfFeeDragSeoRecords = retirementInvestments.flatMap(
  (investmentAmount) =>
    retirementScenarios.map((scenario) =>
      createEtfFeeDragRecord(
        'retirement-etf',
        'retirement ETF fee comparison',
        investmentAmount,
        scenario.monthlyContribution,
        scenario.a,
        scenario.b,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

const taxableInvestments = [10000, 25000, 50000, 100000, 250000];
const taxableScenarios = [
  { monthlyContribution: 100, a: 0.05, b: 0.14, returnPercent: 6.5, years: 10 },
  { monthlyContribution: 250, a: 0.06, b: 0.16, returnPercent: 7, years: 15 },
  { monthlyContribution: 500, a: 0.07, b: 0.18, returnPercent: 7, years: 20 },
  { monthlyContribution: 750, a: 0.08, b: 0.2, returnPercent: 7.5, years: 25 },
  { monthlyContribution: 1000, a: 0.09, b: 0.24, returnPercent: 7.5, years: 30 },
  { monthlyContribution: 1250, a: 0.1, b: 0.28, returnPercent: 8, years: 35 },
  { monthlyContribution: 1500, a: 0.12, b: 0.32, returnPercent: 8, years: 40 },
  { monthlyContribution: 2000, a: 0.15, b: 0.4, returnPercent: 8, years: 45 },
];

export const taxableEtfFeeDragSeoRecords = taxableInvestments.flatMap(
  (investmentAmount) =>
    taxableScenarios.map((scenario) =>
      createEtfFeeDragRecord(
        'taxable-etf',
        'taxable brokerage ETF comparison',
        investmentAmount,
        scenario.monthlyContribution,
        scenario.a,
        scenario.b,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

const highFeeInvestments = [10000, 25000, 50000, 100000, 250000];
const highFeeScenarios = [
  { monthlyContribution: 100, a: 0.2, b: 0.6, returnPercent: 6.5, years: 10 },
  { monthlyContribution: 250, a: 0.25, b: 0.75, returnPercent: 7, years: 15 },
  { monthlyContribution: 500, a: 0.3, b: 0.9, returnPercent: 7, years: 20 },
  { monthlyContribution: 750, a: 0.35, b: 1.0, returnPercent: 7.5, years: 25 },
  { monthlyContribution: 1000, a: 0.4, b: 1.1, returnPercent: 7.5, years: 30 },
  { monthlyContribution: 1250, a: 0.45, b: 1.2, returnPercent: 8, years: 35 },
  { monthlyContribution: 1500, a: 0.5, b: 1.35, returnPercent: 8, years: 40 },
  { monthlyContribution: 2000, a: 0.6, b: 1.5, returnPercent: 8, years: 45 },
];

export const highFeeEtfDragSeoRecords = highFeeInvestments.flatMap(
  (investmentAmount) =>
    highFeeScenarios.map((scenario) =>
      createEtfFeeDragRecord(
        'high-fee-etf',
        'high-fee ETF comparison',
        investmentAmount,
        scenario.monthlyContribution,
        scenario.a,
        scenario.b,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

export const etfFeeDragSeoRecords: EtfFeeDragSeoRecord[] = [
  ...lowCostEtfFeeDragSeoRecords,
  ...indexFundFeeDragSeoRecords,
  ...retirementEtfFeeDragSeoRecords,
  ...taxableEtfFeeDragSeoRecords,
  ...highFeeEtfDragSeoRecords,
];

