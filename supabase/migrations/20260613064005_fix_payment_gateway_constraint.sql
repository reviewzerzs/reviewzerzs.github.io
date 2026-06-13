ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_gateway_check;

ALTER TABLE orders ADD CONSTRAINT orders_payment_gateway_check
  CHECK (payment_gateway = ANY (ARRAY['stripe'::text, 'ltc'::text]));