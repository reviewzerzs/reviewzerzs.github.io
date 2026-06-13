import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const BINANCE_API_KEY = Deno.env.get('BINANCE_API_KEY')!;
const BINANCE_API_SECRET = Deno.env.get('BINANCE_API_SECRET')!;
const BINANCE_MERCHANT_ID = Deno.env.get('BINANCE_MERCHANT_ID')!;
const BINANCE_API_BASE = 'https://bpay.binanceapi.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function buildSignature(
  timestamp: string,
  nonce: string,
  body: string,
  secret: string,
): Promise<string> {
  const payload = `${timestamp}\n${nonce}\n${body}\n`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

function generateNonce(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => chars[b % chars.length])
    .join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  // Authenticate user
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return jsonResponse({ error: 'Missing Authorization header' }, 401);

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return jsonResponse({ error: 'Unauthorized' }, 401);

  let body: { order_id: string; amount: number; currency: 'LTC' | 'USDT'; order_description?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { order_id, amount, currency, order_description } = body;

  if (!order_id || !amount || !currency) {
    return jsonResponse({ error: 'Missing required fields: order_id, amount, currency' }, 400);
  }
  if (!['LTC', 'USDT'].includes(currency)) {
    return jsonResponse({ error: 'Currency must be LTC or USDT' }, 400);
  }
  if (!BINANCE_API_KEY || !BINANCE_API_SECRET || !BINANCE_MERCHANT_ID) {
    return jsonResponse({ error: 'Binance merchant credentials not configured' }, 500);
  }

  // Verify order belongs to user
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, advertiser_id, status, total_budget, business_name, num_reviews, platforms')
    .eq('id', order_id)
    .eq('advertiser_id', user.id)
    .maybeSingle();

  if (orderError || !order) {
    return jsonResponse({ error: 'Order not found or access denied' }, 404);
  }
  if (order.status !== 'pending_payment') {
    return jsonResponse({ error: `Order is already ${order.status}` }, 400);
  }

  // Build Binance Pay request
  const merchantTradeNo = `RZZ-${order_id.replace(/-/g, '').substring(0, 20)}-${Date.now()}`.substring(0, 32);
  const requestBody = JSON.stringify({
    env: { terminalType: 'WEB' },
    merchantTradeNo,
    orderAmount: Number(amount.toFixed(8)),
    currency,
    description: order_description ?? `ReviewZerZ: ${order.num_reviews} reviews for ${order.business_name}`,
    goodsDetails: [
      {
        goodsType: '02',
        goodsCategory: 'Z000',
        referenceGoodsId: order_id,
        goodsName: `ReviewZerZ Reviews`,
        goodsDetail: `${order.num_reviews} reviews on ${(order.platforms as string[]).join(', ')} for ${order.business_name}`,
      },
    ],
    returnUrl: `${req.headers.get('origin') ?? ''}/checkout/success?order_id=${order_id}`,
    cancelUrl: `${req.headers.get('origin') ?? ''}/dashboard/advertiser`,
  });

  const timestamp = String(Date.now());
  const nonce = generateNonce();
  const signature = await buildSignature(timestamp, nonce, requestBody, BINANCE_API_SECRET);

  let binanceRes: Response;
  try {
    binanceRes = await fetch(`${BINANCE_API_BASE}/binancepay/openapi/v2/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BinancePay-Timestamp': timestamp,
        'BinancePay-Nonce': nonce,
        'BinancePay-Certificate-SN': BINANCE_API_KEY,
        'BinancePay-Signature': signature,
      },
      body: requestBody,
    });
  } catch (err: any) {
    console.error('Binance API network error:', err.message);
    return jsonResponse({ error: 'Failed to reach Binance Pay API' }, 502);
  }

  const binanceData = await binanceRes.json();
  console.log('Binance API response:', JSON.stringify(binanceData));

  if (binanceData.status !== 'SUCCESS' || !binanceData.data) {
    return jsonResponse({
      error: binanceData.errorMessage ?? 'Binance Pay order creation failed',
      code: binanceData.code,
    }, 400);
  }

  const { prepayId, checkoutUrl, qrcodeLink, qrContent, universalUrl } = binanceData.data;

  // Persist the prepayId against the order so the webhook can match it
  await supabase
    .from('orders')
    .update({
      payment_gateway: 'binance',
      gateway_transaction_id: prepayId,
    })
    .eq('id', order_id);

  return jsonResponse({
    prepayId,
    merchantTradeNo,
    checkoutUrl,
    qrcodeLink,
    qrContent,
    universalUrl,
    currency,
  });
});
