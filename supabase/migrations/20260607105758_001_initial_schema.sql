/*
# ReviewZerZ Marketplace - Initial Schema

1. New Tables
- `profiles`: User profiles with role (advertiser/reviewer), linked to auth.users
- `orders`: Review orders placed by advertisers with business details, platform, budget
- `submissions`: Review submissions by reviewers with proof and status tracking
- `payments`: Payment records linking orders to Stripe/PayPal transactions
- `blog_posts`: Blog content for the blog page
- `testimonials`: Customer testimonials displayed on homepage

2. Security
- Enable RLS on all tables
- Owner-scoped CRUD for profiles, orders, submissions, payments
- Public read for blog_posts and testimonials
- Advertisers can create orders; Reviewers can create submissions
- Cross-table policies for reviewers to see available orders and advertisers to see submissions on their orders

3. Notes
- profiles.role determines access: 'advertiser' or 'reviewer'
- orders.status tracks lifecycle: pending_payment, paid, in_progress, completed, cancelled
- submissions.status: submitted, approved, rejected
- Escrow simulation: advertiser pays upfront, reviewer paid after approval
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('advertiser', 'reviewer')),
  phone text,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  business_name text NOT NULL,
  google_link text,
  platforms text[] NOT NULL DEFAULT '{"google"}',
  num_reviews integer NOT NULL DEFAULT 1,
  review_rating integer NOT NULL DEFAULT 5 CHECK (review_rating >= 1 AND review_rating <= 5),
  location text,
  instructions text,
  deadline date,
  budget_per_review numeric NOT NULL DEFAULT 0,
  total_budget numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "advertiser_manage_orders" ON orders;
CREATE POLICY "advertiser_manage_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = advertiser_id);

DROP POLICY IF EXISTS "advertiser_insert_orders" ON orders;
CREATE POLICY "advertiser_insert_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = advertiser_id
    AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'advertiser')
  );

DROP POLICY IF EXISTS "advertiser_update_orders" ON orders;
CREATE POLICY "advertiser_update_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = advertiser_id) WITH CHECK (auth.uid() = advertiser_id);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  proof_url text,
  proof_description text,
  screenshot_urls text[],
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected')),
  reviewer_earned numeric NOT NULL DEFAULT 0,
  feedback text,
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviewer_select_submissions" ON submissions;
CREATE POLICY "reviewer_select_submissions" ON submissions FOR SELECT
  TO authenticated USING (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "advertiser_select_submissions" ON submissions;
CREATE POLICY "advertiser_select_submissions" ON submissions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = submissions.order_id AND orders.advertiser_id = auth.uid())
  );

DROP POLICY IF EXISTS "reviewer_insert_submissions" ON submissions;
CREATE POLICY "reviewer_insert_submissions" ON submissions FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = reviewer_id
    AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'reviewer')
  );

DROP POLICY IF EXISTS "advertiser_update_submissions" ON submissions;
CREATE POLICY "advertiser_update_submissions" ON submissions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = submissions.order_id AND orders.advertiser_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = submissions.order_id AND orders.advertiser_id = auth.uid())
  );

-- Now add the reviewer view policy for orders (after submissions exists)
DROP POLICY IF EXISTS "reviewer_view_available_orders" ON orders;
CREATE POLICY "reviewer_view_available_orders" ON orders FOR SELECT
  TO authenticated USING (
    status IN ('paid', 'in_progress')
    AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'reviewer')
  );

-- Add policy so reviewers can also see orders they've submitted to
DROP POLICY IF EXISTS "reviewer_see_claimed_orders" ON orders;
CREATE POLICY "reviewer_see_claimed_orders" ON orders FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM submissions WHERE submissions.order_id = orders.id AND submissions.reviewer_id = auth.uid())
  );

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payer_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  service_fee numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'stripe' CHECK (payment_method IN ('stripe', 'paypal')),
  stripe_session_id text,
  stripe_payment_intent_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_payments" ON payments;
CREATE POLICY "select_own_payments" ON payments FOR SELECT
  TO authenticated USING (auth.uid() = payer_id);

DROP POLICY IF EXISTS "insert_own_payments" ON payments;
CREATE POLICY "insert_own_payments" ON payments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = payer_id);

-- Blog posts table (public read)
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  thumbnail_url text,
  category text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_blog" ON blog_posts;
CREATE POLICY "public_read_blog" ON blog_posts FOR SELECT
  TO anon, authenticated USING (published = true);

-- Testimonials table (public read)
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  company text,
  content text NOT NULL,
  avatar_url text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_advertiser ON orders(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_submissions_order ON submissions(order_id);
CREATE INDEX IF NOT EXISTS idx_submissions_reviewer ON submissions(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
