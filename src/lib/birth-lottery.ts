import fs from 'node:fs';
import path from 'node:path';
import {
  BIRTH_LOTTERY_YEAR_MIN,
  BIRTH_LOTTERY_YEAR_MAX,
  birthLotteryMoneyLinks,
  type BirthLotteryMoneyLink,
} from '../data/birth-lottery';

export interface BirthLotteryFaq {
  question: string;
  answer: string;
}

export interface BirthLotteryRankedCountry {
  name: string;
  births: number;
  pct: number;
}

export interface BirthLotteryBreadcrumb {
  name: string;
  url: string;
}

export interface BirthLotteryYearPage {
  year: number;
  seoTitle: string;
  metaDescription: string;
  canonicalPath: string;
  totalM: string;
  top10: BirthLotteryRankedCountry[];
  remainingCountries: number;
  remainingSharePct: string;
  top2pct: string;
  usaOneIn: number;
  usaRank: number;
  usaPct: string;
  countryCount: number;
  worldLifeExpectancy: string;
  worldSurvivalPct: string;
  yoyWord: string;
  hasPrevYear: boolean;
  retirementYear: number;
  faqs: BirthLotteryFaq[];
  breadcrumbs: BirthLotteryBreadcrumb[];
  prevYear: number | null;
  nextYear: number | null;
  moneyLinks: BirthLotteryMoneyLink[];
}

interface LotteryMeta {
  countries: string[];
  yearMin: number;
  yearMax: number;
  lastEstimate: number;
  gdpLastYear: number;
  world: { lex: number[]; imr: number[]; tfr: number[]; age: number[] };
}

interface LotteryYearData {
  total: number;
  births: number[];
  lex: number[];
  imr: number[];
}

const dataDir = path.join(process.cwd(), 'public/data/lottery');

function readYearData(year: number): LotteryYearData {
  return JSON.parse(
    fs.readFileSync(path.join(dataDir, `years/${year}.json`), 'utf8'),
  );
}

function readMeta(): LotteryMeta {
  return JSON.parse(fs.readFileSync(path.join(dataDir, 'meta.json'), 'utf8'));
}

export function buildBirthLotteryYearPage(year: number): BirthLotteryYearPage {
  const meta = readMeta();
  const data = readYearData(year);
  const prev = year > BIRTH_LOTTERY_YEAR_MIN ? readYearData(year - 1) : null;

  const yearIndex = year - meta.yearMin;
  const countryCount = meta.countries.length;

  const ranked: BirthLotteryRankedCountry[] = meta.countries
    .map((name, i) => ({
      name,
      births: data.births[i],
      pct: (data.births[i] / data.total) * 100,
    }))
    .sort((a, b) => b.births - a.births);
  const top10 = ranked.slice(0, 10);
  const remainingSharePct = (
    100 - top10.reduce((sum, r) => sum + r.pct, 0)
  ).toFixed(1);

  const totalM = (data.total / 1000).toFixed(1);
  const top2pct = (top10[0].pct + top10[1].pct).toFixed(1);

  const usa = ranked.find((r) => r.name === 'United States')!;
  const usaRank = ranked.indexOf(usa) + 1;
  const usaOneIn = Math.round(data.total / usa.births);

  const world = meta.world;
  const yoy = prev ? ((data.total - prev.total) / prev.total) * 100 : 0;
  const yoyWord = !prev
    ? ''
    : yoy > 0.5
      ? 'up vs'
      : yoy < -0.5
        ? 'down vs'
        : 'roughly flat vs';
  const worldSurv = ((1000 - world.imr[yearIndex]) / 10).toFixed(1);

  const faqs: BirthLotteryFaq[] = [
    {
      question: `How many babies were born in ${year}?`,
      answer: `Roughly ${totalM} million babies were born worldwide in ${year}, according to UN World Population Prospects 2024 estimates.`,
    },
    {
      question: `Which country had the most births in ${year}?`,
      answer: `${top10[0].name} had the most births in ${year} (about ${(top10[0].births / 1000).toFixed(1)} million — ${top10[0].pct.toFixed(1)}% of all babies born that year), followed by ${top10[1].name} at ${top10[1].pct.toFixed(1)}%.`,
    },
    {
      question: `What were the odds of being born in the United States in ${year}?`,
      answer: `About 1 in ${usaOneIn}. The US ranked #${usaRank} of ${countryCount} countries by births, with ${usa.pct.toFixed(2)}% of the world's babies.`,
    },
    {
      question: `What was world life expectancy in ${year}?`,
      answer: `A baby born in ${year} had a global average life expectancy of ${world.lex[yearIndex].toFixed(1)} years, and a ${worldSurv}% chance of surviving their first year — though both varied enormously by country.`,
    },
  ];

  return {
    year,
    seoTitle: `Born in ${year}: Birth Statistics, Odds by Country & the Birth Lottery`,
    metaDescription: `${totalM} million babies were born in ${year}. See the odds of being born in every country, life expectancy, survival rates, and how lucky your birth really was.`,
    canonicalPath: `/birth-lottery/born-in-${year}/`,
    totalM,
    top10,
    remainingCountries: countryCount - 10,
    remainingSharePct,
    top2pct,
    usaOneIn,
    usaRank,
    usaPct: usa.pct.toFixed(2),
    countryCount,
    worldLifeExpectancy: world.lex[yearIndex].toFixed(1),
    worldSurvivalPct: worldSurv,
    yoyWord,
    hasPrevYear: prev !== null,
    retirementYear: year + 65,
    faqs,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Birth Lottery', url: '/birth-lottery/' },
      { name: `Born in ${year}`, url: `/birth-lottery/born-in-${year}/` },
    ],
    prevYear: year > BIRTH_LOTTERY_YEAR_MIN ? year - 1 : null,
    nextYear: year < BIRTH_LOTTERY_YEAR_MAX ? year + 1 : null,
    moneyLinks: birthLotteryMoneyLinks,
  };
}
