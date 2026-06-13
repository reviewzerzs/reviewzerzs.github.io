-- Fix infinite recursion between orders and submissions RLS policies.
-- The loop: orders policy queries submissions → submissions policy queries orders → ∞
-- Solution: SECURITY DEFINER functions bypass RLS when doing the cross-table check.

-- ── Helper: does the current user own this order? ──
CREATE OR REPLACE FUNCTION is_order_advertiser(p_order_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM orders WHERE id = p_order_id AND advertiser_id = auth.uid()
  );
$$;

-- ── Helper: has the current user (reviewer) submitted to this order? ──
CREATE OR REPLACE FUNCTION reviewer_submitted_to_order(p_order_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM submissions WHERE order_id = p_order_id AND reviewer_id = auth.uid()
  );
$$;

-- ── Rebuild submissions policies (drop old cross-table SELECT/UPDATE) ──
DROP POLICY IF EXISTS "advertiser_select_submissions" ON submissions;
CREATE POLICY "advertiser_select_submissions" ON submissions
  FOR SELECT TO authenticated
  USING (is_order_advertiser(order_id));

DROP POLICY IF EXISTS "advertiser_update_submissions" ON submissions;
CREATE POLICY "advertiser_update_submissions" ON submissions
  FOR UPDATE TO authenticated
  USING (is_order_advertiser(order_id))
  WITH CHECK (is_order_advertiser(order_id));

-- ── Rebuild orders policy for reviewer claimed orders ──
DROP POLICY IF EXISTS "reviewer_see_claimed_orders" ON orders;
CREATE POLICY "reviewer_see_claimed_orders" ON orders
  FOR SELECT TO authenticated
  USING (reviewer_submitted_to_order(id));
