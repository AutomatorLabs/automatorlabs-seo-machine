export interface ProgrammaticSeoAuditResult {
  expectedCount: number;
  actualCount: number;
  uniqueSlugCount: number;
  uniqueTitleCount: number;
  uniqueDescriptionCount: number;
  uniqueCanonicalPathCount: number;
}

interface ProgrammaticSeoAuditPage {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  url: string;
}

interface ProgrammaticSeoAuditInput<RecordType extends { slug: string }> {
  clusterName: string;
  records: RecordType[];
  pages: ProgrammaticSeoAuditPage[];
  expectedCount: number;
  canonicalPathForSlug: (slug: string) => string;
}

function duplicateValues(values: string[]): string[] {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

export function auditProgrammaticSeoRecords<
  RecordType extends { slug: string },
>({
  clusterName,
  records,
  pages,
  expectedCount,
  canonicalPathForSlug,
}: ProgrammaticSeoAuditInput<RecordType>): ProgrammaticSeoAuditResult {
  const errors: string[] = [];
  const slugs = records.map((record) => record.slug);
  const titles = pages.map((page) => page.title);
  const seoTitles = pages.map((page) => page.seoTitle);
  const descriptions = pages.map((page) => page.metaDescription);
  const canonicalPaths = pages.map((page) => page.url);

  if (records.length !== expectedCount) {
    errors.push(
      `Expected ${expectedCount} ${clusterName} records, received ${records.length}.`,
    );
  }

  if (pages.length !== records.length) {
    errors.push(
      `Expected one page model per ${clusterName} record, received ${pages.length} pages for ${records.length} records.`,
    );
  }

  const invalidSlugs = slugs.filter(
    (slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),
  );
  if (invalidSlugs.length > 0) {
    errors.push(`Invalid slugs: ${invalidSlugs.join(', ')}`);
  }

  const checks = [
    ['slugs', slugs],
    ['titles', titles],
    ['SEO titles', seoTitles],
    ['meta descriptions', descriptions],
    ['canonical paths', canonicalPaths],
  ] as const;

  checks.forEach(([label, values]) => {
    const duplicates = duplicateValues(values);
    if (duplicates.length > 0) {
      errors.push(`Duplicate ${label}: ${duplicates.join(' | ')}`);
    }
  });

  const emptyDescriptions = pages
    .filter((page) => page.metaDescription.trim().length === 0)
    .map((page) => page.slug);
  if (emptyDescriptions.length > 0) {
    errors.push(
      `Empty meta descriptions for: ${emptyDescriptions.join(', ')}`,
    );
  }

  const invalidCanonicalPaths = pages
    .filter((page) => page.url !== canonicalPathForSlug(page.slug))
    .map((page) => page.url);
  if (invalidCanonicalPaths.length > 0) {
    errors.push(
      `Invalid canonical paths: ${invalidCanonicalPaths.join(', ')}`,
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `${clusterName} programmatic SEO audit failed:\n- ${errors.join('\n- ')}`,
    );
  }

  return {
    expectedCount,
    actualCount: records.length,
    uniqueSlugCount: new Set(slugs).size,
    uniqueTitleCount: new Set(titles).size,
    uniqueDescriptionCount: new Set(descriptions).size,
    uniqueCanonicalPathCount: new Set(canonicalPaths).size,
  };
}
