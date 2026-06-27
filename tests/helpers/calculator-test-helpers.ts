import { calculatorConfigs } from '../../src/data/calculators';
import { newsletterConfig } from '../../src/data/newsletter';
import type { Page } from '@playwright/test';

export const calculators = Object.values(calculatorConfigs).sort((a, b) =>
  a.title.localeCompare(b.title),
);

export const clipboardOrigin = 'http://127.0.0.1:4321';

export const newsletterLink = (page: Page) =>
  page.getByRole('link', { name: 'Subscribe to the newsletter' });

export const newsletterCta = (page: Page) =>
  page.locator('aside[aria-label="AutomatorLabs newsletter signup"]');

export async function stubAnalytics(page: Page) {
  await page.route('https://www.googletagmanager.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '',
    });
  });
}

export async function readStructuredData(page: Page) {
  return page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => script.textContent ?? '').join('\n'),
    );
}

export { newsletterConfig };
