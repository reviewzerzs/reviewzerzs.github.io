"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Bell, User, ChevronDown } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

interface Order {
  id: string;
  advertiser_id: string;
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

type Tab = 'dashboard' | 'postcard-orders' | 'my-offers' | 'account-settings';

function platformLabel(platforms: string[]): string {
  const map: Record<string, string> = {
    google: 'Write Google Reviews',
    ios: 'Write IOS App Reviews',
    android: 'Write Android App Reviews',
    facebook: 'Write Facebook Reviews',
    yelp: 'Write Yelp Reviews',
  };
  const p = (platforms[0] || 'google').toLowerCase();
  return map[p] || `Write ${platforms[0]} Reviews`;
}

function shortId(uuid: string): string {
  const num = parseInt(uuid.replace(/-/g, '').slice(-6), 16) % 9000 + 1000;
  return String(num);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hh}:${mm}:${ss}`;
}

export default function ReviewerDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [availableJobs, setAvailableJobs] = useState<Order[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Order | null>(null);
  const [submissionForm, setSubmissionForm] = useState({ proof_url: '', proof_description: '' });
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Account settings state
  const [settingsForm, setSettingsForm] = useState({ full_name: '', email: '', bio: '', phone: '' });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const fetchAvailableJobs = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['paid', 'in_progress'])
      .order('created_at', { ascending: false });
    if (data) setAvailableJobs(data as Order[]);
  }, []);

  const fetchMySubmissions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('submissions')
      .select('*, order:orders!submissions_order_id_fkey(*)')
      .eq('reviewer_id', user.id)
      .order('submitted_at', { ascending: false });
    if (data) setMySubmissions(data as Submission[]);
  }, [user]);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'reviewer')) {
      router.push('/auth/login');
      return;
    }
    if (user && profile) {
      setSettingsForm({
        full_name: profile.full_name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
      });
      Promise.all([fetchAvailableJobs(), fetchMySubmissions()]).then(() => setLoading(false));
    }
  }, [user, profile, authLoading, router, fetchAvailableJobs, fetchMySubmissions]);

  const handleGetJob = (job: Order) => {
    setSelectedJob(job);
    setSubmissionForm({ proof_url: '', proof_description: '' });
    setSubmitError('');
    setSubmitSuccess(false);
    setSubmitDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!user || !selectedJob) return;
    setSubmitError('');
    const { error } = await supabase.from('submissions').insert({
      order_id: selectedJob.id,
      reviewer_id: user.id,
      proof_url: submissionForm.proof_url || null,
      proof_description: submissionForm.proof_description || null,
      status: 'submitted',
      reviewer_earned: selectedJob.budget_per_review * 0.85,
    });
    if (error) {
      setSubmitError(error.message);
      return;
    }
    if (selectedJob.status === 'paid') {
      await supabase.from('orders').update({ status: 'in_progress' }).eq('id', selectedJob.id);
    }
    setSubmitSuccess(true);
    fetchMySubmissions();
    fetchAvailableJobs();
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    await supabase.from('profiles').update({
      full_name: settingsForm.full_name,
      bio: settingsForm.bio,
      phone: settingsForm.phone,
    }).eq('user_id', user.id);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f5f5]">
        <div className="animate-spin w-8 h-8 border-4 border-[#007BFF] border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalEarnings = mySubmissions
    .filter(s => s.status === 'approved')
    .reduce((sum, s) => sum + s.reviewer_earned, 0);

  const claimedOrderIds = new Set(mySubmissions.map(s => s.order_id));
  const unclaimed = availableJobs.filter(j => !claimedOrderIds.has(j.id));

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'postcard-orders', label: 'Postcard Orders' },
    { key: 'my-offers', label: 'My Offers' },
    { key: 'account-settings', label: 'Account Settings' },
  ];

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Inner nav bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-12">
            {/* Left nav links */}
            <nav className="flex items-center gap-6 text-sm text-[#555]">
              <a href="/" className="hover:text-[#007BFF] transition-colors">Home</a>
              <a href="/dashboard/reviewer" className="hover:text-[#007BFF] transition-colors">My Dashboard</a>
              <button
                onClick={() => setActiveTab('my-offers')}
                className="hover:text-[#007BFF] transition-colors"
              >
                My Offers
              </button>
              <a href="/blog" className="hover:text-[#007BFF] transition-colors">Blog</a>
              <span className="text-gray-400 cursor-not-allowed">Chat</span>
            </nav>

            {/* Right user info */}
            <div className="flex items-center gap-3">
              <button className="relative text-gray-500 hover:text-[#333]">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="font-semibold text-[#333333] text-xs">{profile?.full_name || profile?.email}</div>
                  <div className="text-xs">
                    <span className="text-[#6c757d]">Reviewer </span>
                    <span className="text-green-600 font-semibold">${totalEarnings.toFixed(2)}</span>
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="container-custom py-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#222] text-center mb-6">Dashboard</h1>

        {/* Tab navigation */}
        <div className="flex items-center justify-center gap-0 mb-8 flex-wrap">
          {tabs.map((tab, i) => (
            <React.Fragment key={tab.key}>
              {i > 0 && <span className="text-gray-400 mx-2 select-none">|</span>}
              <button
                onClick={() => setActiveTab(tab.key)}
                className={`relative pb-1 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-[#FF6B6B]'
                    : 'text-[#007BFF] hover:text-[#0056b3]'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B6B] rounded-full" />
                )}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Dashboard Tab — All Orders table */}
        {activeTab === 'dashboard' && (
          <div className="bg-white border border-gray-300 rounded-sm overflow-hidden max-w-5xl mx-auto">
            {/* Table header bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <span className="font-semibold text-[#333] text-sm">All Orders</span>
              <span className="text-sm font-semibold text-[#333]">
                Jobs To Apply:{' '}
                <span className="font-bold">({unclaimed.length})</span>
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="text-left px-5 py-3 font-semibold text-[#333] whitespace-nowrap">Order Id</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#333] whitespace-nowrap">Type</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#333] whitespace-nowrap">Reviews From</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#333] whitespace-nowrap">Date Created</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#333] whitespace-nowrap">Payout</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#FF6B6B] whitespace-nowrap">Interested?</th>
                  </tr>
                </thead>
                <tbody>
                  {unclaimed.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-[#6c757d]">
                        No available jobs right now. Check back soon!
                      </td>
                    </tr>
                  ) : (
                    unclaimed.map((job, i) => (
                      <tr
                        key={job.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          i % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                        }`}
                      >
                        <td className="px-5 py-3 font-medium text-[#FF6B6B] whitespace-nowrap">
                          {shortId(job.id)}
                        </td>
                        <td className="px-5 py-3 text-[#FF6B6B] whitespace-nowrap">
                          {platformLabel(job.platforms)}
                        </td>
                        <td className="px-5 py-3 text-[#555] whitespace-nowrap">
                          {job.location || 'Anywhere'}
                        </td>
                        <td className="px-5 py-3 text-[#555] whitespace-nowrap">
                          {formatDate(job.created_at)}
                        </td>
                        <td className="px-5 py-3 text-[#333] font-medium whitespace-nowrap">
                          ${Number(job.budget_per_review).toFixed(2)}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleGetJob(job)}
                            className="bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold px-4 py-1.5 rounded transition-colors whitespace-nowrap"
                          >
                            Get Job!
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Postcard Orders Tab */}
        {activeTab === 'postcard-orders' && (
          <div className="bg-white border border-gray-300 rounded-sm overflow-hidden max-w-5xl mx-auto">
            <div className="px-5 py-3 border-b border-gray-200">
              <span className="font-semibold text-[#333] text-sm">Postcard Orders</span>
            </div>
            <div className="px-5 py-10 text-center text-[#6c757d]">
              No postcard orders available at this time.
            </div>
          </div>
        )}

        {/* My Offers Tab */}
        {activeTab === 'my-offers' && (
          <div className="bg-white border border-gray-300 rounded-sm overflow-hidden max-w-5xl mx-auto">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <span className="font-semibold text-[#333] text-sm">My Offers</span>
              <span className="text-sm text-[#6c757d]">
                {mySubmissions.length} submission{mySubmissions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="text-left px-5 py-3 font-semibold text-[#333] whitespace-nowrap">Order Id</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#333] whitespace-nowrap">Type</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#333] whitespace-nowrap">Submitted</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#333] whitespace-nowrap">Earned</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#333] whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mySubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-[#6c757d]">
                        You haven&apos;t claimed any jobs yet.{' '}
                        <button
                          onClick={() => setActiveTab('dashboard')}
                          className="text-[#007BFF] hover:underline"
                        >
                          Browse available jobs
                        </button>
                      </td>
                    </tr>
                  ) : (
                    mySubmissions.map((sub, i) => (
                      <tr
                        key={sub.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          i % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                        }`}
                      >
                        <td className="px-5 py-3 font-medium text-[#FF6B6B] whitespace-nowrap">
                          {sub.order ? shortId(sub.order.id) : shortId(sub.order_id)}
                        </td>
                        <td className="px-5 py-3 text-[#FF6B6B] whitespace-nowrap">
                          {sub.order ? platformLabel(sub.order.platforms) : '—'}
                        </td>
                        <td className="px-5 py-3 text-[#555] whitespace-nowrap">
                          {formatDate(sub.submitted_at)}
                        </td>
                        <td className="px-5 py-3 text-[#333] font-medium whitespace-nowrap">
                          ${Number(sub.reviewer_earned).toFixed(2)}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            sub.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                            sub.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Account Settings Tab */}
        {activeTab === 'account-settings' && (
          <div className="bg-white border border-gray-300 rounded-sm max-w-2xl mx-auto">
            <div className="px-5 py-3 border-b border-gray-200">
              <span className="font-semibold text-[#333] text-sm">Account Settings</span>
            </div>
            <div className="p-6 space-y-4">
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
                  value={settingsForm.email}
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
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Bio</label>
                <textarea
                  value={settingsForm.bio}
                  onChange={e => setSettingsForm(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                  placeholder="Tell companies a bit about yourself..."
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="bg-[#007BFF] hover:bg-[#0069d9] text-white text-sm font-semibold px-6 py-2.5 rounded transition-colors"
                >
                  Save Changes
                </button>
                {settingsSaved && (
                  <span className="text-green-600 text-sm font-medium">Saved!</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Get Job Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={(open) => {
        setSubmitDialogOpen(open);
        if (!open) { setSubmitSuccess(false); setSubmitError(''); }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {submitSuccess ? 'Job Claimed!' : `Claim Job — ${selectedJob ? platformLabel(selectedJob.platforms) : ''}`}
            </DialogTitle>
          </DialogHeader>

          {submitSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[#333] font-semibold">Review submitted successfully!</p>
              <p className="text-sm text-[#6c757d]">
                You&apos;ll earn <span className="text-green-600 font-semibold">
                  ${((selectedJob?.budget_per_review || 0) * 0.85).toFixed(2)}
                </span> once approved.
              </p>
              <button
                onClick={() => { setSubmitDialogOpen(false); setSubmitSuccess(false); }}
                className="mt-2 bg-[#007BFF] hover:bg-[#0069d9] text-white text-sm font-semibold px-6 py-2.5 rounded transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {selectedJob && (
                <div className="bg-[#f8f9fa] rounded p-4 text-sm space-y-1 border border-gray-200">
                  <p><span className="font-medium text-[#333]">Platform:</span>{' '}
                    <span className="text-[#6c757d]">{selectedJob.platforms.join(', ')}</span>
                  </p>
                  <p><span className="font-medium text-[#333]">Rating required:</span>{' '}
                    <span className="text-[#6c757d]">{selectedJob.review_rating} stars</span>
                  </p>
                  {selectedJob.google_link && (
                    <p><span className="font-medium text-[#333]">Link:</span>{' '}
                      <a href={selectedJob.google_link} target="_blank" rel="noopener noreferrer"
                        className="text-[#007BFF] hover:underline break-all">{selectedJob.google_link}</a>
                    </p>
                  )}
                  {selectedJob.instructions && (
                    <p><span className="font-medium text-[#333]">Instructions:</span>{' '}
                      <span className="text-[#6c757d]">{selectedJob.instructions}</span>
                    </p>
                  )}
                  <p className="pt-1 text-green-700 font-semibold">
                    Payout: ${((selectedJob.budget_per_review) * 0.85).toFixed(2)} after commission
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Review Proof URL</label>
                <input
                  type="url"
                  value={submissionForm.proof_url}
                  onChange={e => setSubmissionForm(p => ({ ...p, proof_url: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                  placeholder="Link to your published review"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Description / Proof</label>
                <textarea
                  value={submissionForm.proof_description}
                  onChange={e => setSubmissionForm(p => ({ ...p, proof_description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm text-[#333] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none"
                  placeholder="Describe your review and provide proof..."
                />
              </div>

              {submitError && (
                <p className="text-red-600 text-sm">{submitError}</p>
              )}

              <button
                onClick={handleSubmitReview}
                className="w-full bg-[#28a745] hover:bg-[#218838] text-white text-sm font-bold py-3 rounded transition-colors"
              >
                Submit Review
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
