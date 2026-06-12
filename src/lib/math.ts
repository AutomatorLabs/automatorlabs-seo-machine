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
