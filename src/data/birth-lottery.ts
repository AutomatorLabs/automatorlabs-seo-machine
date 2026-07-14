export const BIRTH_LOTTERY_YEAR_MIN = 1950;
export const BIRTH_LOTTERY_YEAR_MAX = 2026;

// Phase 3a: build only these years for review before generating the full
// 1950-2026 range (see Phase 3b). Swap for the full range once approved.
export const birthLotteryYears: number[] = [1950, 1992, 2026];

export interface BirthLotteryMoneyLink {
  title: string;
  url: string;
  description: string;
}

export const birthLotteryMoneyLinks: BirthLotteryMoneyLink[] = [
  {
    title: 'FIRE Calculator',
    url: '/calculators/fire-calculator/',
    description:
      'See what financial independence takes by the time a birth year like yours reaches retirement age.',
  },
  {
    title: 'College Cost Inflation Calculator',
    url: '/calculators/college-cost-inflation-calculator/',
    description:
      "College costs are on a very different curve than the year you're checking — project where they're headed.",
  },
  {
    title: 'Net Worth Calculator',
    url: '/calculators/net-worth-calculator/',
    description:
      'Life expectancy shapes every long-horizon decision — track whether your net worth outlives you.',
  },
];
