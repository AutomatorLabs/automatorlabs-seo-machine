export type RothEarlyWithdrawalSeoIntent =
  | 'contributions-only'
  | 'dips-into-earnings'
  | 'penalty-exception'
  | 'large-balance-hardship'
  | 'small-emergency';

export interface RothEarlyWithdrawalSeoRecord {
  slug: string;
  question: string;
  intent: RothEarlyWithdrawalSeoIntent;
  withdrawalAmount: number;
  contributionBasisAvailable: number;
  earningsAmountSubjectToTaxAndPenalty: number;
  assumedTaxRatePercent: number;
  assumedPenaltyRatePercent: number;
  scenarioLabel: string;
}

export const EXPECTED_ROTH_EARLY_WITHDRAWAL_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const roundToHundred = (amount: number) => Math.round(amount / 100) * 100;
const roundToFifty = (amount: number) => Math.round(amount / 50) * 50;

function record(
  intent: RothEarlyWithdrawalSeoIntent,
  question: string,
  scenarioLabel: string,
  withdrawalAmount: number,
  contributionBasisAvailable: number,
  earningsAmountSubjectToTaxAndPenalty: number,
  assumedTaxRatePercent: number,
  assumedPenaltyRatePercent: number,
): RothEarlyWithdrawalSeoRecord {
  return {
    slug: `${intent}-withdraw-${withdrawalAmount}-with-${contributionBasisAvailable}-basis-${earningsAmountSubjectToTaxAndPenalty}-earnings-${assumedTaxRatePercent}-tax-${assumedPenaltyRatePercent}-penalty`,
    question,
    intent,
    withdrawalAmount,
    contributionBasisAvailable,
    earningsAmountSubjectToTaxAndPenalty,
    assumedTaxRatePercent,
    assumedPenaltyRatePercent,
    scenarioLabel,
  };
}

// Intent 1: contributions-only — withdrawal never exceeds basis, so the
// earnings portion, tax, and penalty are always zero regardless of the tax
// rate. The scenario matrix still varies the tax rate to make that point.
const contributionsOnlyAmounts = [2000, 4000, 6000, 8000, 10000];
const contributionsOnlyBundles = [
  { basisMultiplier: 1.5, taxRatePercent: 12, earningsRatioOfBasis: 0.1 },
  { basisMultiplier: 2, taxRatePercent: 22, earningsRatioOfBasis: 0.15 },
  { basisMultiplier: 2.5, taxRatePercent: 22, earningsRatioOfBasis: 0.2 },
  { basisMultiplier: 3, taxRatePercent: 24, earningsRatioOfBasis: 0.25 },
  { basisMultiplier: 4, taxRatePercent: 24, earningsRatioOfBasis: 0.3 },
  { basisMultiplier: 5, taxRatePercent: 32, earningsRatioOfBasis: 0.35 },
  { basisMultiplier: 7, taxRatePercent: 32, earningsRatioOfBasis: 0.4 },
  { basisMultiplier: 10, taxRatePercent: 35, earningsRatioOfBasis: 0.5 },
];

// Intent 2: dips-into-earnings — withdrawal exceeds basis, so the excess is
// taxed and penalized at the standard 10% early-withdrawal penalty rate.
const dipsIntoEarningsAmounts = [10000, 15000, 20000, 25000, 30000];
const dipsIntoEarningsBundles = [
  { basisRatio: 0.6, taxRatePercent: 12 },
  { basisRatio: 0.6, taxRatePercent: 22 },
  { basisRatio: 0.5, taxRatePercent: 22 },
  { basisRatio: 0.5, taxRatePercent: 24 },
  { basisRatio: 0.4, taxRatePercent: 24 },
  { basisRatio: 0.4, taxRatePercent: 32 },
  { basisRatio: 0.3, taxRatePercent: 32 },
  { basisRatio: 0.25, taxRatePercent: 35 },
];

// Intent 3: penalty-exception — withdrawal exceeds basis and the earnings
// portion is still taxed, but a qualifying exception (first-time home
// purchase, higher education, disability, etc.) zeroes the penalty.
const penaltyExceptionAmounts = [8000, 10000, 12000, 15000, 20000];
const penaltyExceptionBundles = [
  { basisRatio: 0.7, taxRatePercent: 12 },
  { basisRatio: 0.6, taxRatePercent: 22 },
  { basisRatio: 0.5, taxRatePercent: 22 },
  { basisRatio: 0.5, taxRatePercent: 24 },
  { basisRatio: 0.4, taxRatePercent: 24 },
  { basisRatio: 0.3, taxRatePercent: 24 },
  { basisRatio: 0.25, taxRatePercent: 32 },
  { basisRatio: 0.2, taxRatePercent: 32 },
];

// Intent 4: large-balance-hardship — bigger withdrawals, higher tax
// brackets, standard 10% penalty.
const largeBalanceHardshipAmounts = [40000, 50000, 65000, 80000, 100000];
const largeBalanceHardshipBundles = [
  { basisRatio: 0.5, taxRatePercent: 24 },
  { basisRatio: 0.45, taxRatePercent: 24 },
  { basisRatio: 0.4, taxRatePercent: 32 },
  { basisRatio: 0.35, taxRatePercent: 32 },
  { basisRatio: 0.3, taxRatePercent: 32 },
  { basisRatio: 0.25, taxRatePercent: 35 },
  { basisRatio: 0.2, taxRatePercent: 35 },
  { basisRatio: 0.15, taxRatePercent: 37 },
];

// Intent 5: small-emergency — modest amounts that mostly draw from basis and
// only slightly dip into earnings, standard 10% penalty.
const smallEmergencyAmounts = [1500, 2500, 3500, 5000, 7500];
const smallEmergencyBundles = [
  { basisRatio: 0.9, taxRatePercent: 12 },
  { basisRatio: 0.85, taxRatePercent: 12 },
  { basisRatio: 0.8, taxRatePercent: 22 },
  { basisRatio: 0.75, taxRatePercent: 22 },
  { basisRatio: 0.7, taxRatePercent: 22 },
  { basisRatio: 0.65, taxRatePercent: 24 },
  { basisRatio: 0.6, taxRatePercent: 24 },
  { basisRatio: 0.5, taxRatePercent: 24 },
];

export const rothEarlyWithdrawalSeoRecords: RothEarlyWithdrawalSeoRecord[] = [
  ...contributionsOnlyAmounts.flatMap((withdrawalAmount) =>
    contributionsOnlyBundles.map((bundle) => {
      const contributionBasisAvailable = roundToHundred(
        withdrawalAmount * bundle.basisMultiplier,
      );
      const earningsAmountSubjectToTaxAndPenalty = roundToHundred(
        contributionBasisAvailable * bundle.earningsRatioOfBasis,
      );
      return record(
        'contributions-only',
        `Contributions-Only Roth IRA Withdrawal: ${money(withdrawalAmount)} From ${money(contributionBasisAvailable)} in Contributions`,
        'contributions only',
        withdrawalAmount,
        contributionBasisAvailable,
        earningsAmountSubjectToTaxAndPenalty,
        bundle.taxRatePercent,
        10,
      );
    }),
  ),
  ...dipsIntoEarningsAmounts.flatMap((withdrawalAmount) =>
    dipsIntoEarningsBundles.map((bundle) => {
      const contributionBasisAvailable = roundToHundred(
        withdrawalAmount * bundle.basisRatio,
      );
      const earningsAmountSubjectToTaxAndPenalty =
        withdrawalAmount - contributionBasisAvailable;
      return record(
        'dips-into-earnings',
        `Roth IRA Early Withdrawal: ${money(withdrawalAmount)} With ${money(contributionBasisAvailable)} Basis and ${money(earningsAmountSubjectToTaxAndPenalty)} in Earnings Taxed at ${bundle.taxRatePercent}%`,
        'dips into earnings',
        withdrawalAmount,
        contributionBasisAvailable,
        earningsAmountSubjectToTaxAndPenalty,
        bundle.taxRatePercent,
        10,
      );
    }),
  ),
  ...penaltyExceptionAmounts.flatMap((withdrawalAmount) =>
    penaltyExceptionBundles.map((bundle) => {
      const contributionBasisAvailable = roundToHundred(
        withdrawalAmount * bundle.basisRatio,
      );
      const earningsAmountSubjectToTaxAndPenalty =
        withdrawalAmount - contributionBasisAvailable;
      return record(
        'penalty-exception',
        `Penalty-Exception Roth IRA Withdrawal: ${money(withdrawalAmount)} With ${money(earningsAmountSubjectToTaxAndPenalty)} in Earnings Taxed at ${bundle.taxRatePercent}%`,
        'penalty exception',
        withdrawalAmount,
        contributionBasisAvailable,
        earningsAmountSubjectToTaxAndPenalty,
        bundle.taxRatePercent,
        0,
      );
    }),
  ),
  ...largeBalanceHardshipAmounts.flatMap((withdrawalAmount) =>
    largeBalanceHardshipBundles.map((bundle) => {
      const contributionBasisAvailable = roundToHundred(
        withdrawalAmount * bundle.basisRatio,
      );
      const earningsAmountSubjectToTaxAndPenalty =
        withdrawalAmount - contributionBasisAvailable;
      return record(
        'large-balance-hardship',
        `Large Roth IRA Hardship Withdrawal: ${money(withdrawalAmount)} With ${money(earningsAmountSubjectToTaxAndPenalty)} in Earnings Taxed at ${bundle.taxRatePercent}%`,
        'large balance hardship',
        withdrawalAmount,
        contributionBasisAvailable,
        earningsAmountSubjectToTaxAndPenalty,
        bundle.taxRatePercent,
        10,
      );
    }),
  ),
  ...smallEmergencyAmounts.flatMap((withdrawalAmount) =>
    smallEmergencyBundles.map((bundle) => {
      const contributionBasisAvailable = roundToFifty(
        withdrawalAmount * bundle.basisRatio,
      );
      const earningsAmountSubjectToTaxAndPenalty =
        withdrawalAmount - contributionBasisAvailable;
      return record(
        'small-emergency',
        `Small Emergency Roth IRA Withdrawal: ${money(withdrawalAmount)} With ${money(earningsAmountSubjectToTaxAndPenalty)} in Earnings at ${bundle.taxRatePercent}% Tax`,
        'small emergency',
        withdrawalAmount,
        contributionBasisAvailable,
        earningsAmountSubjectToTaxAndPenalty,
        bundle.taxRatePercent,
        10,
      );
    }),
  ),
];

export const featuredRothEarlyWithdrawalSeoRecords =
  rothEarlyWithdrawalSeoRecords.filter((record) =>
    [
      'contributions-only-withdraw-6000-with-12000-basis-1800-earnings-22-tax-10-penalty',
      'dips-into-earnings-withdraw-20000-with-10000-basis-10000-earnings-22-tax-10-penalty',
    ].includes(record.slug),
  );
