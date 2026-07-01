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

type DownPaymentProfile = 'minimal' | 'moderate' | 'solid' | 'substantial';
type LoanTermProfile = 'short' | 'standard' | 'extended';

function downPaymentProfile(record: AutoLoanSeoRecord): DownPaymentProfile {
  const ratio = record.downPayment / record.vehiclePrice;
  if (ratio < 0.1) return 'minimal';
  if (ratio < 0.2) return 'moderate';
  if (ratio < 0.35) return 'solid';
  return 'substantial';
}

function loanTermProfile(record: AutoLoanSeoRecord): LoanTermProfile {
  if (record.loanTermYears <= 4) return 'short';
  if (record.loanTermYears === 5) return 'standard';
  return 'extended';
}

function downPaymentFraming(profile: DownPaymentProfile): string {
  switch (profile) {
    case 'minimal':
      return 'Putting down a relatively small amount up front means most of the vehicle price gets financed, which raises both the loan balance and the interest paid over the loan term.';
    case 'moderate':
      return 'A moderate down payment covers a meaningful slice of the vehicle price while still leaving a sizable balance to finance.';
    case 'solid':
      return 'A solid down payment reduces the financed amount well below the vehicle price, which lowers both the monthly payment and the total interest paid.';
    case 'substantial':
      return 'A substantial down payment leaves only a small remaining balance to finance, which keeps the payment and total interest well below what a low-down-payment purchase would cost.';
  }
}

function loanTermFraming(profile: LoanTermProfile): string {
  switch (profile) {
    case 'short':
      return 'Paired with a shorter loan term, total interest stays lower even though the monthly payment is higher than a longer term would produce.';
    case 'standard':
      return 'Paired with a mid-length loan term, the payment and total interest land in a middle range compared with shorter or longer financing.';
    case 'extended':
      return 'Paired with a longer loan term, the monthly payment is lower, but interest accrues over more years and raises the total cost of the loan.';
  }
}

function tradeInFraming(record: AutoLoanSeoRecord): string {
  return record.tradeInValue > 0
    ? 'A trade-in further reduces the amount that needs to be financed before tax and financing terms are applied.'
    : 'With no trade-in in this example, the full purchase price, plus tax and minus the down payment, is what gets financed.';
}

function loanTermFaqFraming(profile: LoanTermProfile): string {
  switch (profile) {
    case 'short':
      return 'In this example specifically, the shorter term raises the monthly payment but limits total interest.';
    case 'standard':
      return 'In this example specifically, the mid-length term balances payment size against total interest.';
    case 'extended':
      return 'In this example specifically, the longer term keeps the payment lower but adds to total interest paid.';
  }
}

function downPaymentFaqFraming(profile: DownPaymentProfile): string {
  switch (profile) {
    case 'minimal':
      return 'A small down payment like this one increases the financed amount and the total interest paid compared with a larger down payment on the same vehicle.';
    case 'moderate':
    case 'solid':
      return 'A down payment of this size produces a financed amount and total interest cost between the extremes of a minimal and a substantial down payment on the same vehicle.';
    case 'substantial':
      return 'A substantial down payment like this one sharply reduces the financed amount and the total interest paid compared with a smaller down payment on the same vehicle.';
  }
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
  const downProfile = downPaymentProfile(record);
  const termProfile = loanTermProfile(record);

  return {
    slug: record.slug,
    url: createAutoLoanCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Auto loan example',
    intro: `This worked example shows how a vehicle purchase price, down payment, trade-in value, sales tax, and financing rate combine into an estimated auto loan payment. ${downPaymentFraming(downProfile)} ${loanTermFraming(termProfile)}`,
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
          tradeInFraming(record),
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
        answer: `Yes. ${loanTermFaqFraming(termProfile)} Longer terms in general reduce the monthly payment but can raise total interest and keep the borrower in debt for longer.`,
      },
      {
        question: 'How much does the down payment size change the total cost?',
        answer: downPaymentFaqFraming(downProfile),
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
