// Robust fetch wrapper with retry, timeout, rate limiting, and human-like delays

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
];

const ACCEPT_LANGUAGE = 'en-US,en;q=0.9,es;q=0.8,fr;q=0.7';
const ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8';

export function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Human-like delay between 2-5 seconds
export function randomDelay(ms: number = 3000): Promise<void> {
  const delay = Math.random() * ms + 2000;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export interface FetchResult<T = string> {
  data: T | null;
  status: number;
  error?: string;
}

export async function robustFetch(
  url: string,
  options: RequestInit & { timeout?: number; maxRetries?: number } = {}
): Promise<FetchResult<string>> {
  const { timeout = 15000, maxRetries = 2, headers = {}, ...rest } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const backoffDelay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...rest,
        signal: controller.signal,
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': ACCEPT,
          'Accept-Language': ACCEPT_LANGUAGE,
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
          ...headers,
        },
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        await randomDelay(10000 + Math.random() * 5000);
        if (attempt < maxRetries) continue;
        return { data: null, status: 429, error: 'Rate limited' };
      }

      if (response.status === 403) {
        if (attempt < maxRetries) continue;
        return { data: null, status: 403, error: 'Forbidden — site blocked us' };
      }

      if (!response.ok) {
        return { data: null, status: response.status, error: `HTTP ${response.status}` };
      }

      const text = await response.text();
      
      if (text.includes('captcha') || text.includes('challenge') || 
          text.includes('not a robot') || text.includes('access denied') ||
          text.toLowerCase().includes('bot')) {
        if (attempt < maxRetries) continue;
        return { data: null, status: 403, error: 'Bot detection challenge' };
      }

      return { data: text, status: response.status };
    } catch (err) {
      clearTimeout(timeoutId);
      const message = err instanceof Error ? err.message : 'Unknown error';
      
      if (attempt < maxRetries) continue;
      
      return { data: null, status: 0, error: message };
    }
  }

  return { data: null, status: 403, error: 'Max retries exceeded' };
}
