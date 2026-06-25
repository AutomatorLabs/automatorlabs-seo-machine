import { fourPercentRuleSeoRecords } from './four-percent-rule';
import { compoundInterestSeoRecords } from './compound-interest';
import { cagrSeoRecords } from './cagr';
import {
  balanceTransferSeoRecords,
  creditCardPayoffSeoRecords,
} from './debt';
import { fireSeoRecords } from './fire';
import { investmentGrowthSeoRecords } from './investment-growth';
import { mortgageSeoRecords } from './mortgage';
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

const cagrRepresentatives = [
  cagrSeoRecords.find(
    (record) => record.slug === 'stock-cagr-10000-to-18000-over-5-years',
  ),
  cagrSeoRecords.find(
    (record) => record.slug === 'portfolio-cagr-250000-to-430000-over-12-years',
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
