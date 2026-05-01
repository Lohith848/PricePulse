interface DiscordAlert {
  productName: string;
  oldPrice: number;
  newPrice: number;
  targetPrice: number;
  url: string;
  imageUrl?: string;
}

export async function sendDiscordAlert(alert: DiscordAlert): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const savedAmount = alert.oldPrice - alert.newPrice;
  const savingsPct = ((savedAmount / alert.oldPrice) * 100).toFixed(0);

  const body: Record<string, unknown> = {
    username: 'PricePulse',
    avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
    embeds: [{
      title: `Price Drop Alert: ${alert.productName}`,
      url: alert.url,
      color: 0x00ff88, // Neon green
      thumbnail: alert.imageUrl ? { url: alert.imageUrl } : undefined,
      fields: [
        { name: 'Previous Price', value: `$${alert.oldPrice.toFixed(2)}`, inline: true },
        { name: 'Current Price', value: `$${alert.newPrice.toFixed(2)}`, inline: true },
        { name: 'Your Target', value: `$${alert.targetPrice.toFixed(2)}`, inline: true },
        { name: 'You Save', value: `$${savedAmount.toFixed(2)} (${savingsPct}%)`, inline: true },
      ],
      footer: { text: 'PricePulse — Price tracking done right' },
      timestamp: new Date().toISOString(),
    }],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}