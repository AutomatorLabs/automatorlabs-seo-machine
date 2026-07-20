import { expect, test } from '@playwright/test';
import { stubAnalytics } from './helpers/calculator-test-helpers';

/**
 * Regression coverage for a bug where the ladder, the "in your own country" median,
 * and the "for scale" figures kept rendering in the country's own local currency
 * instead of the currency selected in the dropdown. Only the small helper hint line
 * under the input is meant to show the country's local-currency equivalent — every
 * other money value must track the selected currency exactly.
 */

const CCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', VND: '₫' };

const parseMoney = (text: string): number => {
  const match = text.match(/-?[\d,]+/);
  if (!match) throw new Error(`No number found in "${text}"`);
  return parseFloat(match[0].replace(/,/g, ''));
};

const parseAllWithSymbol = (text: string, sym: string): number[] => {
  const escaped = sym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...text.matchAll(new RegExp(`${escaped}(-?[\\d,]+)`, 'g'))];
  return matches.map((m) => parseFloat(m[1].replace(/,/g, '')));
};

// A rendered money cell must always carry a unit (a currency symbol, or a code like "ZMW " /
// "CUP" from the app.js fallback) — a string that's purely digits/commas/minus/dot/whitespace
// is a bare, unlabeled number and is exactly the bug this guards against.
const hasUnit = (text: string): boolean => /[^\d,.\-\s]/.test(text);

test.describe('wealth rank currency selector', () => {
  test('ladder, national median, and for-scale figures follow the selected currency, not the country’s local currency', async ({
    page,
  }) => {
    await stubAnalytics(page);
    await page.goto('/where-do-you-rank/', { waitUntil: 'networkidle' });

    await page.selectOption('#country', { label: 'Vietnam' });
    await page.click('#tab-wealth');
    await page.fill('#amount', '100,000');
    await page.selectOption('#currency', 'USD');
    await page.locator('#recalc').click();
    await page.waitForTimeout(200);

    // The hint line is the one intentional exception — it always shows the VND equivalent.
    await expect(page.locator('#hint')).toContainText('₫');
    await expect(page.locator('#hint')).toContainText('VND');

    // Everything else must be in USD ($), not VND (₫).
    const natsub = await page.locator('#natsub').innerText();
    expect(natsub).toContain('$');
    expect(natsub).not.toContain('₫');

    const context = await page.locator('#context').innerText();
    expect(context).toContain('$');
    expect(context).not.toContain('₫');

    const ladderCells = await page.locator('#ladderbody tr td:last-child').allInnerTexts();
    for (const cell of ladderCells) {
      expect(cell).toContain('$');
      expect(cell).not.toContain('₫');
    }
  });

  test('switching currency (USD → EUR → VND) updates every ladder row, the national median, and both for-scale figures, consistent under FX round-trip', async ({
    page,
  }) => {
    await stubAnalytics(page);
    await page.goto('/where-do-you-rank/', { waitUntil: 'networkidle' });

    const fx: Record<string, number> = await page.evaluate(() =>
      fetch('/wealth-rank/data.json')
        .then((r) => r.json())
        .then((d) => d.fx),
    );

    await page.selectOption('#country', { label: 'Vietnam' });
    await page.click('#tab-wealth');
    await page.fill('#amount', '100,000');
    await page.locator('#recalc').click();
    await page.waitForTimeout(200);

    const snapshots: Record<string, { natsub: number; ladder: number[]; wm: number; amt: number }> = {};

    for (const ccy of ['USD', 'EUR', 'VND']) {
      await page.selectOption('#currency', ccy);
      await page.waitForTimeout(200);

      const sym = CCY_SYMBOL[ccy];
      const natsubText = await page.locator('#natsub').innerText();
      const contextText = await page.locator('#context').innerText();
      const ladderCells = await page.locator('#ladderbody tr td:last-child').allInnerTexts();

      // Every ladder cell and the median figure must carry the newly selected symbol.
      expect(natsubText).toContain(sym);
      const [wm, amt] = parseAllWithSymbol(contextText, sym);
      expect(wm, `for-scale world-median figure missing ${sym} after switching to ${ccy}`).not.toBeUndefined();
      expect(amt, `for-scale entered-amount figure missing ${sym} after switching to ${ccy}`).not.toBeUndefined();
      for (const cell of ladderCells) {
        expect(cell, `ladder cell "${cell}" missing ${sym} after switching to ${ccy}`).toContain(sym);
      }

      snapshots[ccy] = {
        natsub: parseMoney(natsubText.split(sym).pop() as string),
        ladder: ladderCells.map(parseMoney),
        wm,
        amt,
      };
    }

    // Round-trip: converting every currency's ladder/median/world-median figures back to a
    // common base (divide by that currency's FX rate) must land within rounding tolerance of
    // every other currency, since only the display unit changed — the underlying Vietnam data
    // (ladder, median) and the tool's own PPP-based world-median figure did not.
    const toBase = (value: number, ccy: string) => value / fx[ccy];
    const baseUSD = {
      natsub: toBase(snapshots.USD.natsub, 'USD'),
      ladder: snapshots.USD.ladder.map((v) => toBase(v, 'USD')),
      wm: toBase(snapshots.USD.wm, 'USD'),
    };

    const tolerance = 0.01; // 1% — rounding from Math.round() in the app's own formatter
    for (const ccy of ['EUR', 'VND']) {
      const s = snapshots[ccy];
      expect(Math.abs(toBase(s.natsub, ccy) - baseUSD.natsub) / baseUSD.natsub).toBeLessThan(tolerance);
      expect(Math.abs(toBase(s.wm, ccy) - baseUSD.wm) / baseUSD.wm).toBeLessThan(tolerance);
      s.ladder.forEach((v, i) => {
        const base = baseUSD.ladder[i];
        if (Math.abs(base) < 1) return; // skip near-zero rows, ratio is unstable
        expect(Math.abs(toBase(v, ccy) - base) / Math.abs(base)).toBeLessThan(tolerance);
      });
    }

    // "You entered" is a literal echo of the typed digits (100,000), reinterpreted in
    // whichever currency is currently selected — it is NOT proportionally FX-converted like
    // the ladder/median figures, so it must show the same number in every currency.
    for (const ccy of ['USD', 'EUR', 'VND']) {
      expect(snapshots[ccy].amt).toBeCloseTo(100000, -1);
    }

    // Sanity: the figures actually changed across currencies (not stuck / stale on switch).
    expect(snapshots.USD.natsub).not.toBe(snapshots.EUR.natsub);
    expect(snapshots.EUR.natsub).not.toBe(snapshots.VND.natsub);
  });

  test('a formerly-unconvertible country (Zambia, local currency kwacha) now converts: switching USD → EUR updates every figure and stays FX-consistent, with no unit-less cells', async ({
    page,
  }) => {
    await stubAnalytics(page);
    await page.goto('/where-do-you-rank/', { waitUntil: 'networkidle' });

    const fx: Record<string, number> = await page.evaluate(() =>
      fetch('/wealth-rank/data.json')
        .then((r) => r.json())
        .then((d) => d.fx),
    );
    expect(fx.ZMW, 'Zambian kwacha must now have an fx rate on file').toBeGreaterThan(0);

    await page.selectOption('#country', { label: 'Zambia' });
    await page.fill('#amount', '50,000');
    await page.locator('#recalc').click();
    await page.waitForTimeout(200);

    const snapshots: Record<string, { natsub: number; ladder: number[]; wm: number }> = {};

    for (const ccy of ['USD', 'EUR']) {
      await page.selectOption('#currency', ccy);
      await page.waitForTimeout(200);

      const sym = CCY_SYMBOL[ccy];
      const natsubText = await page.locator('#natsub').innerText();
      const contextText = await page.locator('#context').innerText();
      const ladderCells = await page.locator('#ladderbody tr td:last-child').allInnerTexts();

      expect(natsubText, `national median missing ${sym} after switching to ${ccy}`).toContain(sym);
      for (const cell of ladderCells) {
        expect(hasUnit(cell), `ladder cell "${cell}" has no unit after switching to ${ccy}`).toBe(true);
        expect(cell, `ladder cell "${cell}" should show ${sym}, not the kwacha`).toContain(sym);
      }

      const [wm] = parseAllWithSymbol(contextText, sym);
      expect(wm, `for-scale world-median figure missing ${sym} after switching to ${ccy}`).not.toBeUndefined();

      snapshots[ccy] = {
        natsub: parseMoney(natsubText.split(sym).pop() as string),
        ladder: ladderCells.map(parseMoney),
        wm,
      };
    }

    // Every figure actually changed between USD and EUR display (not stale).
    expect(snapshots.USD.natsub).not.toBe(snapshots.EUR.natsub);
    snapshots.USD.ladder.forEach((v, i) => expect(v).not.toBe(snapshots.EUR.ladder[i]));

    // FX round-trip: divide back out by each currency's own rate and land on the same base value.
    const toBase = (value: number, ccy: string) => value / fx[ccy];
    const baseNatsub = toBase(snapshots.USD.natsub, 'USD');
    const baseWm = toBase(snapshots.USD.wm, 'USD');
    const tolerance = 0.01;
    expect(Math.abs(toBase(snapshots.EUR.natsub, 'EUR') - baseNatsub) / baseNatsub).toBeLessThan(tolerance);
    expect(Math.abs(toBase(snapshots.EUR.wm, 'EUR') - baseWm) / baseWm).toBeLessThan(tolerance);
    snapshots.USD.ladder.forEach((v, i) => {
      const base = toBase(v, 'USD');
      if (Math.abs(base) < 1) return;
      const eur = toBase(snapshots.EUR.ladder[i], 'EUR');
      expect(Math.abs(eur - base) / Math.abs(base)).toBeLessThan(tolerance);
    });

    // The hint line is still allowed (expected) to show the kwacha equivalent — that's the one
    // intentional exception — but the local-currency mode must NOT have been forced by a missing
    // rate anymore: it only happens if the user explicitly picks "local currency" from the dropdown.
    await expect(page.locator('#ccybadge')).toHaveText('EUR');
  });

  test('a broad sample of countries never renders a bare, unit-less money figure', async ({ page }) => {
    await stubAnalytics(page);
    await page.goto('/where-do-you-rank/', { waitUntil: 'networkidle' });

    // Mix of: previously-fine countries, freshly-fixed common currencies, CFA-franc countries
    // (shared regional currency), and the 4 known multi-tier-FX countries that stay local-only.
    const sample = [
      'United States',
      'Vietnam',
      'Kenya',
      'Nigeria',
      'Zambia',
      'Zimbabwe',
      'Sierra Leone',
      'Cuba',
      'North Korea',
      'Sudan',
      'Syrian Arab Republic',
      "Cote d'Ivoire",
      'Cameroon',
      'Fiji',
      'Bolivia',
    ];

    for (const country of sample) {
      await page.selectOption('#country', { label: country });
      await page.waitForTimeout(150);

      const natsubText = await page.locator('#natsub').innerText();
      const contextText = await page.locator('#context').innerText();
      const ladderCells = await page.locator('#ladderbody tr td:last-child').allInnerTexts();

      expect(hasUnit(natsubText), `${country}: natsub has no unit — "${natsubText}"`).toBe(true);
      // context has non-money words too ("×"), so just require at least one recognizable unit marker.
      expect(hasUnit(contextText), `${country}: context has no unit — "${contextText}"`).toBe(true);
      for (const cell of ladderCells) {
        if (cell === '—') continue; // missing data point, not a unit-less bug
        expect(hasUnit(cell), `${country}: ladder cell "${cell}" has no unit`).toBe(true);
      }
    }
  });
});
