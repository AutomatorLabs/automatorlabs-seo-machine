interface DebtPaymentMessageInput {
  balance: number;
  annualInterestRatePercent: number;
  monthlyPayment: number;
}

interface TargetMessageInput {
  amountStillNeeded: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  targetName: string;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export function getDebtPaymentExplanation({
  balance,
  annualInterestRatePercent,
  monthlyPayment,
}: DebtPaymentMessageInput): string {
  const monthlyInterest =
    balance * (annualInterestRatePercent / 100 / 12);
  const minimumReducingPayment =
    Math.floor(monthlyInterest * 100) / 100 + 0.01;

  return `Monthly interest is about ${currency.format(monthlyInterest)}, but the payment is ${currency.format(monthlyPayment)}. Increase the payment to at least ${currency.format(minimumReducingPayment)} to begin reducing principal.`;
}

export function getTargetProgressExplanation({
  amountStillNeeded,
  monthlyContribution,
  annualReturnPercent,
  targetName,
}: TargetMessageInput): string {
  const gap = currency.format(amountStillNeeded);

  if (monthlyContribution === 0 && annualReturnPercent === 0) {
    return `${gap} remains to reach ${targetName}. With a $0 monthly contribution and 0% expected return, the balance cannot grow. Enter a monthly contribution above $0 or a positive expected return.`;
  }

  if (monthlyContribution === 0) {
    return `${gap} remains to reach ${targetName}. Enter a monthly contribution above $0 to create a contribution-based timeline.`;
  }

  return `${gap} remains to reach ${targetName}, but the current inputs do not produce a valid timeline. Increase the monthly contribution or expected return.`;
}
