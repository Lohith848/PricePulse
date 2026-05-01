import { randomDelay } from './fetch-wrapper';
import type { ScraperResult } from './types';

function extractGameId(url: string): string | null {
  // /app/12345/ or /app/12345/slugs
  const match = url.match(/\/app\/(\d+)/);
  return match ? match[1] : null;
}

async function steamApiScrape(appId: string): Promise<ScraperResult> {
  // Use Steam's public API (no key needed)
  const apiUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=en`;

  const result = await fetch(apiUrl, {
    next: { revalidate: 60 },
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  });

  if (!result.ok) {
    return { success: false, error: 'Steam API request failed' };
  }

  const json = await result.json();
  const data = json[appId]?.data;

  if (!data) {
    return { success: false, error: 'No data returned from Steam API' };
  }

  // Price in cents from Steam API
  const price = (data.price_overview?.final_price ?? 0) / 100;
  const name = data.name || 'Unknown Game';
  const headerImage = data.header_image || '';
  const metacritic = data.metacritic?.score ? `🎯 Metacritic: ${data.metacritic.score}/100  ` : '';
  const genres = (data.genres || []).map((g: { description: string }) => g.description).join(', ');

  return {
    success: true,
    product: {
      name,
      price,
      imageUrl: headerImage,
      originalUrl: `https://store.steampowered.com/app/${appId}`,
      site: 'steam' as const,
    },
  };
}

export async function scrapeSteam(url: string): Promise<ScraperResult> {
  await randomDelay();

  const appId = extractGameId(url);
  if (!appId) {
    return { success: false, error: 'Could not extract Steam app ID from URL' };
  }

  try {
    return await steamApiScrape(appId);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Steam scraping failed';
    return { success: false, error: message };
  }
}