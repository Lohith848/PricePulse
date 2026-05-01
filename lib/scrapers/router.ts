import { ScrapedProduct, ScraperResult } from './types';
import { scrapeEbay } from './ebay';
import { scrapeBestbuy } from './bestbuy';
import { scrapeSteam } from './steam';

const SCRAPERS = {
  ebay: scrapeEbay,
  bestbuy: scrapeBestbuy,
  steam: scrapeSteam,
} as const;

type Site = keyof typeof SCRAPERS;

function detectSite(url: string): Site | null {
  const lower = url.toLowerCase();
  if (lower.includes('ebay.')) return 'ebay';
  if (lower.includes('bestbuy.')) return 'bestbuy';
  if (lower.includes('store.steampowered.')) return 'steam';
  return null;
}

export async function scrapeProduct(url: string): Promise<ScraperResult> {
  const site = detectSite(url);
  if (!site) {
    return { success: false, error: 'Unsupported site — only eBay, Best Buy, and Steam are supported' };
  }

  try {
    const result = await SCRAPERS[site](url);
    if (result.success && result.product) {
      return { success: true, product: { ...result.product, originalUrl: url, site } };
    }
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Scraping failed';
    return { success: false, error: message };
  }
}

export { scrapeEbay, scrapeBestbuy, scrapeSteam };
export type { ScrapedProduct, ScraperResult };