'use client';

import { CheckCircle2, Star } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Starter',
      price: 99,
      perReview: 10,
      description: 'Perfect for small businesses — 10 reviews at $10 each',
      popular: false,
      features: [
        '10 Google Reviews ($10/review)',
        'Basic targeting',
        '7-day delivery',
        'Email support',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 249,
      perReview: 8.3,
      description: 'Best for growing businesses — 30 reviews at $8.30 each',
      popular: true,
      features: [
        '30 Reviews (Google + Yelp) ($8.30/review)',
        'Location targeting',
        '5-day delivery',
        'Priority support',
        'Review approval system',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 499,
      perReview: 7.13,
      description: 'For large-scale operations — 70 reviews at $7.13 each',
      popular: false,
      features: [
        '70 Reviews (All platforms) ($7.13/review)',
        'Advanced geo-targeting',
        '3-day delivery',
        'Dedicated manager',
        'Full approval workflow',
        'Custom instructions',
      ],
    },
  ];

  const comparisonItems = [
    {
      feature: 'Number of Reviews',
      starter: '10',
      professional: '30',
      enterprise: '70',
    },
    {
      feature: 'Cost Per Review',
      starter: '$10',
      professional: '$8.30',
      enterprise: '$7.13',
    },
    {
      feature: 'Platforms Covered',
      starter: 'Google Only',
      professional: 'Google + Yelp',
      enterprise: 'All Major Platforms',
    },
    {
      feature: 'Targeting Options',
      starter: 'Basic',
      professional: 'Location-based',
      enterprise: 'Advanced Geo-targeting',
    },
    {
      feature: 'Delivery Time',
      starter: '7 days',
      professional: '5 days',
      enterprise: '3 days',
    },
    {
      feature: 'Support',
      starter: 'Email',
      professional: 'Priority',
      enterprise: 'Dedicated Manager',
    },
    {
      feature: 'Review Approval',
      starter: false,
      professional: true,
      enterprise: true,
    },
  ];

  const faqs = [
    {
      question: 'What does the 15% service fee cover?',
      answer:
        'The service fee covers platform operations, review verification, compliance screening, and ongoing support. All reviews are quality-assured before delivery.',
    },
    {
      question: 'Can I upgrade or downgrade my package?',
      answer:
        'Yes, you can change your package at any time. Upgrades are prorated, and downgrades take effect on your next billing cycle.',
    },
    {
      question: 'Are there any hidden fees?',
      answer:
        'No. The price you see includes all features listed. The only additional cost is the 15% service fee applied to your order total.',
    },
    {
      question: 'Do you offer refunds?',
      answer:
        'We offer a 30-day money-back guarantee if you\'re not satisfied with our service. Custom packages may have different terms.',
    },
    {
      question: 'Can I get a custom package?',
      answer:
        'Absolutely. Contact our sales team to discuss your specific needs, and we\'ll create a tailored solution for your business.',
    },
    {
      question: 'How are reviews delivered?',
      answer:
        'Reviews are delivered gradually over your selected timeframe to maintain natural appearance and avoid platform detection.',
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#333333' }}>
            Pricing & Packages
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#6c757d' }}>
            Choose the perfect plan to grow your business with authentic Google reviews.
            All packages include quality assurance and compliance screening.
          </p>
        </div>
      </section>

      {/* Service Fee Note */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm" style={{ color: '#6c757d' }}>
              <span className="font-semibold" style={{ color: '#333333' }}>
                15% service fee
              </span>{' '}
              applies to all orders
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className="relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
                style={{
                  border: tier.popular ? '2px solid #007BFF' : '1px solid #e0e0e0',
                  backgroundColor: tier.popular ? '#f8fbff' : '#ffffff',
                }}
                onMouseEnter={() => setHoveredTier(tier.id)}
                onMouseLeave={() => setHoveredTier(null)}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white py-2 flex items-center justify-center gap-2">
                    <Star size={16} className="fill-white" />
                    <span className="text-sm font-semibold">Most Popular</span>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-8 pt-12">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#333333' }}>
                    {tier.name}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: '#6c757d' }}>
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8">
                    <span className="text-5xl font-bold" style={{ color: '#333333' }}>
                      ${tier.price}
                    </span>
                    <span style={{ color: '#6c757d' }} className="text-lg">
                      /order
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/checkout?package=${tier.id}`}
                    className={`block w-full py-3 px-4 rounded-lg font-semibold mb-8 transition-all duration-300 text-center ${
                      tier.popular
                        ? 'bg-[#007BFF] hover:bg-[#0069d9] text-white'
                        : 'border-2 border-[#007BFF] text-[#007BFF] hover:bg-[#007BFF] hover:text-white'
                    }`}
                  >
                    Get Started
                  </Link>

                  {/* Features List */}
                  <div className="space-y-4">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <CheckCircle2
                          size={20}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: '#007BFF' }}
                        />
                        <span style={{ color: '#333333' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Package */}
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#333333' }}>
              Custom Package
            </h3>
            <p className="mb-6 max-w-2xl mx-auto" style={{ color: '#6c757d' }}>
              Need something different? Our team can create a tailored solution specifically
              designed for your business requirements.
            </p>
            <Link href="/contact" className="btn-primary">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-slate-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#333333' }}>
            Detailed Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2" style={{ borderColor: '#e0e0e0' }}>
                  <th className="text-left py-4 px-6 font-semibold" style={{ color: '#333333' }}>
                    Feature
                  </th>
                  {pricingTiers.map((tier) => (
                    <th
                      key={tier.id}
                      className="text-center py-4 px-6 font-semibold"
                      style={{ color: '#333333' }}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b"
                    style={{ borderColor: '#e0e0e0' }}
                  >
                    <td className="py-4 px-6 font-medium" style={{ color: '#333333' }}>
                      {item.feature}
                    </td>
                    <td className="text-center py-4 px-6" style={{ color: '#6c757d' }}>
                      {typeof item.starter === 'boolean' ? (
                        item.starter ? (
                          <CheckCircle2 size={20} className="inline" style={{ color: '#007BFF' }} />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        item.starter
                      )}
                    </td>
                    <td className="text-center py-4 px-6" style={{ color: '#6c757d' }}>
                      {typeof item.professional === 'boolean' ? (
                        item.professional ? (
                          <CheckCircle2 size={20} className="inline" style={{ color: '#007BFF' }} />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        item.professional
                      )}
                    </td>
                    <td className="text-center py-4 px-6" style={{ color: '#6c757d' }}>
                      {typeof item.enterprise === 'boolean' ? (
                        item.enterprise ? (
                          <CheckCircle2 size={20} className="inline" style={{ color: '#007BFF' }} />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        item.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#333333' }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <summary className="flex justify-between items-center font-semibold" style={{ color: '#333333' }}>
                  {faq.question}
                  <span className="transform group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 pt-4 border-t" style={{ color: '#6c757d', borderColor: '#e0e0e0' }}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-slate-50 border-t" style={{ borderColor: '#e0e0e0' }}>
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#333333' }}>
            Ready to grow your reviews?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#6c757d' }}>
            Choose a plan above or contact our team for a custom solution tailored to your needs.
          </p>
          <Link href="/checkout" className="btn-primary">
            Get Started Today
          </Link>
        </div>
      </section>
    </main>
  );
}
