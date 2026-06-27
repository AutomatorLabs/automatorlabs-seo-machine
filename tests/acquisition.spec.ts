import { expect, test } from '@playwright/test';
import {
  newsletterConfig,
  newsletterCta,
  newsletterLink,
  readStructuredData,
} from './helpers/calculator-test-helpers';

test.describe('newsletter acquisition', () => {
  test('newsletter landing page loads with hosted signup CTA, canonical, and key tools', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/newsletter/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Practical financial tools, delivered when they are useful',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/newsletter/',
    );
    await expect(newsletterCta(page)).toBeVisible();
    await expect(newsletterLink(page)).toBeVisible();
    await expect(newsletterLink(page)).toHaveAttribute(
      'href',
      newsletterConfig.publicationUrl,
    );
    await expect(
      page.locator('a[href="/calculators/compound-interest/"]'),
    ).toContainText('Compound Interest Calculator');
    await expect(
      page.locator('a[href="/calculators/fire-calculator/"]'),
    ).toContainText('FIRE Calculator');
    await expect(
      page.locator('a[href="/calculators/mortgage-payoff-calculator/"]'),
    ).toContainText('Mortgage Calculator');
    await expect(page.locator('a[href="/examples/"]').first()).toContainText(
      'Examples Hub',
    );

    const structuredData = await readStructuredData(page);
    expect(structuredData).toContain('"@type":"FAQPage"');
    expect(pageErrors).toEqual([]);
  });

  for (const route of ['/', '/examples/']) {
    test(`${route} includes the shared hosted newsletter CTA`, async ({
      page,
    }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      const response = await page.goto(route, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.ok()).toBe(true);
      await expect(newsletterCta(page)).toBeVisible();
      await expect(newsletterLink(page)).toBeVisible();
      await expect(newsletterLink(page)).toHaveAttribute(
        'href',
        newsletterConfig.publicationUrl,
      );
      expect(pageErrors).toEqual([]);
    });
  }
});
