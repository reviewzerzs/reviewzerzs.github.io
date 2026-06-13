import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — ReviewZerZ',
  description: 'ReviewZerZ privacy policy. Learn how we protect your data on our reviews marketplace.',
  alternates: { canonical: 'https://reviewzerz.com/privacy' },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#333333] mb-2">Privacy Policy</h1>
          <p className="text-[#6c757d] mb-8">Last Updated: June 7, 2026</p>

          {/* Section 1 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">Information Collection</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ collects information to provide and improve our services. This includes:
            </p>
            <div className="text-[#6c757d] space-y-3 ml-4">
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Personal Information:</strong> When you register, we collect your name, email address, phone number, date of birth, payment information, and profile details. You may also provide additional information such as a bio, portfolio links, and social media profiles.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Usage Data:</strong> We automatically collect information about your interactions with our Service, including pages viewed, features used, search queries, time spent on pages, and click patterns. This data is collected through cookies and similar technologies.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Device Information:</strong> We collect information about the devices you use to access ReviewZerZ, including device type, operating system, browser type, IP address, and unique device identifiers.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Communication Data:</strong> We collect messages, feedback, and any communications you have with other users or ReviewZerZ customer support.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">How We Use Information</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="text-[#6c757d] space-y-3 ml-6">
              <li className="leading-relaxed">• To provide, maintain, and improve the ReviewZerZ Service</li>
              <li className="leading-relaxed">• To process payments and prevent fraud</li>
              <li className="leading-relaxed">• To create and manage user accounts</li>
              <li className="leading-relaxed">• To communicate with you about service updates, changes, and support</li>
              <li className="leading-relaxed">• To respond to your inquiries and provide customer support</li>
              <li className="leading-relaxed">• To personalize your experience and recommend relevant projects or writers</li>
              <li className="leading-relaxed">• To analyze user behavior and improve platform functionality</li>
              <li className="leading-relaxed">• To detect and prevent fraud, abuse, and security threats</li>
              <li className="leading-relaxed">• To comply with legal obligations and enforce our Terms and Conditions</li>
              <li className="leading-relaxed">• To send marketing communications, newsletters, and promotional offers (with your consent)</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">Information Sharing</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ does not sell your personal information. However, we may share your information in the following circumstances:
            </p>
            <div className="text-[#6c757d] space-y-3 ml-4">
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Service Providers:</strong> We share information with third-party service providers who assist us in operating the platform, processing payments, sending communications, and analyzing data. These providers are contractually obligated to use your information only as necessary to provide services to us.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Business Partners:</strong> With your consent, we may share information with business partners for co-marketing, analytics, or other collaborative purposes.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Legal Requirements:</strong> We may disclose information when required by law, court order, or governmental authority, or to protect the rights, privacy, safety, or property of ReviewZerZ, our users, or the public.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Business Transitions:</strong> In the event of a merger, acquisition, bankruptcy, or other business transition, your information may be transferred as part of that transaction. We will notify you of any such change.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">Data Security</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ implements industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="text-[#6c757d] space-y-3 ml-6">
              <li className="leading-relaxed">• Encryption of data in transit using SSL/TLS protocols</li>
              <li className="leading-relaxed">• Secure password hashing and storage</li>
              <li className="leading-relaxed">• Regular security audits and penetration testing</li>
              <li className="leading-relaxed">• Access controls limiting employee access to personal data</li>
              <li className="leading-relaxed">• Firewalls and intrusion detection systems</li>
            </ul>
            <p className="text-[#6c757d] leading-relaxed mt-4">
              However, no security system is impenetrable. While we strive to protect your information, we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your password and account information.
            </p>
          </section>

          {/* Section 5 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">Cookies Policy</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ uses cookies and similar technologies to enhance your experience, remember your preferences, and analyze platform usage.
            </p>
            <div className="text-[#6c757d] space-y-3 ml-4">
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Essential Cookies:</strong> Required for the platform to function, including session management and security features.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Analytics Cookies:</strong> Allow us to understand how users interact with ReviewZerZ and identify areas for improvement.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Preference Cookies:</strong> Remember your settings and preferences for a personalized experience.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Marketing Cookies:</strong> Used to deliver targeted advertising and measure the effectiveness of marketing campaigns.
              </p>
            </div>
            <p className="text-[#6c757d] leading-relaxed mt-4">
              You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.
            </p>
          </section>

          {/* Section 6 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">Third-Party Services</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ integrates with third-party services to enhance our platform. These include:
            </p>
            <ul className="text-[#6c757d] space-y-3 ml-6">
              <li className="leading-relaxed">• <strong className="text-[#333333]">Payment Processors:</strong> PayPal, Stripe, and other payment providers process transactions securely</li>
              <li className="leading-relaxed">• <strong className="text-[#333333]">Analytics Services:</strong> Google Analytics and similar tools track user behavior</li>
              <li className="leading-relaxed">• <strong className="text-[#333333]">Communication Services:</strong> Email providers send notifications and communications</li>
              <li className="leading-relaxed">• <strong className="text-[#333333]">Social Media Platforms:</strong> Integration with OAuth for authentication</li>
            </ul>
            <p className="text-[#6c757d] leading-relaxed mt-4">
              These third-party services have their own privacy policies, and ReviewZerZ is not responsible for their data practices. We encourage you to review their privacy policies before sharing information.
            </p>
          </section>

          {/* Section 7 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">User Rights</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <div className="text-[#6c757d] space-y-3 ml-4">
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Access:</strong> You have the right to access the personal information we hold about you and request a copy of that data.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Correction:</strong> You can request that we correct inaccurate or incomplete information.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Deletion:</strong> You may request deletion of your personal information, subject to certain legal obligations we may have.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Data Portability:</strong> You have the right to receive your data in a structured, commonly-used format and transmit it to another service.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Opt-Out:</strong> You can opt out of marketing communications and non-essential data processing at any time.
              </p>
            </div>
            <p className="text-[#6c757d] leading-relaxed mt-4">
              To exercise any of these rights, please contact us at privacy@reviewzerz.com with details of your request.
            </p>
          </section>

          {/* Section 8 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">Children's Privacy (COPPA)</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ complies with the Children's Online Privacy Protection Act (COPPA) and other child protection regulations. We do not knowingly collect personal information from children under 13 years of age.
            </p>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              Our Service is restricted to users aged 13 and older. If you believe a child under 13 has provided personal information to ReviewZerZ, please contact us immediately at privacy@reviewzerz.com, and we will take steps to remove that information and terminate the child's account.
            </p>
            <p className="text-[#6c757d] leading-relaxed">
              For users between 13 and 18, we limit the collection and use of personal information and provide enhanced privacy protections. Parents and guardians are responsible for supervising children's use of the platform.
            </p>
          </section>

          {/* Section 9 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">International Users (GDPR and EEA)</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              If you are located in the European Economic Area (EEA) or elsewhere outside the United States, you are subject to the General Data Protection Regulation (GDPR) and other international data protection laws.
            </p>
            <div className="text-[#6c757d] space-y-3 ml-4">
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Legal Basis:</strong> We process your personal information based on: (a) your explicit consent, (b) performance of a contract with you, (c) compliance with legal obligations, (d) protection of vital interests, or (e) legitimate interests.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Data Transfers:</strong> Your information may be transferred to, stored in, and processed in countries other than your country of residence, including the United States. These countries may not have the same level of data protection. By using ReviewZerZ, you consent to such transfers.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Data Protection Officer:</strong> You may contact our Data Protection Officer at dpo@reviewzerz.com for inquiries regarding GDPR compliance.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">Changes to This Privacy Policy</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date.
            </p>
            <p className="text-[#6c757d] leading-relaxed">
              Your continued use of ReviewZerZ after changes become effective constitutes your acceptance of the updated Privacy Policy. We encourage you to review this policy regularly to stay informed about how we protect your information.
            </p>
          </section>

          {/* Section 11 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">Contact Information</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="text-[#6c757d] space-y-2">
              <p><strong className="text-[#333333]">ReviewZerZ Ltd.</strong></p>
              <p>Email: privacy@reviewzerz.com</p>
              <p>Email (Data Protection): dpo@reviewzerz.com</p>
              <p>Email (Support): support@reviewzerz.com</p>
              <p>Website: www.reviewzerz.com</p>
            </div>
            <p className="text-[#6c757d] leading-relaxed mt-4">
              We will respond to your inquiries within 30 days. For GDPR requests, we will respond within the timeframes required by applicable law.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
