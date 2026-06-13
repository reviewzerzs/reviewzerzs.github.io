"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { createCheckoutSession } from '@/lib/stripe-checkout';
import {
  Bell, User, ChevronDown, Loader2, CreditCard, X, Copy, CheckCheck, ArrowLeft, Send
} from 'lucide-react';
import QRCode from 'react-qr-code';

/* ── Platform SVG icons ── */
function IconGoogle() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4"/>
      <path d="M32 14C23.16 14 16 21.16 16 30C16 41.6 30 50 32 50C34 50 48 41.6 48 30C48 21.16 40.84 14 32 14Z" fill="white"/>
      <circle cx="32" cy="30" r="7" fill="#4285F4"/>
      <circle cx="32" cy="30" r="4" fill="white"/>
      <polygon points="32,43 28,37 36,37" fill="#EA4335"/>
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#1877F2"/>
      <rect x="10" y="28" width="44" height="28" rx="4" fill="white"/>
      {/* Thumbs up */}
      <path d="M27 44H22V34H27M27 34L30 28C31.5 28 33 29 33 31V34H38L37 40H33V44H27" fill="#1877F2" stroke="#1877F2" strokeWidth="0.5"/>
      {/* Stars row */}
      <text x="12" y="24" fontSize="8" fill="#FFD700" fontFamily="sans-serif">★★★★★</text>
    </svg>
  );
}

function IconAppStore() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="appstore-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C9FF6"/>
          <stop offset="100%" stopColor="#1461D8"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#appstore-grad)"/>
      <path d="M32 12L36.5 22H27.5L32 12Z" fill="white"/>
      <path d="M20 36L25 26H27L22 36H20Z" fill="white"/>
      <path d="M44 36L39 26H37L42 36H44Z" fill="white"/>
      <path d="M17 36H47V38H17Z" fill="white"/>
      <path d="M24 38L21 44H24L26 40Z" fill="white"/>
      <path d="M40 38L43 44H40L38 40Z" fill="white"/>
    </svg>
  );
}

function IconGooglePlay() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F8F9FA"/>
      <text x="8" y="14" fontSize="7" fill="#555" fontFamily="sans-serif">Google Play</text>
      {/* Colorful play triangle */}
      <path d="M18 20L46 32L18 44Z" fill="url(#gplay-grad)"/>
      <defs>
        <linearGradient id="gplay-grad" x1="18" y1="20" x2="46" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00BCD4"/>
          <stop offset="33%" stopColor="#4CAF50"/>
          <stop offset="66%" stopColor="#FFEB3B"/>
          <stop offset="100%" stopColor="#F44336"/>
        </linearGradient>
      </defs>
      {/* Notch cut */}
      <polygon points="18,20 24,26 24,38 18,44" fill="#F8F9FA"/>
      {/* Upper/lower triangles */}
      <path d="M18 20L24 26L46 32Z" fill="#4CAF50"/>
      <path d="M18 44L24 38L46 32Z" fill="#F44336"/>
      <path d="M24 26L46 32L24 38Z" fill="#FFD600"/>
      <path d="M18 20L24 26L24 38L18 44Z" fill="#00BCD4"/>
    </svg>
  );
}

/* ── Types ── */
interface Order {
  id: string;
  business_name: string;
  google_link: string | null;
  platforms: string[];
  num_reviews: number;
  review_rating: number;
  location: string | null;
  instructions: string | null;
  deadline: string | null;
  budget_per_review: number;
  total_budget: number;
  status: string;
  created_at: string;
}

interface Submission {
  id: string;
  order_id: string;
  reviewer_id: string;
  proof_url: string | null;
  proof_description: string | null;
  status: string;
  reviewer_earned: number;
  feedback: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  order?: Order;
}

type View = 'home' | 'place-order' | 'my-orders' | 'submissions' | 'account';

const platforms = [
  { key: 'google', label: 'Buy Google Reviews', Icon: IconGoogle },
  { key: 'facebook', label: 'Buy Facebook Reviews', Icon: IconFacebook },
  { key: 'ios', label: 'Buy IOS App Reviews', Icon: IconAppStore },
  { key: 'android', label: 'Buy Android App Reviews', Icon: IconGooglePlay },
];

const statusColors: Record<string, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending_payment: 'Pending Payment',
  paid: 'Paid',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB');
}

export default function AdvertiserDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<View>('home');
  const [orders, setOrders] = useState<Order[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [preselectedPlatform, setPreselectedPlatform] = useState('');

  // New order form
  const [newOrder, setNewOrder] = useState({
    business_name: '',
    google_link: '',
    platforms: ['google'] as string[],
    num_reviews: 5,
    review_rating: 5,
    location: '',
    instructions: '',
    deadline: '',
    budget_per_review: 10,
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  // Payment method modal
  const [payModalOrder, setPayModalOrder] = useState<Order | null>(null);
  const [payModalMethod, setPayModalMethod] = useState<'stripe' | 'ltc'>('stripe');
  const [payModalError, setPayModalError] = useState('');
  const [showDashLtcModal, setShowDashLtcModal] = useState(false);
  const [dashLtcOrder, setDashLtcOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [dashTxid, setDashTxid] = useState('');
  const [dashTxidSubmitting, setDashTxidSubmitting] = useState(false);
  const [dashTxidSubmitted, setDashTxidSubmitted] = useState(false);

  const LTC_ADDRESS = 'LUEd3rKKTWNJzPwA3548agvsojasRdidj9';

  const handleCopyLtc = async () => {
    try {
      await navigator.clipboard.writeText(LTC_ADDRESS);
    } catch {
      const el = document.createElement('textarea');
      el.value = LTC_ADDRESS;
      el.style.position = 'fixed'; el.style.opacity = '0';
      document.body.appendChild(el); el.select(); document.execCommand('copy');
      document.body.removeChild(el);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitDashTxid = async () => {
    if (!dashTxid.trim()) return;
    setDashTxidSubmitting(true);
    try {
      if (dashLtcOrder) {
        await supabase
          .from('orders')
          .update({ gateway_transaction_id: dashTxid.trim() })
          .eq('id', dashLtcOrder.id);
      }
    } finally {
      setDashTxidSubmitting(false);
      setDashTxidSubmitted(true);
    }
  };

  // Account settings
  const [settingsForm, setSettingsForm] = useState({ full_name: '', phone: '', bio: '' });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('advertiser_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setOrders(data as Order[]);
  }, [user]);

  const fetchSubmissions = useCallback(async (orderList: Order[]) => {
    if (!user || orderList.length === 0) return;
    const { data } = await supabase
      .from('submissions')
      .select('*, order:orders!submissions_order_id_fkey(*)')
      .in('order_id', orderList.map(o => o.id))
      .order('submitted_at', { ascending: false });
    if (data) setSubmissions(data as Submission[]);
  }, [user]);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'advertiser')) {
      router.push('/auth/login');
      return;
    }
    if (user && profile) {
      setSettingsForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
      fetchOrders().then(() => setLoading(false));
    }
  }, [user, profile, authLoading, router, fetchOrders]);

  useEffect(() => {
    if (orders.length > 0) fetchSubmissions(orders);
  }, [orders, fetchSubmissions]);

  const handlePlatformCard = (platformKey: string) => {
    setPreselectedPlatform(platformKey);
    setNewOrder(prev => ({ ...prev, platforms: [platformKey] }));
    setView('place-order');
  };

  const handleCreateOrder = async () => {
    if (!user || !newOrder.business_name) return;
    setOrderError('');
    setPaymentLoading('creating');
    const total = newOrder.num_reviews * newOrder.budget_per_review;

    const { data: inserted, error } = await supabase.from('orders').insert({
      advertiser_id: user.id,
      business_name: newOrder.business_name,
      google_link: newOrder.google_link || null,
      platforms: newOrder.platforms,
      num_reviews: newOrder.num_reviews,
      review_rating: newOrder.review_rating,
      location: newOrder.location || null,
      instructions: newOrder.instructions || null,
      deadline: newOrder.deadline || null,
      budget_per_review: newOrder.budget_per_review,
      total_budget: total,
      status: 'pending_payment',
    }).select('id, business_name, num_reviews, platforms, total_budget, status, created_at, google_link, review_rating, location, instructions, deadline, budget_per_review').single();

    if (error) { setOrderError(error.message); setPaymentLoading(null); return; }

    setPaymentLoading(null);
    fetchOrders();
    setNewOrder({
      business_name: '', google_link: '', platforms: ['google'],
      num_reviews: 5, review_rating: 5, location: '', instructions: '',
      deadline: '', budget_per_review: 10,
    });
    // Open payment method selector
    setPayModalMethod('stripe');
    setPayModalError('');
    setPayModalOrder(inserted as Order);
  };

  const handleModalPay = async () => {
    if (!payModalOrder) return;
    setPayModalError('');
    const totalWithFee = Number(payModalOrder.total_budget) * 1.15;

    if (payModalMethod === 'ltc') {
      await supabase.from('orders').update({ payment_gateway: 'ltc' }).eq('id', payModalOrder.id);
      setDashLtcOrder(payModalOrder);
      setDashTxid('');
      setDashTxidSubmitted(false);
      setPayModalOrder(null);
      setShowDashLtcModal(true);
      return;
    }

    setPaymentLoading(payModalOrder.id);
    try {
      if (payModalMethod === 'stripe') {
        const { url } = await createCheckoutSession({
          amount: totalWithFee,
          product_name: `ReviewZerZ – ${payModalOrder.num_reviews} reviews for ${payModalOrder.business_name}`,
          order_id: payModalOrder.id,
          success_url: `${window.location.origin}/checkout/success?order_id=${payModalOrder.id}`,
          cancel_url: `${window.location.origin}/dashboard/advertiser`,
          mode: 'payment',
        });
        if (url) window.location.href = url;
      }
    } catch (err) {
      setPayModalError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleApprove = async (subId: string, orderId: string) => {
    await supabase.from('submissions')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', subId);
    const order = orders.find(o => o.id === orderId);
    const approvedCount = submissions.filter(s => s.order_id === orderId && s.status === 'approved').length + 1;
    if (order && approvedCount >= order.num_reviews) {
      await supabase.from('orders').update({ status: 'completed' }).eq('id', orderId);
    }
    fetchOrders();
    fetchSubmissions(orders);
  };

  const handleReject = async (subId: string) => {
    await supabase.from('submissions')
      .update({ status: 'rejected', feedback: 'Does not meet requirements', reviewed_at: new Date().toISOString() })
      .eq('id', subId);
    fetchSubmissions(orders);
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    await supabase.from('profiles').update({
      full_name: settingsForm.full_name,
      phone: settingsForm.phone,
      bio: settingsForm.bio,
    }).eq('user_id', user.id);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-[#007BFF] border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalSpent = orders
    .filter(o => o.status !== 'pending_payment')
    .reduce((sum, o) => sum + Number(o.total_budget), 0);
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');
  const userName = profile?.full_name?.toUpperCase() || profile?.email?.split('@')[0].toUpperCase() || 'USER';

  return (
    <div className="bg-white min-h-screen">

      {/* ── Payment method modal ── */}
      {payModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full relative">
            <button
              onClick={() => setPayModalOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-[#333333] mb-1">Choose Payment Method</h3>
            <p className="text-sm text-gray-500 mb-5">
              Order: <span className="font-medium text-[#333]">{payModalOrder.business_name}</span> —{' '}
              <span className="font-semibold text-[#007BFF]">${(Number(payModalOrder.total_budget) * 1.15).toFixed(2)}</span>
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setPayModalMethod('stripe')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  payModalMethod === 'stripe' ? 'border-[#007BFF] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-5 h-5 ${payModalMethod === 'stripe' ? 'text-[#007BFF]' : 'text-gray-400'}`} />
                <span className={`text-[10px] font-semibold leading-tight text-center ${payModalMethod === 'stripe' ? 'text-[#007BFF]' : 'text-gray-600'}`}>
                  Card / Stripe
                </span>
              </button>


              <button
                onClick={() => setPayModalMethod('ltc')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  payModalMethod === 'ltc' ? 'border-[#345D9D] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <svg viewBox="0 0 40 40" fill="none" className="w-5 h-5">
                  <rect width="40" height="40" rx="8" fill="#345D9D"/>
                  <text x="20" y="27" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white" fontFamily="sans-serif">Ł</text>
                </svg>
                <span className={`text-[10px] font-semibold ${payModalMethod === 'ltc' ? 'text-[#345D9D]' : 'text-gray-600'}`}>
                  LTC Wallet
                </span>
              </button>
            </div>


            {payModalError && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2 mb-3">{payModalError}</p>
            )}

            <button
              onClick={handleModalPay}
              disabled={paymentLoading === payModalOrder.id}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                paymentLoading === payModalOrder.id
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : payModalMethod === 'ltc'
                  ? 'bg-[#345D9D] hover:bg-[#2a4d8e] text-white'
                  : 'bg-[#007BFF] hover:bg-[#0069d9] text-white'
              }`}
            >
              {paymentLoading === payModalOrder.id ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : payModalMethod === 'ltc' ? (
                'Pay with LTC Wallet'
              ) : (
                'Pay with Card'
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── LTC Wallet Modal ── */}
      {showDashLtcModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden my-auto">
            {/* ← Back bar */}
            <div className="bg-[#1a1a2e] px-4 py-2.5 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowDashLtcModal(false);
                  setDashTxid('');
                  setDashTxidSubmitted(false);
                  setPayModalOrder(dashLtcOrder);
                  setPayModalMethod('stripe');
                  setPayModalError('');
                }}
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Payment Method
              </button>
              <button
                onClick={() => { setShowDashLtcModal(false); fetchOrders(); }}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* LTC header */}
            <div className="bg-[#345D9D] px-5 py-3 flex items-center gap-3">
              <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8 shrink-0">
                <rect width="40" height="40" rx="8" fill="#4a7dc7"/>
                <text x="20" y="27" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white" fontFamily="sans-serif">Ł</text>
              </svg>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm">Pay with Litecoin (LTC)</h3>
                <p className="text-blue-200 text-xs">Direct wallet transfer</p>
              </div>
              {dashLtcOrder && (
                <div className="shrink-0 text-right">
                  <p className="text-emerald-300 font-bold text-lg leading-none">
                    ${(Number(dashLtcOrder.total_budget) * 1.15).toFixed(2)}
                  </p>
                  <p className="text-blue-200 text-[10px]">USD equivalent</p>
                </div>
              )}
            </div>
            <div className="p-4 space-y-4">
              {/* Network warning */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
                <span className="text-amber-500 text-xl leading-none shrink-0">⚠</span>
                <div>
                  <p className="font-bold text-amber-800 text-sm">Network Warning</p>
                  <p className="text-amber-700 text-xs mt-1">
                    Send <strong>only Litecoin (LTC)</strong> using the <strong>Litecoin Network</strong>.
                    Wrong coin or network = permanent loss of funds.
                  </p>
                </div>
              </div>
              {/* QR code */}
              <div className="flex flex-col items-center gap-2">
                <div className="border-2 border-[#345D9D] rounded-xl p-3 bg-white shadow-sm">
                  <QRCode value={`litecoin:${LTC_ADDRESS}`} size={140} bgColor="#ffffff" fgColor="#345D9D" level="M" />
                </div>
                <p className="text-xs text-gray-400">Scan with your LTC wallet app</p>
              </div>
              {/* Address + copy */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">LTC Wallet Address</p>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <code className="flex-1 text-xs text-[#333] font-mono break-all select-all">{LTC_ADDRESS}</code>
                  <button
                    onClick={handleCopyLtc}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isCopied ? 'bg-green-500 text-white' : 'bg-[#345D9D] hover:bg-[#2a4d8e] text-white'
                    }`}
                  >
                    {isCopied ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
              </div>
              {/* TXID submission */}
              {dashTxidSubmitted ? (
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
                      Paste Your Transaction ID (TXID)
                    </label>
                    <textarea
                      value={dashTxid}
                      onChange={(e) => setDashTxid(e.target.value)}
                      rows={2}
                      placeholder="e.g. a3f1e2b0c4d5... (copy from your wallet app after sending)"
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-xs font-mono text-[#333] placeholder-gray-400 resize-none focus:ring-2 focus:ring-[#345D9D] focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmitDashTxid}
                    disabled={!dashTxid.trim() || dashTxidSubmitting}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      !dashTxid.trim() || dashTxidSubmitting
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#345D9D] hover:bg-[#2a4d8e] text-white'
                    }`}
                  >
                    {dashTxidSubmitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                      : <><Send className="w-4 h-4" /> Submit TXID for Confirmation</>
                    }
                  </button>
                  <p className="text-center text-xs text-gray-400">
                    Order activates within <strong className="text-[#333]">5 minutes</strong> of TXID submission.
                  </p>
                </div>
              )}

              <button
                onClick={() => { setShowDashLtcModal(false); fetchOrders(); }}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inner dashboard nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-12 gap-4">
            <nav className="flex items-center gap-4 text-sm text-[#555] overflow-x-auto">
              <a href="/" className="hover:text-[#007BFF] transition-colors whitespace-nowrap">Home</a>
              <button onClick={() => setView('home')} className="hover:text-[#007BFF] transition-colors whitespace-nowrap">My Dashboard</button>
              <button onClick={() => { setView('place-order'); setOrderSuccess(false); }} className="hover:text-[#007BFF] transition-colors whitespace-nowrap">Place An Order</button>
              <span className="text-gray-400 cursor-not-allowed whitespace-nowrap hidden sm:inline">Get My Postcard</span>
              <a href="/calculator" className="hover:text-[#007BFF] transition-colors whitespace-nowrap hidden sm:inline">Calculator</a>
              <a href="/blog" className="hover:text-[#007BFF] transition-colors whitespace-nowrap hidden sm:inline">Blog</a>
              <span className="text-gray-400 cursor-not-allowed whitespace-nowrap hidden md:inline">Chat</span>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <button className="relative text-gray-500 hover:text-[#333]">
                <Bell className="w-5 h-5" />
                {pendingSubmissions.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {pendingSubmissions.length}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="font-semibold text-[#333333] text-xs">{userName}</div>
                  <div className="text-xs">
                    <span className="text-[#6c757d]">Advertiser </span>
                    <span className="text-green-600 font-semibold">${totalSpent.toFixed(2)}</span>
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-custom py-10">

        {/* HOME — Platform selection */}
        {view === 'home' && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#222] text-center mb-10">
              Welcome, {userName}
            </h1>

            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#222] mb-2">
                Buy Online Reviews, Select Platform
              </h2>
              <p className="text-[#007BFF] text-sm">Control Your Brand Appearance</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {platforms.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => handlePlatformCard(key)}
                  className="border border-gray-200 rounded bg-white hover:shadow-md hover:border-[#007BFF] transition-all p-6 flex flex-col items-center gap-4 group"
                >
                  <Icon />
                  <span className="text-sm font-medium text-[#333] group-hover:text-[#007BFF] transition-colors text-center leading-snug">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick stats if user has orders */}
            {orders.length > 0 && (
              <div className="max-w-3xl mx-auto mt-12">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Orders', value: orders.length },
                    { label: 'Active', value: orders.filter(o => ['paid','in_progress'].includes(o.status)).length },
                    { label: 'Pending Reviews', value: pendingSubmissions.length },
                    { label: 'Total Spent', value: `$${totalSpent.toFixed(0)}` },
                  ].map((s, i) => (
                    <div key={i} className="border border-gray-200 rounded p-4 text-center">
                      <div className="text-xl font-bold text-[#333]">{s.value}</div>
                      <div className="text-xs text-[#6c757d] mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent orders mini-table */}
                <div className="border border-gray-200 rounded overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <span className="font-semibold text-[#333] text-sm">Recent Orders</span>
                    <button
                      onClick={() => setView('my-orders')}
                      className="text-xs text-[#007BFF] hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left px-4 py-2 text-xs font-semibold text-[#333]">Business</th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-[#333]">Platform</th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-[#333]">Date</th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-[#333]">Status</th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-[#333]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="px-4 py-2.5 text-[#333] font-medium">{order.business_name}</td>
                            <td className="px-4 py-2.5 text-[#6c757d] capitalize">{order.platforms.join(', ')}</td>
                            <td className="px-4 py-2.5 text-[#6c757d] text-xs">{formatDate(order.created_at)}</td>
                            <td className="px-4 py-2.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                                {statusLabels[order.status]}
                              </span>
                            </td>
                            <td className="px-4 py-2.5">
                              {order.status === 'pending_payment' && (
                                <button
                                  onClick={() => { setPayModalOrder(order); setPayModalMethod('stripe'); setPayModalError(''); }}
                                  className="text-xs bg-[#007BFF] hover:bg-[#0069d9] text-white px-3 py-1 rounded transition-colors font-semibold"
                                >
                                  Pay Now
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PLACE AN ORDER */}
        {view === 'place-order' && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#222] mb-1">Place An Order</h1>
              <p className="text-sm text-[#6c757d]">Fill in the details to get started</p>
            </div>

            {orderSuccess ? (
              <div className="border border-gray-200 rounded p-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#222] mb-2">Order Created!</h2>
                <p className="text-sm text-[#6c757d] mb-6">Your order has been placed. Complete payment to activate it.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setView('my-orders'); setOrderSuccess(false); }}
                    className="bg-[#007BFF] hover:bg-[#0069d9] text-white text-sm font-semibold px-6 py-2.5 rounded transition-colors"
                  >
                    View My Orders
                  </button>
                  <button
                    onClick={() => { setOrderSuccess(false); }}
                    className="border border-gray-200 text-[#333] text-sm font-semibold px-6 py-2.5 rounded hover:bg-gray-50 transition-colors"
                  >
                    Place Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded p-6 sm:p-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1.5">Business Name *</label>
                  <input
                    type="text"
                    value={newOrder.business_name}
                    onChange={e => setNewOrder(p => ({ ...p, business_name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1.5">Business / App Link</label>
                  <input
                    type="url"
                    value={newOrder.google_link}
                    onChange={e => setNewOrder(p => ({ ...p, google_link: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">Platform *</label>
                  <div className="flex flex-wrap gap-2">
                    {['google', 'facebook', 'ios', 'android', 'yelp'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewOrder(prev => ({
                          ...prev,
                          platforms: prev.platforms.includes(p)
                            ? prev.platforms.filter(x => x !== p)
                            : [...prev.platforms, p],
                        }))}
                        className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                          newOrder.platforms.includes(p)
                            ? 'bg-[#007BFF] text-white border-[#007BFF]'
                            : 'bg-white text-[#555] border-gray-200 hover:border-[#007BFF]'
                        }`}
                      >
                        {p === 'ios' ? 'iOS App Store' : p === 'android' ? 'Google Play' : p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-1.5">Number of Reviews *</label>
                    <input
                      type="number" min="1" max="100"
                      value={newOrder.num_reviews}
                      onChange={e => setNewOrder(p => ({ ...p, num_reviews: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-1.5">Star Rating</label>
                    <select
                      value={newOrder.review_rating}
                      onChange={e => setNewOrder(p => ({ ...p, review_rating: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                    >
                      {[5, 4, 3].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1.5">Location (optional)</label>
                  <input
                    type="text"
                    value={newOrder.location}
                    onChange={e => setNewOrder(p => ({ ...p, location: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                    placeholder="e.g. New York, USA — leave blank for Anywhere"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1.5">Instructions</label>
                  <textarea
                    value={newOrder.instructions}
                    onChange={e => setNewOrder(p => ({ ...p, instructions: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                    placeholder="Any specific instructions for reviewers..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-1.5">Deadline</label>
                    <input
                      type="date"
                      value={newOrder.deadline}
                      onChange={e => setNewOrder(p => ({ ...p, deadline: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-1.5">Budget / Review ($)</label>
                    <input
                      type="number" min="3" step="1"
                      value={newOrder.budget_per_review}
                      onChange={e => setNewOrder(p => ({ ...p, budget_per_review: parseFloat(e.target.value) || 3 }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Order summary */}
                <div className="bg-[#f0f7ff] rounded p-4 text-sm space-y-2 border border-blue-100">
                  <div className="flex justify-between">
                    <span className="text-[#6c757d]">{newOrder.num_reviews} reviews × ${newOrder.budget_per_review}</span>
                    <span className="font-medium text-[#333]">${(newOrder.num_reviews * newOrder.budget_per_review).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6c757d]">Service fee (15%)</span>
                    <span className="font-medium text-[#333]">${(newOrder.num_reviews * newOrder.budget_per_review * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-100 pt-2">
                    <span className="font-semibold text-[#333]">Total</span>
                    <span className="font-bold text-[#007BFF]">${(newOrder.num_reviews * newOrder.budget_per_review * 1.15).toFixed(2)}</span>
                  </div>
                </div>

                {orderError && <p className="text-red-600 text-sm">{orderError}</p>}

                <button
                  onClick={handleCreateOrder}
                  disabled={!newOrder.business_name || newOrder.platforms.length === 0 || paymentLoading === 'creating'}
                  className="w-full bg-[#007BFF] hover:bg-[#0069d9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
                >
                  {paymentLoading === 'creating' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating order...</>
                  ) : 'Place Order & Choose Payment'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* MY ORDERS */}
        {view === 'my-orders' && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#222]">My Orders</h1>
              <button
                onClick={() => { setView('place-order'); setOrderSuccess(false); }}
                className="bg-[#007BFF] hover:bg-[#0069d9] text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
              >
                + Place New Order
              </button>
            </div>

            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-[#333] whitespace-nowrap">Business</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#333] whitespace-nowrap">Platform</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#333] whitespace-nowrap">Reviews</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#333] whitespace-nowrap">Total</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#333] whitespace-nowrap">Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#333] whitespace-nowrap">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#333] whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-[#6c757d]">
                          No orders yet.{' '}
                          <button onClick={() => setView('place-order')} className="text-[#007BFF] hover:underline">
                            Place your first order
                          </button>
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, i) => (
                        <tr key={order.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                          <td className="px-4 py-3 font-medium text-[#333]">{order.business_name}</td>
                          <td className="px-4 py-3 text-[#6c757d] capitalize">{order.platforms.join(', ')}</td>
                          <td className="px-4 py-3 text-[#555]">{order.num_reviews}</td>
                          <td className="px-4 py-3 font-semibold text-[#333]">${Number(order.total_budget).toFixed(2)}</td>
                          <td className="px-4 py-3 text-[#6c757d] text-xs whitespace-nowrap">{formatDate(order.created_at)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${statusColors[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {order.status === 'pending_payment' && (
                              <button
                                onClick={() => { setPayModalOrder(order); setPayModalMethod('stripe'); setPayModalError(''); }}
                                className="text-xs bg-[#28a745] hover:bg-[#218838] text-white px-3 py-1.5 rounded font-semibold transition-colors whitespace-nowrap"
                              >
                                Pay Now
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBMISSIONS */}
        {view === 'submissions' && (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-[#222] mb-6">
              Submissions
              {pendingSubmissions.length > 0 && (
                <span className="ml-3 text-sm font-normal bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">
                  {pendingSubmissions.length} pending
                </span>
              )}
            </h1>

            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-[#333]">Order</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#333]">Proof</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#333]">Submitted</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#333]">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#333]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-[#6c757d]">
                          No submissions yet. Once reviewers submit their work, it will appear here.
                        </td>
                      </tr>
                    ) : (
                      submissions.map((sub, i) => (
                        <tr key={sub.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                          <td className="px-4 py-3 text-[#333] font-medium">
                            {sub.order?.business_name || '—'}
                          </td>
                          <td className="px-4 py-3 text-[#6c757d] max-w-[200px] truncate">
                            {sub.proof_url ? (
                              <a href={sub.proof_url} target="_blank" rel="noopener noreferrer" className="text-[#007BFF] hover:underline">
                                View Proof
                              </a>
                            ) : sub.proof_description || '—'}
                          </td>
                          <td className="px-4 py-3 text-[#6c757d] text-xs whitespace-nowrap">
                            {formatDate(sub.submitted_at)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              sub.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                              sub.status === 'approved' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {sub.status === 'submitted' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprove(sub.id, sub.order_id)}
                                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded font-semibold transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(sub.id)}
                                  className="text-xs border border-red-300 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded font-semibold transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNT SETTINGS */}
        {view === 'account' && (
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-[#222] mb-8 text-center">Account Settings</h1>
            <div className="border border-gray-200 rounded p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={settingsForm.full_name}
                  onChange={e => setSettingsForm(p => ({ ...p, full_name: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Email</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#6c757d] bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={settingsForm.phone}
                  onChange={e => setSettingsForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="bg-[#007BFF] hover:bg-[#0069d9] text-white text-sm font-semibold px-6 py-2.5 rounded transition-colors"
                >
                  Save Changes
                </button>
                {settingsSaved && <span className="text-green-600 text-sm font-medium">Saved!</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
