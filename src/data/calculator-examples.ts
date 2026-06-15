export interface WorkedExampleValue {
  label: string;
  value: string;
}

export interface CalculatorWorkedExample {
  inputs: WorkedExampleValue[];
  outputs: WorkedExampleValue[];
  interpretation: string;
}

export const calculatorWorkedExamples: Record<string, CalculatorWorkedExample> = {
  "/calculators/compound-interest/": {
    inputs: [
      { label: "Initial principal", value: "$10,000" },
      { label: "Monthly contribution", value: "$500" },
      { label: "Annual interest rate (%)", value: "7%" },
      { label: "Number of years", value: "20" },
      { label: "Compounding frequency", value: "Monthly" },
    ],
    outputs: [
      { label: "Final balance", value: "$300,850.72" },
      { label: "Total contributions", value: "$130,000.00" },
      { label: "Total interest earned", value: "$170,850.72" },
    ],
    interpretation: "With these illustrative inputs, the final balance is $300,850.72. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/savings-rate/": {
    inputs: [
      { label: "Monthly income", value: "$5,000" },
      { label: "Monthly expenses", value: "$3,500" },
    ],
    outputs: [
      { label: "Monthly savings", value: "$1,500.00" },
      { label: "Savings rate", value: "30.00%" },
      { label: "Annual savings", value: "$18,000.00" },
    ],
    interpretation: "For this illustrative scenario, the monthly savings is $1,500.00. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/fire-calculator/": {
    inputs: [
      { label: "Annual expenses", value: "$48,000" },
      { label: "Withdrawal rate (%)", value: "4%" },
      { label: "Current invested assets", value: "$100,000" },
      { label: "Monthly contribution", value: "$1,500" },
      { label: "Expected annual return (%)", value: "7%" },
    ],
    outputs: [
      { label: "FIRE number", value: "$1,200,000.00" },
      { label: "Amount still needed", value: "$1,100,000.00" },
      { label: "Estimated years to FIRE", value: "20.2 years" },
    ],
    interpretation: "With these illustrative inputs, the estimated years to fire is 20.2 years. The timeline is an estimate based on the stated assumptions, not a prediction or guarantee.",
  },
  "/calculators/coast-fire-calculator/": {
    inputs: [
      { label: "Current age", value: "30" },
      { label: "Target retirement age", value: "60" },
      { label: "Annual expenses in retirement", value: "$48,000" },
      { label: "Withdrawal rate (%)", value: "4%" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Current invested assets", value: "$100,000" },
    ],
    outputs: [
      { label: "FIRE number", value: "$1,200,000.00" },
      { label: "Coast FIRE number", value: "$157,640.54" },
      { label: "Amount above or below Coast FIRE", value: "-$57,640.54" },
      { label: "Years until retirement", value: "30 years" },
    ],
    interpretation: "For this illustrative scenario, the fire number is $1,200,000.00. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/4-percent-rule-calculator/": {
    inputs: [
      { label: "Portfolio value", value: "$1,000,000" },
      { label: "Withdrawal rate (%)", value: "4%" },
      { label: "Annual expenses", value: "$40,000" },
    ],
    outputs: [
      { label: "Safe annual withdrawal", value: "$40,000.00" },
      { label: "Safe monthly withdrawal", value: "$3,333.33" },
      { label: "Required portfolio", value: "$1,000,000.00" },
      { label: "Portfolio surplus or gap", value: "$0.00" },
    ],
    interpretation: "For this illustrative scenario, the safe annual withdrawal is $40,000.00. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/retirement-withdrawal-calculator/": {
    inputs: [
      { label: "Portfolio value", value: "$1,000,000" },
      { label: "Withdrawal rate (%)", value: "4%" },
    ],
    outputs: [
      { label: "Annual withdrawal", value: "$40,000.00" },
      { label: "Monthly withdrawal", value: "$3,333.33" },
      { label: "Daily withdrawal", value: "$109.59" },
    ],
    interpretation: "For this illustrative scenario, the annual withdrawal is $40,000.00. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/rule-of-72-calculator/": {
    inputs: [
      { label: "Annual return (%)", value: "8%" },
    ],
    outputs: [
      { label: "Estimated years to double", value: "9.0 years" },
    ],
    interpretation: "With these illustrative inputs, the estimated years to double is 9.0 years. The timeline is an estimate based on the stated assumptions, not a prediction or guarantee.",
  },
  "/calculators/inflation-calculator/": {
    inputs: [
      { label: "Starting amount", value: "$100,000" },
      { label: "Inflation rate (%)", value: "3%" },
      { label: "Number of years", value: "20" },
    ],
    outputs: [
      { label: "Future purchasing power", value: "$55,367.58" },
      { label: "Total purchasing power lost", value: "$44,632.42" },
      { label: "Inflation multiplier", value: "1.81x" },
    ],
    interpretation: "For this illustrative scenario, the future purchasing power is $55,367.58. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/investment-fee-calculator/": {
    inputs: [
      { label: "Starting investment", value: "$100,000" },
      { label: "Monthly contribution", value: "$500" },
      { label: "Annual fee (%)", value: "0.5%" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Number of years", value: "30" },
    ],
    outputs: [
      { label: "Ending balance before fees", value: "$1,421,635.25" },
      { label: "Ending balance after fees", value: "$1,252,268.84" },
      { label: "Total cost of fees", value: "$169,366.40" },
      { label: "Fee drag percentage", value: "11.91%" },
    ],
    interpretation: "With these illustrative inputs, the ending balance before fees is $1,421,635.25. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/expense-ratio-calculator/": {
    inputs: [
      { label: "Investment amount", value: "$100,000" },
      { label: "Expense ratio (%)", value: "0.5%" },
      { label: "Number of years", value: "30" },
      { label: "Expected annual return (%)", value: "7%" },
    ],
    outputs: [
      { label: "Total fees paid", value: "$99,788.89" },
      { label: "Ending balance after fees", value: "$661,436.62" },
      { label: "Ending balance without fees", value: "$761,225.50" },
      { label: "Difference caused by fees", value: "$99,788.89" },
    ],
    interpretation: "With these illustrative inputs, the ending balance after fees is $661,436.62. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/net-worth-calculator/": {
    inputs: [
      { label: "Cash", value: "$10,000" },
      { label: "Investments", value: "$50,000" },
      { label: "Real estate", value: "$300,000" },
      { label: "Crypto", value: "$5,000" },
      { label: "Other assets", value: "$10,000" },
      { label: "Credit card debt", value: "$5,000" },
      { label: "Loans", value: "$15,000" },
      { label: "Mortgage", value: "$220,000" },
      { label: "Other liabilities", value: "$2,000" },
    ],
    outputs: [
      { label: "Total assets", value: "$375,000.00" },
      { label: "Total liabilities", value: "$242,000.00" },
      { label: "Net worth", value: "$133,000.00" },
      { label: "Debt-to-asset ratio", value: "64.53%" },
    ],
    interpretation: "For this illustrative scenario, the total assets is $375,000.00. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/cagr-calculator/": {
    inputs: [
      { label: "Starting value", value: "$10,000" },
      { label: "Ending value", value: "$20,000" },
      { label: "Number of years", value: "10" },
    ],
    outputs: [
      { label: "CAGR", value: "7.18%" },
      { label: "Total growth", value: "$10,000.00" },
      { label: "Growth multiple", value: "2.00x" },
    ],
    interpretation: "For this illustrative scenario, the cagr is 7.18%. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/etf-fee-drag-calculator/": {
    inputs: [
      { label: "Investment amount", value: "$100,000" },
      { label: "Monthly contribution", value: "$500" },
      { label: "ETF A expense ratio (%)", value: "0.03%" },
      { label: "ETF B expense ratio (%)", value: "0.75%" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Number of years", value: "30" },
    ],
    outputs: [
      { label: "ETF A ending balance", value: "$1,410,806.57" },
      { label: "ETF B ending balance", value: "$1,175,876.61" },
      { label: "Difference between ETFs", value: "$234,929.96" },
      { label: "Higher-cost ETF drag", value: "$234,929.96" },
    ],
    interpretation: "With these illustrative inputs, the etf a ending balance is $1,410,806.57. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/dividend-yield-calculator/": {
    inputs: [
      { label: "Share price", value: "$100" },
      { label: "Annual dividend per share", value: "$4" },
      { label: "Number of shares (optional)", value: "100" },
    ],
    outputs: [
      { label: "Dividend yield", value: "4.00%" },
      { label: "Annual dividend income", value: "$400.00" },
      { label: "Monthly average dividend income", value: "$33.33" },
    ],
    interpretation: "For this illustrative scenario, the dividend yield is 4.00%. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/dividend-growth-calculator/": {
    inputs: [
      { label: "Initial annual dividend income", value: "$1,000" },
      { label: "Annual dividend growth rate (%)", value: "5%" },
      { label: "Number of years", value: "10" },
    ],
    outputs: [
      { label: "Future annual dividend income", value: "$1,628.89" },
      { label: "Monthly equivalent income", value: "$135.74" },
      { label: "Total percentage increase", value: "62.89%" },
    ],
    interpretation: "For this illustrative scenario, the future annual dividend income is $1,628.89. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/drip-calculator/": {
    inputs: [
      { label: "Initial investment", value: "$10,000" },
      { label: "Annual dividend yield (%)", value: "4%" },
      { label: "Annual share price appreciation (%)", value: "5%" },
      { label: "Annual dividend growth rate (%)", value: "3%" },
      { label: "Monthly contribution", value: "$500" },
      { label: "Number of years", value: "20" },
    ],
    outputs: [
      { label: "Final portfolio value", value: "$491,119.01" },
      { label: "Total dividends earned", value: "$200,598.36" },
      { label: "Total contributions", value: "$130,000.00" },
      { label: "Estimated annual dividend income at the end", value: "$35,480.62" },
    ],
    interpretation: "With these illustrative inputs, the final portfolio value is $491,119.01. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/lump-sum-vs-dca-calculator/": {
    inputs: [
      { label: "Total amount to invest", value: "$12,000" },
      { label: "DCA monthly amount", value: "$1,000" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Number of years", value: "10" },
    ],
    outputs: [
      { label: "Lump sum ending balance", value: "$23,605.82" },
      { label: "DCA ending balance", value: "$22,889.36" },
      { label: "Difference", value: "$716.45" },
      { label: "Better strategy based on assumptions", value: "Lump sum by $716.45" },
    ],
    interpretation: "Under these example assumptions, the better strategy based on assumptions is Lump sum by $716.45. This comparison illustrates the entered scenario and is not a guarantee that the same option will be better in practice.",
  },
  "/calculators/emergency-fund-calculator/": {
    inputs: [
      { label: "Monthly essential expenses", value: "$3,000" },
      { label: "Target months of expenses", value: "6" },
      { label: "Current emergency savings", value: "$5,000" },
      { label: "Monthly savings contribution", value: "$500" },
    ],
    outputs: [
      { label: "Target emergency fund", value: "$18,000.00" },
      { label: "Amount still needed", value: "$13,000.00" },
      { label: "Estimated months to reach target", value: "26 months" },
    ],
    interpretation: "With these illustrative inputs, the estimated months to reach target is 26 months. The timeline is an estimate based on the stated assumptions, not a prediction or guarantee.",
  },
  "/calculators/savings-goal-calculator/": {
    inputs: [
      { label: "Savings goal amount", value: "$25,000" },
      { label: "Current savings", value: "$5,000" },
      { label: "Monthly contribution", value: "$500" },
      { label: "Expected annual return (%)", value: "4%" },
    ],
    outputs: [
      { label: "Amount still needed", value: "$20,000.00" },
      { label: "Estimated months to reach goal", value: "37 months" },
      { label: "Total contributions needed", value: "$18,500.00" },
    ],
    interpretation: "With these illustrative inputs, the estimated months to reach goal is 37 months. The timeline is an estimate based on the stated assumptions, not a prediction or guarantee.",
  },
  "/calculators/real-rate-of-return-calculator/": {
    inputs: [
      { label: "Nominal annual return (%)", value: "7%" },
      { label: "Inflation rate (%)", value: "3%" },
    ],
    outputs: [
      { label: "Real annual return", value: "3.88%" },
      { label: "Purchasing power gain/loss", value: "3.88%" },
      { label: "Inflation-adjusted multiplier", value: "1.0388x" },
    ],
    interpretation: "For this illustrative scenario, the real annual return is 3.88%. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/inflation-adjusted-return-calculator/": {
    inputs: [
      { label: "Starting investment", value: "$10,000" },
      { label: "Nominal annual return (%)", value: "7%" },
      { label: "Inflation rate (%)", value: "3%" },
      { label: "Number of years", value: "20" },
    ],
    outputs: [
      { label: "Nominal ending balance", value: "$38,696.84" },
      { label: "Inflation-adjusted ending balance", value: "$21,425.50" },
      { label: "Purchasing power lost to inflation", value: "$17,271.34" },
      { label: "Real annual return", value: "3.88%" },
    ],
    interpretation: "With these illustrative inputs, the nominal ending balance is $38,696.84. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/financial-independence-date-calculator/": {
    inputs: [
      { label: "Current invested assets", value: "$250,000" },
      { label: "Annual expenses", value: "$50,000" },
      { label: "Monthly contribution", value: "$2,000" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Withdrawal rate (%)", value: "4%" },
    ],
    outputs: [
      { label: "FIRE number", value: "$1,250,000.00" },
      { label: "Amount still needed", value: "$1,000,000.00" },
      { label: "Estimated years to financial independence", value: "14 years, 2 months" },
    ],
    interpretation: "With these illustrative inputs, the estimated years to financial independence is 14 years, 2 months. The timeline is an estimate based on the stated assumptions, not a prediction or guarantee.",
  },
  "/calculators/lean-fire-calculator/": {
    inputs: [
      { label: "Annual expenses", value: "$36,000" },
      { label: "Withdrawal rate (%)", value: "4%" },
      { label: "Current invested assets", value: "$250,000" },
      { label: "Monthly contribution", value: "$2,000" },
      { label: "Expected annual return (%)", value: "7%" },
    ],
    outputs: [
      { label: "Lean FIRE number", value: "$900,000.00" },
      { label: "Amount still needed", value: "$650,000.00" },
      { label: "Estimated years to Lean FIRE", value: "10 years, 8 months" },
    ],
    interpretation: "With these illustrative inputs, the estimated years to lean fire is 10 years, 8 months. The timeline is an estimate based on the stated assumptions, not a prediction or guarantee.",
  },
  "/calculators/fat-fire-calculator/": {
    inputs: [
      { label: "Target annual spending", value: "$120,000" },
      { label: "Withdrawal rate (%)", value: "4%" },
      { label: "Current invested assets", value: "$500,000" },
      { label: "Monthly contribution", value: "$5,000" },
      { label: "Expected annual return (%)", value: "7%" },
    ],
    outputs: [
      { label: "Fat FIRE number", value: "$3,000,000.00" },
      { label: "Amount still needed", value: "$2,500,000.00" },
      { label: "Estimated years to Fat FIRE", value: "15 years" },
    ],
    interpretation: "With these illustrative inputs, the estimated years to fat fire is 15 years. The timeline is an estimate based on the stated assumptions, not a prediction or guarantee.",
  },
  "/calculators/barista-fire-calculator/": {
    inputs: [
      { label: "Annual expenses", value: "$60,000" },
      { label: "Expected annual part-time income", value: "$24,000" },
      { label: "Withdrawal rate (%)", value: "4%" },
      { label: "Current invested assets", value: "$250,000" },
      { label: "Monthly contribution", value: "$2,000" },
      { label: "Expected annual return (%)", value: "7%" },
    ],
    outputs: [
      { label: "Barista FIRE number", value: "$900,000.00" },
      { label: "Expenses covered by part-time income", value: "$24,000.00" },
      { label: "Amount still needed", value: "$650,000.00" },
      { label: "Estimated years to Barista FIRE", value: "10 years, 8 months" },
    ],
    interpretation: "With these illustrative inputs, the estimated years to barista fire is 10 years, 8 months. The timeline is an estimate based on the stated assumptions, not a prediction or guarantee.",
  },
  "/calculators/safe-withdrawal-rate-calculator/": {
    inputs: [
      { label: "Portfolio value", value: "$1,000,000" },
      { label: "Desired annual spending", value: "$40,000" },
    ],
    outputs: [
      { label: "Withdrawal rate needed", value: "4.00%" },
      { label: "Annual spending supported at 4%", value: "$40,000.00" },
      { label: "Monthly spending supported at 4%", value: "$3,333.33" },
      { label: "Portfolio surplus or shortfall vs 4% rule", value: "Surplus: $0.00" },
    ],
    interpretation: "With these illustrative inputs, the annual spending supported at 4% is $40,000.00. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/years-to-retirement-calculator/": {
    inputs: [
      { label: "Current age", value: "35" },
      { label: "Target retirement age", value: "60" },
      { label: "Current invested assets", value: "$200,000" },
      { label: "Target retirement portfolio", value: "$1,500,000" },
      { label: "Monthly contribution", value: "$2,000" },
      { label: "Expected annual return (%)", value: "7%" },
    ],
    outputs: [
      { label: "Years by age target", value: "25 years" },
      { label: "Portfolio gap", value: "$1,300,000.00" },
      { label: "Estimated years to target portfolio", value: "17 years, 7 months" },
      { label: "Likely reached before target retirement age", value: "Yes, before the target retirement age" },
    ],
    interpretation: "Under these example assumptions, the likely reached before target retirement age is Yes, before the target retirement age. This comparison illustrates the entered scenario and is not a guarantee that the same option will be better in practice.",
  },
  "/calculators/retirement-income-gap-calculator/": {
    inputs: [
      { label: "Desired annual retirement income", value: "$80,000" },
      { label: "Expected Social Security income", value: "$24,000" },
      { label: "Portfolio value", value: "$1,000,000" },
      { label: "Withdrawal rate (%)", value: "4%" },
    ],
    outputs: [
      { label: "Total expected non-portfolio income", value: "$24,000.00" },
      { label: "Annual income gap", value: "$56,000.00" },
      { label: "Portfolio withdrawal supported", value: "$40,000.00" },
      { label: "Surplus or shortfall", value: "Shortfall: $16,000.00" },
    ],
    interpretation: "For this illustrative scenario, the total expected non-portfolio income is $24,000.00. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/portfolio-withdrawal-sustainability-calculator/": {
    inputs: [
      { label: "Portfolio value", value: "$1,000,000" },
      { label: "Annual withdrawal amount", value: "$40,000" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Inflation rate (%)", value: "3%" },
      { label: "Number of years", value: "30" },
    ],
    outputs: [
      { label: "Ending portfolio balance", value: "$935,915.55" },
      { label: "Total withdrawals", value: "$1,200,000.00" },
      { label: "Real return after inflation", value: "3.88%" },
      { label: "Sustainability result", value: "Sustainable: portfolio remains above zero" },
    ],
    interpretation: "Under these example assumptions, the sustainability result is Sustainable: portfolio remains above zero. This comparison illustrates the entered scenario and is not a guarantee that the same option will be better in practice.",
  },
  "/calculators/retirement-tax-drag-calculator/": {
    inputs: [
      { label: "Annual retirement withdrawal", value: "$60,000" },
      { label: "Estimated tax rate (%)", value: "20%" },
      { label: "Years in retirement", value: "30" },
      { label: "Inflation rate (%)", value: "3%" },
    ],
    outputs: [
      { label: "Annual taxes paid", value: "$12,000.00" },
      { label: "After-tax annual income", value: "$48,000.00" },
      { label: "Total taxes over retirement", value: "$360,000.00" },
      { label: "Inflation-adjusted total taxes", value: "$235,205.30" },
    ],
    interpretation: "For this illustrative scenario, the annual taxes paid is $12,000.00. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/roth-vs-traditional-ira-calculator/": {
    inputs: [
      { label: "Annual contribution", value: "$7,000" },
      { label: "Current tax rate (%)", value: "24%" },
      { label: "Retirement tax rate (%)", value: "22%" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Number of years", value: "30" },
    ],
    outputs: [
      { label: "Roth IRA ending value", value: "$502,531.38" },
      { label: "Traditional IRA after-tax ending value", value: "$515,755.89" },
      { label: "Difference", value: "-$13,224.51" },
      { label: "Better option under assumptions", value: "Traditional IRA" },
    ],
    interpretation: "Under these example assumptions, the better option under assumptions is Traditional IRA. This comparison illustrates the entered scenario and is not a guarantee that the same option will be better in practice.",
  },
  "/calculators/401k-growth-calculator/": {
    inputs: [
      { label: "Current 401(k) balance", value: "$50,000" },
      { label: "Employee monthly contribution", value: "$600" },
      { label: "Employer monthly match", value: "$300" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Number of years", value: "25" },
    ],
    outputs: [
      { label: "Ending 401(k) balance", value: "$1,015,335.43" },
      { label: "Total employee contributions", value: "$180,000.00" },
      { label: "Total employer match", value: "$90,000.00" },
      { label: "Investment growth", value: "$695,335.43" },
    ],
    interpretation: "With these illustrative inputs, the ending 401(k) balance is $1,015,335.43. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/ira-growth-calculator/": {
    inputs: [
      { label: "Current IRA balance", value: "$25,000" },
      { label: "Annual contribution", value: "$7,000" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Number of years", value: "25" },
    ],
    outputs: [
      { label: "Ending IRA balance", value: "$578,429.08" },
      { label: "Total contributions", value: "$175,000.00" },
      { label: "Investment growth", value: "$378,429.08" },
      { label: "Average annual growth", value: "$15,137.16" },
    ],
    interpretation: "With these illustrative inputs, the ending ira balance is $578,429.08. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/taxable-vs-tax-advantaged-calculator/": {
    inputs: [
      { label: "Starting investment", value: "$25,000" },
      { label: "Annual contribution", value: "$7,000" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Tax drag in taxable account (%)", value: "1%" },
      { label: "Number of years", value: "25" },
    ],
    outputs: [
      { label: "Taxable account ending balance", value: "$491,348.35" },
      { label: "Tax-advantaged ending balance", value: "$578,429.08" },
      { label: "Difference", value: "$87,080.73" },
      { label: "Tax drag cost", value: "$87,080.73" },
    ],
    interpretation: "With these illustrative inputs, the taxable account ending balance is $491,348.35. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/hsa-growth-calculator/": {
    inputs: [
      { label: "Current HSA balance", value: "$10,000" },
      { label: "Annual contribution", value: "$4,300" },
      { label: "Expected annual return (%)", value: "7%" },
      { label: "Number of years", value: "20" },
    ],
    outputs: [
      { label: "Ending HSA balance", value: "$214,977.46" },
      { label: "Total contributions", value: "$86,000.00" },
      { label: "Investment growth", value: "$118,977.46" },
      { label: "Estimated triple-tax-advantaged value", value: "$214,977.46" },
    ],
    interpretation: "With these illustrative inputs, the ending hsa balance is $214,977.46. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/529-college-savings-calculator/": {
    inputs: [
      { label: "Current 529 balance", value: "$10,000" },
      { label: "Monthly contribution", value: "$500" },
      { label: "Expected annual return (%)", value: "6%" },
      { label: "Years until college", value: "15" },
      { label: "Target college cost", value: "$150,000" },
    ],
    outputs: [
      { label: "Projected 529 balance", value: "$169,950.29" },
      { label: "Total contributions", value: "$90,000.00" },
      { label: "Investment growth", value: "$69,950.29" },
      { label: "Surplus or shortfall vs target cost", value: "$19,950.29" },
    ],
    interpretation: "With these illustrative inputs, the projected 529 balance is $169,950.29. The result shows how the example assumptions interact and is not a prediction of future performance.",
  },
  "/calculators/college-cost-inflation-calculator/": {
    inputs: [
      { label: "Current annual college cost", value: "$30,000" },
      { label: "Education inflation rate (%)", value: "5%" },
      { label: "Years until college", value: "15" },
      { label: "Number of college years", value: "4" },
    ],
    outputs: [
      { label: "Estimated first-year college cost", value: "$62,367.85" },
      { label: "Estimated total college cost", value: "$268,813.21" },
      { label: "Total increase from today's cost", value: "$148,813.21" },
      { label: "Inflation multiplier", value: "2.24x" },
    ],
    interpretation: "For this illustrative scenario, the estimated first-year college cost is $62,367.85. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/budget-calculator/": {
    inputs: [
      { label: "Monthly after-tax income", value: "$6,000" },
      { label: "Housing", value: "$1,800" },
      { label: "Food", value: "$600" },
      { label: "Transportation", value: "$500" },
      { label: "Insurance", value: "$400" },
      { label: "Debt payments", value: "$300" },
      { label: "Subscriptions", value: "$100" },
      { label: "Entertainment", value: "$300" },
      { label: "Other expenses", value: "$200" },
      { label: "Monthly savings/investing", value: "$1,000" },
    ],
    outputs: [
      { label: "Total monthly expenses", value: "$4,200.00" },
      { label: "Total monthly savings", value: "$1,000.00" },
      { label: "Monthly surplus or deficit", value: "$800.00" },
      { label: "Savings rate", value: "16.67%" },
      { label: "Expense ratio", value: "70.00%" },
    ],
    interpretation: "For this illustrative scenario, the total monthly expenses is $4,200.00. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/mortgage-payoff-calculator/": {
    inputs: [
      { label: "Loan amount", value: "$350,000" },
      { label: "Annual interest rate (%)", value: "6.5%" },
      { label: "Loan term (years)", value: "30" },
      { label: "Extra monthly payment (optional)", value: "$100" },
    ],
    outputs: [
      { label: "Required monthly payment", value: "$2,212.24" },
      { label: "Total interest paid", value: "$383,778.66" },
      { label: "Total amount paid", value: "$733,778.66" },
      { label: "Time saved with extra payments", value: "3 years, 6 months" },
      { label: "Interest saved with extra payments", value: "$62,627.05" },
    ],
    interpretation: "For this illustrative scenario, the required monthly payment is $2,212.24. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/loan-payment-calculator/": {
    inputs: [
      { label: "Loan amount", value: "$25,000" },
      { label: "Annual interest rate (%)", value: "8%" },
      { label: "Loan term (years)", value: "5" },
      { label: "Extra monthly payment", value: "$100" },
    ],
    outputs: [
      { label: "Required monthly payment", value: "$506.91" },
      { label: "Total interest paid", value: "$4,325.29" },
      { label: "Total amount paid", value: "$29,325.29" },
      { label: "Payoff time with extra payment", value: "4 years, 1 month" },
      { label: "Interest saved with extra payment", value: "$1,089.30" },
    ],
    interpretation: "With these example payments and rates, the payoff time with extra payment is 4 years, 1 month. Actual payoff timing can change with fees, rate changes, missed payments, or additional charges.",
  },
  "/calculators/debt-payoff-calculator/": {
    inputs: [
      { label: "Debt balance", value: "$15,000" },
      { label: "Annual interest rate (%)", value: "18%" },
      { label: "Monthly payment", value: "$400" },
      { label: "Extra monthly payment", value: "$100" },
    ],
    outputs: [
      { label: "Payoff time", value: "3 years, 5 months" },
      { label: "Total interest paid", value: "$5,077.47" },
      { label: "Total amount paid", value: "$20,077.47" },
      { label: "Interest saved from extra payment", value: "$2,132.96" },
    ],
    interpretation: "With these example payments and rates, the payoff time is 3 years, 5 months. Actual payoff timing can change with fees, rate changes, missed payments, or additional charges.",
  },
  "/calculators/debt-snowball-calculator/": {
    inputs: [
      { label: "Debt 1 balance", value: "$1,500" },
      { label: "Debt 1 minimum monthly payment", value: "$75" },
      { label: "Debt 2 balance", value: "$5,000" },
      { label: "Debt 2 minimum monthly payment", value: "$150" },
      { label: "Debt 3 balance", value: "$10,000" },
      { label: "Debt 3 minimum monthly payment", value: "$250" },
      { label: "Extra monthly payment", value: "$100" },
    ],
    outputs: [
      { label: "Total debt", value: "$16,500.00" },
      { label: "Total minimum payments", value: "$475.00" },
      { label: "Estimated payoff time", value: "2 years, 5 months" },
      { label: "Suggested payoff order", value: "Debt 1 -> Debt 2 -> Debt 3" },
    ],
    interpretation: "With these example payments and rates, the estimated payoff time is 2 years, 5 months. Actual payoff timing can change with fees, rate changes, missed payments, or additional charges.",
  },
  "/calculators/debt-avalanche-calculator/": {
    inputs: [
      { label: "Debt 1 balance", value: "$3,000" },
      { label: "Debt 1 interest rate (%)", value: "24%" },
      { label: "Debt 1 minimum monthly payment", value: "$100" },
      { label: "Debt 2 balance", value: "$8,000" },
      { label: "Debt 2 interest rate (%)", value: "12%" },
      { label: "Debt 2 minimum monthly payment", value: "$200" },
      { label: "Debt 3 balance", value: "$15,000" },
      { label: "Debt 3 interest rate (%)", value: "6%" },
      { label: "Debt 3 minimum monthly payment", value: "$300" },
      { label: "Extra monthly payment", value: "$100" },
    ],
    outputs: [
      { label: "Total debt", value: "$26,000.00" },
      { label: "Total minimum payments", value: "$600.00" },
      { label: "Estimated payoff time", value: "3 years, 8 months" },
      { label: "Suggested payoff order", value: "Debt 1 -> Debt 2 -> Debt 3" },
      { label: "Highest interest debt to attack first", value: "Debt 1" },
    ],
    interpretation: "With these example payments and rates, the estimated payoff time is 3 years, 8 months. Actual payoff timing can change with fees, rate changes, missed payments, or additional charges.",
  },
  "/calculators/credit-card-interest-calculator/": {
    inputs: [
      { label: "Credit card balance", value: "$5,000" },
      { label: "APR (%)", value: "24%" },
      { label: "Monthly payment", value: "$200" },
      { label: "Extra monthly payment", value: "$100" },
    ],
    outputs: [
      { label: "Payoff time", value: "1 year, 9 months" },
      { label: "Total interest paid", value: "$1,143.34" },
      { label: "Total amount paid", value: "$6,143.34" },
      { label: "Interest saved with extra payment", value: "$857.23" },
    ],
    interpretation: "With these example payments and rates, the payoff time is 1 year, 9 months. Actual payoff timing can change with fees, rate changes, missed payments, or additional charges.",
  },
  "/calculators/auto-loan-calculator/": {
    inputs: [
      { label: "Vehicle price", value: "$35,000" },
      { label: "Down payment", value: "$5,000" },
      { label: "Trade-in value", value: "$3,000" },
      { label: "Sales tax rate (%)", value: "7%" },
      { label: "Loan term (years)", value: "5" },
      { label: "Annual interest rate (%)", value: "6.5%" },
    ],
    outputs: [
      { label: "Loan amount", value: "$29,450.00" },
      { label: "Monthly payment", value: "$576.22" },
      { label: "Total interest paid", value: "$5,123.38" },
      { label: "Total cost of loan", value: "$34,573.38" },
    ],
    interpretation: "For this illustrative scenario, the loan amount is $29,450.00. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/refinance-calculator/": {
    inputs: [
      { label: "Current loan balance", value: "$300,000" },
      { label: "Current annual interest rate (%)", value: "7%" },
      { label: "Current remaining loan term (years)", value: "25" },
      { label: "New annual interest rate (%)", value: "5.5%" },
      { label: "New loan term (years)", value: "20" },
      { label: "Closing costs / refinance fees", value: "$6,000" },
    ],
    outputs: [
      { label: "Current monthly payment", value: "$2,120.34" },
      { label: "New monthly payment", value: "$2,063.66" },
      { label: "Monthly savings", value: "$56.68" },
      { label: "Break-even time", value: "8 years, 10 months" },
      { label: "Total interest saved", value: "$134,822.42" },
    ],
    interpretation: "For this illustrative scenario, the current monthly payment is $2,120.34. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/student-loan-calculator/": {
    inputs: [
      { label: "Student loan balance", value: "$40,000" },
      { label: "Annual interest rate (%)", value: "6.5%" },
      { label: "Loan term (years)", value: "10" },
      { label: "Monthly extra payment", value: "$100" },
    ],
    outputs: [
      { label: "Required monthly payment", value: "$454.19" },
      { label: "Total interest paid", value: "$10,871.23" },
      { label: "Total amount paid", value: "$50,871.23" },
      { label: "Payoff time with extra payment", value: "7 years, 8 months" },
      { label: "Interest saved with extra payment", value: "$3,631.80" },
    ],
    interpretation: "With these example payments and rates, the payoff time with extra payment is 7 years, 8 months. Actual payoff timing can change with fees, rate changes, missed payments, or additional charges.",
  },
  "/calculators/student-loan-payoff-calculator/": {
    inputs: [
      { label: "Student loan balance", value: "$40,000" },
      { label: "Annual interest rate (%)", value: "6.5%" },
      { label: "Current monthly payment", value: "$500" },
      { label: "Extra monthly payment", value: "$100" },
    ],
    outputs: [
      { label: "Payoff time", value: "6 years, 11 months" },
      { label: "Total interest paid", value: "$9,761.74" },
      { label: "Total amount paid", value: "$49,761.74" },
      { label: "Interest saved with extra payment", value: "$2,809.59" },
    ],
    interpretation: "With these example payments and rates, the payoff time is 6 years, 11 months. Actual payoff timing can change with fees, rate changes, missed payments, or additional charges.",
  },
  "/calculators/heloc-calculator/": {
    inputs: [
      { label: "Home value", value: "$500,000" },
      { label: "Current mortgage balance", value: "$300,000" },
      { label: "Maximum combined loan-to-value ratio (%)", value: "85%" },
      { label: "HELOC amount requested", value: "$75,000" },
      { label: "Annual interest rate (%)", value: "8.5%" },
      { label: "Draw period interest-only years", value: "10" },
    ],
    outputs: [
      { label: "Maximum available HELOC", value: "$125,000.00" },
      { label: "Available equity", value: "$200,000.00" },
      { label: "Interest-only monthly payment", value: "$531.25" },
      { label: "Approval buffer or shortfall", value: "$50,000.00" },
    ],
    interpretation: "For this illustrative scenario, the maximum available heloc is $125,000.00. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/rent-vs-buy-calculator/": {
    inputs: [
      { label: "Monthly rent", value: "$2,500" },
      { label: "Home purchase price", value: "$500,000" },
      { label: "Down payment", value: "$100,000" },
      { label: "Mortgage interest rate (%)", value: "6.5%" },
      { label: "Loan term (years)", value: "30" },
      { label: "Property tax rate (%)", value: "1.2%" },
      { label: "Home insurance per year", value: "$2,000" },
      { label: "HOA per month", value: "$0" },
      { label: "Maintenance rate (%)", value: "1%" },
      { label: "Expected home appreciation (%)", value: "3%" },
      { label: "Expected investment return (%)", value: "7%" },
      { label: "Number of years to compare", value: "10" },
    ],
    outputs: [
      { label: "Total cost of renting", value: "$300,000.00" },
      { label: "Total cost of buying", value: "$297,254.10" },
      { label: "Estimated home equity", value: "$332,853.68" },
      { label: "Rent vs buy difference", value: "$2,745.90 less to buy" },
      { label: "Better option under assumptions", value: "Buying" },
    ],
    interpretation: "Under these example assumptions, the better option under assumptions is Buying. This comparison illustrates the entered scenario and is not a guarantee that the same option will be better in practice.",
  },
  "/calculators/home-affordability-calculator/": {
    inputs: [
      { label: "Annual gross income", value: "$120,000" },
      { label: "Monthly debt payments", value: "$500" },
      { label: "Down payment", value: "$80,000" },
      { label: "Mortgage interest rate (%)", value: "6.5%" },
      { label: "Loan term (years)", value: "30" },
      { label: "Property tax rate (%)", value: "1.2%" },
      { label: "Home insurance per year", value: "$2,000" },
      { label: "HOA per month", value: "$0" },
      { label: "Maximum debt-to-income ratio (%)", value: "36%" },
    ],
    outputs: [
      { label: "Estimated affordable home price", value: "$469,763.42" },
      { label: "Estimated monthly mortgage payment", value: "$2,463.57" },
      { label: "Estimated total monthly housing cost", value: "$3,100.00" },
      { label: "Debt-to-income ratio", value: "36.00%" },
    ],
    interpretation: "For this illustrative scenario, the estimated affordable home price is $469,763.42. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
  "/calculators/down-payment-calculator/": {
    inputs: [
      { label: "Home purchase price", value: "$500,000" },
      { label: "Down payment percentage (%)", value: "20%" },
      { label: "Current savings", value: "$30,000" },
      { label: "Monthly savings contribution", value: "$1,500" },
      { label: "Expected annual savings return (%)", value: "4%" },
    ],
    outputs: [
      { label: "Target down payment amount", value: "$100,000.00" },
      { label: "Amount still needed", value: "$70,000.00" },
      { label: "Estimated months to reach target", value: "41 months" },
    ],
    interpretation: "With these illustrative inputs, the estimated months to reach target is 41 months. The timeline is an estimate based on the stated assumptions, not a prediction or guarantee.",
  },
  "/calculators/mortgage-recast-calculator/": {
    inputs: [
      { label: "Current mortgage balance", value: "$350,000" },
      { label: "Annual interest rate (%)", value: "6.5%" },
      { label: "Remaining loan term (years)", value: "25" },
      { label: "Lump sum recast payment", value: "$50,000" },
      { label: "Recast fee", value: "$250" },
    ],
    outputs: [
      { label: "Current monthly payment", value: "$2,363.23" },
      { label: "New monthly payment after recast", value: "$2,025.62" },
      { label: "Monthly payment reduction", value: "$337.60" },
      { label: "Total interest saved", value: "$51,031.07" },
    ],
    interpretation: "For this illustrative scenario, the current monthly payment is $2,363.23. Changing any input can materially change the result, so use the example as a walkthrough rather than a guarantee.",
  },
};
