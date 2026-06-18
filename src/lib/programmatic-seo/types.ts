export interface ProgrammaticSeoLink {
  title: string;
  url: string;
  description: string;
}

export interface ProgrammaticSeoFaq {
  question: string;
  answer: string;
}

export interface ProgrammaticSeoBreadcrumb {
  name: string;
  url: string;
}

export interface ProgrammaticSeoResult {
  label: string;
  value: string;
  primary?: boolean;
}

export interface ProgrammaticSeoProjectionRow {
  period: number;
  contributions: number;
  growth: number;
  endingBalance: number;
}

export interface ProgrammaticSeoChartPoint {
  period: number;
  value: number;
}

export interface ProgrammaticSeoSection {
  heading: string;
  paragraphs: string[];
}

export interface ProgrammaticSeoTable {
  heading: string;
  columns: string[];
  rows: {
    label: string;
    cells: string[];
  }[];
}

export interface ProgrammaticSeoPageModel {
  slug: string;
  url: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string;
  summary: string;
  results: ProgrammaticSeoResult[];
  formula: {
    heading?: string;
    expression: string;
    explanation: string;
    steps: string[];
  };
  showChart?: boolean;
  chartHeading?: string;
  chartDescription?: string;
  projectionHeading: string;
  projectionRows: ProgrammaticSeoProjectionRow[];
  table?: ProgrammaticSeoTable;
  chartPoints: ProgrammaticSeoChartPoint[];
  sections: ProgrammaticSeoSection[];
  faq: ProgrammaticSeoFaq[];
  breadcrumbs: ProgrammaticSeoBreadcrumb[];
  relatedPages: ProgrammaticSeoLink[];
  relatedCalculators: ProgrammaticSeoLink[];
  relatedGuides: ProgrammaticSeoLink[];
  chartLabel: string;
  calculatorCta?: {
    heading: string;
    description: string;
    url: string;
    label: string;
    examplesUrl?: string;
    examplesLabel?: string;
  };
  relatedPagesHeading?: string;
}
