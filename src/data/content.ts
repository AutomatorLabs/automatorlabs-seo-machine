export type ContentCategory = 'calculator' | 'tool' | 'guide';
export type ContentStatus = 'live' | 'planned';

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  url: string;
  category: ContentCategory;
  status: ContentStatus;
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  priority: number;
  publishedAt: string | null;
  updatedAt: string | null;
  relatedIds: string[];
}

export const contentItems: ContentItem[] = [
  {
    id: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    slug: 'compound-interest',
    url: '/calculators/compound-interest/',
    category: 'calculator',
    status: 'live',
    description:
      'Estimate your future balance, total contributions, and interest earned with regular monthly investments.',
    primaryKeyword: 'compound interest calculator',
    secondaryKeywords: [
      'investment growth calculator',
      'compound savings calculator',
      'monthly contribution calculator',
    ],
    priority: 1,
    publishedAt: '2026-06-11',
    updatedAt: '2026-06-11',
    relatedIds: [
      'fire-calculator',
      'coast-fire-calculator',
      'inflation-calculator',
    ],
  },
  {
    id: 'savings-rate-calculator',
    title: 'Savings Rate Calculator',
    slug: 'savings-rate',
    url: '/calculators/savings-rate/',
    category: 'calculator',
    status: 'live',
    description:
      'Calculate what percentage of your income you save each month.',
    primaryKeyword: 'savings rate calculator',
    secondaryKeywords: [
      'monthly savings calculator',
      'FIRE savings rate',
      'annual savings calculator',
    ],
    priority: 2,
    publishedAt: '2026-06-11',
    updatedAt: '2026-06-11',
    relatedIds: [
      'compound-interest-calculator',
      'fire-calculator',
      'coast-fire-calculator',
    ],
  },
  {
    id: 'fire-calculator',
    title: 'FIRE Calculator',
    slug: 'fire-calculator',
    url: '/calculators/fire-calculator/',
    category: 'calculator',
    status: 'live',
    description:
      'Estimate how much you need to reach financial independence and retire early.',
    primaryKeyword: 'FIRE calculator',
    secondaryKeywords: [
      'financial independence calculator',
      'early retirement calculator',
      'FIRE number calculator',
    ],
    priority: 3,
    publishedAt: '2026-06-11',
    updatedAt: '2026-06-11',
    relatedIds: [
      'compound-interest-calculator',
      'coast-fire-calculator',
      'expense-ratio-calculator',
    ],
  },
  {
    id: 'coast-fire-calculator',
    title: 'Coast FIRE Calculator',
    slug: 'coast-fire-calculator',
    url: '/calculators/coast-fire-calculator/',
    category: 'calculator',
    status: 'live',
    description:
      'Estimate when your existing investments could grow enough to fund retirement without further contributions.',
    primaryKeyword: 'Coast FIRE calculator',
    secondaryKeywords: [
      'Coast FIRE number',
      'financial independence calculator',
      'retirement savings calculator',
    ],
    priority: 4,
    publishedAt: '2026-06-12',
    updatedAt: '2026-06-12',
    relatedIds: [
      'compound-interest-calculator',
      'fire-calculator',
      'inflation-calculator',
    ],
  },
  {
    id: 'four-percent-rule-calculator',
    title: '4% Rule Calculator',
    slug: '4-percent-rule-calculator',
    url: '/calculators/4-percent-rule-calculator/',
    category: 'calculator',
    status: 'live',
    description:
      'Estimate how much portfolio income a withdrawal rate can support and how large a portfolio you may need.',
    primaryKeyword: '4% rule calculator',
    secondaryKeywords: [
      'safe withdrawal rate calculator',
      'retirement withdrawal calculator',
      'required retirement portfolio',
    ],
    priority: 5,
    publishedAt: '2026-06-12',
    updatedAt: '2026-06-12',
    relatedIds: [
      'fire-calculator',
      'coast-fire-calculator',
      'compound-interest-calculator',
    ],
  },
  {
    id: 'retirement-withdrawal-calculator',
    title: 'Retirement Withdrawal Calculator',
    slug: 'retirement-withdrawal-calculator',
    url: '/calculators/retirement-withdrawal-calculator/',
    category: 'calculator',
    status: 'live',
    description:
      'Estimate annual, monthly, and daily retirement withdrawals based on your portfolio and chosen withdrawal rate.',
    primaryKeyword: 'retirement withdrawal calculator',
    secondaryKeywords: [
      'safe withdrawal calculator',
      'monthly retirement income calculator',
      'retirement portfolio withdrawal',
    ],
    priority: 6,
    publishedAt: '2026-06-12',
    updatedAt: '2026-06-12',
    relatedIds: [
      'fire-calculator',
      'coast-fire-calculator',
      'four-percent-rule-calculator',
    ],
  },
  {
    id: 'inflation-calculator',
    title: 'Inflation Calculator',
    slug: 'inflation-calculator',
    url: '/calculators/inflation-calculator/',
    category: 'calculator',
    status: 'planned',
    description:
      'Estimate how inflation changes purchasing power and the future cost of money.',
    primaryKeyword: 'inflation calculator',
    secondaryKeywords: [
      'purchasing power calculator',
      'future value of money',
      'inflation rate calculator',
    ],
    priority: 7,
    publishedAt: null,
    updatedAt: null,
    relatedIds: [
      'compound-interest-calculator',
      'fire-calculator',
      'coast-fire-calculator',
    ],
  },
  {
    id: 'expense-ratio-calculator',
    title: 'Expense Ratio Calculator',
    slug: 'expense-ratio-calculator',
    url: '/calculators/expense-ratio-calculator/',
    category: 'calculator',
    status: 'planned',
    description:
      'Estimate how fund expense ratios can affect long-term investment returns.',
    primaryKeyword: 'expense ratio calculator',
    secondaryKeywords: [
      'investment fee calculator',
      'mutual fund fee calculator',
      'ETF expense calculator',
    ],
    priority: 8,
    publishedAt: null,
    updatedAt: null,
    relatedIds: [
      'compound-interest-calculator',
      'fire-calculator',
      'inflation-calculator',
    ],
  },
];
