export interface ScrapedProduct {
  name: string;
  price: number;
  imageUrl: string;
  originalUrl: string;
  site: 'ebay' | 'bestbuy' | 'steam';
}

export interface ScraperResult {
  success: boolean;
  product?: ScrapedProduct;
  error?: string;
}

export type Scraper = (url: string) => Promise<ScraperResult>;