"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Users, Shield, Award, TrendingUp, CheckCircle2, Quote } from 'lucide-react';

function VideoPlayer() {
  const [playing, setPlaying] = useState(false);
  return playing ? (
    <div className="mx-auto rounded-xl overflow-hidden shadow-lg bg-[#111]" style={{ maxWidth: '480px' }}>
      <video
        className="w-full h-auto block"
        controls
        autoPlay
        preload="metadata"
        style={{ maxHeight: '270px' }}
      >
        <source src="/reviewzerz-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  ) : (
    <button
      onClick={() => setPlaying(true)}
      aria-label="Play video"
      className="mx-auto flex items-center justify-center rounded-lg bg-[#d0d5dd] hover:bg-[#b8bec9] transition-colors shadow-sm"
      style={{ width: '120px', height: '80px' }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="8,4 24,14 8,24" fill="white" />
      </svg>
    </button>
  );
}

export default function HomeClient() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { supabase } = await import('@/lib/supabase');
      const { data } = await supabase.from('testimonials').select('*').eq('featured', true);
      if (data) setTestimonials(data);
    }
    load();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-10 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#222222] leading-tight mb-2">
              Yelp, Facebook &amp; Google Reviews
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
              <span className="text-[#007BFF]">Buying</span>{' '}
              <span className="text-[#222222]">&amp;</span>{' '}
              <span className="text-[#F5A623]">Selling</span>{' '}
              <span className="text-[#222222]">Marketplace</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-0 max-w-4xl mx-auto border border-gray-200 rounded-sm overflow-hidden">
            {/* Buy Reviews */}
            <div className="bg-white p-6 sm:p-10 flex flex-col items-center text-center border-b sm:border-b-0 sm:border-r border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-[#222222] mb-4 sm:mb-5">Buy Reviews</h2>
              <p className="text-[#6c757d] text-sm leading-relaxed mb-6 sm:mb-8 max-w-xs">
                Meet over 10,000 review writers &amp; Google local guides from all over the world that are eager to help boost your business&apos;s ratings by writing Google reviews, Facebook, Yelp, Android app, IOS app and more.
              </p>
              <Link
                href="/checkout"
                className="bg-[#007BFF] hover:bg-[#0069d9] text-white font-bold uppercase tracking-wide px-8 sm:px-10 py-3 rounded transition-colors text-sm"
              >
                Join Now
              </Link>
            </div>

            {/* Write Reviews */}
            <div className="bg-white p-6 sm:p-10 flex flex-col items-center text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-[#222222] mb-4 sm:mb-5">Write Reviews</h2>
              <p className="text-[#007BFF] text-sm leading-relaxed mb-6 sm:mb-8 max-w-xs">
                Connect with both local and international companies interested in hiring reviews writers. Earn extra cash with the help of social media apps that you already use and activities that you already do.
              </p>
              <Link
                href="/auth/register?role=reviewer"
                className="bg-[#F5A623] hover:bg-[#e09510] text-white font-bold uppercase tracking-wide px-8 sm:px-10 py-3 rounded transition-colors text-sm"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="section-padding bg-[#F8F9FA]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Image
                src="/Screenshot_2026-06-07_145557.png"
                alt="ReviewZerZ — Buy Reviews Marketplace"
                width={320}
                height={110}
                className="h-20 w-auto"
              />
            </div>
            <p className="text-[#6c757d] max-w-2xl mx-auto text-lg">
              A simple, secure marketplace connecting companies with professional review writers.
            </p>
          </div>

          <div className="flex justify-center">
            <VideoPlayer />
          </div>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Why Choose ReviewZerZ?
            </h2>
            <p className="text-[#6c757d] max-w-2xl mx-auto text-lg">
              The most trusted marketplace for buying and selling online reviews.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Secure Escrow Payments',
                desc: 'Funds are held securely until you approve the work. Reviewers get paid only after you verify the review.',
              },
              {
                icon: Users,
                title: '10,000+ Real Reviewers',
                desc: 'Connect with genuine Google Local Guides and established review writers from around the world.',
              },
              {
                icon: Award,
                title: 'Quality Guaranteed',
                desc: 'All reviews come from real accounts with established histories. Approve or reject any submission.',
              },
              {
                icon: TrendingUp,
                title: 'Boost Your Rankings',
                desc: 'Improve your Google, Yelp, and Facebook ratings with authentic reviews from real people.',
              },
              {
                icon: CheckCircle2,
                title: 'Full Transparency',
                desc: 'Track every order, submission, and payment in real-time through your dashboard.',
              },
              {
                icon: Star,
                title: 'Multiple Platforms',
                desc: 'Get reviews on Google, Facebook, Yelp, Android apps, iOS apps, and more.',
              },
            ].map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-[#e8f4fd] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#007BFF] transition-colors">
                  <feature.icon className="w-8 h-8 text-[#007BFF] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-[#333333] mb-2">{feature.title}</h3>
                <p className="text-[#6c757d] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-[#F8F9FA]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              What Our Users Say
            </h2>
            <p className="text-[#6c757d] max-w-2xl mx-auto text-lg">
              Trusted by thousands of businesses and reviewers worldwide.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {(testimonials.length > 0 ? testimonials.slice(0, 3) : [
              { name: 'David Chen', role: 'Marketing Director', company: 'TechFlow Solutions', content: 'ReviewZerZ helped us boost our Google rating from 3.2 to 4.6 in just two months. The quality of reviews from real local guides made all the difference.', rating: 5 },
              { name: 'Sarah Mitchell', role: 'Business Owner', company: "Mitchell's Bakery", content: 'As a small business owner, online reputation is everything. ReviewZerZ connected us with genuine reviewers who helped our bakery get the recognition it deserves.', rating: 5 },
              { name: 'James Rodriguez', role: 'SEO Consultant', company: 'RankBoost Agency', content: 'I recommend ReviewZerZ to all my clients. The platform is reliable, the reviewers are real people, and the results speak for themselves.', rating: 5 },
            ]).map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Quote className="w-10 h-10 text-[#007BFF] opacity-20 mb-4" />
                <p className="text-[#6c757d] leading-relaxed mb-6">{t.content}</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-[#333333]">{t.name}</div>
                  <div className="text-sm text-[#6c757d]">{t.role}, {t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-[#007BFF] to-[#0056b3]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Boost Your Online Reputation?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of businesses and reviewers on the most trusted reviews marketplace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/checkout" className="bg-white text-[#007BFF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors w-full sm:w-auto text-center">
                Order Reviews
              </Link>
              <Link href="/auth/register?role=reviewer" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
                Join as Reviewer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
