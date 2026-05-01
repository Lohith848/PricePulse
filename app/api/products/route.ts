import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { scrapeProduct } from '@/lib/scrapers/router';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*, price_history(price, checked_at)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: products });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, targetPrice, userId, checkInterval = 24 } = body;

    if (!url || !userId) {
      return NextResponse.json({ error: 'url and userId are required' }, { status: 400 });
    }

    // Scrape the product first to get name, price, image
    const scrapeResult = await scrapeProduct(url);
    if (!scrapeResult.success || !scrapeResult.product) {
      return NextResponse.json({ error: scrapeResult.error || 'Failed to scrape product' }, { status: 422 });
    }

    const product = scrapeResult.product;
    const supabase = createAdminClient();

    // Check if already tracked
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('url', url)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Product already tracked', productId: existing.id }, { status: 409 });
    }

    // Insert product
    const { data: inserted, error } = await supabase
      .from('products')
      .insert({
        user_id: userId,
        url,
        name: product.name,
        image_url: product.imageUrl,
        site: product.site,
        target_price: targetPrice || product.price * 0.9, // Default: alert at 10% below current
        current_price: product.price,
        last_price: product.price,
        check_interval: checkInterval,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log first price
    await supabase.from('price_history').insert({
      product_id: inserted.id,
      price: product.price,
    });

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const userId = searchParams.get('userId');

  if (!productId || !userId) {
    return NextResponse.json({ error: 'productId and userId are required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}