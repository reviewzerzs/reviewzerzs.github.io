'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface OpenSections {
  [key: string]: boolean;
}

const FAQPage = () => {
  const [openSections, setOpenSections] = useState<OpenSections>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const faqData = [
    {
      category: 'General',
      questions: [
        {
          id: 'general-1',
          question: 'What is ReviewZerZ?',
          answer: 'ReviewZerZ is a platform that connects businesses with authentic reviewers. Advertisers can post review opportunities, and qualified reviewers can earn money by providing genuine feedback on products and services.',
        },
        {
          id: 'general-2',
          question: 'Is it legal?',
          answer: 'Yes, ReviewZerZ operates within legal frameworks. Our platform ensures transparency and complies with FTC guidelines and local regulations regarding paid reviews. All reviews must be honest and authentic.',
        },
        {
          id: 'general-3',
          question: 'How does it work?',
          answer: 'Advertisers post review opportunities with details about their product or service. Reviewers browse available opportunities and apply. Once selected, reviewers complete the task and submit their review. Payment is released after verification.',
        },
        {
          id: 'general-4',
          question: 'What platforms are supported?',
          answer: 'ReviewZerZ supports reviews for products and services across multiple platforms including e-commerce, apps, websites, and physical products. Check our platform guidelines for specific requirements.',
        },
      ],
    },
    {
      category: 'For Advertisers',
      questions: [
        {
          id: 'advertiser-1',
          question: 'How do I place an order?',
          answer: 'Sign up for an advertiser account, complete your profile, and click "Create Campaign." Fill in details about your product or service, set review requirements, budget, and timeline. Submit for review by our team.',
        },
        {
          id: 'advertiser-2',
          question: 'When do I pay?',
          answer: 'Payment is due when your campaign is approved and goes live. Funds are held in escrow and released to reviewers upon completion of their review, with a small service fee deducted.',
        },
        {
          id: 'advertiser-3',
          question: 'Can I reject reviews?',
          answer: 'Yes, you can review submissions from reviewers. However, rejections must be based on objective criteria (e.g., incomplete information). Arbitrary rejections may result in account penalties.',
        },
        {
          id: 'advertiser-4',
          question: 'What\'s the refund policy?',
          answer: 'If your campaign doesn\'t receive enough qualified applications within the specified timeframe, you can request a refund or extend the campaign. Service fees are non-refundable.',
        },
        {
          id: 'advertiser-5',
          question: 'How long does it take?',
          answer: 'Campaign approval typically takes 24-48 hours. Reviewer applications usually start within the first week. The review completion timeline depends on your campaign requirements, typically 1-4 weeks.',
        },
      ],
    },
    {
      category: 'For Reviewers',
      questions: [
        {
          id: 'reviewer-1',
          question: 'How do I become a reviewer?',
          answer: 'Create a reviewer account and complete your profile. Provide details about your interests and expertise. Pass our verification process to ensure authenticity. You\'ll then have access to available review opportunities.',
        },
        {
          id: 'reviewer-2',
          question: 'How much can I earn?',
          answer: 'Earnings vary based on review complexity and product value. Simple reviews may pay $10-25, while comprehensive reviews of high-value products can pay $50-200+. You\'ll see payment amounts before accepting.',
        },
        {
          id: 'reviewer-3',
          question: 'How do I get paid?',
          answer: 'After your review is approved, payment is transferred to your chosen method (PayPal, bank transfer, or digital wallet) within 3-5 business days. You can view payment history in your dashboard.',
        },
        {
          id: 'reviewer-4',
          question: 'What proof do I need?',
          answer: 'You\'ll need to verify your identity through a government-issued ID and provide proof of purchase or product receipt when required. This ensures authentic reviews and prevents fraud.',
        },
        {
          id: 'reviewer-5',
          question: 'Can I decline jobs?',
          answer: 'Yes, you can decline any opportunity without penalty. However, completing accepted jobs is important for maintaining a good reputation and receiving future opportunities.',
        },
      ],
    },
    {
      category: 'Payments & Security',
      questions: [
        {
          id: 'payment-1',
          question: 'What payment methods are available?',
          answer: 'We support PayPal, direct bank transfers, and digital wallet services. Additional payment methods may be added based on your region. You can manage your preferred payment method in account settings.',
        },
        {
          id: 'payment-2',
          question: 'Is my payment secure?',
          answer: 'Yes, all payments are processed through secure, encrypted channels. ReviewZerZ uses industry-standard security protocols and complies with PCI-DSS standards to protect your financial information.',
        },
        {
          id: 'payment-3',
          question: 'What is the service fee?',
          answer: 'ReviewZerZ charges a 10% service fee on advertiser campaigns and retains a small platform fee from reviewer payments. The exact breakdown is displayed before you commit to any transaction.',
        },
        {
          id: 'payment-4',
          question: 'How does escrow work?',
          answer: 'Advertiser funds are held in escrow until the reviewer completes their task. Once the review is approved, funds are released to the reviewer with the platform fee deducted. This protects both parties.',
        },
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-blue-50 to-white">
        <div className="container-custom">
          <div className="text-center py-12">
            <h1
              className="text-5xl font-bold mb-4"
              style={{ color: '#333333' }}
            >
              Frequently Asked Questions
            </h1>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: '#6c757d' }}
            >
              Find answers to common questions about ReviewZerZ. Can't find what
              you're looking for? Contact our support team.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">
            {faqData.map((section) => (
              <div key={section.category} className="mb-12">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: '#007BFF' }}
                >
                  {section.category}
                </h2>

                <div className="space-y-4">
                  {section.questions.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => toggleSection(item.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        style={{
                          backgroundColor: openSections[item.id]
                            ? '#f0f8ff'
                            : 'white',
                        }}
                      >
                        <h3
                          className="text-lg font-semibold text-left"
                          style={{ color: '#333333' }}
                        >
                          {item.question}
                        </h3>
                        <ChevronDown
                          size={24}
                          style={{
                            color: '#007BFF',
                            transform: openSections[item.id]
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </button>

                      {openSections[item.id] && (
                        <div
                          className="px-6 py-4 border-t border-gray-200"
                          style={{ backgroundColor: '#f9f9f9' }}
                        >
                          <p style={{ color: '#6c757d' }} className="leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: '#333333' }}
            >
              Still have questions?
            </h3>
            <p
              className="mb-6 text-lg"
              style={{ color: '#6c757d' }}
            >
              Our support team is here to help. Contact us anytime.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#007BFF' }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
