// Robust fetch wrapper with retry, timeout, rate limiting, and human-like delays

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
];

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
  options: RequestInit & { timeout?: number } = {}
): Promise<FetchResult<string>> {
  const { timeout = 15000, headers = {}, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        ...headers,
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      // Too many requests — wait longer
      await randomDelay(8000);
      return robustFetch(url, options);
    }

    if (response.status === 403) {
      return { data: null, status: 403, error: 'Forbidden — site blocked us' };
    }

    if (!response.ok) {
      return { data: null, status: response.status, error: `HTTP ${response.status}` };
    }

    const text = await response.text();
    return { data: text, status: response.status };
  } catch (err) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { data: null, status: 0, error: message };
  }
}