import {
  calculatorConfigs,
  type CalculatorConfig,
  type CalculatorFaq,
  type CalculatorInput,
  type CalculatorOutput,
} from './calculators';
import {
  calculatorCategories,
  type CalculatorCategory,
} from './calculator-categories';
import { contentItems, type ContentItem } from './content';
import {
  createCommonMistakes,
  createHowToSteps,
  createResultExplanations,
} from '../lib/calculator-education';

export interface CalculatorGuideSection {
  heading: string;
  paragraphs: string[];
}

export interface CalculatorGuide {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  calculator: CalculatorConfig;
  contentItem: ContentItem;
  category: CalculatorCategory;
  relatedCalculators: ContentItem[];
  relatedGuides?: {
    title: string;
    url: string;
    description: string;
  }[];
  sections: CalculatorGuideSection[];
  practicalExample: {
    inputs: { label: string; value: string }[];
    paragraphs: string[];
  };
  resultExplanations: {
    label: string;
    explanation: string;
  }[];
  commonMistakes: string[];
  faq: CalculatorFaq[];
}

const specialSlugs: Record<string, string> = {
  'compound-interest': 'what-is-compound-interest',
  'savings-rate': 'how-to-calculate-savings-rate',
  fire: 'what-is-fire',
  cagr: 'how-to-use-the-cagr-calculator',
};

function guideSlug(config: CalculatorConfig, item: ContentItem): string {
  return specialSlugs[config.id] ?? `how-to-use-${item.slug}`;
}

function topicName(title: string): string {
  return title.replace(/\s+Calculator$/i, '');
}

function formatDefaultInput(input: CalculatorInput): string {
  if (input.type === 'select') {
    return (
      input.options?.find((option) => option.value === input.value)?.label ??
      input.value
    );
  }

  const value = input.prefix
    ? `${input.prefix}${Number(input.value).toLocaleString('en-US')}`
    : input.value;
  return input.label.includes('(%)') ? `${value}%` : value;
}

function inputNames(config: CalculatorConfig): string {
  return config.inputs.map((input) => input.label.toLowerCase()).join(', ');
}

function outputNames(config: CalculatorConfig): string {
  return config.outputs.map((output) => output.label.toLowerCase()).join(', ');
}

function familyFor(title: string):
  | 'debt'
  | 'retirement'
  | 'home'
  | 'savings'
  | 'college'
  | 'tax'
  | 'investing' {
  const normalized = title.toLowerCase();
  if (/(debt|loan|credit card|refinance|heloc)/.test(normalized)) return 'debt';
  if (/(fire|retirement|withdrawal)/.test(normalized)) return 'retirement';
  if (/(home|mortgage|rent|down payment)/.test(normalized)) return 'home';
  if (/(budget|saving|emergency|net worth)/.test(normalized)) return 'savings';
  if (/(529|college)/.test(normalized)) return 'college';
  if (/(ira|401|hsa|taxable|tax-advantaged|tax drag)/.test(normalized)) {
    return 'tax';
  }
  return 'investing';
}

function mechanicsParagraphs(
  family: ReturnType<typeof familyFor>,
  config: CalculatorConfig,
): string[] {
  const name = config.title;
  const outputs = outputNames(config);

  const paragraphs = {
    debt: [
      `${name} connects a balance, interest rate, payment amount, and time. Interest is normally converted from an annual percentage to a periodic rate before it is applied to the outstanding balance. Payments first have to overcome the interest being added; only the remainder reduces principal. That distinction explains why a payment that looks substantial can still produce a long payoff period when the rate or balance is high.`,
      `The calculator reports ${outputs}. Use those figures together. A lower monthly payment may improve current cash flow but can extend repayment and increase total interest. An extra payment usually has the opposite effect when it is applied to principal. The estimate assumes the entered terms remain in place, so variable rates, fees, missed payments, new charges, and lender-specific payment rules can change the real schedule.`,
    ],
    retirement: [
      `${name} turns spending, assets, contributions, rates, and time into a retirement planning estimate. Retirement calculations usually combine a target amount or withdrawal need with an assumed growth path. The formulas are deterministic, meaning the same inputs always produce the same result. Markets are not deterministic, so the output should be treated as a scenario rather than a promised retirement date or income level.`,
      `The displayed results include ${outputs}. Read them as connected parts of one plan. A target tells you what the assumptions require, while a gap or timeline shows the distance from the current position. Withdrawal and return assumptions deserve particular attention because small changes can materially alter a long projection. Taxes, fees, inflation, healthcare, and sequence-of-returns risk may also affect a real retirement.`,
    ],
    home: [
      `${name} organizes the major numbers involved in a housing decision. Depending on the tool, it may combine a purchase price or balance with financing terms, taxes, insurance, maintenance, savings, and time. Mortgage calculations convert an annual rate into a monthly rate and spread repayment across scheduled payments. Housing comparisons may also estimate equity, opportunity cost, or the cash needed before a purchase.`,
      `The calculator summarizes ${outputs}. Do not evaluate one figure in isolation. A payment that fits a lender guideline may still strain a household budget, and a lower payment can come with a longer term or greater total interest. Property taxes, insurance, HOA dues, repairs, closing costs, and local market conditions may be outside a simple estimate or may change after the initial calculation.`,
    ],
    savings: [
      `${name} translates income, expenses, current savings, contributions, or a goal into a clearer cash-flow picture. The calculation is useful because it makes the relationship between today's monthly choices and a future target explicit. When growth is included, contributions and the existing balance can compound; when no growth is assumed, progress comes entirely from the amount added.`,
      `The results include ${outputs}. A target or gap shows the amount involved, while a rate or timeline helps compare the goal with current cash flow. These outputs are planning aids rather than instructions to save every available dollar. Essential expenses, debt obligations, emergency reserves, and the reliability of income all affect whether a contribution is sustainable.`,
    ],
    college: [
      `${name} connects education costs or account balances with contributions, inflation, investment growth, and the years remaining before college. The result can help frame the size of the goal, but education costs vary widely by school, location, living arrangement, aid, and enrollment choices. Investment returns are also uncertain, especially when the time horizon becomes short.`,
      `The calculator estimates ${outputs}. Use the results to test a range rather than to select one exact future bill. A family may combine savings with current income, scholarships, grants, work, or borrowing. Account rules, qualified expenses, taxes, fees, and financial-aid treatment can matter, so the calculator is one part of a broader education funding plan.`,
    ],
    tax: [
      `${name} compares how contributions, growth, fees, or tax treatment can affect an account over time. The mathematical projection is straightforward, but tax rules are not. Eligibility, contribution limits, deductions, withdrawal rules, penalties, employer plan terms, and future tax rates can all change the practical outcome.`,
      `The outputs include ${outputs}. Compare balances on the same tax basis whenever possible. A pre-tax balance is not automatically equal to an after-tax balance, and a tax advantage may depend on using the account for qualified purposes. The calculator illustrates the entered assumptions and does not determine legal eligibility or provide individualized tax advice.`,
    ],
    investing: [
      `${name} uses the entered starting value, contributions, rates, fees, and time to illustrate an investment outcome. Compounding allows earlier growth to participate in later growth, but the calculator generally applies a smooth rate for clarity. Actual returns vary from period to period and may include losses, so the path to an ending value will rarely be as even as the formula.`,
      `The results include ${outputs}. Separate money contributed from growth, fees, inflation, or income so you can see what drives the estimate. Compare several plausible assumptions instead of relying on one return. Diversification, taxes, trading costs, fund expenses, cash flows, and investor behavior can all cause real results to differ from the projection.`,
    ],
  } satisfies Record<ReturnType<typeof familyFor>, string[]>;

  return paragraphs[family];
}

function scenarioParagraphs(
  family: ReturnType<typeof familyFor>,
  config: CalculatorConfig,
): string[] {
  const subject = topicName(config.title).toLowerCase();
  const firstInput = config.inputs[0]?.label.toLowerCase() ?? 'first input';
  const lastInput =
    config.inputs.at(-1)?.label.toLowerCase() ?? 'final input';

  return [
    `Begin with the example values shown in the calculator. They provide a complete scenario, not a recommended plan. After calculating, record the primary result and then change only one assumption. For example, increase or decrease ${firstInput} while leaving the other values unchanged. This isolates the effect of that variable and makes the ${subject} relationship easier to understand.`,
    `Next, restore the starting values and adjust ${lastInput}. Compare the new result with the first run. Repeat the process with a cautious case, a middle case, and a more favorable case. This range is more informative than a single answer because it shows which assumptions have the greatest influence and where the plan may need flexibility.`,
    family === 'debt'
      ? `For a debt example, compare the required or current payment with a version that includes a manageable extra payment. Watch both the payoff time and total interest. If the payment does not exceed monthly interest, the balance cannot begin declining under the current assumptions. The useful question is not only whether a payment is affordable this month, but whether it creates a credible path to repayment.`
      : family === 'retirement'
        ? `For a retirement example, compare a lower return or withdrawal assumption with the initial case. Also test higher spending or a delayed target. A retirement plan that works only under the most favorable inputs has little room for market volatility, inflation, taxes, or changing expenses. Scenario testing helps reveal that sensitivity before the result is treated as a goal.`
        : family === 'home'
          ? `For a housing example, compare the initial scenario with a higher rate, a different down payment, or a shorter ownership period. Include costs beyond principal and interest whenever the fields allow. The lowest monthly payment is not automatically the lowest total cost, and the largest affordable price is not automatically the best fit for the rest of the household budget.`
          : family === 'savings'
            ? `For a savings example, compare the current monthly contribution with a slightly higher amount that still fits normal cash flow. Then test a zero-growth case. This separates progress created by your own deposits from progress attributed to returns, and it prevents an optimistic growth assumption from hiding a contribution level that is too low for the desired timeline.`
            : family === 'college'
              ? `For an education example, test more than one cost and inflation assumption. Then compare a longer saving period with a shorter one. As enrollment approaches, the ability to recover from investment losses may shrink. A useful plan identifies the amount that could come from savings and the portion that may need to come from current income or other sources.`
              : family === 'tax'
                ? `For an account comparison, keep the contribution and return consistent while changing only the tax or fee assumption. Make sure the results are compared on the same pre-tax or after-tax basis. A difference in ending values is meaningful only when account restrictions, withdrawal taxes, penalties, and qualified-use rules are also understood.`
                : `For an investing example, test a lower return and a higher fee before testing a more optimistic case. Compare nominal growth with purchasing-power growth when inflation is relevant. The goal is to understand sensitivity, not to select the ending balance you prefer. A durable plan should not depend on unusually precise or consistently favorable returns.`,
  ];
}

function buildSections(
  config: CalculatorConfig,
  category: CalculatorCategory,
): CalculatorGuideSection[] {
  const family = familyFor(config.title);
  const inputList = inputNames(config);
  const outputList = outputNames(config);
  const steps = createHowToSteps(config.title, config.inputs);

  return [
    {
      heading: `What the ${config.title} is designed to show`,
      paragraphs: [
        `${config.description} The purpose of the calculator is to turn several related assumptions into one consistent estimate. It can help you organize a decision, compare alternatives, and identify which values deserve closer attention. It cannot know future prices, returns, rates, taxes, personal circumstances, or policy changes, so its role is to support questions rather than deliver certainty.`,
        `This tool belongs to the ${category.title.toLowerCase()} collection. It is most useful when you already have reasonably accurate figures and want to see how they interact. Before entering numbers, decide what decision you are exploring and what period the values cover. Monthly and annual figures should not be mixed, and percentages should be entered exactly as the field requests.`,
      ],
    },
    {
      heading: 'Understanding the inputs',
      paragraphs: [
        `The calculator asks for ${inputList}. Each field represents a separate part of the scenario. Use current statements, account records, a written budget, or a formal quote when available. Rounded estimates are acceptable for early planning, but precise inputs matter more when the result will influence a near-term decision.`,
        `Check the time units before calculating. A monthly contribution or payment is not interchangeable with an annual amount, and an annual percentage rate is not a monthly percentage. Optional fields can often be left blank or entered as zero, but doing so describes a specific assumption. A zero contribution, fee, income source, or extra payment should mean that the scenario truly excludes it.`,
        `A practical sequence is: ${steps.join(' ')} This process keeps the first run understandable and makes later comparisons easier to explain.`,
      ],
    },
    {
      heading: 'How the estimate works',
      paragraphs: mechanicsParagraphs(family, config),
    },
    {
      heading: 'A practical example',
      paragraphs: [
        `The calculator opens with a sample set of values so you can see a complete calculation immediately. Treat the defaults as a demonstration rather than a benchmark. Your situation may involve different balances, rates, costs, contributions, income, or time. Replace every default with a value that belongs to the same scenario before relying on the result.`,
        `After the first calculation, write down ${outputList}. Then change one field and calculate again. If several values change at once, it becomes difficult to know what caused the difference. A one-variable comparison creates a simple before-and-after example that can be discussed with a partner, lender, planner, tax professional, or other qualified adviser when appropriate.`,
      ],
    },
    {
      heading: 'How to interpret the results',
      paragraphs: [
        `The outputs are connected. A primary result may summarize the scenario, while the remaining figures explain cost, progress, timing, growth, or the difference between alternatives. Read the labels carefully and check whether a positive number means a benefit, an amount owed, a gap, or a surplus. The same sign can have different meanings in different calculators.`,
        `A result should be evaluated against the original goal and constraints. An attractive ending value may require a contribution that is not sustainable. A short payoff period may require a payment that leaves no emergency reserve. A retirement target may depend on a return or withdrawal assumption that offers little margin. The best use of the output is to expose tradeoffs clearly.`,
      ],
    },
    {
      heading: 'Compare scenarios instead of chasing one answer',
      paragraphs: scenarioParagraphs(family, config),
    },
    {
      heading: 'Limits, next steps, and better decisions',
      paragraphs: [
        `This calculator simplifies reality so the relationship between inputs remains understandable. It may not include every tax, fee, timing convention, account rule, insurance cost, market change, or behavioral decision. Review the calculator FAQ and note what is excluded. If an omitted factor could materially change the decision, estimate it separately or seek guidance from an appropriate professional.`,
        `Save or copy the shareable calculator URL after a successful calculation if you want to revisit the same inputs. When comparing scenarios, label each one with the assumption that changed. Recheck the calculation when rates, balances, income, expenses, laws, or goals change. A projection is most useful when it is updated rather than treated as a permanent answer.`,
        `Use the matching calculator together with the related tools linked below. One calculator may estimate the main result while another explores fees, inflation, taxes, affordability, or timing. Combining several focused views can produce a more complete planning conversation without pretending that any single formula captures the full decision.`,
      ],
    },
  ];
}

function buildGuide(config: CalculatorConfig): CalculatorGuide {
  const contentItem = contentItems.find((item) => item.url === config.url);
  if (!contentItem) {
    throw new Error(`Missing content item for ${config.id}`);
  }

  const category = calculatorCategories.find((candidate) =>
    candidate.ids.includes(contentItem.id),
  );
  if (!category) {
    throw new Error(`Missing calculator category for ${config.id}`);
  }

  const relatedCalculators = config.relatedIds.flatMap((id) => {
    const item = contentItems.find((candidate) => candidate.id === id);
    return item?.status === 'live' ? [item] : [];
  });
  const topic = topicName(config.title);
  const slug = guideSlug(config, contentItem);
  const relatedGuides =
    config.id === 'compound-interest'
      ? [
          {
            title: 'Compound Interest Examples',
            url: '/calculators/compound-interest/examples/',
            description:
              'Browse 100 worked examples grouped by starting amount and searchable by amount, rate, or time.',
          },
          {
            title: 'APR vs APY',
            url: '/guides/apr-vs-apy/',
            description:
              'Learn how compounding changes a nominal rate into an effective annual yield.',
          },
          {
            title: 'Daily vs Monthly Compounding',
            url: '/guides/daily-vs-monthly-compounding/',
            description:
              'Compare compounding frequencies and see when the difference matters.',
          },
          {
            title: 'Effective Annual Rate Explained',
            url: '/guides/effective-annual-rate/',
            description:
              'Put rates with different compounding schedules on one annual basis.',
          },
          {
            title: 'Nominal Return vs Real Return',
            url: '/guides/nominal-vs-real-return/',
            description:
              'Adjust investment growth for inflation and purchasing power.',
          },
          {
            title: 'How Inflation Affects Compound Interest',
            url: '/guides/inflation-and-compound-interest/',
            description:
              'Understand how investment growth and rising prices compound together.',
          },
        ]
      : config.id === 'fire'
        ? [
            {
              title: 'FIRE Number Examples',
              url: '/calculators/fire/examples/',
              description:
                'Browse 30 worked FIRE examples by annual spending and invested portfolio.',
            },
            {
              title: 'FIRE vs Coast FIRE',
              url: '/guides/fire-vs-coast-fire/',
              description:
                'Compare full financial independence with the Coast FIRE milestone.',
            },
          ]
      : config.id === 'mortgage-payoff'
        ? [
            {
              title: 'Mortgage Payment Examples',
              url: '/calculators/mortgage/examples/',
              description:
                'Browse 40 fixed-rate examples by loan amount, interest rate, and term.',
            },
            {
              title: 'Rent vs Buy',
              url: '/guides/rent-vs-buy/',
              description:
                'Compare mortgage costs with rent, equity, maintenance, and flexibility.',
            },
          ]
      : config.id === 'savings-goal'
        ? [
            {
              title: 'Savings Goal Examples',
              url: '/calculators/savings-goal/examples/',
              description:
                'Browse 100 worked savings plans by target, timeline, and goal type.',
            },
            {
              title: 'Budgeting and Saving for Real Life',
              url: '/guides/budgeting/',
              description:
                'Turn savings priorities into practical monthly allocations.',
            },
            {
              title: 'APR vs APY',
              url: '/guides/apr-vs-apy/',
              description:
                'Understand how a stated rate differs from effective annual yield.',
            },
          ]
      : undefined;

  return {
    slug,
    title:
      slug.startsWith('what-is-')
        ? `What Is ${topic}? A Practical Guide`
        : `How to Use the ${config.title}`,
    seoTitle: `${topic} Guide | AutomatorLabs`,
    metaDescription: `Learn how the ${config.title} works, what each input and result means, practical examples, common mistakes, and related planning considerations.`,
    intro: `A beginner-friendly explanation of the ${config.title}, including its assumptions, outputs, practical uses, limitations, and ways to compare scenarios.`,
    calculator: config,
    contentItem,
    category,
    relatedCalculators,
    relatedGuides,
    sections: buildSections(config, category),
    practicalExample: {
      inputs: config.inputs.map((input) => ({
        label: input.label,
        value: formatDefaultInput(input),
      })),
      paragraphs: [
        `Use the sample inputs below for a first walkthrough. Calculate once, review every output, and then replace the example with your own values.`,
        `For a second example, change one rate, contribution, payment, balance, cost, or time input. The difference between the two runs shows how sensitive the result is to that assumption.`,
      ],
    },
    resultExplanations: createResultExplanations(
      config.title,
      config.inputs,
      config.outputs,
    ).map(({ label, explanation }) => ({ label, explanation })),
    commonMistakes:
      config.commonMistakes ?? createCommonMistakes(config.title),
    faq: config.faq,
  };
}

export const calculatorGuides: CalculatorGuide[] = Object.values(
  calculatorConfigs,
)
  .map(buildGuide)
  .sort((a, b) => a.contentItem.priority - b.contentItem.priority);

export function getCalculatorGuide(
  slug: string,
): CalculatorGuide | undefined {
  return calculatorGuides.find((guide) => guide.slug === slug);
}
