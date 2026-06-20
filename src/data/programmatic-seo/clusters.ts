import { compoundInterestSeoRecords } from './compound-interest';
import {
  balanceTransferSeoRecords,
  creditCardPayoffSeoRecords,
} from './debt';
import { fireSeoRecords } from './fire';
import { mortgageSeoRecords } from './mortgage';
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

const fireRepresentatives = [
  fireSeoRecords.find(
    (record) => record.slug === 'retire-spending-40000-per-year',
  ),
  fireSeoRecords.find(
    (record) =>
      record.slug === 'can-i-retire-with-1000000-and-40000-spending',
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
];
