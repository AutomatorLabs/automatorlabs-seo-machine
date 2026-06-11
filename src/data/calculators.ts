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
};

export const compoundInterestCalculator = calculatorConfigs['compound-interest'];
