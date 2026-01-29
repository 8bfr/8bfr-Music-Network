-- === User Wallets ===
CREATE TABLE IF NOT EXISTS user_wallets (
  user_id UUID PRIMARY KEY,
  coins INT DEFAULT 0,
  is_balance_public BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- === Shop Items ===
CREATE TABLE IF NOT EXISTS carrie_shop_items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  category TEXT,
  image_url TEXT,
  model_url TEXT,
  price_coins INT DEFAULT 0,
  price_usd DECIMAL(6,2) DEFAULT 0,
  rarity TEXT DEFAULT 'basic',
  created_at TIMESTAMP DEFAULT NOW()
);

-- === Inventory ===
CREATE TABLE IF NOT EXISTS user_inventory (
  user_id UUID REFERENCES user_wallets(user_id),
  item_id BIGINT REFERENCES carrie_shop_items(id),
  owned BOOLEAN DEFAULT TRUE,
  acquired_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, item_id)
);

-- === Concert Schedule ===
CREATE TABLE IF NOT EXISTS concerts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  genre TEXT,
  day_of_week TEXT,
  start_time TIME,
  price_coins INT DEFAULT 0,
  ai_song_url TEXT,
  outfit TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- === Transactions ===
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  item_name TEXT,
  type TEXT,
  amount INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Owner God Mode preset
INSERT INTO user_wallets (user_id, coins, is_balance_public)
VALUES ('OWNER_UUID_PLACEHOLDER', 999999, TRUE)
ON CONFLICT (user_id) DO UPDATE SET coins=999999;
