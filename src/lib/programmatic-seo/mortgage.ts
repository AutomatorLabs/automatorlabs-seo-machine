import type { MortgageSeoRecord } from '../../data/programmatic-seo/mortgage';
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

const mortgageClusterPath = 'calculators/mortgage';

export function createMortgageCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(mortgageClusterPath, slug);
}

function createPaymentTable(
  record: MortgageSeoRecord,
  monthlyPayment: number,
  totalInterest: number,
  totalRepayment: number,
): ProgrammaticSeoTable {
  return {
    heading: 'Mortgage Payment Summary',
    columns: ['Payment measure', 'Principal', 'Interest', 'Total paid'],
    rows: [
      {
        label: 'Average monthly',
        cells: [
          currency.format(
            record.loanAmount / (record.loanTermYears * 12),
          ),
          currency.format(
            totalInterest / (record.loanTermYears * 12),
          ),
          currency.format(monthlyPayment),
        ],
      },
      {
        label: 'Average annual',
        cells: [
          currency.format(record.loanAmount / record.loanTermYears),
          currency.format(totalInterest / record.loanTermYears),
          currency.format(monthlyPayment * 12),
        ],
      },
      {
        label: 'Full loan term',
        cells: [
          currency.format(record.loanAmount),
          currency.format(totalInterest),
          currency.format(totalRepayment),
        ],
      },
    ],
  };
}

function createFaq(
  record: MortgageSeoRecord,
  monthlyPayment: number,
  totalInterest: number,
) {
  const amount = wholeCurrency.format(record.loanAmount);
  const rate = `${percentage.format(record.annualInterestRatePercent)}%`;

  return [
    {
      question: `What is the monthly payment on a ${amount} mortgage at ${rate}?`,
      answer: `For a ${record.loanTermYears}-year fixed-rate loan, the estimated monthly principal-and-interest payment is ${currency.format(monthlyPayment)}.`,
    },
    {
      question: `How much interest is paid over ${record.loanTermYears} years?`,
      answer: `If the loan is kept for the full term and every scheduled payment is made, estimated total interest is ${currency.format(totalInterest)}.`,
    },
    {
      question: 'Does this mortgage payment include taxes and insurance?',
      answer:
        'No. It includes principal and interest only. Property taxes, homeowners insurance, mortgage insurance, HOA dues, closing costs, and lender fees are excluded.',
    },
    {
      question: 'Why is more interest paid early in the mortgage?',
      answer:
        'Interest is calculated from the remaining balance. The balance is largest near the beginning, so more of each early payment goes to interest and less goes to principal.',
    },
    {
      question: 'Can extra payments reduce the total mortgage interest?',
      answer:
        'Usually, when the lender applies extra amounts directly to principal. Extra principal lowers the balance used for future interest and may shorten the payoff period. Check lender rules and prepayment terms.',
    },
  ];
}

function createRelatedPages(
  record: MortgageSeoRecord,
  records: MortgageSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.loanAmount - record.loanAmount) /
          Math.max(record.loanAmount, 1) +
        Math.abs(
          candidate.annualInterestRatePercent -
            record.annualInterestRatePercent,
        ) /
          10 +
        Math.abs(candidate.loanTermYears - record.loanTermYears) / 30,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createMortgageCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.loanAmount)} at ${percentage.format(candidate.annualInterestRatePercent)}% for ${candidate.loanTermYears} years.`,
    }));
}

export function createMortgageSeoPage(
  record: MortgageSeoRecord,
  records: MortgageSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateMortgagePayoff({
    loanAmount: record.loanAmount,
    annualInterestRatePercent: record.annualInterestRatePercent,
    loanTermYears: record.loanTermYears,
    extraMonthlyPayment: 0,
  });
  const amount = wholeCurrency.format(record.loanAmount);
  const rate = `${percentage.format(record.annualInterestRatePercent)}%`;
  const title = record.question;
  const metaDescription = `${amount} at ${rate} for ${record.loanTermYears} years has an estimated ${currency.format(result.requiredMonthlyPayment)} monthly principal-and-interest payment. See total interest, repayment, and assumptions.`;
  const metadata = createProgrammaticMetadata({
    title,
    description: metaDescription,
  });

  return {
    slug: record.slug,
    url: createMortgageCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Mortgage payment example',
    intro: `This worked example estimates the scheduled principal-and-interest payment for a ${amount} fixed-rate mortgage at ${rate} over ${record.loanTermYears} years.`,
    summary: `The estimated monthly principal-and-interest payment is ${currency.format(result.requiredMonthlyPayment)}. Over ${record.loanTermYears * 12} scheduled payments, the borrower would repay approximately ${currency.format(result.totalAmountPaid)}, including ${currency.format(result.totalInterestPaid)} of interest, if the rate and payment schedule remain unchanged.`,
    results: [
      {
        label: 'Monthly principal and interest',
        value: currency.format(result.requiredMonthlyPayment),
        primary: true,
      },
      {
        label: 'Total interest',
        value: currency.format(result.totalInterestPaid),
      },
      {
        label: 'Total repayment',
        value: currency.format(result.totalAmountPaid),
      },
      {
        label: 'Scheduled payments',
        value: String(record.loanTermYears * 12),
      },
    ],
    formula: {
      heading: 'Fixed-Rate Mortgage Payment Formula',
      expression: 'M = P × [r(1 + r)^n] ÷ [(1 + r)^n − 1]',
      explanation: `The standard amortization formula uses principal P of ${amount}, monthly rate r derived from ${rate}, and n = ${record.loanTermYears * 12} monthly payments.`,
      steps: [
        `Start with a mortgage principal of ${amount}.`,
        `Convert the ${rate} annual rate to a monthly rate by dividing by 12.`,
        `Use ${record.loanTermYears * 12} total monthly payments for the ${record.loanTermYears}-year term.`,
        `Apply the fixed-rate payment formula to estimate ${currency.format(result.requiredMonthlyPayment)} per month.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Mortgage Payment Summary',
    projectionRows: [],
    table: createPaymentTable(
      record,
      result.requiredMonthlyPayment,
      result.totalInterestPaid,
      result.totalAmountPaid,
    ),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Assumptions behind this estimate',
        paragraphs: [
          `This example assumes a fully amortizing fixed-rate mortgage with a starting balance of ${amount}, a constant ${rate} annual interest rate, a ${record.loanTermYears}-year term, and payments made monthly as scheduled.`,
          'The result includes principal and interest only. It excludes property taxes, homeowners insurance, mortgage insurance, HOA dues, closing costs, discount points, servicing changes, late fees, and optional extra payments.',
        ],
      },
      {
        heading: 'How mortgage amortization works',
        paragraphs: [
          `Each scheduled payment is the same in this fixed-rate example, but its composition changes. Early payments contain more interest because interest is charged against a larger outstanding balance. As principal falls, the interest portion generally declines and more of the payment reduces principal.`,
          `Keeping the mortgage for the full term produces the estimated ${currency.format(result.totalInterestPaid)} of total interest shown here. Selling, refinancing, recasting, or making extra principal payments would change the actual schedule and total cost.`,
        ],
      },
      {
        heading: 'How to use this mortgage example',
        paragraphs: [
          `Use the result as a principal-and-interest benchmark, then add realistic taxes, insurance, mortgage insurance, HOA dues, and maintenance when estimating the complete cost of owning the home.`,
          'Compare nearby rates and loan terms before focusing only on the monthly payment. A shorter term generally raises the required payment but can reduce total interest, while a longer term may improve monthly cash flow at a higher lifetime financing cost.',
        ],
      },
    ],
    faq: createFaq(
      record,
      result.requiredMonthlyPayment,
      result.totalInterestPaid,
    ),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Mortgage Calculator',
        url: '/calculators/mortgage-payoff-calculator/',
      },
      { name: 'Mortgage Examples', url: '/calculators/mortgage/examples/' },
      { name: title, url: createMortgageCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Mortgage Payment Examples',
    relatedCalculators: [
      {
        title: 'Mortgage Payoff Calculator',
        url: '/calculators/mortgage-payoff-calculator/',
        description:
          'Change the loan balance, rate, term, and extra monthly payment.',
      },
      {
        title: 'Home Affordability Calculator',
        url: '/calculators/home-affordability-calculator/',
        description:
          'Estimate a home price from income, debts, down payment, and housing costs.',
      },
      {
        title: 'Refinance Calculator',
        url: '/calculators/refinance-calculator/',
        description:
          'Compare a current mortgage with a possible replacement loan.',
      },
    ],
    relatedGuides: [
      {
        title: 'A Practical Guide to Buying a Home',
        url: '/guides/home-buying/',
        description:
          'Connect mortgage costs with affordability, reserves, and ownership expenses.',
      },
      {
        title: 'How to Use the Mortgage Payoff Calculator',
        url: '/guides/how-to-use-mortgage-payoff-calculator/',
        description:
          'Review mortgage inputs, outputs, assumptions, and payoff considerations.',
      },
      {
        title: 'Rent vs Buy',
        url: '/guides/rent-vs-buy/',
        description:
          'Compare mortgage costs with rent, equity, maintenance, and flexibility.',
      },
    ],
    calculatorCta: {
      heading: 'Calculate Your Own Mortgage Payment',
      description:
        'Use the full calculator to change the loan amount, interest rate, term, and optional extra principal payment.',
      url: '/calculators/mortgage-payoff-calculator/',
      label: 'Open the Mortgage Calculator',
      examplesUrl: '/calculators/mortgage/examples/',
      examplesLabel: 'Browse All Mortgage Examples',
    },
  };
}

export type MortgageSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditMortgageSeoRecords(
  records: MortgageSeoRecord[],
  expectedCount: number,
): MortgageSeoAuditResult {
  const pages = records.map((record) =>
    createMortgageSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Mortgage',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createMortgageCanonicalPath,
  });
}
