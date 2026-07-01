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

type MortgageRateProfile = 'low' | 'moderate' | 'high';
type MortgageTermProfile = 'short' | 'mid' | 'long';

function mortgageRateProfile(record: MortgageSeoRecord): MortgageRateProfile {
  if (record.annualInterestRatePercent < 5.5) return 'low';
  if (record.annualInterestRatePercent <= 6.5) return 'moderate';
  return 'high';
}

function mortgageTermProfile(record: MortgageSeoRecord): MortgageTermProfile {
  if (record.loanTermYears <= 15) return 'short';
  if (record.loanTermYears === 20) return 'mid';
  return 'long';
}

function mortgageRateFraming(profile: MortgageRateProfile): string {
  switch (profile) {
    case 'low':
      return 'A comparatively low rate keeps more of each payment going toward principal, which reduces the total interest paid over the life of the loan.';
    case 'moderate':
      return 'A moderate rate splits each payment fairly evenly between principal and interest for much of the early amortization schedule.';
    case 'high':
      return 'A comparatively high rate pushes more of each early payment toward interest, which raises the total cost of the loan.';
  }
}

function mortgageTermFraming(profile: MortgageTermProfile): string {
  switch (profile) {
    case 'short':
      return 'A shorter loan term raises the required monthly payment but sharply reduces total interest compared with a longer amortization schedule.';
    case 'mid':
      return 'A mid-length loan term produces a payment and total interest cost between the extremes of a 15-year and a 30-year mortgage.';
    case 'long':
      return 'A longer loan term keeps the required monthly payment lower, but interest accrues over more years and raises the total repayment amount.';
  }
}

function mortgageTermFaqFraming(profile: MortgageTermProfile): string {
  switch (profile) {
    case 'short':
      return 'In this example specifically, the shorter term keeps total interest well below what the same balance and rate would cost over a longer term.';
    case 'mid':
      return 'In this example specifically, the mid-length term lands between the interest cost of a 15-year and a 30-year schedule.';
    case 'long':
      return 'In this example specifically, the longer term keeps the required payment lower but adds meaningfully to total interest.';
  }
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
  const termProfile = mortgageTermProfile(record);
  const rateProfile = mortgageRateProfile(record);

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
    {
      question: `How do the ${rate} rate and ${record.loanTermYears}-year term affect this example?`,
      answer: `${mortgageRateFraming(rateProfile)} ${mortgageTermFaqFraming(termProfile)}`,
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
  const rateProfile = mortgageRateProfile(record);
  const termProfile = mortgageTermProfile(record);

  return {
    slug: record.slug,
    url: createMortgageCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Mortgage payment example',
    intro: `This worked example estimates the scheduled principal-and-interest payment for a ${amount} fixed-rate mortgage at ${rate} over ${record.loanTermYears} years. ${mortgageRateFraming(rateProfile)} ${mortgageTermFraming(termProfile)}`,
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
        heading: 'How the rate and term shape this example',
        paragraphs: [
          `This example uses a ${rate} rate over a ${record.loanTermYears}-year term. ${mortgageTermFraming(termProfile)}`,
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
        name: 'Mortgage Payment Calculator',
        url: '/calculators/mortgage-payment-calculator/',
      },
      { name: 'Mortgage Examples', url: '/calculators/mortgage/examples/' },
      { name: title, url: createMortgageCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Mortgage Payment Examples',
    relatedCalculators: [
      {
        title: 'Mortgage Payment Calculator',
        url: '/calculators/mortgage-payment-calculator/',
        description:
          'Add property taxes, homeowners insurance, HOA dues, and mortgage insurance to estimate the full monthly payment.',
      },
      {
        title: 'Mortgage Payoff Calculator',
        url: '/calculators/mortgage-payoff-calculator/',
        description:
          'Add an extra monthly payment to see the payoff timeline and interest savings.',
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
        title: 'How to Use the Mortgage Payment Calculator',
        url: '/guides/how-to-use-mortgage-payment-calculator/',
        description:
          'Review mortgage payment inputs, outputs, and assumptions.',
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
        'Use the full calculator to change the loan amount, interest rate, term, property taxes, insurance, HOA dues, and mortgage insurance.',
      url: '/calculators/mortgage-payment-calculator/',
      label: 'Open the Mortgage Payment Calculator',
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
