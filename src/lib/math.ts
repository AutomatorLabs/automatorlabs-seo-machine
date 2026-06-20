export interface FutureValueInput {
  principal: number;
  contributionPerPeriod: number;
  ratePerPeriod: number;
  numberOfPeriods: number;
}

export interface CompoundInterestInput {
  principal: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
  periodsPerYear: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
}

export interface ApyResult {
  apyPercent: number;
  endingBalance: number;
  annualInterest: number;
}

export interface SavingsRateInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings?: number | null;
}

export interface SavingsRateResult {
  monthlySavings: number;
  savingsRate: number;
  annualSavings: number;
}

export interface YearsToTargetInput {
  target: number;
  currentBalance: number;
  monthlyContribution: number;
  annualReturnPercent: number;
}

export interface WithdrawalPlanInput {
  portfolioValue: number;
  withdrawalRatePercent: number;
  annualExpenses: number;
}

export interface WithdrawalIncome {
  annualWithdrawal: number;
  monthlyWithdrawal: number;
  dailyWithdrawal: number;
}

export interface WithdrawalPlanResult {
  safeAnnualWithdrawal: number;
  safeMonthlyWithdrawal: number;
  requiredPortfolio: number;
  portfolioGap: number;
}

export interface SafeWithdrawalRateInput {
  portfolioValue: number;
  annualSpending: number;
}

export interface SafeWithdrawalRateResult {
  withdrawalRateNeeded: number;
  annualSpendingSupportedAtFourPercent: number;
  monthlySpendingSupportedAtFourPercent: number;
  requiredPortfolioAtFourPercent: number;
  portfolioSurplusOrShortfall: number;
}

export interface InflationImpactInput {
  startingAmount: number;
  inflationRatePercent: number;
  years: number;
}

export interface InflationImpactResult {
  futurePurchasingPower: number;
  purchasingPowerLost: number;
  inflationMultiplier: number;
}

export interface ExpenseRatioImpactInput {
  investmentAmount: number;
  expenseRatioPercent: number;
  years: number;
  expectedAnnualReturnPercent: number;
}

export interface ExpenseRatioImpactResult {
  totalFeesPaid: number;
  endingBalanceAfterFees: number;
  endingBalanceWithoutFees: number;
  differenceCausedByFees: number;
}

export interface InvestmentFeeImpactInput {
  startingInvestment: number;
  monthlyContribution: number;
  annualFeePercent: number;
  expectedAnnualReturnPercent: number;
  years: number;
}

export interface InvestmentFeeImpactResult {
  endingBalanceBeforeFees: number;
  endingBalanceAfterFees: number;
  totalCostOfFees: number;
  feeDragPercentage: number;
}

export interface NetWorthInput {
  assets: number[];
  liabilities: number[];
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToAssetRatio: number;
}

export interface BudgetInput {
  monthlyIncome: number;
  expenses: number[];
  monthlySavings: number;
}

export interface BudgetResult {
  totalMonthlyExpenses: number;
  totalMonthlySavings: number;
  monthlySurplusOrDeficit: number;
  savingsRate: number;
  expenseRatio: number;
}

export interface MortgagePayoffInput {
  loanAmount: number;
  annualInterestRatePercent: number;
  loanTermYears: number;
  extraMonthlyPayment: number;
}

export interface MortgagePayoffResult {
  requiredMonthlyPayment: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  payoffTimeMonths: number;
  timeSavedMonths: number;
  interestSaved: number;
}

export interface AutoLoanInput {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxRatePercent: number;
  loanTermYears: number;
  annualInterestRatePercent: number;
}

export interface AutoLoanResult {
  taxAmount: number;
  loanAmount: number;
  monthlyPayment: number;
  totalInterestPaid: number;
  totalCostOfLoan: number;
}

export interface RefinanceInput {
  currentLoanBalance: number;
  currentAnnualInterestRatePercent: number;
  currentRemainingLoanTermYears: number;
  newAnnualInterestRatePercent: number;
  newLoanTermYears: number;
  closingCosts: number;
}

export interface RefinanceResult {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlySavings: number;
  breakEvenMonths: number | null;
  totalInterestSaved: number;
}

export interface MortgageRecastInput {
  currentMortgageBalance: number;
  annualInterestRatePercent: number;
  remainingLoanTermYears: number;
  lumpSumRecastPayment: number;
  recastFee: number;
}

export interface MortgageRecastResult {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlyPaymentReduction: number;
  totalInterestSaved: number;
  newBalance: number;
}

export interface HelocInput {
  homeValue: number;
  currentMortgageBalance: number;
  maximumCltvPercent: number;
  requestedHelocAmount: number;
  annualInterestRatePercent: number;
}

export interface HelocResult {
  maximumAvailableHeloc: number;
  availableEquity: number;
  interestOnlyMonthlyPayment: number;
  approvalBufferOrShortfall: number;
}

export interface RentVsBuyInput {
  monthlyRent: number;
  homePurchasePrice: number;
  downPayment: number;
  mortgageInterestRatePercent: number;
  loanTermYears: number;
  propertyTaxRatePercent: number;
  homeInsurancePerYear: number;
  hoaPerMonth: number;
  maintenanceRatePercent: number;
  homeAppreciationPercent: number;
  investmentReturnPercent: number;
  comparisonYears: number;
}

export interface RentVsBuyResult {
  totalCostOfRenting: number;
  totalCostOfBuying: number;
  estimatedHomeEquity: number;
  rentVsBuyDifference: number;
  betterOption: 'rent' | 'buy' | 'equal';
}

export interface HomeAffordabilityInput {
  annualGrossIncome: number;
  monthlyDebtPayments: number;
  downPayment: number;
  mortgageInterestRatePercent: number;
  loanTermYears: number;
  propertyTaxRatePercent: number;
  homeInsurancePerYear: number;
  hoaPerMonth: number;
  maximumDtiPercent: number;
}

export interface HomeAffordabilityResult {
  affordableHomePrice: number;
  monthlyMortgagePayment: number;
  totalMonthlyHousingCost: number;
  debtToIncomeRatio: number;
  maxMonthlyHousingPayment: number;
}

export interface DebtPayoffInput {
  debtBalance: number;
  annualInterestRatePercent: number;
  monthlyPayment: number;
  extraMonthlyPayment: number;
}

export interface DebtPayoffSchedule {
  reachable: boolean;
  payoffTimeMonths: number | null;
  totalInterestPaid: number | null;
  totalAmountPaid: number | null;
}

export interface DebtPayoffResult {
  baseline: DebtPayoffSchedule;
  accelerated: DebtPayoffSchedule;
  interestSaved: number | null;
}

export interface CreditCardInterestInput {
  balance: number;
  aprPercent: number;
  monthlyPayment: number;
  extraMonthlyPayment: number;
}

export interface CreditCardInterestResult extends DebtPayoffResult {
  monthlyInterest: number;
}

export interface CreditCardMinimumPaymentInput {
  balance: number;
  aprPercent: number;
  minimumPaymentPercent: number;
  minimumPaymentFloor: number;
}

export interface CreditCardMinimumPaymentResult {
  firstMinimumPayment: number;
  firstMonthInterest: number;
  firstMonthPrincipal: number;
  reachable: boolean;
  payoffTimeMonths: number | null;
  totalInterestPaid: number | null;
  totalAmountPaid: number | null;
}

export interface BalanceTransferInput {
  balance: number;
  currentAprPercent: number;
  currentMonthlyPayment: number;
  transferAprPercent: number;
  promotionalMonths: number;
  transferFeePercent: number;
  postPromotionAprPercent: number;
}

export interface BalanceTransferResult {
  transferredBalance: number;
  transferFee: number;
  currentPlan: DebtPayoffSchedule;
  transferPlan: DebtPayoffSchedule;
  estimatedSavings: number | null;
}

export interface DebtSnowballDebt {
  name: string;
  balance: number;
  minimumMonthlyPayment: number;
}

export interface DebtSnowballInput {
  debts: DebtSnowballDebt[];
  extraMonthlyPayment: number;
}

export interface DebtSnowballResult {
  totalDebt: number;
  totalMinimumPayments: number;
  estimatedPayoffMonths: number;
  suggestedPayoffOrder: string[];
}

export interface DebtAvalancheDebt extends DebtSnowballDebt {
  annualInterestRatePercent: number;
}

export interface DebtAvalancheInput {
  debts: DebtAvalancheDebt[];
  extraMonthlyPayment: number;
}

export interface DebtAvalancheResult {
  totalDebt: number;
  totalMinimumPayments: number;
  reachable: boolean;
  estimatedPayoffMonths: number | null;
  suggestedPayoffOrder: string[];
  highestInterestDebt: string;
}

export interface CagrInput {
  startingValue: number;
  endingValue: number;
  years: number;
}

export interface CagrResult {
  cagr: number;
  totalGrowth: number;
  growthMultiple: number;
}

export interface EtfFeeDragInput {
  investmentAmount: number;
  monthlyContribution: number;
  etfAExpenseRatioPercent: number;
  etfBExpenseRatioPercent: number;
  expectedAnnualReturnPercent: number;
  years: number;
}

export interface EtfFeeDragResult {
  etfAEndingBalance: number;
  etfBEndingBalance: number;
  differenceBetweenEtfs: number;
  higherCostEtfDrag: number;
}

export interface DividendYieldInput {
  sharePrice: number;
  annualDividendPerShare: number;
  numberOfShares: number;
}

export interface DividendYieldResult {
  dividendYield: number;
  annualDividendIncome: number;
  monthlyDividendIncome: number;
}

export interface DividendGrowthInput {
  initialAnnualDividendIncome: number;
  annualDividendGrowthRatePercent: number;
  years: number;
}

export interface DividendGrowthResult {
  futureAnnualDividendIncome: number;
  monthlyEquivalentIncome: number;
  totalPercentageIncrease: number;
}

export interface DripInput {
  initialInvestment: number;
  annualDividendYieldPercent: number;
  annualSharePriceAppreciationPercent: number;
  annualDividendGrowthRatePercent: number;
  monthlyContribution: number;
  years: number;
}

export interface DripResult {
  finalPortfolioValue: number;
  totalDividendsEarned: number;
  totalContributions: number;
  estimatedAnnualDividendIncome: number;
}

export interface LumpSumVsDcaInput {
  totalAmount: number;
  dcaMonthlyAmount: number;
  expectedAnnualReturnPercent: number;
  years: number;
}

export interface LumpSumVsDcaResult {
  lumpSumEndingBalance: number;
  dcaEndingBalance: number;
  difference: number;
  betterStrategy: 'Lump sum' | 'DCA' | 'Tie';
}

export interface EmergencyFundInput {
  monthlyEssentialExpenses: number;
  targetMonths: number;
  currentEmergencySavings: number;
  monthlySavingsContribution: number;
}

export interface EmergencyFundResult {
  targetEmergencyFund: number;
  amountStillNeeded: number;
  estimatedMonthsToTarget: number | null;
  status: 'funded' | 'in-progress' | 'unreachable';
}

export interface SavingsGoalInput {
  goalAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
}

export interface SavingsGoalResult {
  amountStillNeeded: number;
  estimatedMonthsToGoal: number | null;
  totalContributionsNeeded: number | null;
  status: 'funded' | 'in-progress' | 'unreachable';
}

export interface RequiredPeriodicSavingsInput {
  goalAmount: number;
  currentSavings: number;
  annualReturnPercent: number;
  years: number;
  periodsPerYear: number;
}

export interface RequiredPeriodicSavingsResult {
  requiredContribution: number;
  endingBalance: number;
  totalContributions: number;
  totalGrowth: number;
}

export interface FinancialIndependenceDateInput {
  currentInvestedAssets: number;
  annualExpenses: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
  withdrawalRatePercent: number;
}

export interface FinancialIndependenceDateResult {
  fireNumber: number;
  amountStillNeeded: number;
  estimatedYearsToFinancialIndependence: number | null;
  status: 'independent' | 'in-progress' | 'unreachable';
}

export interface BaristaFireInput {
  annualExpenses: number;
  annualPartTimeIncome: number;
  withdrawalRatePercent: number;
  currentInvestedAssets: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
}

export interface BaristaFireResult {
  baristaFireNumber: number;
  expensesCoveredByPartTimeIncome: number;
  amountStillNeeded: number;
  estimatedYearsToBaristaFire: number | null;
  status: 'funded' | 'in-progress' | 'unreachable';
}

export interface YearsToRetirementInput {
  currentAge: number;
  targetRetirementAge: number;
  currentInvestedAssets: number;
  targetRetirementPortfolio: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
}

export interface YearsToRetirementResult {
  yearsByAgeTarget: number;
  portfolioGap: number;
  estimatedYearsToTargetPortfolio: number | null;
  status: 'funded' | 'before-target' | 'by-target' | 'after-target' | 'unreachable';
}

export interface RetirementIncomeGapInput {
  desiredAnnualRetirementIncome: number;
  nonPortfolioIncome: number[];
  portfolioValue: number;
  withdrawalRatePercent: number;
}

export interface RetirementIncomeGapResult {
  totalNonPortfolioIncome: number;
  annualIncomeGap: number;
  portfolioWithdrawalSupported: number;
  surplusOrShortfall: number;
}

export interface PortfolioWithdrawalSustainabilityInput {
  portfolioValue: number;
  annualWithdrawalAmount: number;
  expectedAnnualReturnPercent: number;
  inflationRatePercent: number;
  years: number;
}

export interface PortfolioWithdrawalSustainabilityResult {
  endingPortfolioBalance: number;
  totalWithdrawals: number;
  realReturnPercent: number;
  status: 'sustainable' | 'depleted';
}

export interface RetirementTaxDragInput {
  annualRetirementWithdrawal: number;
  estimatedTaxRatePercent: number;
  yearsInRetirement: number;
  inflationRatePercent: number;
}

export interface RetirementTaxDragResult {
  annualTaxesPaid: number;
  afterTaxAnnualIncome: number;
  totalTaxes: number;
  inflationAdjustedTotalTaxes: number;
}

export interface RothVsTraditionalIraInput {
  annualContribution: number;
  currentTaxRatePercent: number;
  retirementTaxRatePercent: number;
  expectedAnnualReturnPercent: number;
  years: number;
}

export interface RothVsTraditionalIraResult {
  rothEndingValue: number;
  traditionalAfterTaxEndingValue: number;
  difference: number;
  betterOption: 'roth' | 'traditional' | 'equal';
}

export interface RothIraProjectionInput {
  currentBalance: number;
  contributionPerPeriod: number;
  expectedAnnualReturnPercent: number;
  years: number;
  periodsPerYear: number;
}

export interface RothIraProjectionResult {
  endingBalance: number;
  futureContributions: number;
  investmentGrowth: number;
}

export interface RothContributionPlanInput {
  annualTarget: number;
  contributedSoFar: number;
  contributionPerPaycheck: number;
  remainingPaychecks: number;
}

export interface RothContributionPlanResult {
  projectedAnnualContribution: number;
  remainingToTarget: number;
  targetProgressPercent: number;
}

export interface RothMaxContributionInput {
  assumedAnnualLimit: number;
  contributedSoFar: number;
  monthsRemaining: number;
}

export interface RothMaxContributionResult {
  remainingAvailable: number;
  monthlyAmountToReachLimit: number;
  weeklyAmountToReachLimit: number;
}

export interface RothVsTaxableInput {
  startingBalance: number;
  annualContribution: number;
  expectedAnnualReturnPercent: number;
  taxableAccountTaxDragPercent: number;
  years: number;
}

export interface RothVsTaxableResult {
  rothEndingBalance: number;
  taxableEndingBalance: number;
  estimatedRothAdvantage: number;
  taxableGrowthDrag: number;
}

export interface RothEarlyWithdrawalInput {
  withdrawalAmount: number;
  contributionBasisAvailable: number;
  earningsAmountSubjectToTaxAndPenalty: number;
  assumedTaxRatePercent: number;
  assumedPenaltyRatePercent: number;
}

export interface RothEarlyWithdrawalResult {
  contributionPortion: number;
  earningsPortion: number;
  estimatedTax: number;
  estimatedPenalty: number;
  estimatedNetWithdrawal: number;
}

export interface FourOhOneKGrowthInput {
  currentBalance: number;
  employeeMonthlyContribution: number;
  employerMonthlyMatch: number;
  expectedAnnualReturnPercent: number;
  years: number;
}

export interface FourOhOneKGrowthResult {
  endingBalance: number;
  totalEmployeeContributions: number;
  totalEmployerMatch: number;
  investmentGrowth: number;
}

export interface FourOhOneKContributionPlanInput {
  annualSalary: number;
  employeeContributionPercent: number;
  employerContributionPercent: number;
  payPeriodsPerYear: number;
}

export interface FourOhOneKContributionPlanResult {
  employeeAnnualContribution: number;
  employeeContributionPerPaycheck: number;
  employerAnnualContribution: number;
  combinedAnnualContribution: number;
}

export interface FourOhOneKEmployerMatchInput {
  annualSalary: number;
  employeeContributionPercent: number;
  employerMatchRatePercent: number;
  employerMatchCapPercentOfSalary: number;
}

export interface FourOhOneKEmployerMatchResult {
  employeeAnnualContribution: number;
  eligibleEmployeeContribution: number;
  estimatedEmployerMatch: number;
  combinedAnnualContribution: number;
}

export interface FourOhOneKMaxContributionInput {
  assumedRegularLimit: number;
  assumedCatchUpAmount: number;
  contributedSoFar: number;
  monthsRemaining: number;
}

export interface FourOhOneKMaxContributionResult {
  assumedTotalLimit: number;
  remainingAvailable: number;
  monthlyAmountToReachAssumedLimit: number;
  semimonthlyAmountToReachAssumedLimit: number;
}

export interface IraGrowthInput {
  currentBalance: number;
  annualContribution: number;
  expectedAnnualReturnPercent: number;
  years: number;
}

export interface IraGrowthResult {
  endingBalance: number;
  totalContributions: number;
  investmentGrowth: number;
  averageAnnualGrowth: number;
}

export type HsaGrowthInput = IraGrowthInput;

export interface HsaGrowthResult {
  endingBalance: number;
  totalContributions: number;
  investmentGrowth: number;
  tripleTaxAdvantagedValue: number;
}

export interface CollegeSavings529Input {
  currentBalance: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
  yearsUntilCollege: number;
  targetCollegeCost: number;
}

export interface CollegeSavings529Result {
  projectedBalance: number;
  totalContributions: number;
  investmentGrowth: number;
  surplusOrShortfall: number;
}

export interface CollegeCostInflationInput {
  currentAnnualCollegeCost: number;
  educationInflationRatePercent: number;
  yearsUntilCollege: number;
  numberOfCollegeYears: number;
}

export interface CollegeCostInflationResult {
  firstYearCollegeCost: number;
  totalCollegeCost: number;
  totalIncrease: number;
  inflationMultiplier: number;
}

export interface TaxableVsTaxAdvantagedInput {
  startingInvestment: number;
  annualContribution: number;
  expectedAnnualReturnPercent: number;
  taxDragPercent: number;
  years: number;
}

export interface TaxableVsTaxAdvantagedResult {
  taxableEndingBalance: number;
  taxAdvantagedEndingBalance: number;
  difference: number;
  taxDragCost: number;
}

export interface RealRateOfReturnInput {
  nominalAnnualReturnPercent: number;
  inflationRatePercent: number;
}

export interface RealRateOfReturnResult {
  realAnnualReturn: number;
  purchasingPowerChange: number;
  inflationAdjustedMultiplier: number;
}

export interface InflationAdjustedReturnInput {
  startingInvestment: number;
  nominalAnnualReturnPercent: number;
  inflationRatePercent: number;
  years: number;
}

export interface InflationAdjustedReturnResult {
  nominalEndingBalance: number;
  inflationAdjustedEndingBalance: number;
  purchasingPowerLost: number;
  realAnnualReturn: number;
}

export function futureValue({
  principal,
  contributionPerPeriod,
  ratePerPeriod,
  numberOfPeriods,
}: FutureValueInput): number {
  if (ratePerPeriod === 0) {
    return principal + contributionPerPeriod * numberOfPeriods;
  }

  const growthFactor = Math.pow(1 + ratePerPeriod, numberOfPeriods);
  const contributionGrowth =
    contributionPerPeriod * ((growthFactor - 1) / ratePerPeriod);

  return principal * growthFactor + contributionGrowth;
}

export function calculateCompoundInterest({
  principal,
  monthlyContribution,
  annualRatePercent,
  years,
  periodsPerYear,
}: CompoundInterestInput): CompoundInterestResult {
  const numberOfPeriods = periodsPerYear * years;
  const ratePerPeriod = annualRatePercent / 100 / periodsPerYear;
  const contributionPerPeriod =
    (monthlyContribution * 12) / periodsPerYear;
  const finalBalance = futureValue({
    principal,
    contributionPerPeriod,
    ratePerPeriod,
    numberOfPeriods,
  });
  const totalContributions =
    principal + monthlyContribution * 12 * years;

  return {
    finalBalance,
    totalContributions,
    totalInterest: finalBalance - totalContributions,
  };
}

export function calculateApy(
  nominalAnnualRatePercent: number,
  periodsPerYear: number,
  startingBalance: number,
): ApyResult {
  const nominalRate = nominalAnnualRatePercent / 100;
  const apy =
    Math.pow(1 + nominalRate / periodsPerYear, periodsPerYear) - 1;
  const annualInterest = startingBalance * apy;

  return {
    apyPercent: apy * 100,
    endingBalance: startingBalance + annualInterest,
    annualInterest,
  };
}

export function calculateSavingsRate({
  monthlyIncome,
  monthlyExpenses,
  monthlySavings,
}: SavingsRateInput): SavingsRateResult {
  const resolvedMonthlySavings =
    monthlySavings == null
      ? monthlyIncome - monthlyExpenses
      : monthlySavings;

  return {
    monthlySavings: resolvedMonthlySavings,
    savingsRate: (resolvedMonthlySavings / monthlyIncome) * 100,
    annualSavings: resolvedMonthlySavings * 12,
  };
}

export function calculateBudget({
  monthlyIncome,
  expenses,
  monthlySavings,
}: BudgetInput): BudgetResult {
  const totalMonthlyExpenses = expenses.reduce(
    (total, expense) => total + expense,
    0,
  );

  return {
    totalMonthlyExpenses,
    totalMonthlySavings: monthlySavings,
    monthlySurplusOrDeficit:
      monthlyIncome - totalMonthlyExpenses - monthlySavings,
    savingsRate: (monthlySavings / monthlyIncome) * 100,
    expenseRatio: (totalMonthlyExpenses / monthlyIncome) * 100,
  };
}

function calculateAmortizationSchedule(
  loanAmount: number,
  monthlyInterestRate: number,
  monthlyPayment: number,
): { months: number; totalInterest: number; totalPaid: number } {
  let balance = loanAmount;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  while (balance > 0.005) {
    const interest = balance * monthlyInterestRate;
    const payment = Math.min(monthlyPayment, balance + interest);

    balance = Math.max(balance + interest - payment, 0);
    totalInterest += interest;
    totalPaid += payment;
    months += 1;
  }

  return { months, totalInterest, totalPaid };
}

function simulateDebtPayoff(
  debtBalance: number,
  annualInterestRatePercent: number,
  monthlyPayment: number,
): DebtPayoffSchedule {
  const monthlyInterestRate = annualInterestRatePercent / 100 / 12;
  const initialMonthlyInterest = calculateMonthlyInterest(
    debtBalance,
    annualInterestRatePercent,
  );

  if (monthlyPayment <= initialMonthlyInterest) {
    return {
      reachable: false,
      payoffTimeMonths: null,
      totalInterestPaid: null,
      totalAmountPaid: null,
    };
  }

  let balance = debtBalance;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  const maximumMonths = 120000;

  while (balance > 0.005 && months < maximumMonths) {
    const interest = balance * monthlyInterestRate;
    const payment = Math.min(monthlyPayment, balance + interest);

    balance = Math.max(balance + interest - payment, 0);
    totalInterest += interest;
    totalPaid += payment;
    months += 1;
  }

  if (balance > 0.005) {
    return {
      reachable: false,
      payoffTimeMonths: null,
      totalInterestPaid: null,
      totalAmountPaid: null,
    };
  }

  return {
    reachable: true,
    payoffTimeMonths: months,
    totalInterestPaid: totalInterest,
    totalAmountPaid: totalPaid,
  };
}

export function calculateMonthlyInterest(
  balance: number,
  annualInterestRatePercent: number,
): number {
  return balance * (annualInterestRatePercent / 100 / 12);
}

export function calculateDebtPayoff({
  debtBalance,
  annualInterestRatePercent,
  monthlyPayment,
  extraMonthlyPayment,
}: DebtPayoffInput): DebtPayoffResult {
  const baseline = simulateDebtPayoff(
    debtBalance,
    annualInterestRatePercent,
    monthlyPayment,
  );
  const accelerated = simulateDebtPayoff(
    debtBalance,
    annualInterestRatePercent,
    monthlyPayment + extraMonthlyPayment,
  );

  return {
    baseline,
    accelerated,
    interestSaved:
      baseline.totalInterestPaid == null ||
      accelerated.totalInterestPaid == null
        ? null
        : baseline.totalInterestPaid - accelerated.totalInterestPaid,
  };
}

export function calculateCreditCardInterest({
  balance,
  aprPercent,
  monthlyPayment,
  extraMonthlyPayment,
}: CreditCardInterestInput): CreditCardInterestResult {
  return {
    monthlyInterest: calculateMonthlyInterest(balance, aprPercent),
    ...calculateDebtPayoff({
      debtBalance: balance,
      annualInterestRatePercent: aprPercent,
      monthlyPayment,
      extraMonthlyPayment,
    }),
  };
}

export function calculateCreditCardMinimumPayment({
  balance,
  aprPercent,
  minimumPaymentPercent,
  minimumPaymentFloor,
}: CreditCardMinimumPaymentInput): CreditCardMinimumPaymentResult {
  const monthlyInterestRate = aprPercent / 100 / 12;
  let remainingBalance = balance;
  let months = 0;
  let totalInterestPaid = 0;
  let totalAmountPaid = 0;
  const maximumMonths = 120000;
  const firstMonthInterest = calculateMonthlyInterest(balance, aprPercent);
  const firstMinimumPayment = Math.min(
    Math.max(balance * (minimumPaymentPercent / 100), minimumPaymentFloor),
    balance + firstMonthInterest,
  );

  if (firstMinimumPayment <= firstMonthInterest && balance > 0.005) {
    return {
      firstMinimumPayment,
      firstMonthInterest,
      firstMonthPrincipal: Math.max(firstMinimumPayment - firstMonthInterest, 0),
      reachable: false,
      payoffTimeMonths: null,
      totalInterestPaid: null,
      totalAmountPaid: null,
    };
  }

  while (remainingBalance > 0.005 && months < maximumMonths) {
    const interest = remainingBalance * monthlyInterestRate;
    const scheduledPayment = Math.max(
      remainingBalance * (minimumPaymentPercent / 100),
      minimumPaymentFloor,
    );
    const payment = Math.min(scheduledPayment, remainingBalance + interest);

    if (payment <= interest && remainingBalance > 0.005) {
      return {
        firstMinimumPayment,
        firstMonthInterest,
        firstMonthPrincipal: Math.max(
          firstMinimumPayment - firstMonthInterest,
          0,
        ),
        reachable: false,
        payoffTimeMonths: null,
        totalInterestPaid: null,
        totalAmountPaid: null,
      };
    }

    remainingBalance = Math.max(remainingBalance + interest - payment, 0);
    totalInterestPaid += interest;
    totalAmountPaid += payment;
    months += 1;
  }

  return {
    firstMinimumPayment,
    firstMonthInterest,
    firstMonthPrincipal: Math.max(firstMinimumPayment - firstMonthInterest, 0),
    reachable: remainingBalance <= 0.005,
    payoffTimeMonths: remainingBalance <= 0.005 ? months : null,
    totalInterestPaid: remainingBalance <= 0.005 ? totalInterestPaid : null,
    totalAmountPaid: remainingBalance <= 0.005 ? totalAmountPaid : null,
  };
}

function simulateBalanceTransferPayoff({
  balance,
  payment,
  promotionalAprPercent,
  promotionalMonths,
  postPromotionAprPercent,
}: {
  balance: number;
  payment: number;
  promotionalAprPercent: number;
  promotionalMonths: number;
  postPromotionAprPercent: number;
}): DebtPayoffSchedule {
  let remainingBalance = balance;
  let months = 0;
  let totalInterestPaid = 0;
  let totalAmountPaid = 0;
  const maximumMonths = 120000;

  while (remainingBalance > 0.005 && months < maximumMonths) {
    const apr =
      months < promotionalMonths
        ? promotionalAprPercent
        : postPromotionAprPercent;
    const interest = remainingBalance * (apr / 100 / 12);
    const actualPayment = Math.min(payment, remainingBalance + interest);

    if (actualPayment <= interest && remainingBalance > 0.005) {
      return {
        reachable: false,
        payoffTimeMonths: null,
        totalInterestPaid: null,
        totalAmountPaid: null,
      };
    }

    remainingBalance = Math.max(
      remainingBalance + interest - actualPayment,
      0,
    );
    totalInterestPaid += interest;
    totalAmountPaid += actualPayment;
    months += 1;
  }

  if (remainingBalance > 0.005) {
    return {
      reachable: false,
      payoffTimeMonths: null,
      totalInterestPaid: null,
      totalAmountPaid: null,
    };
  }

  return {
    reachable: true,
    payoffTimeMonths: months,
    totalInterestPaid,
    totalAmountPaid,
  };
}

export function calculateBalanceTransfer({
  balance,
  currentAprPercent,
  currentMonthlyPayment,
  transferAprPercent,
  promotionalMonths,
  transferFeePercent,
  postPromotionAprPercent,
}: BalanceTransferInput): BalanceTransferResult {
  const transferFee = balance * (transferFeePercent / 100);
  const transferredBalance = balance + transferFee;
  const currentPlan = simulateDebtPayoff(
    balance,
    currentAprPercent,
    currentMonthlyPayment,
  );
  const transferPlan = simulateBalanceTransferPayoff({
    balance: transferredBalance,
    payment: currentMonthlyPayment,
    promotionalAprPercent: transferAprPercent,
    promotionalMonths,
    postPromotionAprPercent,
  });

  return {
    transferredBalance,
    transferFee,
    currentPlan,
    transferPlan,
    estimatedSavings:
      currentPlan.totalAmountPaid == null ||
      transferPlan.totalAmountPaid == null
        ? null
        : currentPlan.totalAmountPaid - transferPlan.totalAmountPaid,
  };
}

export function calculateDebtSnowball({
  debts,
  extraMonthlyPayment,
}: DebtSnowballInput): DebtSnowballResult {
  const activeDebts = debts
    .map((debt, index) => ({ ...debt, index }))
    .filter((debt) => debt.balance > 0)
    .sort((a, b) => a.balance - b.balance || a.index - b.index);
  const totalDebt = activeDebts.reduce(
    (total, debt) => total + debt.balance,
    0,
  );
  const totalMinimumPayments = activeDebts.reduce(
    (total, debt) => total + debt.minimumMonthlyPayment,
    0,
  );
  const monthlyDebtBudget = totalMinimumPayments + extraMonthlyPayment;
  const balances = activeDebts.map((debt) => debt.balance);
  let estimatedPayoffMonths = 0;

  while (balances.some((balance) => balance > 0.005)) {
    let availablePayment = monthlyDebtBudget;

    for (let index = 0; index < activeDebts.length; index += 1) {
      if (balances[index] <= 0.005) {
        continue;
      }

      const minimumPayment = Math.min(
        activeDebts[index].minimumMonthlyPayment,
        balances[index],
        availablePayment,
      );
      balances[index] -= minimumPayment;
      availablePayment -= minimumPayment;
    }

    for (
      let index = 0;
      index < balances.length && availablePayment > 0.005;
      index += 1
    ) {
      if (balances[index] <= 0.005) {
        continue;
      }

      const snowballPayment = Math.min(
        balances[index],
        availablePayment,
      );
      balances[index] -= snowballPayment;
      availablePayment -= snowballPayment;
    }

    estimatedPayoffMonths += 1;
  }

  return {
    totalDebt,
    totalMinimumPayments,
    estimatedPayoffMonths,
    suggestedPayoffOrder: activeDebts.map((debt) => debt.name),
  };
}

export function calculateDebtAvalanche({
  debts,
  extraMonthlyPayment,
}: DebtAvalancheInput): DebtAvalancheResult {
  const activeDebts = debts
    .map((debt, index) => ({ ...debt, index }))
    .filter((debt) => debt.balance > 0)
    .sort(
      (a, b) =>
        b.annualInterestRatePercent - a.annualInterestRatePercent ||
        a.balance - b.balance ||
        a.index - b.index,
    );
  const totalDebt = activeDebts.reduce(
    (total, debt) => total + debt.balance,
    0,
  );
  const totalMinimumPayments = activeDebts.reduce(
    (total, debt) => total + debt.minimumMonthlyPayment,
    0,
  );
  const monthlyDebtBudget = totalMinimumPayments + extraMonthlyPayment;
  const balances = activeDebts.map((debt) => debt.balance);
  const maximumMonths = 120000;
  let estimatedPayoffMonths = 0;
  let reachable = true;

  while (
    balances.some((balance) => balance > 0.005) &&
    estimatedPayoffMonths < maximumMonths
  ) {
    const balanceBeforeInterest = balances.reduce(
      (total, balance) => total + balance,
      0,
    );

    for (let index = 0; index < activeDebts.length; index += 1) {
      if (balances[index] <= 0.005) {
        continue;
      }

      balances[index] +=
        balances[index] *
        (activeDebts[index].annualInterestRatePercent / 100 / 12);
    }

    let availablePayment = monthlyDebtBudget;

    for (let index = 0; index < activeDebts.length; index += 1) {
      if (balances[index] <= 0.005) {
        continue;
      }

      const minimumPayment = Math.min(
        activeDebts[index].minimumMonthlyPayment,
        balances[index],
        availablePayment,
      );
      balances[index] -= minimumPayment;
      availablePayment -= minimumPayment;
    }

    for (
      let index = 0;
      index < balances.length && availablePayment > 0.005;
      index += 1
    ) {
      if (balances[index] <= 0.005) {
        continue;
      }

      const avalanchePayment = Math.min(
        balances[index],
        availablePayment,
      );
      balances[index] -= avalanchePayment;
      availablePayment -= avalanchePayment;
    }

    estimatedPayoffMonths += 1;

    const balanceAfterPayment = balances.reduce(
      (total, balance) => total + Math.max(balance, 0),
      0,
    );
    const comparisonTolerance =
      Math.max(balanceBeforeInterest, 1) * Number.EPSILON * 10;

    if (
      balanceAfterPayment >= balanceBeforeInterest - comparisonTolerance &&
      balanceAfterPayment > 0.005
    ) {
      reachable = false;
      break;
    }
  }

  if (estimatedPayoffMonths >= maximumMonths) {
    reachable = false;
  }

  return {
    totalDebt,
    totalMinimumPayments,
    reachable,
    estimatedPayoffMonths: reachable ? estimatedPayoffMonths : null,
    suggestedPayoffOrder: activeDebts.map((debt) => debt.name),
    highestInterestDebt: activeDebts[0]?.name ?? 'None',
  };
}

export function calculateMortgagePayoff({
  loanAmount,
  annualInterestRatePercent,
  loanTermYears,
  extraMonthlyPayment,
}: MortgagePayoffInput): MortgagePayoffResult {
  const monthlyInterestRate = annualInterestRatePercent / 100 / 12;
  const requiredMonthlyPayment = calculateMonthlyLoanPayment(
    loanAmount,
    annualInterestRatePercent,
    loanTermYears,
  );
  const baselineSchedule = calculateAmortizationSchedule(
    loanAmount,
    monthlyInterestRate,
    requiredMonthlyPayment,
  );
  const acceleratedSchedule = calculateAmortizationSchedule(
    loanAmount,
    monthlyInterestRate,
    requiredMonthlyPayment + extraMonthlyPayment,
  );

  return {
    requiredMonthlyPayment,
    totalInterestPaid: acceleratedSchedule.totalInterest,
    totalAmountPaid: acceleratedSchedule.totalPaid,
    payoffTimeMonths: acceleratedSchedule.months,
    timeSavedMonths:
      baselineSchedule.months - acceleratedSchedule.months,
    interestSaved:
      baselineSchedule.totalInterest - acceleratedSchedule.totalInterest,
  };
}

export function calculateMonthlyLoanPayment(
  principal: number,
  annualInterestRatePercent: number,
  loanTermYears: number,
): number {
  if (principal <= 0) {
    return 0;
  }

  const numberOfPayments = loanTermYears * 12;
  const monthlyInterestRate = annualInterestRatePercent / 100 / 12;

  if (monthlyInterestRate === 0) {
    return principal / numberOfPayments;
  }

  const growthFactor = Math.pow(
    1 + monthlyInterestRate,
    numberOfPayments,
  );

  return (
    (principal * monthlyInterestRate * growthFactor) /
    (growthFactor - 1)
  );
}

export function calculateAutoLoan({
  vehiclePrice,
  downPayment,
  tradeInValue,
  salesTaxRatePercent,
  loanTermYears,
  annualInterestRatePercent,
}: AutoLoanInput): AutoLoanResult {
  const taxAmount = vehiclePrice * (salesTaxRatePercent / 100);
  const loanAmount =
    vehiclePrice + taxAmount - downPayment - tradeInValue;
  const payoff = calculateMortgagePayoff({
    loanAmount,
    annualInterestRatePercent,
    loanTermYears,
    extraMonthlyPayment: 0,
  });

  return {
    taxAmount,
    loanAmount,
    monthlyPayment: payoff.requiredMonthlyPayment,
    totalInterestPaid: payoff.totalInterestPaid,
    totalCostOfLoan: payoff.totalAmountPaid,
  };
}

export function calculateRefinance({
  currentLoanBalance,
  currentAnnualInterestRatePercent,
  currentRemainingLoanTermYears,
  newAnnualInterestRatePercent,
  newLoanTermYears,
  closingCosts,
}: RefinanceInput): RefinanceResult {
  const currentLoan = calculateMortgagePayoff({
    loanAmount: currentLoanBalance,
    annualInterestRatePercent: currentAnnualInterestRatePercent,
    loanTermYears: currentRemainingLoanTermYears,
    extraMonthlyPayment: 0,
  });
  const newLoan = calculateMortgagePayoff({
    loanAmount: currentLoanBalance,
    annualInterestRatePercent: newAnnualInterestRatePercent,
    loanTermYears: newLoanTermYears,
    extraMonthlyPayment: 0,
  });
  const currentMonthlyPayment = currentLoan.requiredMonthlyPayment;
  const newMonthlyPayment = newLoan.requiredMonthlyPayment;
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const currentRemainingMonths = currentRemainingLoanTermYears * 12;
  const newLoanMonths = newLoanTermYears * 12;
  const currentTotalInterest =
    currentMonthlyPayment * currentRemainingMonths - currentLoanBalance;
  const newTotalInterest =
    newMonthlyPayment * newLoanMonths - currentLoanBalance;

  return {
    currentMonthlyPayment,
    newMonthlyPayment,
    monthlySavings,
    breakEvenMonths:
      monthlySavings > 0 ? closingCosts / monthlySavings : null,
    totalInterestSaved:
      currentTotalInterest - newTotalInterest - closingCosts,
  };
}

export function calculateMortgageRecast({
  currentMortgageBalance,
  annualInterestRatePercent,
  remainingLoanTermYears,
  lumpSumRecastPayment,
  recastFee,
}: MortgageRecastInput): MortgageRecastResult {
  const remainingMonths = remainingLoanTermYears * 12;
  const newBalance =
    currentMortgageBalance - lumpSumRecastPayment;
  const currentMonthlyPayment = calculateMonthlyLoanPayment(
    currentMortgageBalance,
    annualInterestRatePercent,
    remainingLoanTermYears,
  );
  const newMonthlyPayment = calculateMonthlyLoanPayment(
    newBalance,
    annualInterestRatePercent,
    remainingLoanTermYears,
  );
  const currentTotalInterest =
    currentMonthlyPayment * remainingMonths - currentMortgageBalance;
  const newTotalInterest =
    newMonthlyPayment * remainingMonths - newBalance + recastFee;

  return {
    currentMonthlyPayment,
    newMonthlyPayment,
    monthlyPaymentReduction:
      currentMonthlyPayment - newMonthlyPayment,
    totalInterestSaved: currentTotalInterest - newTotalInterest,
    newBalance,
  };
}

export function calculateFireNumber(
  annualExpenses: number,
  withdrawalRatePercent: number,
): number {
  return annualExpenses / (withdrawalRatePercent / 100);
}

export function calculateCoastFireNumber(
  fireNumber: number,
  annualReturnPercent: number,
  yearsUntilRetirement: number,
): number {
  return futureValue({
    principal: fireNumber,
    contributionPerPeriod: 0,
    ratePerPeriod: annualReturnPercent / 100,
    numberOfPeriods: -yearsUntilRetirement,
  });
}

export function calculateWithdrawalIncome(
  portfolioValue: number,
  withdrawalRatePercent: number,
): WithdrawalIncome {
  const annualWithdrawal =
    portfolioValue * (withdrawalRatePercent / 100);

  return {
    annualWithdrawal,
    monthlyWithdrawal: annualWithdrawal / 12,
    dailyWithdrawal: annualWithdrawal / 365,
  };
}

export function calculateWithdrawalPlan({
  portfolioValue,
  withdrawalRatePercent,
  annualExpenses,
}: WithdrawalPlanInput): WithdrawalPlanResult {
  const withdrawalIncome = calculateWithdrawalIncome(
    portfolioValue,
    withdrawalRatePercent,
  );
  const requiredPortfolio = calculateFireNumber(
    annualExpenses,
    withdrawalRatePercent,
  );

  return {
    safeAnnualWithdrawal: withdrawalIncome.annualWithdrawal,
    safeMonthlyWithdrawal: withdrawalIncome.monthlyWithdrawal,
    requiredPortfolio,
    portfolioGap: portfolioValue - requiredPortfolio,
  };
}

export function calculateSafeWithdrawalRate({
  portfolioValue,
  annualSpending,
}: SafeWithdrawalRateInput): SafeWithdrawalRateResult {
  const annualSpendingSupportedAtFourPercent = portfolioValue * 0.04;
  const requiredPortfolioAtFourPercent = annualSpending / 0.04;

  return {
    withdrawalRateNeeded: (annualSpending / portfolioValue) * 100,
    annualSpendingSupportedAtFourPercent,
    monthlySpendingSupportedAtFourPercent:
      annualSpendingSupportedAtFourPercent / 12,
    requiredPortfolioAtFourPercent,
    portfolioSurplusOrShortfall:
      portfolioValue - requiredPortfolioAtFourPercent,
  };
}

export function calculateRuleOf72(annualReturnPercent: number): number {
  return 72 / annualReturnPercent;
}

export function calculateInflationImpact({
  startingAmount,
  inflationRatePercent,
  years,
}: InflationImpactInput): InflationImpactResult {
  const inflationMultiplier = Math.pow(
    1 + inflationRatePercent / 100,
    years,
  );
  const futurePurchasingPower = startingAmount / inflationMultiplier;

  return {
    futurePurchasingPower,
    purchasingPowerLost: startingAmount - futurePurchasingPower,
    inflationMultiplier,
  };
}

export function calculateExpenseRatioImpact({
  investmentAmount,
  expenseRatioPercent,
  years,
  expectedAnnualReturnPercent,
}: ExpenseRatioImpactInput): ExpenseRatioImpactResult {
  const netAnnualReturnPercent =
    expectedAnnualReturnPercent - expenseRatioPercent;
  const endingBalanceWithoutFees = futureValue({
    principal: investmentAmount,
    contributionPerPeriod: 0,
    ratePerPeriod: expectedAnnualReturnPercent / 100,
    numberOfPeriods: years,
  });
  const endingBalanceAfterFees = futureValue({
    principal: investmentAmount,
    contributionPerPeriod: 0,
    ratePerPeriod: netAnnualReturnPercent / 100,
    numberOfPeriods: years,
  });
  const differenceCausedByFees =
    endingBalanceWithoutFees - endingBalanceAfterFees;

  return {
    totalFeesPaid: differenceCausedByFees,
    endingBalanceAfterFees,
    endingBalanceWithoutFees,
    differenceCausedByFees,
  };
}

export function calculateInvestmentFeeImpact({
  startingInvestment,
  monthlyContribution,
  annualFeePercent,
  expectedAnnualReturnPercent,
  years,
}: InvestmentFeeImpactInput): InvestmentFeeImpactResult {
  const numberOfPeriods = years * 12;
  const endingBalanceBeforeFees = futureValue({
    principal: startingInvestment,
    contributionPerPeriod: monthlyContribution,
    ratePerPeriod: expectedAnnualReturnPercent / 100 / 12,
    numberOfPeriods,
  });
  const endingBalanceAfterFees = futureValue({
    principal: startingInvestment,
    contributionPerPeriod: monthlyContribution,
    ratePerPeriod:
      (expectedAnnualReturnPercent - annualFeePercent) / 100 / 12,
    numberOfPeriods,
  });
  const totalCostOfFees =
    endingBalanceBeforeFees - endingBalanceAfterFees;

  return {
    endingBalanceBeforeFees,
    endingBalanceAfterFees,
    totalCostOfFees,
    feeDragPercentage:
      endingBalanceBeforeFees === 0
        ? 0
        : (totalCostOfFees / endingBalanceBeforeFees) * 100,
  };
}

export function calculateNetWorth({
  assets,
  liabilities,
}: NetWorthInput): NetWorthResult {
  const totalAssets = assets.reduce((total, amount) => total + amount, 0);
  const totalLiabilities = liabilities.reduce(
    (total, amount) => total + amount,
    0,
  );

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    debtToAssetRatio:
      totalAssets === 0 ? 0 : (totalLiabilities / totalAssets) * 100,
  };
}

export function calculateCagr({
  startingValue,
  endingValue,
  years,
}: CagrInput): CagrResult {
  const growthMultiple = endingValue / startingValue;

  return {
    cagr: (Math.pow(growthMultiple, 1 / years) - 1) * 100,
    totalGrowth: endingValue - startingValue,
    growthMultiple,
  };
}

export function calculateEtfFeeDrag({
  investmentAmount,
  monthlyContribution,
  etfAExpenseRatioPercent,
  etfBExpenseRatioPercent,
  expectedAnnualReturnPercent,
  years,
}: EtfFeeDragInput): EtfFeeDragResult {
  const numberOfPeriods = years * 12;
  const calculateEndingBalance = (expenseRatioPercent: number) =>
    futureValue({
      principal: investmentAmount,
      contributionPerPeriod: monthlyContribution,
      ratePerPeriod:
        (expectedAnnualReturnPercent - expenseRatioPercent) / 100 / 12,
      numberOfPeriods,
    });
  const etfAEndingBalance = calculateEndingBalance(etfAExpenseRatioPercent);
  const etfBEndingBalance = calculateEndingBalance(etfBExpenseRatioPercent);
  const differenceBetweenEtfs = Math.abs(
    etfAEndingBalance - etfBEndingBalance,
  );

  return {
    etfAEndingBalance,
    etfBEndingBalance,
    differenceBetweenEtfs,
    higherCostEtfDrag: differenceBetweenEtfs,
  };
}

export function calculateDividendYield({
  sharePrice,
  annualDividendPerShare,
  numberOfShares,
}: DividendYieldInput): DividendYieldResult {
  const annualDividendIncome = annualDividendPerShare * numberOfShares;

  return {
    dividendYield: (annualDividendPerShare / sharePrice) * 100,
    annualDividendIncome,
    monthlyDividendIncome: annualDividendIncome / 12,
  };
}

export function calculateDividendGrowth({
  initialAnnualDividendIncome,
  annualDividendGrowthRatePercent,
  years,
}: DividendGrowthInput): DividendGrowthResult {
  const futureAnnualDividendIncome =
    initialAnnualDividendIncome *
    Math.pow(1 + annualDividendGrowthRatePercent / 100, years);

  return {
    futureAnnualDividendIncome,
    monthlyEquivalentIncome: futureAnnualDividendIncome / 12,
    totalPercentageIncrease:
      initialAnnualDividendIncome === 0
        ? 0
        : ((futureAnnualDividendIncome - initialAnnualDividendIncome) /
            initialAnnualDividendIncome) *
          100,
  };
}

export function calculateDrip({
  initialInvestment,
  annualDividendYieldPercent,
  annualSharePriceAppreciationPercent,
  annualDividendGrowthRatePercent,
  monthlyContribution,
  years,
}: DripInput): DripResult {
  const numberOfMonths = Math.round(years * 12);
  const monthlyPriceAppreciation =
    Math.pow(1 + annualSharePriceAppreciationPercent / 100, 1 / 12) - 1;
  let portfolioValue = initialInvestment;
  let totalDividendsEarned = 0;

  for (let month = 0; month < numberOfMonths; month += 1) {
    const completedYears = Math.floor(month / 12);
    const currentAnnualYield =
      (annualDividendYieldPercent / 100) *
      Math.pow(1 + annualDividendGrowthRatePercent / 100, completedYears);

    portfolioValue *= 1 + monthlyPriceAppreciation;

    const monthlyDividend = portfolioValue * (currentAnnualYield / 12);
    totalDividendsEarned += monthlyDividend;
    portfolioValue += monthlyDividend + monthlyContribution;
  }

  const endingAnnualYield =
    (annualDividendYieldPercent / 100) *
    Math.pow(1 + annualDividendGrowthRatePercent / 100, years);

  return {
    finalPortfolioValue: portfolioValue,
    totalDividendsEarned,
    totalContributions:
      initialInvestment + monthlyContribution * numberOfMonths,
    estimatedAnnualDividendIncome: portfolioValue * endingAnnualYield,
  };
}

export function calculateLumpSumVsDca({
  totalAmount,
  dcaMonthlyAmount,
  expectedAnnualReturnPercent,
  years,
}: LumpSumVsDcaInput): LumpSumVsDcaResult {
  const numberOfMonths = Math.round(years * 12);
  const monthlyReturn =
    Math.pow(1 + expectedAnnualReturnPercent / 100, 1 / 12) - 1;
  const lumpSumEndingBalance =
    totalAmount * Math.pow(1 + monthlyReturn, numberOfMonths);
  let investedBalance = 0;
  let uninvestedCash = totalAmount;

  for (let month = 0; month < numberOfMonths; month += 1) {
    const amountInvested = Math.min(dcaMonthlyAmount, uninvestedCash);
    investedBalance += amountInvested;
    uninvestedCash -= amountInvested;
    investedBalance *= 1 + monthlyReturn;
  }

  const dcaEndingBalance = investedBalance + uninvestedCash;
  const difference = lumpSumEndingBalance - dcaEndingBalance;
  const comparisonTolerance = 0.005;

  return {
    lumpSumEndingBalance,
    dcaEndingBalance,
    difference,
    betterStrategy:
      Math.abs(difference) < comparisonTolerance
        ? 'Tie'
        : difference > 0
          ? 'Lump sum'
          : 'DCA',
  };
}

export function calculateEmergencyFund({
  monthlyEssentialExpenses,
  targetMonths,
  currentEmergencySavings,
  monthlySavingsContribution,
}: EmergencyFundInput): EmergencyFundResult {
  const targetEmergencyFund = monthlyEssentialExpenses * targetMonths;
  const amountStillNeeded = Math.max(
    targetEmergencyFund - currentEmergencySavings,
    0,
  );

  if (amountStillNeeded === 0) {
    return {
      targetEmergencyFund,
      amountStillNeeded,
      estimatedMonthsToTarget: 0,
      status: 'funded',
    };
  }

  if (monthlySavingsContribution === 0) {
    return {
      targetEmergencyFund,
      amountStillNeeded,
      estimatedMonthsToTarget: null,
      status: 'unreachable',
    };
  }

  return {
    targetEmergencyFund,
    amountStillNeeded,
    estimatedMonthsToTarget: Math.ceil(
      amountStillNeeded / monthlySavingsContribution,
    ),
    status: 'in-progress',
  };
}

export function calculateSavingsGoal({
  goalAmount,
  currentSavings,
  monthlyContribution,
  expectedAnnualReturnPercent,
}: SavingsGoalInput): SavingsGoalResult {
  const amountStillNeeded = Math.max(goalAmount - currentSavings, 0);

  if (amountStillNeeded === 0) {
    return {
      amountStillNeeded,
      estimatedMonthsToGoal: 0,
      totalContributionsNeeded: 0,
      status: 'funded',
    };
  }

  if (monthlyContribution === 0) {
    return {
      amountStillNeeded,
      estimatedMonthsToGoal: null,
      totalContributionsNeeded: null,
      status: 'unreachable',
    };
  }

  const estimatedYears = calculateYearsToTarget({
    target: goalAmount,
    currentBalance: currentSavings,
    monthlyContribution,
    annualReturnPercent: expectedAnnualReturnPercent,
  });
  const estimatedMonthsToGoal =
    estimatedYears == null ? null : Math.round(estimatedYears * 12);

  if (estimatedMonthsToGoal == null) {
    return {
      amountStillNeeded,
      estimatedMonthsToGoal: null,
      totalContributionsNeeded: null,
      status: 'unreachable',
    };
  }

  return {
    amountStillNeeded,
    estimatedMonthsToGoal,
    totalContributionsNeeded: monthlyContribution * estimatedMonthsToGoal,
    status: 'in-progress',
  };
}

export function calculateRequiredPeriodicSavings({
  goalAmount,
  currentSavings,
  annualReturnPercent,
  years,
  periodsPerYear,
}: RequiredPeriodicSavingsInput): RequiredPeriodicSavingsResult {
  const numberOfPeriods = years * periodsPerYear;
  const ratePerPeriod = annualReturnPercent / 100 / periodsPerYear;
  const balanceWithoutContributions = futureValue({
    principal: currentSavings,
    contributionPerPeriod: 0,
    ratePerPeriod,
    numberOfPeriods,
  });

  let requiredContribution = 0;

  if (balanceWithoutContributions < goalAmount) {
    let low = 0;
    let high = Math.max(
      (goalAmount - currentSavings) / numberOfPeriods,
      1,
    );

    while (
      futureValue({
        principal: currentSavings,
        contributionPerPeriod: high,
        ratePerPeriod,
        numberOfPeriods,
      }) < goalAmount
    ) {
      high *= 2;
    }

    for (let iteration = 0; iteration < 80; iteration += 1) {
      const midpoint = (low + high) / 2;
      const endingBalance = futureValue({
        principal: currentSavings,
        contributionPerPeriod: midpoint,
        ratePerPeriod,
        numberOfPeriods,
      });

      if (endingBalance >= goalAmount) high = midpoint;
      else low = midpoint;
    }

    requiredContribution = high;
  }

  const endingBalance = futureValue({
    principal: currentSavings,
    contributionPerPeriod: requiredContribution,
    ratePerPeriod,
    numberOfPeriods,
  });
  const totalContributions =
    currentSavings + requiredContribution * numberOfPeriods;

  return {
    requiredContribution,
    endingBalance,
    totalContributions,
    totalGrowth: endingBalance - totalContributions,
  };
}

export function calculateRealRateOfReturn({
  nominalAnnualReturnPercent,
  inflationRatePercent,
}: RealRateOfReturnInput): RealRateOfReturnResult {
  const inflationAdjustedMultiplier =
    (1 + nominalAnnualReturnPercent / 100) /
    (1 + inflationRatePercent / 100);
  const realAnnualReturn = (inflationAdjustedMultiplier - 1) * 100;

  return {
    realAnnualReturn,
    purchasingPowerChange: realAnnualReturn,
    inflationAdjustedMultiplier,
  };
}

export function calculateInflationAdjustedReturn({
  startingInvestment,
  nominalAnnualReturnPercent,
  inflationRatePercent,
  years,
}: InflationAdjustedReturnInput): InflationAdjustedReturnResult {
  const nominalEndingBalance =
    startingInvestment *
    Math.pow(1 + nominalAnnualReturnPercent / 100, years);
  const { realAnnualReturn, inflationAdjustedMultiplier } =
    calculateRealRateOfReturn({
      nominalAnnualReturnPercent,
      inflationRatePercent,
    });
  const inflationAdjustedEndingBalance =
    startingInvestment * Math.pow(inflationAdjustedMultiplier, years);

  return {
    nominalEndingBalance,
    inflationAdjustedEndingBalance,
    purchasingPowerLost:
      nominalEndingBalance - inflationAdjustedEndingBalance,
    realAnnualReturn,
  };
}

export function calculateYearsToTarget({
  target,
  currentBalance,
  monthlyContribution,
  annualReturnPercent,
}: YearsToTargetInput): number | null {
  if (currentBalance >= target) {
    return 0;
  }

  const amountNeeded = target - currentBalance;
  const monthlyRate = annualReturnPercent / 100 / 12;

  if (monthlyRate === 0) {
    return monthlyContribution > 0
      ? Math.ceil(amountNeeded / monthlyContribution) / 12
      : null;
  }

  if (currentBalance === 0 && monthlyContribution === 0) {
    return null;
  }

  const contributionValue = monthlyContribution / monthlyRate;
  const growthRatio =
    (target + contributionValue) / (currentBalance + contributionValue);
  const months = Math.log(growthRatio) / Math.log1p(monthlyRate);

  return Number.isFinite(months) && months >= 0
    ? Math.ceil(months) / 12
    : null;
}

export function calculateFinancialIndependenceDate({
  currentInvestedAssets,
  annualExpenses,
  monthlyContribution,
  expectedAnnualReturnPercent,
  withdrawalRatePercent,
}: FinancialIndependenceDateInput): FinancialIndependenceDateResult {
  const fireNumber = calculateFireNumber(
    annualExpenses,
    withdrawalRatePercent,
  );
  const amountStillNeeded = Math.max(
    fireNumber - currentInvestedAssets,
    0,
  );

  if (amountStillNeeded === 0) {
    return {
      fireNumber,
      amountStillNeeded,
      estimatedYearsToFinancialIndependence: 0,
      status: 'independent',
    };
  }

  const estimatedYearsToFinancialIndependence = calculateYearsToTarget({
    target: fireNumber,
    currentBalance: currentInvestedAssets,
    monthlyContribution,
    annualReturnPercent: expectedAnnualReturnPercent,
  });

  return {
    fireNumber,
    amountStillNeeded,
    estimatedYearsToFinancialIndependence,
    status:
      estimatedYearsToFinancialIndependence == null
        ? 'unreachable'
        : 'in-progress',
  };
}

export function calculateBaristaFire({
  annualExpenses,
  annualPartTimeIncome,
  withdrawalRatePercent,
  currentInvestedAssets,
  monthlyContribution,
  expectedAnnualReturnPercent,
}: BaristaFireInput): BaristaFireResult {
  const expensesCoveredByPartTimeIncome = Math.min(
    annualExpenses,
    annualPartTimeIncome,
  );
  const remainingExpenses = Math.max(
    annualExpenses - annualPartTimeIncome,
    0,
  );
  const result = calculateFinancialIndependenceDate({
    currentInvestedAssets,
    annualExpenses: remainingExpenses,
    monthlyContribution,
    expectedAnnualReturnPercent,
    withdrawalRatePercent,
  });

  return {
    baristaFireNumber: result.fireNumber,
    expensesCoveredByPartTimeIncome,
    amountStillNeeded: result.amountStillNeeded,
    estimatedYearsToBaristaFire:
      result.estimatedYearsToFinancialIndependence,
    status: result.status === 'independent' ? 'funded' : result.status,
  };
}

export function calculateYearsToRetirement({
  currentAge,
  targetRetirementAge,
  currentInvestedAssets,
  targetRetirementPortfolio,
  monthlyContribution,
  expectedAnnualReturnPercent,
}: YearsToRetirementInput): YearsToRetirementResult {
  const yearsByAgeTarget = targetRetirementAge - currentAge;
  const portfolioGap = Math.max(
    targetRetirementPortfolio - currentInvestedAssets,
    0,
  );

  if (portfolioGap === 0) {
    return {
      yearsByAgeTarget,
      portfolioGap,
      estimatedYearsToTargetPortfolio: 0,
      status: 'funded',
    };
  }

  const estimatedYearsToTargetPortfolio = calculateYearsToTarget({
    target: targetRetirementPortfolio,
    currentBalance: currentInvestedAssets,
    monthlyContribution,
    annualReturnPercent: expectedAnnualReturnPercent,
  });

  if (estimatedYearsToTargetPortfolio == null) {
    return {
      yearsByAgeTarget,
      portfolioGap,
      estimatedYearsToTargetPortfolio,
      status: 'unreachable',
    };
  }

  return {
    yearsByAgeTarget,
    portfolioGap,
    estimatedYearsToTargetPortfolio,
    status:
      estimatedYearsToTargetPortfolio < yearsByAgeTarget
        ? 'before-target'
        : estimatedYearsToTargetPortfolio === yearsByAgeTarget
          ? 'by-target'
          : 'after-target',
  };
}

export function calculateRetirementIncomeGap({
  desiredAnnualRetirementIncome,
  nonPortfolioIncome,
  portfolioValue,
  withdrawalRatePercent,
}: RetirementIncomeGapInput): RetirementIncomeGapResult {
  const totalNonPortfolioIncome = nonPortfolioIncome.reduce(
    (total, income) => total + income,
    0,
  );
  const annualIncomeGap =
    desiredAnnualRetirementIncome - totalNonPortfolioIncome;
  const portfolioWithdrawalSupported = calculateWithdrawalIncome(
    portfolioValue,
    withdrawalRatePercent,
  ).annualWithdrawal;

  return {
    totalNonPortfolioIncome,
    annualIncomeGap,
    portfolioWithdrawalSupported,
    surplusOrShortfall: portfolioWithdrawalSupported - annualIncomeGap,
  };
}

export function calculatePortfolioWithdrawalSustainability({
  portfolioValue,
  annualWithdrawalAmount,
  expectedAnnualReturnPercent,
  inflationRatePercent,
  years,
}: PortfolioWithdrawalSustainabilityInput): PortfolioWithdrawalSustainabilityResult {
  const { realAnnualReturn } = calculateRealRateOfReturn({
    nominalAnnualReturnPercent: expectedAnnualReturnPercent,
    inflationRatePercent,
  });
  const realReturn = realAnnualReturn / 100;
  let endingPortfolioBalance = portfolioValue;

  for (let year = 0; year < years; year += 1) {
    endingPortfolioBalance =
      endingPortfolioBalance * (1 + realReturn) - annualWithdrawalAmount;

    if (endingPortfolioBalance <= 0) {
      endingPortfolioBalance = 0;
      break;
    }
  }

  return {
    endingPortfolioBalance,
    totalWithdrawals: annualWithdrawalAmount * years,
    realReturnPercent: realAnnualReturn,
    status: endingPortfolioBalance > 0 ? 'sustainable' : 'depleted',
  };
}

export function calculateRetirementTaxDrag({
  annualRetirementWithdrawal,
  estimatedTaxRatePercent,
  yearsInRetirement,
  inflationRatePercent,
}: RetirementTaxDragInput): RetirementTaxDragResult {
  const annualTaxesPaid =
    annualRetirementWithdrawal * (estimatedTaxRatePercent / 100);
  const inflationRate = inflationRatePercent / 100;
  let inflationAdjustedTotalTaxes = 0;

  for (let year = 1; year <= yearsInRetirement; year += 1) {
    inflationAdjustedTotalTaxes +=
      annualTaxesPaid / Math.pow(1 + inflationRate, year);
  }

  return {
    annualTaxesPaid,
    afterTaxAnnualIncome: annualRetirementWithdrawal - annualTaxesPaid,
    totalTaxes: annualTaxesPaid * yearsInRetirement,
    inflationAdjustedTotalTaxes,
  };
}

export function calculateRothVsTraditionalIra({
  annualContribution,
  currentTaxRatePercent,
  retirementTaxRatePercent,
  expectedAnnualReturnPercent,
  years,
}: RothVsTraditionalIraInput): RothVsTraditionalIraResult {
  const annualRate = expectedAnnualReturnPercent / 100;
  const rothAnnualContribution =
    annualContribution * (1 - currentTaxRatePercent / 100);
  const rothEndingValue = futureValue({
    principal: 0,
    contributionPerPeriod: rothAnnualContribution,
    ratePerPeriod: annualRate,
    numberOfPeriods: years,
  });
  const traditionalEndingValue = futureValue({
    principal: 0,
    contributionPerPeriod: annualContribution,
    ratePerPeriod: annualRate,
    numberOfPeriods: years,
  });
  const traditionalAfterTaxEndingValue =
    traditionalEndingValue * (1 - retirementTaxRatePercent / 100);
  const difference = rothEndingValue - traditionalAfterTaxEndingValue;
  const comparisonTolerance =
    Math.max(rothEndingValue, traditionalAfterTaxEndingValue, 1) *
    Number.EPSILON *
    10;

  return {
    rothEndingValue,
    traditionalAfterTaxEndingValue,
    difference,
    betterOption:
      Math.abs(difference) <= comparisonTolerance
        ? 'equal'
        : difference > 0
          ? 'roth'
          : 'traditional',
  };
}

export function calculateRothIraProjection({
  currentBalance,
  contributionPerPeriod,
  expectedAnnualReturnPercent,
  years,
  periodsPerYear,
}: RothIraProjectionInput): RothIraProjectionResult {
  const numberOfPeriods = years * periodsPerYear;
  const futureContributions = contributionPerPeriod * numberOfPeriods;
  const endingBalance = futureValue({
    principal: currentBalance,
    contributionPerPeriod,
    ratePerPeriod: expectedAnnualReturnPercent / 100 / periodsPerYear,
    numberOfPeriods,
  });

  return {
    endingBalance,
    futureContributions,
    investmentGrowth:
      endingBalance - currentBalance - futureContributions,
  };
}

export function calculateRothContributionPlan({
  annualTarget,
  contributedSoFar,
  contributionPerPaycheck,
  remainingPaychecks,
}: RothContributionPlanInput): RothContributionPlanResult {
  const projectedAnnualContribution =
    contributedSoFar + contributionPerPaycheck * remainingPaychecks;
  const remainingToTarget = Math.max(
    annualTarget - projectedAnnualContribution,
    0,
  );

  return {
    projectedAnnualContribution,
    remainingToTarget,
    targetProgressPercent:
      annualTarget > 0
        ? (projectedAnnualContribution / annualTarget) * 100
        : 0,
  };
}

export function calculateRothMaxContribution({
  assumedAnnualLimit,
  contributedSoFar,
  monthsRemaining,
}: RothMaxContributionInput): RothMaxContributionResult {
  const remainingAvailable = Math.max(
    assumedAnnualLimit - contributedSoFar,
    0,
  );

  return {
    remainingAvailable,
    monthlyAmountToReachLimit:
      monthsRemaining > 0 ? remainingAvailable / monthsRemaining : 0,
    weeklyAmountToReachLimit:
      monthsRemaining > 0
        ? remainingAvailable / (monthsRemaining * 52 / 12)
        : 0,
  };
}

export function calculateRothVsTaxable({
  startingBalance,
  annualContribution,
  expectedAnnualReturnPercent,
  taxableAccountTaxDragPercent,
  years,
}: RothVsTaxableInput): RothVsTaxableResult {
  const rothEndingBalance = futureValue({
    principal: startingBalance,
    contributionPerPeriod: annualContribution,
    ratePerPeriod: expectedAnnualReturnPercent / 100,
    numberOfPeriods: years,
  });
  const taxableEndingBalance = futureValue({
    principal: startingBalance,
    contributionPerPeriod: annualContribution,
    ratePerPeriod:
      Math.max(
        expectedAnnualReturnPercent - taxableAccountTaxDragPercent,
        0,
      ) / 100,
    numberOfPeriods: years,
  });

  return {
    rothEndingBalance,
    taxableEndingBalance,
    estimatedRothAdvantage: rothEndingBalance - taxableEndingBalance,
    taxableGrowthDrag: rothEndingBalance - taxableEndingBalance,
  };
}

export function calculateRothEarlyWithdrawal({
  withdrawalAmount,
  contributionBasisAvailable,
  earningsAmountSubjectToTaxAndPenalty,
  assumedTaxRatePercent,
  assumedPenaltyRatePercent,
}: RothEarlyWithdrawalInput): RothEarlyWithdrawalResult {
  const contributionPortion = Math.min(
    withdrawalAmount,
    contributionBasisAvailable,
  );
  const earningsPortion = Math.min(
    Math.max(withdrawalAmount - contributionPortion, 0),
    earningsAmountSubjectToTaxAndPenalty,
  );
  const estimatedTax = earningsPortion * (assumedTaxRatePercent / 100);
  const estimatedPenalty =
    earningsPortion * (assumedPenaltyRatePercent / 100);

  return {
    contributionPortion,
    earningsPortion,
    estimatedTax,
    estimatedPenalty,
    estimatedNetWithdrawal:
      withdrawalAmount - estimatedTax - estimatedPenalty,
  };
}

export function calculate401kGrowth({
  currentBalance,
  employeeMonthlyContribution,
  employerMonthlyMatch,
  expectedAnnualReturnPercent,
  years,
}: FourOhOneKGrowthInput): FourOhOneKGrowthResult {
  const numberOfMonths = years * 12;
  const totalMonthlyContribution =
    employeeMonthlyContribution + employerMonthlyMatch;
  const totalEmployeeContributions =
    employeeMonthlyContribution * numberOfMonths;
  const totalEmployerMatch = employerMonthlyMatch * numberOfMonths;
  const endingBalance = futureValue({
    principal: currentBalance,
    contributionPerPeriod: totalMonthlyContribution,
    ratePerPeriod: expectedAnnualReturnPercent / 100 / 12,
    numberOfPeriods: numberOfMonths,
  });

  return {
    endingBalance,
    totalEmployeeContributions,
    totalEmployerMatch,
    investmentGrowth:
      endingBalance -
      currentBalance -
      totalEmployeeContributions -
      totalEmployerMatch,
  };
}

export function calculate401kContributionPlan({
  annualSalary,
  employeeContributionPercent,
  employerContributionPercent,
  payPeriodsPerYear,
}: FourOhOneKContributionPlanInput): FourOhOneKContributionPlanResult {
  const employeeAnnualContribution =
    annualSalary * (employeeContributionPercent / 100);
  const employerAnnualContribution =
    annualSalary * (employerContributionPercent / 100);

  return {
    employeeAnnualContribution,
    employeeContributionPerPaycheck:
      payPeriodsPerYear > 0
        ? employeeAnnualContribution / payPeriodsPerYear
        : 0,
    employerAnnualContribution,
    combinedAnnualContribution:
      employeeAnnualContribution + employerAnnualContribution,
  };
}

export function calculate401kEmployerMatch({
  annualSalary,
  employeeContributionPercent,
  employerMatchRatePercent,
  employerMatchCapPercentOfSalary,
}: FourOhOneKEmployerMatchInput): FourOhOneKEmployerMatchResult {
  const employeeAnnualContribution =
    annualSalary * (employeeContributionPercent / 100);
  const eligibleEmployeeContribution =
    annualSalary *
    (Math.min(
      employeeContributionPercent,
      employerMatchCapPercentOfSalary,
    ) /
      100);
  const estimatedEmployerMatch =
    eligibleEmployeeContribution * (employerMatchRatePercent / 100);

  return {
    employeeAnnualContribution,
    eligibleEmployeeContribution,
    estimatedEmployerMatch,
    combinedAnnualContribution:
      employeeAnnualContribution + estimatedEmployerMatch,
  };
}

export function calculate401kMaxContribution({
  assumedRegularLimit,
  assumedCatchUpAmount,
  contributedSoFar,
  monthsRemaining,
}: FourOhOneKMaxContributionInput): FourOhOneKMaxContributionResult {
  const assumedTotalLimit = assumedRegularLimit + assumedCatchUpAmount;
  const remainingAvailable = Math.max(
    assumedTotalLimit - contributedSoFar,
    0,
  );

  return {
    assumedTotalLimit,
    remainingAvailable,
    monthlyAmountToReachAssumedLimit:
      monthsRemaining > 0 ? remainingAvailable / monthsRemaining : 0,
    semimonthlyAmountToReachAssumedLimit:
      monthsRemaining > 0
        ? remainingAvailable / (monthsRemaining * 2)
        : 0,
  };
}

export function calculateIraGrowth({
  currentBalance,
  annualContribution,
  expectedAnnualReturnPercent,
  years,
}: IraGrowthInput): IraGrowthResult {
  const totalContributions = annualContribution * years;
  const endingBalance = futureValue({
    principal: currentBalance,
    contributionPerPeriod: annualContribution,
    ratePerPeriod: expectedAnnualReturnPercent / 100,
    numberOfPeriods: years,
  });
  const investmentGrowth =
    endingBalance - currentBalance - totalContributions;

  return {
    endingBalance,
    totalContributions,
    investmentGrowth,
    averageAnnualGrowth: investmentGrowth / years,
  };
}

export function calculateHsaGrowth(
  input: HsaGrowthInput,
): HsaGrowthResult {
  const result = calculateIraGrowth(input);

  return {
    endingBalance: result.endingBalance,
    totalContributions: result.totalContributions,
    investmentGrowth: result.investmentGrowth,
    tripleTaxAdvantagedValue: result.endingBalance,
  };
}

export function calculate529CollegeSavings({
  currentBalance,
  monthlyContribution,
  expectedAnnualReturnPercent,
  yearsUntilCollege,
  targetCollegeCost,
}: CollegeSavings529Input): CollegeSavings529Result {
  const numberOfMonths = yearsUntilCollege * 12;
  const totalContributions = monthlyContribution * numberOfMonths;
  const projectedBalance = futureValue({
    principal: currentBalance,
    contributionPerPeriod: monthlyContribution,
    ratePerPeriod: expectedAnnualReturnPercent / 100 / 12,
    numberOfPeriods: numberOfMonths,
  });

  return {
    projectedBalance,
    totalContributions,
    investmentGrowth:
      projectedBalance - currentBalance - totalContributions,
    surplusOrShortfall: projectedBalance - targetCollegeCost,
  };
}

export function calculateCollegeCostInflation({
  currentAnnualCollegeCost,
  educationInflationRatePercent,
  yearsUntilCollege,
  numberOfCollegeYears,
}: CollegeCostInflationInput): CollegeCostInflationResult {
  const annualInflationRate = educationInflationRatePercent / 100;
  const inflationFactor = 1 + annualInflationRate;
  const firstYearCollegeCost =
    currentAnnualCollegeCost *
    Math.pow(inflationFactor, yearsUntilCollege);
  let totalCollegeCost = 0;

  for (let year = 0; year < numberOfCollegeYears; year += 1) {
    totalCollegeCost +=
      firstYearCollegeCost * Math.pow(inflationFactor, year);
  }

  const todaysTotalCost = currentAnnualCollegeCost * numberOfCollegeYears;

  return {
    firstYearCollegeCost,
    totalCollegeCost,
    totalIncrease: totalCollegeCost - todaysTotalCost,
    inflationMultiplier:
      todaysTotalCost === 0 ? 0 : totalCollegeCost / todaysTotalCost,
  };
}

export function calculateTaxableVsTaxAdvantaged({
  startingInvestment,
  annualContribution,
  expectedAnnualReturnPercent,
  taxDragPercent,
  years,
}: TaxableVsTaxAdvantagedInput): TaxableVsTaxAdvantagedResult {
  const taxableEndingBalance = futureValue({
    principal: startingInvestment,
    contributionPerPeriod: annualContribution,
    ratePerPeriod: (expectedAnnualReturnPercent - taxDragPercent) / 100,
    numberOfPeriods: years,
  });
  const taxAdvantagedEndingBalance = futureValue({
    principal: startingInvestment,
    contributionPerPeriod: annualContribution,
    ratePerPeriod: expectedAnnualReturnPercent / 100,
    numberOfPeriods: years,
  });
  const difference = taxAdvantagedEndingBalance - taxableEndingBalance;

  return {
    taxableEndingBalance,
    taxAdvantagedEndingBalance,
    difference,
    taxDragCost: difference,
  };
}

export function calculateHeloc({
  homeValue,
  currentMortgageBalance,
  maximumCltvPercent,
  requestedHelocAmount,
  annualInterestRatePercent,
}: HelocInput): HelocResult {
  const maximumTotalDebtAllowed =
    homeValue * (maximumCltvPercent / 100);
  const maximumAvailableHeloc =
    maximumTotalDebtAllowed - currentMortgageBalance;

  return {
    maximumAvailableHeloc,
    availableEquity: homeValue - currentMortgageBalance,
    interestOnlyMonthlyPayment:
      requestedHelocAmount * (annualInterestRatePercent / 100 / 12),
    approvalBufferOrShortfall:
      maximumAvailableHeloc - requestedHelocAmount,
  };
}

export function calculateRentVsBuy({
  monthlyRent,
  homePurchasePrice,
  downPayment,
  mortgageInterestRatePercent,
  loanTermYears,
  propertyTaxRatePercent,
  homeInsurancePerYear,
  hoaPerMonth,
  maintenanceRatePercent,
  homeAppreciationPercent,
  investmentReturnPercent,
  comparisonYears,
}: RentVsBuyInput): RentVsBuyResult {
  const mortgagePrincipal = homePurchasePrice - downPayment;
  const loan = calculateMortgagePayoff({
    loanAmount: mortgagePrincipal,
    annualInterestRatePercent: mortgageInterestRatePercent,
    loanTermYears,
    extraMonthlyPayment: 0,
  });
  const loanMonths = loanTermYears * 12;
  const comparisonMonths = comparisonYears * 12;
  const paidMortgageMonths = Math.min(comparisonMonths, loanMonths);
  const monthlyRate = mortgageInterestRatePercent / 100 / 12;
  const remainingMortgageBalance =
    paidMortgageMonths >= loanMonths
      ? 0
      : monthlyRate === 0
        ? Math.max(
            mortgagePrincipal -
              loan.requiredMonthlyPayment * paidMortgageMonths,
            0,
          )
        : Math.max(
            mortgagePrincipal * Math.pow(1 + monthlyRate, paidMortgageMonths) -
              loan.requiredMonthlyPayment *
                ((Math.pow(1 + monthlyRate, paidMortgageMonths) - 1) /
                  monthlyRate),
            0,
          );
  const estimatedHomeValue =
    homePurchasePrice *
    Math.pow(1 + homeAppreciationPercent / 100, comparisonYears);
  const estimatedHomeEquity =
    estimatedHomeValue - remainingMortgageBalance;
  const mortgagePayments =
    loan.requiredMonthlyPayment * paidMortgageMonths;
  const propertyTaxes =
    homePurchasePrice *
    (propertyTaxRatePercent / 100) *
    comparisonYears;
  const insurance = homeInsurancePerYear * comparisonYears;
  const hoa = hoaPerMonth * comparisonMonths;
  const maintenance =
    homePurchasePrice *
    (maintenanceRatePercent / 100) *
    comparisonYears;
  const downPaymentFutureValue =
    downPayment *
    Math.pow(1 + investmentReturnPercent / 100, comparisonYears);
  const downPaymentOpportunityCost =
    downPaymentFutureValue - downPayment;
  const totalCostOfRenting = monthlyRent * comparisonMonths;
  const totalCostOfBuying =
    downPayment +
    mortgagePayments +
    propertyTaxes +
    insurance +
    hoa +
    maintenance +
    downPaymentOpportunityCost -
    estimatedHomeEquity;
  const rentVsBuyDifference =
    totalCostOfRenting - totalCostOfBuying;
  const comparisonTolerance =
    Math.max(
      Math.abs(totalCostOfRenting),
      Math.abs(totalCostOfBuying),
      1,
    ) *
    Number.EPSILON *
    10;

  return {
    totalCostOfRenting,
    totalCostOfBuying,
    estimatedHomeEquity,
    rentVsBuyDifference,
    betterOption:
      Math.abs(rentVsBuyDifference) <= comparisonTolerance
        ? 'equal'
        : rentVsBuyDifference > 0
          ? 'buy'
          : 'rent',
  };
}

export function calculateHomeAffordability({
  annualGrossIncome,
  monthlyDebtPayments,
  downPayment,
  mortgageInterestRatePercent,
  loanTermYears,
  propertyTaxRatePercent,
  homeInsurancePerYear,
  hoaPerMonth,
  maximumDtiPercent,
}: HomeAffordabilityInput): HomeAffordabilityResult {
  const monthlyGrossIncome = annualGrossIncome / 12;
  const maxMonthlyDebtAllowed =
    monthlyGrossIncome * (maximumDtiPercent / 100);
  const maxMonthlyHousingPayment = Math.max(
    maxMonthlyDebtAllowed - monthlyDebtPayments,
    0,
  );
  const fixedMonthlyHousingCost =
    homeInsurancePerYear / 12 + hoaPerMonth;

  const housingCostForPrice = (homePrice: number) => {
    const mortgagePrincipal = Math.max(homePrice - downPayment, 0);
    const monthlyMortgagePayment = calculateMonthlyLoanPayment(
      mortgagePrincipal,
      mortgageInterestRatePercent,
      loanTermYears,
    );
    const monthlyPropertyTax =
      homePrice * (propertyTaxRatePercent / 100 / 12);

    return {
      monthlyMortgagePayment,
      totalMonthlyHousingCost:
        monthlyMortgagePayment +
        monthlyPropertyTax +
        fixedMonthlyHousingCost,
    };
  };

  if (
    maxMonthlyHousingPayment <= 0 ||
    housingCostForPrice(downPayment).totalMonthlyHousingCost >
      maxMonthlyHousingPayment
  ) {
    return {
      affordableHomePrice: 0,
      monthlyMortgagePayment: 0,
      totalMonthlyHousingCost: 0,
      debtToIncomeRatio:
        (monthlyDebtPayments / monthlyGrossIncome) * 100,
      maxMonthlyHousingPayment,
    };
  }

  let lowerPrice = downPayment;
  let upperPrice = Math.max(downPayment * 2, 100000);

  while (
    housingCostForPrice(upperPrice).totalMonthlyHousingCost <=
      maxMonthlyHousingPayment &&
    upperPrice < 1000000000
  ) {
    lowerPrice = upperPrice;
    upperPrice *= 2;
  }

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const midpoint = (lowerPrice + upperPrice) / 2;

    if (
      housingCostForPrice(midpoint).totalMonthlyHousingCost <=
      maxMonthlyHousingPayment
    ) {
      lowerPrice = midpoint;
    } else {
      upperPrice = midpoint;
    }
  }

  const affordableHomePrice = lowerPrice;
  const {
    monthlyMortgagePayment,
    totalMonthlyHousingCost,
  } = housingCostForPrice(affordableHomePrice);

  return {
    affordableHomePrice,
    monthlyMortgagePayment,
    totalMonthlyHousingCost,
    debtToIncomeRatio:
      ((monthlyDebtPayments + totalMonthlyHousingCost) /
        monthlyGrossIncome) *
      100,
    maxMonthlyHousingPayment,
  };
}
