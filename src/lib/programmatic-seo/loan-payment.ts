import type { LoanPaymentSeoRecord } from '../../data/programmatic-seo/loan-payment';
import { calculateMortgagePayoff } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
  ProgrammaticSeoProjectionRow,
} from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const clusterPath = 'calculators/loan-payment';

export function createLoanPaymentCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

type LoanExtraPaymentProfile = 'none' | 'modest' | 'moderate' | 'aggressive';
type LoanTermProfile = 'short' | 'mid' | 'long';

function loanExtraPaymentProfile(record: LoanPaymentSeoRecord): LoanExtraPaymentProfile {
  if (record.extraMonthlyPayment === 0) return 'none';
  if (record.extraMonthlyPayment <= 50) return 'modest';
  if (record.extraMonthlyPayment <= 100) return 'moderate';
  return 'aggressive';
}

function loanTermProfile(record: LoanPaymentSeoRecord): LoanTermProfile {
  if (record.loanTermYears <= 3) return 'short';
  if (record.loanTermYears <= 6) return 'mid';
  return 'long';
}

function loanExtraPaymentFraming(profile: LoanExtraPaymentProfile): string {
  switch (profile) {
    case 'none':
      return 'This example uses the standard schedule with no extra principal, so it shows the baseline payoff timeline before any acceleration strategy.';
    case 'modest':
      return 'A modest extra payment like this one produces a gradual but real reduction in payoff time and total interest.';
    case 'moderate':
      return 'A moderate extra payment like this one is usually large enough to noticeably shorten the payoff timeline.';
    case 'aggressive':
      return 'An aggressive extra payment like this one can substantially cut both the payoff time and the total interest paid.';
  }
}

function loanTermFraming(profile: LoanTermProfile): string {
  switch (profile) {
    case 'short':
      return 'A shorter original term already limits how much interest accrues, so extra payments here move the payoff date by less than they would on a longer loan.';
    case 'mid':
      return 'A mid-length original term leaves a moderate amount of interest for extra payments to work against.';
    case 'long':
      return 'A longer original term carries more total interest, so extra payments made against it tend to produce larger savings in dollar terms.';
  }
}

function loanExtraPaymentFaqFraming(profile: LoanExtraPaymentProfile): string {
  switch (profile) {
    case 'none':
      return 'No extra payment is applied in this example, so it reflects the standard scheduled repayment only.';
    case 'modest':
      return "It's on the smaller end of the extra payments modeled across this cluster of examples, but it still compounds into real savings over the loan term.";
    case 'moderate':
      return 'It falls in the middle of the extra payments modeled across this cluster of examples.';
    case 'aggressive':
      return "It's on the larger end of the extra payments modeled across this cluster of examples, so it is worth weighing against other financial priorities.";
  }
}

function loanTermFaqFraming(profile: LoanTermProfile): string {
  switch (profile) {
    case 'short':
      return 'This term is on the shorter end of what this cluster of examples models, which limits how much total interest is available for extra payments to save.';
    case 'mid':
      return 'This term sits in the middle of what this cluster of examples models.';
    case 'long':
      return 'This term is on the longer end of what this cluster of examples models, which gives extra payments more total interest to work against.';
  }
}

function createProjectionRows(record: LoanPaymentSeoRecord): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: Math.min(record.loanTermYears, 10) }, (_, index) => {
    const years = index + 1;
    const result = calculateMortgagePayoff({
      loanAmount: record.loanAmount,
      annualInterestRatePercent: record.annualInterestRatePercent,
      loanTermYears: years,
      extraMonthlyPayment: record.extraMonthlyPayment,
    });

    return {
      period: years,
      contributions: result.requiredMonthlyPayment * 12 * years,
      growth: result.totalInterestPaid,
      endingBalance: result.totalAmountPaid,
    };
  });
}

function createRelatedPages(
  record: LoanPaymentSeoRecord,
  records: LoanPaymentSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.loanAmount - record.loanAmount) / Math.max(record.loanAmount, 1) +
        Math.abs(candidate.loanTermYears - record.loanTermYears) +
        Math.abs(candidate.extraMonthlyPayment - record.extraMonthlyPayment) / 100,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createLoanPaymentCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.loanAmount)} loan, ${candidate.annualInterestRatePercent}% APR, ${candidate.loanTermYears}-year term, ${currency.format(candidate.extraMonthlyPayment)} extra monthly.`,
    }));
}

export function createLoanPaymentSeoPage(
  record: LoanPaymentSeoRecord,
  records: LoanPaymentSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateMortgagePayoff({
    loanAmount: record.loanAmount,
    annualInterestRatePercent: record.annualInterestRatePercent,
    loanTermYears: record.loanTermYears,
    extraMonthlyPayment: record.extraMonthlyPayment,
  });
  const projectionRows = createProjectionRows(record);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${currency.format(record.loanAmount)} borrowed at ${record.annualInterestRatePercent}% over ${record.loanTermYears} years with ${currency.format(record.extraMonthlyPayment)} extra monthly.`,
  });
  const extraProfile = loanExtraPaymentProfile(record);
  const termProfile = loanTermProfile(record);

  return {
    slug: record.slug,
    url: createLoanPaymentCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Loan payment example',
    intro: `This worked example shows how a ${currency.format(record.loanAmount)} fixed-rate loan changes when the repayment plan includes ${currency.format(record.extraMonthlyPayment)} in extra principal each month. ${loanExtraPaymentFraming(extraProfile)} ${loanTermFraming(termProfile)}`,
    summary: `At ${record.annualInterestRatePercent}% APR over ${record.loanTermYears} years, the required payment starts near ${currency.format(result.requiredMonthlyPayment)} per month. Adding ${currency.format(record.extraMonthlyPayment)} extra each month produces an estimated payoff time of ${result.payoffTimeMonths} months and about ${currency.format(result.interestSaved)} in interest savings versus the baseline schedule.`,
    results: [
      { label: 'Required monthly payment', value: currency.format(result.requiredMonthlyPayment), primary: true },
      { label: 'Estimated payoff time', value: `${result.payoffTimeMonths} months` },
      { label: 'Estimated total interest', value: currency.format(result.totalInterestPaid) },
      { label: 'Interest saved with extra payment', value: currency.format(result.interestSaved) },
    ],
    formula: {
      heading: 'How This Loan Example Works',
      expression: 'Fixed monthly payment + optional extra principal = faster payoff and lower interest',
      explanation:
        'The example uses the shared fixed-rate amortization math that powers the calculator, then recomputes the timeline after adding an extra monthly payment.',
      steps: [
        `Start with ${currency.format(record.loanAmount)} financed over ${record.loanTermYears} years.`,
        `Apply the fixed-rate payment formula at ${record.annualInterestRatePercent}% APR.`,
        `Add ${currency.format(record.extraMonthlyPayment)} in extra principal each month.`,
        'Compare the accelerated payoff schedule against the baseline schedule.',
      ],
    },
    showChart: false,
    projectionHeading: 'Shorter-Term Loan Comparison',
    projectionRows,
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why extra principal matters',
        paragraphs: [
          'Fixed-rate loans accrue interest on the remaining balance, so even modest extra payments can shorten the term and lower the total interest paid.',
          'That makes worked examples useful when comparing whether a smaller monthly payment or a faster payoff better matches your budget.',
          loanTermFaqFraming(termProfile),
        ],
      },
    ],
    faq: [
      {
        question: 'Can this example stand in for a personal or installment loan?',
        answer:
          'Yes. It models a standard fixed-rate loan with regular monthly payments, which makes it useful for many personal-loan or installment-loan scenarios.',
      },
      {
        question: 'Does this include late fees or origination fees?',
        answer:
          'No. It focuses on the financed amount, APR, term, and extra monthly payment only.',
      },
      {
        question: `Is ${currency.format(record.extraMonthlyPayment)} extra a small or large payment in this example?`,
        answer: loanExtraPaymentFaqFraming(extraProfile),
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Loan Payment Calculator', url: '/calculators/loan-payment-calculator/' },
      { name: 'Examples', url: '/calculators/loan-payment/examples/' },
      { name: record.question, url: createLoanPaymentCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Loan Payment Calculator',
        url: '/calculators/loan-payment-calculator/',
        description: 'Model your own loan amount, APR, term, and extra payment strategy.',
      },
      {
        title: 'Debt Payoff Calculator',
        url: '/calculators/debt-payoff-calculator/',
        description: 'Compare how recurring payments and extra principal affect payoff time.',
      },
      {
        title: 'Auto Loan Calculator',
        url: '/calculators/auto-loan-calculator/',
        description: 'Turn a vehicle price, down payment, and rate into a real financed balance.',
      },
    ],
    relatedGuides: [
      {
        title: 'Debt Payoff Guide',
        url: '/guides/debt-payoff/',
        description: 'Connect repayment math with budgeting, cash reserves, and payoff priorities.',
      },
      {
        title: 'Debt Payoff and Credit Card Planning Hub',
        url: '/guides/debt/',
        description: 'See adjacent debt and loan calculators, guides, and worked examples.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Loan Scenario',
      description: 'Use the full calculator to change the amount, APR, term, and extra payment.',
      url: '/calculators/loan-payment-calculator/',
      label: 'Open the Loan Payment Calculator',
      examplesUrl: '/calculators/loan-payment/examples/',
      examplesLabel: 'Browse All Loan Payment Examples',
    },
    relatedPagesHeading: 'Related Loan Payment Examples',
  };
}

export function auditLoanPaymentSeoRecords(
  records: LoanPaymentSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'loan payment',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.loanAmount} borrowed, ${record.annualInterestRatePercent}% APR, ${record.loanTermYears} years, and ${record.extraMonthlyPayment} extra monthly.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createLoanPaymentCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createLoanPaymentCanonicalPath,
  });
}
