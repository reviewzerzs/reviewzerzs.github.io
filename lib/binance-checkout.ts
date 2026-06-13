import { supabase } from './supabase';

export type BinanceCurrency = 'LTC' | 'USDT';

export interface BinanceCheckoutRequest {
  order_id: string;
  amount: number;
  currency: BinanceCurrency;
  order_description?: string;
}

export interface BinanceCheckoutResponse {
  prepayId: string;
  merchantTradeNo: string;
  checkoutUrl: string;
  qrcodeLink: string;
  qrContent: string;
  universalUrl: string;
  currency: BinanceCurrency;
}

export async function createBinanceCheckout(
  request: BinanceCheckoutRequest,
): Promise<BinanceCheckoutResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('User not authenticated');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const response = await fetch(`${supabaseUrl}/functions/v1/binance-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create Binance Pay order');
  }

  return data as BinanceCheckoutResponse;
}
