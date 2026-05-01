import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { scrapeProduct } from '@/lib/scrapers/router';
import { sendDiscordAlert } from '@/lib/notifications/discord';
import { sendEmailAlert } from '@/lib/notifications/email';
import { randomDelay } from '@/lib/scrapers/fetch-wrapper';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Get all active products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (error || !products) {
    return NextResponse.json({ error: error?.message || 'No products' }, { status: 500 });
  }

  const results = { checked: 0, alerts: 0, errors: 0 };

  for (const product of products) {
    await randomDelay(3_000); // 2-5s between each scrape

    const scrapeResult = await scrapeProduct(product.url);

    if (!scrapeResult.success || !scrapeResult.product) {
      product.is_active = false;
      await supabase.from('products').update({ is_active: false }).eq('id', product.id);
      results.errors++;
      continue;
    }

    const newPrice = scrapeResult.product.price;
    const priceDropped = newPrice < product.current_price;

    // Update current price
    await supabase.from('products').update({
      current_price: newPrice,
      last_price: product.current_price,
      last_checked: new Date().toISOString(),
    }).eq('id', product.id);

    // Log price history
    await supabase.from('price_history').insert({
      product_id: product.id,
      price: newPrice,
    });

    results.checked++;

    // Fire alert if price dropped below target
    if (priceDropped && newPrice <= product.target_price) {
      results.alerts++;

      if (process.env.DISCORD_WEBHOOK_URL) {
        await sendDiscordAlert({
          productName: product.name,
          oldPrice: product.current_price,
          newPrice,
          targetPrice: product.target_price,
          url: product.url,
          imageUrl: product.image_url,
        });
      }

      if (process.env.RESEND_API_KEY && product.user_id) {
        await sendEmailAlert({
          userId: product.user_id,
          productName: product.name,
          oldPrice: product.current_price,
          newPrice,
          targetPrice: product.target_price,
          url: product.url,
        });
      }
    }
  }

  return NextResponse.json({
    success: true,
    checked: results.checked,
    alerts: results.alerts,
    errors: results.errors,
    timestamp: new Date().toISOString(),
  });
}