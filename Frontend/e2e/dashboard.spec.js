import { test, expect } from '@playwright/test';

const chartCanvas = (page) => page.getByTestId('chart').locator('canvas').first();

const stockRequest = (page, predicate = () => true) =>
  page.waitForRequest((req) => req.url().includes('/api/stocks/fetch') && predicate(new URL(req.url())));

test.describe('dashboard', () => {
  let consoleErrors;
  let consoleLogs;

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    consoleLogs = [];
    page.on('console', (msg) => {
      consoleLogs.push(msg.text());
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));
    // Fresh settings per test, unless a test opts to keep them across a reload
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('keep')) localStorage.clear();
    });
  });

  test('loads the default stock chart without errors', async ({ page }) => {
    const response = page.waitForResponse((res) => res.url().includes('/api/stocks/fetch'));
    await page.goto('/');
    expect((await response).status()).toBe(200);

    await expect(page.getByRole('heading', { name: 'STOCK DASHBOARD' })).toBeVisible();
    await expect(chartCanvas(page)).toBeVisible();
    await expect(page).toHaveTitle(/ADANIGREEN .*DhanMantri/);

    // Outgoing request and incoming response are logged in the console
    await expect.poll(() => consoleLogs.some((l) => l.includes('[http:api] → '))).toBe(true);
    await expect.poll(() => consoleLogs.some((l) => /\[http:api\] ← #\d+ 200/.test(l))).toBe(true);
    expect(consoleErrors).toEqual([]);
  });

  test('switching stocks requests the new symbol and updates the title', async ({ page }) => {
    await page.goto('/');
    await expect(chartCanvas(page)).toBeVisible();

    const input = page.getByRole('combobox', { name: 'Stock' });
    await input.fill('tcs');
    const request = stockRequest(page, (url) => url.searchParams.get('symbol') === 'TCS.NS');
    await page.getByRole('option', { name: 'TCS', exact: true }).click();
    await request;

    await expect(page).toHaveTitle(/^TCS Stock Chart/);
    await expect(input).toHaveValue('TCS');
    expect(await page.evaluate(() => localStorage.getItem('selectedStock'))).toBe('TCS.NS');

    // Symbols with characters that need URL encoding
    await input.fill('M&M');
    const mm = stockRequest(page, (url) => url.searchParams.get('symbol') === 'M&M.NS');
    await page.getByRole('option', { name: 'M&M', exact: true }).click();
    expect((await (await mm).response()).status()).toBe(200);
    expect(consoleErrors).toEqual([]);
  });

  test('time range buttons change the requested window', async ({ page }) => {
    await page.goto('/');
    await expect(chartCanvas(page)).toBeVisible();

    const request = stockRequest(page);
    await page.getByRole('button', { name: '1 Year' }).click();
    const start = new URL((await request).url()).searchParams.get('startDate');
    const daysBack = (Date.now() - Date.parse(start)) / 86_400_000;
    expect(daysBack).toBeGreaterThan(360);
    expect(daysBack).toBeLessThan(370);
    await expect(page.getByRole('button', { name: '1 Year' })).toHaveAttribute('aria-pressed', 'true');

    const all = stockRequest(page, (url) => url.searchParams.get('startDate') === '2000-01-01');
    await page.getByRole('button', { name: 'All Time' }).click();
    await all;
    await expect(chartCanvas(page)).toBeVisible();
  });

  test('candlestick toggle and tooltip show OHLC values', async ({ page }) => {
    await page.goto('/');
    const canvas = chartCanvas(page);
    await expect(canvas).toBeVisible();

    await page.getByRole('button', { name: 'Show candlestick chart' }).click();
    await expect(page.getByRole('button', { name: 'Show line chart' })).toBeVisible();

    const box = await canvas.boundingBox();
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5);
    await expect(page.getByText(/Open: \d/)).toBeVisible();
    await expect(page.getByText(/High: \d/)).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test('custom date range validates and applies', async ({ page }) => {
    await page.goto('/');
    await expect(chartCanvas(page)).toBeVisible();

    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText('Please select both start and end dates.')).toBeVisible();

    await page.getByLabel('Start Date').fill('2025-01-01');
    await page.getByLabel('End Date').fill('2025-06-30');
    const request = stockRequest(page, (url) => url.searchParams.get('startDate') === '2025-01-01');
    await page.getByRole('button', { name: 'Apply' }).click();
    expect(new URL((await request).url()).searchParams.get('endDate')).toBe('2025-06-30');
  });

  test('settings persist across reloads', async ({ page }) => {
    await page.goto('/');
    await expect(chartCanvas(page)).toBeVisible();
    await page.getByRole('button', { name: '6 Months' }).click();
    await page.getByRole('button', { name: 'Show candlestick chart' }).click();

    // Keep storage this time
    await page.evaluate(() => sessionStorage.setItem('keep', '1'));
    await page.reload();
    await expect(page.getByRole('button', { name: '6 Months' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Show line chart' })).toBeVisible();
  });
});
