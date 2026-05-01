interface EmailAlert {
  userId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  targetPrice: number;
  url: string;
}

export async function sendEmailAlert(alert: EmailAlert): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const savedAmount = alert.oldPrice - alert.newPrice;
  const savingsPct = ((savedAmount / alert.oldPrice) * 100).toFixed(0);

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0c0c0f; color: #ffffff;">
      <div style="border-bottom: 2px solid #00ff88; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #00ff88; font-size: 24px; margin: 0;">PricePulse Alert</h1>
        <p style="color: #888; font-size: 14px; margin: 4px 0 0;">Your tracked product has hit your target price!</p>
      </div>
      <h2 style="font-size: 20px; margin: 0 0 16px;">${alert.productName}</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        <div style="background: #1a1a1f; padding: 16px; border-radius: 8px;">
          <div style="color: #666; font-size: 12px;">Previous</div>
          <div style="font-size: 20px; text-decoration: line-through; color: #f87171;">$${alert.oldPrice.toFixed(2)}</div>
        </div>
        <div style="background: #1a1a1f; padding: 16px; border-radius: 8px;">
          <div style="color: #666; font-size: 12px;">Current</div>
          <div style="font-size: 20px; color: #00ff88;">$${alert.newPrice.toFixed(2)}</div>
        </div>
        <div style="background: #1a1a1f; padding: 16px; border-radius: 8px;">
          <div style="color: #666; font-size: 12px;">Your Target</div>
          <div style="font-size: 20px; color: #fbbf24;">$${alert.targetPrice.toFixed(2)}</div>
        </div>
        <div style="background: #1a1a1f; padding: 16px; border-radius: 8px;">
          <div style="color: #666; font-size: 12px;">You Save</div>
          <div style="font-size: 20px; color: #00ff88;">${savingsPct}%</div>
        </div>
      </div>
      <a href="${alert.url}" style="display: block; background: #00ff88; color: #000; text-align: center; padding: 14px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 16px;">Buy Now</a>
      <p style="color: #444; font-size: 12px; margin-top: 24px; text-align: center;">PricePulse — Stop overpaying</p>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PricePulse <alerts@pricepulse.dev>',
        to: 'user@example.com', // In production, fetch user email from userId
        subject: `Price Drop: ${alert.productName} is now $${alert.newPrice.toFixed(2)}!`,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}