import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — ReviewZerZ',
  description: 'Read the ReviewZerZ terms of service for our buy reviews marketplace.',
  alternates: { canonical: 'https://reviewzerz.com/terms' },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#333333] mb-2">Terms & Conditions</h1>
          <p className="text-[#6c757d] mb-8">Last Updated: June 7, 2026</p>

          {/* Section 1 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">1. Terms and Conditions Overview</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              Welcome to ReviewZerZ, an online marketplace platform for peer-to-peer review services. These Terms and Conditions ("Terms") govern your use of our website, mobile application, and all related services (collectively, "Service"). By accessing and using ReviewZerZ, you agree to be bound by these Terms. If you do not agree to any part of these Terms, you may not use our Service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">2. User Agreement</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              By creating an account and using ReviewZerZ, you enter into a binding agreement with ReviewZerZ Ltd. ("Company," "we," "us," or "our"). You represent that you have the legal authority to enter into this agreement and that all information you provide is truthful and accurate. You agree to comply with all applicable laws, regulations, and these Terms while using our Service.
            </p>
          </section>

          {/* Section 3 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">3. Explanations of Key Terms</h2>
            <div className="text-[#6c757d] space-y-4">
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Buyer:</strong> A user who posts a project or task on ReviewZerZ seeking written reviews, feedback, or other services from Writers.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Writer:</strong> A user who submits written work, reviews, feedback, or other services to fulfill a Buyer's project or task.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Commission:</strong> The amount paid by a Buyer for a Writer's work. This is the full project price set by the Buyer.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Service Charges:</strong> The fees charged by ReviewZerZ for operating and maintaining the platform. Currently set at 15% of the Commission.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">4. Eligibility and Requirements</h2>
            <div className="text-[#6c757d] space-y-4">
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Age Requirement:</strong> You must be at least 13 years old to create an account and use ReviewZerZ. Users under 18 may have additional restrictions. Parents or guardians are responsible for any account created by a minor under their care.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Information Requirement:</strong> You must provide accurate, complete, and current information during registration and maintain this information. Providing false information is strictly prohibited and may result in immediate account termination.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Restrictions:</strong> You may not create multiple accounts or use ReviewZerZ if you are prohibited by applicable law or if you have been previously banned from the platform. Users from certain jurisdictions may be restricted from accessing certain features.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">5. Status of Users</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              All users, whether Buyers or Writers, are independent contractors. ReviewZerZ does not employ any user, and no employment, partnership, or agency relationship exists between users and ReviewZerZ. Writers retain full creative control and ownership of their work unless otherwise specified in a project agreement. Buyers and Writers are responsible for their own taxes, insurance, and legal compliance.
            </p>
          </section>

          {/* Section 6 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">6. Payment and Refund Policy</h2>
            <div className="text-[#6c757d] space-y-4">
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Payment Process:</strong> Buyers must pay the full Commission upfront before a Writer begins work. We accept payments via PayPal, Stripe, and other payment methods displayed on our platform. Payments are non-refundable except as provided in this section.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Service Fee:</strong> ReviewZerZ charges a 15% service fee on all transactions. This fee is deducted from the Commission paid by the Buyer before the remaining amount is released to the Writer.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[#333333]">Refund Policy:</strong> Refunds are available only if a project is not completed as agreed, or if a Writer cancels without delivering work. Refund requests must be submitted within 30 days of payment. ReviewZerZ reserves the right to deny refunds if the work has been substantially completed.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">7. Service Disclaimer</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ is provided on an "as-is" and "as-available" basis. We make no warranties regarding the Service, including warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the Service will be uninterrupted, error-free, or secure. Users assume all risks associated with using the Service.
            </p>
          </section>

          {/* Section 8 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">8. Testimonials and Endorsements</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ may display testimonials, reviews, and endorsements from Users. These statements are the opinions of the Users and do not represent official endorsements by ReviewZerZ. We do not verify the accuracy of testimonials and are not responsible for any false or misleading statements made by Users.
            </p>
          </section>

          {/* Section 9 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">9. Use and Conduct</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              Users agree not to:
            </p>
            <ul className="text-[#6c757d] space-y-2 ml-6">
              <li>• Engage in harassment, hate speech, or discrimination</li>
              <li>• Post illegal content or content that violates intellectual property rights</li>
              <li>• Attempt to manipulate ratings, reviews, or the platform's systems</li>
              <li>• Engage in fraudulent transactions or payment manipulation</li>
              <li>• Use the platform for illegal activities or purposes</li>
              <li>• Share personal information of others without consent</li>
              <li>• Spam or send unsolicited messages to other users</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">10. Disclaimer Regarding Guarantee</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ makes no guarantee regarding the quality, timeliness, or suitability of any review, feedback, or work provided through the platform. We do not guarantee that any Writer's work will meet a Buyer's expectations or project requirements. Disputes over work quality should be resolved directly between Buyers and Writers.
            </p>
          </section>

          {/* Section 11 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">11. Disclaimer Regarding Responsibility</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ is not responsible for disputes between Buyers and Writers, including disagreements over project scope, work quality, or payment. We are not liable for any content posted by Users or for any harm resulting from interactions between Users. Users acknowledge that they are responsible for evaluating the credibility and capability of other Users.
            </p>
          </section>

          {/* Section 12 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">12. Force Majeure</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              ReviewZerZ shall not be liable for any failure or delay in performing obligations under these Terms due to events beyond our control, including but not limited to: natural disasters, wars, pandemics, government actions, or internet infrastructure failures. In such cases, ReviewZerZ may suspend operations without liability to Users.
            </p>
          </section>

          {/* Section 13 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">13. Liability Disclaimer</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              To the maximum extent permitted by law, ReviewZerZ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, arising from or related to your use of the Service, even if ReviewZerZ has been advised of the possibility of such damages. Our total liability shall not exceed the amount paid by you in the past 12 months.
            </p>
          </section>

          {/* Section 14 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">14. Indemnification</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              You agree to indemnify, defend, and hold harmless ReviewZerZ and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including attorney fees) arising from: your violation of these Terms, your use of the Service, your content or postings, or any infringement of third-party rights. This obligation survives termination of your account.
            </p>
          </section>

          {/* Section 15 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">15. Governing Law</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              These Terms are governed by the laws of the State of Israel, without regard to its conflict of law principles. Any legal action or proceeding shall be subject to the exclusive jurisdiction of the courts located in Israel. By using ReviewZerZ, you agree to submit to the jurisdiction of these courts and waive any objection to venue or inconvenient forum.
            </p>
          </section>

          {/* Section 16 */}
          <section className="section-padding">
            <h2 className="text-2xl font-semibold text-[#333333] mb-4">16. Contact Us</h2>
            <p className="text-[#6c757d] leading-relaxed mb-4">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="text-[#6c757d] space-y-2">
              <p><strong className="text-[#333333]">ReviewZerZ Ltd.</strong></p>
              <p>Email: legal@reviewzerz.com</p>
              <p>Website: www.reviewzerz.com</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
