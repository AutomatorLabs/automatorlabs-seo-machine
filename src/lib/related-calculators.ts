import { calculatorCategories } from '../data/calculator-categories';
import { contentItems, type ContentItem } from '../data/content';

export interface RelatedCalculatorLink {
  title: string;
  url: string;
  description: string;
}

interface BasicRelatedLink {
  title: string;
  url: string;
}

interface TopicProfile {
  familyTokens: Set<string>;
  topicalTokens: Set<string>;
}

const liveCalculators = contentItems
  .filter(
    (item) => item.category === 'calculator' && item.status === 'live',
  )
  .sort((a, b) => a.priority - b.priority);
const calculatorByUrl = new Map(
  liveCalculators.map((item) => [item.url, item] as const),
);
const calculatorById = new Map(
  liveCalculators.map((item) => [item.id, item] as const),
);
const categoryByCalculatorId = new Map(
  calculatorCategories.flatMap((category) =>
    category.ids.map((id) => [id, category] as const),
  ),
);
const genericTopicTokens = new Set([
  'a',
  'an',
  'and',
  'annual',
  'balance',
  'balances',
  'build',
  'builds',
  'calculate',
  'calculated',
  'calculates',
  'calculating',
  'calculation',
  'calculator',
  'calculators',
  'compare',
  'compared',
  'compares',
  'comparison',
  'current',
  'editable',
  'edit',
  'estimate',
  'estimated',
  'estimates',
  'estimating',
  'for',
  'from',
  'future',
  'how',
  'in',
  'into',
  'monthly',
  'of',
  'on',
  'or',
  'plan',
  'planner',
  'planning',
  'project',
  'projection',
  'projections',
  'return',
  'returns',
  'the',
  'to',
  'total',
  'using',
  'value',
  'values',
  'vs',
  'with',
  'your',
  'you',
]);

const topicProfiles = new Map(
  liveCalculators.map((item) => [item.id, buildTopicProfile(item)] as const),
);

function linkFor(item: ContentItem): RelatedCalculatorLink {
  return {
    title: item.title,
    url: item.url,
    description: item.description,
  };
}

function normalizeTopicText(value: string): string {
  return value
    .toLowerCase()
    .replace(/401\s*\(?k\)?/g, '401k')
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ');
}

function createTokenSet(values: string[]): Set<string> {
  return new Set(
    values
      .flatMap((value) => normalizeTopicText(value).split(/\s+/))
      .filter((token) => {
        if (!token) return false;
        if (genericTopicTokens.has(token)) return false;
        return token.length > 1 || /\d/.test(token);
      }),
  );
}

function buildTopicProfile(item: ContentItem): TopicProfile {
  return {
    familyTokens: createTokenSet([
      item.title,
      item.slug,
      item.primaryKeyword,
      ...item.secondaryKeywords,
    ]),
    topicalTokens: createTokenSet([
      item.title,
      item.slug,
      item.primaryKeyword,
      ...item.secondaryKeywords,
      item.description,
    ]),
  };
}

function countSharedTokens(left: Set<string>, right: Set<string>): number {
  let count = 0;
  for (const token of left) {
    if (right.has(token)) count += 1;
  }
  return count;
}

function getSharedTopicCounts(currentItem: ContentItem, candidate: ContentItem) {
  const currentProfile = topicProfiles.get(currentItem.id);
  const candidateProfile = topicProfiles.get(candidate.id);
  if (!currentProfile || !candidateProfile) {
    return { familyOverlap: 0, topicalOverlap: 0 };
  }

  return {
    familyOverlap: countSharedTokens(
      currentProfile.familyTokens,
      candidateProfile.familyTokens,
    ),
    topicalOverlap: countSharedTokens(
      currentProfile.topicalTokens,
      candidateProfile.topicalTokens,
    ),
  };
}

function getTopicRelevanceScore(
  currentItem: ContentItem,
  candidate: ContentItem,
): number {
  const currentCategory = categoryByCalculatorId.get(currentItem.id);
  const candidateCategory = categoryByCalculatorId.get(candidate.id);
  const { familyOverlap, topicalOverlap } = getSharedTopicCounts(
    currentItem,
    candidate,
  );

  let score = familyOverlap * 10 + topicalOverlap * 4;
  if (currentCategory?.slug === candidateCategory?.slug) score += 12;
  if (candidate.relatedIds.includes(currentItem.id)) score += 8;

  return score;
}

function sortByTopicRelevance(
  currentItem: ContentItem,
  candidates: ContentItem[],
): ContentItem[] {
  return [...candidates].sort((left, right) => {
    const scoreDelta =
      getTopicRelevanceScore(currentItem, right) -
      getTopicRelevanceScore(currentItem, left);
    if (scoreDelta !== 0) return scoreDelta;
    return left.priority - right.priority;
  });
}

export function createRelatedCalculatorLinks(
  currentUrl: string,
  providedLinks: BasicRelatedLink[] = [],
  limit = 6,
): RelatedCalculatorLink[] {
  const currentItem = calculatorByUrl.get(currentUrl);
  const category = currentItem
    ? categoryByCalculatorId.get(currentItem.id)
    : undefined;
  const categoryIds = new Set(category?.ids ?? []);
  const preferredItems = providedLinks.flatMap((link) => {
    const item = calculatorByUrl.get(link.url);
    return item ? [item] : [];
  });
  const explicitlyRelated = currentItem
    ? currentItem.relatedIds.flatMap((id) => {
        const item = calculatorById.get(id);
        return item ? [item] : [];
      })
    : [];
  const sameCategory = liveCalculators.filter((item) =>
    categoryIds.has(item.id),
  );
  const reciprocalLinks = currentItem
    ? liveCalculators.filter((item) =>
        item.relatedIds.includes(currentItem.id),
      )
    : [];
  const sameFamily = currentItem
    ? sortByTopicRelevance(
        currentItem,
        liveCalculators.filter((item) => {
          if (!categoryIds.has(item.id)) return false;
          const { familyOverlap, topicalOverlap } = getSharedTopicCounts(
            currentItem,
            item,
          );
          return familyOverlap >= 2 || topicalOverlap >= 3;
        }),
      )
    : [];
  const sameTopic = currentItem
    ? sortByTopicRelevance(
        currentItem,
        liveCalculators.filter((item) => {
          if (!categoryIds.has(item.id)) return false;
          const { familyOverlap, topicalOverlap } = getSharedTopicCounts(
            currentItem,
            item,
          );
          return familyOverlap >= 1 || topicalOverlap >= 2;
        }),
      )
    : [];
  const crossCategoryTopicMatches = currentItem
    ? sortByTopicRelevance(
        currentItem,
        liveCalculators.filter((item) => {
          if (categoryIds.has(item.id)) return false;
          const { familyOverlap, topicalOverlap } = getSharedTopicCounts(
            currentItem,
            item,
          );
          return familyOverlap >= 2 || topicalOverlap >= 3;
        }),
      )
    : [];
  const broadFallback = currentItem
    ? sortByTopicRelevance(currentItem, liveCalculators)
    : liveCalculators;
  const seen = new Set<string>([currentUrl]);

  return [
    ...preferredItems,
    ...explicitlyRelated,
    ...reciprocalLinks,
    ...sameFamily,
    ...sameTopic,
    ...sameCategory,
    ...crossCategoryTopicMatches,
    ...broadFallback,
  ]
    .filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .slice(0, Math.min(Math.max(limit, 4), 6))
    .map(linkFor);
}
