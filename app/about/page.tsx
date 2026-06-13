import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, Heart, Globe, Award, TrendingUp, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About ReviewZerZ — Buy Reviews Marketplace',
  description: 'Learn how ReviewZerZ became the #1 marketplace to buy Google, Yelp & Facebook reviews. Our mission is to connect businesses with real review writers worldwide.',
  alternates: { canonical: 'https://reviewzerz.com/about' },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-[#e8f4fd] to-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#007BFF 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="container-custom relative z-10 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#333333] leading-tight mb-6">
              About Us
            </h1>
            <p className="text-lg md:text-xl text-[#6c757d] max-w-2xl mx-auto leading-relaxed">
              Our mission is to connect professional review writers with companies that are looking to improve their online reputation.
            </p>
          </div>
        </div>
      </section>

      {/* About Text Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-[#6c757d] leading-relaxed mb-8">
              ReviewZerZ.com is a leading platform that helps connect professional review writers with companies that are looking to improve their reviews score and reputation online. At ReviewZerZ.com, we fully understand that as a reputable company, your brand's reputation is extremely important to you. We also understand that this cannot be achieved alone and that you need talented and influential individuals to help you gain popularity and become a household name.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="section-padding bg-[#F8F9FA]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-8">
              Our History
            </h2>
            <p className="text-lg text-[#6c757d] leading-relaxed">
              ReviewZerZ.com was established in 2020 and was born out of a desire to become a trusted partner and a reliable platform that safely and effectively connects talented review writers and companies of all sizes. Since our inception, we've grown to connect thousands of professional reviewers with businesses across the globe, helping them build stronger online reputations.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-8">
              Our Values
            </h2>
            <p className="text-lg text-[#6c757d] leading-relaxed mb-8">
              Right from the outset, we decided to do things a little differently and to retain the human touch in all we do. To this end, we work only with real people and genuine review writers who have established accounts and a reputation for providing unbiased, carefully thought out and objective reviews.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-[#e8f4fd] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-[#007BFF]" />
                </div>
                <h3 className="text-lg font-bold text-[#333333] mb-2">Authenticity</h3>
                <p className="text-[#6c757d] text-sm">We only work with real, verified reviewers with genuine accounts and established histories.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-[#e8f4fd] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-[#007BFF]" />
                </div>
                <h3 className="text-lg font-bold text-[#333333] mb-2">Integrity</h3>
                <p className="text-[#6c757d] text-sm">We maintain the highest standards of ethics and fairness in all our operations.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-[#e8f4fd] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-7 h-7 text-[#007BFF]" />
                </div>
                <h3 className="text-lg font-bold text-[#333333] mb-2">Growth</h3>
                <p className="text-[#6c757d] text-sm">We help businesses grow their reputation through genuine connections and quality reviews.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-[#007BFF] to-[#0056b3]">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                By The Numbers
              </h2>
              <p className="text-blue-100 text-lg">
                Our platform has grown significantly since our launch in 2020
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
                <div className="text-blue-100 text-sm md:text-base">Professional Writers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
                <div className="text-blue-100 text-sm md:text-base">Reviews Written</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">5K+</div>
                <div className="text-blue-100 text-sm md:text-base">Companies Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">30+</div>
                <div className="text-blue-100 text-sm md:text-base">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Meet Our Team
            </h2>
            <p className="text-[#6c757d] max-w-2xl mx-auto text-lg">
              A diverse group of professionals dedicated to building the most trusted review platform.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'John Smith', role: 'Founder & CEO', initials: 'JS' },
              { name: 'Sarah Johnson', role: 'Head of Operations', initials: 'SJ' },
              { name: 'Michael Chen', role: 'Lead Developer', initials: 'MC' },
              { name: 'Emma Wilson', role: 'Community Manager', initials: 'EW' },
            ].map((member, i) => (
              <div key={i} className="text-center group">
                <div className="w-32 h-32 bg-[#e8f4fd] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#007BFF] transition-colors">
                  <span className="text-3xl font-bold text-[#007BFF] group-hover:text-white transition-colors">
                    {member.initials}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#333333] mb-1">{member.name}</h3>
                <p className="text-[#6c757d] text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#F8F9FA]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Join Our Community
            </h2>
            <p className="text-[#6c757d] text-lg mb-8">
              Whether you're a company looking to improve your reputation or a reviewer looking to earn extra income, ReviewZerZ.com is the platform for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register?role=advertiser" className="btn-primary-lg flex items-center justify-center w-full sm:w-auto">
                Get Started as Company
              </Link>
              <Link href="/auth/register?role=reviewer" className="btn-outline flex items-center justify-center w-full sm:w-auto py-4 text-lg font-bold">
                Join as Reviewer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
