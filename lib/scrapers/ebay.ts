import * as cheerio from 'cheerio';
import { robustFetch, randomDelay } from './fetch-wrapper';
import type { ScraperResult } from './types';

export async function scrapeEbay(url: string): Promise<ScraperResult> {
  await randomDelay();

  const result = await robustFetch(url, { timeout: 15000 });
  if (!result.data) {
    return { success: false, error: result.error || 'Failed to fetch eBay page' };
  }

  const $ = cheerio.load(result.data);

  // eBay price selector — tries multiple patterns
  const priceText =
    $('.a-price-whole').first().text() ||
    $('[data-testid="x-price-primary"]').first().text() ||
    $('span[itemprop="price"]').first().attr('content') ||
    $('.vi-price').first().text() ||
    $('div.x-price__container').first().text() ||
    '';

  const priceMatch = priceText.match(/[\d,]+\.?\d*/);
  if (!priceMatch) {
    return { success: false, error: 'Could not extract price from eBay page' };
  }
  const price = parseFloat(priceMatch[0].replace(/,/g, ''));
  if (isNaN(price)) {
    return { success: false, error: 'Invalid price format from eBay' };
  }

  const name =
    $('h1.x-item-title__mainTitle').first().text() ||
    $('div.x-item-title').first().text() ||
    $('h1[itemprop="name"]').first().text() ||
    $('h1.product-title').first().text() ||
    $('h1').first().text() ||
    'Unknown Product';

  const imageUrl =
    $('img[loading="eager"]').first().attr('src') ||
    $('img.ux-image-carousel-item').first().attr('src') ||
    $('[data-testid="x-image-immersive-0"]').first().attr('src') ||
    $('div.ux-image-carousel-item').find('img').first().attr('src') ||
    $('img').first().attr('src') ||
    '';

  return {
    success: true,
    product: { name: name.trim(), price, imageUrl, originalUrl: url, site: 'ebay' as const },
  };
}