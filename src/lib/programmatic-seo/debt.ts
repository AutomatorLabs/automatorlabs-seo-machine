import type {
  BalanceTransferSeoRecord,
  CreditCardPayoffSeoRecord,
} from '../../data/programmatic-seo/debt';
import {
  calculateBalanceTransfer,
  calculateCreditCardInterest,
  type DebtPayoffSchedule,
} from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
  ProgrammaticSeoTable,
} from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const wholeCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percentage = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const creditCardPayoffClusterPath = 'calculators/credit-card-payoff';
const balanceTransferClusterPath = 'calculators/balance-transfer';

export function createCreditCardPayoffCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(creditCardPayoffClusterPath, slug);
}

type PayoffAprTier = 'low' | 'moderate' | 'high';

function payoffAprTier(aprPercent: number): PayoffAprTier {
  if (aprPercent <= 15) return 'low';
  if (aprPercent <= 25) return 'moderate';
  return 'high';
}

function payoffAprFraming(tier: PayoffAprTier): string {
  switch (tier) {
    case 'low':
      return 'A comparatively low APR like this one keeps more of each payment going toward principal, which speeds up payoff and limits total interest.';
    case 'moderate':
      return 'A moderate APR like this one is common among general-purpose credit cards, splitting each payment between interest and principal.';
    case 'high':
      return 'A comparatively high APR like this one means a larger share of each early payment goes toward interest rather than reducing the balance.';
  }
}

function payoffExtraFraming(record: CreditCardPayoffSeoRecord): string {
  return record.extraMonthlyPayment > 0
    ? 'This scenario includes a recurring extra payment on top of the entered monthly payment, which shortens the payoff timeline shown here.'
    : 'This scenario uses only the entered monthly payment with no additional extra payment applied.';
}

function payoffAprFaqFraming(tier: PayoffAprTier): string {
  switch (tier) {
    case 'low':
      return 'This APR is on the lower end of what this cluster of examples models.';
    case 'moderate':
      return 'This APR sits in the middle of what this cluster of examples models.';
    case 'high':
      return 'This APR is on the higher end of what this cluster of examples models.';
  }
}

export function createBalanceTransferCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(balanceTransferClusterPath, slug);
}

type TransferSavingsProfile = 'strong' | 'modest' | 'weak-or-negative';
type PromoLengthProfile = 'short' | 'standard' | 'long';

function transferSavingsProfile(
  savings: number | null,
  balance: number,
): TransferSavingsProfile {
  if (savings == null || savings <= 0) return 'weak-or-negative';
  const ratio = savings / Math.max(balance, 1);
  return ratio > 0.05 ? 'strong' : 'modest';
}

function promoLengthProfile(promotionalMonths: number): PromoLengthProfile {
  if (promotionalMonths <= 12) return 'short';
  if (promotionalMonths <= 18) return 'standard';
  return 'long';
}

function transferSavingsFraming(profile: TransferSavingsProfile): string {
  switch (profile) {
    case 'strong':
      return 'The estimated savings here are large relative to the balance, which is the clearest case for making a transfer worthwhile.';
    case 'modest':
      return 'The estimated savings here are positive but modest, so it is worth checking whether the transfer fee and paperwork are worth the effort.';
    case 'weak-or-negative':
      return 'The estimated savings here are weak or negative, which usually means the transfer fee and post-promotion APR outweigh the promotional-rate benefit under these assumptions.';
  }
}

function promoLengthFraming(profile: PromoLengthProfile): string {
  switch (profile) {
    case 'short':
      return 'A shorter promotional window leaves less time to pay down the balance before the post-promotion APR applies.';
    case 'standard':
      return 'A mid-length promotional window gives a reasonable amount of time to pay down the balance at the promotional rate.';
    case 'long':
      return 'A longer promotional window gives more time to pay down the balance before the post-promotion APR applies, which usually favors the transfer.';
  }
}

function promoLengthSectionFraming(profile: PromoLengthProfile): string {
  switch (profile) {
    case 'short':
      return 'With a shorter promotional window like this one, it often helps to pay more aggressively than the entered payment during the promo period to avoid carrying a balance into the post-promotion rate.';
    case 'standard':
      return 'A promotional window in this range is common among balance transfer offers and usually gives enough time to make real progress at the promotional rate.';
    case 'long':
      return 'A longer promotional window like this one is relatively generous, but it is still worth confirming the exact expiration date rather than assuming it renews automatically.';
  }
}

function transferSavingsFaqFraming(profile: TransferSavingsProfile): string {
  switch (profile) {
    case 'strong':
      return 'In this example, the fee is worth it: the modeled savings are strongly positive relative to the balance.';
    case 'modest':
      return 'In this example, the fee is only modestly worth it, so a shorter promotional period or lower payment could tip the math the other way.';
    case 'weak-or-negative':
      return 'In this example, the fee is not clearly worth it, since the modeled savings are weak or negative under these assumptions.';
  }
}

function monthsLabel(months: number | null): string {
  if (months == null) return 'Not paid off';

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) return `${months} ${months === 1 ? 'month' : 'months'}`;
  if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;

  return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
}

function safeMoney(value: number | null): string {
  return value == null ? 'Not paid off' : currency.format(value);
}

function createPayoffRows(
  record: CreditCardPayoffSeoRecord,
  baseline: DebtPayoffSchedule,
  accelerated: DebtPayoffSchedule,
): ProgrammaticSeoTable {
  const rows = [
    {
      label: 'Entered monthly payment',
      cells: [
        currency.format(record.monthlyPayment),
        monthsLabel(baseline.payoffTimeMonths),
        safeMoney(baseline.totalInterestPaid),
        safeMoney(baseline.totalAmountPaid),
      ],
    },
  ];

  if (record.extraMonthlyPayment > 0) {
    rows.push({
      label: 'With extra payment',
      cells: [
        currency.format(record.monthlyPayment + record.extraMonthlyPayment),
        monthsLabel(accelerated.payoffTimeMonths),
        safeMoney(accelerated.totalInterestPaid),
        safeMoney(accelerated.totalAmountPaid),
      ],
    });
  }

  return {
    heading: 'Credit Card Payoff Summary',
    columns: ['Scenario', 'Monthly payment', 'Payoff time', 'Interest', 'Total paid'],
    rows,
  };
}

function createTransferRows(
  transferFee: number,
  currentPlan: DebtPayoffSchedule,
  transferPlan: DebtPayoffSchedule,
): ProgrammaticSeoTable {
  const currentInterest = currentPlan.totalInterestPaid;
  const transferInterestAndFees =
    transferPlan.totalInterestPaid == null
      ? null
      : transferPlan.totalInterestPaid + transferFee;

  return {
    heading: 'Balance Transfer Comparison',
    columns: ['Scenario', 'Payoff time', 'Interest and fees', 'Total paid'],
    rows: [
      {
        label: 'Keep current card',
        cells: [
          monthsLabel(currentPlan.payoffTimeMonths),
          safeMoney(currentInterest),
          safeMoney(currentPlan.totalAmountPaid),
        ],
      },
      {
        label: 'Use balance transfer',
        cells: [
          monthsLabel(transferPlan.payoffTimeMonths),
          safeMoney(transferInterestAndFees),
          safeMoney(transferPlan.totalAmountPaid),
        ],
      },
    ],
  };
}

function creditCardFaq(
  record: CreditCardPayoffSeoRecord,
  payoffTime: number | null,
  totalInterest: number | null,
) {
  const balance = wholeCurrency.format(record.balance);

  return [
    {
      question: `How long will it take to pay off ${balance} in credit card debt?`,
      answer: `At ${currency.format(record.monthlyPayment + record.extraMonthlyPayment)} per month and ${percentage.format(record.aprPercent)}% APR, this example estimates a payoff time of ${monthsLabel(payoffTime)}.`,
    },
    {
      question: 'How much interest will this credit card payoff plan cost?',
      answer: `The estimated interest cost is ${safeMoney(totalInterest)} if the balance, APR, and payment assumptions stay unchanged.`,
    },
    {
      question: 'Does this include new purchases?',
      answer:
        'No. The example assumes no new purchases, cash advances, late fees, annual fees, or penalty APR changes while paying down the balance.',
    },
    {
      question: 'Can paying extra reduce credit card interest?',
      answer:
        'Yes. Extra payments usually reduce the balance faster, which lowers the amount exposed to future interest. The exact savings depend on APR, timing, and issuer rules.',
    },
    {
      question: 'What if the payment is too low to reduce the balance?',
      answer:
        'If a payment does not exceed the monthly interest charge, the balance may not decline. Increase the payment, lower the APR, or use a different payoff strategy.',
    },
    {
      question: `Is ${percentage.format(record.aprPercent)}% a high or low APR for this example?`,
      answer: payoffAprFaqFraming(payoffAprTier(record.aprPercent)),
    },
  ];
}

function balanceTransferFaq(
  record: BalanceTransferSeoRecord,
  savings: number | null,
) {
  const balance = wholeCurrency.format(record.balance);

  return [
    {
      question: `Is a ${percentage.format(record.transferFeePercent)}% balance transfer fee worth it on ${balance}?`,
      answer: `In this example, the estimated savings is ${safeMoney(savings)} after modeling the transfer fee, promotional APR period, post-promotion APR, and the same monthly payment. ${transferSavingsFaqFraming(transferSavingsProfile(savings, record.balance))}`,
    },
    {
      question: 'Does the balance transfer example assume a 0% intro APR?',
      answer: `Yes. This scenario uses a ${percentage.format(record.transferAprPercent)}% promotional APR for ${record.promotionalMonths} months, then applies a ${percentage.format(record.postPromotionAprPercent)}% post-promotion APR to any remaining balance.`,
    },
    {
      question: 'What costs are included in the balance transfer estimate?',
      answer:
        'The estimate includes the transfer fee and modeled interest under the promotional and post-promotional rates. It excludes late fees, annual fees, new purchases, cash advances, and issuer-specific rules.',
    },
    {
      question: 'Why can a balance transfer still cost money?',
      answer:
        'The transfer fee increases the starting transferred balance, and any balance left after the promotional period can accrue interest at the post-promotion APR.',
    },
    {
      question: 'What makes a balance transfer less useful?',
      answer:
        'A high transfer fee, low current APR, short promotional period, low monthly payment, or new purchases on the card can reduce or erase the estimated savings.',
    },
  ];
}

const debtCalculators: ProgrammaticSeoLink[] = [
  {
    title: 'Credit Card Payoff Calculator',
    url: '/calculators/credit-card-payoff-calculator/',
    description: 'Estimate payoff time and interest from a balance, APR, and payment.',
  },
  {
    title: 'Credit Card Minimum Payment Calculator',
    url: '/calculators/credit-card-minimum-payment-calculator/',
    description: 'See how minimum payments affect payoff time and interest.',
  },
  {
    title: 'Credit Card Extra Payment Calculator',
    url: '/calculators/credit-card-extra-payment-calculator/',
    description: 'Compare payoff time with and without an extra monthly payment.',
  },
  {
    title: 'Balance Transfer Calculator',
    url: '/calculators/balance-transfer-calculator/',
    description: 'Compare current card payoff costs with a promotional transfer.',
  },
  {
    title: 'Debt Payoff Calculator',
    url: '/calculators/debt-payoff-calculator/',
    description: 'Model a debt payoff plan with optional extra principal.',
  },
  {
    title: 'Budget Calculator',
    url: '/calculators/budget-calculator/',
    description: 'Find monthly cash flow that can support debt payoff.',
  },
];

const debtGuides: ProgrammaticSeoLink[] = [
  {
    title: 'Debt Payoff Guide',
    url: '/guides/debt-payoff/',
    description:
      'Build a practical payoff plan, compare interest costs, and protect cash reserves.',
  },
  {
    title: 'Debt Snowball vs Debt Avalanche',
    url: '/guides/debt-snowball-vs-debt-avalanche/',
    description:
      'Compare motivation-first and interest-first payoff strategies.',
  },
  {
    title: 'Budgeting and Saving for Real Life',
    url: '/guides/budgeting/',
    description:
      'Use a budget to make debt payments sustainable alongside savings goals.',
  },
];

function relatedCreditCardPages(
  record: CreditCardPayoffSeoRecord,
  records: CreditCardPayoffSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.balance - record.balance) / record.balance +
        Math.abs(candidate.aprPercent - record.aprPercent) / 20 +
        Math.abs(candidate.monthlyPayment - record.monthlyPayment) /
          Math.max(record.monthlyPayment, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createCreditCardPayoffCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.balance)} at ${percentage.format(candidate.aprPercent)}% APR with ${wholeCurrency.format(candidate.monthlyPayment)} monthly payments.`,
    }));
}

function relatedTransferPages(
  record: BalanceTransferSeoRecord,
  records: BalanceTransferSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.balance - record.balance) / record.balance +
        Math.abs(candidate.currentAprPercent - record.currentAprPercent) / 20 +
        Math.abs(candidate.transferFeePercent - record.transferFeePercent) / 10,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createBalanceTransferCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.balance)} transfer with a ${percentage.format(candidate.transferFeePercent)}% fee and ${candidate.promotionalMonths}-month promo period.`,
    }));
}

export function createCreditCardPayoffSeoPage(
  record: CreditCardPayoffSeoRecord,
  records: CreditCardPayoffSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateCreditCardInterest({
    balance: record.balance,
    aprPercent: record.aprPercent,
    monthlyPayment: record.monthlyPayment,
    extraMonthlyPayment: record.extraMonthlyPayment,
  });
  const scenario =
    record.extraMonthlyPayment > 0 ? result.accelerated : result.baseline;
  const balance = wholeCurrency.format(record.balance);
  const payment = currency.format(record.monthlyPayment + record.extraMonthlyPayment);
  const rate = `${percentage.format(record.aprPercent)}%`;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${balance} in credit card debt at ${rate} APR with ${payment} per month takes about ${monthsLabel(scenario.payoffTimeMonths)} to pay off. See estimated interest, total paid, and assumptions.`,
  });

  return {
    slug: record.slug,
    url: createCreditCardPayoffCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Credit card payoff example',
    intro: `This worked example estimates how long it may take to pay off ${balance} in credit card debt at ${rate} APR with ${payment} per month. ${payoffAprFraming(payoffAprTier(record.aprPercent))} ${payoffExtraFraming(record)}`,
    summary: `The modeled payoff time is ${monthsLabel(scenario.payoffTimeMonths)}, with estimated interest of ${safeMoney(scenario.totalInterestPaid)} and total payments of ${safeMoney(scenario.totalAmountPaid)}.`,
    results: [
      {
        label: 'Estimated payoff time',
        value: monthsLabel(scenario.payoffTimeMonths),
        primary: true,
      },
      {
        label: 'Estimated interest',
        value: safeMoney(scenario.totalInterestPaid),
      },
      {
        label: 'Estimated total paid',
        value: safeMoney(scenario.totalAmountPaid),
      },
      {
        label: 'First-month interest',
        value: currency.format(result.monthlyInterest),
      },
    ],
    formula: {
      heading: 'Credit Card Payoff Method',
      expression: 'new balance = balance + monthly interest − payment',
      explanation:
        'The example applies monthly interest to the remaining balance, subtracts the monthly payment, and repeats until the balance reaches zero.',
      steps: [
        `Start with a credit card balance of ${balance}.`,
        `Convert the ${rate} APR to a monthly rate.`,
        `Apply the entered monthly payment of ${payment}.`,
        'Repeat the monthly interest and payment cycle until the modeled balance is paid off.',
      ],
    },
    showChart: false,
    projectionHeading: 'Credit Card Payoff Summary',
    projectionRows: [],
    table: createPayoffRows(record, result.baseline, result.accelerated),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Assumptions behind this payoff example',
        paragraphs: [
          `This example assumes a starting balance of ${balance}, a constant ${rate} APR, and a total monthly payment of ${payment}.`,
          'It excludes new purchases, fees, penalty APR changes, rewards, grace-period rules, and payment timing differences.',
        ],
      },
      {
        heading: 'How to interpret the result',
        paragraphs: [
          'Use the payoff time and interest estimate as a planning benchmark, not a guarantee. Actual card statements may calculate interest daily and can change if purchases, fees, or rates change.',
          'If the estimated payoff feels too slow, compare a higher monthly payment, an extra payment, a balance transfer, or a broader debt payoff strategy.',
        ],
      },
    ],
    faq: creditCardFaq(record, scenario.payoffTimeMonths, scenario.totalInterestPaid),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Credit Card Payoff Calculator',
        url: '/calculators/credit-card-payoff-calculator/',
      },
      {
        name: 'Credit Card Payoff Examples',
        url: '/calculators/credit-card-payoff/examples/',
      },
      { name: title, url: createCreditCardPayoffCanonicalPath(record.slug) },
    ],
    relatedPages: relatedCreditCardPages(record, records),
    relatedPagesHeading: 'Related Credit Card Payoff Examples',
    relatedCalculators: debtCalculators,
    relatedGuides: debtGuides,
    calculatorCta: {
      heading: 'Calculate Your Own Credit Card Payoff',
      description:
        'Use the full calculator to change the balance, APR, monthly payment, and extra payment.',
      url: '/calculators/credit-card-payoff-calculator/',
      label: 'Open the Credit Card Payoff Calculator',
      examplesUrl: '/calculators/credit-card-payoff/examples/',
      examplesLabel: 'Browse All Credit Card Payoff Examples',
    },
  };
}

export function createBalanceTransferSeoPage(
  record: BalanceTransferSeoRecord,
  records: BalanceTransferSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateBalanceTransfer({
    balance: record.balance,
    currentAprPercent: record.currentAprPercent,
    currentMonthlyPayment: record.monthlyPayment,
    transferAprPercent: record.transferAprPercent,
    promotionalMonths: record.promotionalMonths,
    transferFeePercent: record.transferFeePercent,
    postPromotionAprPercent: record.postPromotionAprPercent,
  });
  const balance = wholeCurrency.format(record.balance);
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${balance} at ${percentage.format(record.currentAprPercent)}% APR with a ${percentage.format(record.transferFeePercent)}% balance transfer fee has estimated savings of ${safeMoney(result.estimatedSavings)}. See payoff time, fees, and assumptions.`,
  });
  const savingsProfile = transferSavingsProfile(
    result.estimatedSavings,
    record.balance,
  );
  const lengthProfile = promoLengthProfile(record.promotionalMonths);

  return {
    slug: record.slug,
    url: createBalanceTransferCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Balance transfer example',
    intro: `This worked example compares keeping ${balance} on a card at ${percentage.format(record.currentAprPercent)}% APR with moving it to a ${percentage.format(record.transferAprPercent)}% promotional balance transfer offer. ${transferSavingsFraming(savingsProfile)} ${promoLengthFraming(lengthProfile)}`,
    summary: `After modeling the ${percentage.format(record.transferFeePercent)}% transfer fee, ${record.promotionalMonths}-month promotional period, and ${currency.format(record.monthlyPayment)} monthly payment, estimated savings are ${safeMoney(result.estimatedSavings)}.`,
    results: [
      {
        label: 'Estimated savings',
        value: safeMoney(result.estimatedSavings),
        primary: true,
      },
      {
        label: 'Transfer fee',
        value: currency.format(result.transferFee),
      },
      {
        label: 'Transferred balance',
        value: currency.format(result.transferredBalance),
      },
      {
        label: 'Transfer payoff time',
        value: monthsLabel(result.transferPlan.payoffTimeMonths),
      },
    ],
    formula: {
      heading: 'Balance Transfer Comparison Method',
      expression: 'savings = current plan total paid − transfer plan total paid',
      explanation:
        'The example compares the modeled total paid under the current card with the modeled total paid after adding a transfer fee and applying promotional and post-promotional APRs.',
      steps: [
        `Model the current ${balance} balance at ${percentage.format(record.currentAprPercent)}% APR.`,
        `Add a ${percentage.format(record.transferFeePercent)}% fee to create a transferred balance of ${currency.format(result.transferredBalance)}.`,
        `Apply the ${percentage.format(record.transferAprPercent)}% promotional APR for ${record.promotionalMonths} months.`,
        `Apply the ${percentage.format(record.postPromotionAprPercent)}% post-promotion APR to any remaining balance.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Balance Transfer Comparison',
    projectionRows: [],
    table: createTransferRows(
      result.transferFee,
      result.currentPlan,
      result.transferPlan,
    ),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Assumptions behind this transfer example',
        paragraphs: [
          `This example assumes a ${balance} starting balance, a current APR of ${percentage.format(record.currentAprPercent)}%, a ${currency.format(record.monthlyPayment)} monthly payment, and no new card purchases.`,
          `The balance transfer scenario uses a ${percentage.format(record.transferFeePercent)}% fee, ${record.promotionalMonths} months at ${percentage.format(record.transferAprPercent)}%, and a ${percentage.format(record.postPromotionAprPercent)}% APR after the promotion.`,
        ],
      },
      {
        heading: 'How to interpret the savings',
        paragraphs: [
          'A positive savings estimate means the transfer costs less under these assumptions. A negative number would mean the fee and remaining interest outweigh the promotional-rate benefit.',
          'Real card offers may include approval limits, transfer deadlines, minimum payments, annual fees, late fees, and purchase APR rules that are not modeled here.',
          promoLengthSectionFraming(lengthProfile),
        ],
      },
    ],
    faq: balanceTransferFaq(record, result.estimatedSavings),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Balance Transfer Calculator',
        url: '/calculators/balance-transfer-calculator/',
      },
      {
        name: 'Balance Transfer Examples',
        url: '/calculators/balance-transfer/examples/',
      },
      { name: title, url: createBalanceTransferCanonicalPath(record.slug) },
    ],
    relatedPages: relatedTransferPages(record, records),
    relatedPagesHeading: 'Related Balance Transfer Examples',
    relatedCalculators: debtCalculators,
    relatedGuides: debtGuides,
    calculatorCta: {
      heading: 'Calculate Your Own Balance Transfer',
      description:
        'Use the full calculator to change the balance, APR, payment, transfer fee, and promotional period.',
      url: '/calculators/balance-transfer-calculator/',
      label: 'Open the Balance Transfer Calculator',
      examplesUrl: '/calculators/balance-transfer/examples/',
      examplesLabel: 'Browse All Balance Transfer Examples',
    },
  };
}

export type CreditCardPayoffSeoAuditResult = ProgrammaticSeoAuditResult;
export type BalanceTransferSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditCreditCardPayoffSeoRecords(
  records: CreditCardPayoffSeoRecord[],
  expectedCount: number,
): CreditCardPayoffSeoAuditResult {
  const pages = records.map((record) =>
    createCreditCardPayoffSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Credit Card Payoff',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createCreditCardPayoffCanonicalPath,
  });
}

export function auditBalanceTransferSeoRecords(
  records: BalanceTransferSeoRecord[],
  expectedCount: number,
): BalanceTransferSeoAuditResult {
  const pages = records.map((record) =>
    createBalanceTransferSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Balance Transfer',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createBalanceTransferCanonicalPath,
  });
}
