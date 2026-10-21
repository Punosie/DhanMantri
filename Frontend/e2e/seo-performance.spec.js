import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test('head has title, description, canonical, social and structured data', async ({ page }) => {
    await page.goto('/');
    const head = page.locator('head');
    await expect(head.locator('meta[name="description"]')).toHaveAttribute('content', /NIFTY 50/);
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\//);
    await expect(head.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.png$/);
    await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    const jsonLd = JSON.parse(await head.locator('script[type="application/ld+json"]').textContent());
    expect(jsonLd['@type']).toBe('WebApplication');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('favicons, manifest, robots and sitemap are served', async ({ request }) => {
    for (const path of ['/favicon.ico', '/favicon.svg', '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png', '/og-image.png', '/robots.txt', '/sitemap.xml']) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      expect(res.headers()['content-type'], path).not.toContain('text/html');
    }
    const manifest = await (await request.get('/site.webmanifest')).json();
    expect(manifest.name).toContain('DhanMantri');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  });
});

test.describe('performance', () => {
  test('first load stays within budget', async ({ page }) => {
    let scriptBytes = 0;
    page.on('response', async (res) => {
      if (res.request().resourceType() === 'script' && res.url().startsWith(page.url().split('/').slice(0, 3).join('/'))) {
        scriptBytes += Number((await res.allHeaders())['content-length'] || (await res.body()).length);
      }
    });

    const started = Date.now();
    await page.goto('/');
    await expect(page.getByTestId('chart').locator('canvas').first()).toBeVisible();
    const chartVisibleMs = Date.now() - started;

    const metrics = await page.evaluate(() => new Promise((resolve) => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = Object.fromEntries(performance.getEntriesByType('paint').map((p) => [p.name, p.startTime]));
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve({
          ttfb: nav.responseStart,
          domContentLoaded: nav.domContentLoadedEventEnd,
          fcp: paint['first-contentful-paint'],
          lcp: entries.at(-1)?.startTime,
        });
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    }));

    const report = { ...metrics, chartVisibleMs, scriptKB: Math.round(scriptBytes / 1024) };
    test.info().annotations.push({ type: 'perf', description: JSON.stringify(report) });
    console.log('perf', report);

    expect(metrics.fcp).toBeLessThan(1500);
    expect(metrics.lcp).toBeLessThan(2500);
    expect(chartVisibleMs).toBeLessThan(4000);
  });

  test('repeat stock requests are served from the browser cache', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'uses the Chrome DevTools Protocol');
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Network.enable');
    const fromCache = [];
    cdp.on('Network.requestServedFromCache', ({ requestId }) => fromCache.push(requestId));

    const stockResponse = () => page.waitForResponse((res) => res.url().includes('/api/stocks/fetch'));
    const first = stockResponse();
    await page.goto('/');
    await first;

    const threeMonths = stockResponse();
    await page.getByRole('button', { name: '3 Months' }).click();
    await threeMonths;

    // Going back to 1 Month repeats the first URL, which Cache-Control lets the browser reuse
    const again = stockResponse();
    await page.getByRole('button', { name: '1 Month' }).click();
    await again;
    await expect.poll(() => fromCache.length).toBeGreaterThan(0);
  });
});

test('mobile layout has no horizontal scroll @mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('chart').locator('canvas').first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
