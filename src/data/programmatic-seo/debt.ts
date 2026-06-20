export interface CreditCardPayoffSeoRecord {
  slug: string;
  question: string;
  balance: number;
  aprPercent: number;
  monthlyPayment: number;
  extraMonthlyPayment: number;
  featured?: boolean;
}

export interface BalanceTransferSeoRecord {
  slug: string;
  question: string;
  balance: number;
  currentAprPercent: number;
  monthlyPayment: number;
  transferAprPercent: number;
  promotionalMonths: number;
  transferFeePercent: number;
  postPromotionAprPercent: number;
  featured?: boolean;
}

export const EXPECTED_CREDIT_CARD_PAYOFF_SEO_PAGE_COUNT = 24;
export const EXPECTED_BALANCE_TRANSFER_SEO_PAGE_COUNT = 24;

function rateSlug(rate: number): string {
  return String(rate).replace('.', '-');
}

function money(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

function payoffRecord(
  balance: number,
  aprPercent: number,
  monthlyPayment: number,
  extraMonthlyPayment = 0,
  featured = false,
): CreditCardPayoffSeoRecord {
  const extraSuffix =
    extraMonthlyPayment > 0 ? `-with-${extraMonthlyPayment}-extra` : '';

  return {
    slug: `pay-off-${balance}-credit-card-at-${rateSlug(aprPercent)}-apr-with-${monthlyPayment}-per-month${extraSuffix}`,
    question:
      extraMonthlyPayment > 0
        ? `Pay Off ${money(balance)} in Credit Card Debt at ${aprPercent}% APR With ${money(monthlyPayment)} Plus ${money(extraMonthlyPayment)} Extra`
        : `Pay Off ${money(balance)} in Credit Card Debt at ${aprPercent}% APR With ${money(monthlyPayment)} per Month`,
    balance,
    aprPercent,
    monthlyPayment,
    extraMonthlyPayment,
    featured,
  };
}

function transferRecord(
  balance: number,
  currentAprPercent: number,
  monthlyPayment: number,
  promotionalMonths: number,
  transferFeePercent: number,
  postPromotionAprPercent: number,
  featured = false,
): BalanceTransferSeoRecord {
  return {
    slug: `balance-transfer-${balance}-from-${rateSlug(currentAprPercent)}-apr-with-${rateSlug(transferFeePercent)}-fee-${promotionalMonths}-months`,
    question: `Balance Transfer Savings on ${money(balance)} at ${currentAprPercent}% APR With a ${transferFeePercent}% Fee`,
    balance,
    currentAprPercent,
    monthlyPayment,
    transferAprPercent: 0,
    promotionalMonths,
    transferFeePercent,
    postPromotionAprPercent,
    featured,
  };
}

export const creditCardPayoffSeoRecords: CreditCardPayoffSeoRecord[] = [
  payoffRecord(3000, 19.99, 125),
  payoffRecord(3000, 24.99, 150, 50),
  payoffRecord(5000, 19.99, 175),
  payoffRecord(5000, 24.99, 200, 0, true),
  payoffRecord(5000, 24.99, 200, 75),
  payoffRecord(7500, 21.99, 250),
  payoffRecord(7500, 26.99, 300, 100),
  payoffRecord(8000, 19.99, 250),
  payoffRecord(8000, 24.99, 275, 75),
  payoffRecord(10000, 19.99, 300),
  payoffRecord(10000, 24.99, 300, 0, true),
  payoffRecord(10000, 24.99, 300, 100),
  payoffRecord(12000, 22.99, 350),
  payoffRecord(12000, 27.99, 400, 150),
  payoffRecord(15000, 19.99, 450),
  payoffRecord(15000, 22.99, 450, 0, true),
  payoffRecord(15000, 22.99, 450, 150),
  payoffRecord(18000, 24.99, 550),
  payoffRecord(20000, 19.99, 600),
  payoffRecord(20000, 24.99, 650, 200),
  payoffRecord(25000, 21.99, 750),
  payoffRecord(25000, 24.99, 800, 250),
  payoffRecord(30000, 19.99, 900),
  payoffRecord(30000, 24.99, 1000, 300),
];

export const balanceTransferSeoRecords: BalanceTransferSeoRecord[] = [
  transferRecord(3000, 22.99, 150, 12, 3, 19.99),
  transferRecord(5000, 19.99, 175, 12, 3, 18.99),
  transferRecord(5000, 24.99, 200, 18, 3, 19.99, true),
  transferRecord(5000, 27.99, 225, 21, 5, 21.99),
  transferRecord(7500, 21.99, 250, 15, 3, 19.99),
  transferRecord(7500, 26.99, 300, 18, 4, 22.99),
  transferRecord(8000, 24.99, 275, 18, 3, 19.99, true),
  transferRecord(8000, 29.99, 325, 21, 5, 24.99),
  transferRecord(10000, 19.99, 300, 12, 3, 18.99),
  transferRecord(10000, 24.99, 300, 18, 3, 19.99, true),
  transferRecord(10000, 26.99, 350, 21, 4, 21.99),
  transferRecord(12000, 22.99, 375, 18, 3, 19.99),
  transferRecord(12000, 27.99, 425, 21, 5, 22.99),
  transferRecord(15000, 19.99, 450, 15, 3, 18.99),
  transferRecord(15000, 24.99, 450, 18, 3, 19.99),
  transferRecord(15000, 29.99, 550, 21, 5, 24.99),
  transferRecord(18000, 24.99, 600, 18, 4, 21.99),
  transferRecord(20000, 19.99, 650, 15, 3, 18.99),
  transferRecord(20000, 24.99, 700, 18, 3, 19.99),
  transferRecord(20000, 27.99, 800, 21, 5, 22.99),
  transferRecord(25000, 21.99, 850, 18, 3, 19.99),
  transferRecord(25000, 26.99, 950, 21, 4, 21.99),
  transferRecord(30000, 19.99, 1000, 18, 3, 18.99),
  transferRecord(30000, 24.99, 1100, 21, 5, 21.99),
];

export const featuredCreditCardPayoffSeoRecords =
  creditCardPayoffSeoRecords.filter((record) => record.featured);

export const featuredBalanceTransferSeoRecords =
  balanceTransferSeoRecords.filter((record) => record.featured);
