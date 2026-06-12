export interface CalculatorOption {
  label: string;
  value: string;
}

export interface CalculatorInput {
  id: string;
  name: string;
  label: string;
  type: 'number' | 'select';
  value: string;
  min?: string;
  step?: string;
  prefix?: string;
  required?: boolean;
  wide?: boolean;
  options?: CalculatorOption[];
}

export interface CalculatorOutput {
  id: string;
  label: string;
  initialValue: string;
  primary?: boolean;
}

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CalculatorConfig {
  id: string;
  url: string;
  title: string;
  eyebrow: string;
  description: string;
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
  faq: CalculatorFaq[];
  relatedIds: string[];
}

export const calculatorConfigs: Record<string, CalculatorConfig> = {
  'compound-interest': {
    id: 'compound-interest',
    url: '/calculators/compound-interest/',
    title: 'Compound Interest Calculator',
    eyebrow: 'Financial calculator',
    description:
      'Compound interest is interest earned on both your original investment and the interest it has already accumulated. Use this calculator to estimate how your savings could grow over time.',
    inputs: [
      {
        id: 'principal',
        name: 'principal',
        label: 'Initial principal',
        type: 'number',
        value: '10000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-contribution',
        name: 'monthlyContribution',
        label: 'Monthly contribution',
        type: 'number',
        value: '500',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
      {
        id: 'interest-rate',
        name: 'interestRate',
        label: 'Annual interest rate (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '20',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'frequency',
        name: 'frequency',
        label: 'Compounding frequency',
        type: 'select',
        value: '12',
        wide: true,
        options: [
          { label: 'Monthly', value: '12' },
          { label: 'Quarterly', value: '4' },
          { label: 'Annually', value: '1' },
        ],
      },
    ],
    outputs: [
      {
        id: 'final-balance',
        label: 'Final balance',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-contributions',
        label: 'Total contributions',
        initialValue: '$0.00',
      },
      {
        id: 'total-interest',
        label: 'Total interest earned',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is compound interest?',
        answer:
          'Compound interest is calculated on your starting balance plus any interest previously earned, allowing growth to build on itself.',
      },
      {
        question: 'How often should interest be compounded?',
        answer:
          'More frequent compounding generally produces a slightly higher balance when the annual rate and all other inputs are the same.',
      },
      {
        question: 'How do monthly contributions affect growth?',
        answer:
          'Regular contributions increase the amount earning interest. Starting early gives each contribution more time to compound.',
      },
      {
        question: 'Does this calculator account for taxes or fees?',
        answer:
          'No. The estimate does not include investment fees, taxes, inflation, or changes in the interest rate.',
      },
      {
        question: 'Is the calculated return guaranteed?',
        answer:
          'No. This calculator provides an estimate based on a fixed annual rate. Actual investment returns can rise or fall over time.',
      },
    ],
    relatedIds: [
      'fire-calculator',
      'coast-fire-calculator',
      'inflation-calculator',
    ],
  },
  'savings-rate': {
    id: 'savings-rate',
    url: '/calculators/savings-rate/',
    title: 'Savings Rate Calculator',
    eyebrow: 'Financial Calculator',
    description:
      'Calculate what percentage of your income you save each month.',
    inputs: [
      {
        id: 'monthly-income',
        name: 'monthlyIncome',
        label: 'Monthly income',
        type: 'number',
        value: '5000',
        min: '0.01',
        step: '0.01',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-expenses',
        name: 'monthlyExpenses',
        label: 'Monthly expenses',
        type: 'number',
        value: '3500',
        min: '0',
        step: '0.01',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-savings',
        name: 'monthlySavings',
        label: 'Monthly savings (optional)',
        type: 'number',
        value: '',
        min: '0',
        step: '0.01',
        prefix: '$',
        wide: true,
      },
    ],
    outputs: [
      {
        id: 'monthly-savings-result',
        label: 'Monthly savings',
        initialValue: '$0.00',
      },
      {
        id: 'savings-rate-result',
        label: 'Savings rate',
        initialValue: '0.00%',
        primary: true,
      },
      {
        id: 'annual-savings-result',
        label: 'Annual savings',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is a savings rate?',
        answer:
          'Your savings rate is the percentage of your income that you save rather than spend during a given period.',
      },
      {
        question: 'Why does savings rate matter for FIRE?',
        answer:
          'A higher savings rate can shorten the time needed to reach financial independence because you invest more while learning to live on less.',
      },
      {
        question: 'Should I use gross or net income?',
        answer:
          'Net income usually gives the clearest view of your household budget because it reflects the money available after taxes and payroll deductions.',
      },
      {
        question: 'Which expenses should I include?',
        answer:
          'Include recurring bills, housing, food, transportation, discretionary spending, and other money that leaves your monthly budget.',
      },
      {
        question: 'What is a realistic savings rate target?',
        answer:
          'A realistic target depends on income, essential costs, debt, and goals. Many people begin near 10% to 20% and increase it gradually.',
      },
    ],
    relatedIds: [
      'compound-interest-calculator',
      'fire-calculator',
      'coast-fire-calculator',
    ],
  },
  fire: {
    id: 'fire',
    url: '/calculators/fire-calculator/',
    title: 'FIRE Calculator',
    eyebrow: 'Financial Calculator',
    description:
      'Estimate your financial independence number based on annual expenses and withdrawal rate.',
    inputs: [
      {
        id: 'annual-expenses',
        name: 'annualExpenses',
        label: 'Annual expenses',
        type: 'number',
        value: '48000',
        min: '0.01',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'withdrawal-rate',
        name: 'withdrawalRate',
        label: 'Withdrawal rate (%)',
        type: 'number',
        value: '4',
        min: '0.01',
        step: '0.01',
        required: true,
      },
      {
        id: 'current-assets',
        name: 'currentAssets',
        label: 'Current invested assets',
        type: 'number',
        value: '100000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-contribution',
        name: 'monthlyContribution',
        label: 'Monthly contribution',
        type: 'number',
        value: '1500',
        min: '0',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-return',
        name: 'expectedReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        wide: true,
        required: true,
      },
    ],
    outputs: [
      {
        id: 'fire-number-result',
        label: 'FIRE number',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'amount-needed-result',
        label: 'Amount still needed',
        initialValue: '$0.00',
      },
      {
        id: 'years-to-fire-result',
        label: 'Estimated years to FIRE',
        initialValue: '0 years',
      },
    ],
    faq: [
      {
        question: 'What is a FIRE number?',
        answer:
          'Your FIRE number is the invested portfolio value intended to support your annual expenses through regular withdrawals.',
      },
      {
        question: 'What is the 4% rule?',
        answer:
          'The 4% rule is a retirement planning guideline that starts withdrawals at 4% of a portfolio in the first year and adjusts them for inflation later.',
      },
      {
        question: 'Can I use a withdrawal rate other than 4%?',
        answer:
          'Yes. A lower withdrawal rate produces a larger FIRE number and may provide more flexibility, while a higher rate produces a smaller target with greater risk.',
      },
      {
        question: 'How does investing affect my FIRE timeline?',
        answer:
          'Investment growth and regular contributions can compound over time, potentially reducing the number of years needed to reach your target.',
      },
      {
        question: 'Is the estimated FIRE timeline guaranteed?',
        answer:
          'No. The estimate assumes a constant return and contribution. Actual market returns, inflation, expenses, taxes, and contribution changes will affect the timeline.',
      },
    ],
    relatedIds: [
      'compound-interest-calculator',
      'savings-rate-calculator',
      'coast-fire-calculator',
    ],
  },
  'coast-fire': {
    id: 'coast-fire',
    url: '/calculators/coast-fire-calculator/',
    title: 'Coast FIRE Calculator',
    eyebrow: 'Financial Calculator',
    description:
      'Estimate how much you need invested today to stop contributing and still reach financial independence by your target age.',
    inputs: [
      {
        id: 'current-age',
        name: 'currentAge',
        label: 'Current age',
        type: 'number',
        value: '30',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'retirement-age',
        name: 'retirementAge',
        label: 'Target retirement age',
        type: 'number',
        value: '60',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'annual-expenses',
        name: 'annualExpenses',
        label: 'Annual expenses in retirement',
        type: 'number',
        value: '48000',
        min: '0.01',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'withdrawal-rate',
        name: 'withdrawalRate',
        label: 'Withdrawal rate (%)',
        type: 'number',
        value: '4',
        min: '0.01',
        step: '0.01',
        required: true,
      },
      {
        id: 'expected-return',
        name: 'expectedReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'current-assets',
        name: 'currentAssets',
        label: 'Current invested assets',
        type: 'number',
        value: '100000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'fire-number-result',
        label: 'FIRE number',
        initialValue: '$0.00',
      },
      {
        id: 'coast-fire-number-result',
        label: 'Coast FIRE number',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'coast-fire-difference-result',
        label: 'Amount above or below Coast FIRE',
        initialValue: '$0.00',
      },
      {
        id: 'years-until-retirement-result',
        label: 'Years until retirement',
        initialValue: '0 years',
      },
    ],
    faq: [
      {
        question: 'What is Coast FIRE?',
        answer:
          'Coast FIRE is the point where your current investments could grow to your retirement target without additional contributions, assuming your return and timeline estimates hold.',
      },
      {
        question: 'How is my FIRE number calculated?',
        answer:
          'Your FIRE number divides estimated annual retirement expenses by your chosen withdrawal rate.',
      },
      {
        question: 'Why does compounding matter for Coast FIRE?',
        answer:
          'More years of compounding can reduce the amount needed today because investments have longer to grow before retirement.',
      },
      {
        question: 'How does the withdrawal rate affect Coast FIRE?',
        answer:
          'A lower withdrawal rate increases both your FIRE number and Coast FIRE number, while a higher rate reduces them but may increase retirement risk.',
      },
      {
        question: 'Are the investment assumptions guaranteed?',
        answer:
          'No. Actual returns vary, and inflation, taxes, fees, spending changes, and market conditions can materially affect the result.',
      },
    ],
    relatedIds: [
      'fire-calculator',
      'compound-interest-calculator',
      'savings-rate-calculator',
    ],
  },
  'four-percent-rule': {
    id: 'four-percent-rule',
    url: '/calculators/4-percent-rule-calculator/',
    title: '4% Rule Calculator',
    eyebrow: 'Retirement Calculator',
    description:
      'Estimate how much portfolio income a withdrawal rate can support and how large a portfolio you may need.',
    inputs: [
      {
        id: 'portfolio-value',
        name: 'portfolioValue',
        label: 'Portfolio value',
        type: 'number',
        value: '1000000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'withdrawal-rate',
        name: 'withdrawalRate',
        label: 'Withdrawal rate (%)',
        type: 'number',
        value: '4',
        min: '0.01',
        step: '0.01',
        required: true,
      },
      {
        id: 'annual-expenses',
        name: 'annualExpenses',
        label: 'Annual expenses',
        type: 'number',
        value: '40000',
        min: '0',
        step: '100',
        prefix: '$',
      },
      {
        id: 'monthly-expenses',
        name: 'monthlyExpenses',
        label: 'Monthly expenses',
        type: 'number',
        value: '',
        min: '0',
        step: '10',
        prefix: '$',
      },
    ],
    outputs: [
      {
        id: 'safe-annual-withdrawal-result',
        label: 'Safe annual withdrawal',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'safe-monthly-withdrawal-result',
        label: 'Safe monthly withdrawal',
        initialValue: '$0.00',
      },
      {
        id: 'required-portfolio-result',
        label: 'Required portfolio',
        initialValue: '$0.00',
      },
      {
        id: 'portfolio-gap-result',
        label: 'Portfolio surplus or gap',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is the 4% rule?',
        answer:
          'The 4% rule is a retirement planning guideline that begins with a withdrawal equal to 4% of a portfolio in the first retirement year.',
      },
      {
        question: 'Can I choose a different withdrawal rate?',
        answer:
          'Yes. Lower rates generally require a larger portfolio and may provide more flexibility, while higher rates increase withdrawal risk.',
      },
      {
        question: 'Which retirement spending amount should I enter?',
        answer:
          'Use a realistic estimate that includes housing, healthcare, food, travel, taxes, and other expected retirement expenses.',
      },
      {
        question: 'Does the 4% rule account for inflation?',
        answer:
          'The original guideline assumes later withdrawals rise with inflation, but this calculator only estimates the first-year withdrawal and portfolio target.',
      },
      {
        question: 'How is this calculator useful for FIRE planning?',
        answer:
          'It compares portfolio income with planned spending and estimates the portfolio size associated with your chosen withdrawal rate.',
      },
    ],
    relatedIds: [
      'fire-calculator',
      'coast-fire-calculator',
      'compound-interest-calculator',
    ],
  },
  'retirement-withdrawal': {
    id: 'retirement-withdrawal',
    url: '/calculators/retirement-withdrawal-calculator/',
    title: 'Retirement Withdrawal Calculator',
    eyebrow: 'Retirement Calculator',
    description:
      'Estimate annual, monthly, and daily retirement withdrawals based on your portfolio and chosen withdrawal rate.',
    inputs: [
      {
        id: 'portfolio-value',
        name: 'portfolioValue',
        label: 'Portfolio value',
        type: 'number',
        value: '1000000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'withdrawal-rate',
        name: 'withdrawalRate',
        label: 'Withdrawal rate (%)',
        type: 'number',
        value: '4',
        min: '0.01',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'annual-withdrawal-result',
        label: 'Annual withdrawal',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'monthly-withdrawal-result',
        label: 'Monthly withdrawal',
        initialValue: '$0.00',
      },
      {
        id: 'daily-withdrawal-result',
        label: 'Daily withdrawal',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is a safe withdrawal rate?',
        answer:
          'A safe withdrawal rate is an estimated percentage of a portfolio that may be withdrawn each year while trying to preserve assets throughout retirement.',
      },
      {
        question: 'How does the 4% rule work?',
        answer:
          'The 4% rule starts with a first-year withdrawal equal to 4% of the portfolio, then generally assumes future withdrawals adjust for inflation.',
      },
      {
        question: 'How should inflation affect retirement withdrawals?',
        answer:
          'Inflation reduces purchasing power, so retirement plans often increase withdrawals over time and account for rising living and healthcare costs.',
      },
      {
        question: 'What is sequence of returns risk?',
        answer:
          'Sequence of returns risk is the danger that poor investment returns early in retirement, combined with withdrawals, can reduce how long a portfolio lasts.',
      },
      {
        question: 'How should I use this estimate in retirement planning?',
        answer:
          'Use it as a starting point alongside taxes, fees, Social Security, pensions, spending flexibility, asset allocation, and professional guidance.',
      },
    ],
    relatedIds: [
      'fire-calculator',
      'coast-fire-calculator',
      'four-percent-rule-calculator',
    ],
  },
  'rule-of-72': {
    id: 'rule-of-72',
    url: '/calculators/rule-of-72-calculator/',
    title: 'Rule of 72 Calculator',
    eyebrow: 'Financial Calculator',
    description:
      'Estimate how long it takes money to double at a given annual return.',
    inputs: [
      {
        id: 'annual-return',
        name: 'annualReturn',
        label: 'Annual return (%)',
        type: 'number',
        value: '8',
        min: '0.01',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'years-to-double-result',
        label: 'Estimated years to double',
        initialValue: '0 years',
        primary: true,
      },
      {
        id: 'doubling-date-result',
        label: 'Approximate doubling date if starting today',
        initialValue: 'Not calculated',
      },
    ],
    faq: [
      {
        question: 'What is the Rule of 72?',
        answer:
          'The Rule of 72 is a shortcut for estimating how many years an investment may take to double by dividing 72 by its annual return percentage.',
      },
      {
        question: 'Does the Rule of 72 assume compound growth?',
        answer:
          'Yes. It approximates compound growth and is generally more useful for rates in a typical investing range than for extremely high or low rates.',
      },
      {
        question: 'Can I use the Rule of 72 for investment returns?',
        answer:
          'Yes, but the result assumes a steady annual return. Real investments fluctuate and may take more or less time to double.',
      },
      {
        question: 'Can the Rule of 72 estimate inflation effects?',
        answer:
          'Yes. Dividing 72 by an inflation rate estimates how long it could take prices to double if that inflation rate remains constant.',
      },
      {
        question: 'What are the limitations of the Rule of 72?',
        answer:
          'It is an approximation that ignores taxes, fees, changing rates, contributions, withdrawals, and uneven investment returns.',
      },
    ],
    relatedIds: [
      'compound-interest-calculator',
      'fire-calculator',
      'coast-fire-calculator',
    ],
  },
  inflation: {
    id: 'inflation',
    url: '/calculators/inflation-calculator/',
    title: 'Inflation Calculator',
    eyebrow: 'Financial Calculator',
    description:
      'Estimate how inflation reduces the future purchasing power of money over time.',
    inputs: [
      {
        id: 'starting-amount',
        name: 'startingAmount',
        label: 'Starting amount',
        type: 'number',
        value: '100000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'inflation-rate',
        name: 'inflationRate',
        label: 'Inflation rate (%)',
        type: 'number',
        value: '3',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '20',
        min: '0',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'future-purchasing-power-result',
        label: 'Future purchasing power',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'purchasing-power-lost-result',
        label: 'Total purchasing power lost',
        initialValue: '$0.00',
      },
      {
        id: 'inflation-multiplier-result',
        label: 'Inflation multiplier',
        initialValue: '1.00x',
      },
    ],
    faq: [
      {
        question: 'What does future purchasing power mean?',
        answer:
          'Future purchasing power estimates what a fixed amount of money will be able to buy after inflation, expressed in today’s dollars.',
      },
      {
        question: 'How is the inflation multiplier calculated?',
        answer:
          'The calculator compounds the annual inflation rate over the selected number of years. A 1.50x multiplier means prices are estimated to be 50% higher.',
      },
      {
        question: 'Does inflation stay constant over time?',
        answer:
          'No. Actual inflation changes from year to year. This calculator uses a constant rate to provide a planning estimate.',
      },
      {
        question: 'How can investments help offset inflation?',
        answer:
          'Investments that grow faster than inflation may help preserve or increase purchasing power, although returns are never guaranteed.',
      },
      {
        question: 'Why is inflation important for retirement planning?',
        answer:
          'Even moderate inflation can materially increase future expenses, so long-term savings and retirement targets should account for reduced purchasing power.',
      },
    ],
    relatedIds: [
      'compound-interest-calculator',
      'fire-calculator',
      'coast-fire-calculator',
    ],
  },
};

export const compoundInterestCalculator = calculatorConfigs['compound-interest'];
export const savingsRateCalculator = calculatorConfigs['savings-rate'];
export const fireCalculator = calculatorConfigs.fire;
export const coastFireCalculator = calculatorConfigs['coast-fire'];
export const fourPercentRuleCalculator =
  calculatorConfigs['four-percent-rule'];
export const retirementWithdrawalCalculator =
  calculatorConfigs['retirement-withdrawal'];
export const ruleOf72Calculator = calculatorConfigs['rule-of-72'];
export const inflationCalculator = calculatorConfigs.inflation;
