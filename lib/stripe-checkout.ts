import { supabase } from './supabase';

interface CheckoutByPriceId {
  price_id: string;
  success_url: string;
  cancel_url: string;
  mode?: 'payment' | 'subscription';
  order_id?: string;
}

interface CheckoutByAmount {
  amount: number;
  product_name: string;
  success_url: string;
  cancel_url: string;
  mode?: 'payment';
  order_id?: string;
}

export type CheckoutSessionRequest = CheckoutByPriceId | CheckoutByAmount;

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(
  request: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('User not authenticated');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const response = await fetch(
    `${supabaseUrl}/functions/v1/stripe-checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  return response.json();
}
