export interface CalculatorCategory {
  slug: string;
  title: string;
  description: string;
  intro: string;
  seoTitle: string;
  metaDescription: string;
  ids: string[];
}

export const calculatorCategories: CalculatorCategory[] = [
  {
    slug: 'fire-retirement',
    title: 'FIRE & Retirement Calculators',
    description:
      'Plan financial independence, retirement timing, withdrawals, and sustainable income.',
    intro:
      'Estimate the portfolio, timeline, withdrawal strategy, and retirement income needed to support your long-term plans.',
    seoTitle: 'FIRE & Retirement Calculators | AutomatorLabs',
    metaDescription:
      'Use free FIRE and retirement calculators to estimate financial independence targets, retirement timelines, withdrawals, and income needs.',
    ids: [
      'fire-calculator',
      'roth-ira-calculator',
      'roth-ira-growth-calculator',
      'roth-ira-contribution-calculator',
      'roth-ira-max-contribution-calculator',
      'roth-ira-vs-taxable-account-calculator',
      'roth-ira-early-withdrawal-calculator',
      '401k-calculator',
      '401k-growth-calculator',
      '401k-contribution-calculator',
      'employer-match-calculator',
      'traditional-vs-roth-401k-calculator',
      '401k-catch-up-contribution-calculator',
      'coast-fire-calculator',
      'four-percent-rule-calculator',
      'retirement-withdrawal-calculator',
      'financial-independence-date-calculator',
      'lean-fire-calculator',
      'fat-fire-calculator',
      'barista-fire-calculator',
      'safe-withdrawal-rate-calculator',
      'years-to-retirement-calculator',
      'retirement-income-gap-calculator',
      'portfolio-withdrawal-sustainability-calculator',
      'retirement-tax-drag-calculator',
    ],
  },
  {
    slug: 'investing',
    title: 'Investing Calculators',
    description:
      'Explore growth, returns, inflation, dividends, fees, and investment strategies.',
    intro:
      'Compare investment outcomes, understand compounding and inflation, and see how fees, dividends, and contribution strategies affect long-term growth.',
    seoTitle: 'Investing Calculators | AutomatorLabs',
    metaDescription:
      'Explore free investing calculators for compound growth, returns, inflation, dividends, investment fees, and portfolio strategies.',
    ids: [
      'compound-interest-calculator',
      'daily-compound-interest-calculator',
      'monthly-compound-interest-calculator',
      'quarterly-compound-interest-calculator',
      'annual-compound-interest-calculator',
      'apy-calculator',
      'investment-growth-calculator',
      'savings-growth-calculator',
      'rule-of-72-calculator',
      'inflation-calculator',
      'investment-fee-calculator',
      'expense-ratio-calculator',
      'cagr-calculator',
      'etf-fee-drag-calculator',
      'dividend-yield-calculator',
      'dividend-growth-calculator',
      'drip-calculator',
      'lump-sum-vs-dca-calculator',
      'real-rate-of-return-calculator',
      'inflation-adjusted-return-calculator',
    ],
  },
  {
    slug: 'debt-loans',
    title: 'Debt & Loan Calculators',
    description:
      'Estimate payments, payoff timelines, interest costs, and debt repayment strategies.',
    intro:
      'Understand borrowing costs, test extra payments, and compare payoff strategies for loans, credit cards, student debt, and other balances.',
    seoTitle: 'Debt & Loan Calculators | AutomatorLabs',
    metaDescription:
      'Use free debt and loan calculators to estimate payments, payoff timelines, interest costs, and repayment strategies.',
    ids: [
      'loan-payment-calculator',
      'credit-card-payoff-calculator',
      'credit-card-minimum-payment-calculator',
      'credit-card-extra-payment-calculator',
      'balance-transfer-calculator',
      'debt-payoff-calculator',
      'debt-snowball-calculator',
      'debt-avalanche-calculator',
      'credit-card-interest-calculator',
      'auto-loan-calculator',
      'student-loan-calculator',
      'student-loan-payoff-calculator',
    ],
  },
  {
    slug: 'home-mortgage',
    title: 'Home & Mortgage Calculators',
    description:
      'Compare housing choices, mortgage costs, home equity, affordability, and down payments.',
    intro:
      'Evaluate home affordability, mortgage payments, refinancing, equity, and savings targets before making a major housing decision.',
    seoTitle: 'Home & Mortgage Calculators | AutomatorLabs',
    metaDescription:
      'Explore free home and mortgage calculators for affordability, payments, refinancing, equity, down payments, and rent-versus-buy decisions.',
    ids: [
      'mortgage-payment-calculator',
      'mortgage-payoff-calculator',
      'refinance-calculator',
      'heloc-calculator',
      'rent-vs-buy-calculator',
      'home-affordability-calculator',
      'down-payment-calculator',
      'property-tax-calculator',
      'home-maintenance-cost-calculator',
      'closing-cost-calculator',
      'mortgage-recast-calculator',
    ],
  },
  {
    slug: 'budgeting-savings',
    title: 'Budgeting & Savings Calculators',
    description:
      'Build stronger cash flow, savings habits, emergency funds, and personal balance sheets.',
    intro:
      'Turn income, expenses, savings, and financial goals into practical monthly targets you can track and adjust.',
    seoTitle: 'Budgeting & Savings Calculators | AutomatorLabs',
    metaDescription:
      'Use free budgeting and savings calculators for cash flow, savings rates, emergency funds, net worth, and financial goals.',
    ids: [
      'monthly-savings-calculator',
      'weekly-savings-calculator',
      'daily-savings-calculator',
      'vacation-savings-calculator',
      'car-savings-calculator',
      'savings-rate-calculator',
      'net-worth-calculator',
      'emergency-fund-calculator',
      'savings-goal-calculator',
      'budget-calculator',
    ],
  },
  {
    slug: 'college-tax-advantaged',
    title: 'College & Tax-Advantaged Account Calculators',
    description:
      'Plan education costs and compare retirement, health, and tax-advantaged accounts.',
    intro:
      'Project education savings and compare how tax treatment may affect retirement, health, and long-term investment accounts.',
    seoTitle:
      'College & Tax-Advantaged Account Calculators | AutomatorLabs',
    metaDescription:
      'Explore free calculators for college savings, education inflation, IRAs, 401(k)s, HSAs, and taxable versus tax-advantaged accounts.',
    ids: [
      'roth-vs-traditional-ira-calculator',
      'ira-growth-calculator',
      'taxable-vs-tax-advantaged-calculator',
      'hsa-growth-calculator',
      '529-college-savings-calculator',
      'college-cost-inflation-calculator',
    ],
  },
];

export function getCalculatorCategory(
  slug: string,
): CalculatorCategory | undefined {
  return calculatorCategories.find((category) => category.slug === slug);
}
