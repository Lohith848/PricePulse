import { NextRequest, NextResponse } from 'next/server';
import { scrapeProduct } from '@/lib/scrapers/router';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    try { new URL(url); } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const result = await scrapeProduct(url);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({ data: result.product });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}