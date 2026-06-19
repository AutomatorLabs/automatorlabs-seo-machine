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

export interface CalculatorResultExplanation {
  outputId: string;
  label: string;
  explanation: string;
}

export interface CalculatorConfig {
  id: string;
  url: string;
  title: string;
  eyebrow: string;
  description: string;
  chart?: boolean;
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
  faq: CalculatorFaq[];
  relatedIds: string[];
  howToSteps?: string[];
  resultExplanation?: CalculatorResultExplanation[];
  commonMistakes?: string[];
}

function compoundGrowthVariant({
  id,
  url,
  title,
  description,
  principalLabel,
  contributionLabel,
}: {
  id: string;
  url: string;
  title: string;
  description: string;
  principalLabel: string;
  contributionLabel: string;
}): CalculatorConfig {
  return {
    id,
    url,
    title,
    eyebrow: 'Compound Interest Calculator',
    description,
    inputs: [
      {
        id: 'principal',
        name: 'principal',
        label: principalLabel,
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
        label: contributionLabel,
        type: 'number',
        value: '250',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
      {
        id: 'interest-rate',
        name: 'interestRate',
        label: 'Annual interest or return rate (%)',
        type: 'number',
        value: '6',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '10',
        min: '0.25',
        step: '0.25',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'final-balance',
        label: 'Estimated ending balance',
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
        label: 'Estimated interest or growth',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: `What does this ${title.toLowerCase()} estimate?`,
        answer:
          'It projects an ending balance from the starting amount, monthly additions, annual rate, time period, and the compounding frequency fixed for this calculator.',
      },
      {
        question: `When does the ${title} assume contributions are added?`,
        answer:
          'Monthly contributions are converted into an equivalent amount for each compounding period and are treated as end-of-period additions.',
      },
      {
        question: `Is the annual rate used by the ${title} guaranteed?`,
        answer:
          'No. It is a constant scenario assumption. Investment returns and variable savings rates can change, and actual results may be higher or lower.',
      },
      {
        question: `Does the ${title} include taxes, inflation, or fees?`,
        answer:
          'No. The projection is nominal and excludes taxes, inflation, account fees, transaction costs, and withdrawals.',
      },
      {
        question: `How does compounding frequency affect the ${title}?`,
        answer:
          'More frequent compounding adds interest to the balance sooner, allowing that interest to participate in later growth when the nominal annual rate is positive.',
      },
    ],
    relatedIds: [
      'compound-interest-calculator',
      'rule-of-72-calculator',
      'cagr-calculator',
      'savings-goal-calculator',
      'apy-calculator',
    ],
  };
}

export const calculatorConfigs: Record<string, CalculatorConfig> = {
  'daily-compound-interest': compoundGrowthVariant({
    id: 'daily-compound-interest',
    url: '/calculators/daily-compound-interest-calculator/',
    title: 'Daily Compound Interest Calculator',
    description:
      'Estimate how a starting balance and monthly contributions could grow when a nominal annual rate compounds daily.',
    principalLabel: 'Starting balance',
    contributionLabel: 'Monthly contribution',
  }),
  'monthly-compound-interest': compoundGrowthVariant({
    id: 'monthly-compound-interest',
    url: '/calculators/monthly-compound-interest-calculator/',
    title: 'Monthly Compound Interest Calculator',
    description:
      'Project compound growth with monthly compounding, a starting balance, regular additions, an annual rate, and time.',
    principalLabel: 'Starting balance',
    contributionLabel: 'Monthly contribution',
  }),
  'quarterly-compound-interest': compoundGrowthVariant({
    id: 'quarterly-compound-interest',
    url: '/calculators/quarterly-compound-interest-calculator/',
    title: 'Quarterly Compound Interest Calculator',
    description:
      'Estimate future value when interest compounds four times per year and regular monthly contributions are included.',
    principalLabel: 'Starting balance',
    contributionLabel: 'Monthly contribution',
  }),
  'annual-compound-interest': compoundGrowthVariant({
    id: 'annual-compound-interest',
    url: '/calculators/annual-compound-interest-calculator/',
    title: 'Annual Compound Interest Calculator',
    description:
      'Estimate future value when interest compounds once per year using a starting balance, contributions, rate, and time.',
    principalLabel: 'Starting balance',
    contributionLabel: 'Monthly contribution',
  }),
  'investment-growth': compoundGrowthVariant({
    id: 'investment-growth',
    url: '/calculators/investment-growth-calculator/',
    title: 'Investment Growth Calculator',
    description:
      'Project how an investment could grow from an initial amount, monthly investments, an assumed annual return, and time.',
    principalLabel: 'Initial investment',
    contributionLabel: 'Monthly investment',
  }),
  'savings-growth': compoundGrowthVariant({
    id: 'savings-growth',
    url: '/calculators/savings-growth-calculator/',
    title: 'Savings Growth Calculator',
    description:
      'Estimate how savings could grow from a current balance, monthly deposits, an annual interest rate, and time.',
    principalLabel: 'Current savings',
    contributionLabel: 'Monthly deposit',
  }),
  apy: {
    id: 'apy',
    url: '/calculators/apy-calculator/',
    title: 'APY Calculator',
    eyebrow: 'Interest Rate Calculator',
    description:
      'Convert a nominal annual interest rate and compounding frequency into annual percentage yield and estimated one-year interest.',
    inputs: [
      {
        id: 'nominal-rate',
        name: 'nominalRate',
        label: 'Nominal annual rate (%)',
        type: 'number',
        value: '5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'compounding-frequency',
        name: 'frequency',
        label: 'Compounding frequency',
        type: 'select',
        value: '12',
        required: true,
        options: [
          { label: 'Daily (365 times per year)', value: '365' },
          { label: 'Monthly (12 times per year)', value: '12' },
          { label: 'Quarterly (4 times per year)', value: '4' },
          { label: 'Annually (1 time per year)', value: '1' },
        ],
      },
      {
        id: 'starting-balance',
        name: 'startingBalance',
        label: 'Starting balance',
        type: 'number',
        value: '10000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'apy-result',
        label: 'Annual percentage yield',
        initialValue: '0.00%',
        primary: true,
      },
      {
        id: 'effective-balance-result',
        label: 'Balance after one year',
        initialValue: '$0.00',
      },
      {
        id: 'annual-interest-result',
        label: 'Interest earned in one year',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is APY?',
        answer:
          'Annual percentage yield is the effective one-year rate after accounting for compounding within the year.',
      },
      {
        question: 'How is APY different from APR?',
        answer:
          'APY includes the effect of compounding. A nominal APR or stated annual rate generally does not fully express that within-year compounding effect.',
      },
      {
        question: 'Why is APY higher with more frequent compounding?',
        answer:
          'Interest is added to the balance sooner, so earlier interest can earn additional interest during later periods.',
      },
      {
        question: 'Is APY the same as an investment return?',
        answer:
          'No. APY commonly describes deposit interest under stated terms. Market investment returns vary and can include losses.',
      },
      {
        question: 'Does APY include account fees or taxes?',
        answer:
          'Not in this calculator. Fees, taxes, balance tiers, changing rates, and withdrawal restrictions can change the amount retained.',
      },
    ],
    relatedIds: [
      'compound-interest-calculator',
      'rule-of-72-calculator',
      'cagr-calculator',
      'daily-compound-interest-calculator',
      'monthly-compound-interest-calculator',
    ],
  },
  'compound-interest': {
    id: 'compound-interest',
    url: '/calculators/compound-interest/',
    title: 'Compound Interest Calculator',
    eyebrow: 'Financial calculator',
    description:
      'Compound interest is interest earned on both your original investment and the interest it has already accumulated. Use this calculator to estimate how your savings could grow over time.',
    chart: true,
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
      'daily-compound-interest-calculator',
      'monthly-compound-interest-calculator',
      'apy-calculator',
      'rule-of-72-calculator',
      'cagr-calculator',
      'savings-goal-calculator',
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
    chart: true,
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
      'investment-growth-calculator',
      'apy-calculator',
      'cagr-calculator',
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
  'expense-ratio': {
    id: 'expense-ratio',
    url: '/calculators/expense-ratio-calculator/',
    title: 'Expense Ratio Calculator',
    eyebrow: 'Investment Calculator',
    description:
      'Estimate how investment expense ratios can reduce long-term portfolio growth.',
    inputs: [
      {
        id: 'investment-amount',
        name: 'investmentAmount',
        label: 'Investment amount',
        type: 'number',
        value: '100000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'expense-ratio',
        name: 'expenseRatio',
        label: 'Expense ratio (%)',
        type: 'number',
        value: '0.5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '30',
        min: '1',
        step: '1',
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
    ],
    outputs: [
      {
        id: 'total-fees-paid-result',
        label: 'Total fees paid',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'ending-balance-after-fees-result',
        label: 'Ending balance after fees',
        initialValue: '$0.00',
      },
      {
        id: 'ending-balance-without-fees-result',
        label: 'Ending balance without fees',
        initialValue: '$0.00',
      },
      {
        id: 'fee-difference-result',
        label: 'Difference caused by fees',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is an expense ratio?',
        answer:
          'An expense ratio is the annual percentage of fund assets used to cover management and operating costs.',
      },
      {
        question: 'How do expense ratios reduce investment returns?',
        answer:
          'The fee lowers the return retained by the investor each year, and the lost amount also misses future compound growth.',
      },
      {
        question: 'Is a lower expense ratio always better?',
        answer:
          'Lower costs generally leave more return for investors, but fees should be considered alongside strategy, diversification, risk, and fund quality.',
      },
      {
        question: 'Does this estimate include contributions or taxes?',
        answer:
          'No. This calculator models one starting investment with a constant return and expense ratio, without taxes, deposits, withdrawals, or trading costs.',
      },
      {
        question: 'Are investment returns and fees constant?',
        answer:
          'Not necessarily. Market returns vary and funds can change fees, so this result is a planning estimate rather than a guarantee.',
      },
    ],
    relatedIds: [
      'compound-interest-calculator',
      'inflation-calculator',
      'fire-calculator',
    ],
  },
  'investment-fee': {
    id: 'investment-fee',
    url: '/calculators/investment-fee-calculator/',
    title: 'Investment Fee Calculator',
    eyebrow: 'Investment Calculator',
    description:
      'Estimate how annual investment fees can reduce a growing portfolio with regular monthly contributions.',
    chart: true,
    inputs: [
      {
        id: 'starting-investment',
        name: 'startingInvestment',
        label: 'Starting investment',
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
        value: '500',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-fee',
        name: 'annualFee',
        label: 'Annual fee (%)',
        type: 'number',
        value: '0.5',
        min: '0',
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
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '30',
        min: '1',
        step: '1',
        wide: true,
        required: true,
      },
    ],
    outputs: [
      {
        id: 'ending-balance-before-fees-result',
        label: 'Ending balance before fees',
        initialValue: '$0.00',
      },
      {
        id: 'ending-balance-after-fees-result',
        label: 'Ending balance after fees',
        initialValue: '$0.00',
      },
      {
        id: 'total-cost-of-fees-result',
        label: 'Total cost of fees',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'fee-drag-percentage-result',
        label: 'Fee drag percentage',
        initialValue: '0.00%',
      },
    ],
    faq: [
      {
        question: 'What is the total cost of investment fees?',
        answer:
          'The total cost includes both fees deducted from the portfolio and the compound growth those deducted dollars could have earned.',
      },
      {
        question: 'How are monthly contributions handled?',
        answer:
          'The calculator assumes contributions are made at the end of each month and grow at a monthly-compounded return.',
      },
      {
        question: 'What does fee drag percentage mean?',
        answer:
          'Fee drag is the percentage of the projected no-fee ending balance lost because of annual investment fees.',
      },
      {
        question: 'Can a small annual fee make a large difference?',
        answer:
          'Yes. Even a modest annual fee can create a meaningful long-term difference because its effect compounds over many years.',
      },
      {
        question: 'Does this calculator include taxes or trading costs?',
        answer:
          'No. It assumes constant returns, fees, and contributions and does not include taxes, trading costs, withdrawals, or changing market performance.',
      },
    ],
    relatedIds: [
      'expense-ratio-calculator',
      'compound-interest-calculator',
      'fire-calculator',
    ],
  },
  'net-worth': {
    id: 'net-worth',
    url: '/calculators/net-worth-calculator/',
    title: 'Net Worth Calculator',
    eyebrow: 'Financial Calculator',
    description:
      'Calculate your net worth by comparing the total value of your assets with your outstanding liabilities.',
    inputs: [
      {
        id: 'cash',
        name: 'cash',
        label: 'Cash',
        type: 'number',
        value: '',
        min: '0',
        step: '100',
        prefix: '$',
      },
      {
        id: 'investments',
        name: 'investments',
        label: 'Investments',
        type: 'number',
        value: '',
        min: '0',
        step: '100',
        prefix: '$',
      },
      {
        id: 'real-estate',
        name: 'realEstate',
        label: 'Real estate',
        type: 'number',
        value: '',
        min: '0',
        step: '100',
        prefix: '$',
      },
      {
        id: 'crypto',
        name: 'crypto',
        label: 'Crypto',
        type: 'number',
        value: '',
        min: '0',
        step: '100',
        prefix: '$',
      },
      {
        id: 'other-assets',
        name: 'otherAssets',
        label: 'Other assets',
        type: 'number',
        value: '',
        min: '0',
        step: '100',
        prefix: '$',
      },
      {
        id: 'credit-card-debt',
        name: 'creditCardDebt',
        label: 'Credit card debt',
        type: 'number',
        value: '',
        min: '0',
        step: '100',
        prefix: '$',
      },
      {
        id: 'loans',
        name: 'loans',
        label: 'Loans',
        type: 'number',
        value: '',
        min: '0',
        step: '100',
        prefix: '$',
      },
      {
        id: 'mortgage',
        name: 'mortgage',
        label: 'Mortgage',
        type: 'number',
        value: '',
        min: '0',
        step: '100',
        prefix: '$',
      },
      {
        id: 'other-liabilities',
        name: 'otherLiabilities',
        label: 'Other liabilities',
        type: 'number',
        value: '',
        min: '0',
        step: '100',
        prefix: '$',
        wide: true,
      },
    ],
    outputs: [
      {
        id: 'total-assets-result',
        label: 'Total assets',
        initialValue: '$0.00',
      },
      {
        id: 'total-liabilities-result',
        label: 'Total liabilities',
        initialValue: '$0.00',
      },
      {
        id: 'net-worth-result',
        label: 'Net worth',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'debt-to-asset-ratio-result',
        label: 'Debt-to-asset ratio',
        initialValue: '0.00%',
      },
    ],
    faq: [
      {
        question: 'What is net worth?',
        answer:
          'Net worth is the value of everything you own minus everything you owe. It provides a broad snapshot of your financial position.',
      },
      {
        question: 'What should I include as an asset?',
        answer:
          'Common assets include cash, investment accounts, real estate equity, retirement accounts, crypto, vehicles, and other property with meaningful resale value.',
      },
      {
        question: 'Which debts count as liabilities?',
        answer:
          'Include outstanding credit card balances, personal and student loans, mortgages, auto loans, taxes owed, and other amounts you are responsible for repaying.',
      },
      {
        question: 'What does the debt-to-asset ratio show?',
        answer:
          'It shows what percentage of your assets would be offset by liabilities. A lower ratio generally indicates less debt relative to the assets you own.',
      },
      {
        question: 'How often should I calculate my net worth?',
        answer:
          'Reviewing it monthly, quarterly, or annually can help you track progress. Use consistent valuations so changes reflect real financial movement.',
      },
    ],
    relatedIds: [
      'savings-rate-calculator',
      'fire-calculator',
      'investment-fee-calculator',
    ],
  },
  cagr: {
    id: 'cagr',
    url: '/calculators/cagr-calculator/',
    title: 'CAGR Calculator',
    eyebrow: 'Investment Calculator',
    description:
      'Calculate the compound annual growth rate of an investment or asset over a specified number of years.',
    inputs: [
      {
        id: 'starting-value',
        name: 'startingValue',
        label: 'Starting value',
        type: 'number',
        value: '10000',
        min: '0.01',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'ending-value',
        name: 'endingValue',
        label: 'Ending value',
        type: 'number',
        value: '20000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '10',
        min: '0.01',
        step: '0.01',
        wide: true,
        required: true,
      },
    ],
    outputs: [
      {
        id: 'cagr-result',
        label: 'CAGR',
        initialValue: '0.00%',
        primary: true,
      },
      {
        id: 'total-growth-result',
        label: 'Total growth',
        initialValue: '$0.00',
      },
      {
        id: 'growth-multiple-result',
        label: 'Growth multiple',
        initialValue: '0.00x',
      },
    ],
    faq: [
      {
        question: 'What does CAGR mean?',
        answer:
          'CAGR stands for compound annual growth rate. It represents the constant annual rate that would turn a starting value into an ending value over a given period.',
      },
      {
        question: 'How is CAGR different from total return?',
        answer:
          'Total return measures the full change between the starting and ending values, while CAGR converts that change into an annualized compound rate.',
      },
      {
        question: 'Does CAGR reflect investment volatility?',
        answer:
          'No. CAGR smooths growth into one annual rate and does not show the gains, losses, or volatility that occurred during individual years.',
      },
      {
        question: 'Can CAGR be negative?',
        answer:
          'Yes. CAGR is negative when the ending value is lower than the starting value. An ending value of zero produces a CAGR of negative 100%.',
      },
      {
        question: 'Can I use CAGR to compare investments?',
        answer:
          'CAGR can help compare annualized growth over equal or different time periods, but risk, fees, cash flows, taxes, and volatility should also be considered.',
      },
    ],
    relatedIds: [
      'compound-interest-calculator',
      'investment-fee-calculator',
      'inflation-calculator',
    ],
  },
  'etf-fee-drag': {
    id: 'etf-fee-drag',
    url: '/calculators/etf-fee-drag-calculator/',
    title: 'ETF Fee Drag Calculator',
    eyebrow: 'Investment Calculator',
    description:
      'Compare how two ETF expense ratios can affect long-term investment growth and the ending value of regular contributions.',
    inputs: [
      {
        id: 'investment-amount',
        name: 'investmentAmount',
        label: 'Investment amount',
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
        value: '500',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
      {
        id: 'etf-a-expense-ratio',
        name: 'etfAExpenseRatio',
        label: 'ETF A expense ratio (%)',
        type: 'number',
        value: '0.03',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'etf-b-expense-ratio',
        name: 'etfBExpenseRatio',
        label: 'ETF B expense ratio (%)',
        type: 'number',
        value: '0.75',
        min: '0',
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
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '30',
        min: '0.01',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'etf-a-ending-balance-result',
        label: 'ETF A ending balance',
        initialValue: '$0.00',
      },
      {
        id: 'etf-b-ending-balance-result',
        label: 'ETF B ending balance',
        initialValue: '$0.00',
      },
      {
        id: 'difference-between-etfs-result',
        label: 'Difference between ETFs',
        initialValue: '$0.00',
      },
      {
        id: 'higher-cost-etf-drag-result',
        label: 'Higher-cost ETF drag',
        initialValue: '$0.00',
        primary: true,
      },
    ],
    faq: [
      {
        question: 'What is ETF fee drag?',
        answer:
          'ETF fee drag is the reduction in long-term portfolio value caused by expense ratios. It includes both fees paid and the compound growth those dollars no longer earn.',
      },
      {
        question: 'How does an ETF expense ratio work?',
        answer:
          'An expense ratio is an annual percentage deducted from fund assets to cover operating costs. It reduces the investment return retained by shareholders.',
      },
      {
        question: 'Why can a small fee difference matter?',
        answer:
          'A small annual difference can compound over decades, affecting the growth of the starting investment and every monthly contribution.',
      },
      {
        question: 'Does the lower-cost ETF always perform better?',
        answer:
          'Not necessarily. This calculator assumes both ETFs earn the same return before fees. Actual funds can differ in holdings, tracking, taxes, risk, and performance.',
      },
      {
        question: 'What assumptions does this comparison use?',
        answer:
          'It assumes constant expense ratios, monthly compounding, contributions at the end of each month, and the same constant pre-fee return for both ETFs.',
      },
    ],
    relatedIds: [
      'expense-ratio-calculator',
      'investment-fee-calculator',
      'compound-interest-calculator',
    ],
  },
  'dividend-yield': {
    id: 'dividend-yield',
    url: '/calculators/dividend-yield-calculator/',
    title: 'Dividend Yield Calculator',
    eyebrow: 'Investment Calculator',
    description:
      'Calculate a stock or fund dividend yield and estimate annual and monthly dividend income from the shares you own.',
    inputs: [
      {
        id: 'share-price',
        name: 'sharePrice',
        label: 'Share price',
        type: 'number',
        value: '100',
        min: '0.01',
        step: '0.01',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-dividend-per-share',
        name: 'annualDividendPerShare',
        label: 'Annual dividend per share',
        type: 'number',
        value: '4',
        min: '0',
        step: '0.01',
        prefix: '$',
      },
      {
        id: 'number-of-shares',
        name: 'numberOfShares',
        label: 'Number of shares (optional)',
        type: 'number',
        value: '',
        min: '0',
        step: '0.01',
        wide: true,
      },
    ],
    outputs: [
      {
        id: 'dividend-yield-result',
        label: 'Dividend yield',
        initialValue: '0.00%',
        primary: true,
      },
      {
        id: 'annual-dividend-income-result',
        label: 'Annual dividend income',
        initialValue: '$0.00',
      },
      {
        id: 'monthly-dividend-income-result',
        label: 'Monthly average dividend income',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is dividend yield?',
        answer:
          'Dividend yield is the annual dividend per share divided by the current share price, expressed as a percentage.',
      },
      {
        question: 'How is annual dividend income calculated?',
        answer:
          'Annual dividend income equals the annual dividend paid per share multiplied by the number of shares owned.',
      },
      {
        question: 'Does a higher dividend yield mean a better investment?',
        answer:
          'Not necessarily. A high yield can reflect strong income, but it can also result from a falling share price or a dividend that may not be sustainable.',
      },
      {
        question: 'Why is monthly dividend income an average?',
        answer:
          'Many companies pay quarterly or on another schedule. Dividing annual income by 12 gives a planning average, not the actual payment received each month.',
      },
      {
        question: 'Are dividends guaranteed?',
        answer:
          'No. Companies and funds can increase, reduce, suspend, or eliminate dividends, so this calculation is an estimate based on the stated annual dividend.',
      },
    ],
    relatedIds: [
      'four-percent-rule-calculator',
      'investment-fee-calculator',
      'cagr-calculator',
    ],
  },
  'dividend-growth': {
    id: 'dividend-growth',
    url: '/calculators/dividend-growth-calculator/',
    title: 'Dividend Growth Calculator',
    eyebrow: 'Investment Calculator',
    description:
      'Estimate how annual dividend income could grow over time at a consistent dividend growth rate.',
    inputs: [
      {
        id: 'initial-annual-dividend-income',
        name: 'initialAnnualDividendIncome',
        label: 'Initial annual dividend income',
        type: 'number',
        value: '1000',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-dividend-growth-rate',
        name: 'annualDividendGrowthRate',
        label: 'Annual dividend growth rate (%)',
        type: 'number',
        value: '5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '10',
        min: '0.01',
        step: '0.01',
        wide: true,
        required: true,
      },
    ],
    outputs: [
      {
        id: 'future-annual-dividend-income-result',
        label: 'Future annual dividend income',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'monthly-equivalent-income-result',
        label: 'Monthly equivalent income',
        initialValue: '$0.00',
      },
      {
        id: 'total-percentage-increase-result',
        label: 'Total percentage increase',
        initialValue: '0.00%',
      },
    ],
    faq: [
      {
        question: 'What is dividend growth?',
        answer:
          'Dividend growth is the rate at which a company or fund increases its dividend payments over time.',
      },
      {
        question: 'How is future dividend income estimated?',
        answer:
          'The calculator compounds the initial annual dividend income by the selected annual growth rate for the specified number of years.',
      },
      {
        question: 'Does this calculator include dividend reinvestment?',
        answer:
          'No. It models growth in the dividend payment itself and does not add income from purchasing additional shares through reinvestment.',
      },
      {
        question: 'Are dividend increases guaranteed?',
        answer:
          'No. Companies and funds can increase, hold, reduce, or eliminate dividends. A constant growth rate is a planning assumption, not a forecast.',
      },
      {
        question: 'Why compare dividend growth with CAGR?',
        answer:
          'Dividend growth measures changes in income, while CAGR can describe annualized growth in an investment value. Together they offer different views of performance.',
      },
    ],
    relatedIds: [
      'dividend-yield-calculator',
      'cagr-calculator',
      'compound-interest-calculator',
    ],
  },
  drip: {
    id: 'drip',
    url: '/calculators/drip-calculator/',
    title: 'DRIP Calculator',
    eyebrow: 'Dividend Calculator',
    description:
      'Estimate portfolio growth and future dividend income when dividends are automatically reinvested through a dividend reinvestment plan.',
    chart: true,
    inputs: [
      {
        id: 'initial-investment',
        name: 'initialInvestment',
        label: 'Initial investment',
        type: 'number',
        value: '10000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-dividend-yield',
        name: 'annualDividendYield',
        label: 'Annual dividend yield (%)',
        type: 'number',
        value: '4',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'annual-share-price-appreciation',
        name: 'annualSharePriceAppreciation',
        label: 'Annual share price appreciation (%)',
        type: 'number',
        value: '5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'annual-dividend-growth-rate',
        name: 'annualDividendGrowthRate',
        label: 'Annual dividend growth rate (%)',
        type: 'number',
        value: '3',
        min: '0',
        step: '0.01',
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
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '20',
        min: '1',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'final-portfolio-value-result',
        label: 'Final portfolio value',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-dividends-earned-result',
        label: 'Total dividends earned',
        initialValue: '$0.00',
      },
      {
        id: 'total-contributions-result',
        label: 'Total contributions',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-annual-dividend-income-result',
        label: 'Estimated annual dividend income at the end',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is a DRIP?',
        answer:
          'A dividend reinvestment plan automatically uses dividend payments to buy more shares, allowing future dividends and price growth to compound on a larger position.',
      },
      {
        question: 'How does this calculator reinvest dividends?',
        answer:
          'It estimates dividends monthly using the applicable annual yield and immediately adds them back to the portfolio before the next month compounds.',
      },
      {
        question: 'How is dividend growth applied?',
        answer:
          'The annual dividend yield increases after each completed year by the selected dividend growth rate.',
      },
      {
        question: 'Does the estimate include taxes or fees?',
        answer:
          'No. The calculation does not include dividend taxes, brokerage costs, fund expenses, trading spreads, or limits on purchasing fractional shares.',
      },
      {
        question: 'Are dividend yield and share-price growth guaranteed?',
        answer:
          'No. Dividends can change and market prices fluctuate. Constant rates are simplifying assumptions for planning, not predictions of future returns.',
      },
    ],
    relatedIds: [
      'dividend-yield-calculator',
      'dividend-growth-calculator',
      'compound-interest-calculator',
    ],
  },
  'lump-sum-vs-dca': {
    id: 'lump-sum-vs-dca',
    url: '/calculators/lump-sum-vs-dca-calculator/',
    title: 'Lump Sum vs DCA Calculator',
    eyebrow: 'Investment Calculator',
    description:
      'Compare investing a full amount immediately with gradually investing it through dollar-cost averaging.',
    inputs: [
      {
        id: 'total-amount',
        name: 'totalAmount',
        label: 'Total amount to invest',
        type: 'number',
        value: '12000',
        min: '0.01',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'dca-monthly-amount',
        name: 'dcaMonthlyAmount',
        label: 'DCA monthly amount',
        type: 'number',
        value: '1000',
        min: '0.01',
        step: '10',
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
        required: true,
      },
      {
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '10',
        min: '1',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'lump-sum-ending-balance-result',
        label: 'Lump sum ending balance',
        initialValue: '$0.00',
      },
      {
        id: 'dca-ending-balance-result',
        label: 'DCA ending balance',
        initialValue: '$0.00',
      },
      {
        id: 'difference-result',
        label: 'Difference',
        initialValue: '$0.00',
      },
      {
        id: 'better-strategy-result',
        label: 'Better strategy based on assumptions',
        initialValue: '—',
        primary: true,
      },
    ],
    faq: [
      {
        question: 'What is lump sum investing?',
        answer:
          'Lump sum investing puts the full available amount into the market immediately, giving all of the money the maximum time to compound.',
      },
      {
        question: 'What is dollar-cost averaging?',
        answer:
          'Dollar-cost averaging, or DCA, invests a fixed amount on a regular schedule instead of investing all available cash at once.',
      },
      {
        question: 'How is uninvested DCA cash handled?',
        answer:
          'Cash waiting to be invested earns 0% in this model. It remains part of the DCA ending balance so both strategies are compared using the same starting amount.',
      },
      {
        question: 'What happens if the monthly DCA amount exceeds the total?',
        answer:
          'The calculator invests only the available total in the first month. Under these assumptions, that produces the same result as the lump sum strategy.',
      },
      {
        question: 'Does this calculator predict which strategy will win?',
        answer:
          'No. It uses a constant return and does not model market volatility, taxes, fees, interest on cash, or the emotional benefits of investing gradually.',
      },
    ],
    relatedIds: [
      'compound-interest-calculator',
      'investment-fee-calculator',
      'cagr-calculator',
    ],
  },
  'emergency-fund': {
    id: 'emergency-fund',
    url: '/calculators/emergency-fund-calculator/',
    title: 'Emergency Fund Calculator',
    eyebrow: 'Savings Calculator',
    description:
      'Estimate your emergency fund target, the amount still needed, and how long it may take to reach your goal.',
    inputs: [
      {
        id: 'monthly-essential-expenses',
        name: 'monthlyEssentialExpenses',
        label: 'Monthly essential expenses',
        type: 'number',
        value: '3000',
        min: '0.01',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'target-months',
        name: 'targetMonths',
        label: 'Target months of expenses',
        type: 'number',
        value: '6',
        min: '0.5',
        step: '0.5',
        required: true,
      },
      {
        id: 'current-emergency-savings',
        name: 'currentEmergencySavings',
        label: 'Current emergency savings',
        type: 'number',
        value: '5000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-savings-contribution',
        name: 'monthlySavingsContribution',
        label: 'Monthly savings contribution',
        type: 'number',
        value: '500',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'target-emergency-fund-result',
        label: 'Target emergency fund',
        initialValue: '$0.00',
      },
      {
        id: 'amount-still-needed-result',
        label: 'Amount still needed',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-months-result',
        label: 'Estimated months to reach target',
        initialValue: '—',
        primary: true,
      },
      {
        id: 'estimated-completion-date-result',
        label: 'Estimated completion date',
        initialValue: '—',
      },
    ],
    faq: [
      {
        question: 'How many months of expenses should an emergency fund cover?',
        answer:
          'A common starting range is three to six months of essential expenses, but income stability, dependents, health needs, and insurance coverage can justify a different target.',
      },
      {
        question: 'What counts as an essential expense?',
        answer:
          'Essentials often include housing, utilities, groceries, insurance, transportation, minimum debt payments, healthcare, and other costs that cannot easily be paused.',
      },
      {
        question: 'Where should an emergency fund be kept?',
        answer:
          'Emergency savings are generally kept somewhere liquid and low risk, such as an insured savings or money market account, so the money is accessible when needed.',
      },
      {
        question: 'What if I already have more than my target?',
        answer:
          'The calculator marks the fund as already funded and shows no additional amount needed. You can then review whether excess cash belongs in another savings or investment goal.',
      },
      {
        question: 'Does the completion estimate include interest?',
        answer:
          'No. It divides the remaining amount by the monthly contribution and assumes no interest, withdrawals, fees, or changes to expenses.',
      },
    ],
    relatedIds: [
      'savings-rate-calculator',
      'net-worth-calculator',
      'savings-goal-calculator',
    ],
  },
  'savings-goal': {
    id: 'savings-goal',
    url: '/calculators/savings-goal-calculator/',
    title: 'Savings Goal Calculator',
    eyebrow: 'Savings Calculator',
    description:
      'Estimate how long it may take to reach a savings goal with your current balance, monthly contributions, and expected return.',
    inputs: [
      {
        id: 'savings-goal-amount',
        name: 'goalAmount',
        label: 'Savings goal amount',
        type: 'number',
        value: '25000',
        min: '0.01',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'current-savings',
        name: 'currentSavings',
        label: 'Current savings',
        type: 'number',
        value: '5000',
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
        id: 'expected-return',
        name: 'expectedReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '4',
        min: '0',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'amount-still-needed-result',
        label: 'Amount still needed',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-months-result',
        label: 'Estimated months to reach goal',
        initialValue: '—',
        primary: true,
      },
      {
        id: 'estimated-completion-date-result',
        label: 'Estimated completion date',
        initialValue: '—',
      },
      {
        id: 'total-contributions-needed-result',
        label: 'Total contributions needed',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How does the Savings Goal Calculator work?',
        answer:
          'It combines your current savings, monthly contributions, and expected monthly-compounded return to estimate when your balance could reach the goal.',
      },
      {
        question: 'What happens when the expected return is zero?',
        answer:
          'The timeline is based only on the remaining amount and monthly contribution, with any partial final month rounded up to a full contribution month.',
      },
      {
        question: 'What does total contributions needed mean?',
        answer:
          'It is the monthly contribution multiplied by the estimated number of months. Actual final contributions may be smaller if you stop precisely at the goal.',
      },
      {
        question: 'What if my current savings already meet the goal?',
        answer:
          'The calculator marks the goal as already funded and shows zero additional contributions and no remaining amount.',
      },
      {
        question: 'Is the estimated completion date guaranteed?',
        answer:
          'No. Returns can vary and changes to contributions, withdrawals, fees, or taxes can move the actual completion date.',
      },
    ],
    relatedIds: [
      'emergency-fund-calculator',
      'savings-rate-calculator',
      'compound-interest-calculator',
    ],
  },
  'real-rate-of-return': {
    id: 'real-rate-of-return',
    url: '/calculators/real-rate-of-return-calculator/',
    title: 'Real Rate of Return Calculator',
    eyebrow: 'Investment Calculator',
    description:
      'Calculate an inflation-adjusted annual return to understand how an investment may change your purchasing power.',
    inputs: [
      {
        id: 'nominal-annual-return',
        name: 'nominalAnnualReturn',
        label: 'Nominal annual return (%)',
        type: 'number',
        value: '7',
        step: '0.01',
        required: true,
      },
      {
        id: 'inflation-rate',
        name: 'inflationRate',
        label: 'Inflation rate (%)',
        type: 'number',
        value: '3',
        min: '-99.99',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'real-annual-return-result',
        label: 'Real annual return',
        initialValue: '0.00%',
        primary: true,
      },
      {
        id: 'purchasing-power-change-result',
        label: 'Purchasing power gain/loss',
        initialValue: '0.00%',
      },
      {
        id: 'inflation-adjusted-multiplier-result',
        label: 'Inflation-adjusted multiplier',
        initialValue: '1.0000x',
      },
    ],
    faq: [
      {
        question: 'What is the real rate of return?',
        answer:
          'The real rate of return is an investment return adjusted for inflation. It estimates whether purchasing power increased or decreased.',
      },
      {
        question: 'Why not simply subtract inflation from the return?',
        answer:
          'Simple subtraction is an approximation. The exact formula divides the nominal growth factor by the inflation growth factor.',
      },
      {
        question: 'Can the real return be negative?',
        answer:
          'Yes. A positive nominal return can still produce a negative real return when inflation rises faster than the investment.',
      },
      {
        question: 'How does deflation affect real returns?',
        answer:
          'A negative inflation rate can increase real purchasing-power returns because prices are falling, provided inflation remains greater than negative 100%.',
      },
      {
        question: 'Does this result include taxes and investment fees?',
        answer:
          'No. Enter a return after fees or taxes if you want those costs reflected. The calculator only adjusts the entered nominal return for inflation.',
      },
    ],
    relatedIds: [
      'inflation-calculator',
      'cagr-calculator',
      'compound-interest-calculator',
    ],
  },
  'inflation-adjusted-return': {
    id: 'inflation-adjusted-return',
    url: '/calculators/inflation-adjusted-return-calculator/',
    title: 'Inflation-Adjusted Return Calculator',
    eyebrow: 'Investment Calculator',
    description:
      'Compare nominal investment growth with its inflation-adjusted purchasing power over time.',
    inputs: [
      {
        id: 'starting-investment',
        name: 'startingInvestment',
        label: 'Starting investment',
        type: 'number',
        value: '10000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'nominal-annual-return',
        name: 'nominalAnnualReturn',
        label: 'Nominal annual return (%)',
        type: 'number',
        value: '7',
        step: '0.01',
        required: true,
      },
      {
        id: 'inflation-rate',
        name: 'inflationRate',
        label: 'Inflation rate (%)',
        type: 'number',
        value: '3',
        min: '-99.99',
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
    ],
    outputs: [
      {
        id: 'nominal-ending-balance-result',
        label: 'Nominal ending balance',
        initialValue: '$0.00',
      },
      {
        id: 'inflation-adjusted-ending-balance-result',
        label: 'Inflation-adjusted ending balance',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'purchasing-power-lost-result',
        label: 'Purchasing power lost to inflation',
        initialValue: '$0.00',
      },
      {
        id: 'real-annual-return-result',
        label: 'Real annual return',
        initialValue: '0.00%',
      },
    ],
    faq: [
      {
        question: 'What is an inflation-adjusted return?',
        answer:
          'It is the investment return after accounting for changes in purchasing power caused by inflation or deflation.',
      },
      {
        question: 'Why is the inflation-adjusted balance lower?',
        answer:
          'When inflation is positive, future dollars buy less. The adjusted balance expresses the result in purchasing-power terms rather than future nominal dollars.',
      },
      {
        question: 'Can purchasing power lost be negative?',
        answer:
          'Yes. During deflation, the inflation-adjusted balance can exceed the nominal balance, producing a negative purchasing-power loss that represents a gain.',
      },
      {
        question: 'Can the nominal return be negative?',
        answer:
          'Yes. The calculator accepts negative nominal returns and then adjusts them using the entered inflation rate.',
      },
      {
        question: 'Does this calculator include contributions, fees, or taxes?',
        answer:
          'No. It models one starting investment with constant annual return and inflation assumptions and no additional cash flows or costs.',
      },
    ],
    relatedIds: [
      'real-rate-of-return-calculator',
      'inflation-calculator',
      'compound-interest-calculator',
    ],
  },
  'financial-independence-date': {
    id: 'financial-independence-date',
    url: '/calculators/financial-independence-date-calculator/',
    title: 'Financial Independence Date Calculator',
    eyebrow: 'FIRE Calculator',
    description:
      'Estimate your FIRE number and the date you could reach financial independence based on your investments, contributions, and expected return.',
    inputs: [
      {
        id: 'current-invested-assets',
        name: 'currentInvestedAssets',
        label: 'Current invested assets',
        type: 'number',
        value: '250000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-expenses',
        name: 'annualExpenses',
        label: 'Annual expenses',
        type: 'number',
        value: '50000',
        min: '1',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-contribution',
        name: 'monthlyContribution',
        label: 'Monthly contribution',
        type: 'number',
        value: '2000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
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
        id: 'fire-number-result',
        label: 'FIRE number',
        initialValue: '$0.00',
      },
      {
        id: 'amount-still-needed-result',
        label: 'Amount still needed',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-years-result',
        label: 'Estimated years to financial independence',
        initialValue: '0 years',
        primary: true,
      },
      {
        id: 'estimated-fi-date-result',
        label: 'Estimated FI date',
        initialValue: 'Not calculated',
      },
    ],
    faq: [
      {
        question: 'What is a financial independence date?',
        answer:
          'It is an estimate of when your invested assets may reach the portfolio target needed to support your annual expenses at your chosen withdrawal rate.',
      },
      {
        question: 'How is the FIRE number calculated?',
        answer:
          'The calculator divides annual expenses by the withdrawal rate as a decimal. For example, $50,000 of expenses at a 4% withdrawal rate produces a $1.25 million FIRE number.',
      },
      {
        question: 'How does the calculator estimate the FI date?',
        answer:
          'It projects current investments and monthly contributions using monthly compounding, then finds the first month in which the portfolio reaches the FIRE number.',
      },
      {
        question: 'What return should I use?',
        answer:
          'Use a long-term estimate that reflects your asset allocation and fees. Conservative assumptions can provide a more cautious planning range.',
      },
      {
        question: 'Is the estimated date guaranteed?',
        answer:
          'No. Market returns, inflation, taxes, fees, spending, and contributions change over time. Revisit the estimate regularly and test multiple assumptions.',
      },
    ],
    relatedIds: [
      'fire-calculator',
      'coast-fire-calculator',
      'savings-rate-calculator',
    ],
  },
  'lean-fire': {
    id: 'lean-fire',
    url: '/calculators/lean-fire-calculator/',
    title: 'Lean FIRE Calculator',
    eyebrow: 'FIRE Calculator',
    description:
      'Estimate the portfolio target and potential date for reaching financial independence with a lean annual spending plan.',
    inputs: [
      {
        id: 'annual-expenses',
        name: 'annualExpenses',
        label: 'Annual expenses',
        type: 'number',
        value: '36000',
        min: '1',
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
        id: 'current-invested-assets',
        name: 'currentInvestedAssets',
        label: 'Current invested assets',
        type: 'number',
        value: '250000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-contribution',
        name: 'monthlyContribution',
        label: 'Monthly contribution',
        type: 'number',
        value: '2000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'lean-fire-number-result',
        label: 'Lean FIRE number',
        initialValue: '$0.00',
      },
      {
        id: 'amount-still-needed-result',
        label: 'Amount still needed',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-years-result',
        label: 'Estimated years to Lean FIRE',
        initialValue: '0 years',
        primary: true,
      },
      {
        id: 'estimated-lean-fire-date-result',
        label: 'Estimated Lean FIRE date',
        initialValue: 'Not calculated',
      },
    ],
    faq: [
      {
        question: 'What is Lean FIRE?',
        answer:
          'Lean FIRE is financial independence built around a relatively low annual spending target. The specific amount is personal and depends on your location, household, and lifestyle.',
      },
      {
        question: 'How is the Lean FIRE number calculated?',
        answer:
          'The calculator divides annual expenses by the withdrawal rate as a decimal. At a 4% withdrawal rate, $36,000 of annual expenses produces a $900,000 target.',
      },
      {
        question: 'How is the estimated Lean FIRE date calculated?',
        answer:
          'Current investments and monthly contributions are projected with monthly compounding until they reach the calculated Lean FIRE number.',
      },
      {
        question: 'What withdrawal rate should I use?',
        answer:
          'Many plans begin with 4%, but an appropriate rate depends on retirement length, investment mix, flexibility, taxes, and future spending. Consider testing more conservative rates.',
      },
      {
        question: 'Does Lean FIRE account for changing expenses?',
        answer:
          'No. This estimate assumes constant annual expenses, contributions, and returns. Include health care, taxes, housing changes, and a margin for unexpected costs in your planning.',
      },
    ],
    relatedIds: [
      'fire-calculator',
      'coast-fire-calculator',
      'financial-independence-date-calculator',
    ],
  },
  'fat-fire': {
    id: 'fat-fire',
    url: '/calculators/fat-fire-calculator/',
    title: 'Fat FIRE Calculator',
    eyebrow: 'FIRE Calculator',
    description:
      'Estimate the portfolio target and potential date for reaching financial independence with a higher annual spending goal.',
    inputs: [
      {
        id: 'target-annual-spending',
        name: 'targetAnnualSpending',
        label: 'Target annual spending',
        type: 'number',
        value: '120000',
        min: '1',
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
        id: 'current-invested-assets',
        name: 'currentInvestedAssets',
        label: 'Current invested assets',
        type: 'number',
        value: '500000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-contribution',
        name: 'monthlyContribution',
        label: 'Monthly contribution',
        type: 'number',
        value: '5000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'fat-fire-number-result',
        label: 'Fat FIRE number',
        initialValue: '$0.00',
      },
      {
        id: 'amount-still-needed-result',
        label: 'Amount still needed',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-years-result',
        label: 'Estimated years to Fat FIRE',
        initialValue: '0 years',
        primary: true,
      },
      {
        id: 'estimated-fat-fire-date-result',
        label: 'Estimated Fat FIRE date',
        initialValue: 'Not calculated',
      },
    ],
    faq: [
      {
        question: 'What is Fat FIRE?',
        answer:
          'Fat FIRE is financial independence with a higher spending target intended to support greater lifestyle flexibility, travel, housing, health care, or other discretionary costs.',
      },
      {
        question: 'How is the Fat FIRE number calculated?',
        answer:
          'The calculator divides target annual spending by the withdrawal rate as a decimal. At a 4% withdrawal rate, $120,000 of annual spending requires a $3 million portfolio.',
      },
      {
        question: 'How is the estimated Fat FIRE date calculated?',
        answer:
          'Current investments and monthly contributions are projected with monthly compounding until they reach the calculated Fat FIRE number.',
      },
      {
        question: 'What withdrawal rate should I use for Fat FIRE?',
        answer:
          'Many plans use 4% as a starting point, but longer retirements or less flexible spending may call for a lower rate. Test several rates and include taxes and fees in your plan.',
      },
      {
        question: 'Should inflation be included in my spending target?',
        answer:
          'Yes. Express your target in today’s dollars and revisit it regularly. This calculator uses constant inputs, so it does not separately model future inflation or changing expenses.',
      },
    ],
    relatedIds: [
      'fire-calculator',
      'lean-fire-calculator',
      'financial-independence-date-calculator',
    ],
  },
  'barista-fire': {
    id: 'barista-fire',
    url: '/calculators/barista-fire-calculator/',
    title: 'Barista FIRE Calculator',
    eyebrow: 'FIRE Calculator',
    description:
      'Estimate the portfolio and timeline needed for part-time income to cover part of your expenses on the path to financial independence.',
    inputs: [
      {
        id: 'annual-expenses',
        name: 'annualExpenses',
        label: 'Annual expenses',
        type: 'number',
        value: '60000',
        min: '1',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-part-time-income',
        name: 'annualPartTimeIncome',
        label: 'Expected annual part-time income',
        type: 'number',
        value: '24000',
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
        id: 'current-invested-assets',
        name: 'currentInvestedAssets',
        label: 'Current invested assets',
        type: 'number',
        value: '250000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-contribution',
        name: 'monthlyContribution',
        label: 'Monthly contribution',
        type: 'number',
        value: '2000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'barista-fire-number-result',
        label: 'Barista FIRE number',
        initialValue: '$0.00',
      },
      {
        id: 'expenses-covered-result',
        label: 'Expenses covered by part-time income',
        initialValue: '$0.00',
      },
      {
        id: 'amount-still-needed-result',
        label: 'Amount still needed',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-years-result',
        label: 'Estimated years to Barista FIRE',
        initialValue: '0 years',
        primary: true,
      },
      {
        id: 'estimated-barista-fire-date-result',
        label: 'Estimated Barista FIRE date',
        initialValue: 'Not calculated',
      },
    ],
    faq: [
      {
        question: 'What is Barista FIRE?',
        answer:
          'Barista FIRE is a financial independence strategy where part-time or flexible work covers some living expenses, reducing the portfolio needed to support the rest.',
      },
      {
        question: 'How is the Barista FIRE number calculated?',
        answer:
          'Expected annual part-time income is subtracted from annual expenses. The remaining expenses are divided by the withdrawal rate as a decimal.',
      },
      {
        question: 'What if part-time income covers all expenses?',
        answer:
          'The required portfolio is treated as zero, and the calculator reports that the Barista FIRE target is already funded.',
      },
      {
        question: 'Does part-time income need to continue forever?',
        answer:
          'This estimate assumes the entered income continues while it offsets expenses. If work will end later, also model the full portfolio needed without that income.',
      },
      {
        question: 'Are taxes and benefits included?',
        answer:
          'No. Enter expected part-time income after taxes if appropriate, and account separately for health insurance, employment benefits, investment fees, and changing expenses.',
      },
    ],
    relatedIds: [
      'fire-calculator',
      'lean-fire-calculator',
      'coast-fire-calculator',
    ],
  },
  'safe-withdrawal-rate': {
    id: 'safe-withdrawal-rate',
    url: '/calculators/safe-withdrawal-rate-calculator/',
    title: 'Safe Withdrawal Rate Calculator',
    eyebrow: 'Retirement Calculator',
    description:
      'Calculate the withdrawal rate your desired retirement spending requires and compare your portfolio with the 4% rule.',
    inputs: [
      {
        id: 'portfolio-value',
        name: 'portfolioValue',
        label: 'Portfolio value',
        type: 'number',
        value: '1000000',
        min: '1',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-spending',
        name: 'annualSpending',
        label: 'Desired annual spending',
        type: 'number',
        value: '40000',
        min: '0',
        step: '1000',
        prefix: '$',
      },
      {
        id: 'monthly-spending',
        name: 'monthlySpending',
        label: 'Desired monthly spending',
        type: 'number',
        value: '',
        min: '0',
        step: '100',
        prefix: '$',
      },
    ],
    outputs: [
      {
        id: 'withdrawal-rate-needed-result',
        label: 'Withdrawal rate needed',
        initialValue: '0.00%',
        primary: true,
      },
      {
        id: 'annual-spending-supported-result',
        label: 'Annual spending supported at 4%',
        initialValue: '$0.00',
      },
      {
        id: 'monthly-spending-supported-result',
        label: 'Monthly spending supported at 4%',
        initialValue: '$0.00',
      },
      {
        id: 'portfolio-surplus-shortfall-result',
        label: 'Portfolio surplus or shortfall vs 4% rule',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is a safe withdrawal rate?',
        answer:
          'A safe withdrawal rate is a planning estimate for how much of a retirement portfolio may be withdrawn each year while trying to limit the risk of running out of money.',
      },
      {
        question: 'What does the withdrawal rate needed mean?',
        answer:
          'It is your desired annual spending divided by your current portfolio. A higher required rate generally places more pressure on the portfolio.',
      },
      {
        question: 'Is 4% always a safe withdrawal rate?',
        answer:
          'No. The 4% rule is a historical planning guideline, not a guarantee. Retirement length, asset allocation, fees, taxes, and market conditions can change the outcome.',
      },
      {
        question: 'Why does inflation matter?',
        answer:
          'Retirement spending usually rises over time. A withdrawal plan should consider inflation and whether future withdrawals need to maintain purchasing power.',
      },
      {
        question: 'What should I do if the calculator shows a shortfall?',
        answer:
          'A shortfall means the portfolio is below the amount implied by a 4% withdrawal rate. Possible adjustments include saving more, spending less, working longer, or testing another rate.',
      },
    ],
    relatedIds: [
      'four-percent-rule-calculator',
      'retirement-withdrawal-calculator',
      'fire-calculator',
    ],
  },
  'years-to-retirement': {
    id: 'years-to-retirement',
    url: '/calculators/years-to-retirement-calculator/',
    title: 'Years to Retirement Calculator',
    eyebrow: 'Retirement Calculator',
    description:
      'Compare your target retirement age with the estimated time needed for your investments to reach your retirement portfolio goal.',
    inputs: [
      {
        id: 'current-age',
        name: 'currentAge',
        label: 'Current age',
        type: 'number',
        value: '35',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'target-retirement-age',
        name: 'targetRetirementAge',
        label: 'Target retirement age',
        type: 'number',
        value: '60',
        min: '2',
        step: '1',
        required: true,
      },
      {
        id: 'current-invested-assets',
        name: 'currentInvestedAssets',
        label: 'Current invested assets',
        type: 'number',
        value: '200000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'target-retirement-portfolio',
        name: 'targetRetirementPortfolio',
        label: 'Target retirement portfolio',
        type: 'number',
        value: '1500000',
        min: '1',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-contribution',
        name: 'monthlyContribution',
        label: 'Monthly contribution',
        type: 'number',
        value: '2000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'years-by-age-target-result',
        label: 'Years by age target',
        initialValue: '0 years',
      },
      {
        id: 'portfolio-gap-result',
        label: 'Portfolio gap',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-years-to-portfolio-result',
        label: 'Estimated years to target portfolio',
        initialValue: '0 years',
      },
      {
        id: 'target-likelihood-result',
        label: 'Likely reached before target retirement age',
        initialValue: 'Not calculated',
        primary: true,
      },
    ],
    faq: [
      {
        question: 'How does this calculator estimate years to retirement?',
        answer:
          'It compares the years until your target retirement age with the time your current investments and monthly contributions may need to reach your portfolio goal.',
      },
      {
        question: 'How is investment growth calculated?',
        answer:
          'The calculator applies your expected annual return through monthly compounding and adds the entered contribution each month.',
      },
      {
        question: 'What if my portfolio target is already funded?',
        answer:
          'The calculator reports the target as reached and shows a portfolio gap of zero, regardless of the remaining years until your selected retirement age.',
      },
      {
        question: 'What expected return should I use?',
        answer:
          'Use a long-term estimate appropriate for your investment mix and consider reducing it for fees. Testing conservative and optimistic assumptions can provide a useful range.',
      },
      {
        question: 'Does reaching the portfolio target mean I can retire?',
        answer:
          'Not necessarily. A complete retirement plan should also consider spending, inflation, taxes, health care, withdrawal rates, pensions, and other income.',
      },
    ],
    relatedIds: [
      'fire-calculator',
      'financial-independence-date-calculator',
      'coast-fire-calculator',
    ],
  },
  'retirement-income-gap': {
    id: 'retirement-income-gap',
    url: '/calculators/retirement-income-gap-calculator/',
    title: 'Retirement Income Gap Calculator',
    eyebrow: 'Retirement Calculator',
    description:
      'Compare your expected retirement income sources and portfolio withdrawals with your desired annual retirement income.',
    inputs: [
      {
        id: 'desired-annual-retirement-income',
        name: 'desiredAnnualRetirementIncome',
        label: 'Desired annual retirement income',
        type: 'number',
        value: '80000',
        min: '1',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'social-security-income',
        name: 'socialSecurityIncome',
        label: 'Expected Social Security income',
        type: 'number',
        value: '24000',
        min: '0',
        step: '1000',
        prefix: '$',
      },
      {
        id: 'pension-income',
        name: 'pensionIncome',
        label: 'Pension income',
        type: 'number',
        value: '',
        min: '0',
        step: '1000',
        prefix: '$',
      },
      {
        id: 'rental-income',
        name: 'rentalIncome',
        label: 'Rental income',
        type: 'number',
        value: '',
        min: '0',
        step: '1000',
        prefix: '$',
      },
      {
        id: 'dividend-income',
        name: 'dividendIncome',
        label: 'Dividend income',
        type: 'number',
        value: '',
        min: '0',
        step: '1000',
        prefix: '$',
      },
      {
        id: 'other-passive-income',
        name: 'otherPassiveIncome',
        label: 'Other passive income',
        type: 'number',
        value: '',
        min: '0',
        step: '1000',
        prefix: '$',
      },
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
        id: 'total-non-portfolio-income-result',
        label: 'Total expected non-portfolio income',
        initialValue: '$0.00',
      },
      {
        id: 'annual-income-gap-result',
        label: 'Annual income gap',
        initialValue: '$0.00',
      },
      {
        id: 'portfolio-withdrawal-supported-result',
        label: 'Portfolio withdrawal supported',
        initialValue: '$0.00',
      },
      {
        id: 'surplus-shortfall-result',
        label: 'Surplus or shortfall',
        initialValue: '$0.00',
        primary: true,
      },
    ],
    faq: [
      {
        question: 'What is a retirement income gap?',
        answer:
          'A retirement income gap is the difference between your desired annual retirement income and income expected from sources outside your investment portfolio.',
      },
      {
        question: 'Which retirement income sources should I include?',
        answer:
          'Include reliable estimates for Social Security, pensions, rental income, dividends, annuities, and other passive income. Use after-tax amounts when that better matches your spending goal.',
      },
      {
        question: 'How is portfolio-supported income calculated?',
        answer:
          'The calculator multiplies portfolio value by your selected withdrawal rate. A $1 million portfolio at 4% supports an estimated $40,000 annual withdrawal.',
      },
      {
        question: 'What does a shortfall mean?',
        answer:
          'A shortfall means expected non-portfolio income plus the selected portfolio withdrawal does not fully cover the desired annual retirement income.',
      },
      {
        question: 'Does this calculator account for inflation or taxes?',
        answer:
          'No. It is a one-year planning snapshot. Revisit income and spending estimates for inflation, taxes, benefit changes, investment fees, and changing withdrawal needs.',
      },
    ],
    relatedIds: [
      'retirement-withdrawal-calculator',
      'safe-withdrawal-rate-calculator',
      'fire-calculator',
    ],
  },
  'portfolio-withdrawal-sustainability': {
    id: 'portfolio-withdrawal-sustainability',
    url: '/calculators/portfolio-withdrawal-sustainability-calculator/',
    title: 'Portfolio Withdrawal Sustainability Calculator',
    eyebrow: 'Retirement Calculator',
    description:
      'Estimate whether a portfolio may sustain fixed annual withdrawals after adjusting expected returns for inflation.',
    inputs: [
      {
        id: 'portfolio-value',
        name: 'portfolioValue',
        label: 'Portfolio value',
        type: 'number',
        value: '1000000',
        min: '1',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-withdrawal-amount',
        name: 'annualWithdrawalAmount',
        label: 'Annual withdrawal amount',
        type: 'number',
        value: '40000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'inflation-rate',
        name: 'inflationRate',
        label: 'Inflation rate (%)',
        type: 'number',
        value: '3',
        min: '-99.99',
        step: '0.01',
        required: true,
      },
      {
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '30',
        min: '1',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'ending-portfolio-balance-result',
        label: 'Ending portfolio balance',
        initialValue: '$0.00',
      },
      {
        id: 'total-withdrawals-result',
        label: 'Total withdrawals',
        initialValue: '$0.00',
      },
      {
        id: 'real-return-result',
        label: 'Real return after inflation',
        initialValue: '0.00%',
      },
      {
        id: 'sustainability-result',
        label: 'Sustainability result',
        initialValue: 'Not calculated',
        primary: true,
      },
    ],
    faq: [
      {
        question: 'What does portfolio withdrawal sustainability mean?',
        answer:
          'It estimates whether a portfolio remains above zero after applying an inflation-adjusted return and subtracting a fixed withdrawal each year.',
      },
      {
        question: 'How is the real return calculated?',
        answer:
          'The calculator divides the nominal growth factor by the inflation growth factor. This is more precise than simply subtracting inflation from the expected return.',
      },
      {
        question: 'Does the annual withdrawal increase with inflation?',
        answer:
          'No. The entered withdrawal remains fixed in real-dollar terms because portfolio growth is modeled using the real return after inflation.',
      },
      {
        question: 'Does a sustainable result guarantee the plan will work?',
        answer:
          'No. Actual returns vary from year to year, and poor early returns can materially affect retirement outcomes. This calculator uses one constant annual return assumption.',
      },
      {
        question: 'Are taxes and investment fees included?',
        answer:
          'No. Reduce the expected return or increase the withdrawal amount if you want to approximate fees, taxes, or other portfolio costs.',
      },
    ],
    relatedIds: [
      'retirement-withdrawal-calculator',
      'safe-withdrawal-rate-calculator',
      'retirement-income-gap-calculator',
    ],
  },
  'retirement-tax-drag': {
    id: 'retirement-tax-drag',
    url: '/calculators/retirement-tax-drag-calculator/',
    title: 'Retirement Tax Drag Calculator',
    eyebrow: 'Retirement Calculator',
    description:
      'Estimate how taxes reduce annual retirement income and the inflation-adjusted value of taxes paid over retirement.',
    inputs: [
      {
        id: 'annual-retirement-withdrawal',
        name: 'annualRetirementWithdrawal',
        label: 'Annual retirement withdrawal',
        type: 'number',
        value: '60000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'estimated-tax-rate',
        name: 'estimatedTaxRate',
        label: 'Estimated tax rate (%)',
        type: 'number',
        value: '20',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'years-in-retirement',
        name: 'yearsInRetirement',
        label: 'Years in retirement',
        type: 'number',
        value: '30',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'inflation-rate',
        name: 'inflationRate',
        label: 'Inflation rate (%)',
        type: 'number',
        value: '3',
        min: '-99.99',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'annual-taxes-paid-result',
        label: 'Annual taxes paid',
        initialValue: '$0.00',
      },
      {
        id: 'after-tax-annual-income-result',
        label: 'After-tax annual income',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-taxes-result',
        label: 'Total taxes over retirement',
        initialValue: '$0.00',
      },
      {
        id: 'inflation-adjusted-total-taxes-result',
        label: 'Inflation-adjusted total taxes',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is retirement tax drag?',
        answer:
          'Retirement tax drag is the reduction in spendable retirement income caused by taxes on portfolio withdrawals or other taxable retirement income.',
      },
      {
        question: 'How is annual tax estimated?',
        answer:
          'The calculator multiplies the annual retirement withdrawal by the entered estimated tax rate. It uses one blended rate for a simple planning estimate.',
      },
      {
        question: 'What are inflation-adjusted total taxes?',
        answer:
          'They are the present value of each future annual tax payment after discounting it by the entered inflation rate.',
      },
      {
        question: 'Should I enter my marginal or effective tax rate?',
        answer:
          'An estimated effective tax rate is usually more appropriate because it reflects the average tax paid across the full withdrawal rather than the rate on the last dollar.',
      },
      {
        question: 'Does this calculator model account types or tax law changes?',
        answer:
          'No. Traditional, Roth, and taxable accounts can have different treatment, and future tax rules may change. Use this as a simplified planning estimate.',
      },
    ],
    relatedIds: [
      'retirement-withdrawal-calculator',
      'safe-withdrawal-rate-calculator',
      'portfolio-withdrawal-sustainability-calculator',
    ],
  },
  'roth-vs-traditional-ira': {
    id: 'roth-vs-traditional-ira',
    url: '/calculators/roth-vs-traditional-ira-calculator/',
    title: 'Roth vs Traditional IRA Calculator',
    eyebrow: 'Retirement Calculator',
    description:
      'Compare the projected after-tax value of Roth and Traditional IRA contributions under your current and retirement tax assumptions.',
    inputs: [
      {
        id: 'annual-contribution',
        name: 'annualContribution',
        label: 'Annual contribution',
        type: 'number',
        value: '7000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'current-tax-rate',
        name: 'currentTaxRate',
        label: 'Current tax rate (%)',
        type: 'number',
        value: '24',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'retirement-tax-rate',
        name: 'retirementTaxRate',
        label: 'Retirement tax rate (%)',
        type: 'number',
        value: '22',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
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
        value: '30',
        min: '1',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'roth-ending-value-result',
        label: 'Roth IRA ending value',
        initialValue: '$0.00',
      },
      {
        id: 'traditional-after-tax-ending-value-result',
        label: 'Traditional IRA after-tax ending value',
        initialValue: '$0.00',
      },
      {
        id: 'difference-result',
        label: 'Difference',
        initialValue: '$0.00',
      },
      {
        id: 'better-option-result',
        label: 'Better option under assumptions',
        initialValue: 'Not calculated',
        primary: true,
      },
    ],
    faq: [
      {
        question: 'What is the main difference between Roth and Traditional IRAs?',
        answer:
          'Roth contributions are made with after-tax dollars and qualified withdrawals are generally tax-free. Traditional contributions may provide a current tax benefit, while withdrawals are generally taxable.',
      },
      {
        question: 'Why does the calculator reduce the Roth contribution by my current tax rate?',
        answer:
          'It compares accounts using the same pre-tax contribution budget. The Roth amount is reduced for taxes paid today, while the full amount goes into the Traditional IRA before retirement taxes.',
      },
      {
        question: 'When might a Roth IRA have the higher projected value?',
        answer:
          'Under these assumptions, Roth tends to compare more favorably when your retirement tax rate is higher than your current tax rate.',
      },
      {
        question: 'When might a Traditional IRA have the higher projected value?',
        answer:
          'Traditional tends to compare more favorably when your retirement tax rate is lower than your current tax rate, assuming the current tax savings are reflected in the comparison.',
      },
      {
        question: 'Does this calculator include IRA limits and eligibility rules?',
        answer:
          'No. Contribution limits, income restrictions, deductions, employer plans, required distributions, and tax laws can affect the choice. This calculator is an educational projection, not tax advice.',
      },
    ],
    relatedIds: [
      'retirement-tax-drag-calculator',
      'compound-interest-calculator',
      'fire-calculator',
    ],
  },
  '401k-growth': {
    id: '401k-growth',
    url: '/calculators/401k-growth-calculator/',
    title: '401(k) Growth Calculator',
    eyebrow: 'Retirement Calculator',
    description:
      'Estimate how your current 401(k), employee contributions, employer match, and investment returns could grow over time.',
    inputs: [
      {
        id: 'current-401k-balance',
        name: 'currentBalance',
        label: 'Current 401(k) balance',
        type: 'number',
        value: '50000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'employee-monthly-contribution',
        name: 'employeeMonthlyContribution',
        label: 'Employee monthly contribution',
        type: 'number',
        value: '600',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
      {
        id: 'employer-monthly-match',
        name: 'employerMonthlyMatch',
        label: 'Employer monthly match',
        type: 'number',
        value: '300',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
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
        value: '25',
        min: '1',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'ending-balance-result',
        label: 'Ending 401(k) balance',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'employee-contributions-result',
        label: 'Total employee contributions',
        initialValue: '$0.00',
      },
      {
        id: 'employer-match-result',
        label: 'Total employer match',
        initialValue: '$0.00',
      },
      {
        id: 'investment-growth-result',
        label: 'Investment growth',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How does this 401(k) growth calculator work?',
        answer:
          'It compounds the current balance monthly and adds the employee contribution and employer match at the end of each month.',
      },
      {
        question: 'How should I enter my employer match?',
        answer:
          'Enter the estimated dollar amount your employer contributes each month. Check your plan rules because matching formulas and vesting schedules vary.',
      },
      {
        question: 'Does the ending balance include my current 401(k) balance?',
        answer:
          'Yes. The current balance grows alongside all future employee contributions and employer matching contributions.',
      },
      {
        question: 'Are taxes, fees, and contribution limits included?',
        answer:
          'No. The calculator does not model taxes, plan fees, IRS contribution limits, catch-up contributions, or changes in contribution amounts.',
      },
      {
        question: 'Is the expected annual return guaranteed?',
        answer:
          'No. Investment returns fluctuate and may be negative in some years. Use a conservative long-term assumption and compare multiple scenarios.',
      },
    ],
    relatedIds: [
      'roth-vs-traditional-ira-calculator',
      'compound-interest-calculator',
      'fire-calculator',
    ],
  },
  'ira-growth': {
    id: 'ira-growth',
    url: '/calculators/ira-growth-calculator/',
    title: 'IRA Growth Calculator',
    eyebrow: 'Retirement Calculator',
    description:
      'Estimate how your current IRA balance and annual contributions could grow with compounded investment returns.',
    inputs: [
      {
        id: 'current-ira-balance',
        name: 'currentBalance',
        label: 'Current IRA balance',
        type: 'number',
        value: '25000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-contribution',
        name: 'annualContribution',
        label: 'Annual contribution',
        type: 'number',
        value: '7000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
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
        value: '25',
        min: '1',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'ending-balance-result',
        label: 'Ending IRA balance',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-contributions-result',
        label: 'Total contributions',
        initialValue: '$0.00',
      },
      {
        id: 'investment-growth-result',
        label: 'Investment growth',
        initialValue: '$0.00',
      },
      {
        id: 'average-annual-growth-result',
        label: 'Average annual growth',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How does the IRA growth calculator work?',
        answer:
          'It compounds the current IRA balance annually and adds the entered contribution at the end of each year.',
      },
      {
        question: 'Does this calculator work for Roth and Traditional IRAs?',
        answer:
          'Yes for a basic growth projection. It estimates account value before considering the different tax treatment of Roth and Traditional IRA contributions and withdrawals.',
      },
      {
        question: 'What does investment growth include?',
        answer:
          'Investment growth is the ending balance minus your starting balance and all modeled contributions. It represents growth generated by the assumed return.',
      },
      {
        question: 'What is average annual growth?',
        answer:
          'It is total investment growth divided by the number of years. It is a simple annual average, not the annual investment return or CAGR.',
      },
      {
        question: 'Does this calculator enforce IRA contribution limits?',
        answer:
          'No. Contribution limits and eligibility rules can change and may depend on age, income, filing status, and account type. Confirm current rules before contributing.',
      },
    ],
    relatedIds: [
      'roth-vs-traditional-ira-calculator',
      '401k-growth-calculator',
      'compound-interest-calculator',
    ],
  },
  'taxable-vs-tax-advantaged': {
    id: 'taxable-vs-tax-advantaged',
    url: '/calculators/taxable-vs-tax-advantaged-calculator/',
    title: 'Taxable vs Tax-Advantaged Account Calculator',
    eyebrow: 'Investment Calculator',
    description:
      'Compare how an estimated annual tax drag may affect long-term growth in taxable and tax-advantaged investment accounts.',
    inputs: [
      {
        id: 'starting-investment',
        name: 'startingInvestment',
        label: 'Starting investment',
        type: 'number',
        value: '25000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-contribution',
        name: 'annualContribution',
        label: 'Annual contribution',
        type: 'number',
        value: '7000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'tax-drag',
        name: 'taxDrag',
        label: 'Tax drag in taxable account (%)',
        type: 'number',
        value: '1',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'years',
        name: 'years',
        label: 'Number of years',
        type: 'number',
        value: '25',
        min: '1',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'taxable-ending-balance-result',
        label: 'Taxable account ending balance',
        initialValue: '$0.00',
      },
      {
        id: 'tax-advantaged-ending-balance-result',
        label: 'Tax-advantaged ending balance',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'difference-result',
        label: 'Difference',
        initialValue: '$0.00',
      },
      {
        id: 'tax-drag-cost-result',
        label: 'Tax drag cost',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is tax drag in a taxable investment account?',
        answer:
          'Tax drag is the estimated reduction in annual return caused by taxes on dividends, interest, distributions, and realized capital gains.',
      },
      {
        question: 'What is a tax-advantaged account?',
        answer:
          'A tax-advantaged account, such as an IRA or 401(k), may defer taxes or allow qualified tax-free growth depending on the account type and applicable rules.',
      },
      {
        question: 'How are annual contributions modeled?',
        answer:
          'The calculator adds the same contribution to each account at the end of every year, then compares their ending balances over the selected period.',
      },
      {
        question: 'Does this calculator include taxes on final withdrawals?',
        answer:
          'No. It models annual tax drag during accumulation only. Taxes on withdrawals, capital gains at sale, account fees, and contribution limits are not included.',
      },
      {
        question: 'How should I estimate taxable account tax drag?',
        answer:
          'Tax drag varies with investment type, turnover, distributions, tax bracket, and holding period. Testing a range of assumptions is more useful than relying on one precise estimate.',
      },
    ],
    relatedIds: [
      'roth-vs-traditional-ira-calculator',
      'ira-growth-calculator',
      'investment-fee-calculator',
    ],
  },
  'hsa-growth': {
    id: 'hsa-growth',
    url: '/calculators/hsa-growth-calculator/',
    title: 'HSA Growth Calculator',
    eyebrow: 'Health Savings Calculator',
    description:
      'Estimate how your HSA balance and annual contributions could grow over time with compounded investment returns.',
    inputs: [
      {
        id: 'current-hsa-balance',
        name: 'currentBalance',
        label: 'Current HSA balance',
        type: 'number',
        value: '10000',
        min: '0',
        step: '500',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-contribution',
        name: 'annualContribution',
        label: 'Annual contribution',
        type: 'number',
        value: '4300',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
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
    ],
    outputs: [
      {
        id: 'ending-balance-result',
        label: 'Ending HSA balance',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-contributions-result',
        label: 'Total contributions',
        initialValue: '$0.00',
      },
      {
        id: 'investment-growth-result',
        label: 'Investment growth',
        initialValue: '$0.00',
      },
      {
        id: 'triple-tax-advantaged-value-result',
        label: 'Estimated triple-tax-advantaged value',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How does the HSA growth calculator work?',
        answer:
          'It compounds the current HSA balance annually and adds the entered contribution at the end of each year.',
      },
      {
        question: 'Why is an HSA called triple-tax-advantaged?',
        answer:
          'HSAs can offer tax-deductible or pre-tax contributions, tax-deferred investment growth, and tax-free withdrawals for qualified medical expenses under applicable rules.',
      },
      {
        question: 'What is the estimated triple-tax-advantaged value?',
        answer:
          'It equals the projected ending balance and illustrates the amount that could potentially retain favorable tax treatment when used for qualified medical expenses.',
      },
      {
        question: 'Does this calculator include medical withdrawals?',
        answer:
          'No. It assumes the balance remains invested and does not model medical spending, account fees, taxes on nonqualified withdrawals, or changing contributions.',
      },
      {
        question: 'Does this calculator enforce HSA eligibility or contribution limits?',
        answer:
          'No. Eligibility and contribution limits can change and depend on coverage type, age, and other factors. Confirm current rules before contributing.',
      },
    ],
    relatedIds: [
      'ira-growth-calculator',
      '401k-growth-calculator',
      'taxable-vs-tax-advantaged-calculator',
    ],
  },
  '529-college-savings': {
    id: '529-college-savings',
    url: '/calculators/529-college-savings-calculator/',
    title: '529 College Savings Calculator',
    eyebrow: 'Education Savings Calculator',
    description:
      'Estimate how a 529 plan could grow with monthly contributions and compare the projected balance with your target college cost.',
    inputs: [
      {
        id: 'current-529-balance',
        name: 'currentBalance',
        label: 'Current 529 balance',
        type: 'number',
        value: '10000',
        min: '0',
        step: '500',
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
        id: 'expected-annual-return',
        name: 'expectedAnnualReturn',
        label: 'Expected annual return (%)',
        type: 'number',
        value: '6',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'years-until-college',
        name: 'yearsUntilCollege',
        label: 'Years until college',
        type: 'number',
        value: '15',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'target-college-cost',
        name: 'targetCollegeCost',
        label: 'Target college cost',
        type: 'number',
        value: '150000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'projected-balance-result',
        label: 'Projected 529 balance',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-contributions-result',
        label: 'Total contributions',
        initialValue: '$0.00',
      },
      {
        id: 'investment-growth-result',
        label: 'Investment growth',
        initialValue: '$0.00',
      },
      {
        id: 'surplus-shortfall-result',
        label: 'Surplus or shortfall vs target cost',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How does the 529 college savings calculator work?',
        answer:
          'It compounds the current balance monthly, adds the entered contribution at the end of each month, and compares the projected balance with your target cost.',
      },
      {
        question: 'What is a 529 plan?',
        answer:
          'A 529 plan is a tax-advantaged education savings account. Qualified withdrawals can generally be used tax-free for eligible education expenses, subject to plan and tax rules.',
      },
      {
        question: 'Does the target college cost increase with inflation?',
        answer:
          'No. Enter the future college cost you want to fund. If your estimate is in today’s dollars, adjust it separately for expected education inflation.',
      },
      {
        question: 'What does the surplus or shortfall show?',
        answer:
          'It is the projected 529 balance minus the target college cost. A positive amount is a surplus, while a negative amount is a shortfall.',
      },
      {
        question: 'Does this calculator include taxes, fees, or financial aid?',
        answer:
          'No. It does not model plan fees, taxes on nonqualified withdrawals, financial aid effects, changing contributions, or variable investment returns.',
      },
    ],
    relatedIds: [
      'compound-interest-calculator',
      'savings-goal-calculator',
      'investment-fee-calculator',
    ],
  },
  'college-cost-inflation': {
    id: 'college-cost-inflation',
    url: '/calculators/college-cost-inflation-calculator/',
    title: 'College Cost Inflation Calculator',
    eyebrow: 'Education Planning Calculator',
    description:
      'Estimate how education inflation could affect first-year and total college costs by the time enrollment begins.',
    inputs: [
      {
        id: 'current-annual-college-cost',
        name: 'currentAnnualCollegeCost',
        label: 'Current annual college cost',
        type: 'number',
        value: '30000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'education-inflation-rate',
        name: 'educationInflationRate',
        label: 'Education inflation rate (%)',
        type: 'number',
        value: '5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'years-until-college',
        name: 'yearsUntilCollege',
        label: 'Years until college',
        type: 'number',
        value: '15',
        min: '0',
        step: '1',
        required: true,
      },
      {
        id: 'number-of-college-years',
        name: 'numberOfCollegeYears',
        label: 'Number of college years',
        type: 'number',
        value: '4',
        min: '1',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'first-year-college-cost-result',
        label: 'Estimated first-year college cost',
        initialValue: '$0.00',
      },
      {
        id: 'total-college-cost-result',
        label: 'Estimated total college cost',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-increase-result',
        label: "Total increase from today's cost",
        initialValue: '$0.00',
      },
      {
        id: 'inflation-multiplier-result',
        label: 'Inflation multiplier',
        initialValue: '0.00x',
      },
    ],
    faq: [
      {
        question: 'How does the college cost inflation calculator work?',
        answer:
          'It grows today’s annual college cost until enrollment, then applies the same education inflation rate to each following college year and sums those projected costs.',
      },
      {
        question: 'What should current annual college cost include?',
        answer:
          'Use the annual amount you want to plan for, which may include tuition, fees, housing, meals, books, transportation, and other expected education expenses.',
      },
      {
        question: 'Why can education inflation differ from general inflation?',
        answer:
          'Tuition and other education expenses can change at a different pace than the broad consumer price index, so a separate planning assumption may be useful.',
      },
      {
        question: 'What does the inflation multiplier mean?',
        answer:
          'It compares the projected total college cost with the same number of years at today’s annual cost. For example, 1.50x means the projection is 50% higher.',
      },
      {
        question: 'Does this calculator include financial aid or investment growth?',
        answer:
          'No. It estimates future costs only and does not model scholarships, grants, loans, taxes, 529 investment returns, or changes in attendance plans.',
      },
    ],
    relatedIds: [
      '529-college-savings-calculator',
      'inflation-calculator',
      'savings-goal-calculator',
    ],
  },
  budget: {
    id: 'budget',
    url: '/calculators/budget-calculator/',
    title: 'Budget Calculator',
    eyebrow: 'Personal Finance Calculator',
    description:
      'Build a monthly budget, measure your savings and expense rates, and see whether your plan creates a surplus or deficit.',
    inputs: [
      {
        id: 'monthly-after-tax-income',
        name: 'monthlyIncome',
        label: 'Monthly after-tax income',
        type: 'number',
        value: '6000',
        min: '0.01',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'housing',
        name: 'housing',
        label: 'Housing',
        type: 'number',
        value: '1800',
        min: '0',
        step: '50',
        prefix: '$',
      },
      {
        id: 'food',
        name: 'food',
        label: 'Food',
        type: 'number',
        value: '600',
        min: '0',
        step: '10',
        prefix: '$',
      },
      {
        id: 'transportation',
        name: 'transportation',
        label: 'Transportation',
        type: 'number',
        value: '500',
        min: '0',
        step: '10',
        prefix: '$',
      },
      {
        id: 'insurance',
        name: 'insurance',
        label: 'Insurance',
        type: 'number',
        value: '400',
        min: '0',
        step: '10',
        prefix: '$',
      },
      {
        id: 'debt-payments',
        name: 'debtPayments',
        label: 'Debt payments',
        type: 'number',
        value: '300',
        min: '0',
        step: '10',
        prefix: '$',
      },
      {
        id: 'subscriptions',
        name: 'subscriptions',
        label: 'Subscriptions',
        type: 'number',
        value: '100',
        min: '0',
        step: '5',
        prefix: '$',
      },
      {
        id: 'entertainment',
        name: 'entertainment',
        label: 'Entertainment',
        type: 'number',
        value: '300',
        min: '0',
        step: '10',
        prefix: '$',
      },
      {
        id: 'other-expenses',
        name: 'otherExpenses',
        label: 'Other expenses',
        type: 'number',
        value: '200',
        min: '0',
        step: '10',
        prefix: '$',
      },
      {
        id: 'monthly-savings-investing',
        name: 'monthlySavings',
        label: 'Monthly savings/investing',
        type: 'number',
        value: '1000',
        min: '0',
        step: '50',
        prefix: '$',
      },
    ],
    outputs: [
      {
        id: 'total-expenses-result',
        label: 'Total monthly expenses',
        initialValue: '$0.00',
      },
      {
        id: 'total-savings-result',
        label: 'Total monthly savings',
        initialValue: '$0.00',
      },
      {
        id: 'surplus-deficit-result',
        label: 'Monthly surplus or deficit',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'savings-rate-result',
        label: 'Savings rate',
        initialValue: '0.00%',
      },
      {
        id: 'expense-ratio-result',
        label: 'Expense ratio',
        initialValue: '0.00%',
      },
    ],
    faq: [
      {
        question: 'How does the budget calculator work?',
        answer:
          'It totals your monthly expense categories and planned savings, subtracts both from after-tax income, and calculates savings and expense percentages.',
      },
      {
        question: 'What should count as monthly after-tax income?',
        answer:
          'Use the income available to spend after taxes and payroll deductions. Include reliable take-home pay and other recurring net income you use for your budget.',
      },
      {
        question: 'What does a monthly deficit mean?',
        answer:
          'A negative result means planned expenses and savings exceed monthly income. You may need to reduce spending, lower the savings target temporarily, or increase income.',
      },
      {
        question: 'What is a good savings rate?',
        answer:
          'There is no universal target. A sustainable rate depends on income, fixed costs, debt, goals, and life stage. Consistency and gradual improvement matter more than one benchmark.',
      },
      {
        question: 'Should debt payments count as expenses or savings?',
        answer:
          'Required debt payments belong in expenses here. Additional principal payments can also be treated as expenses, though some people track them separately as net-worth building.',
      },
    ],
    relatedIds: [
      'savings-rate-calculator',
      'emergency-fund-calculator',
      'net-worth-calculator',
    ],
  },
  'mortgage-payoff': {
    id: 'mortgage-payoff',
    url: '/calculators/mortgage-payoff-calculator/',
    title: 'Mortgage Payoff Calculator',
    eyebrow: 'Mortgage Calculator',
    description:
      'Estimate your mortgage payment and see how extra monthly payments could reduce interest and shorten your payoff timeline.',
    chart: true,
    inputs: [
      {
        id: 'loan-amount',
        name: 'loanAmount',
        label: 'Loan amount',
        type: 'number',
        value: '350000',
        min: '0.01',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-interest-rate',
        name: 'annualInterestRate',
        label: 'Annual interest rate (%)',
        type: 'number',
        value: '6.5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'loan-term-years',
        name: 'loanTermYears',
        label: 'Loan term (years)',
        type: 'number',
        value: '30',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'extra-monthly-payment',
        name: 'extraMonthlyPayment',
        label: 'Extra monthly payment (optional)',
        type: 'number',
        value: '',
        min: '0',
        step: '10',
        prefix: '$',
      },
    ],
    outputs: [
      {
        id: 'required-monthly-payment-result',
        label: 'Required monthly payment',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-interest-paid-result',
        label: 'Total interest paid',
        initialValue: '$0.00',
      },
      {
        id: 'total-amount-paid-result',
        label: 'Total amount paid',
        initialValue: '$0.00',
      },
      {
        id: 'time-saved-result',
        label: 'Time saved with extra payments',
        initialValue: '0 months',
      },
      {
        id: 'interest-saved-result',
        label: 'Interest saved with extra payments',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How is the required mortgage payment calculated?',
        answer:
          'It uses the standard fixed-rate amortization formula based on the loan amount, monthly interest rate, and total number of monthly payments.',
      },
      {
        question: 'How do extra monthly payments affect the mortgage?',
        answer:
          'Extra payments are applied to principal after the required payment, reducing the balance that future interest is calculated on and potentially shortening the loan.',
      },
      {
        question: 'What do total interest and total amount paid represent?',
        answer:
          'They show the accelerated payoff schedule when an extra payment is entered. With no extra payment, they show the baseline mortgage schedule.',
      },
      {
        question: 'Does this calculator include taxes, insurance, or fees?',
        answer:
          'No. The payment includes principal and interest only. Property taxes, homeowners insurance, mortgage insurance, HOA dues, closing costs, and lender fees are excluded.',
      },
      {
        question: 'Should I always pay off my mortgage early?',
        answer:
          'Not necessarily. Compare the guaranteed interest savings with liquidity needs, emergency savings, other debt, investment opportunities, taxes, and any prepayment restrictions.',
      },
    ],
    relatedIds: [
      'budget-calculator',
      'net-worth-calculator',
      'savings-goal-calculator',
    ],
  },
  'loan-payment': {
    id: 'loan-payment',
    url: '/calculators/loan-payment-calculator/',
    title: 'Loan Payment Calculator',
    eyebrow: 'Debt Calculator',
    description:
      'Estimate a fixed-rate loan payment and see how extra monthly payments could shorten payoff time and reduce interest.',
    inputs: [
      {
        id: 'loan-amount',
        name: 'loanAmount',
        label: 'Loan amount',
        type: 'number',
        value: '25000',
        min: '0.01',
        step: '500',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-interest-rate',
        name: 'annualInterestRate',
        label: 'Annual interest rate (%)',
        type: 'number',
        value: '8',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'loan-term-years',
        name: 'loanTermYears',
        label: 'Loan term (years)',
        type: 'number',
        value: '5',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'extra-monthly-payment',
        name: 'extraMonthlyPayment',
        label: 'Extra monthly payment',
        type: 'number',
        value: '0',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'required-monthly-payment-result',
        label: 'Required monthly payment',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-interest-paid-result',
        label: 'Total interest paid',
        initialValue: '$0.00',
      },
      {
        id: 'total-amount-paid-result',
        label: 'Total amount paid',
        initialValue: '$0.00',
      },
      {
        id: 'payoff-time-result',
        label: 'Payoff time with extra payment',
        initialValue: '0 months',
      },
      {
        id: 'interest-saved-result',
        label: 'Interest saved with extra payment',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How is the required monthly loan payment calculated?',
        answer:
          'The calculator uses the standard fixed-rate amortization formula with the loan amount, monthly interest rate, and total number of monthly payments.',
      },
      {
        question: 'What happens when I add an extra monthly payment?',
        answer:
          'The extra amount is applied to principal each month, reducing the balance sooner and generally lowering both payoff time and total interest.',
      },
      {
        question: 'How is a 0% interest loan handled?',
        answer:
          'The required payment is simply the loan amount divided by the number of monthly payments. Extra payments shorten the term but do not create interest savings.',
      },
      {
        question: 'What does total amount paid include?',
        answer:
          'It includes principal and interest under the accelerated schedule. Origination fees, late fees, insurance, taxes, and other lender charges are not included.',
      },
      {
        question: 'Can I use this for auto, personal, or student loans?',
        answer:
          'It can estimate any fixed-rate, fully amortizing loan with monthly payments. Loans with variable rates, deferred interest, balloon payments, or unusual fees need a different model.',
      },
    ],
    relatedIds: [
      'mortgage-payoff-calculator',
      'budget-calculator',
      'debt-payoff-calculator',
    ],
  },
  'debt-payoff': {
    id: 'debt-payoff',
    url: '/calculators/debt-payoff-calculator/',
    title: 'Debt Payoff Calculator',
    eyebrow: 'Debt Calculator',
    description:
      'Estimate how long it will take to pay off debt and how much interest an extra monthly payment could save.',
    chart: true,
    inputs: [
      {
        id: 'debt-balance',
        name: 'debtBalance',
        label: 'Debt balance',
        type: 'number',
        value: '15000',
        min: '0.01',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-interest-rate',
        name: 'annualInterestRate',
        label: 'Annual interest rate (%)',
        type: 'number',
        value: '18',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'monthly-payment',
        name: 'monthlyPayment',
        label: 'Monthly payment',
        type: 'number',
        value: '400',
        min: '0.01',
        step: '10',
        prefix: '$',
        required: true,
      },
      {
        id: 'extra-monthly-payment',
        name: 'extraMonthlyPayment',
        label: 'Extra monthly payment',
        type: 'number',
        value: '0',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'payoff-time-result',
        label: 'Payoff time',
        initialValue: '0 months',
        primary: true,
      },
      {
        id: 'total-interest-paid-result',
        label: 'Total interest paid',
        initialValue: '$0.00',
      },
      {
        id: 'total-amount-paid-result',
        label: 'Total amount paid',
        initialValue: '$0.00',
      },
      {
        id: 'interest-saved-result',
        label: 'Interest saved from extra payment',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How does the Debt Payoff Calculator work?',
        answer:
          'It adds monthly interest to the remaining balance, subtracts your payment, and repeats the process until the debt is paid. It compares that schedule with one that includes your extra payment.',
      },
      {
        question: 'Why can a debt payoff be unreachable?',
        answer:
          'If the monthly payment does not exceed the interest added each month, the principal will not decline. Increasing the payment or reducing the interest rate is necessary to create a payoff path.',
      },
      {
        question: 'How do extra payments reduce interest?',
        answer:
          'Extra payments reduce principal sooner. Because future interest is calculated from a smaller balance, you can pay less interest and become debt-free earlier.',
      },
      {
        question: 'Does this calculator include fees or changing rates?',
        answer:
          'No. It assumes a fixed interest rate and monthly payments with no late fees, annual fees, promotional rate changes, or new charges.',
      },
      {
        question: 'Should I pay the highest-rate debt first?',
        answer:
          'Paying the highest-rate debt first generally minimizes interest, while paying the smallest balance first may provide faster motivational wins. Keep minimum payments current on every debt.',
      },
    ],
    relatedIds: [
      'loan-payment-calculator',
      'budget-calculator',
      'net-worth-calculator',
    ],
  },
  'debt-snowball': {
    id: 'debt-snowball',
    url: '/calculators/debt-snowball-calculator/',
    title: 'Debt Snowball Calculator',
    eyebrow: 'Debt Calculator',
    description:
      'Build a debt snowball plan that targets the smallest balance first and rolls freed minimum payments into the next debt.',
    inputs: [
      {
        id: 'debt-1-balance',
        name: 'debt1Balance',
        label: 'Debt 1 balance',
        type: 'number',
        value: '1500',
        min: '0',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'debt-1-minimum-payment',
        name: 'debt1MinimumPayment',
        label: 'Debt 1 minimum monthly payment',
        type: 'number',
        value: '75',
        min: '0',
        step: '5',
        prefix: '$',
        required: true,
      },
      {
        id: 'debt-2-balance',
        name: 'debt2Balance',
        label: 'Debt 2 balance',
        type: 'number',
        value: '5000',
        min: '0',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'debt-2-minimum-payment',
        name: 'debt2MinimumPayment',
        label: 'Debt 2 minimum monthly payment',
        type: 'number',
        value: '150',
        min: '0',
        step: '5',
        prefix: '$',
        required: true,
      },
      {
        id: 'debt-3-balance',
        name: 'debt3Balance',
        label: 'Debt 3 balance',
        type: 'number',
        value: '10000',
        min: '0',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'debt-3-minimum-payment',
        name: 'debt3MinimumPayment',
        label: 'Debt 3 minimum monthly payment',
        type: 'number',
        value: '250',
        min: '0',
        step: '5',
        prefix: '$',
        required: true,
      },
      {
        id: 'extra-monthly-payment',
        name: 'extraMonthlyPayment',
        label: 'Extra monthly payment',
        type: 'number',
        value: '200',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'total-debt-result',
        label: 'Total debt',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-minimum-payments-result',
        label: 'Total minimum payments',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-payoff-time-result',
        label: 'Estimated payoff time',
        initialValue: '0 months',
      },
      {
        id: 'suggested-payoff-order-result',
        label: 'Suggested payoff order',
        initialValue: 'Enter at least one debt',
      },
    ],
    faq: [
      {
        question: 'What is the debt snowball method?',
        answer:
          'The debt snowball method pays minimums on every debt while directing extra money to the smallest balance. After that debt is cleared, its payment rolls into the next-smallest debt.',
      },
      {
        question: 'Why target the smallest balance first?',
        answer:
          'Clearing a small debt can create an early, visible win and simplify your monthly obligations. That momentum is the main behavioral advantage of the snowball method.',
      },
      {
        question: 'Does this calculator include interest?',
        answer:
          'This first version models simple monthly principal reduction and does not include interest. Actual payoff time may be longer when balances accrue interest.',
      },
      {
        question: 'What happens to a paid-off debt payment?',
        answer:
          'Its minimum payment remains in your fixed monthly debt budget and is redirected to the next active debt, making the snowball larger over time.',
      },
      {
        question: 'How is debt snowball different from debt avalanche?',
        answer:
          'Snowball prioritizes the smallest balance for motivation. Avalanche prioritizes the highest interest rate and generally minimizes interest when all other assumptions are equal.',
      },
    ],
    relatedIds: [
      'debt-payoff-calculator',
      'budget-calculator',
      'net-worth-calculator',
    ],
  },
  'debt-avalanche': {
    id: 'debt-avalanche',
    url: '/calculators/debt-avalanche-calculator/',
    title: 'Debt Avalanche Calculator',
    eyebrow: 'Debt Calculator',
    description:
      'Create a highest-interest-first debt payoff plan and estimate how long your fixed monthly debt budget could take to clear all balances.',
    inputs: [
      {
        id: 'debt-1-balance',
        name: 'debt1Balance',
        label: 'Debt 1 balance',
        type: 'number',
        value: '3000',
        min: '0',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'debt-1-interest-rate',
        name: 'debt1InterestRate',
        label: 'Debt 1 interest rate (%)',
        type: 'number',
        value: '24',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'debt-1-minimum-payment',
        name: 'debt1MinimumPayment',
        label: 'Debt 1 minimum monthly payment',
        type: 'number',
        value: '100',
        min: '0',
        step: '5',
        prefix: '$',
        required: true,
      },
      {
        id: 'debt-2-balance',
        name: 'debt2Balance',
        label: 'Debt 2 balance',
        type: 'number',
        value: '8000',
        min: '0',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'debt-2-interest-rate',
        name: 'debt2InterestRate',
        label: 'Debt 2 interest rate (%)',
        type: 'number',
        value: '12',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'debt-2-minimum-payment',
        name: 'debt2MinimumPayment',
        label: 'Debt 2 minimum monthly payment',
        type: 'number',
        value: '200',
        min: '0',
        step: '5',
        prefix: '$',
        required: true,
      },
      {
        id: 'debt-3-balance',
        name: 'debt3Balance',
        label: 'Debt 3 balance',
        type: 'number',
        value: '15000',
        min: '0',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'debt-3-interest-rate',
        name: 'debt3InterestRate',
        label: 'Debt 3 interest rate (%)',
        type: 'number',
        value: '6',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'debt-3-minimum-payment',
        name: 'debt3MinimumPayment',
        label: 'Debt 3 minimum monthly payment',
        type: 'number',
        value: '300',
        min: '0',
        step: '5',
        prefix: '$',
        required: true,
      },
      {
        id: 'extra-monthly-payment',
        name: 'extraMonthlyPayment',
        label: 'Extra monthly payment',
        type: 'number',
        value: '200',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'total-debt-result',
        label: 'Total debt',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-minimum-payments-result',
        label: 'Total minimum payments',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-payoff-time-result',
        label: 'Estimated payoff time',
        initialValue: '0 months',
      },
      {
        id: 'suggested-payoff-order-result',
        label: 'Suggested payoff order',
        initialValue: 'Enter at least one debt',
      },
      {
        id: 'highest-interest-debt-result',
        label: 'Highest interest debt to attack first',
        initialValue: 'Enter at least one debt',
      },
    ],
    faq: [
      {
        question: 'What is the debt avalanche method?',
        answer:
          'The debt avalanche method pays minimums on every debt and directs extra money to the active debt with the highest interest rate. Paid-off payments roll into the next-highest-rate debt.',
      },
      {
        question: 'Why target the highest interest rate first?',
        answer:
          'Reducing the most expensive balance first generally minimizes total interest and can shorten payoff time compared with strategies that ignore interest rates.',
      },
      {
        question: 'When is an avalanche plan unreachable?',
        answer:
          'A plan is unreachable when the monthly debt budget cannot reduce the combined balances after interest accrues. Increasing payments or lowering rates may restore a payoff path.',
      },
      {
        question: 'How are paid-off minimum payments handled?',
        answer:
          'The calculator keeps the original monthly debt budget constant, so a cleared debt’s minimum payment becomes available for the next active debt in avalanche order.',
      },
      {
        question: 'Is debt avalanche always better than debt snowball?',
        answer:
          'Avalanche usually saves more interest, while snowball may offer faster psychological wins. The best approach is one you can sustain while keeping every required payment current.',
      },
    ],
    relatedIds: [
      'debt-snowball-calculator',
      'debt-payoff-calculator',
      'budget-calculator',
    ],
  },
  'credit-card-interest': {
    id: 'credit-card-interest',
    url: '/calculators/credit-card-interest-calculator/',
    title: 'Credit Card Interest Calculator',
    eyebrow: 'Debt Calculator',
    description:
      'Estimate credit card payoff time, total interest, and how much an extra monthly payment could save.',
    inputs: [
      {
        id: 'credit-card-balance',
        name: 'creditCardBalance',
        label: 'Credit card balance',
        type: 'number',
        value: '5000',
        min: '0.01',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'apr',
        name: 'apr',
        label: 'APR (%)',
        type: 'number',
        value: '24',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'monthly-payment',
        name: 'monthlyPayment',
        label: 'Monthly payment',
        type: 'number',
        value: '200',
        min: '0.01',
        step: '10',
        prefix: '$',
        required: true,
      },
      {
        id: 'extra-monthly-payment',
        name: 'extraMonthlyPayment',
        label: 'Extra monthly payment',
        type: 'number',
        value: '0',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'payoff-time-result',
        label: 'Payoff time',
        initialValue: '0 months',
        primary: true,
      },
      {
        id: 'total-interest-paid-result',
        label: 'Total interest paid',
        initialValue: '$0.00',
      },
      {
        id: 'total-amount-paid-result',
        label: 'Total amount paid',
        initialValue: '$0.00',
      },
      {
        id: 'interest-saved-result',
        label: 'Interest saved with extra payment',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How is credit card interest calculated here?',
        answer:
          'The calculator converts APR to a monthly rate, adds interest to the remaining balance each month, and then subtracts your payment until the card is paid off.',
      },
      {
        question: 'How can an extra payment reduce credit card interest?',
        answer:
          'An extra payment reduces principal sooner, leaving a smaller balance for future interest charges. This can shorten payoff time and lower total interest.',
      },
      {
        question: 'Why might the payoff be unreachable?',
        answer:
          'If your payment does not exceed the monthly interest charge, the balance will not decline. You need a larger payment or lower APR to create a payoff path.',
      },
      {
        question: 'Does this match my card issuer’s exact calculation?',
        answer:
          'It is an estimate using monthly compounding. Issuers may calculate interest daily and may include fees, new purchases, promotional rates, or different statement timing.',
      },
      {
        question: 'Should I stop using the card while paying it off?',
        answer:
          'Avoiding new charges makes the estimate more useful and prevents the balance from growing. Keep required payments current and consider a realistic spending plan.',
      },
    ],
    relatedIds: [
      'debt-payoff-calculator',
      'debt-avalanche-calculator',
      'budget-calculator',
    ],
  },
  'auto-loan': {
    id: 'auto-loan',
    url: '/calculators/auto-loan-calculator/',
    title: 'Auto Loan Calculator',
    eyebrow: 'Loan Calculator',
    description:
      'Estimate your financed vehicle amount, monthly auto loan payment, total interest, and total loan cost.',
    inputs: [
      {
        id: 'vehicle-price',
        name: 'vehiclePrice',
        label: 'Vehicle price',
        type: 'number',
        value: '35000',
        min: '0.01',
        step: '500',
        prefix: '$',
        required: true,
      },
      {
        id: 'down-payment',
        name: 'downPayment',
        label: 'Down payment',
        type: 'number',
        value: '5000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'trade-in-value',
        name: 'tradeInValue',
        label: 'Trade-in value',
        type: 'number',
        value: '3000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'sales-tax-rate',
        name: 'salesTaxRate',
        label: 'Sales tax rate (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'loan-term-years',
        name: 'loanTermYears',
        label: 'Loan term (years)',
        type: 'number',
        value: '5',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'annual-interest-rate',
        name: 'annualInterestRate',
        label: 'Annual interest rate (%)',
        type: 'number',
        value: '6.5',
        min: '0',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'loan-amount-result',
        label: 'Loan amount',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'monthly-payment-result',
        label: 'Monthly payment',
        initialValue: '$0.00',
      },
      {
        id: 'total-interest-paid-result',
        label: 'Total interest paid',
        initialValue: '$0.00',
      },
      {
        id: 'total-cost-of-loan-result',
        label: 'Total cost of loan',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How is the auto loan amount calculated?',
        answer:
          'The calculator adds estimated sales tax to the vehicle price, then subtracts your down payment and trade-in value to estimate the amount financed.',
      },
      {
        question: 'How is the monthly auto payment calculated?',
        answer:
          'It uses the standard fixed-rate amortization formula based on the financed amount, monthly interest rate, and number of monthly payments.',
      },
      {
        question: 'Does a larger down payment reduce interest?',
        answer:
          'Yes. A larger down payment reduces the amount financed, which generally lowers both the monthly payment and total interest paid.',
      },
      {
        question: 'Does this include dealer fees and registration costs?',
        answer:
          'No. The estimate includes vehicle price and sales tax only. Dealer fees, registration, title costs, warranties, insurance, and other charges are excluded.',
      },
      {
        question: 'Should I choose a longer auto loan term?',
        answer:
          'A longer term can lower the monthly payment but usually increases total interest and the risk of owing more than the vehicle is worth.',
      },
    ],
    relatedIds: [
      'loan-payment-calculator',
      'debt-payoff-calculator',
      'budget-calculator',
    ],
  },
  refinance: {
    id: 'refinance',
    url: '/calculators/refinance-calculator/',
    title: 'Refinance Calculator',
    eyebrow: 'Loan Calculator',
    description:
      'Compare current and refinanced loan payments, estimate break-even time, and measure potential lifetime interest savings.',
    inputs: [
      {
        id: 'current-loan-balance',
        name: 'currentLoanBalance',
        label: 'Current loan balance',
        type: 'number',
        value: '300000',
        min: '0.01',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'current-interest-rate',
        name: 'currentInterestRate',
        label: 'Current annual interest rate (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'current-remaining-term',
        name: 'currentRemainingTerm',
        label: 'Current remaining loan term (years)',
        type: 'number',
        value: '25',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'new-interest-rate',
        name: 'newInterestRate',
        label: 'New annual interest rate (%)',
        type: 'number',
        value: '5.5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'new-loan-term',
        name: 'newLoanTerm',
        label: 'New loan term (years)',
        type: 'number',
        value: '20',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'closing-costs',
        name: 'closingCosts',
        label: 'Closing costs / refinance fees',
        type: 'number',
        value: '6000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'current-monthly-payment-result',
        label: 'Current monthly payment',
        initialValue: '$0.00',
      },
      {
        id: 'new-monthly-payment-result',
        label: 'New monthly payment',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'monthly-savings-result',
        label: 'Monthly savings',
        initialValue: '$0.00',
      },
      {
        id: 'break-even-time-result',
        label: 'Break-even time',
        initialValue: '0 months',
      },
      {
        id: 'total-interest-saved-result',
        label: 'Total interest saved',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How is refinance break-even time calculated?',
        answer:
          'Break-even time divides closing costs by monthly payment savings. It estimates how long the lower payment must continue before recovering upfront refinance costs.',
      },
      {
        question: 'What if refinancing does not lower my monthly payment?',
        answer:
          'There is no payment-based break-even point when monthly savings are zero or negative. A refinance may still have other goals, but its total costs and loan term need careful review.',
      },
      {
        question: 'Can a lower interest rate still cost more overall?',
        answer:
          'Yes. Extending the repayment term can increase lifetime interest even with a lower rate, especially after adding closing costs.',
      },
      {
        question: 'What costs should I include as refinance fees?',
        answer:
          'Include lender fees, appraisal, title services, recording charges, points, and other costs paid to complete the refinance.',
      },
      {
        question: 'Does this calculator include taxes or escrow changes?',
        answer:
          'No. It compares principal and interest only. Property taxes, insurance, escrow adjustments, prepayment penalties, and tax consequences are excluded.',
      },
    ],
    relatedIds: [
      'mortgage-payoff-calculator',
      'loan-payment-calculator',
      'auto-loan-calculator',
    ],
  },
  'student-loan': {
    id: 'student-loan',
    url: '/calculators/student-loan-calculator/',
    title: 'Student Loan Calculator',
    eyebrow: 'Loan Calculator',
    description:
      'Estimate student loan payments, payoff time, total interest, and the savings available from extra monthly payments.',
    inputs: [
      {
        id: 'student-loan-balance',
        name: 'studentLoanBalance',
        label: 'Student loan balance',
        type: 'number',
        value: '40000',
        min: '0.01',
        step: '500',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-interest-rate',
        name: 'annualInterestRate',
        label: 'Annual interest rate (%)',
        type: 'number',
        value: '6.5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'loan-term-years',
        name: 'loanTermYears',
        label: 'Loan term (years)',
        type: 'number',
        value: '10',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'monthly-extra-payment',
        name: 'monthlyExtraPayment',
        label: 'Monthly extra payment',
        type: 'number',
        value: '0',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'required-monthly-payment-result',
        label: 'Required monthly payment',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'total-interest-paid-result',
        label: 'Total interest paid',
        initialValue: '$0.00',
      },
      {
        id: 'total-amount-paid-result',
        label: 'Total amount paid',
        initialValue: '$0.00',
      },
      {
        id: 'payoff-time-result',
        label: 'Payoff time with extra payment',
        initialValue: '0 months',
      },
      {
        id: 'interest-saved-result',
        label: 'Interest saved with extra payment',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How is the required student loan payment calculated?',
        answer:
          'The calculator uses the standard fixed-rate amortization formula based on your balance, monthly interest rate, and total number of monthly payments.',
      },
      {
        question: 'How do extra student loan payments help?',
        answer:
          'Extra payments reduce principal sooner, which can shorten the payoff timeline and lower the total interest charged over the loan.',
      },
      {
        question: 'Does this work for federal and private student loans?',
        answer:
          'It can estimate a fixed-rate loan with regular monthly payments. Income-driven repayment, variable rates, deferment, forgiveness, subsidies, and fees require a more specialized model.',
      },
      {
        question: 'Should I pay student loans off early?',
        answer:
          'Consider the loan rate, emergency savings, employer benefits, forgiveness eligibility, tax treatment, and other financial goals before directing extra cash to repayment.',
      },
      {
        question: 'Does the estimate include capitalization or fees?',
        answer:
          'No. The calculation assumes one current principal balance and a fixed rate. Origination fees, changing rates, future capitalization, and payment pauses are excluded.',
      },
    ],
    relatedIds: [
      'loan-payment-calculator',
      'debt-payoff-calculator',
      'refinance-calculator',
    ],
  },
  'student-loan-payoff': {
    id: 'student-loan-payoff',
    url: '/calculators/student-loan-payoff-calculator/',
    title: 'Student Loan Payoff Calculator',
    eyebrow: 'Loan Calculator',
    description:
      'Estimate student loan payoff time, total interest, and how much an extra monthly payment could save.',
    inputs: [
      {
        id: 'student-loan-balance',
        name: 'studentLoanBalance',
        label: 'Student loan balance',
        type: 'number',
        value: '40000',
        min: '0.01',
        step: '500',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-interest-rate',
        name: 'annualInterestRate',
        label: 'Annual interest rate (%)',
        type: 'number',
        value: '6.5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'current-monthly-payment',
        name: 'currentMonthlyPayment',
        label: 'Current monthly payment',
        type: 'number',
        value: '500',
        min: '0.01',
        step: '10',
        prefix: '$',
        required: true,
      },
      {
        id: 'extra-monthly-payment',
        name: 'extraMonthlyPayment',
        label: 'Extra monthly payment',
        type: 'number',
        value: '0',
        min: '0',
        step: '10',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'payoff-time-result',
        label: 'Payoff time',
        initialValue: '0 months',
        primary: true,
      },
      {
        id: 'total-interest-paid-result',
        label: 'Total interest paid',
        initialValue: '$0.00',
      },
      {
        id: 'total-amount-paid-result',
        label: 'Total amount paid',
        initialValue: '$0.00',
      },
      {
        id: 'interest-saved-result',
        label: 'Interest saved with extra payment',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How does the Student Loan Payoff Calculator work?',
        answer:
          'It adds monthly interest to the remaining balance, subtracts your payment, and repeats until the loan is paid. It compares your current payment with a payment that includes the extra amount.',
      },
      {
        question: 'How much can an extra student loan payment save?',
        answer:
          'The savings depend on your balance, interest rate, current payment, and extra payment. Paying principal sooner generally reduces both payoff time and total interest.',
      },
      {
        question: 'Why might my student loan payoff be unreachable?',
        answer:
          'If the monthly payment does not exceed the interest added each month, the principal cannot decline. A larger payment or lower interest rate is needed.',
      },
      {
        question: 'Can I use this for income-driven repayment?',
        answer:
          'This calculator assumes fixed monthly payments and a fixed interest rate. Income-driven plans, forgiveness, subsidies, deferment, and payment changes require a specialized estimate.',
      },
      {
        question: 'Should I refinance before making extra payments?',
        answer:
          'Refinancing may lower the rate, but federal protections and forgiveness options can be lost. Compare the new terms, fees, benefits, and repayment flexibility carefully.',
      },
    ],
    relatedIds: [
      'student-loan-calculator',
      'debt-payoff-calculator',
      'refinance-calculator',
    ],
  },
  heloc: {
    id: 'heloc',
    url: '/calculators/heloc-calculator/',
    title: 'HELOC Calculator',
    eyebrow: 'Home Equity Calculator',
    description:
      'Estimate your available home equity line of credit, interest-only payment, and whether a requested HELOC fits within a target combined loan-to-value ratio.',
    inputs: [
      {
        id: 'home-value',
        name: 'homeValue',
        label: 'Home value',
        type: 'number',
        value: '500000',
        min: '0.01',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'current-mortgage-balance',
        name: 'currentMortgageBalance',
        label: 'Current mortgage balance',
        type: 'number',
        value: '300000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'maximum-cltv',
        name: 'maximumCltv',
        label: 'Maximum combined loan-to-value ratio (%)',
        type: 'number',
        value: '85',
        min: '0.01',
        step: '0.01',
        required: true,
      },
      {
        id: 'requested-heloc-amount',
        name: 'requestedHelocAmount',
        label: 'HELOC amount requested',
        type: 'number',
        value: '75000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-interest-rate',
        name: 'annualInterestRate',
        label: 'Annual interest rate (%)',
        type: 'number',
        value: '8.5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'draw-period-years',
        name: 'drawPeriodYears',
        label: 'Draw period interest-only years',
        type: 'number',
        value: '10',
        min: '1',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'maximum-available-heloc-result',
        label: 'Maximum available HELOC',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'available-equity-result',
        label: 'Available equity',
        initialValue: '$0.00',
      },
      {
        id: 'interest-only-monthly-payment-result',
        label: 'Interest-only monthly payment',
        initialValue: '$0.00',
      },
      {
        id: 'approval-buffer-result',
        label: 'Approval buffer or shortfall',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'How much HELOC might I qualify for?',
        answer:
          'This calculator applies your maximum combined loan-to-value ratio to the home value, then subtracts the current mortgage balance. Lenders also consider income, credit, debts, property type, and underwriting rules.',
      },
      {
        question: 'What is combined loan-to-value ratio?',
        answer:
          'Combined loan-to-value, or CLTV, compares all loans secured by the home with its value. It includes the first mortgage plus the proposed HELOC limit.',
      },
      {
        question: 'How is the interest-only HELOC payment estimated?',
        answer:
          'The estimate multiplies the requested HELOC amount by the annual interest rate and divides by 12. Actual payments can change because most HELOC rates are variable and interest is charged on the amount drawn.',
      },
      {
        question: 'What happens after the HELOC draw period?',
        answer:
          'After the draw period, borrowing usually stops and principal repayment begins. The monthly payment can rise significantly depending on the remaining balance, rate, and repayment term.',
      },
      {
        question: 'Does available home equity equal available borrowing?',
        answer:
          'No. Total equity is home value minus the mortgage balance, while borrowing is usually limited by the lender’s maximum CLTV and other qualification requirements.',
      },
    ],
    relatedIds: [
      'mortgage-payoff-calculator',
      'refinance-calculator',
      'net-worth-calculator',
    ],
  },
  'rent-vs-buy': {
    id: 'rent-vs-buy',
    url: '/calculators/rent-vs-buy-calculator/',
    title: 'Rent vs Buy Calculator',
    eyebrow: 'Housing Calculator',
    description:
      'Compare the estimated net cost of renting with buying a home, including mortgage payments, ownership expenses, home equity, appreciation, and down payment opportunity cost.',
    inputs: [
      {
        id: 'monthly-rent',
        name: 'monthlyRent',
        label: 'Monthly rent',
        type: 'number',
        value: '2500',
        min: '0',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'home-purchase-price',
        name: 'homePurchasePrice',
        label: 'Home purchase price',
        type: 'number',
        value: '500000',
        min: '0.01',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'down-payment',
        name: 'downPayment',
        label: 'Down payment',
        type: 'number',
        value: '100000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'mortgage-interest-rate',
        name: 'mortgageInterestRate',
        label: 'Mortgage interest rate (%)',
        type: 'number',
        value: '6.5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'loan-term-years',
        name: 'loanTermYears',
        label: 'Loan term (years)',
        type: 'number',
        value: '30',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'property-tax-rate',
        name: 'propertyTaxRate',
        label: 'Property tax rate (%)',
        type: 'number',
        value: '1.2',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'home-insurance-per-year',
        name: 'homeInsurancePerYear',
        label: 'Home insurance per year',
        type: 'number',
        value: '2000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'hoa-per-month',
        name: 'hoaPerMonth',
        label: 'HOA per month',
        type: 'number',
        value: '0',
        min: '0',
        step: '25',
        prefix: '$',
        required: true,
      },
      {
        id: 'maintenance-rate',
        name: 'maintenanceRate',
        label: 'Maintenance rate (%)',
        type: 'number',
        value: '1',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'home-appreciation',
        name: 'homeAppreciation',
        label: 'Expected home appreciation (%)',
        type: 'number',
        value: '3',
        step: '0.01',
        required: true,
      },
      {
        id: 'investment-return',
        name: 'investmentReturn',
        label: 'Expected investment return (%)',
        type: 'number',
        value: '7',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'comparison-years',
        name: 'comparisonYears',
        label: 'Number of years to compare',
        type: 'number',
        value: '10',
        min: '1',
        step: '1',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'total-renting-cost-result',
        label: 'Total cost of renting',
        initialValue: '$0.00',
      },
      {
        id: 'total-buying-cost-result',
        label: 'Total cost of buying',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-home-equity-result',
        label: 'Estimated home equity',
        initialValue: '$0.00',
      },
      {
        id: 'rent-vs-buy-difference-result',
        label: 'Rent vs buy difference',
        initialValue: '$0.00',
      },
      {
        id: 'better-option-result',
        label: 'Better option under assumptions',
        initialValue: '—',
        primary: true,
      },
    ],
    faq: [
      {
        question: 'How does this calculator compare renting and buying?',
        answer:
          'It compares rent payments with the net cost of buying. Buying includes the down payment, mortgage payments, property tax, insurance, HOA, maintenance, and foregone investment growth, then subtracts estimated home equity.',
      },
      {
        question: 'Why is home equity subtracted from buying costs?',
        answer:
          'Home equity is an asset retained after the comparison period. It equals the estimated home value minus the remaining mortgage balance, so subtracting it avoids treating principal payments as a pure expense.',
      },
      {
        question: 'How is the down payment opportunity cost calculated?',
        answer:
          'The calculator estimates how much the down payment could have grown at the entered investment return and counts the growth that was forgone as an additional cost of buying.',
      },
      {
        question: 'Does this calculator include closing or selling costs?',
        answer:
          'No. Closing costs, real estate commissions, rent increases, tax deductions, mortgage insurance, utilities, and major renovations are excluded because they are not among the provided inputs.',
      },
      {
        question: 'Does a lower calculated cost guarantee the better choice?',
        answer:
          'No. The result depends heavily on appreciation, investment returns, maintenance, financing, and how long you stay. Flexibility, location, risk, and lifestyle preferences also matter.',
      },
    ],
    relatedIds: [
      'mortgage-payoff-calculator',
      'heloc-calculator',
      'investment-fee-calculator',
    ],
  },
  'home-affordability': {
    id: 'home-affordability',
    url: '/calculators/home-affordability-calculator/',
    title: 'Home Affordability Calculator',
    eyebrow: 'Mortgage Calculator',
    description:
      'Estimate an affordable home price from your income, debts, down payment, mortgage terms, recurring housing costs, and maximum debt-to-income ratio.',
    inputs: [
      {
        id: 'annual-gross-income',
        name: 'annualGrossIncome',
        label: 'Annual gross income',
        type: 'number',
        value: '120000',
        min: '0.01',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-debt-payments',
        name: 'monthlyDebtPayments',
        label: 'Monthly debt payments',
        type: 'number',
        value: '500',
        min: '0',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'down-payment',
        name: 'downPayment',
        label: 'Down payment',
        type: 'number',
        value: '80000',
        min: '0',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'mortgage-interest-rate',
        name: 'mortgageInterestRate',
        label: 'Mortgage interest rate (%)',
        type: 'number',
        value: '6.5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'loan-term-years',
        name: 'loanTermYears',
        label: 'Loan term (years)',
        type: 'number',
        value: '30',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'property-tax-rate',
        name: 'propertyTaxRate',
        label: 'Property tax rate (%)',
        type: 'number',
        value: '1.2',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'home-insurance-per-year',
        name: 'homeInsurancePerYear',
        label: 'Home insurance per year',
        type: 'number',
        value: '2000',
        min: '0',
        step: '100',
        prefix: '$',
        required: true,
      },
      {
        id: 'hoa-per-month',
        name: 'hoaPerMonth',
        label: 'HOA per month',
        type: 'number',
        value: '0',
        min: '0',
        step: '25',
        prefix: '$',
        required: true,
      },
      {
        id: 'maximum-dti',
        name: 'maximumDti',
        label: 'Maximum debt-to-income ratio (%)',
        type: 'number',
        value: '36',
        min: '0.01',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'affordable-home-price-result',
        label: 'Estimated affordable home price',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'monthly-mortgage-payment-result',
        label: 'Estimated monthly mortgage payment',
        initialValue: '$0.00',
      },
      {
        id: 'total-monthly-housing-cost-result',
        label: 'Estimated total monthly housing cost',
        initialValue: '$0.00',
      },
      {
        id: 'dti-result',
        label: 'Debt-to-income ratio',
        initialValue: '0.00%',
      },
    ],
    faq: [
      {
        question: 'How is the affordable home price estimated?',
        answer:
          'The calculator determines the monthly debt limit from gross income and the selected DTI cap, subtracts existing monthly debts, and searches for the highest home price whose mortgage, property tax, insurance, and HOA fit the remaining budget.',
      },
      {
        question: 'What does debt-to-income ratio mean?',
        answer:
          'DTI is the percentage of gross monthly income used for recurring debt and housing payments. Lenders use it alongside credit, assets, loan type, and other underwriting factors.',
      },
      {
        question: 'How does a larger down payment affect affordability?',
        answer:
          'A larger down payment reduces the mortgage principal and monthly principal-and-interest payment, which can support a higher purchase price under the same monthly housing limit.',
      },
      {
        question: 'Are property tax, insurance, and HOA included?',
        answer:
          'Yes. Property tax is estimated from the home price, while annual insurance and monthly HOA costs are added to the mortgage payment when solving for affordability.',
      },
      {
        question: 'Is this the same as a mortgage preapproval?',
        answer:
          'No. This is an estimate. A lender may also consider credit history, cash reserves, employment, loan limits, mortgage insurance, closing costs, and program-specific qualification rules.',
      },
    ],
    relatedIds: [
      'mortgage-payoff-calculator',
      'rent-vs-buy-calculator',
      'budget-calculator',
    ],
  },
  'down-payment': {
    id: 'down-payment',
    url: '/calculators/down-payment-calculator/',
    title: 'Down Payment Calculator',
    eyebrow: 'Home Savings Calculator',
    description:
      'Calculate a target home down payment and estimate how long it may take to reach it using current savings, monthly contributions, and an expected savings return.',
    inputs: [
      {
        id: 'home-purchase-price',
        name: 'homePurchasePrice',
        label: 'Home purchase price',
        type: 'number',
        value: '500000',
        min: '0.01',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'down-payment-percentage',
        name: 'downPaymentPercentage',
        label: 'Down payment percentage (%)',
        type: 'number',
        value: '20',
        min: '0.01',
        step: '0.01',
        required: true,
      },
      {
        id: 'current-savings',
        name: 'currentSavings',
        label: 'Current savings',
        type: 'number',
        value: '30000',
        min: '0',
        step: '500',
        prefix: '$',
        required: true,
      },
      {
        id: 'monthly-savings-contribution',
        name: 'monthlySavingsContribution',
        label: 'Monthly savings contribution',
        type: 'number',
        value: '1500',
        min: '0',
        step: '50',
        prefix: '$',
        required: true,
      },
      {
        id: 'expected-savings-return',
        name: 'expectedSavingsReturn',
        label: 'Expected annual savings return (%)',
        type: 'number',
        value: '4',
        min: '0',
        step: '0.01',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'target-down-payment-result',
        label: 'Target down payment amount',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'amount-still-needed-result',
        label: 'Amount still needed',
        initialValue: '$0.00',
      },
      {
        id: 'estimated-months-result',
        label: 'Estimated months to reach target',
        initialValue: '—',
      },
      {
        id: 'estimated-completion-date-result',
        label: 'Estimated completion date',
        initialValue: '—',
      },
    ],
    faq: [
      {
        question: 'How is the target down payment calculated?',
        answer:
          'The calculator multiplies the home purchase price by the selected down payment percentage. For example, 20% of a $500,000 home is a $100,000 target.',
      },
      {
        question: 'How does investment return affect the timeline?',
        answer:
          'When the expected return is above zero, the calculator applies monthly compounding to current savings and monthly contributions. Actual savings-account or investment returns can vary.',
      },
      {
        question: 'What happens if my current savings already meet the target?',
        answer:
          'The result is marked completed, the amount still needed is zero, and no additional saving months are required.',
      },
      {
        question: 'Does the target include closing costs?',
        answer:
          'No. The target covers only the entered down payment percentage. Consider saving separately for closing costs, inspections, moving expenses, repairs, and an emergency reserve.',
      },
      {
        question: 'Is a 20% down payment always required?',
        answer:
          'No. Requirements vary by loan program and lender. A smaller down payment may be possible, but it can affect mortgage insurance, monthly payments, rates, and qualification.',
      },
    ],
    relatedIds: [
      'home-affordability-calculator',
      'mortgage-payoff-calculator',
      'savings-goal-calculator',
    ],
  },
  'mortgage-recast': {
    id: 'mortgage-recast',
    url: '/calculators/mortgage-recast-calculator/',
    title: 'Mortgage Recast Calculator',
    eyebrow: 'Mortgage Calculator',
    description:
      'Estimate how a mortgage recast after a lump-sum principal payment could reduce your monthly payment and remaining interest cost.',
    inputs: [
      {
        id: 'current-mortgage-balance',
        name: 'currentMortgageBalance',
        label: 'Current mortgage balance',
        type: 'number',
        value: '350000',
        min: '0.01',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'annual-interest-rate',
        name: 'annualInterestRate',
        label: 'Annual interest rate (%)',
        type: 'number',
        value: '6.5',
        min: '0',
        step: '0.01',
        required: true,
      },
      {
        id: 'remaining-loan-term',
        name: 'remainingLoanTerm',
        label: 'Remaining loan term (years)',
        type: 'number',
        value: '25',
        min: '1',
        step: '1',
        required: true,
      },
      {
        id: 'lump-sum-recast-payment',
        name: 'lumpSumRecastPayment',
        label: 'Lump sum recast payment',
        type: 'number',
        value: '50000',
        min: '0.01',
        step: '1000',
        prefix: '$',
        required: true,
      },
      {
        id: 'recast-fee',
        name: 'recastFee',
        label: 'Recast fee',
        type: 'number',
        value: '250',
        min: '0',
        step: '25',
        prefix: '$',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'current-monthly-payment-result',
        label: 'Current monthly payment',
        initialValue: '$0.00',
      },
      {
        id: 'new-monthly-payment-result',
        label: 'New monthly payment after recast',
        initialValue: '$0.00',
        primary: true,
      },
      {
        id: 'monthly-payment-reduction-result',
        label: 'Monthly payment reduction',
        initialValue: '$0.00',
      },
      {
        id: 'total-interest-saved-result',
        label: 'Total interest saved',
        initialValue: '$0.00',
      },
    ],
    faq: [
      {
        question: 'What is a mortgage recast?',
        answer:
          'A recast applies a lump-sum principal payment and recalculates the monthly principal-and-interest payment over the remaining term at the existing interest rate.',
      },
      {
        question: 'How is a recast different from refinancing?',
        answer:
          'A recast keeps the current loan, rate, and remaining term. Refinancing replaces the loan and may change the rate or term but usually involves more underwriting and closing costs.',
      },
      {
        question: 'Does a mortgage recast shorten the loan term?',
        answer:
          'Usually no. The scheduled remaining term stays the same while the required monthly payment falls. Continuing to pay the old amount could pay the loan off sooner.',
      },
      {
        question: 'How is interest saved calculated?',
        answer:
          'The calculator compares projected remaining interest before and after the lump-sum payment, then includes the recast fee in the post-recast cost.',
      },
      {
        question: 'Can every mortgage be recast?',
        answer:
          'No. Eligibility, minimum principal payments, fees, timing, and loan restrictions vary by lender and loan type. Confirm the actual terms with your mortgage servicer.',
      },
    ],
    relatedIds: [
      'mortgage-payoff-calculator',
      'refinance-calculator',
      'down-payment-calculator',
    ],
  },
};

export const compoundInterestCalculator = calculatorConfigs['compound-interest'];
export const dailyCompoundInterestCalculator =
  calculatorConfigs['daily-compound-interest'];
export const monthlyCompoundInterestCalculator =
  calculatorConfigs['monthly-compound-interest'];
export const quarterlyCompoundInterestCalculator =
  calculatorConfigs['quarterly-compound-interest'];
export const annualCompoundInterestCalculator =
  calculatorConfigs['annual-compound-interest'];
export const apyCalculator = calculatorConfigs.apy;
export const investmentGrowthCalculator =
  calculatorConfigs['investment-growth'];
export const savingsGrowthCalculator =
  calculatorConfigs['savings-growth'];
export const savingsRateCalculator = calculatorConfigs['savings-rate'];
export const fireCalculator = calculatorConfigs.fire;
export const coastFireCalculator = calculatorConfigs['coast-fire'];
export const fourPercentRuleCalculator =
  calculatorConfigs['four-percent-rule'];
export const retirementWithdrawalCalculator =
  calculatorConfigs['retirement-withdrawal'];
export const ruleOf72Calculator = calculatorConfigs['rule-of-72'];
export const inflationCalculator = calculatorConfigs.inflation;
export const expenseRatioCalculator = calculatorConfigs['expense-ratio'];
export const investmentFeeCalculator = calculatorConfigs['investment-fee'];
export const netWorthCalculator = calculatorConfigs['net-worth'];
export const cagrCalculator = calculatorConfigs.cagr;
export const etfFeeDragCalculator = calculatorConfigs['etf-fee-drag'];
export const dividendYieldCalculator = calculatorConfigs['dividend-yield'];
export const dividendGrowthCalculator = calculatorConfigs['dividend-growth'];
export const dripCalculator = calculatorConfigs.drip;
export const lumpSumVsDcaCalculator =
  calculatorConfigs['lump-sum-vs-dca'];
export const emergencyFundCalculator = calculatorConfigs['emergency-fund'];
export const savingsGoalCalculator = calculatorConfigs['savings-goal'];
export const realRateOfReturnCalculator =
  calculatorConfigs['real-rate-of-return'];
export const inflationAdjustedReturnCalculator =
  calculatorConfigs['inflation-adjusted-return'];
export const financialIndependenceDateCalculator =
  calculatorConfigs['financial-independence-date'];
export const leanFireCalculator = calculatorConfigs['lean-fire'];
export const fatFireCalculator = calculatorConfigs['fat-fire'];
export const baristaFireCalculator = calculatorConfigs['barista-fire'];
export const safeWithdrawalRateCalculator =
  calculatorConfigs['safe-withdrawal-rate'];
export const yearsToRetirementCalculator =
  calculatorConfigs['years-to-retirement'];
export const retirementIncomeGapCalculator =
  calculatorConfigs['retirement-income-gap'];
export const portfolioWithdrawalSustainabilityCalculator =
  calculatorConfigs['portfolio-withdrawal-sustainability'];
export const retirementTaxDragCalculator =
  calculatorConfigs['retirement-tax-drag'];
export const rothVsTraditionalIraCalculator =
  calculatorConfigs['roth-vs-traditional-ira'];
export const fourOhOneKGrowthCalculator = calculatorConfigs['401k-growth'];
export const iraGrowthCalculator = calculatorConfigs['ira-growth'];
export const taxableVsTaxAdvantagedCalculator =
  calculatorConfigs['taxable-vs-tax-advantaged'];
export const hsaGrowthCalculator = calculatorConfigs['hsa-growth'];
export const collegeSavings529Calculator =
  calculatorConfigs['529-college-savings'];
export const collegeCostInflationCalculator =
  calculatorConfigs['college-cost-inflation'];
export const budgetCalculator = calculatorConfigs.budget;
export const mortgagePayoffCalculator =
  calculatorConfigs['mortgage-payoff'];
export const loanPaymentCalculator = calculatorConfigs['loan-payment'];
export const debtPayoffCalculator = calculatorConfigs['debt-payoff'];
export const debtSnowballCalculator = calculatorConfigs['debt-snowball'];
export const debtAvalancheCalculator = calculatorConfigs['debt-avalanche'];
export const creditCardInterestCalculator =
  calculatorConfigs['credit-card-interest'];
export const autoLoanCalculator = calculatorConfigs['auto-loan'];
export const refinanceCalculator = calculatorConfigs.refinance;
export const studentLoanCalculator = calculatorConfigs['student-loan'];
export const studentLoanPayoffCalculator =
  calculatorConfigs['student-loan-payoff'];
export const helocCalculator = calculatorConfigs.heloc;
export const rentVsBuyCalculator = calculatorConfigs['rent-vs-buy'];
export const homeAffordabilityCalculator =
  calculatorConfigs['home-affordability'];
export const downPaymentCalculator = calculatorConfigs['down-payment'];
export const mortgageRecastCalculator =
  calculatorConfigs['mortgage-recast'];
