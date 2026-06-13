"use client";

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Building2, PenTool, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function RegisterForm() {
  const { signUp } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultRole = searchParams.get('role') === 'reviewer' ? 'reviewer' : 'advertiser';

  const [role, setRole] = useState<'advertiser' | 'reviewer'>(defaultRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(email, password, role, fullName);
    if (signUpError) {
      setError(signUpError);
    } else {
      router.push(role === 'advertiser' ? '/dashboard/advertiser' : '/dashboard/reviewer');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 bg-[#F8F9FA]">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Image
            src="/Screenshot_2026-06-07_145557.png"
            alt="ReviewZerZ"
            width={200}
            height={60}
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Create Your Account</h1>
          <p className="text-[#6c757d]">Join the #1 marketplace for online reviews</p>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setRole('advertiser')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
              role === 'advertiser'
                ? 'border-[#007BFF] bg-[#e8f4fd]'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <Building2 className={`w-6 h-6 mb-2 ${role === 'advertiser' ? 'text-[#007BFF]' : 'text-gray-400'}`} />
            <div className={`font-semibold ${role === 'advertiser' ? 'text-[#007BFF]' : 'text-[#333333]'}`}>
              Advertiser
            </div>
            <div className="text-xs text-[#6c757d] mt-1">I want to buy reviews for my business</div>
          </button>
          <button
            onClick={() => setRole('reviewer')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
              role === 'reviewer'
                ? 'border-[#007BFF] bg-[#e8f4fd]'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <PenTool className={`w-6 h-6 mb-2 ${role === 'reviewer' ? 'text-[#007BFF]' : 'text-gray-400'}`} />
            <div className={`font-semibold ${role === 'reviewer' ? 'text-[#007BFF]' : 'text-[#333333]'}`}>
              Reviewer
            </div>
            <div className="text-xs text-[#6c757d] mt-1">I want to write reviews and earn money</div>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none transition-all text-[#333333]"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none transition-all text-[#333333]"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none transition-all pr-12 text-[#333333]"
                  placeholder="Minimum 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#333333]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none transition-all text-[#333333]"
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : (
                <>
                  Create {role === 'advertiser' ? 'Advertiser' : 'Reviewer'} Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {role === 'advertiser' ? (
            <div className="mt-6 p-4 bg-[#e8f4fd] rounded-lg">
              <p className="text-sm font-medium text-[#007BFF] mb-2">As an Advertiser you can:</p>
              <ul className="space-y-1">
                {['Post review orders for your business', 'Pay securely upfront', 'Approve or reject submissions', 'Track all orders in your dashboard'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-[#007BFF]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-[#e8f4fd] rounded-lg">
              <p className="text-sm font-medium text-[#007BFF] mb-2">As a Reviewer you can:</p>
              <ul className="space-y-1">
                {['Browse available review jobs', 'Claim and complete jobs', 'Submit proof of reviews', 'Earn money for approved submissions'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-[#007BFF]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-sm text-[#6c757d]">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#007BFF] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
