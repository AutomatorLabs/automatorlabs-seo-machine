import { expect, test } from '@playwright/test';
import { stubAnalytics } from './helpers/calculator-test-helpers';

test.describe('calculator result tables', () => {
  const tableCases = [
    {
      title: 'Compound Interest',
      url: '/calculators/compound-interest/',
      firstCell: '1',
    },
    {
      title: 'FIRE',
      url: '/calculators/fire-calculator/',
      firstCell: '0',
    },
    {
      title: 'Mortgage Payoff',
      url: '/calculators/mortgage-payoff-calculator/',
      firstCell: '1',
    },
    {
      title: 'Mortgage Payment',
      url: '/calculators/mortgage-payment-calculator/',
      firstCell: 'Principal and interest',
    },
    {
      title: 'Property Tax',
      url: '/calculators/property-tax-calculator/',
      firstCell: '1',
    },
    {
      title: 'Home Maintenance Cost',
      url: '/calculators/home-maintenance-cost-calculator/',
      firstCell: '1',
    },
    {
      title: 'Closing Cost',
      url: '/calculators/closing-cost-calculator/',
      firstCell: 'Down payment',
    },
    {
      title: 'Rent vs Buy',
      url: '/calculators/rent-vs-buy-calculator/',
      firstCell: '1',
    },
    {
      title: 'Home Affordability',
      url: '/calculators/home-affordability-calculator/',
      firstCell: 'Principal and interest',
    },
    {
      title: 'Down Payment',
      url: '/calculators/down-payment-calculator/',
      firstCell: '1',
    },
    {
      title: 'Mortgage Recast',
      url: '/calculators/mortgage-recast-calculator/',
      firstCell: 'Before recast',
    },
    {
      title: 'Debt Payoff',
      url: '/calculators/debt-payoff-calculator/',
      firstCell: '1',
    },
    {
      title: 'Credit Card Payoff',
      url: '/calculators/credit-card-payoff-calculator/',
      firstCell: '1',
    },
    {
      title: 'Credit Card Minimum Payment',
      url: '/calculators/credit-card-minimum-payment-calculator/',
      firstCell: '1',
    },
    {
      title: 'Credit Card Extra Payment',
      url: '/calculators/credit-card-extra-payment-calculator/',
      firstCell: '1',
    },
    {
      title: 'Balance Transfer',
      url: '/calculators/balance-transfer-calculator/',
      firstCell: '1',
    },
    {
      title: 'DRIP',
      url: '/calculators/drip-calculator/',
      firstCell: '1',
    },
  ];

  for (const tableCase of tableCases) {
    test(`${tableCase.title} table appears after calculation`, async ({
      page,
    }) => {
      await stubAnalytics(page);
      await page.goto(tableCase.url, { waitUntil: 'domcontentloaded' });

      const tableSection = page.locator('#result-table-section');
      await expect(tableSection).toBeHidden();

      await page.getByRole('button', { name: 'Calculate', exact: true }).click();

      await expect(tableSection).toBeVisible();
      await expect(tableSection.locator('table')).toBeVisible();
      await expect(tableSection.locator('tbody tr').first()).toBeVisible();
      await expect(
        tableSection.locator('tbody tr').first().locator('th'),
      ).toHaveText(tableCase.firstCell);
    });
  }
});
