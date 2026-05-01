-- Table 1: Products being tracked
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  name          TEXT,
  image_url     TEXT,
  site          TEXT,           -- 'ebay' | 'bestbuy' | 'steam'
  target_price  NUMERIC(10,2),
  current_price NUMERIC(10,2),
  check_interval INTEGER DEFAULT 24, -- hours: 6 | 12 | 24
  is_active     BOOLEAN DEFAULT true,
  last_checked  TIMESTAMPTZ,
  last_price   NUMERIC(10,2),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: Price history log
CREATE TABLE price_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  price       NUMERIC(10,2) NOT NULL,
  checked_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users own their data
CREATE POLICY "Users own their products"
  ON products FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users own their price history"
  ON price_history FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = price_history.product_id
      AND products.user_id = auth.uid()
    )
  );

-- Index for faster lookups
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_active ON products(user_id) WHERE is_active = true;
CREATE INDEX idx_price_history_product_id ON price_history(product_id);
CREATE INDEX idx_price_history_checked_at ON price_history(checked_at);