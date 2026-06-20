import {
  calculateCoastFireNumber,
  calculateDrip,
  calculateFireNumber,
  calculateMonthlyLoanPayment,
  calculateRealRateOfReturn,
  calculateRequiredPeriodicSavings,
  calculateRothIraProjection,
  calculateRothVsTraditionalIra,
  calculateRothVsTaxable,
  calculateYearsToTarget,
  futureValue,
} from './math';
import { parseCalculatorNumber } from './input';

export interface CalculatorTableData {
  heading: string;
  columns: string[];
  rows: string[][];
  warning?: string;
}

export const calculatorTableHeadings: Record<string, string> = {
  'compound-interest': 'Year-by-Year Projection',
  'daily-compound-interest': 'Year-by-Year Projection',
  'monthly-compound-interest': 'Year-by-Year Projection',
  'quarterly-compound-interest': 'Year-by-Year Projection',
  'annual-compound-interest': 'Year-by-Year Projection',
  'investment-growth': 'Year-by-Year Projection',
  'savings-growth': 'Year-by-Year Projection',
  fire: 'Year-by-Year Projection',
  'coast-fire': 'Year-by-Year Projection',
  'lean-fire': 'Year-by-Year Projection',
  'fat-fire': 'Year-by-Year Projection',
  'barista-fire': 'Year-by-Year Projection',
  '401k-growth': 'Year-by-Year Projection',
  '401k': 'Year-by-Year Projection',
  'traditional-vs-roth-401k': 'Traditional and Roth 401(k) Comparison',
  'ira-growth': 'Year-by-Year Projection',
  'roth-ira': 'Year-by-Year Projection',
  'roth-ira-growth': 'Year-by-Year Projection',
  'roth-ira-vs-taxable': 'Account Growth Comparison',
  'hsa-growth': 'Year-by-Year Projection',
  '529-college-savings': 'Year-by-Year Projection',
  drip: 'Year-by-Year Projection',
  'savings-goal': 'Savings Timeline',
  'monthly-savings': 'Savings Progress',
  'weekly-savings': 'Savings Progress',
  'daily-savings': 'Savings Progress',
  'vacation-savings': 'Savings Progress',
  'car-savings': 'Savings Progress',
  'emergency-fund': 'Savings Timeline',
  'mortgage-payoff': 'Payoff Schedule',
  'debt-payoff': 'Payoff Schedule',
  'debt-snowball': 'Payoff Schedule',
  'debt-avalanche': 'Payoff Schedule',
  'credit-card-payoff': 'Payoff Schedule',
  'credit-card-minimum-payment': 'Minimum Payment Schedule',
  'credit-card-extra-payment': 'Payoff Schedule',
  'balance-transfer': 'Balance Transfer Schedule',
  'student-loan-payoff': 'Payoff Schedule',
  'portfolio-withdrawal-sustainability': 'Withdrawal Timeline',
};

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

function value(data: FormData, name: string): number {
  const parsed = parseCalculatorNumber(data.get(name));
  return Number.isFinite(parsed) ? parsed : 0;
}

function cappedCount(requested: number, cap: number): number {
  return Math.max(0, Math.min(Math.ceil(requested), cap));
}

function capWarning(unit: 'years' | 'months', requested: number, cap: number) {
  return requested > cap
    ? `This schedule is longer than ${cap} ${unit}. The table shows the first ${cap} ${unit}.`
    : undefined;
}

function growthTable({
  initialBalance,
  contributionPerPeriod,
  ratePerPeriod,
  periodsPerYear,
  years,
}: {
  initialBalance: number;
  contributionPerPeriod: number;
  ratePerPeriod: number;
  periodsPerYear: number;
  years: number;
}): CalculatorTableData {
  const displayedYears = cappedCount(years, 60);
  const rows = Array.from({ length: displayedYears }, (_, index) => {
    const year = index + 1;
    const periods = year * periodsPerYear;
    const endingBalance = futureValue({
      principal: initialBalance,
      contributionPerPeriod,
      ratePerPeriod,
      numberOfPeriods: periods,
    });
    const contributions =
      initialBalance + contributionPerPeriod * periods;

    return [
      String(year),
      currency.format(contributions),
      currency.format(endingBalance - contributions),
      currency.format(endingBalance),
    ];
  });

  return {
    heading: 'Year-by-Year Projection',
    columns: ['Year', 'Contributions', 'Interest / Growth', 'Ending Balance'],
    rows,
    warning: capWarning('years', years, 60),
  };
}

function fireTable({
  currentBalance,
  monthlyContribution,
  annualReturnPercent,
  target,
  requestedYears,
}: {
  currentBalance: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  target: number;
  requestedYears?: number | null;
}): CalculatorTableData {
  const estimatedYears = calculateYearsToTarget({
    target,
    currentBalance,
    monthlyContribution,
    annualReturnPercent,
  });
  const years = requestedYears ?? estimatedYears ?? 60;
  const displayedYears =
    currentBalance >= target
      ? 0
      : Math.min(Math.max(Math.ceil(years), 1), 60);
  const monthlyRate = annualReturnPercent / 100 / 12;
  const rows = Array.from({ length: displayedYears + 1 }, (_, year) => {
    const portfolioValue = futureValue({
      principal: currentBalance,
      contributionPerPeriod: monthlyContribution,
      ratePerPeriod: monthlyRate,
      numberOfPeriods: year * 12,
    });

    return [
      String(year),
      currency.format(portfolioValue),
      currency.format(target),
      currency.format(Math.max(target - portfolioValue, 0)),
    ];
  });

  return {
    heading: 'Year-by-Year Projection',
    columns: ['Year', 'Portfolio Value', 'FIRE Target', 'Gap Remaining'],
    rows,
    warning:
      currentBalance < target && (years > 60 || estimatedYears == null)
        ? 'The target extends beyond the 60-year table limit under the current assumptions.'
        : undefined,
  };
}

function savingsTable({
  currentSavings,
  monthlyContribution,
  annualReturnPercent,
  goal,
}: {
  currentSavings: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  goal: number;
}): CalculatorTableData {
  const estimatedYears = calculateYearsToTarget({
    target: goal,
    currentBalance: currentSavings,
    monthlyContribution,
    annualReturnPercent,
  });
  const requestedMonths =
    currentSavings >= goal ? 0 : estimatedYears == null ? 601 : estimatedYears * 12;
  const displayedMonths = Math.min(Math.ceil(requestedMonths), 600);
  const monthlyRate = annualReturnPercent / 100 / 12;
  const rows = Array.from(
    { length: Math.max(displayedMonths, 1) },
    (_, index) => {
      const month = currentSavings >= goal ? 0 : index + 1;
      const amountSaved = futureValue({
        principal: currentSavings,
        contributionPerPeriod: monthlyContribution,
        ratePerPeriod: monthlyRate,
        numberOfPeriods: month,
      });

      return [
        String(month),
        currency.format(amountSaved),
        currency.format(goal),
        currency.format(Math.max(goal - amountSaved, 0)),
      ];
    },
  );

  return {
    heading: 'Savings Timeline',
    columns: ['Month', 'Amount Saved', 'Goal', 'Gap Remaining'],
    rows,
    warning:
      estimatedYears == null
        ? 'The goal is unreachable with the current contribution and return assumptions.'
        : capWarning('months', requestedMonths, 600),
  };
}

function targetSavingsTable({
  goalAmount,
  currentSavings,
  annualReturnPercent,
  years,
  periodsPerYear,
}: {
  goalAmount: number;
  currentSavings: number;
  annualReturnPercent: number;
  years: number;
  periodsPerYear: number;
}): CalculatorTableData {
  const result = calculateRequiredPeriodicSavings({
    goalAmount,
    currentSavings,
    annualReturnPercent,
    years,
    periodsPerYear,
  });
  const displayedYears = cappedCount(years, 60);
  const ratePerPeriod = annualReturnPercent / 100 / periodsPerYear;
  const rows = Array.from({ length: displayedYears }, (_, index) => {
    const year = index + 1;
    const periods = year * periodsPerYear;
    const endingBalance = futureValue({
      principal: currentSavings,
      contributionPerPeriod: result.requiredContribution,
      ratePerPeriod,
      numberOfPeriods: periods,
    });
    const contributions =
      currentSavings + result.requiredContribution * periods;

    return [
      String(year),
      currency.format(contributions),
      currency.format(endingBalance - contributions),
      currency.format(endingBalance),
    ];
  });

  return {
    heading: 'Savings Progress',
    columns: ['Year', 'Contributions', 'Estimated Growth', 'Balance'],
    rows,
    warning: capWarning('years', years, 60),
  };
}

function payoffTable({
  balance: startingBalance,
  annualInterestRatePercent,
  monthlyPayment,
}: {
  balance: number;
  annualInterestRatePercent: number;
  monthlyPayment: number;
}): CalculatorTableData {
  const monthlyRate = annualInterestRatePercent / 100 / 12;
  const firstInterest = startingBalance * monthlyRate;

  if (monthlyPayment <= firstInterest && startingBalance > 0) {
    return {
      heading: 'Payoff Schedule',
      columns: ['Month', 'Payment', 'Principal', 'Interest', 'Remaining Balance'],
      rows: [],
      warning: `The payment must exceed the first month's interest of ${currency.format(firstInterest)} to reduce principal.`,
    };
  }

  const rows: string[][] = [];
  let balance = startingBalance;
  let month = 0;

  while (balance > 0.005 && month < 600) {
    month += 1;
    const interest = balance * monthlyRate;
    const payment = Math.min(monthlyPayment, balance + interest);
    const principal = payment - interest;
    balance = Math.max(balance - principal, 0);
    rows.push([
      String(month),
      currency.format(payment),
      currency.format(principal),
      currency.format(interest),
      currency.format(balance),
    ]);
  }

  return {
    heading: 'Payoff Schedule',
    columns: ['Month', 'Payment', 'Principal', 'Interest', 'Remaining Balance'],
    rows,
    warning:
      balance > 0.005
        ? 'The payoff takes longer than 600 months. The table shows the first 600 months.'
        : undefined,
  };
}

function minimumPaymentTable({
  balance: startingBalance,
  annualInterestRatePercent,
  minimumPaymentPercent,
  minimumPaymentFloor,
}: {
  balance: number;
  annualInterestRatePercent: number;
  minimumPaymentPercent: number;
  minimumPaymentFloor: number;
}): CalculatorTableData {
  const monthlyRate = annualInterestRatePercent / 100 / 12;
  const firstInterest = startingBalance * monthlyRate;
  const firstPayment = Math.min(
    Math.max(startingBalance * (minimumPaymentPercent / 100), minimumPaymentFloor),
    startingBalance + firstInterest,
  );

  if (firstPayment <= firstInterest && startingBalance > 0) {
    return {
      heading: 'Minimum Payment Schedule',
      columns: ['Month', 'Payment', 'Principal', 'Interest', 'Remaining Balance'],
      rows: [],
      warning: `The first estimated minimum payment must exceed the first month's interest of ${currency.format(firstInterest)} to reduce principal.`,
    };
  }

  const rows: string[][] = [];
  let balance = startingBalance;
  let month = 0;

  while (balance > 0.005 && month < 600) {
    month += 1;
    const interest = balance * monthlyRate;
    const scheduledPayment = Math.max(
      balance * (minimumPaymentPercent / 100),
      minimumPaymentFloor,
    );
    const payment = Math.min(scheduledPayment, balance + interest);
    const principal = payment - interest;
    balance = Math.max(balance - principal, 0);
    rows.push([
      String(month),
      currency.format(payment),
      currency.format(principal),
      currency.format(interest),
      currency.format(balance),
    ]);

    if (payment <= interest && balance > 0.005) {
      return {
        heading: 'Minimum Payment Schedule',
        columns: ['Month', 'Payment', 'Principal', 'Interest', 'Remaining Balance'],
        rows,
        warning:
          'The estimated minimum payment stops reducing principal under the current assumptions.',
      };
    }
  }

  return {
    heading: 'Minimum Payment Schedule',
    columns: ['Month', 'Payment', 'Principal', 'Interest', 'Remaining Balance'],
    rows,
    warning:
      balance > 0.005
        ? 'The payoff takes longer than 600 months. The table shows the first 600 months.'
        : undefined,
  };
}

function balanceTransferTable({
  balance: startingBalance,
  currentMonthlyPayment,
  transferAprPercent,
  promotionalMonths,
  transferFeePercent,
  postPromotionAprPercent,
}: {
  balance: number;
  currentMonthlyPayment: number;
  transferAprPercent: number;
  promotionalMonths: number;
  transferFeePercent: number;
  postPromotionAprPercent: number;
}): CalculatorTableData {
  const transferFee = startingBalance * (transferFeePercent / 100);
  let balance = startingBalance + transferFee;
  const rows: string[][] = [];
  let month = 0;

  while (balance > 0.005 && month < 600) {
    const apr =
      month < promotionalMonths ? transferAprPercent : postPromotionAprPercent;
    const interest = balance * (apr / 100 / 12);
    const payment = Math.min(currentMonthlyPayment, balance + interest);
    const principal = payment - interest;

    month += 1;
    balance = Math.max(balance - principal, 0);
    rows.push([
      String(month),
      `${apr.toFixed(2)}%`,
      currency.format(payment),
      currency.format(interest),
      currency.format(balance),
    ]);

    if (payment <= interest && balance > 0.005) {
      return {
        heading: 'Balance Transfer Schedule',
        columns: ['Month', 'APR', 'Payment', 'Interest', 'Remaining Balance'],
        rows,
        warning:
          'The monthly payment does not reduce the transferred balance under the current assumptions.',
      };
    }
  }

  return {
    heading: 'Balance Transfer Schedule',
    columns: ['Month', 'APR', 'Payment', 'Interest', 'Remaining Balance'],
    rows,
    warning:
      balance > 0.005
        ? 'The payoff takes longer than 600 months. The table shows the first 600 months.'
        : undefined,
  };
}

type OrderedDebt = {
  name: string;
  balance: number;
  minimumPayment: number;
  annualInterestRatePercent: number;
};

function multiDebtTable(
  debts: OrderedDebt[],
  extraMonthlyPayment: number,
  method: 'snowball' | 'avalanche',
): CalculatorTableData {
  const activeDebts = debts
    .filter((debt) => debt.balance > 0)
    .sort((a, b) =>
      method === 'snowball'
        ? a.balance - b.balance
        : b.annualInterestRatePercent - a.annualInterestRatePercent ||
          a.balance - b.balance,
    );
  const monthlyBudget =
    activeDebts.reduce((total, debt) => total + debt.minimumPayment, 0) +
    extraMonthlyPayment;
  const balances = activeDebts.map((debt) => debt.balance);
  const rows: string[][] = [];
  let month = 0;

  while (balances.some((balance) => balance > 0.005) && month < 600) {
    month += 1;
    const startingTotal = balances.reduce((total, balance) => total + balance, 0);
    let interest = 0;

    if (method === 'avalanche') {
      balances.forEach((balance, index) => {
        if (balance <= 0.005) return;
        const monthlyInterest =
          balance * (activeDebts[index].annualInterestRatePercent / 100 / 12);
        balances[index] += monthlyInterest;
        interest += monthlyInterest;
      });
    }

    let availablePayment = monthlyBudget;
    activeDebts.forEach((debt, index) => {
      if (balances[index] <= 0.005) return;
      const payment = Math.min(
        debt.minimumPayment,
        balances[index],
        availablePayment,
      );
      balances[index] -= payment;
      availablePayment -= payment;
    });

    for (let index = 0; index < balances.length && availablePayment > 0.005; index += 1) {
      if (balances[index] <= 0.005) continue;
      const payment = Math.min(balances[index], availablePayment);
      balances[index] -= payment;
      availablePayment -= payment;
    }

    const remainingBalance = balances.reduce(
      (total, balance) => total + Math.max(balance, 0),
      0,
    );
    const payment = startingTotal + interest - remainingBalance;
    rows.push([
      String(month),
      currency.format(payment),
      currency.format(Math.max(payment - interest, 0)),
      currency.format(interest),
      currency.format(remainingBalance),
    ]);

    if (remainingBalance >= startingTotal && method === 'avalanche') {
      return {
        heading: 'Payoff Schedule',
        columns: ['Month', 'Payment', 'Principal', 'Interest', 'Remaining Balance'],
        rows,
        warning:
          'The combined payment does not reduce the total balance under the current interest rates.',
      };
    }
  }

  return {
    heading: 'Payoff Schedule',
    columns: ['Month', 'Payment', 'Principal', 'Interest', 'Remaining Balance'],
    rows,
    warning:
      balances.some((balance) => balance > 0.005)
        ? 'The payoff takes longer than 600 months. The table shows the first 600 months.'
        : undefined,
  };
}

function withdrawalTable(data: FormData): CalculatorTableData {
  const portfolioValue = value(data, 'portfolioValue');
  const annualWithdrawal = value(data, 'annualWithdrawalAmount');
  const years = value(data, 'years');
  const { realAnnualReturn } = calculateRealRateOfReturn({
    nominalAnnualReturnPercent: value(data, 'expectedAnnualReturn'),
    inflationRatePercent: value(data, 'inflationRate'),
  });
  const displayedYears = cappedCount(years, 60);
  const rows: string[][] = [];
  let balance = portfolioValue;

  for (let year = 1; year <= displayedYears; year += 1) {
    const startingBalance = balance;
    const growth = startingBalance * (realAnnualReturn / 100);
    const withdrawal = Math.min(annualWithdrawal, startingBalance + growth);
    balance = Math.max(startingBalance + growth - withdrawal, 0);
    rows.push([
      String(year),
      currency.format(startingBalance),
      currency.format(withdrawal),
      currency.format(growth),
      currency.format(balance),
    ]);
    if (balance <= 0) break;
  }

  return {
    heading: 'Withdrawal Timeline',
    columns: ['Year', 'Starting Balance', 'Withdrawal', 'Growth', 'Ending Balance'],
    rows,
    warning: capWarning('years', years, 60),
  };
}

export function buildCalculatorTable(
  calculatorId: string,
  form: HTMLFormElement,
): CalculatorTableData | null {
  const data = new FormData(form);

  switch (calculatorId) {
    case 'compound-interest': {
      const principal = value(data, 'principal');
      const monthlyContribution = value(data, 'monthlyContribution');
      const annualRatePercent = value(data, 'interestRate');
      const years = value(data, 'years');
      const periodsPerYear = value(data, 'frequency');
      return growthTable({
        initialBalance: principal,
        contributionPerPeriod: (monthlyContribution * 12) / periodsPerYear,
        ratePerPeriod: annualRatePercent / 100 / periodsPerYear,
        periodsPerYear,
        years,
      });
    }
    case 'daily-compound-interest':
    case 'monthly-compound-interest':
    case 'quarterly-compound-interest':
    case 'annual-compound-interest':
    case 'investment-growth':
    case 'savings-growth': {
      const periodsPerYear =
        calculatorId === 'daily-compound-interest'
          ? 365
          : calculatorId === 'quarterly-compound-interest'
            ? 4
            : calculatorId === 'annual-compound-interest'
              ? 1
              : 12;
      return growthTable({
        initialBalance: value(data, 'principal'),
        contributionPerPeriod:
          (value(data, 'monthlyContribution') * 12) / periodsPerYear,
        ratePerPeriod:
          value(data, 'interestRate') / 100 / periodsPerYear,
        periodsPerYear,
        years: value(data, 'years'),
      });
    }
    case 'fire': {
      const target = calculateFireNumber(
        value(data, 'annualExpenses'),
        value(data, 'withdrawalRate'),
      );
      return fireTable({
        currentBalance: value(data, 'currentAssets'),
        monthlyContribution: value(data, 'monthlyContribution'),
        annualReturnPercent: value(data, 'expectedReturn'),
        target,
      });
    }
    case 'coast-fire': {
      const years = value(data, 'retirementAge') - value(data, 'currentAge');
      const annualReturnPercent = value(data, 'expectedReturn');
      const target = calculateFireNumber(
        value(data, 'annualExpenses'),
        value(data, 'withdrawalRate'),
      );
      calculateCoastFireNumber(target, annualReturnPercent, years);
      return fireTable({
        currentBalance: value(data, 'currentAssets'),
        monthlyContribution: 0,
        annualReturnPercent,
        target,
        requestedYears: years,
      });
    }
    case 'lean-fire':
    case 'fat-fire': {
      const spendingName =
        calculatorId === 'lean-fire' ? 'annualExpenses' : 'targetAnnualSpending';
      const target = calculateFireNumber(
        value(data, spendingName),
        value(data, 'withdrawalRate'),
      );
      return fireTable({
        currentBalance: value(data, 'currentInvestedAssets'),
        monthlyContribution: value(data, 'monthlyContribution'),
        annualReturnPercent: value(data, 'expectedAnnualReturn'),
        target,
      });
    }
    case 'barista-fire': {
      const remainingExpenses = Math.max(
        value(data, 'annualExpenses') - value(data, 'annualPartTimeIncome'),
        0,
      );
      return fireTable({
        currentBalance: value(data, 'currentInvestedAssets'),
        monthlyContribution: value(data, 'monthlyContribution'),
        annualReturnPercent: value(data, 'expectedAnnualReturn'),
        target: calculateFireNumber(
          remainingExpenses,
          value(data, 'withdrawalRate'),
        ),
      });
    }
    case '401k':
    case '401k-growth':
      return growthTable({
        initialBalance: value(data, 'currentBalance'),
        contributionPerPeriod:
          value(data, 'employeeMonthlyContribution') +
          value(data, 'employerMonthlyMatch'),
        ratePerPeriod: value(data, 'expectedAnnualReturn') / 100 / 12,
        periodsPerYear: 12,
        years: value(data, 'years'),
      });
    case 'traditional-vs-roth-401k': {
      const years = value(data, 'years');
      const rows = Array.from(
        { length: cappedCount(years, 60) },
        (_, index) => {
          const year = index + 1;
          const result = calculateRothVsTraditionalIra({
            annualContribution: value(data, 'annualContribution'),
            currentTaxRatePercent: value(data, 'currentTaxRate'),
            retirementTaxRatePercent: value(data, 'retirementTaxRate'),
            expectedAnnualReturnPercent: value(
              data,
              'expectedAnnualReturn',
            ),
            years: year,
          });
          return [
            String(year),
            currency.format(result.rothEndingValue),
            currency.format(result.traditionalAfterTaxEndingValue),
            currency.format(result.difference),
          ];
        },
      );
      return {
        heading: 'Traditional and Roth 401(k) Comparison',
        columns: [
          'Year',
          'Roth 401(k)',
          'Traditional 401(k) After Tax',
          'Difference',
        ],
        rows,
        warning: capWarning('years', years, 60),
      };
    }
    case 'ira-growth':
    case 'hsa-growth':
      return growthTable({
        initialBalance: value(data, 'currentBalance'),
        contributionPerPeriod: value(data, 'annualContribution'),
        ratePerPeriod: value(data, 'expectedAnnualReturn') / 100,
        periodsPerYear: 1,
        years: value(data, 'years'),
      });
    case 'roth-ira':
    case 'roth-ira-growth': {
      const periodsPerYear = calculatorId === 'roth-ira' ? 12 : 1;
      const contribution =
        calculatorId === 'roth-ira'
          ? value(data, 'monthlyContribution')
          : value(data, 'annualContribution');
      const years = value(data, 'years');
      const currentBalance = value(data, 'currentBalance');
      const rows = Array.from(
        { length: cappedCount(years, 60) },
        (_, index) => {
          const year = index + 1;
          const result = calculateRothIraProjection({
            currentBalance,
            contributionPerPeriod: contribution,
            expectedAnnualReturnPercent: value(
              data,
              'expectedAnnualReturn',
            ),
            years: year,
            periodsPerYear,
          });
          return [
            String(year),
            currency.format(
              currentBalance + result.futureContributions,
            ),
            currency.format(result.investmentGrowth),
            currency.format(result.endingBalance),
          ];
        },
      );
      return {
        heading: 'Year-by-Year Projection',
        columns: ['Year', 'Balance Funded', 'Growth', 'Projected Balance'],
        rows,
        warning: capWarning('years', years, 60),
      };
    }
    case 'roth-ira-vs-taxable': {
      const years = value(data, 'years');
      const rows = Array.from(
        { length: cappedCount(years, 60) },
        (_, index) => {
          const year = index + 1;
          const result = calculateRothVsTaxable({
            startingBalance: value(data, 'startingBalance'),
            annualContribution: value(data, 'annualContribution'),
            expectedAnnualReturnPercent: value(
              data,
              'expectedAnnualReturn',
            ),
            taxableAccountTaxDragPercent: value(data, 'taxableTaxDrag'),
            years: year,
          });
          return [
            String(year),
            currency.format(result.rothEndingBalance),
            currency.format(result.taxableEndingBalance),
            currency.format(result.estimatedRothAdvantage),
          ];
        },
      );
      return {
        heading: 'Account Growth Comparison',
        columns: ['Year', 'Roth IRA', 'Taxable Account', 'Difference'],
        rows,
        warning: capWarning('years', years, 60),
      };
    }
    case '529-college-savings':
      return growthTable({
        initialBalance: value(data, 'currentBalance'),
        contributionPerPeriod: value(data, 'monthlyContribution'),
        ratePerPeriod: value(data, 'expectedAnnualReturn') / 100 / 12,
        periodsPerYear: 12,
        years: value(data, 'yearsUntilCollege'),
      });
    case 'drip': {
      const years = value(data, 'years');
      const displayedYears = cappedCount(years, 60);
      const initialInvestment = value(data, 'initialInvestment');
      const monthlyContribution = value(data, 'monthlyContribution');
      const rows = Array.from({ length: displayedYears }, (_, index) => {
        const year = index + 1;
        const result = calculateDrip({
          initialInvestment,
          annualDividendYieldPercent: value(data, 'annualDividendYield'),
          annualSharePriceAppreciationPercent: value(
            data,
            'annualSharePriceAppreciation',
          ),
          annualDividendGrowthRatePercent: value(
            data,
            'annualDividendGrowthRate',
          ),
          monthlyContribution,
          years: year,
        });
        return [
          String(year),
          currency.format(initialInvestment + monthlyContribution * year * 12),
          currency.format(result.totalDividendsEarned),
          currency.format(result.finalPortfolioValue),
        ];
      });
      return {
        heading: 'Year-by-Year Projection',
        columns: ['Year', 'Contributions', 'Dividends', 'Estimated Balance'],
        rows,
        warning: capWarning('years', years, 60),
      };
    }
    case 'savings-goal':
      return savingsTable({
        currentSavings: value(data, 'currentSavings'),
        monthlyContribution: value(data, 'monthlyContribution'),
        annualReturnPercent: value(data, 'expectedReturn'),
        goal: value(data, 'goalAmount'),
      });
    case 'monthly-savings':
    case 'vacation-savings':
    case 'car-savings':
      return targetSavingsTable({
        goalAmount: value(data, 'goalAmount'),
        currentSavings: value(data, 'currentSavings'),
        annualReturnPercent: value(data, 'expectedReturn'),
        years: value(data, 'years'),
        periodsPerYear: 12,
      });
    case 'weekly-savings':
      return targetSavingsTable({
        goalAmount: value(data, 'goalAmount'),
        currentSavings: value(data, 'currentSavings'),
        annualReturnPercent: value(data, 'expectedReturn'),
        years: value(data, 'years'),
        periodsPerYear: 52,
      });
    case 'daily-savings':
      return targetSavingsTable({
        goalAmount: value(data, 'goalAmount'),
        currentSavings: value(data, 'currentSavings'),
        annualReturnPercent: value(data, 'expectedReturn'),
        years: value(data, 'years'),
        periodsPerYear: 365,
      });
    case 'emergency-fund':
      return savingsTable({
        currentSavings: value(data, 'currentEmergencySavings'),
        monthlyContribution: value(data, 'monthlySavingsContribution'),
        annualReturnPercent: 0,
        goal:
          value(data, 'monthlyEssentialExpenses') * value(data, 'targetMonths'),
      });
    case 'mortgage-payoff': {
      const balance = value(data, 'loanAmount');
      const annualInterestRatePercent = value(data, 'annualInterestRate');
      const requiredPayment = calculateMonthlyLoanPayment(
        balance,
        annualInterestRatePercent,
        value(data, 'loanTermYears'),
      );
      return payoffTable({
        balance,
        annualInterestRatePercent,
        monthlyPayment: requiredPayment + value(data, 'extraMonthlyPayment'),
      });
    }
    case 'debt-payoff':
      return payoffTable({
        balance: value(data, 'debtBalance'),
        annualInterestRatePercent: value(data, 'annualInterestRate'),
        monthlyPayment:
          value(data, 'monthlyPayment') + value(data, 'extraMonthlyPayment'),
      });
    case 'credit-card-payoff':
      return payoffTable({
        balance: value(data, 'creditCardBalance'),
        annualInterestRatePercent: value(data, 'apr'),
        monthlyPayment: value(data, 'monthlyPayment'),
      });
    case 'credit-card-minimum-payment':
      return minimumPaymentTable({
        balance: value(data, 'creditCardBalance'),
        annualInterestRatePercent: value(data, 'apr'),
        minimumPaymentPercent: value(data, 'minimumPaymentPercent'),
        minimumPaymentFloor: value(data, 'minimumPaymentFloor'),
      });
    case 'credit-card-extra-payment':
      return payoffTable({
        balance: value(data, 'creditCardBalance'),
        annualInterestRatePercent: value(data, 'apr'),
        monthlyPayment:
          value(data, 'monthlyPayment') + value(data, 'extraMonthlyPayment'),
      });
    case 'balance-transfer':
      return balanceTransferTable({
        balance: value(data, 'creditCardBalance'),
        currentMonthlyPayment: value(data, 'monthlyPayment'),
        transferAprPercent: value(data, 'transferApr'),
        promotionalMonths: value(data, 'promotionalMonths'),
        transferFeePercent: value(data, 'transferFeePercent'),
        postPromotionAprPercent: value(data, 'postPromotionApr'),
      });
    case 'student-loan-payoff':
      return payoffTable({
        balance: value(data, 'studentLoanBalance'),
        annualInterestRatePercent: value(data, 'annualInterestRate'),
        monthlyPayment:
          value(data, 'currentMonthlyPayment') +
          value(data, 'extraMonthlyPayment'),
      });
    case 'debt-snowball':
    case 'debt-avalanche': {
      const avalanche = calculatorId === 'debt-avalanche';
      const debts = [1, 2, 3].map((number) => ({
        name: `Debt ${number}`,
        balance: value(data, `debt${number}Balance`),
        minimumPayment: value(data, `debt${number}MinimumPayment`),
        annualInterestRatePercent: avalanche
          ? value(data, `debt${number}InterestRate`)
          : 0,
      }));
      return multiDebtTable(
        debts,
        value(data, 'extraMonthlyPayment'),
        avalanche ? 'avalanche' : 'snowball',
      );
    }
    case 'portfolio-withdrawal-sustainability':
      return withdrawalTable(data);
    default:
      return null;
  }
}
