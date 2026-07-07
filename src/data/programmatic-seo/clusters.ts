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
import { creditCardInterestSeoRecords } from './credit-card-interest';
import { creditCardMinimumPaymentSeoRecords } from './credit-card-minimum-payment';
import { creditCardExtraPaymentSeoRecords } from './credit-card-extra-payment';
import { debtAvalancheSeoRecords } from './debt-avalanche';
import { debtPayoffSeoRecords } from './debt-payoff';
import { debtSnowballSeoRecords } from './debt-snowball';
import { fireSeoRecords } from './fire';
import { helocSeoRecords } from './heloc';
import { coastFireSeoRecords } from './coast-fire';
import { investmentGrowthSeoRecords } from './investment-growth';
import { lumpSumVsDcaSeoRecords } from './lump-sum-vs-dca';
import { loanPaymentSeoRecords } from './loan-payment';
import { mortgageSeoRecords } from './mortgage';
import { mortgagePayoffSeoRecords } from './mortgage-payoff';
import { mortgageRecastSeoRecords } from './mortgage-recast';
import { fourOhOneKSeoRecords } from './401k';
import { propertyTaxSeoRecords } from './property-tax';
import { realRateOfReturnSeoRecords } from './real-rate-of-return';
import { retirementIncomeGapSeoRecords } from './retirement-income-gap';
import { retirementTaxDragSeoRecords } from './retirement-tax-drag';
import { retirementWithdrawalSeoRecords } from './retirement-withdrawal';
import { rothIraSeoRecords } from './roth-ira';
import { rothEarlyWithdrawalSeoRecords } from './roth-ira-early-withdrawal';
import { safeWithdrawalRateSeoRecords } from './safe-withdrawal-rate';
import { autoLoanSeoRecords } from './auto-loan';
import { carSavingsSeoRecords } from './car-savings';
import { monthlySavingsSeoRecords } from './monthly-savings';
import { portfolioWithdrawalSustainabilitySeoRecords } from './portfolio-withdrawal-sustainability';
import { savingsGoalSeoRecords } from './savings-goal';
import { savingsGrowthSeoRecords } from './savings-growth';
import { studentLoanPayoffSeoRecords } from './student-loan-payoff';
import { studentLoanSeoRecords } from './student-loan';
import { vacationSavingsSeoRecords } from './vacation-savings';
import { yearsToRetirementSeoRecords } from './years-to-retirement';
import { closingCostSeoRecords } from './closing-cost';
import { rentVsBuySeoRecords } from './rent-vs-buy';
import { traditionalVsRoth401kSeoRecords } from './traditional-vs-roth-401k';
import { collegeSavings529SeoRecords } from './529-college-savings';
import { collegeCostInflationSeoRecords } from './college-cost-inflation';

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

const savingsGrowthRepresentatives = [
  savingsGrowthSeoRecords.find(
    (record) =>
      record.slug ===
      'savings-growth-10000-starting-500-monthly-at-3-5-percent-for-10-years',
  ),
  savingsGrowthSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-savings-growth-100000-starting-1000-monthly-at-5-5-percent-for-20-years',
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

const monthlySavingsRepresentatives = [
  monthlySavingsSeoRecords.find(
    (record) =>
      record.slug ===
      'milestone-monthly-savings-25000-goal-3-years-5000-saved-at-3-25-percent',
  ),
  monthlySavingsSeoRecords.find(
    (record) =>
      record.slug ===
      'catch-up-monthly-savings-50000-goal-4-years-15000-saved-at-3-5-percent',
  ),
].filter((record) => record !== undefined);

const vacationSavingsRepresentatives = [
  vacationSavingsSeoRecords.find(
    (record) =>
      record.slug ===
      'family-vacation-savings-6000-goal-3-years-3000-saved-at-3-percent',
  ),
  vacationSavingsSeoRecords.find(
    (record) =>
      record.slug ===
      'luxury-vacation-savings-20000-goal-5-years-10000-saved-at-3-25-percent',
  ),
].filter((record) => record !== undefined);

const carSavingsRepresentatives = [
  carSavingsSeoRecords.find(
    (record) =>
      record.slug ===
      'new-car-savings-30000-goal-5-years-10000-saved-at-3-percent',
  ),
  carSavingsSeoRecords.find(
    (record) =>
      record.slug ===
      'family-suv-savings-50000-goal-6-years-20000-saved-at-3-25-percent',
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

const coastFireRepresentatives = [
  coastFireSeoRecords.find(
    (record) =>
      record.slug ===
      'coast-fire-age-35-retire-60-with-100000-saved-for-40000-spending-at-7-percent',
  ),
  coastFireSeoRecords.find(
    (record) =>
      record.slug ===
      'coast-fire-age-45-retire-65-with-250000-saved-for-80000-spending-at-6-percent',
  ),
].filter((record) => record !== undefined);

const fourOhOneKRepresentatives = [
  fourOhOneKSeoRecords.find(
    (record) =>
      record.slug ===
      '401k-growth-75000-starting-1000-employee-250-match-at-7-percent-for-20-years',
  ),
  fourOhOneKSeoRecords.find(
    (record) =>
      record.slug ===
      '401k-growth-300000-starting-1500-employee-250-match-at-8-percent-for-25-years',
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

const mortgagePayoffRepresentatives = [
  mortgagePayoffSeoRecords.find(
    (record) =>
      record.slug ===
      'mortgage-payoff-250000-at-6-percent-for-30-years-with-500-extra',
  ),
  mortgagePayoffSeoRecords.find(
    (record) =>
      record.slug ===
      'mortgage-payoff-500000-at-6-5-percent-for-30-years-with-500-extra',
  ),
].filter((record) => record !== undefined);

const mortgageRecastRepresentatives = [
  mortgageRecastSeoRecords.find(
    (record) =>
      record.slug ===
      'starter-recast-300000-balance-5-rate-25-years-20000-recast-250-fee',
  ),
  mortgageRecastSeoRecords.find(
    (record) =>
      record.slug ===
      'large-balance-1200000-balance-5-5-rate-25-years-100000-recast-350-fee',
  ),
].filter((record) => record !== undefined);

const propertyTaxRepresentatives = [
  propertyTaxSeoRecords.find(
    (record) =>
      record.slug ===
      'starter-home-350000-home-0-95-tax-90-assessed-2-5-growth-15-years',
  ),
  propertyTaxSeoRecords.find(
    (record) =>
      record.slug ===
      'high-tax-area-600000-home-1-9-tax-100-assessed-3-growth-15-years',
  ),
].filter((record) => record !== undefined);

const closingCostRepresentatives = [
  closingCostSeoRecords.find(
    (record) =>
      record.slug ===
      'starter-home-350000-price-35000-down-2-closing-3500-fixed-4000-prepaids-0-credits',
  ),
  closingCostSeoRecords.find(
    (record) =>
      record.slug ===
      'jumbo-home-1500000-price-300000-down-2-5-closing-8000-fixed-13000-prepaids-0-credits',
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

const creditCardInterestRepresentatives = [
  creditCardInterestSeoRecords.find(
    (record) =>
      record.slug ===
      'monthly-interest-5000-balance-at-24-99-apr-paying-225-with-50-extra',
  ),
  creditCardInterestSeoRecords.find(
    (record) =>
      record.slug ===
      'large-balance-20000-balance-at-18-99-apr-paying-400-with-50-extra',
  ),
].filter((record) => record !== undefined);

const creditCardMinimumPaymentRepresentatives = [
  creditCardMinimumPaymentSeoRecords.find(
    (record) =>
      record.slug ===
      'starter-balance-1500-balance-at-18-99-apr-2-percent-minimum-25-floor',
  ),
  creditCardMinimumPaymentSeoRecords.find(
    (record) =>
      record.slug ===
      'high-apr-5000-balance-at-26-99-apr-2-percent-minimum-40-floor',
  ),
].filter((record) => record !== undefined);

const creditCardExtraPaymentRepresentatives = [
  creditCardExtraPaymentSeoRecords.find(
    (record) =>
      record.slug ===
      'starter-balance-3000-balance-at-18-99-apr-125-payment-25-extra',
  ),
  creditCardExtraPaymentSeoRecords.find(
    (record) =>
      record.slug ===
      'aggressive-extra-10000-balance-at-19-99-apr-200-payment-100-extra',
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

const loanPaymentRepresentatives = [
  loanPaymentSeoRecords.find(
    (record) =>
      record.slug ===
      'loan-payment-10000-at-6-5-percent-for-4-years-with-50-extra',
  ),
  loanPaymentSeoRecords.find(
    (record) =>
      record.slug ===
      'loan-payment-27500-at-8-5-percent-for-6-years-with-100-extra',
  ),
].filter((record) => record !== undefined);

const debtPayoffRepresentatives = [
  debtPayoffSeoRecords.find(
    (record) =>
      record.slug ===
      'debt-payoff-4000-at-12-percent-with-200-payment-and-50-extra',
  ),
  debtPayoffSeoRecords.find(
    (record) =>
      record.slug ===
      'debt-payoff-20000-at-24-percent-with-500-payment-and-200-extra',
  ),
].filter((record) => record !== undefined);

const debtSnowballRepresentatives = [
  debtSnowballSeoRecords.find(
    (record) =>
      record.slug === 'debt-snowball-rebuild-120-scale-with-200-extra',
  ),
  debtSnowballSeoRecords.find(
    (record) =>
      record.slug === 'debt-snowball-family-100-scale-with-150-extra',
  ),
].filter((record) => record !== undefined);

const debtAvalancheRepresentatives = [
  debtAvalancheSeoRecords.find(
    (record) =>
      record.slug === 'debt-avalanche-rebuild-120-scale-with-200-extra',
  ),
  debtAvalancheSeoRecords.find(
    (record) =>
      record.slug === 'debt-avalanche-mixed-100-scale-with-150-extra',
  ),
].filter((record) => record !== undefined);

const autoLoanRepresentatives = [
  autoLoanSeoRecords.find(
    (record) =>
      record.slug ===
      'auto-loan-30000-price-6000-down-2000-trade-in-5-5-percent-for-5-years',
  ),
  autoLoanSeoRecords.find(
    (record) =>
      record.slug ===
      'auto-loan-55000-price-8000-down-4000-trade-in-6-5-percent-for-6-years',
  ),
].filter((record) => record !== undefined);

const studentLoanRepresentatives = [
  studentLoanSeoRecords.find(
    (record) =>
      record.slug ===
      'student-loan-40000-at-6-percent-for-10-years-with-100-extra',
  ),
  studentLoanSeoRecords.find(
    (record) =>
      record.slug ===
      'student-loan-62500-at-7-percent-for-15-years-with-200-extra',
  ),
].filter((record) => record !== undefined);

const studentLoanPayoffRepresentatives = [
  studentLoanPayoffSeoRecords.find(
    (record) =>
      record.slug ===
      'student-loan-payoff-30000-at-6-percent-with-275-payment-and-75-extra',
  ),
  studentLoanPayoffSeoRecords.find(
    (record) =>
      record.slug ===
      'student-loan-payoff-60000-at-7-percent-with-400-payment-and-125-extra',
  ),
].filter((record) => record !== undefined);

const helocRepresentatives = [
  helocSeoRecords.find(
    (record) =>
      record.slug ===
      'heloc-600000-home-value-300000-mortgage-85-cltv-75000-requested-at-7-75-percent',
  ),
  helocSeoRecords.find(
    (record) =>
      record.slug ===
      'heloc-1000000-home-value-450000-mortgage-90-cltv-150000-requested-at-8-5-percent',
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

const retirementIncomeGapRepresentatives = [
  retirementIncomeGapSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-income-gap-100000-income-with-1500000-portfolio-and-55000-non-portfolio-income-at-4-percent',
  ),
  retirementIncomeGapSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-income-gap-75000-income-with-1000000-portfolio-and-18000-non-portfolio-income-at-5-percent',
  ),
].filter((record) => record !== undefined);

const retirementTaxDragRepresentatives = [
  retirementTaxDragSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-tax-drag-75000-withdrawal-20-tax-for-30-years-at-3-inflation',
  ),
  retirementTaxDragSeoRecords.find(
    (record) =>
      record.slug ===
      'retirement-tax-drag-150000-withdrawal-25-tax-for-30-years-at-4-inflation',
  ),
].filter((record) => record !== undefined);

const rothIraRepresentatives = [
  rothIraSeoRecords.find(
    (record) =>
      record.slug ===
      'roth-ira-25000-starting-500-monthly-at-7-percent-for-20-years',
  ),
  rothIraSeoRecords.find(
    (record) =>
      record.slug ===
      'roth-ira-100000-starting-1000-monthly-at-7-percent-for-30-years',
  ),
].filter((record) => record !== undefined);

const rentVsBuyRepresentatives = [
  rentVsBuySeoRecords.find(
    (record) => record.slug === 'short-hold-375000-home-2000-rent-6-5-rate-3-years',
  ),
  rentVsBuySeoRecords.find(
    (record) => record.slug === 'long-hold-550000-home-2700-rent-6-5-rate-20-years',
  ),
].filter((record) => record !== undefined);

const rothEarlyWithdrawalRepresentatives = [
  rothEarlyWithdrawalSeoRecords.find(
    (record) =>
      record.slug ===
      'contributions-only-withdraw-6000-with-12000-basis-1800-earnings-22-tax-10-penalty',
  ),
  rothEarlyWithdrawalSeoRecords.find(
    (record) =>
      record.slug ===
      'dips-into-earnings-withdraw-20000-with-10000-basis-10000-earnings-22-tax-10-penalty',
  ),
].filter((record) => record !== undefined);

const traditionalVsRoth401kRepresentatives = [
  traditionalVsRoth401kSeoRecords.find(
    (record) =>
      record.slug ===
      'rising-earner-contribute-9000-current-12-retirement-22-return-6-years-20',
  ),
  traditionalVsRoth401kSeoRecords.find(
    (record) =>
      record.slug ===
      'peak-earner-contribute-16000-current-32-retirement-22-return-6-years-15',
  ),
].filter((record) => record !== undefined);

const collegeSavings529Representatives = [
  collegeSavings529SeoRecords.find(
    (record) =>
      record.slug ===
      'newborn-saver-balance-0-contribute-300-return-6-years-18-target-80000',
  ),
  collegeSavings529SeoRecords.find(
    (record) =>
      record.slug ===
      'high-school-final-stretch-balance-20000-contribute-1000-return-5-years-5-target-130000',
  ),
].filter((record) => record !== undefined);

const collegeCostInflationRepresentatives = [
  collegeCostInflationSeoRecords.find(
    (record) =>
      record.slug ===
      'community-college-cost-6000-inflation-4-years-10-duration-2',
  ),
  collegeCostInflationSeoRecords.find(
    (record) =>
      record.slug ===
      'private-university-cost-55000-inflation-5-years-8-duration-4',
  ),
].filter((record) => record !== undefined);

const portfolioWithdrawalSustainabilityRepresentatives = [
  portfolioWithdrawalSustainabilitySeoRecords.find(
    (record) =>
      record.slug ===
      'portfolio-withdrawal-sustainability-1000000-with-50000-annual-for-30-years-at-7-return-3-inflation',
  ),
  portfolioWithdrawalSustainabilitySeoRecords.find(
    (record) =>
      record.slug ===
      'portfolio-withdrawal-sustainability-3000000-with-100000-annual-for-30-years-at-7-return-3-inflation',
  ),
].filter((record) => record !== undefined);

const yearsToRetirementRepresentatives = [
  yearsToRetirementSeoRecords.find(
    (record) =>
      record.slug ===
      'retire-by-60-starting-age-40-with-250000-saved-target-2000000-and-1500-monthly-at-7-percent',
  ),
  yearsToRetirementSeoRecords.find(
    (record) =>
      record.slug ===
      'retire-by-65-starting-age-50-with-500000-saved-target-2000000-and-2000-monthly-at-7-percent',
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
    id: 'coast-fire',
    title: 'Coast FIRE Examples',
    description:
      'Compare current ages, retirement ages, invested balances, and spending targets to see when current assets may already do more of the long-term work.',
    examplesUrl: '/calculators/coast-fire/examples/',
    calculator: {
      title: 'Coast FIRE Calculator',
      url: '/calculators/coast-fire-calculator/',
    },
    guide: {
      title: 'FIRE vs Coast FIRE',
      url: '/guides/fire-vs-coast-fire/',
    },
    pageCount: coastFireSeoRecords.length,
    representativePages: coastFireRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/coast-fire/${record.slug}/`,
    })),
  },
  {
    id: '401k',
    title: '401(k) Examples',
    description:
      'Explore workplace-retirement examples across starting balances, employee contributions, employer match, and long-term compounding.',
    examplesUrl: '/calculators/401k/examples/',
    calculator: {
      title: '401(k) Calculator',
      url: '/calculators/401k-calculator/',
    },
    guide: {
      title: 'Retirement Planning Guide Hub',
      url: '/guides/retirement/',
    },
    pageCount: fourOhOneKSeoRecords.length,
    representativePages: fourOhOneKRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/401k/${record.slug}/`,
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
    id: 'savings-growth',
    title: 'Savings Growth Examples',
    description:
      'Explore future-value examples across existing balances, recurring monthly savings, high-yield accounts, conservative projections, and retirement-oriented timelines.',
    examplesUrl: '/calculators/savings-growth/examples/',
    calculator: {
      title: 'Savings Growth Calculator',
      url: '/calculators/savings-growth-calculator/',
    },
    guide: {
      title: 'What Is Compound Interest?',
      url: '/guides/what-is-compound-interest/',
    },
    pageCount: savingsGrowthSeoRecords.length,
    representativePages: savingsGrowthRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/savings-growth/${record.slug}/`,
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
      title: 'Mortgage Payment Calculator',
      url: '/calculators/mortgage-payment-calculator/',
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
    id: 'mortgage-payoff',
    title: 'Mortgage Payoff Examples',
    description:
      'Explore extra-principal mortgage scenarios across loan balances, rates, terms, and accelerated payoff strategies.',
    examplesUrl: '/calculators/mortgage-payoff/examples/',
    calculator: {
      title: 'Mortgage Payoff Calculator',
      url: '/calculators/mortgage-payoff-calculator/',
    },
    guide: {
      title: 'Mortgage and Home Buying Guide Hub',
      url: '/guides/mortgage/',
    },
    pageCount: mortgagePayoffSeoRecords.length,
    representativePages: mortgagePayoffRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/mortgage-payoff/${record.slug}/`,
    })),
  },
  {
    id: 'mortgage-recast',
    title: 'Mortgage Recast Examples',
    description:
      'Explore lump-sum recast scenarios across remaining balances, recast fees, and cash-flow reduction goals.',
    examplesUrl: '/calculators/mortgage-recast/examples/',
    calculator: {
      title: 'Mortgage Recast Calculator',
      url: '/calculators/mortgage-recast-calculator/',
    },
    guide: {
      title: 'How to Use the Mortgage Recast Calculator',
      url: '/guides/how-to-use-mortgage-recast-calculator/',
    },
    pageCount: mortgageRecastSeoRecords.length,
    representativePages: mortgageRecastRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/mortgage-recast/${record.slug}/`,
    })),
  },
  {
    id: 'property-tax',
    title: 'Property Tax Examples',
    description:
      'Explore yearly and long-run property tax scenarios across assessed values, tax rates, and ownership horizons.',
    examplesUrl: '/calculators/property-tax/examples/',
    calculator: {
      title: 'Property Tax Calculator',
      url: '/calculators/property-tax-calculator/',
    },
    guide: {
      title: 'Mortgage and Home Buying Guide Hub',
      url: '/guides/mortgage/',
    },
    pageCount: propertyTaxSeoRecords.length,
    representativePages: propertyTaxRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/property-tax/${record.slug}/`,
    })),
  },
  {
    id: 'closing-cost',
    title: 'Closing Cost Examples',
    description:
      'Explore cash-to-close scenarios across down payments, lender credits, prepaids, and higher-priced home purchases.',
    examplesUrl: '/calculators/closing-cost/examples/',
    calculator: {
      title: 'Closing Cost Calculator',
      url: '/calculators/closing-cost-calculator/',
    },
    guide: {
      title: 'A Practical Guide to Buying a Home',
      url: '/guides/home-buying/',
    },
    pageCount: closingCostSeoRecords.length,
    representativePages: closingCostRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/closing-cost/${record.slug}/`,
    })),
  },
  {
    id: 'rent-vs-buy',
    title: 'Rent vs Buy Examples',
    description:
      'Explore worked comparisons of renting and buying across starter homes, high-cost metros, short and long time horizons, and high-rent markets.',
    examplesUrl: '/calculators/rent-vs-buy/examples/',
    calculator: {
      title: 'Rent vs Buy Calculator',
      url: '/calculators/rent-vs-buy-calculator/',
    },
    guide: {
      title: 'Rent vs Buy: How to Compare the Real Cost',
      url: '/guides/rent-vs-buy/',
    },
    pageCount: rentVsBuySeoRecords.length,
    representativePages: rentVsBuyRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/rent-vs-buy/${record.slug}/`,
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
    id: 'monthly-savings',
    title: 'Monthly Savings Examples',
    description:
      'Explore worked monthly savings plans across starter funds, milestones, family goals, major purchases, and catch-up scenarios.',
    examplesUrl: '/calculators/monthly-savings/examples/',
    calculator: {
      title: 'Monthly Savings Calculator',
      url: '/calculators/monthly-savings-calculator/',
    },
    guide: {
      title: 'Savings Planning Guide Hub',
      url: '/guides/savings/',
    },
    pageCount: monthlySavingsSeoRecords.length,
    representativePages: monthlySavingsRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/monthly-savings/${record.slug}/`,
    })),
  },
  {
    id: 'vacation-savings',
    title: 'Vacation Savings Examples',
    description:
      'Explore trip-funding examples across weekend getaways, family travel, international trips, luxury vacations, and retirement travel goals.',
    examplesUrl: '/calculators/vacation-savings/examples/',
    calculator: {
      title: 'Vacation Savings Calculator',
      url: '/calculators/vacation-savings-calculator/',
    },
    guide: {
      title: 'How to Use the Vacation Savings Calculator',
      url: '/guides/how-to-use-vacation-savings-calculator/',
    },
    pageCount: vacationSavingsSeoRecords.length,
    representativePages: vacationSavingsRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/vacation-savings/${record.slug}/`,
    })),
  },
  {
    id: 'car-savings',
    title: 'Car Savings Examples',
    description:
      'Explore vehicle-funding examples across down payments, used cars, new cars, family SUVs, and replacement-car savings plans.',
    examplesUrl: '/calculators/car-savings/examples/',
    calculator: {
      title: 'Car Savings Calculator',
      url: '/calculators/car-savings-calculator/',
    },
    guide: {
      title: 'How to Use the Car Savings Calculator',
      url: '/guides/how-to-use-car-savings-calculator/',
    },
    pageCount: carSavingsSeoRecords.length,
    representativePages: carSavingsRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/car-savings/${record.slug}/`,
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
    id: 'credit-card-interest',
    title: 'Credit Card Interest Examples',
    description:
      'Explore monthly interest, payoff timeline, extra-payment, high-APR, and larger-balance credit card scenarios.',
    examplesUrl: '/calculators/credit-card-interest/examples/',
    calculator: {
      title: 'Credit Card Interest Calculator',
      url: '/calculators/credit-card-interest-calculator/',
    },
    guide: {
      title: 'How Credit Card Interest Works',
      url: '/guides/how-credit-card-interest-works/',
    },
    pageCount: creditCardInterestSeoRecords.length,
    representativePages: creditCardInterestRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/credit-card-interest/${record.slug}/`,
    })),
  },
  {
    id: 'credit-card-minimum-payment',
    title: 'Credit Card Minimum Payment Examples',
    description:
      'Explore issuer-style minimum payment scenarios across payment percentages, floors, balances, and APRs.',
    examplesUrl: '/calculators/credit-card-minimum-payment/examples/',
    calculator: {
      title: 'Credit Card Minimum Payment Calculator',
      url: '/calculators/credit-card-minimum-payment-calculator/',
    },
    guide: {
      title: 'Minimum Payment vs Extra Payment',
      url: '/guides/minimum-payment-vs-extra-payment/',
    },
    pageCount: creditCardMinimumPaymentSeoRecords.length,
    representativePages: creditCardMinimumPaymentRepresentatives.map(
      (record) => ({
        title: record.question,
        url: `/calculators/credit-card-minimum-payment/${record.slug}/`,
      }),
    ),
  },
  {
    id: 'credit-card-extra-payment',
    title: 'Credit Card Extra Payment Examples',
    description:
      'Explore recurring extra-payment scenarios across balances, APRs, and accelerated credit card payoff paths.',
    examplesUrl: '/calculators/credit-card-extra-payment/examples/',
    calculator: {
      title: 'Credit Card Extra Payment Calculator',
      url: '/calculators/credit-card-extra-payment-calculator/',
    },
    guide: {
      title: 'Minimum Payment vs Extra Payment',
      url: '/guides/minimum-payment-vs-extra-payment/',
    },
    pageCount: creditCardExtraPaymentSeoRecords.length,
    representativePages: creditCardExtraPaymentRepresentatives.map(
      (record) => ({
        title: record.question,
        url: `/calculators/credit-card-extra-payment/${record.slug}/`,
      }),
    ),
  },
  {
    id: 'debt-payoff',
    title: 'Debt Payoff Examples',
    description:
      'Explore single-debt payoff scenarios across balances, APRs, monthly payments, and extra-payment strategies.',
    examplesUrl: '/calculators/debt-payoff/examples/',
    calculator: {
      title: 'Debt Payoff Calculator',
      url: '/calculators/debt-payoff-calculator/',
    },
    guide: {
      title: 'How to Build a Debt Payoff Plan',
      url: '/guides/debt-payoff/',
    },
    pageCount: debtPayoffSeoRecords.length,
    representativePages: debtPayoffRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/debt-payoff/${record.slug}/`,
    })),
  },
  {
    id: 'debt-snowball',
    title: 'Debt Snowball Examples',
    description:
      'Explore smallest-balance-first payoff scenarios across different debt mixes and extra-payment budgets.',
    examplesUrl: '/calculators/debt-snowball/examples/',
    calculator: {
      title: 'Debt Snowball Calculator',
      url: '/calculators/debt-snowball-calculator/',
    },
    guide: {
      title: 'Debt Snowball vs Debt Avalanche',
      url: '/guides/debt-snowball-vs-debt-avalanche/',
    },
    pageCount: debtSnowballSeoRecords.length,
    representativePages: debtSnowballRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/debt-snowball/${record.slug}/`,
    })),
  },
  {
    id: 'debt-avalanche',
    title: 'Debt Avalanche Examples',
    description:
      'Explore highest-interest-first payoff scenarios across different debt mixes and extra-payment budgets.',
    examplesUrl: '/calculators/debt-avalanche/examples/',
    calculator: {
      title: 'Debt Avalanche Calculator',
      url: '/calculators/debt-avalanche-calculator/',
    },
    guide: {
      title: 'Debt Snowball vs Debt Avalanche',
      url: '/guides/debt-snowball-vs-debt-avalanche/',
    },
    pageCount: debtAvalancheSeoRecords.length,
    representativePages: debtAvalancheRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/debt-avalanche/${record.slug}/`,
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
    id: 'loan-payment',
    title: 'Loan Payment Examples',
    description:
      'Explore fixed-rate loan scenarios across loan amounts, APRs, terms, and extra principal payments.',
    examplesUrl: '/calculators/loan-payment/examples/',
    calculator: {
      title: 'Loan Payment Calculator',
      url: '/calculators/loan-payment-calculator/',
    },
    guide: {
      title: 'How to Build a Debt Payoff Plan',
      url: '/guides/debt-payoff/',
    },
    pageCount: loanPaymentSeoRecords.length,
    representativePages: loanPaymentRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/loan-payment/${record.slug}/`,
    })),
  },
  {
    id: 'auto-loan',
    title: 'Auto Loan Examples',
    description:
      'Explore vehicle financing scenarios across prices, down payments, trade-ins, rates, and loan terms.',
    examplesUrl: '/calculators/auto-loan/examples/',
    calculator: {
      title: 'Auto Loan Calculator',
      url: '/calculators/auto-loan-calculator/',
    },
    guide: {
      title: 'How to Build a Debt Payoff Plan',
      url: '/guides/debt-payoff/',
    },
    pageCount: autoLoanSeoRecords.length,
    representativePages: autoLoanRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/auto-loan/${record.slug}/`,
    })),
  },
  {
    id: 'student-loan',
    title: 'Student Loan Examples',
    description:
      'Explore fixed-term student loan scenarios across balances, interest rates, payoff horizons, and extra monthly payments.',
    examplesUrl: '/calculators/student-loan/examples/',
    calculator: {
      title: 'Student Loan Calculator',
      url: '/calculators/student-loan-calculator/',
    },
    guide: {
      title: 'How to Build a Debt Payoff Plan',
      url: '/guides/debt-payoff/',
    },
    pageCount: studentLoanSeoRecords.length,
    representativePages: studentLoanRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/student-loan/${record.slug}/`,
    })),
  },
  {
    id: 'student-loan-payoff',
    title: 'Student Loan Payoff Examples',
    description:
      'Explore student loan payoff scenarios across balances, rates, current payments, and extra monthly principal.',
    examplesUrl: '/calculators/student-loan-payoff/examples/',
    calculator: {
      title: 'Student Loan Payoff Calculator',
      url: '/calculators/student-loan-payoff-calculator/',
    },
    guide: {
      title: 'How to Build a Debt Payoff Plan',
      url: '/guides/debt-payoff/',
    },
    pageCount: studentLoanPayoffSeoRecords.length,
    representativePages:
      studentLoanPayoffRepresentatives.map((record) => ({
        title: record.question,
        url: `/calculators/student-loan-payoff/${record.slug}/`,
      })),
  },
  {
    id: 'heloc',
    title: 'HELOC Examples',
    description:
      'Explore home equity line scenarios across home values, mortgage balances, CLTV limits, and variable-rate assumptions.',
    examplesUrl: '/calculators/heloc/examples/',
    calculator: {
      title: 'HELOC Calculator',
      url: '/calculators/heloc-calculator/',
    },
    guide: {
      title: 'Mortgage and Home Buying Guide Hub',
      url: '/guides/mortgage/',
    },
    pageCount: helocSeoRecords.length,
    representativePages: helocRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/heloc/${record.slug}/`,
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
    id: 'retirement-income-gap',
    title: 'Retirement Income Gap Examples',
    description:
      'Compare desired retirement income with Social Security, pension, rental income, dividends, passive income, and portfolio support.',
    examplesUrl: '/calculators/retirement-income-gap/examples/',
    calculator: {
      title: 'Retirement Income Gap Calculator',
      url: '/calculators/retirement-income-gap-calculator/',
    },
    guide: {
      title: 'Retirement Planning Guide Hub',
      url: '/guides/retirement/',
    },
    pageCount: retirementIncomeGapSeoRecords.length,
    representativePages: retirementIncomeGapRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/retirement-income-gap/${record.slug}/`,
    })),
  },
  {
    id: 'portfolio-withdrawal-sustainability',
    title: 'Portfolio Withdrawal Sustainability Examples',
    description:
      'Explore withdrawal-durability scenarios across portfolio sizes, annual spending, retirement length, return assumptions, and inflation.',
    examplesUrl: '/calculators/portfolio-withdrawal-sustainability/examples/',
    calculator: {
      title: 'Portfolio Withdrawal Sustainability Calculator',
      url: '/calculators/portfolio-withdrawal-sustainability-calculator/',
    },
    guide: {
      title: 'Planning Retirement Withdrawals',
      url: '/guides/retirement-withdrawals/',
    },
    pageCount: portfolioWithdrawalSustainabilitySeoRecords.length,
    representativePages:
      portfolioWithdrawalSustainabilityRepresentatives.map((record) => ({
        title: record.question,
        url: `/calculators/portfolio-withdrawal-sustainability/${record.slug}/`,
      })),
  },
  {
    id: 'retirement-tax-drag',
    title: 'Retirement Tax Drag Examples',
    description:
      'Explore retirement tax-drag scenarios across annual withdrawals, tax rates, retirement lengths, and inflation assumptions.',
    examplesUrl: '/calculators/retirement-tax-drag/examples/',
    calculator: {
      title: 'Retirement Tax Drag Calculator',
      url: '/calculators/retirement-tax-drag-calculator/',
    },
    guide: {
      title: 'Roth IRA vs Traditional IRA',
      url: '/guides/roth-vs-traditional-ira/',
    },
    pageCount: retirementTaxDragSeoRecords.length,
    representativePages: retirementTaxDragRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/retirement-tax-drag/${record.slug}/`,
    })),
  },
  {
    id: 'roth-ira',
    title: 'Roth IRA Examples',
    description:
      'Explore Roth IRA growth scenarios across starting balances, monthly or annual contributions, return assumptions, and long-term retirement horizons.',
    examplesUrl: '/calculators/roth-ira/examples/',
    calculator: {
      title: 'Roth IRA Calculator',
      url: '/calculators/roth-ira-calculator/',
    },
    guide: {
      title: 'Roth IRA vs Traditional IRA',
      url: '/guides/roth-vs-traditional-ira/',
    },
    pageCount: rothIraSeoRecords.length,
    representativePages: rothIraRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/roth-ira/${record.slug}/`,
    })),
  },
  {
    id: 'roth-ira-early-withdrawal',
    title: 'Roth IRA Early Withdrawal Examples',
    description:
      'Explore contribution-basis withdrawals, earnings exposure, penalty exceptions, and larger hardship withdrawal scenarios.',
    examplesUrl: '/calculators/roth-ira-early-withdrawal/examples/',
    calculator: {
      title: 'Roth IRA Early Withdrawal Calculator',
      url: '/calculators/roth-ira-early-withdrawal-calculator/',
    },
    guide: {
      title: 'Roth IRA vs Traditional IRA',
      url: '/guides/roth-vs-traditional-ira/',
    },
    pageCount: rothEarlyWithdrawalSeoRecords.length,
    representativePages: rothEarlyWithdrawalRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/roth-ira-early-withdrawal/${record.slug}/`,
    })),
  },
  {
    id: 'traditional-vs-roth-401k',
    title: 'Traditional vs Roth 401(k) Examples',
    description:
      'Explore rising-earner, peak-earner, equal-bracket, long-horizon, and catch-up-contribution scenarios comparing Traditional and Roth 401(k) outcomes.',
    examplesUrl: '/calculators/traditional-vs-roth-401k/examples/',
    calculator: {
      title: 'Traditional vs Roth 401(k) Calculator',
      url: '/calculators/traditional-vs-roth-401k-calculator/',
    },
    guide: {
      title: 'Roth IRA vs Traditional IRA',
      url: '/guides/roth-vs-traditional-ira/',
    },
    pageCount: traditionalVsRoth401kSeoRecords.length,
    representativePages: traditionalVsRoth401kRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/traditional-vs-roth-401k/${record.slug}/`,
    })),
  },
  {
    id: 'college-savings-529',
    title: '529 College Savings Examples',
    description:
      'Explore newborn-saver, early-childhood, tween, high-school-final-stretch, and catch-up-late-start 529 savings scenarios against a target college cost.',
    examplesUrl: '/calculators/529-college-savings/examples/',
    calculator: {
      title: '529 College Savings Calculator',
      url: '/calculators/529-college-savings-calculator/',
    },
    guide: {
      title: 'Savings Planning Guide Hub',
      url: '/guides/savings/',
    },
    pageCount: collegeSavings529SeoRecords.length,
    representativePages: collegeSavings529Representatives.map((record) => ({
      title: record.question,
      url: `/calculators/529-college-savings/${record.slug}/`,
    })),
  },
  {
    id: 'college-cost-inflation',
    title: 'College Cost Inflation Examples',
    description:
      'Explore community-college, in-state-public, out-of-state-public, private-university, and high-inflation-scenario projections of future college costs.',
    examplesUrl: '/calculators/college-cost-inflation/examples/',
    calculator: {
      title: 'College Cost Inflation Calculator',
      url: '/calculators/college-cost-inflation-calculator/',
    },
    guide: {
      title: 'How Inflation Affects Compound Interest',
      url: '/guides/inflation-and-compound-interest/',
    },
    pageCount: collegeCostInflationSeoRecords.length,
    representativePages: collegeCostInflationRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/college-cost-inflation/${record.slug}/`,
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
    id: 'years-to-retirement',
    title: 'Years to Retirement Examples',
    description:
      'Explore timeline examples across current ages, target retirement dates, portfolio goals, monthly contributions, and return assumptions.',
    examplesUrl: '/calculators/years-to-retirement/examples/',
    calculator: {
      title: 'Years to Retirement Calculator',
      url: '/calculators/years-to-retirement-calculator/',
    },
    guide: {
      title: 'Retirement Planning Guide Hub',
      url: '/guides/retirement/',
    },
    pageCount: yearsToRetirementSeoRecords.length,
    representativePages: yearsToRetirementRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/years-to-retirement/${record.slug}/`,
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
