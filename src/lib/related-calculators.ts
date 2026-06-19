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

const liveCalculators = contentItems
  .filter(
    (item) => item.category === 'calculator' && item.status === 'live',
  )
  .sort((a, b) => a.priority - b.priority);

function linkFor(item: ContentItem): RelatedCalculatorLink {
  return {
    title: item.title,
    url: item.url,
    description: item.description,
  };
}

export function createRelatedCalculatorLinks(
  currentUrl: string,
  providedLinks: BasicRelatedLink[] = [],
  limit = 6,
): RelatedCalculatorLink[] {
  const currentItem = liveCalculators.find((item) => item.url === currentUrl);
  const category = currentItem
    ? calculatorCategories.find((candidate) =>
        candidate.ids.includes(currentItem.id),
      )
    : undefined;
  const categoryIds = new Set(category?.ids ?? []);
  const preferredItems = providedLinks.flatMap((link) => {
    const item = liveCalculators.find((candidate) => candidate.url === link.url);
    return item ? [item] : [];
  });
  const explicitlyRelated = currentItem
    ? currentItem.relatedIds.flatMap((id) => {
        const item = liveCalculators.find((candidate) => candidate.id === id);
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
  const seen = new Set<string>([currentUrl]);

  return [
    ...preferredItems,
    ...explicitlyRelated,
    ...sameCategory,
    ...reciprocalLinks,
    ...liveCalculators,
  ]
    .filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .slice(0, Math.min(Math.max(limit, 4), 6))
    .map(linkFor);
}
