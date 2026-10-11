CREATE TABLE orders (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fingerprint TEXT NOT NULL,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  total_cents INTEGER NOT NULL CHECK (total_cents > 0),
  notification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (notification_status IN ('pending', 'sent', 'failed'))
);
CREATE INDEX orders_created_at_idx ON orders (created_at DESC);
