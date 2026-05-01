import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Dolakha Furniture',
  description: 'Learn how Dolakha Furniture collects, uses, and protects your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-app pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif italic text-heading mb-12 border-b border-soft pb-8">
          Privacy Policy
        </h1>
        
        <div className="space-y-12 text-description leading-relaxed font-sans">
          <section>
            <h2 className="text-xl font-bold text-heading uppercase tracking-widest mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, place an order, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading uppercase tracking-widest mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to process your orders, communicate with you about your purchases, and improve our services. With your consent, we may also send you marketing communications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading uppercase tracking-widest mb-4">3. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading uppercase tracking-widest mb-4">4. Sharing of Information</h2>
            <p>
              We do not share your personal information with third parties except as described in this policy, such as with service providers who perform services on our behalf (e.g., shipping and payment processing).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading uppercase tracking-widest mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us directly.
            </p>
          </section>

          <section>
            <div className="pt-8 border-t border-soft/30 italic">
              <p>Last updated: May 1, 2026</p>
              <p>If you have any questions about this Privacy Policy, please contact us at thakurisuraj38@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
