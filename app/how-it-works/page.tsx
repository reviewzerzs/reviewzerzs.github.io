"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Users,
  MessageSquare,
  Shield,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Building2,
  FileText,
  CreditCard,
  PenTool,
  ThumbsUp,
  DollarSign,
  UserCheck,
  Briefcase,
  ClipboardList,
  Upload,
  Zap,
  Lock,
  BarChart3,
  Globe,
  Clock,
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'reviewers'>('companies');

  const companiesSteps = [
    {
      number: 1,
      title: 'Register Your Business',
      description: 'Create an account and verify your business details. Set up your company profile with branding and information.',
      icon: Building2,
    },
    {
      number: 2,
      title: 'Post Review Orders',
      description: 'Create review orders by specifying the number of reviews needed, platforms (Google, Yelp, Facebook), and any special requirements.',
      icon: FileText,
    },
    {
      number: 3,
      title: 'Pay Upfront',
      description: 'Secure payment is held in escrow. Reviewers see your active orders and can start claiming available positions.',
      icon: CreditCard,
    },
    {
      number: 4,
      title: 'Reviewers Write Reviews',
      description: 'Qualified reviewers claim your orders and write authentic reviews on the platforms you specified.',
      icon: PenTool,
    },
    {
      number: 5,
      title: 'Approve or Reject',
      description: 'Review submissions with proof. Approve quality reviews or request revisions. Only approved reviews release payment.',
      icon: ThumbsUp,
    },
    {
      number: 6,
      title: 'Boost Your Rankings',
      description: 'Watch your ratings and reviews grow on Google, Yelp, and Facebook as reviews go live on customer accounts.',
      icon: TrendingUp,
    },
  ];

  const reviewersSteps = [
    {
      number: 1,
      title: 'Register as Reviewer',
      description: 'Sign up and create your reviewer profile. Verify your Google account and link your review history.',
      icon: UserCheck,
    },
    {
      number: 2,
      title: 'Browse Available Jobs',
      description: 'Explore review jobs in your area. Filter by platform, payment amount, and business type. See exactly what\'s needed.',
      icon: Briefcase,
    },
    {
      number: 3,
      title: 'Claim a Job',
      description: 'Apply for jobs that match your profile and interests. Once approved by the advertiser, the job is yours to complete.',
      icon: ClipboardList,
    },
    {
      number: 4,
      title: 'Write Review & Submit Proof',
      description: 'Write an authentic review on the specified platform (Google, Yelp, etc.) and submit proof with screenshots.',
      icon: Upload,
    },
    {
      number: 5,
      title: 'Get Approved & Paid',
      description: 'The advertiser verifies your submission. Once approved, payment is released to your account within 24 hours.',
      icon: DollarSign,
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'All transactions are held in secure escrow protecting both companies and reviewers.',
      color: 'bg-blue-100',
    },
    {
      icon: Users,
      title: '10,000+ Verified Users',
      description: 'Work with genuine reviewers and legitimate businesses vetted for quality and trust.',
      color: 'bg-green-100',
    },
    {
      icon: CheckCircle2,
      title: 'Quality Assurance',
      description: 'Every review is verified with proof. Companies can approve, reject, or request revisions.',
      color: 'bg-purple-100',
    },
    {
      icon: Zap,
      title: 'Fast & Simple',
      description: 'Post orders or claim jobs in minutes. Streamlined workflow from start to finish.',
      color: 'bg-yellow-100',
    },
    {
      icon: BarChart3,
      title: 'Real Results',
      description: 'Boost your Google, Yelp, and Facebook ratings with authentic reviews from real people.',
      color: 'bg-orange-100',
    },
    {
      icon: Lock,
      title: 'Protected & Transparent',
      description: 'Full transparency with real-time tracking. Know exactly what\'s happening at every stage.',
      color: 'bg-indigo-100',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-[#e8f4fd] to-white overflow-hidden pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#007BFF 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#333333] leading-tight mb-6">
              How ReviewZerZ Works
            </h1>
            <p className="text-lg md:text-xl text-[#6c757d] mb-4 leading-relaxed">
              A secure, transparent marketplace connecting businesses with professional review writers.
            </p>
            <p className="text-[#6c757d] max-w-2xl mx-auto">
              Whether you're looking to boost your online reputation or earn money writing reviews, ReviewZerZ makes it simple and secure.
            </p>
          </div>
        </div>
      </section>

      {/* Tabbed Process Sections */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Tabs */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex bg-[#F8F9FA] rounded-lg p-1">
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-8 py-3 rounded-md font-semibold transition-all ${
                  activeTab === 'companies'
                    ? 'bg-[#007BFF] text-white shadow-md'
                    : 'text-[#333333] hover:text-[#007BFF]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  For Companies
                </div>
              </button>
              <button
                onClick={() => setActiveTab('reviewers')}
                className={`px-8 py-3 rounded-md font-semibold transition-all ${
                  activeTab === 'reviewers'
                    ? 'bg-[#007BFF] text-white shadow-md'
                    : 'text-[#333333] hover:text-[#007BFF]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  For Reviewers
                </div>
              </button>
            </div>
          </div>

          {/* Companies Tab Content */}
          {activeTab === 'companies' && (
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {companiesSteps.map((step) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={step.number} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#007BFF]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex gap-6">
                          <div className="flex-shrink-0">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f4fd] text-[#007BFF] font-bold text-xl">
                              {step.number}
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-3 mb-2">
                              <IconComponent className="w-6 h-6 text-[#007BFF]" />
                              <h3 className="text-xl font-bold text-[#333333]">{step.title}</h3>
                            </div>
                            <p className="text-[#6c757d] leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA for Companies */}
              <div className="text-center mt-16">
                <Link href="/auth/register?role=advertiser" className="btn-primary inline-flex items-center gap-2">
                  Get Started as a Company <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Reviewers Tab Content */}
          {activeTab === 'reviewers' && (
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {reviewersSteps.map((step) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={step.number} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#007BFF]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex gap-6">
                          <div className="flex-shrink-0">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f4fd] text-[#007BFF] font-bold text-xl">
                              {step.number}
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-3 mb-2">
                              <IconComponent className="w-6 h-6 text-[#007BFF]" />
                              <h3 className="text-xl font-bold text-[#333333]">{step.title}</h3>
                            </div>
                            <p className="text-[#6c757d] leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA for Reviewers */}
              <div className="text-center mt-16">
                <Link href="/auth/register?role=reviewer" className="btn-primary inline-flex items-center gap-2">
                  Start Earning as a Reviewer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits/Comparison Section */}
      <section className="section-padding bg-[#F8F9FA]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Why Choose ReviewZerZ?
            </h2>
            <p className="text-[#6c757d] max-w-2xl mx-auto text-lg">
              A trusted platform built for security, transparency, and success for both companies and reviewers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className={`w-14 h-14 ${benefit.color} rounded-xl flex items-center justify-center mb-6`}>
                    <IconComponent className="w-7 h-7 text-[#007BFF]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#333333] mb-3">{benefit.title}</h3>
                  <p className="text-[#6c757d] text-sm leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Perfect for Both Sides
            </h2>
            <p className="text-[#6c757d] max-w-2xl mx-auto text-lg">
              ReviewZerZ is designed with the unique needs of both companies and reviewers in mind.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* For Companies Card */}
            <div className="bg-gradient-to-br from-[#e8f4fd] to-white rounded-2xl p-8 border border-[#007BFF]/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#007BFF] rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#333333]">For Companies</h3>
              </div>

              <ul className="space-y-4">
                {[
                  'Boost your Google, Yelp & Facebook ratings',
                  'Choose from thousands of verified reviewers',
                  'Set exact requirements for each review',
                  'Approve or reject submissions before payment',
                  'Track all orders in real-time dashboard',
                  'Secure escrow payments',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007BFF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#333333]">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/register?role=advertiser" className="btn-primary w-full text-center mt-8">
                Join as Company
              </Link>
            </div>

            {/* For Reviewers Card */}
            <div className="bg-gradient-to-br from-[#e8f4fd] to-white rounded-2xl p-8 border border-[#007BFF]/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#007BFF] rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#333333]">For Reviewers</h3>
              </div>

              <ul className="space-y-4">
                {[
                  'Earn money in your spare time',
                  'Choose jobs that interest you',
                  'Work on your own schedule',
                  'Guaranteed payments after approval',
                  'No experience necessary',
                  'Quick payouts within 24 hours',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007BFF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#333333]">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/register?role=reviewer" className="btn-primary w-full text-center mt-8">
                Join as Reviewer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-r from-[#007BFF] to-[#0056b3]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of satisfied companies and reviewers on ReviewZerZ today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register?role=advertiser" className="bg-white text-[#007BFF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors w-full sm:w-auto text-center">
                I'm a Company
              </Link>
              <Link href="/auth/register?role=reviewer" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
                I'm a Reviewer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ-like Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Common Questions
            </h2>
            <p className="text-[#6c757d] max-w-2xl mx-auto text-lg">
              Everything you need to know about ReviewZerZ.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid gap-6">
            {[
              {
                q: 'How long does it take to get paid?',
                a: 'Reviewers get paid within 24 hours of advertiser approval. Companies set their own approval timeline for submissions.',
              },
              {
                q: 'Are the reviews real and authentic?',
                a: 'Yes. All reviews come from verified Google accounts with established review histories. We verify every reviewer and their submissions.',
              },
              {
                q: 'What if I\'m not satisfied with a submission?',
                a: 'Companies can approve, reject, or request revisions. No payment is released until you approve the review.',
              },
              {
                q: 'Is my information secure?',
                a: 'Absolutely. We use bank-level encryption and secure escrow to protect both parties. Your data is never shared without permission.',
              },
              {
                q: 'Can I post orders for multiple platforms?',
                a: 'Yes! You can create orders for Google, Yelp, Facebook, and other platforms. Each order specifies which platform reviewers should use.',
              },
              {
                q: 'Do I need experience to be a reviewer?',
                a: 'No experience necessary. You just need a Google account (or other review platform account) with some review history.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-[#F8F9FA] rounded-xl p-6 border border-gray-200 hover:border-[#007BFF] transition-colors">
                <h3 className="font-bold text-[#333333] mb-2 text-lg">{faq.q}</h3>
                <p className="text-[#6c757d]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
