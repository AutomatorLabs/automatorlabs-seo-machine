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
};

export const compoundInterestCalculator = calculatorConfigs['compound-interest'];
export const savingsRateCalculator = calculatorConfigs['savings-rate'];
export const fireCalculator = calculatorConfigs.fire;
export const coastFireCalculator = calculatorConfigs['coast-fire'];
export const fourPercentRuleCalculator =
  calculatorConfigs['four-percent-rule'];
