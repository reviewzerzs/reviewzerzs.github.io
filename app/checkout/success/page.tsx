"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const packageNames: Record<string, string> = {
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const packageParam = searchParams.get('package');

  const isDashboardOrder = Boolean(orderId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-[#333333] mb-4">
            Payment Successful!
          </h1>

          {isDashboardOrder ? (
            <>
              <p className="text-lg text-gray-600 mb-6">
                Your order has been paid and is now{' '}
                <span className="font-semibold text-[#007BFF]">active</span>.
                Reviewers will start working shortly.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-semibold text-[#333333] mb-3">What happens next?</h2>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>Qualified reviewers will be matched to your order within 24 hours</li>
                  <li>You can track submissions and approve reviews from your dashboard</li>
                  <li>You only pay reviewers whose work you approve</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/advertiser"
                  className="inline-flex items-center justify-center gap-2 bg-[#007BFF] hover:bg-[#0069d9] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your purchase. Your{' '}
                <span className="font-semibold text-[#007BFF]">
                  {packageNames[packageParam ?? ''] || 'review'} package
                </span>{' '}
                has been activated.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-semibold text-[#333333] mb-3">What happens next?</h2>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>We'll match you with qualified reviewers within 24 hours</li>
                  <li>You'll receive an email confirmation with your order details</li>
                  <li>Track your order progress from your dashboard</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/advertiser"
                  className="inline-flex items-center justify-center gap-2 bg-[#007BFF] hover:bg-[#0069d9] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
