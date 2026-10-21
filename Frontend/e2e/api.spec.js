import { test, expect } from '@playwright/test';

const API_URL = process.env.E2E_API_URL || 'http://localhost:5000';

test.describe('stock API', () => {
  test('health reports the database is up', async ({ request }) => {
    const res = await request.get(`${API_URL}/health`);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ status: 'ok', db: 'up' });
  });

  test('returns sorted candles with only chart fields', async ({ request }) => {
    const res = await request.get(`${API_URL}/api/stocks/fetch`, {
      params: { symbol: 'TCS.NS', startDate: '2025-01-01', endDate: '2025-03-31' },
    });
    expect(res.status()).toBe(200);
    expect(res.headers()['cache-control']).toContain('max-age');
    expect(res.headers()['x-request-id']).toBeTruthy();

    const data = await res.json();
    expect(data.length).toBeGreaterThan(40);
    expect(Object.keys(data[0]).sort()).toEqual(['Close', 'Date', 'High', 'Low', 'Open', 'Volume']);
    const dates = data.map((d) => Date.parse(d.Date));
    expect(dates).toEqual([...dates].sort((a, b) => a - b));
  });

  test('handles symbols with special characters', async ({ request }) => {
    for (const symbol of ['M&M.NS', '^NSEI', 'BAJAJ-AUTO.NS']) {
      const res = await request.get(`${API_URL}/api/stocks/fetch`, { params: { symbol, startDate: '2026-01-01' } });
      expect(res.status(), symbol).toBe(200);
      expect((await res.json()).length, symbol).toBeGreaterThan(0);
    }
  });

  test('rejects invalid input', async ({ request }) => {
    const cases = [
      {},
      { symbol: 'TCS.NS', startDate: 'not-a-date' },
      { symbol: 'TCS.NS', startDate: '2026-10-10', endDate: '2026-10-01' },
      { symbol: '{"$ne":null}' },
    ];
    for (const params of cases) {
      const res = await request.get(`${API_URL}/api/stocks/fetch`, { params });
      expect(res.status(), JSON.stringify(params)).toBe(400);
    }
  });
});
