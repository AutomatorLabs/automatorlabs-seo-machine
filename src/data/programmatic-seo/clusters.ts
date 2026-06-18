import { compoundInterestSeoRecords } from './compound-interest';
import { fireSeoRecords } from './fire';

export interface ProgrammaticSeoClusterSummary {
  id: string;
  title: string;
  description: string;
  examplesUrl: string;
  calculator: {
    title: string;
    url: string;
  };
  guide: {
    title: string;
    url: string;
  };
  pageCount: number;
  representativePages: {
    title: string;
    url: string;
  }[];
}

const compoundInterestRepresentatives = [
  compoundInterestSeoRecords.find(
    (record) => record.slug === '10000-at-8-percent-for-30-years',
  ),
  compoundInterestSeoRecords.find(
    (record) => record.slug === '50000-at-7-percent-for-20-years',
  ),
].filter((record) => record !== undefined);

const fireRepresentatives = [
  fireSeoRecords.find(
    (record) => record.slug === 'retire-spending-40000-per-year',
  ),
  fireSeoRecords.find(
    (record) =>
      record.slug === 'can-i-retire-with-1000000-and-40000-spending',
  ),
].filter((record) => record !== undefined);

export const programmaticSeoClusters: ProgrammaticSeoClusterSummary[] = [
  {
    id: 'compound-interest',
    title: 'Compound Interest Examples',
    description:
      'Explore worked projections across starting balances, annual rates, and time periods.',
    examplesUrl: '/calculators/compound-interest/examples/',
    calculator: {
      title: 'Compound Interest Calculator',
      url: '/calculators/compound-interest/',
    },
    guide: {
      title: 'What Is Compound Interest?',
      url: '/guides/what-is-compound-interest/',
    },
    pageCount: compoundInterestSeoRecords.length,
    representativePages: compoundInterestRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/compound-interest/${record.slug}/`,
    })),
  },
  {
    id: 'fire',
    title: 'FIRE Examples',
    description:
      'Compare annual spending targets and portfolio-versus-spending scenarios.',
    examplesUrl: '/calculators/fire/examples/',
    calculator: {
      title: 'FIRE Calculator',
      url: '/calculators/fire-calculator/',
    },
    guide: {
      title: 'A Beginner’s Guide to FIRE',
      url: '/guides/fire/',
    },
    pageCount: fireSeoRecords.length,
    representativePages: fireRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/fire/${record.slug}/`,
    })),
  },
];
