export interface TopicLink {
  title: string;
  url: string;
}

export interface TopicSection {
  title: string;
  description: string;
  calculators: TopicLink[];
  guides: TopicLink[];
  examples: TopicLink[];
}

export const topics: TopicSection[] = [
  {
    title: 'Investing',
    description:
      'Explore compounding, investment growth, returns, inflation-adjusted results, fees, and long-term portfolio assumptions.',
    calculators: [
      { title: 'Compound Interest Calculator', url: '/calculators/compound-interest/' },
      { title: 'Investment Growth Calculator', url: '/calculators/investment-growth-calculator/' },
      { title: 'CAGR Calculator', url: '/calculators/cagr-calculator/' },
      { title: 'APY Calculator', url: '/calculators/apy-calculator/' },
      { title: 'Rule of 72 Calculator', url: '/calculators/rule-of-72-calculator/' },
      { title: 'DRIP Calculator', url: '/calculators/drip-calculator/' },
      { title: 'Dividend Yield Calculator', url: '/calculators/dividend-yield-calculator/' },
      { title: 'Dividend Growth Calculator', url: '/calculators/dividend-growth-calculator/' },
      { title: 'Expense Ratio Calculator', url: '/calculators/expense-ratio-calculator/' },
      { title: 'ETF Fee Drag Calculator', url: '/calculators/etf-fee-drag-calculator/' },
      { title: 'Lump Sum vs DCA Calculator', url: '/calculators/lump-sum-vs-dca-calculator/' },
      { title: 'Inflation-Adjusted Return Calculator', url: '/calculators/inflation-adjusted-return-calculator/' },
      { title: 'Real Rate of Return Calculator', url: '/calculators/real-rate-of-return-calculator/' },
    ],
    guides: [
      { title: 'Investing Basics for Long-Term Growth', url: '/guides/investing/' },
      { title: 'What Is Compound Interest?', url: '/guides/what-is-compound-interest/' },
      { title: 'What Is CAGR?', url: '/guides/what-is-cagr/' },
      { title: 'What Is APY?', url: '/guides/what-is-apy/' },
      { title: 'What Is DRIP Investing?', url: '/guides/what-is-drip-investing/' },
      { title: 'What Is an Expense Ratio?', url: '/guides/what-is-expense-ratio/' },
      { title: 'What Is ETF Fee Drag?', url: '/guides/what-is-etf-fee-drag/' },
      { title: 'Lump Sum vs Dollar Cost Averaging', url: '/guides/lump-sum-vs-dollar-cost-averaging/' },
      { title: 'What Is the Rule of 72?', url: '/guides/rule-of-72/' },
      { title: 'Investment Growth Guide', url: '/guides/investment-growth/' },
      { title: 'CAGR vs Compound Interest', url: '/guides/cagr-vs-compound-interest/' },
    ],
    examples: [
      { title: 'Compound Interest Examples', url: '/calculators/compound-interest/examples/' },
      { title: 'APY Examples', url: '/calculators/apy/examples/' },
      { title: 'DRIP Examples', url: '/calculators/drip/examples/' },
      { title: 'Dividend Yield Examples', url: '/calculators/dividend-yield/examples/' },
      { title: 'Expense Ratio Examples', url: '/calculators/expense-ratio/examples/' },
      { title: 'ETF Fee Drag Examples', url: '/calculators/etf-fee-drag/examples/' },
      { title: 'Investment Fee Examples', url: '/calculators/investment-fee/examples/' },
      { title: 'Investment Growth Examples', url: '/calculators/investment-growth/examples/' },
      { title: 'Lump Sum vs DCA Examples', url: '/calculators/lump-sum-vs-dca/examples/' },
      { title: 'Dividend Growth Examples', url: '/calculators/dividend-growth/examples/' },
      { title: 'CAGR Examples', url: '/calculators/cagr/examples/' },
      { title: 'Rule of 72 Examples', url: '/calculators/rule-of-72/examples/' },
    ],
  },
  {
    title: 'Retirement',
    description:
      'Plan retirement income, withdrawal rates, account growth, income gaps, and timing across taxable and retirement accounts.',
    calculators: [
      { title: 'Retirement Withdrawal Calculator', url: '/calculators/retirement-withdrawal-calculator/' },
      { title: 'Safe Withdrawal Rate Calculator', url: '/calculators/safe-withdrawal-rate-calculator/' },
      { title: '4 Percent Rule Calculator', url: '/calculators/4-percent-rule-calculator/' },
      { title: 'Roth IRA Calculator', url: '/calculators/roth-ira-calculator/' },
      { title: '401(k) Calculator', url: '/calculators/401k-calculator/' },
    ],
    guides: [
      { title: 'Retirement Planning Guide Hub', url: '/guides/retirement/' },
      { title: 'Planning Retirement Withdrawals', url: '/guides/retirement-withdrawals/' },
      { title: 'Roth IRA vs Traditional IRA', url: '/guides/roth-vs-traditional-ira/' },
    ],
    examples: [
      { title: 'DRIP Examples', url: '/calculators/drip/examples/' },
      { title: 'Dividend Yield Examples', url: '/calculators/dividend-yield/examples/' },
      { title: 'Expense Ratio Examples', url: '/calculators/expense-ratio/examples/' },
      { title: 'Investment Growth Examples', url: '/calculators/investment-growth/examples/' },
      { title: 'Dividend Growth Examples', url: '/calculators/dividend-growth/examples/' },
      { title: '401(k) Examples', url: '/calculators/401k/examples/' },
      { title: 'Roth IRA Examples', url: '/calculators/roth-ira/examples/' },
      { title: 'Coast FIRE Examples', url: '/calculators/coast-fire/examples/' },
      { title: 'Retirement Withdrawal Examples', url: '/calculators/retirement-withdrawal/examples/' },
      { title: 'Retirement Income Gap Examples', url: '/calculators/retirement-income-gap/examples/' },
      { title: 'Retirement Tax Drag Examples', url: '/calculators/retirement-tax-drag/examples/' },
      { title: 'Safe Withdrawal Rate Examples', url: '/calculators/safe-withdrawal-rate/examples/' },
      { title: '4 Percent Rule Examples', url: '/calculators/4-percent-rule/examples/' },
      { title: 'Years to Retirement Examples', url: '/calculators/years-to-retirement/examples/' },
    ],
  },
  {
    title: 'FIRE',
    description:
      'Compare financial independence targets, Coast FIRE milestones, withdrawal assumptions, and early-retirement timelines.',
    calculators: [
      { title: 'FIRE Calculator', url: '/calculators/fire-calculator/' },
      { title: 'Coast FIRE Calculator', url: '/calculators/coast-fire-calculator/' },
      { title: 'Lean FIRE Calculator', url: '/calculators/lean-fire-calculator/' },
      { title: 'Fat FIRE Calculator', url: '/calculators/fat-fire-calculator/' },
      { title: 'Barista FIRE Calculator', url: '/calculators/barista-fire-calculator/' },
      { title: '4 Percent Rule Calculator', url: '/calculators/4-percent-rule-calculator/' },
      { title: 'Safe Withdrawal Rate Calculator', url: '/calculators/safe-withdrawal-rate-calculator/' },
      { title: 'Retirement Withdrawal Calculator', url: '/calculators/retirement-withdrawal-calculator/' },
      { title: 'Financial Independence Date Calculator', url: '/calculators/financial-independence-date-calculator/' },
      { title: 'Years to Retirement Calculator', url: '/calculators/years-to-retirement-calculator/' },
    ],
    guides: [
      { title: 'A Beginner’s Guide to FIRE', url: '/guides/fire/' },
      { title: 'Retirement Planning Guide Hub', url: '/guides/retirement/' },
      { title: 'Savings Planning Guide Hub', url: '/guides/savings/' },
      { title: 'Investing Basics for Long-Term Growth', url: '/guides/investing/' },
      { title: 'FIRE vs Coast FIRE', url: '/guides/fire-vs-coast-fire/' },
      { title: 'Lean FIRE vs Fat FIRE', url: '/guides/lean-fire-vs-fat-fire/' },
      { title: 'Planning Retirement Withdrawals', url: '/guides/retirement-withdrawals/' },
    ],
    examples: [
      { title: 'FIRE Examples', url: '/calculators/fire/examples/' },
      { title: 'Coast FIRE Examples', url: '/calculators/coast-fire/examples/' },
      { title: '4 Percent Rule Examples', url: '/calculators/4-percent-rule/examples/' },
      { title: 'Safe Withdrawal Rate Examples', url: '/calculators/safe-withdrawal-rate/examples/' },
      { title: 'Retirement Withdrawal Examples', url: '/calculators/retirement-withdrawal/examples/' },
      { title: 'Years to Retirement Examples', url: '/calculators/years-to-retirement/examples/' },
    ],
  },
  {
    title: 'Mortgages',
    description:
      'Estimate mortgage payments, affordability, refinance tradeoffs, payoff scenarios, down payments, taxes, and ownership costs.',
    calculators: [
      { title: 'Mortgage Payment Calculator', url: '/calculators/mortgage-payment-calculator/' },
      { title: 'Mortgage Payoff Calculator', url: '/calculators/mortgage-payoff-calculator/' },
      { title: 'HELOC Calculator', url: '/calculators/heloc-calculator/' },
      { title: 'Mortgage Recast Calculator', url: '/calculators/mortgage-recast-calculator/' },
      { title: 'Refinance Calculator', url: '/calculators/refinance-calculator/' },
      { title: 'Rent vs Buy Calculator', url: '/calculators/rent-vs-buy-calculator/' },
      { title: 'Home Affordability Calculator', url: '/calculators/home-affordability-calculator/' },
      { title: 'Down Payment Calculator', url: '/calculators/down-payment-calculator/' },
      { title: 'Property Tax Calculator', url: '/calculators/property-tax-calculator/' },
      { title: 'Closing Cost Calculator', url: '/calculators/closing-cost-calculator/' },
    ],
    guides: [
      { title: 'Mortgage and Home Buying Guide Hub', url: '/guides/mortgage/' },
      { title: 'A Practical Guide to Buying a Home', url: '/guides/home-buying/' },
      { title: 'Rent vs Buy', url: '/guides/rent-vs-buy/' },
    ],
    examples: [
      { title: 'Mortgage Payment Examples', url: '/calculators/mortgage/examples/' },
      { title: 'Mortgage Payoff Examples', url: '/calculators/mortgage-payoff/examples/' },
      { title: 'HELOC Examples', url: '/calculators/heloc/examples/' },
    ],
  },
  {
    title: 'Debt',
    description:
      'Compare debt payoff timelines, snowball and avalanche strategies, extra payments, loan payments, and interest costs.',
    calculators: [
      { title: 'Debt Payoff Calculator', url: '/calculators/debt-payoff-calculator/' },
      { title: 'Debt Snowball Calculator', url: '/calculators/debt-snowball-calculator/' },
      { title: 'Debt Avalanche Calculator', url: '/calculators/debt-avalanche-calculator/' },
      { title: 'Credit Card Payoff Calculator', url: '/calculators/credit-card-payoff-calculator/' },
      { title: 'Credit Card Interest Calculator', url: '/calculators/credit-card-interest-calculator/' },
      { title: 'Balance Transfer Calculator', url: '/calculators/balance-transfer-calculator/' },
      { title: 'Loan Payment Calculator', url: '/calculators/loan-payment-calculator/' },
      { title: 'Auto Loan Calculator', url: '/calculators/auto-loan-calculator/' },
      { title: 'Student Loan Calculator', url: '/calculators/student-loan-calculator/' },
      { title: 'Student Loan Payoff Calculator', url: '/calculators/student-loan-payoff-calculator/' },
      { title: 'HELOC Calculator', url: '/calculators/heloc-calculator/' },
    ],
    guides: [
      { title: 'Debt Payoff and Credit Card Planning Hub', url: '/guides/debt/' },
      { title: 'Debt Payoff Guide', url: '/guides/debt-payoff/' },
      { title: 'Debt Snowball vs Debt Avalanche', url: '/guides/debt-snowball-vs-debt-avalanche/' },
      { title: 'How to Pay Off Credit Card Debt', url: '/guides/how-to-pay-off-credit-card-debt/' },
      { title: 'Credit Card Payoff vs Balance Transfer', url: '/guides/credit-card-payoff-vs-balance-transfer/' },
      { title: 'Minimum Payment vs Extra Payment', url: '/guides/minimum-payment-vs-extra-payment/' },
      { title: 'What Is a Balance Transfer Fee?', url: '/guides/what-is-balance-transfer-fee/' },
      { title: 'How Credit Card Interest Works', url: '/guides/how-credit-card-interest-works/' },
    ],
    examples: [
      { title: 'Debt Payoff Examples', url: '/calculators/debt-payoff/examples/' },
      { title: 'Debt Snowball Examples', url: '/calculators/debt-snowball/examples/' },
      { title: 'Debt Avalanche Examples', url: '/calculators/debt-avalanche/examples/' },
      { title: 'Credit Card Payoff Examples', url: '/calculators/credit-card-payoff/examples/' },
      { title: 'Balance Transfer Examples', url: '/calculators/balance-transfer/examples/' },
      { title: 'Loan Payment Examples', url: '/calculators/loan-payment/examples/' },
      { title: 'Auto Loan Examples', url: '/calculators/auto-loan/examples/' },
      { title: 'Student Loan Examples', url: '/calculators/student-loan/examples/' },
      { title: 'Student Loan Payoff Examples', url: '/calculators/student-loan-payoff/examples/' },
      { title: 'HELOC Examples', url: '/calculators/heloc/examples/' },
    ],
  },
  {
    title: 'Credit Cards',
    description:
      'Estimate credit card payoff timelines, minimum-payment costs, extra-payment savings, interest charges, and balance transfer tradeoffs.',
    calculators: [
      { title: 'Credit Card Payoff Calculator', url: '/calculators/credit-card-payoff-calculator/' },
      { title: 'Credit Card Minimum Payment Calculator', url: '/calculators/credit-card-minimum-payment-calculator/' },
      { title: 'Credit Card Extra Payment Calculator', url: '/calculators/credit-card-extra-payment-calculator/' },
      { title: 'Credit Card Interest Calculator', url: '/calculators/credit-card-interest-calculator/' },
      { title: 'Balance Transfer Calculator', url: '/calculators/balance-transfer-calculator/' },
    ],
    guides: [
      { title: 'Debt Payoff and Credit Card Planning Hub', url: '/guides/debt/' },
      { title: 'Debt Payoff Guide', url: '/guides/debt-payoff/' },
      { title: 'Debt Snowball vs Debt Avalanche', url: '/guides/debt-snowball-vs-debt-avalanche/' },
      { title: 'How to Pay Off Credit Card Debt', url: '/guides/how-to-pay-off-credit-card-debt/' },
      { title: 'Credit Card Payoff vs Balance Transfer', url: '/guides/credit-card-payoff-vs-balance-transfer/' },
      { title: 'Minimum Payment vs Extra Payment', url: '/guides/minimum-payment-vs-extra-payment/' },
      { title: 'What Is a Balance Transfer Fee?', url: '/guides/what-is-balance-transfer-fee/' },
      { title: 'How Credit Card Interest Works', url: '/guides/how-credit-card-interest-works/' },
    ],
    examples: [
      { title: 'Credit Card Payoff Examples', url: '/calculators/credit-card-payoff/examples/' },
      { title: 'Balance Transfer Examples', url: '/calculators/balance-transfer/examples/' },
    ],
  },
  {
    title: 'Savings',
    description:
      'Set savings goals, compare monthly, weekly, and daily savings targets, and plan for emergency funds, cars, vacations, or future purchases.',
    calculators: [
      { title: 'Savings Goal Calculator', url: '/calculators/savings-goal-calculator/' },
      { title: 'Monthly Savings Calculator', url: '/calculators/monthly-savings-calculator/' },
      { title: 'Weekly Savings Calculator', url: '/calculators/weekly-savings-calculator/' },
      { title: 'Daily Savings Calculator', url: '/calculators/daily-savings-calculator/' },
      { title: 'Emergency Fund Calculator', url: '/calculators/emergency-fund-calculator/' },
      { title: 'Savings Growth Calculator', url: '/calculators/savings-growth-calculator/' },
      { title: 'Vacation Savings Calculator', url: '/calculators/vacation-savings-calculator/' },
      { title: 'Car Savings Calculator', url: '/calculators/car-savings-calculator/' },
      { title: 'Down Payment Calculator', url: '/calculators/down-payment-calculator/' },
      { title: 'Budget Calculator', url: '/calculators/budget-calculator/' },
      { title: 'Savings Rate Calculator', url: '/calculators/savings-rate/' },
    ],
    guides: [
      { title: 'Savings Planning Guide Hub', url: '/guides/savings/' },
      { title: 'Budgeting and Saving for Real Life', url: '/guides/budgeting/' },
      { title: 'How to Use the Emergency Fund Calculator', url: '/guides/how-to-use-emergency-fund-calculator/' },
      { title: 'How to Use the Savings Goal Calculator', url: '/guides/how-to-use-savings-goal-calculator/' },
      { title: 'How to Calculate Savings Rate', url: '/guides/how-to-calculate-savings-rate/' },
    ],
    examples: [
      { title: 'APY Examples', url: '/calculators/apy/examples/' },
      { title: 'Savings Goal Examples', url: '/calculators/savings-goal/examples/' },
      { title: 'Monthly Savings Examples', url: '/calculators/monthly-savings/examples/' },
      { title: 'Savings Growth Examples', url: '/calculators/savings-growth/examples/' },
      { title: 'Emergency Fund Examples', url: '/calculators/emergency-fund/examples/' },
      { title: 'Vacation Savings Examples', url: '/calculators/vacation-savings/examples/' },
      { title: 'Car Savings Examples', url: '/calculators/car-savings/examples/' },
    ],
  },
  {
    title: 'Budgeting',
    description:
      'Understand cash flow, savings rate, emergency reserves, goal funding, and practical monthly planning.',
    calculators: [
      { title: 'Budget Calculator', url: '/calculators/budget-calculator/' },
      { title: 'Savings Rate Calculator', url: '/calculators/savings-rate/' },
      { title: 'Emergency Fund Calculator', url: '/calculators/emergency-fund-calculator/' },
      { title: 'Net Worth Calculator', url: '/calculators/net-worth-calculator/' },
    ],
    guides: [
      { title: 'Budgeting and Saving for Real Life', url: '/guides/budgeting/' },
      { title: 'How to Calculate Savings Rate', url: '/guides/how-to-calculate-savings-rate/' },
    ],
    examples: [
      { title: 'Savings Goal Examples', url: '/calculators/savings-goal/examples/' },
      { title: 'Monthly Savings Examples', url: '/calculators/monthly-savings/examples/' },
      { title: 'Emergency Fund Examples', url: '/calculators/emergency-fund/examples/' },
      { title: 'Vacation Savings Examples', url: '/calculators/vacation-savings/examples/' },
      { title: 'Car Savings Examples', url: '/calculators/car-savings/examples/' },
    ],
  },
  {
    title: 'Inflation',
    description:
      'Compare nominal and real returns, purchasing power, inflation-adjusted growth, and long-term cost increases.',
    calculators: [
      { title: 'Inflation Calculator', url: '/calculators/inflation-calculator/' },
      { title: 'Inflation-Adjusted Return Calculator', url: '/calculators/inflation-adjusted-return-calculator/' },
      { title: 'Real Rate of Return Calculator', url: '/calculators/real-rate-of-return-calculator/' },
      { title: 'College Cost Inflation Calculator', url: '/calculators/college-cost-inflation-calculator/' },
    ],
    guides: [
      { title: 'Nominal Return vs Real Return', url: '/guides/nominal-vs-real-return/' },
      { title: 'How Inflation Affects Compound Interest', url: '/guides/inflation-and-compound-interest/' },
      { title: 'Investing Basics for Long-Term Growth', url: '/guides/investing/' },
    ],
    examples: [
      { title: 'Compound Interest Examples', url: '/calculators/compound-interest/examples/' },
      { title: 'Investment Growth Examples', url: '/calculators/investment-growth/examples/' },
      { title: 'Real Rate of Return Examples', url: '/calculators/real-rate-of-return/examples/' },
      { title: 'Inflation-Adjusted Return Examples', url: '/calculators/inflation-adjusted-return/examples/' },
    ],
  },
  {
    title: 'Taxes',
    description:
      'Explore simplified tax-advantaged account planning, Roth versus traditional decisions, tax drag, and after-tax investment comparisons.',
    calculators: [
      { title: 'Roth IRA Calculator', url: '/calculators/roth-ira-calculator/' },
      { title: 'Traditional vs Roth 401(k) Calculator', url: '/calculators/traditional-vs-roth-401k-calculator/' },
      { title: 'Taxable vs Tax-Advantaged Calculator', url: '/calculators/taxable-vs-tax-advantaged-calculator/' },
      { title: 'Retirement Tax Drag Calculator', url: '/calculators/retirement-tax-drag-calculator/' },
    ],
    guides: [
      { title: 'Roth IRA vs Traditional IRA', url: '/guides/roth-vs-traditional-ira/' },
      { title: 'Retirement Planning Guide Hub', url: '/guides/retirement/' },
    ],
    examples: [
      { title: 'Investment Growth Examples', url: '/calculators/investment-growth/examples/' },
      { title: 'Roth IRA Examples', url: '/calculators/roth-ira/examples/' },
      { title: 'Retirement Tax Drag Examples', url: '/calculators/retirement-tax-drag/examples/' },
      { title: 'Retirement Withdrawal Examples', url: '/calculators/retirement-withdrawal/examples/' },
    ],
  },
  {
    title: 'Loans',
    description:
      'Estimate loan payments, refinance break-even points, auto loan costs, student loan payoff paths, and HELOC affordability.',
    calculators: [
      { title: 'Loan Payment Calculator', url: '/calculators/loan-payment-calculator/' },
      { title: 'Auto Loan Calculator', url: '/calculators/auto-loan-calculator/' },
      { title: 'Student Loan Calculator', url: '/calculators/student-loan-calculator/' },
      { title: 'Refinance Calculator', url: '/calculators/refinance-calculator/' },
    ],
    guides: [
      { title: 'Debt Payoff and Credit Card Planning Hub', url: '/guides/debt/' },
      { title: 'Debt Payoff Guide', url: '/guides/debt-payoff/' },
      { title: 'A Practical Guide to Buying a Home', url: '/guides/home-buying/' },
    ],
    examples: [
      { title: 'Mortgage Payment Examples', url: '/calculators/mortgage/examples/' },
    ],
  },
  {
    title: 'Net Worth',
    description:
      'Track assets, liabilities, portfolio growth, savings progress, and the larger financial picture across goals.',
    calculators: [
      { title: 'Net Worth Calculator', url: '/calculators/net-worth-calculator/' },
      { title: 'Investment Growth Calculator', url: '/calculators/investment-growth-calculator/' },
      { title: 'Savings Growth Calculator', url: '/calculators/savings-growth-calculator/' },
      { title: 'Debt Payoff Calculator', url: '/calculators/debt-payoff-calculator/' },
    ],
    guides: [
      { title: 'Budgeting and Saving for Real Life', url: '/guides/budgeting/' },
      { title: 'Investing Basics for Long-Term Growth', url: '/guides/investing/' },
    ],
    examples: [
      { title: 'Compound Interest Examples', url: '/calculators/compound-interest/examples/' },
      { title: 'Investment Growth Examples', url: '/calculators/investment-growth/examples/' },
      { title: 'CAGR Examples', url: '/calculators/cagr/examples/' },
      { title: 'Savings Growth Examples', url: '/calculators/savings-growth/examples/' },
      { title: 'Savings Goal Examples', url: '/calculators/savings-goal/examples/' },
    ],
  },
];
