import * as cheerio from 'cheerio';
import { robustFetch, randomDelay } from './fetch-wrapper';
import type { ScraperResult } from './types';

export async function scrapeBestbuy(url: string): Promise<ScraperResult> {
  await randomDelay();

  const result = await robustFetch(url, { timeout: 15000 });
  if (!result.data) {
    return { success: false, error: result.error || 'Failed to fetch Best Buy page' };
  }

  const $ = cheerio.load(result.data);

  // Best Buy price — multiple selectors
  const priceText =
    $('[data-testid="customer-price"]').first().text() ||
    $('div.priceView-hero-price span').first().text() ||
    $('div.priceView-customer-price span').first().text() ||
    $('div.priceView-customer-price').first().attr('content') ||
    $('[class*="price"]').first().text() ||
    '';

  const priceMatch = priceText.match(/[\d,]+\.?\d*/);
  if (!priceMatch) {
    return { success: false, error: 'Could not extract price from Best Buy page' };
  }
  const price = parseFloat(priceMatch[0].replace(/,/g, ''));
  if (isNaN(price)) {
    return { success: false, error: 'Invalid price format from Best Buy' };
  }

  const name =
    $('h1.heading-5').first().text() ||
    $('h1[data-testid="product-title"]').first().text() ||
    $('h1.sku-title').first().text() ||
    $('h1').first().text() ||
    'Unknown Product';

  const imageUrl =
    $('img.product-image').first().attr('src') ||
    $('[data-testid="product-image"]').first().attr('src') ||
    $('img').first().attr('src') ||
    '';

  return {
    success: true,
    product: { name: name.trim(), price, imageUrl, originalUrl: url, site: 'bestbuy' as const },
  };
}