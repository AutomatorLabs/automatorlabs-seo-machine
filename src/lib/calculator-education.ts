import type {
  CalculatorFaq,
  CalculatorInput,
  CalculatorOutput,
  CalculatorResultExplanation,
} from '../data/calculators';

function joinLabels(labels: string[]): string {
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(', ')}, and ${labels.at(-1)}`;
}

export interface CalculatorHowItWorks {
  purpose: string;
  inputs: string;
  method: string;
  interpretation: string;
}

const repeatedFaqQuestions = new Set([
  'What is the 4% rule?',
  'What is a safe withdrawal rate?',
]);

export function createCalculatorHowItWorks(
  title: string,
  description: string,
  inputs: CalculatorInput[],
  outputs: CalculatorOutput[],
): CalculatorHowItWorks {
  const inputLabels = inputs.map((input) => input.label.toLowerCase());
  const outputLabels = outputs.map((output) => output.label.toLowerCase());

  return {
    purpose: description,
    inputs: `The estimate uses ${joinLabels(inputLabels)}.`,
    method: `The calculator applies the relationships defined for the ${title.toLowerCase()} to those inputs and updates ${joinLabels(outputLabels)}.`,
    interpretation: `Treat the result as a scenario based on the values entered. Compare a few reasonable inputs and consider costs, taxes, timing, or risks that the calculator does not include.`,
  };
}

export function createCalculatorFaqs(
  title: string,
  description: string,
  inputs: CalculatorInput[],
  outputs: CalculatorOutput[],
  faq: CalculatorFaq[],
): CalculatorFaq[] {
  const normalizedFaq = faq.map((item) => ({
    ...item,
    question: repeatedFaqQuestions.has(item.question)
      ? `${item.question.replace(/\?$/, '')} in the ${title}?`
      : item.question,
  }));
  const primaryOutput = outputs.find((output) => output.primary) ?? outputs[0];
  const keyInputs = joinLabels(
    inputs.slice(0, 3).map((input) => input.label.toLowerCase()),
  );
  const additions: CalculatorFaq[] = [
    {
      question: `What does the ${title} calculate?`,
      answer: `${description} The result is based only on the inputs and assumptions shown on the page.`,
    },
    {
      question: `How should I interpret the ${primaryOutput?.label.toLowerCase() ?? 'result'} from the ${title}?`,
      answer: `Use it as an estimate for the scenario entered, not as a guarantee or personal recommendation. Test changes to ${keyInputs} to see which assumptions have the greatest effect.`,
    },
  ];
  const seen = new Set<string>();

  return [...normalizedFaq, ...additions]
    .filter((item) => {
      const key = item.question.trim().toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
}

export function createHowToSteps(
  title: string,
  inputs: CalculatorInput[],
): string[] {
  const labels = inputs.map((input) => input.label);
  const steps: string[] = [];
  const chunkSize = Math.max(1, Math.ceil(labels.length / 3));

  for (let index = 0; index < labels.length; index += chunkSize) {
    const group = labels.slice(index, index + chunkSize);
    steps.push(
      `Enter ${joinLabels(group)} using values that match the scenario you want to evaluate.`,
    );
  }

  steps.push(
    `Review the assumptions for the ${title.toLowerCase()}, especially rates, time periods, and optional amounts.`,
  );
  steps.push(
    'Select Calculate to update the results, then adjust one input at a time to compare scenarios.',
  );

  return steps.slice(0, 6);
}

export function createResultExplanations(
  title: string,
  inputs: CalculatorInput[],
  outputs: CalculatorOutput[],
): CalculatorResultExplanation[] {
  const inputSummary = joinLabels(
    inputs.slice(0, 3).map((input) => input.label.toLowerCase()),
  );

  return outputs.map((output) => {
    const label = output.label;
    const normalized = label.toLowerCase();
    let explanation: string;

    if (/(ending|final|future|projected).*balance|portfolio value/.test(normalized)) {
      explanation = `The estimated value at the end of the selected period after applying the entered contributions, rates, and timing assumptions.`;
    } else if (/total contributions|employee contributions|employer match/.test(normalized)) {
      explanation = `The amount added from contributions, separate from investment growth or interest.`;
    } else if (/interest earned|investment growth|total growth/.test(normalized)) {
      explanation = `The portion of the result attributed to growth rather than money contributed or originally invested.`;
    } else if (/interest paid|total fees|cost of fees|tax drag|fee drag/.test(normalized)) {
      explanation = `The estimated cost created by the entered rate over the selected period.`;
    } else if (/monthly payment|required payment|annual withdrawal|monthly withdrawal|daily withdrawal/.test(normalized)) {
      explanation = `The estimated payment or withdrawal amount produced by the current balance, rate, and time assumptions.`;
    } else if (/payoff time|years to|months to|estimated years|completion date|date$/.test(normalized)) {
      explanation = `The estimated time needed to reach the target under the current contribution, payment, and growth assumptions.`;
    } else if (/amount still needed|gap|shortfall|surplus|difference|buffer/.test(normalized)) {
      explanation = `The difference between the current position and the calculated target or comparison value.`;
    } else if (/fire number|required portfolio|target.*fund|target.*amount|loan amount/.test(normalized)) {
      explanation = `The target amount calculated from the spending, rate, or goal assumptions entered above.`;
    } else if (/rate|ratio|yield|cagr|percentage|multiplier|multiple/.test(normalized)) {
      explanation = `A percentage or comparison measure that summarizes the relationship between the calculator's key values.`;
    } else if (/total amount paid|total cost|total withdrawals|annual income|monthly income/.test(normalized)) {
      explanation = `The combined amount estimated from the recurring values and time period in this scenario.`;
    } else if (/better|strategy|option|sustainability|likely|order/.test(normalized)) {
      explanation = `A plain-language comparison based only on the assumptions entered; it is not a guarantee or personal recommendation.`;
    } else {
      explanation = `The ${label.toLowerCase()} estimated by the ${title} using ${inputSummary} and the other values entered.`;
    }

    return { outputId: output.id, label, explanation };
  });
}

export function createCommonMistakes(title: string): string[] {
  const normalized = title.toLowerCase();

  if (/(debt|loan|mortgage|credit card|refinance|heloc)/.test(normalized)) {
    return [
      'Entering an annual interest rate as a monthly rate, or leaving out fees and required payments.',
      'Assuming the quoted monthly payment includes taxes, insurance, or other costs when it may cover principal and interest only.',
      'Ignoring whether a payment is high enough to cover the interest added each month.',
      'Comparing payments without also comparing payoff time and total cost.',
    ];
  }

  if (/(fire|retirement|withdrawal)/.test(normalized)) {
    return [
      'Treating a constant return or withdrawal rate as a guaranteed outcome.',
      'Leaving out inflation, taxes, fees, healthcare, or irregular retirement expenses.',
      'Using current spending without considering how expenses may change later.',
      'Relying on one scenario instead of testing more cautious assumptions.',
    ];
  }

  if (/(home|rent|down payment)/.test(normalized)) {
    return [
      'Comparing only the mortgage payment and rent while overlooking taxes, insurance, maintenance, fees, and transaction costs.',
      'Using the maximum approved amount instead of a payment that fits the full household budget.',
      'Spending all available cash on the purchase and leaving no emergency or repair reserve.',
      'Assuming home appreciation or future refinancing is guaranteed.',
    ];
  }

  if (/(budget|saving|emergency|net worth)/.test(normalized)) {
    return [
      'Leaving out irregular expenses, annual bills, or small recurring charges.',
      'Using gross income when the calculator asks for spendable or after-tax income.',
      'Treating an ambitious contribution as sustainable without checking monthly cash flow.',
      'Counting the same savings, asset, debt, or expense in more than one field.',
    ];
  }

  if (/(529|college)/.test(normalized)) {
    return [
      'Assuming education costs and investment returns will remain constant.',
      'Ignoring fees, taxes, financial aid rules, or expenses not covered by the account.',
      'Using the full college cost as a savings target without considering other funding sources.',
      'Taking more investment risk than the remaining time horizon can support.',
    ];
  }

  if (/(ira|401|hsa|taxable|tax-advantaged|tax)/.test(normalized)) {
    return [
      'Ignoring contribution limits, eligibility rules, taxes, penalties, or account-specific restrictions.',
      'Comparing pre-tax and after-tax balances as though they were directly equivalent.',
      'Assuming current tax rates and laws will remain unchanged.',
      'Treating the calculator result as individualized tax advice.',
    ];
  }

  return [
    'Treating an assumed return, growth rate, inflation rate, or yield as guaranteed.',
    'Leaving out taxes, fees, inflation, or timing differences that can affect real-world results.',
    'Mixing monthly and annual figures or entering percentages in the wrong units.',
    'Relying on one projection instead of comparing a range of reasonable assumptions.',
  ];
}
