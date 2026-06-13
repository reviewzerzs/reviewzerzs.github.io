-- Add payment gateway tracking to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_gateway text DEFAULT 'stripe' CHECK (payment_gateway IN ('stripe', 'binance')),
  ADD COLUMN IF NOT EXISTS gateway_transaction_id text;

CREATE INDEX IF NOT EXISTS idx_orders_gateway_txn ON orders(gateway_transaction_id) WHERE gateway_transaction_id IS NOT NULL;

-- Widen payment_method constraint to include binance
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_method_check;
ALTER TABLE payments
  ADD CONSTRAINT payments_payment_method_check
  CHECK (payment_method IN ('stripe', 'paypal', 'binance'));

-- Add gateway_transaction_id to payments
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS gateway_transaction_id text;
