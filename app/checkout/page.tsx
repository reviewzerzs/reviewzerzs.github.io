"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { createCheckoutSession } from '@/lib/stripe-checkout';
import {
  CreditCard, Loader2, AlertCircle, LogIn, X,
  Copy, CheckCheck, ShieldCheck, Minus, Plus, ArrowLeft, Send
} from 'lucide-react';
import QRCode from 'react-qr-code';
import Link from 'next/link';

/* ─────────────────────────── Constants ─────────────────────────── */

const LTC_ADDRESS = 'LUEd3rKKTWNJzPwA3548agvsojasRdidj9';

const PLATFORMS = [
  { id: 'google',   label: 'Google',        rate: 8  },
  { id: 'facebook', label: 'Facebook',       rate: 8  },
  { id: 'yelp',     label: 'Yelp',           rate: 9  },
  { id: 'ios',      label: 'iOS App Store',  rate: 6  },
  { id: 'android',  label: 'Google Play',    rate: 6  },
] as const;

type PlatformId = (typeof PLATFORMS)[number]['id'];
type PaymentMethod = 'stripe' | 'ltc';

const SERVICE_FEE = 0.15;

/* ─────────────────────────── Helpers ───────────────────────────── */

function rateFor(id: PlatformId) {
  return PLATFORMS.find((p) => p.id === id)!.rate;
}

function calcTotal(qty: number, rate: number) {
  const subtotal = qty * rate;
  const fee = subtotal * SERVICE_FEE;
  return { subtotal, fee, total: subtotal + fee };
}

/* ─────────────────────────── Sub-components ────────────────────── */


function LTCLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className ?? 'w-6 h-6'}>
      <rect width="40" height="40" rx="8" fill="#345D9D" />
      <text x="20" y="27" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white" fontFamily="sans-serif">Ł</text>
    </svg>
  );
}

/* ─────────────────────────── Main page ─────────────────────────── */

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Order config ──
  const [platform, setPlatform] = useState<PlatformId>('google');
  const [numReviews, setNumReviews] = useState(10);
  const [businessName, setBusinessName] = useState('');
  const [businessLink, setBusinessLink] = useState('');

  // ── Payment ──
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');

  // ── UI state ──
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showLtcModal, setShowLtcModal] = useState(false);
  const [ltcOrderNote, setLtcOrderNote] = useState<string | null>(null);
  const [ltcOrderId, setLtcOrderId] = useState<string | null>(null);
  const [txid, setTxid] = useState('');
  const [txidSubmitting, setTxidSubmitting] = useState(false);
  const [txidSubmitted, setTxidSubmitted] = useState(false);

  // Pre-fill from URL params (e.g. ?platform=google&qty=20)
  useEffect(() => {
    const p = searchParams.get('platform') as PlatformId | null;
    const q = searchParams.get('qty');
    if (p && PLATFORMS.find((x) => x.id === p)) setPlatform(p);
    if (q && !isNaN(Number(q))) setNumReviews(Math.max(1, Math.min(500, Number(q))));
  }, [searchParams]);

  const rate = rateFor(platform);
  const { subtotal, fee, total } = calcTotal(numReviews, rate);

  /* ── Copy address ── */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(LTC_ADDRESS);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for environments where clipboard API is restricted
      const el = document.createElement('textarea');
      el.value = LTC_ADDRESS;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  /* ── Submit TXID ── */
  const handleSubmitTxid = useCallback(async () => {
    if (!txid.trim()) return;
    setTxidSubmitting(true);
    try {
      if (ltcOrderId) {
        const { supabase } = await import('@/lib/supabase');
        await supabase
          .from('orders')
          .update({ gateway_transaction_id: txid.trim() })
          .eq('id', ltcOrderId);
      }
    } finally {
      setTxidSubmitting(false);
      setTxidSubmitted(true);
    }
  }, [txid, ltcOrderId]);

  /* ── Create order helper ── */
  const createOrder = useCallback(async (gateway: string) => {
    const { supabase } = await import('@/lib/supabase');
    const { data: inserted, error: err } = await supabase
      .from('orders')
      .insert({
        advertiser_id: user!.id,
        business_name: businessName.trim() || `${PLATFORMS.find(p => p.id === platform)!.label} Review Order`,
        google_link: businessLink.trim() || null,
        platforms: [platform],
        num_reviews: numReviews,
        review_rating: 5,
        budget_per_review: rate,
        total_budget: subtotal,
        status: 'pending_payment',
        payment_gateway: gateway,
      })
      .select('id')
      .single();
    if (err) throw new Error(err.message);
    return inserted.id as string;
  }, [user, businessName, businessLink, platform, numReviews, rate, subtotal]);

  /* ── Main pay handler ── */
  const handlePay = async () => {
    if (!user) {
      const params = new URLSearchParams({
        redirect: `/checkout?platform=${platform}&qty=${numReviews}`,
      });
      router.push(`/auth/login?${params.toString()}`);
      return;
    }
    if (numReviews < 1) { setError('Please enter at least 1 review.'); return; }

    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === 'stripe') {
        const orderId = await createOrder('stripe');
        const { url } = await createCheckoutSession({
          amount: total,
          product_name: `ReviewZerZ – ${numReviews} ${PLATFORMS.find(p => p.id === platform)!.label} reviews`,
          order_id: orderId,
          success_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
          cancel_url: window.location.href,
          mode: 'payment',
        });
        if (url) window.location.href = url;
        else setError('Failed to start Stripe checkout. Please try again.');

      } else {
        // LTC direct — show modal immediately, create order in background
        setShowLtcModal(true);
        setLtcOrderNote(null);
        setLtcOrderId(null);
        setTxid('');
        setTxidSubmitted(false);
        setLoading(false);
        // Create order silently — capture ID for TXID submission later
        createOrder('ltc')
          .then((id) => setLtcOrderId(id))
          .catch((err) => {
            setLtcOrderNote(err instanceof Error ? err.message : 'Order record could not be saved. Include your order details when submitting your TXID.');
          });
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Guards ── */
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#007BFF]" />
      </div>
    );
  }

  /* ─────────────────── JSX ─────────────────── */
  return (
    <div className="min-h-screen bg-[#f7f8fa] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center pb-2">
          <h1 className="text-3xl font-bold text-[#1a1a2e]">Place Your Review Order</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Choose any quantity — no subscription needed. Pay instantly.
          </p>
        </div>

        {/* Not logged in banner */}
        {!user && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <LogIn className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-amber-800 text-sm">
              <span className="font-semibold">You'll be asked to log in</span> before your order is confirmed.
            </p>
          </div>
        )}

        {/* ── Step 1: Order Config ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-[#007BFF] px-6 py-4">
            <h2 className="text-white font-semibold text-base">Step 1 — Configure Your Order</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Platform */}
            <div>
              <label className="block text-sm font-semibold text-[#333] mb-2">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      platform === p.id
                        ? 'border-[#007BFF] bg-[#007BFF] text-white'
                        : 'border-gray-200 text-gray-600 hover:border-[#007BFF] bg-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of reviews */}
            <div>
              <label className="block text-sm font-semibold text-[#333] mb-2">
                Number of Reviews
                <span className="ml-2 text-xs text-gray-400 font-normal">(1 – 500)</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNumReviews((n) => Math.max(1, n - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#007BFF] hover:text-[#007BFF] transition-colors shrink-0"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={numReviews}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(500, parseInt(e.target.value) || 1));
                    setNumReviews(v);
                  }}
                  className="w-24 text-center text-lg font-bold text-[#333] border-2 border-gray-200 rounded-lg py-2 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                />
                <button
                  onClick={() => setNumReviews((n) => Math.min(500, n + 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#007BFF] hover:text-[#007BFF] transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {/* Quick-pick presets */}
                <div className="flex gap-1.5 ml-2 flex-wrap">
                  {[5, 10, 20, 50].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNumReviews(n)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
                        numReviews === n
                          ? 'bg-[#007BFF] text-white border-[#007BFF]'
                          : 'border-gray-200 text-gray-500 hover:border-[#007BFF]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional business details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#333] mb-1.5">
                  Business Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Joe's Coffee Shop"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#333] mb-1.5">
                  Profile / App Link <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={businessLink}
                  onChange={(e) => setBusinessLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-[#f0f7ff] border border-blue-100 rounded-xl p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{numReviews} reviews × ${rate.toFixed(2)}/review</span>
                  <span className="font-medium text-[#333]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service fee (15%)</span>
                  <span className="font-medium text-[#333]">${fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2 font-bold text-base">
                  <span className="text-[#333]">Total</span>
                  <span className="text-[#007BFF]">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Step 2: Payment Method ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-[#1a1a2e] px-6 py-4">
            <h2 className="text-white font-semibold text-base">Step 2 — Choose Payment Method</h2>
          </div>

          <div className="p-6 space-y-4">

            {/* ── Stripe ── */}
            <button
              onClick={() => setPaymentMethod('stripe')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                paymentMethod === 'stripe'
                  ? 'border-[#007BFF] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                paymentMethod === 'stripe' ? 'bg-[#007BFF]' : 'bg-gray-100'
              }`}>
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'stripe' ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#333] text-sm">Credit / Debit Card</div>
                <div className="text-xs text-gray-400 mt-0.5">Visa, Mastercard, Amex via Stripe</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                paymentMethod === 'stripe' ? 'bg-[#007BFF] border-[#007BFF]' : 'border-gray-300'
              }`} />
            </button>

            {/* ── LTC Direct Wallet ── */}
            <button
              onClick={() => setPaymentMethod('ltc')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                paymentMethod === 'ltc'
                  ? 'border-[#345D9D] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="shrink-0">
                <LTCLogo className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#333] text-sm">Litecoin (LTC) — Direct Transfer</div>
                <div className="text-xs text-gray-400 mt-0.5">Send LTC directly to our wallet address</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                paymentMethod === 'ltc' ? 'bg-[#345D9D] border-[#345D9D]' : 'border-gray-300'
              }`} />
            </button>

            {/* ── LTC address preview (shown when LTC selected) ── */}
            {paymentMethod === 'ltc' && (
              <div className="ml-0 border-2 border-[#345D9D] rounded-xl p-4 bg-[#f0f4ff] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 text-base">⚠</span>
                  <p className="text-xs font-semibold text-amber-800">
                    Send only Litecoin (LTC) on the Litecoin Network
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#345D9D] mb-1.5">Wallet Address</p>
                  <div className="flex items-center gap-2 bg-white border border-[#345D9D] rounded-lg p-2.5">
                    <code className="flex-1 text-xs text-[#1a1a2e] font-mono break-all select-all leading-relaxed">
                      {LTC_ADDRESS}
                    </code>
                    <button
                      onClick={(e) => { e.preventDefault(); handleCopy(); }}
                      className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isCopied ? 'bg-green-500 text-white' : 'bg-[#345D9D] hover:bg-[#2a4d8e] text-white'
                      }`}
                    >
                      {isCopied
                        ? <><CheckCheck className="w-3 h-3" /> Copied!</>
                        : <><Copy className="w-3 h-3" /> Copy</>
                      }
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Click <strong>"Pay ${total.toFixed(2)} in LTC"</strong> below for a full QR code and payment instructions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-700 text-sm">Error</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <button
          onClick={handlePay}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-sm ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : paymentMethod === 'ltc'
              ? 'bg-[#345D9D] hover:bg-[#2a4d8e] text-white'
              : 'bg-[#007BFF] hover:bg-[#0069d9] text-white'
          }`}
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          ) : (
            <>
              {paymentMethod === 'stripe' && <CreditCard className="w-5 h-5" />}
              {paymentMethod === 'ltc' && <LTCLogo className="w-5 h-5" />}
              {paymentMethod === 'stripe' && `Pay $${total.toFixed(2)} with Card`}
              {paymentMethod === 'ltc' && `Pay $${total.toFixed(2)} in LTC`}
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure checkout — your data is protected
        </p>
      </div>

      {/* ──────────────────── LTC Wallet Modal ──────────────────── */}
      {showLtcModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden my-auto">

            {/* ← Back bar */}
            <div className="bg-[#1a1a2e] px-4 py-2.5 flex items-center justify-between">
              <button
                onClick={() => { setShowLtcModal(false); setTxid(''); setTxidSubmitted(false); }}
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Payment Method
              </button>
              <button
                onClick={() => setShowLtcModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal header */}
            <div className="bg-[#345D9D] px-5 py-3 flex items-center gap-3">
              <LTCLogo className="w-8 h-8 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm leading-tight">Pay with Litecoin (LTC)</h3>
                <p className="text-blue-200 text-xs">Direct wallet transfer</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-emerald-300 font-bold text-lg leading-none">${total.toFixed(2)}</p>
                <p className="text-blue-200 text-[10px]">USD equivalent</p>
              </div>
            </div>

            <div className="p-4 space-y-4">

              {/* Background order-save warning (non-blocking) */}
              {ltcOrderNote && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-orange-700">
                    <span className="font-semibold">Note:</span> {ltcOrderNote}
                  </p>
                </div>
              )}

              {/* Network warning */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
                <span className="text-amber-500 text-xl leading-none shrink-0">⚠</span>
                <div>
                  <p className="font-bold text-amber-800 text-sm">Network Warning</p>
                  <p className="text-amber-700 text-xs mt-1">
                    Send <strong>only Litecoin (LTC)</strong> using the{' '}
                    <strong>Litecoin Network</strong>. Sending any other coin or using the
                    wrong network will result in permanent loss of funds.
                  </p>
                </div>
              </div>

              {/* QR code */}
              <div className="flex flex-col items-center gap-2">
                <div className="border-2 border-[#345D9D] rounded-xl p-2 bg-white shadow-sm">
                  <QRCode
                    value={`litecoin:${LTC_ADDRESS}`}
                    size={140}
                    bgColor="#ffffff"
                    fgColor="#345D9D"
                    level="M"
                  />
                </div>
                <p className="text-xs text-gray-400">Scan with your LTC wallet app</p>
              </div>

              {/* Wallet address + copy */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">LTC Wallet Address</p>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <code className="flex-1 text-xs text-[#333] font-mono break-all select-all leading-relaxed">
                    {LTC_ADDRESS}
                  </code>
                  <button
                    onClick={handleCopy}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-[#345D9D] hover:bg-[#2a4d8e] text-white'
                    }`}
                  >
                    {isCopied ? (
                      <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy</>
                    )}
                  </button>
                </div>
              </div>

              {/* TXID submission */}
              {txidSubmitted ? (
                <div className="bg-green-50 border border-green-300 rounded-xl p-5 text-center space-y-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="font-bold text-green-800 text-sm">TXID Received!</p>
                  <p className="text-xs text-green-700">
                    We'll verify your payment on-chain and activate your order{' '}
                    <strong>within 5 minutes</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#333] mb-1.5">
                      Paste Your Transaction ID (TXID) here
                    </label>
                    <textarea
                      value={txid}
                      onChange={(e) => setTxid(e.target.value)}
                      rows={2}
                      placeholder="e.g. a3f1e2b0c4d5... (copy from your wallet app after sending)"
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-xs font-mono text-[#333] placeholder-gray-400 resize-none focus:ring-2 focus:ring-[#345D9D] focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmitTxid}
                    disabled={!txid.trim() || txidSubmitting}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      !txid.trim() || txidSubmitting
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#345D9D] hover:bg-[#2a4d8e] text-white'
                    }`}
                  >
                    {txidSubmitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                      : <><Send className="w-4 h-4" /> Submit TXID for Confirmation</>
                    }
                  </button>
                  <p className="text-center text-xs text-gray-400">
                    Your order activates within <strong className="text-[#333]">5 minutes</strong> of TXID submission.
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowLtcModal(false)}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
