import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const calculatorsSourcePath = path.join(rootDir, 'src/data/calculators.ts');
const categoriesSourcePath = path.join(
  rootDir,
  'src/data/calculator-categories.ts',
);
const contentSourcePath = path.join(rootDir, 'src/data/content.ts');
const topicsSourcePath = path.join(rootDir, 'src/data/topics.ts');
const siteOrigin = 'https://automatorlabs.co';

const errors = [];

function addError(message) {
  errors.push(message);
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function routeFromHtmlFile(filePath) {
  const relativePath = path.relative(distDir, filePath);

  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith(`${path.sep}index.html`)) {
    return `/${relativePath
      .slice(0, -'index.html'.length)
      .split(path.sep)
      .join('/')}`;
  }

  return `/${relativePath.split(path.sep).join('/')}`;
}

function getAttribute(tag, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i');
  return tag.match(pattern)?.[1] ?? null;
}

function extractTitle(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
}

function extractMetaDescription(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const descriptionTag = tags.find(
    (tag) => getAttribute(tag, 'name')?.toLowerCase() === 'description',
  );

  return descriptionTag ? getAttribute(descriptionTag, 'content')?.trim() ?? '' : '';
}

function extractMetaByName(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const metaTag = tags.find(
    (tag) => getAttribute(tag, 'name')?.toLowerCase() === name.toLowerCase(),
  );

  return metaTag ? getAttribute(metaTag, 'content')?.trim() ?? '' : '';
}

function extractMetaByProperty(html, property) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const metaTag = tags.find(
    (tag) => getAttribute(tag, 'property')?.toLowerCase() === property.toLowerCase(),
  );

  return metaTag ? getAttribute(metaTag, 'content')?.trim() ?? '' : '';
}

function extractCanonical(html) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonicalTag = tags.find((tag) =>
    (getAttribute(tag, 'rel') ?? '')
      .toLowerCase()
      .split(/\s+/)
      .includes('canonical'),
  );

  return canonicalTag ? getAttribute(canonicalTag, 'href')?.trim() ?? '' : '';
}

function extractH1Count(html) {
  return html.match(/<h1\b/gi)?.length ?? 0;
}

function hasSchemaType(html, type) {
  return new RegExp(`"@type"\\s*:\\s*"${type}"`).test(html);
}

function hasNewsletterCta(html) {
  return (
    html.includes('aria-label="AutomatorLabs newsletter signup"') &&
    /Subscribe to the newsletter/i.test(html)
  );
}

function findDuplicateValues(pages, key, label) {
  const seen = new Map();

  for (const page of pages) {
    const value = page[key];
    if (!value) continue;

    if (!seen.has(value)) seen.set(value, []);
    seen.get(value).push(page.route);
  }

  for (const [value, routes] of seen.entries()) {
    if (routes.length > 1) {
      addError(
        `Duplicate ${label}: "${value}" appears on ${routes.length} pages: ${routes.join(
          ', ',
        )}`,
      );
    }
  }
}

function parseCalculatorUrls(source) {
  return [
    ...new Set(
      [...source.matchAll(/url:\s*'([^']+)'/g)]
        .map((match) => match[1])
        .filter((url) => url.startsWith('/calculators/')),
    ),
  ].sort();
}

function parseManualTopicUrls(source) {
  return [
    ...new Set(
      [...source.matchAll(/url:\s*'([^']+)'/g)]
        .map((match) => match[1])
        .filter((url) => url.startsWith('/')),
    ),
  ].sort();
}

function extractTopicsArraySource(source) {
  const declaration = 'export const topics';
  const declarationIndex = source.indexOf(declaration);
  if (declarationIndex === -1) return null;

  const assignmentIndex = source.indexOf('=', declarationIndex);
  if (assignmentIndex === -1) return null;

  const arrayStart = source.indexOf('[', assignmentIndex);
  if (arrayStart === -1) return null;

  let depth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplateString = false;
  let isEscaped = false;

  for (let index = arrayStart; index < source.length; index += 1) {
    const character = source[index];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (character === '\\') {
      isEscaped = true;
      continue;
    }

    if (!inDoubleQuote && !inTemplateString && character === "'") {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (!inSingleQuote && !inTemplateString && character === '"') {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && character === '`') {
      inTemplateString = !inTemplateString;
      continue;
    }

    if (inSingleQuote || inDoubleQuote || inTemplateString) {
      continue;
    }

    if (character === '[') {
      depth += 1;
      continue;
    }

    if (character === ']') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(arrayStart, index + 1);
      }
    }
  }

  return null;
}

function parseTopicsModule(source) {
  const topicsArraySource = extractTopicsArraySource(source);
  if (!topicsArraySource) return null;

  try {
    return Function(`"use strict"; return (${topicsArraySource});`)();
  } catch {
    return null;
  }
}

function validateTopicsData(topics) {
  if (!Array.isArray(topics) || topics.length === 0) {
    addError('Topics data module must export a non-empty topics array.');
    return;
  }

  const linkGroups = ['calculators', 'guides', 'examples'];

  for (const [sectionIndex, section] of topics.entries()) {
    const sectionTitle =
      typeof section?.title === 'string' && section.title.trim().length > 0
        ? section.title.trim()
        : `section ${sectionIndex + 1}`;

    if (!section || typeof section !== 'object') {
      addError(`Topics data contains an invalid topic section at index ${sectionIndex}.`);
      continue;
    }

    if (typeof section.title !== 'string' || section.title.trim().length === 0) {
      addError(`Topics data has a topic section with an empty title at index ${sectionIndex}.`);
    }

    if (
      typeof section.description !== 'string' ||
      section.description.trim().length === 0
    ) {
      addError(`Topic section "${sectionTitle}" has an empty description.`);
    }

    for (const groupName of linkGroups) {
      if (!(groupName in section)) {
        addError(`Topic section "${sectionTitle}" is missing the "${groupName}" link group.`);
        continue;
      }

      const links = section[groupName];

      if (!Array.isArray(links)) {
        addError(`Topic section "${sectionTitle}" has a non-array "${groupName}" link group.`);
        continue;
      }

      if (links.length === 0) {
        addError(`Topic section "${sectionTitle}" has an empty "${groupName}" link array.`);
        continue;
      }

      const seenLabels = new Set();
      const seenHrefs = new Set();

      for (const [linkIndex, link] of links.entries()) {
        const label = typeof link?.title === 'string' ? link.title.trim() : '';
        const href = typeof link?.url === 'string' ? link.url.trim() : '';
        const linkLabel = label || `link ${linkIndex + 1}`;

        if (!label) {
          addError(`Topic section "${sectionTitle}" has an empty label in "${groupName}".`);
        }

        if (!href) {
          addError(`Topic section "${sectionTitle}" has an empty href for "${linkLabel}" in "${groupName}".`);
          continue;
        }

        if (!href.startsWith('/')) {
          addError(`Topic section "${sectionTitle}" has a non-internal href "${href}" in "${groupName}".`);
        }

        if (href.startsWith('#')) {
          addError(`Topic section "${sectionTitle}" has a hash-only href "${href}" in "${groupName}".`);
        }

        if (/^[a-z]+:/i.test(href) || href.startsWith('//')) {
          addError(`Topic section "${sectionTitle}" has an external href "${href}" in "${groupName}".`);
        }

        if (seenLabels.has(label)) {
          addError(`Topic section "${sectionTitle}" has a duplicate label "${label}".`);
        } else if (label) {
          seenLabels.add(label);
        }

        if (seenHrefs.has(href)) {
          addError(`Topic section "${sectionTitle}" has a duplicate href "${href}".`);
        } else {
          seenHrefs.add(href);
        }
      }
    }
  }
}

function parseContentItems(source) {
  const items = [];
  const itemPattern = /\{\s*id:\s*'([^']+)',[\s\S]*?url:\s*'([^']+)'/g;

  for (const match of source.matchAll(itemPattern)) {
    items.push({ id: match[1], url: match[2] });
  }

  return items;
}

function slugFromCalculatorUrl(url) {
  return url.match(/^\/calculators\/([^/]+)\/$/)?.[1] ?? url;
}

function parseCalculatorCategoryIds(source) {
  const ids = new Set();
  const categorySlugs = new Set();

  for (const match of source.matchAll(/slug:\s*'([^']+)'/g)) {
    categorySlugs.add(match[1]);
  }

  for (const match of source.matchAll(/ids:\s*\[([\s\S]*?)\]/g)) {
    for (const idMatch of match[1].matchAll(/'([^']+)'/g)) {
      ids.add(idMatch[1]);
    }
  }

  return { ids, categorySlugs };
}

function normalizeInternalPath(href, currentRoute) {
  if (
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:')
  ) {
    return null;
  }

  let url;

  try {
    url = new URL(href, `${siteOrigin}${currentRoute}`);
  } catch {
    return null;
  }

  if (url.origin !== siteOrigin) return null;

  return decodeURIComponent(url.pathname);
}

function htmlRouteExists(route, htmlRoutes) {
  if (htmlRoutes.has(route)) return true;
  if (!path.extname(route) && htmlRoutes.has(`${route.replace(/\/$/, '')}/`)) {
    return true;
  }
  return false;
}

function distAssetExists(route) {
  const filePath = path.join(distDir, route.replace(/^\//, ''));
  return existsSync(filePath);
}

function auditInternalLinks(pages, htmlRoutes) {
  for (const page of pages) {
    const links = page.html.match(/<a\b[^>]*href=["'][^"']+["'][^>]*>/gi) ?? [];

    for (const link of links) {
      const href = getAttribute(link, 'href');
      const internalPath = normalizeInternalPath(href, page.route);
      if (!internalPath) continue;

      const hasFileExtension = Boolean(path.extname(internalPath));
      const exists = hasFileExtension
        ? distAssetExists(internalPath)
        : htmlRouteExists(internalPath, htmlRoutes);

      if (!exists) {
        addError(`Broken internal link on ${page.route}: ${href}`);
      }
    }
  }
}

async function main() {
  if (!existsSync(distDir)) {
    addError('Missing dist/ directory. Run `npm run build` before `npm run audit:seo`.');
  }

  const sitemapExists =
    existsSync(path.join(distDir, 'sitemap-index.xml')) ||
    existsSync(path.join(distDir, 'sitemap.xml'));
  if (!sitemapExists) {
    addError('Missing sitemap output. Expected dist/sitemap-index.xml or dist/sitemap.xml.');
  }

  const htmlFiles = existsSync(distDir)
    ? (await walkFiles(distDir)).filter((file) => file.endsWith('.html'))
    : [];
  const pages = [];

  for (const filePath of htmlFiles) {
    const html = await readFile(filePath, 'utf8');
    pages.push({
      filePath,
      route: routeFromHtmlFile(filePath),
      html,
      title: extractTitle(html),
      description: extractMetaDescription(html),
      canonical: extractCanonical(html),
      ogType: extractMetaByProperty(html, 'og:type'),
      ogSiteName: extractMetaByProperty(html, 'og:site_name'),
      ogTitle: extractMetaByProperty(html, 'og:title'),
      ogDescription: extractMetaByProperty(html, 'og:description'),
      ogUrl: extractMetaByProperty(html, 'og:url'),
      twitterCard: extractMetaByName(html, 'twitter:card'),
      twitterTitle: extractMetaByName(html, 'twitter:title'),
      twitterDescription: extractMetaByName(html, 'twitter:description'),
      h1Count: extractH1Count(html),
    });
  }

  const htmlRoutes = new Set(pages.map((page) => page.route));
  const pageByRoute = new Map(pages.map((page) => [page.route, page]));

  findDuplicateValues(pages, 'title', 'page title');
  findDuplicateValues(pages, 'description', 'meta description');
  findDuplicateValues(pages, 'canonical', 'canonical URL');

  for (const page of pages) {
    if (!page.canonical) {
      addError(`Missing canonical URL: ${page.route}`);
    }
    if (!page.ogType) {
      addError(`Missing og:type: ${page.route}`);
    }
    if (!page.ogSiteName) {
      addError(`Missing og:site_name: ${page.route}`);
    }
    if (!page.ogTitle) {
      addError(`Missing og:title: ${page.route}`);
    }
    if (!page.ogDescription) {
      addError(`Missing og:description: ${page.route}`);
    }
    if (!page.ogUrl) {
      addError(`Missing og:url: ${page.route}`);
    }
    if (!page.twitterCard) {
      addError(`Missing twitter:card: ${page.route}`);
    }
    if (!page.twitterTitle) {
      addError(`Missing twitter:title: ${page.route}`);
    }
    if (!page.twitterDescription) {
      addError(`Missing twitter:description: ${page.route}`);
    }
    if (page.canonical && page.ogUrl && page.canonical !== page.ogUrl) {
      addError(
        `Canonical URL and og:url do not match on ${page.route}: canonical=${page.canonical} og:url=${page.ogUrl}`,
      );
    }
    if (page.h1Count === 0) {
      addError(`Missing H1: ${page.route}`);
    }
    if (page.h1Count > 1) {
      addError(`More than one H1 (${page.h1Count}): ${page.route}`);
    }
  }

  const calculatorsSource = await readFile(calculatorsSourcePath, 'utf8');
  const categoriesSource = await readFile(categoriesSourcePath, 'utf8');
  const contentSource = await readFile(contentSourcePath, 'utf8');
  const topicsSource = await readFile(topicsSourcePath, 'utf8');
  const parsedTopics = parseTopicsModule(topicsSource);
  const calculatorUrls = new Set(parseCalculatorUrls(calculatorsSource));
  const manualTopicUrls = parseManualTopicUrls(topicsSource);
  const contentItems = parseContentItems(contentSource);
  const contentIds = new Set(contentItems.map((item) => item.id));
  const contentIdsByUrl = new Map();
  for (const item of contentItems) {
    if (!contentIdsByUrl.has(item.url)) contentIdsByUrl.set(item.url, []);
    contentIdsByUrl.get(item.url).push(item.id);
  }
  const { ids: categoryIds, categorySlugs } =
    parseCalculatorCategoryIds(categoriesSource);

  if (!parsedTopics) {
    addError('Failed to parse src/data/topics.ts for validation.');
  } else {
    validateTopicsData(parsedTopics);
  }

  for (const calculatorUrl of calculatorUrls) {
    if (!pageByRoute.has(calculatorUrl)) {
      addError(`Calculator config points to a missing built page: ${calculatorUrl}`);
    }
    const slug = slugFromCalculatorUrl(calculatorUrl);
    const publicIds = new Set([
      slug,
      `${slug}-calculator`,
      ...(contentIdsByUrl.get(calculatorUrl) ?? []),
    ]);
    if (![...publicIds].some((id) => categoryIds.has(id))) {
      addError(`Calculator is not assigned to any calculator category: ${calculatorUrl}`);
    }
  }

  for (const categoryId of categoryIds) {
    if (!contentIds.has(categoryId)) {
      addError(`Calculator category references an unknown calculator id: ${categoryId}`);
    }
  }

  for (const page of pages) {
    const match = page.route.match(/^\/calculators\/([^/]+)\/$/);
    if (!match) continue;

    const slug = match[1];
    const isCategoryPage = categorySlugs.has(slug);
    if (!isCategoryPage && !calculatorUrls.has(page.route)) {
      addError(`Built calculator page is not registered in calculator data: ${page.route}`);
    }
  }

  for (const calculatorUrl of calculatorUrls) {
    const page = pageByRoute.get(calculatorUrl);
    if (!page) continue;

    if (!hasSchemaType(page.html, 'FAQPage')) {
      addError(`Missing FAQPage schema on calculator page: ${calculatorUrl}`);
    }
    if (!hasSchemaType(page.html, 'BreadcrumbList')) {
      addError(`Missing BreadcrumbList schema on calculator page: ${calculatorUrl}`);
    }
    if (!hasNewsletterCta(page.html)) {
      addError(`Missing hosted newsletter CTA on calculator page: ${calculatorUrl}`);
    }
  }

  for (const topicUrl of manualTopicUrls) {
    if (!htmlRouteExists(topicUrl, htmlRoutes)) {
      addError(`Topics index links to a missing built page: ${topicUrl}`);
    }
  }

  auditInternalLinks(pages, htmlRoutes);

  if (errors.length > 0) {
    console.error(`SEO audit failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  const distStats = await stat(distDir);
  console.log('SEO audit passed.');
  console.log(`Checked ${pages.length} built HTML pages.`);
  console.log(`Checked ${calculatorUrls.size} registered calculator pages.`);
  console.log(`Checked ${categoryIds.size} calculator category assignments.`);
  console.log(`Checked ${manualTopicUrls.length} manually curated topic links.`);
  console.log(`Sitemap found in dist/ (built ${distStats.mtime.toISOString()}).`);
}

main().catch((error) => {
  console.error('SEO audit failed unexpectedly.');
  console.error(error);
  process.exitCode = 1;
});
