import type { AutoLoanSeoRecord } from '../../data/programmatic-seo/auto-loan';
import { calculateAutoLoan } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type { ProgrammaticSeoLink, ProgrammaticSeoPageModel } from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const clusterPath = 'calculators/auto-loan';

export function createAutoLoanCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: AutoLoanSeoRecord,
  records: AutoLoanSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.vehiclePrice - record.vehiclePrice) / Math.max(record.vehiclePrice, 1) +
        Math.abs(candidate.downPayment - record.downPayment) / 1000 +
        Math.abs(candidate.loanTermYears - record.loanTermYears),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createAutoLoanCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.vehiclePrice)} vehicle, ${currency.format(candidate.downPayment)} down, ${candidate.annualInterestRatePercent}% APR, ${candidate.loanTermYears}-year term.`,
    }));
}

export function createAutoLoanSeoPage(
  record: AutoLoanSeoRecord,
  records: AutoLoanSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateAutoLoan(record);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `${currency.format(record.vehiclePrice)} vehicle, ${currency.format(record.downPayment)} down, ${currency.format(record.tradeInValue)} trade-in, ${record.annualInterestRatePercent}% APR, and ${record.loanTermYears}-year financing.`,
  });

  return {
    slug: record.slug,
    url: createAutoLoanCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Auto loan example',
    intro: `This worked example shows how a vehicle purchase price, down payment, trade-in value, sales tax, and financing rate combine into an estimated auto loan payment.`,
    summary: `On a ${currency.format(record.vehiclePrice)} vehicle with ${currency.format(record.downPayment)} down and ${currency.format(record.tradeInValue)} trade-in value, the estimated financed amount is ${currency.format(result.loanAmount)}. At ${record.annualInterestRatePercent}% for ${record.loanTermYears} years, the monthly payment is about ${currency.format(result.monthlyPayment)}.`,
    results: [
      { label: 'Estimated financed amount', value: currency.format(result.loanAmount), primary: true },
      { label: 'Estimated monthly payment', value: currency.format(result.monthlyPayment) },
      { label: 'Estimated total interest', value: currency.format(result.totalInterestPaid) },
      { label: 'Estimated total loan cost', value: currency.format(result.totalCostOfLoan) },
    ],
    formula: {
      heading: 'How This Auto Loan Example Works',
      expression: 'Vehicle price + sales tax - down payment - trade-in = financed amount',
      explanation:
        'The shared auto-loan math first estimates the financed amount, then applies the site’s fixed-rate payoff math to project the payment and total interest.',
      steps: [
        `Start with a vehicle price of ${currency.format(record.vehiclePrice)}.`,
        `Add sales tax at ${record.salesTaxRatePercent}%, then subtract ${currency.format(record.downPayment)} down and ${currency.format(record.tradeInValue)} trade-in value.`,
        `Finance the remaining balance at ${record.annualInterestRatePercent}% APR over ${record.loanTermYears} years.`,
        'Compute the resulting payment, interest, and total cost.',
      ],
    },
    showChart: false,
    projectionHeading: 'Auto Loan Cost Summary',
    projectionRows: [],
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Why financed amount matters more than sticker price',
        paragraphs: [
          'Many buyers focus on the monthly payment or the vehicle price alone, but the financed amount is what drives long-term interest cost.',
          'Worked examples help connect down payment, trade-in value, and tax assumptions to the real size of the loan.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this include insurance, registration, or dealer add-ons?',
        answer:
          'No. It focuses on the price, tax, down payment, trade-in value, APR, and term only.',
      },
      {
        question: 'Can a longer term make the payment look better but cost more overall?',
        answer:
          'Yes. Longer terms often reduce the monthly payment but can raise total interest and keep the borrower in debt for longer.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Auto Loan Calculator', url: '/calculators/auto-loan-calculator/' },
      { name: 'Examples', url: '/calculators/auto-loan/examples/' },
      { name: record.question, url: createAutoLoanCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Auto Loan Calculator',
        url: '/calculators/auto-loan-calculator/',
        description: 'Run your own vehicle price, down payment, APR, and term assumptions.',
      },
      {
        title: 'Loan Payment Calculator',
        url: '/calculators/loan-payment-calculator/',
        description: 'Compare vehicle financing with a more generic fixed-rate loan scenario.',
      },
      {
        title: 'Debt Payoff Calculator',
        url: '/calculators/debt-payoff-calculator/',
        description: 'Test how extra payments could change the payoff path after the loan is active.',
      },
    ],
    relatedGuides: [
      {
        title: 'Debt Payoff and Credit Card Planning Hub',
        url: '/guides/debt/',
        description: 'Connect auto financing with the site’s broader debt planning system.',
      },
      {
        title: 'Debt Payoff Guide',
        url: '/guides/debt-payoff/',
        description: 'Compare borrowing costs with the tradeoffs involved in paying debt faster.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Auto Loan Scenario',
      description: 'Use the full calculator to change the vehicle price, down payment, trade-in, APR, and term.',
      url: '/calculators/auto-loan-calculator/',
      label: 'Open the Auto Loan Calculator',
      examplesUrl: '/calculators/auto-loan/examples/',
      examplesLabel: 'Browse All Auto Loan Examples',
    },
    relatedPagesHeading: 'Related Auto Loan Examples',
  };
}

export function auditAutoLoanSeoRecords(
  records: AutoLoanSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'auto loan',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using ${record.vehiclePrice} price, ${record.downPayment} down, ${record.tradeInValue} trade-in, ${record.salesTaxRatePercent}% tax, and ${record.annualInterestRatePercent}% APR.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createAutoLoanCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createAutoLoanCanonicalPath,
  });
}
