import { fourPercentRuleSeoRecords } from './four-percent-rule';
import { compoundInterestSeoRecords } from './compound-interest';
import { apySeoRecords } from './apy';
import { cagrSeoRecords } from './cagr';
import { dripSeoRecords } from './drip';
import { dividendGrowthSeoRecords } from './dividend-growth';
import { dividendYieldSeoRecords } from './dividend-yield';
import { emergencyFundSeoRecords } from './emergency-fund';
import { etfFeeDragSeoRecords } from './etf-fee-drag';
import { expenseRatioSeoRecords } from './expense-ratio';
import { inflationAdjustedReturnSeoRecords } from './inflation-adjusted-return';
import { investmentFeeSeoRecords } from './investment-fee';
import { ruleOf72SeoRecords } from './rule-of-72';
import {
  balanceTransferSeoRecords,
  creditCardPayoffSeoRecords,
} from './debt';
import { fireSeoRecords } from './fire';
import { investmentGrowthSeoRecords } from './investment-growth';
import { lumpSumVsDcaSeoRecords } from './lump-sum-vs-dca';
import { mortgageSeoRecords } from './mortgage';
import { realRateOfReturnSeoRecords } from './real-rate-of-return';
import { retirementWithdrawalSeoRecords } from './retirement-withdrawal';
import { safeWithdrawalRateSeoRecords } from './safe-withdrawal-rate';
import { savingsGoalSeoRecords } from './savings-goal';

export interface ProgrammaticSeoClusterSummary {
  id: string;
  title: string;
  description: string;
  examplesUrl: string;
  calculator: {
    title: string;
    url: string;
  };
  guide: {
    title: string;
    url: string;
  };
  pageCount: number;
  representativePages: {
    title: string;
    url: string;
  }[];
}

const compoundInterestRepresentatives = [
  compoundInterestSeoRecords.find(
    (record) => record.slug === '10000-at-8-percent-for-30-years',
  ),
  compoundInterestSeoRecords.find(
    (record) => record.slug === '50000-at-7-percent-for-20-years',
  ),
].filter((record) => record !== undefined);

const apyRepresentatives = [
  apySeoRecords.find(
    (record) =>
      record.slug === 'high-yield-savings-apy-25000-at-4-35-percent-daily',
  ),
  apySeoRecords.find(
    (record) =>
      record.slug === 'monthly-compounding-apy-10000-at-5-25-percent',
  ),
].filter((record) => record !== undefined);

const cagrRepresentatives = [
  cagrSeoRecords.find(
    (record) => record.slug === 'stock-cagr-10000-to-18000-over-5-years',
  ),
  cagrSeoRecords.find(
    (record) => record.slug === 'portfolio-cagr-250000-to-430000-over-12-years',
  ),
].filter((record) => record !== undefined);

const dividendGrowthRepresentatives = [
  dividendGrowthSeoRecords.find(
    (record) =>
      record.slug ===
      'annual-dividend-income-2400-growing-at-7-percent-for-10-years',
  ),
  dividendGrowthSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-dividend-income-24000-at-4-percent-for-15-years',
  ),
].filter((record) => record !== undefined);

const dividendYieldRepresentatives = [
  dividendYieldSeoRecords.find(
    (record) =>
      record.slug ===
      'stock-dividend-yield-2-4-annual-dividend-40-share-price-200-shares',
  ),
  dividendYieldSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-dividend-yield-3500-shares-4-annual-dividend-50-share-price',
  ),
].filter((record) => record !== undefined);

const dripRepresentatives = [
  dripSeoRecords.find(
    (record) =>
      record.slug ===
      'stock-drip-200-shares-50-share-price-3-5-yield-15-years',
  ),
  dripSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-drip-500000-starting-4-yield-15-years',
  ),
].filter((record) => record !== undefined);

const expenseRatioRepresentatives = [
  expenseRatioSeoRecords.find(
    (record) =>
      record.slug ===
      'annual-fund-fees-100000-at-0-5-expense-ratio-for-30-years',
  ),
  expenseRatioSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-portfolio-fees-500000-at-0-35-expense-ratio-for-30-years',
  ),
].filter((record) => record !== undefined);

const etfFeeDragRepresentatives = [
  etfFeeDragSeoRecords.find(
    (record) =>
      record.slug ===
      'low-cost-etf-fee-drag-100000-starting-1000-monthly-0-05-vs-0-2-for-30-years',
  ),
  etfFeeDragSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-etf-fee-drag-500000-starting-1000-monthly-0-07-vs-0-22-for-25-years',
  ),
].filter((record) => record !== undefined);

const investmentFeeRepresentatives = [
  investmentFeeSeoRecords.find(
    (record) =>
      record.slug ===
      'investment-fees-100000-starting-1000-monthly-0-75-fee-for-30-years',
  ),
  investmentFeeSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-investment-fees-500000-starting-1250-monthly-0-75-fee-for-30-years',
  ),
].filter((record) => record !== undefined);

const lumpSumVsDcaRepresentatives = [
  lumpSumVsDcaSeoRecords.find(
    (record) =>
      record.slug ===
      'lump-sum-vs-dca-120000-at-2000-monthly-8-percent-for-6-years',
  ),
  lumpSumVsDcaSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-rollover-lump-sum-vs-dca-250000-at-7000-monthly-8-percent-for-8-years',
  ),
].filter((record) => record !== undefined);

const realRateOfReturnRepresentatives = [
  realRateOfReturnSeoRecords.find(
    (record) =>
      record.slug ===
      'balanced-portfolio-real-return-6-nominal-return-with-2-5-inflation',
  ),
  realRateOfReturnSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-real-return-6-nominal-return-with-3-inflation',
  ),
].filter((record) => record !== undefined);

const inflationAdjustedReturnRepresentatives = [
  inflationAdjustedReturnSeoRecords.find(
    (record) =>
      record.slug ===
      'balanced-inflation-adjusted-return-100000-at-7-percent-with-3-5-inflation-for-30-years',
  ),
  inflationAdjustedReturnSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-inflation-adjusted-return-500000-at-6-percent-with-3-5-inflation-for-30-years',
  ),
].filter((record) => record !== undefined);

const emergencyFundRepresentatives = [
  emergencyFundSeoRecords.find(
    (record) =>
      record.slug ===
      'starter-emergency-fund-3000-monthly-expenses-3-months-1500-saved-800-monthly',
  ),
  emergencyFundSeoRecords.find(
    (record) =>
      record.slug ===
      'family-emergency-fund-6000-monthly-expenses-6-months-10000-saved-1700-monthly',
  ),
].filter((record) => record !== undefined);

const ruleOf72Representatives = [
  ruleOf72SeoRecords.find(
    (record) => record.slug === 'double-10000-at-8-percent',
  ),
  ruleOf72SeoRecords.find(
    (record) => record.slug === 'inflation-10000-at-3-percent',
  ),
].filter((record) => record !== undefined);

const fireRepresentatives = [
  fireSeoRecords.find(
    (record) => record.slug === 'retire-spending-40000-per-year',
  ),
  fireSeoRecords.find(
    (record) =>
      record.slug === 'can-i-retire-with-1000000-and-40000-spending',
  ),
].filter((record) => record !== undefined);

const investmentGrowthRepresentatives = [
  investmentGrowthSeoRecords.find(
    (record) =>
      record.slug === 'lump-sum-10000-at-8-percent-for-30-years',
  ),
  investmentGrowthSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-investing-50000-with-1000-monthly-at-8-percent-for-30-years',
  ),
].filter((record) => record !== undefined);

const mortgageRepresentatives = [
  mortgageSeoRecords.find(
    (record) =>
      record.slug === '300000-mortgage-at-6-percent-for-30-years',
  ),
  mortgageSeoRecords.find(
    (record) =>
      record.slug === '750000-mortgage-at-5-5-percent-for-15-years',
  ),
].filter((record) => record !== undefined);

const savingsGoalRepresentatives = [
  savingsGoalSeoRecords.find(
    (record) => record.slug === 'save-100000-in-5-years',
  ),
  savingsGoalSeoRecords.find(
    (record) =>
      record.slug === 'save-1000000-by-age-65-starting-at-35',
  ),
].filter((record) => record !== undefined);

const creditCardPayoffRepresentatives = [
  creditCardPayoffSeoRecords.find(
    (record) =>
      record.slug ===
      'pay-off-5000-credit-card-at-24-99-apr-with-200-per-month',
  ),
  creditCardPayoffSeoRecords.find(
    (record) =>
      record.slug ===
      'pay-off-10000-credit-card-at-24-99-apr-with-300-per-month-with-100-extra',
  ),
].filter((record) => record !== undefined);

const balanceTransferRepresentatives = [
  balanceTransferSeoRecords.find(
    (record) =>
      record.slug ===
      'balance-transfer-8000-from-24-99-apr-with-3-fee-18-months',
  ),
  balanceTransferSeoRecords.find(
    (record) =>
      record.slug ===
      'balance-transfer-10000-from-24-99-apr-with-3-fee-18-months',
  ),
].filter((record) => record !== undefined);

const retirementWithdrawalRepresentatives = [
  retirementWithdrawalSeoRecords.find(
    (record) =>
      record.slug ===
      'withdraw-40000-per-year-from-1000000-for-30-years-at-7-return-3-inflation',
  ),
  retirementWithdrawalSeoRecords.find(
    (record) =>
      record.slug ===
      'withdraw-100000-per-year-from-2000000-for-30-years-at-7-return-3-inflation',
  ),
].filter((record) => record !== undefined);

const safeWithdrawalRateRepresentatives = [
  safeWithdrawalRateSeoRecords.find(
    (record) =>
      record.slug ===
      'safe-withdrawal-rate-40000-spending-1000000-portfolio-4-percent-30-years',
  ),
  safeWithdrawalRateSeoRecords.find(
    (record) =>
      record.slug ===
      'safe-withdrawal-rate-100000-spending-2000000-portfolio-4-percent-30-years',
  ),
].filter((record) => record !== undefined);

const fourPercentRuleRepresentatives = [
  fourPercentRuleSeoRecords.find(
    (record) =>
      record.slug ===
      '4-percent-rule-1000000-portfolio-40000-spending-30-years',
  ),
  fourPercentRuleSeoRecords.find(
    (record) =>
      record.slug ===
      '4-percent-rule-2000000-portfolio-100000-spending-30-years',
  ),
].filter((record) => record !== undefined);

export const programmaticSeoClusters: ProgrammaticSeoClusterSummary[] = [
  {
    id: 'compound-interest',
    title: 'Compound Interest Examples',
    description:
      'Explore worked projections across starting balances, annual rates, and time periods.',
    examplesUrl: '/calculators/compound-interest/examples/',
    calculator: {
      title: 'Compound Interest Calculator',
      url: '/calculators/compound-interest/',
    },
    guide: {
      title: 'What Is Compound Interest?',
      url: '/guides/what-is-compound-interest/',
    },
    pageCount: compoundInterestSeoRecords.length,
    representativePages: compoundInterestRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/compound-interest/${record.slug}/`,
    })),
  },
  {
    id: 'apy',
    title: 'APY Examples',
    description:
      'Explore effective-yield examples across savings accounts, high-yield savings, CDs, money market accounts, checking accounts, and compounding-frequency comparisons.',
    examplesUrl: '/calculators/apy/examples/',
    calculator: {
      title: 'APY Calculator',
      url: '/calculators/apy-calculator/',
    },
    guide: {
      title: 'What Is APY?',
      url: '/guides/what-is-apy/',
    },
    pageCount: apySeoRecords.length,
    representativePages: apyRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/apy/${record.slug}/`,
    })),
  },
  {
    id: 'dividend-yield',
    title: 'Dividend Yield Examples',
    description:
      'Explore worked dividend yield snapshots across stocks, ETFs, portfolio income, monthly income, retirement income, and price-change sensitivity scenarios.',
    examplesUrl: '/calculators/dividend-yield/examples/',
    calculator: {
      title: 'Dividend Yield Calculator',
      url: '/calculators/dividend-yield-calculator/',
    },
    guide: {
      title: 'How to Use the Dividend Yield Calculator',
      url: '/guides/how-to-use-dividend-yield-calculator/',
    },
    pageCount: dividendYieldSeoRecords.length,
    representativePages: dividendYieldRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/dividend-yield/${record.slug}/`,
    })),
  },
  {
    id: 'drip',
    title: 'DRIP Examples',
    description:
      'Explore worked dividend reinvestment scenarios across stocks, ETFs, portfolio growth, dividend snowball setups, and retirement income planning.',
    examplesUrl: '/calculators/drip/examples/',
    calculator: {
      title: 'DRIP Calculator',
      url: '/calculators/drip-calculator/',
    },
    guide: {
      title: 'What Is DRIP Investing?',
      url: '/guides/what-is-drip-investing/',
    },
    pageCount: dripSeoRecords.length,
    representativePages: dripRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/drip/${record.slug}/`,
    })),
  },
  {
    id: 'dividend-growth',
    title: 'Dividend Growth Examples',
    description:
      'Explore worked dividend income scenarios across steady income growth, reinvestment framing, dividend snowball paths, portfolio income, and retirement income planning.',
    examplesUrl: '/calculators/dividend-growth/examples/',
    calculator: {
      title: 'Dividend Growth Calculator',
      url: '/calculators/dividend-growth-calculator/',
    },
    guide: {
      title: 'How to Use the Dividend Growth Calculator',
      url: '/guides/how-to-use-dividend-growth-calculator/',
    },
    pageCount: dividendGrowthSeoRecords.length,
    representativePages: dividendGrowthRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/dividend-growth/${record.slug}/`,
    })),
  },
  {
    id: 'expense-ratio',
    title: 'Expense Ratio Examples',
    description:
      'Explore worked fund-fee examples across ETFs, mutual funds, retirement portfolios, taxable accounts, and long-term fee drag scenarios.',
    examplesUrl: '/calculators/expense-ratio/examples/',
    calculator: {
      title: 'Expense Ratio Calculator',
      url: '/calculators/expense-ratio-calculator/',
    },
    guide: {
      title: 'What Is an Expense Ratio?',
      url: '/guides/what-is-expense-ratio/',
    },
    pageCount: expenseRatioSeoRecords.length,
    representativePages: expenseRatioRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/expense-ratio/${record.slug}/`,
    })),
  },
  {
    id: 'etf-fee-drag',
    title: 'ETF Fee Drag Examples',
    description:
      'Explore worked ETF comparisons across low-cost funds, retirement balances, taxable accounts, and larger fee-gap scenarios.',
    examplesUrl: '/calculators/etf-fee-drag/examples/',
    calculator: {
      title: 'ETF Fee Drag Calculator',
      url: '/calculators/etf-fee-drag-calculator/',
    },
    guide: {
      title: 'What Is ETF Fee Drag?',
      url: '/guides/what-is-etf-fee-drag/',
    },
    pageCount: etfFeeDragSeoRecords.length,
    representativePages: etfFeeDragRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/etf-fee-drag/${record.slug}/`,
    })),
  },
  {
    id: 'investment-fee',
    title: 'Investment Fee Examples',
    description:
      'Explore worked annual-fee scenarios across retirement balances, taxable accounts, advisor fees, and recurring contributions.',
    examplesUrl: '/calculators/investment-fee/examples/',
    calculator: {
      title: 'Investment Fee Calculator',
      url: '/calculators/investment-fee-calculator/',
    },
    guide: {
      title: 'What Is an Expense Ratio?',
      url: '/guides/what-is-expense-ratio/',
    },
    pageCount: investmentFeeSeoRecords.length,
    representativePages: investmentFeeRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/investment-fee/${record.slug}/`,
    })),
  },
  {
    id: 'cagr',
    title: 'CAGR Examples',
    description:
      'Explore annualized growth examples across stocks, ETFs, index funds, real estate, cryptocurrency, business metrics, revenue, and portfolio outcomes.',
    examplesUrl: '/calculators/cagr/examples/',
    calculator: {
      title: 'CAGR Calculator',
      url: '/calculators/cagr-calculator/',
    },
    guide: {
      title: 'What Is CAGR?',
      url: '/guides/what-is-cagr/',
    },
    pageCount: cagrSeoRecords.length,
    representativePages: cagrRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/cagr/${record.slug}/`,
    })),
  },
  {
    id: 'rule-of-72',
    title: 'Rule of 72 Examples',
    description:
      'Explore doubling-time examples across investing, savings, inflation, retirement planning, portfolios, index funds, and yield assumptions.',
    examplesUrl: '/calculators/rule-of-72/examples/',
    calculator: {
      title: 'Rule of 72 Calculator',
      url: '/calculators/rule-of-72-calculator/',
    },
    guide: {
      title: 'What Is the Rule of 72?',
      url: '/guides/rule-of-72/',
    },
    pageCount: ruleOf72SeoRecords.length,
    representativePages: ruleOf72Representatives.map((record) => ({
      title: record.question,
      url: `/calculators/rule-of-72/${record.slug}/`,
    })),
  },
  {
    id: 'fire',
    title: 'FIRE Examples',
    description:
      'Compare annual spending targets and portfolio-versus-spending scenarios.',
    examplesUrl: '/calculators/fire/examples/',
    calculator: {
      title: 'FIRE Calculator',
      url: '/calculators/fire-calculator/',
    },
    guide: {
      title: 'A Beginner’s Guide to FIRE',
      url: '/guides/fire/',
    },
    pageCount: fireSeoRecords.length,
    representativePages: fireRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/fire/${record.slug}/`,
    })),
  },
  {
    id: 'investment-growth',
    title: 'Investment Growth Examples',
    description:
      'Explore lump-sum, monthly, annual, retirement, taxable, index fund, ETF, and long-term wealth-building scenarios.',
    examplesUrl: '/calculators/investment-growth/examples/',
    calculator: {
      title: 'Investment Growth Calculator',
      url: '/calculators/investment-growth-calculator/',
    },
    guide: {
      title: 'Investment Growth Guide',
      url: '/guides/investment-growth/',
    },
    pageCount: investmentGrowthSeoRecords.length,
    representativePages: investmentGrowthRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/investment-growth/${record.slug}/`,
    })),
  },
  {
    id: 'lump-sum-vs-dca',
    title: 'Lump Sum vs DCA Examples',
    description:
      'Explore worked comparisons between investing immediately and spreading cash into monthly deposits over time.',
    examplesUrl: '/calculators/lump-sum-vs-dca/examples/',
    calculator: {
      title: 'Lump Sum vs DCA Calculator',
      url: '/calculators/lump-sum-vs-dca-calculator/',
    },
    guide: {
      title: 'Lump Sum vs Dollar Cost Averaging',
      url: '/guides/lump-sum-vs-dollar-cost-averaging/',
    },
    pageCount: lumpSumVsDcaSeoRecords.length,
    representativePages: lumpSumVsDcaRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/lump-sum-vs-dca/${record.slug}/`,
    })),
  },
  {
    id: 'mortgage',
    title: 'Mortgage Payment Examples',
    description:
      'Compare fixed-rate monthly payments, total interest, and repayment across realistic loan amounts, rates, and terms.',
    examplesUrl: '/calculators/mortgage/examples/',
    calculator: {
      title: 'Mortgage Payoff Calculator',
      url: '/calculators/mortgage-payoff-calculator/',
    },
    guide: {
      title: 'A Practical Guide to Buying a Home',
      url: '/guides/home-buying/',
    },
    pageCount: mortgageSeoRecords.length,
    representativePages: mortgageRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/mortgage/${record.slug}/`,
    })),
  },
  {
    id: 'real-rate-of-return',
    title: 'Real Rate of Return Examples',
    description:
      'Explore inflation-adjusted return examples across savings, bonds, balanced portfolios, stocks, and retirement scenarios.',
    examplesUrl: '/calculators/real-rate-of-return/examples/',
    calculator: {
      title: 'Real Rate of Return Calculator',
      url: '/calculators/real-rate-of-return-calculator/',
    },
    guide: {
      title: 'Nominal Return vs Real Return',
      url: '/guides/nominal-vs-real-return/',
    },
    pageCount: realRateOfReturnSeoRecords.length,
    representativePages: realRateOfReturnRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/real-rate-of-return/${record.slug}/`,
    })),
  },
  {
    id: 'inflation-adjusted-return',
    title: 'Inflation-Adjusted Return Examples',
    description:
      'Explore worked nominal-versus-real balance projections across conservative, growth, retirement, and taxable investing scenarios.',
    examplesUrl: '/calculators/inflation-adjusted-return/examples/',
    calculator: {
      title: 'Inflation-Adjusted Return Calculator',
      url: '/calculators/inflation-adjusted-return-calculator/',
    },
    guide: {
      title: 'How Inflation Affects Compound Interest',
      url: '/guides/inflation-and-compound-interest/',
    },
    pageCount: inflationAdjustedReturnSeoRecords.length,
    representativePages: inflationAdjustedReturnRepresentatives.map(
      (record) => ({
        title: record.question,
        url: `/calculators/inflation-adjusted-return/${record.slug}/`,
      }),
    ),
  },
  {
    id: 'emergency-fund',
    title: 'Emergency Fund Examples',
    description:
      'Explore worked emergency-fund scenarios across starter reserves, multi-month buffers, family cash targets, and job-transition planning.',
    examplesUrl: '/calculators/emergency-fund/examples/',
    calculator: {
      title: 'Emergency Fund Calculator',
      url: '/calculators/emergency-fund-calculator/',
    },
    guide: {
      title: 'How to Use the Emergency Fund Calculator',
      url: '/guides/how-to-use-emergency-fund-calculator/',
    },
    pageCount: emergencyFundSeoRecords.length,
    representativePages: emergencyFundRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/emergency-fund/${record.slug}/`,
    })),
  },
  {
    id: 'savings-goal',
    title: 'Savings Goal Examples',
    description:
      'Compare monthly savings targets for general goals, down payments, emergency funds, vacations, vehicles, and retirement milestones.',
    examplesUrl: '/calculators/savings-goal/examples/',
    calculator: {
      title: 'Savings Goal Calculator',
      url: '/calculators/savings-goal-calculator/',
    },
    guide: {
      title: 'Budgeting and Saving for Real Life',
      url: '/guides/budgeting/',
    },
    pageCount: savingsGoalSeoRecords.length,
    representativePages: savingsGoalRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/savings-goal/${record.slug}/`,
    })),
  },
  {
    id: 'credit-card-payoff',
    title: 'Credit Card Payoff Examples',
    description:
      'Compare payoff timelines, interest costs, and extra-payment scenarios for high-interest card balances.',
    examplesUrl: '/calculators/credit-card-payoff/examples/',
    calculator: {
      title: 'Credit Card Payoff Calculator',
      url: '/calculators/credit-card-payoff-calculator/',
    },
    guide: {
      title: 'Debt Payoff Guide',
      url: '/guides/debt-payoff/',
    },
    pageCount: creditCardPayoffSeoRecords.length,
    representativePages: creditCardPayoffRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/credit-card-payoff/${record.slug}/`,
    })),
  },
  {
    id: 'balance-transfer',
    title: 'Balance Transfer Examples',
    description:
      'Compare current card costs with promotional balance transfer offers, fees, and payoff timelines.',
    examplesUrl: '/calculators/balance-transfer/examples/',
    calculator: {
      title: 'Balance Transfer Calculator',
      url: '/calculators/balance-transfer-calculator/',
    },
    guide: {
      title: 'Debt Snowball vs Debt Avalanche',
      url: '/guides/debt-snowball-vs-debt-avalanche/',
    },
    pageCount: balanceTransferSeoRecords.length,
    representativePages: balanceTransferRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/balance-transfer/${record.slug}/`,
    })),
  },
  {
    id: 'retirement-withdrawal',
    title: 'Retirement Withdrawal Examples',
    description:
      'Compare annual withdrawals, portfolio sizes, returns, inflation assumptions, and retirement durations.',
    examplesUrl: '/calculators/retirement-withdrawal/examples/',
    calculator: {
      title: 'Retirement Withdrawal Calculator',
      url: '/calculators/retirement-withdrawal-calculator/',
    },
    guide: {
      title: 'Planning Retirement Withdrawals',
      url: '/guides/retirement-withdrawals/',
    },
    pageCount: retirementWithdrawalSeoRecords.length,
    representativePages: retirementWithdrawalRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/retirement-withdrawal/${record.slug}/`,
    })),
  },
  {
    id: 'safe-withdrawal-rate',
    title: 'Safe Withdrawal Rate Examples',
    description:
      'Compare portfolio values, annual spending targets, withdrawal rates, and retirement durations.',
    examplesUrl: '/calculators/safe-withdrawal-rate/examples/',
    calculator: {
      title: 'Safe Withdrawal Rate Calculator',
      url: '/calculators/safe-withdrawal-rate-calculator/',
    },
    guide: {
      title: 'Planning Retirement Withdrawals',
      url: '/guides/retirement-withdrawals/',
    },
    pageCount: safeWithdrawalRateSeoRecords.length,
    representativePages: safeWithdrawalRateRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/safe-withdrawal-rate/${record.slug}/`,
    })),
  },
  {
    id: 'four-percent-rule',
    title: '4 Percent Rule Examples',
    description:
      'Compare retirement portfolios, annual spending targets, 4% withdrawal amounts, and planning durations.',
    examplesUrl: '/calculators/4-percent-rule/examples/',
    calculator: {
      title: '4 Percent Rule Calculator',
      url: '/calculators/4-percent-rule-calculator/',
    },
    guide: {
      title: 'Planning Retirement Withdrawals',
      url: '/guides/retirement-withdrawals/',
    },
    pageCount: fourPercentRuleSeoRecords.length,
    representativePages: fourPercentRuleRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/4-percent-rule/${record.slug}/`,
    })),
  },
];
