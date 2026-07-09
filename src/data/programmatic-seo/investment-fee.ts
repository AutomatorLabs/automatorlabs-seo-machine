export type InvestmentFeeSeoIntent =
  | 'general-investing-fees'
  | 'retirement-fees'
  | 'advisor-fee-impact'
  | 'taxable-fees'
  | 'fund-fee-drag';

export interface InvestmentFeeSeoRecord {
  slug: string;
  question: string;
  intent: InvestmentFeeSeoIntent;
  startingInvestment: number;
  monthlyContribution: number;
  annualFeePercent: number;
  expectedAnnualReturnPercent: number;
  years: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_INVESTMENT_FEE_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) =>
  rate.toString().replace('.', '-').replace(/-0$/, '');

function createInvestmentFeeRecord(
  intent: InvestmentFeeSeoIntent,
  scenarioLabel: string,
  startingInvestment: number,
  monthlyContribution: number,
  annualFeePercent: number,
  expectedAnnualReturnPercent: number,
  years: number,
  featured = false,
): InvestmentFeeSeoRecord {
  const prefix = {
    'general-investing-fees': 'investment-fees',
    'retirement-fees': 'retirement-investment-fees',
    'advisor-fee-impact': 'advisor-fee-drag',
    'taxable-fees': 'taxable-investment-fees',
    'fund-fee-drag': 'fund-fee-drag',
  }[intent];
  const questionPrefix = {
    'general-investing-fees': 'How Much Could Annual Investment Fees Cost',
    'retirement-fees': 'How Much Could Retirement Investment Fees Cost',
    'advisor-fee-impact': 'How Much Could Advisor Fees Cost',
    'taxable-fees': 'How Much Could Taxable Account Investment Fees Cost',
    'fund-fee-drag': 'How Much Could Fund Fees Cost',
  }[intent];

  return {
    slug: `${prefix}-${startingInvestment}-starting-${monthlyContribution}-monthly-${rateSlug(annualFeePercent)}-fee-for-${years}-years`,
    question: `${questionPrefix} on ${money(startingInvestment)} Plus ${money(monthlyContribution)} Monthly at ${annualFeePercent}% Over ${years} Years?`,
    intent,
    startingInvestment,
    monthlyContribution,
    annualFeePercent,
    expectedAnnualReturnPercent,
    years,
    scenarioLabel,
    featured,
  };
}

const generalInvestments = [10000, 25000, 50000, 100000, 250000];
const generalScenarios = [
  { monthly: 100, fee: 0.25, returnPercent: 6.5, years: 10 },
  { monthly: 250, fee: 0.4, returnPercent: 7, years: 15 },
  { monthly: 500, fee: 0.5, returnPercent: 7, years: 20 },
  { monthly: 750, fee: 0.65, returnPercent: 7.5, years: 25 },
  { monthly: 1000, fee: 0.75, returnPercent: 7.5, years: 30 },
  { monthly: 1250, fee: 0.9, returnPercent: 8, years: 35 },
  { monthly: 1500, fee: 1, returnPercent: 8, years: 40 },
  { monthly: 2000, fee: 1.15, returnPercent: 8, years: 45 },
];

export const generalInvestmentFeeSeoRecords = generalInvestments.flatMap(
  (startingInvestment) =>
    generalScenarios.map((scenario) =>
      createInvestmentFeeRecord(
        'general-investing-fees',
        'general investment fee example',
        startingInvestment,
        scenario.monthly,
        scenario.fee,
        scenario.returnPercent,
        scenario.years,
        startingInvestment === 100000 &&
          scenario.monthly === 1000 &&
          scenario.fee === 0.75 &&
          scenario.years === 30,
      ),
    ),
);

const retirementInvestments = [50000, 100000, 250000, 500000, 1000000];
const retirementScenarios = [
  { monthly: 250, fee: 0.25, returnPercent: 6, years: 10 },
  { monthly: 500, fee: 0.4, returnPercent: 6, years: 15 },
  { monthly: 750, fee: 0.5, returnPercent: 6.5, years: 20 },
  { monthly: 1000, fee: 0.65, returnPercent: 6.5, years: 25 },
  { monthly: 1250, fee: 0.75, returnPercent: 7, years: 30 },
  { monthly: 1500, fee: 0.9, returnPercent: 7, years: 35 },
  { monthly: 1750, fee: 1, returnPercent: 7.5, years: 40 },
  { monthly: 2000, fee: 1.1, returnPercent: 7.5, years: 45 },
];

export const retirementInvestmentFeeSeoRecords = retirementInvestments.flatMap(
  (startingInvestment) =>
    retirementScenarios.map((scenario) =>
      createInvestmentFeeRecord(
        'retirement-fees',
        'retirement portfolio fee example',
        startingInvestment,
        scenario.monthly,
        scenario.fee,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

const advisorInvestments = [25000, 50000, 100000, 250000, 500000];
const advisorScenarios = [
  { monthly: 250, fee: 0.5, returnPercent: 6.5, years: 10 },
  { monthly: 500, fee: 0.75, returnPercent: 7, years: 15 },
  { monthly: 750, fee: 1, returnPercent: 7, years: 20 },
  { monthly: 1000, fee: 1.15, returnPercent: 7.5, years: 25 },
  { monthly: 1250, fee: 1.25, returnPercent: 7.5, years: 30 },
  { monthly: 1500, fee: 1.35, returnPercent: 8, years: 35 },
  { monthly: 1750, fee: 1.5, returnPercent: 8, years: 40 },
  { monthly: 2000, fee: 1.75, returnPercent: 8, years: 45 },
];

export const advisorFeeSeoRecords = advisorInvestments.flatMap(
  (startingInvestment) =>
    advisorScenarios.map((scenario) =>
      createInvestmentFeeRecord(
        'advisor-fee-impact',
        'advisor fee example',
        startingInvestment,
        scenario.monthly,
        scenario.fee,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

const taxableInvestments = [10000, 25000, 50000, 100000, 250000];
const taxableScenarios = [
  { monthly: 100, fee: 0.2, returnPercent: 6.5, years: 10 },
  { monthly: 250, fee: 0.35, returnPercent: 7, years: 15 },
  { monthly: 500, fee: 0.5, returnPercent: 7, years: 20 },
  { monthly: 750, fee: 0.65, returnPercent: 7.5, years: 25 },
  { monthly: 1000, fee: 0.8, returnPercent: 7.5, years: 30 },
  { monthly: 1250, fee: 0.95, returnPercent: 8, years: 35 },
  { monthly: 1500, fee: 1.05, returnPercent: 8, years: 40 },
  { monthly: 2000, fee: 1.2, returnPercent: 8, years: 45 },
];

export const taxableInvestmentFeeSeoRecords = taxableInvestments.flatMap(
  (startingInvestment) =>
    taxableScenarios.map((scenario) =>
      createInvestmentFeeRecord(
        'taxable-fees',
        'taxable account fee example',
        startingInvestment,
        scenario.monthly,
        scenario.fee,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

const fundFeeInvestments = [10000, 25000, 50000, 100000, 250000];
const fundFeeScenarios = [
  { monthly: 100, fee: 0.15, returnPercent: 6.5, years: 10 },
  { monthly: 250, fee: 0.25, returnPercent: 7, years: 15 },
  { monthly: 500, fee: 0.4, returnPercent: 7, years: 20 },
  { monthly: 750, fee: 0.55, returnPercent: 7.5, years: 25 },
  { monthly: 1000, fee: 0.7, returnPercent: 7.5, years: 30 },
  { monthly: 1250, fee: 0.85, returnPercent: 8, years: 35 },
  { monthly: 1500, fee: 1, returnPercent: 8, years: 40 },
  { monthly: 2000, fee: 1.1, returnPercent: 8, years: 45 },
];

export const fundFeeDragSeoRecords = fundFeeInvestments.flatMap(
  (startingInvestment) =>
    fundFeeScenarios.map((scenario) =>
      createInvestmentFeeRecord(
        'fund-fee-drag',
        'fund fee drag example',
        startingInvestment,
        scenario.monthly,
        scenario.fee,
        scenario.returnPercent,
        scenario.years,
      ),
    ),
);

export const investmentFeeSeoRecords: InvestmentFeeSeoRecord[] = [
  ...generalInvestmentFeeSeoRecords,
  ...retirementInvestmentFeeSeoRecords,
  ...advisorFeeSeoRecords,
  ...taxableInvestmentFeeSeoRecords,
  ...fundFeeDragSeoRecords,
];

export const featuredInvestmentFeeSeoRecords = investmentFeeSeoRecords.filter((record) =>
  [
    'investment-fees-50000-starting-1000-monthly-0-75-fee-for-30-years',
    'retirement-investment-fees-250000-starting-1250-monthly-0-75-fee-for-30-years',
    'advisor-fee-drag-100000-starting-1250-monthly-1-25-fee-for-30-years',
    'taxable-investment-fees-50000-starting-1000-monthly-0-8-fee-for-30-years',
    'fund-fee-drag-50000-starting-1000-monthly-0-7-fee-for-30-years',
  ].includes(record.slug),
);
