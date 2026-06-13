import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const BINANCE_API_KEY = Deno.env.get('BINANCE_API_KEY')!;
const BINANCE_API_SECRET = Deno.env.get('BINANCE_API_SECRET')!;

async function verifySignature(
  timestamp: string,
  nonce: string,
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
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
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return computed === signature.toUpperCase();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const timestamp = req.headers.get('BinancePay-Timestamp') ?? '';
  const nonce = req.headers.get('BinancePay-Nonce') ?? '';
  const signature = req.headers.get('BinancePay-Signature') ?? '';
  const certSn = req.headers.get('BinancePay-Certificate-SN') ?? '';

  const rawBody = await req.text();

  // Verify the webhook signature
  if (!timestamp || !nonce || !signature) {
    console.error('Missing Binance signature headers');
    return Response.json({ returnCode: 'FAIL', returnMessage: 'Missing headers' }, { status: 400 });
  }

  if (certSn !== BINANCE_API_KEY) {
    console.error('Certificate SN mismatch');
    return Response.json({ returnCode: 'FAIL', returnMessage: 'Invalid certificate' }, { status: 401 });
  }

  const valid = await verifySignature(timestamp, nonce, rawBody, signature, BINANCE_API_SECRET);
  if (!valid) {
    console.error('Binance webhook signature verification failed');
    return Response.json({ returnCode: 'FAIL', returnMessage: 'Invalid signature' }, { status: 401 });
  }

  let event: Record<string, any>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ returnCode: 'FAIL', returnMessage: 'Invalid JSON' }, { status: 400 });
  }

  console.log('Binance webhook event:', JSON.stringify(event));

  const bizType = event.bizType;
  const bizStatus = event.bizStatus;
  const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

  // Only handle successful payment notifications
  if (bizType === 'PAY' && bizStatus === 'PAY_SUCCESS' && data) {
    const { merchantTradeNo, prepayId, transactionId, openUserId, currency, totalFee, orderAmount } = data;

    console.log(`Payment success: merchantTradeNo=${merchantTradeNo}, prepayId=${prepayId}, txId=${transactionId}`);

    // Find the order by gateway_transaction_id (prepayId) or merchantTradeNo pattern
    const { data: order, error: orderFetchError } = await supabase
      .from('orders')
      .select('id, advertiser_id, total_budget, status')
      .eq('gateway_transaction_id', prepayId)
      .maybeSingle();

    if (orderFetchError) {
      console.error('Error fetching order:', orderFetchError);
      return Response.json({ returnCode: 'FAIL', returnMessage: 'Database error' }, { status: 500 });
    }

    if (!order) {
      console.warn(`Order not found for prepayId: ${prepayId}`);
      // Return SUCCESS to Binance so it doesn't retry — we may have missed it
      return Response.json({ returnCode: 'SUCCESS', returnMessage: null });
    }

    if (order.status === 'paid') {
      // Already processed — idempotent response
      return Response.json({ returnCode: 'SUCCESS', returnMessage: null });
    }

    // Update order to paid with gateway transaction reference
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        gateway_transaction_id: transactionId ?? prepayId,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Failed to update order status:', updateError);
      return Response.json({ returnCode: 'FAIL', returnMessage: 'Failed to update order' }, { status: 500 });
    }

    // Record payment
    await supabase.from('payments').insert({
      order_id: order.id,
      payer_id: order.advertiser_id,
      amount: order.total_budget,
      service_fee: Number(order.total_budget) * 0.15,
      payment_method: 'binance',
      gateway_transaction_id: transactionId ?? prepayId,
      status: 'completed',
    });

    console.log(`Order ${order.id} marked as paid via Binance Pay (txId: ${transactionId ?? prepayId})`);
  } else {
    console.log(`Unhandled Binance event: bizType=${bizType}, bizStatus=${bizStatus}`);
  }

  // Binance requires this exact success response
  return Response.json({ returnCode: 'SUCCESS', returnMessage: null });
});
