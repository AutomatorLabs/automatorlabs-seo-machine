export type PropertyTaxSeoIntent =
  | 'starter-home'
  | 'move-up-home'
  | 'high-tax-area'
  | 'assessment-growth'
  | 'long-horizon';

export interface PropertyTaxSeoRecord {
  slug: string;
  question: string;
  intent: PropertyTaxSeoIntent;
  homeValue: number;
  propertyTaxRatePercent: number;
  assessedValuePercent: number;
  annualAssessmentGrowthPercent: number;
  years: number;
  scenarioLabel: string;
  featured?: boolean;
}

export const EXPECTED_PROPERTY_TAX_SEO_PAGE_COUNT = 200;

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;
const rateSlug = (rate: number) => String(rate).replace('.', '-');

function record(
  intent: PropertyTaxSeoIntent,
  homeValue: number,
  propertyTaxRatePercent: number,
  assessedValuePercent: number,
  annualAssessmentGrowthPercent: number,
  years: number,
  featured = false,
): PropertyTaxSeoRecord {
  return {
    slug: `${intent}-${homeValue}-home-${rateSlug(propertyTaxRatePercent)}-tax-${rateSlug(assessedValuePercent)}-assessed-${rateSlug(annualAssessmentGrowthPercent)}-growth-${years}-years`,
    question: `${intent.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())} Property Tax on ${money(homeValue)} at ${propertyTaxRatePercent}% With ${assessedValuePercent}% Assessment for ${years} Years`,
    intent,
    homeValue,
    propertyTaxRatePercent,
    assessedValuePercent,
    annualAssessmentGrowthPercent,
    years,
    scenarioLabel: intent.replace(/-/g, ' '),
    featured,
  };
}

const starterHomeValues = [250000, 300000, 350000, 400000, 450000];
const starterScenarios = [
  { propertyTaxRatePercent: 0.75, assessedValuePercent: 85, annualAssessmentGrowthPercent: 2, years: 5 },
  { propertyTaxRatePercent: 0.85, assessedValuePercent: 90, annualAssessmentGrowthPercent: 2, years: 10 },
  { propertyTaxRatePercent: 0.95, assessedValuePercent: 90, annualAssessmentGrowthPercent: 2.5, years: 15 },
  { propertyTaxRatePercent: 1, assessedValuePercent: 95, annualAssessmentGrowthPercent: 2.5, years: 20 },
  { propertyTaxRatePercent: 1.1, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3, years: 20 },
  { propertyTaxRatePercent: 1.2, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3, years: 25 },
  { propertyTaxRatePercent: 1.3, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3.5, years: 25 },
  { propertyTaxRatePercent: 1.4, assessedValuePercent: 100, annualAssessmentGrowthPercent: 4, years: 30 },
];

const moveUpHomeValues = [500000, 600000, 700000, 800000, 900000];
const moveUpScenarios = [
  { propertyTaxRatePercent: 0.8, assessedValuePercent: 85, annualAssessmentGrowthPercent: 2, years: 5 },
  { propertyTaxRatePercent: 0.9, assessedValuePercent: 90, annualAssessmentGrowthPercent: 2.5, years: 10 },
  { propertyTaxRatePercent: 1, assessedValuePercent: 95, annualAssessmentGrowthPercent: 2.5, years: 15 },
  { propertyTaxRatePercent: 1.1, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3, years: 20 },
  { propertyTaxRatePercent: 1.2, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3, years: 20 },
  { propertyTaxRatePercent: 1.3, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3.5, years: 25 },
  { propertyTaxRatePercent: 1.4, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3.5, years: 25 },
  { propertyTaxRatePercent: 1.5, assessedValuePercent: 100, annualAssessmentGrowthPercent: 4, years: 30 },
];

const highTaxHomeValues = [300000, 450000, 600000, 800000, 1000000];
const highTaxScenarios = [
  { propertyTaxRatePercent: 1.5, assessedValuePercent: 90, annualAssessmentGrowthPercent: 2.5, years: 5 },
  { propertyTaxRatePercent: 1.7, assessedValuePercent: 95, annualAssessmentGrowthPercent: 2.5, years: 10 },
  { propertyTaxRatePercent: 1.9, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3, years: 15 },
  { propertyTaxRatePercent: 2.1, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3, years: 20 },
  { propertyTaxRatePercent: 2.3, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3.5, years: 20 },
  { propertyTaxRatePercent: 2.5, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3.5, years: 25 },
  { propertyTaxRatePercent: 2.7, assessedValuePercent: 100, annualAssessmentGrowthPercent: 4, years: 25 },
  { propertyTaxRatePercent: 2.9, assessedValuePercent: 100, annualAssessmentGrowthPercent: 4.5, years: 30 },
];

const assessmentGrowthHomeValues = [350000, 500000, 650000, 800000, 950000];
const assessmentGrowthScenarios = [
  { propertyTaxRatePercent: 0.9, assessedValuePercent: 85, annualAssessmentGrowthPercent: 1, years: 10 },
  { propertyTaxRatePercent: 1, assessedValuePercent: 90, annualAssessmentGrowthPercent: 1.5, years: 15 },
  { propertyTaxRatePercent: 1.1, assessedValuePercent: 95, annualAssessmentGrowthPercent: 2, years: 20 },
  { propertyTaxRatePercent: 1.2, assessedValuePercent: 100, annualAssessmentGrowthPercent: 2.5, years: 20 },
  { propertyTaxRatePercent: 1.3, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3, years: 25 },
  { propertyTaxRatePercent: 1.4, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3.5, years: 25 },
  { propertyTaxRatePercent: 1.5, assessedValuePercent: 100, annualAssessmentGrowthPercent: 4, years: 30 },
  { propertyTaxRatePercent: 1.6, assessedValuePercent: 100, annualAssessmentGrowthPercent: 5, years: 30 },
];

const longHorizonHomeValues = [400000, 550000, 700000, 850000, 1000000];
const longHorizonScenarios = [
  { propertyTaxRatePercent: 0.85, assessedValuePercent: 90, annualAssessmentGrowthPercent: 2, years: 15 },
  { propertyTaxRatePercent: 0.95, assessedValuePercent: 95, annualAssessmentGrowthPercent: 2.5, years: 20 },
  { propertyTaxRatePercent: 1.05, assessedValuePercent: 100, annualAssessmentGrowthPercent: 2.5, years: 25 },
  { propertyTaxRatePercent: 1.15, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3, years: 25 },
  { propertyTaxRatePercent: 1.25, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3, years: 30 },
  { propertyTaxRatePercent: 1.35, assessedValuePercent: 100, annualAssessmentGrowthPercent: 3.5, years: 30 },
  { propertyTaxRatePercent: 1.45, assessedValuePercent: 100, annualAssessmentGrowthPercent: 4, years: 35 },
  { propertyTaxRatePercent: 1.55, assessedValuePercent: 100, annualAssessmentGrowthPercent: 4, years: 40 },
];

export const propertyTaxSeoRecords: PropertyTaxSeoRecord[] = [
  ...starterHomeValues.flatMap((homeValue) =>
    starterScenarios.map((scenario) =>
      record(
        'starter-home',
        homeValue,
        scenario.propertyTaxRatePercent,
        scenario.assessedValuePercent,
        scenario.annualAssessmentGrowthPercent,
        scenario.years,
        homeValue === 350000 &&
          scenario.propertyTaxRatePercent === 0.95 &&
          scenario.years === 15,
      ),
    ),
  ),
  ...moveUpHomeValues.flatMap((homeValue) =>
    moveUpScenarios.map((scenario) =>
      record(
        'move-up-home',
        homeValue,
        scenario.propertyTaxRatePercent,
        scenario.assessedValuePercent,
        scenario.annualAssessmentGrowthPercent,
        scenario.years,
      ),
    ),
  ),
  ...highTaxHomeValues.flatMap((homeValue) =>
    highTaxScenarios.map((scenario) =>
      record(
        'high-tax-area',
        homeValue,
        scenario.propertyTaxRatePercent,
        scenario.assessedValuePercent,
        scenario.annualAssessmentGrowthPercent,
        scenario.years,
      ),
    ),
  ),
  ...assessmentGrowthHomeValues.flatMap((homeValue) =>
    assessmentGrowthScenarios.map((scenario) =>
      record(
        'assessment-growth',
        homeValue,
        scenario.propertyTaxRatePercent,
        scenario.assessedValuePercent,
        scenario.annualAssessmentGrowthPercent,
        scenario.years,
      ),
    ),
  ),
  ...longHorizonHomeValues.flatMap((homeValue) =>
    longHorizonScenarios.map((scenario) =>
      record(
        'long-horizon',
        homeValue,
        scenario.propertyTaxRatePercent,
        scenario.assessedValuePercent,
        scenario.annualAssessmentGrowthPercent,
        scenario.years,
      ),
    ),
  ),
];
