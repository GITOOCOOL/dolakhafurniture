import React from 'react';

export const metadata = {
  title: 'Terms of Service | Dolakha Furniture',
  description: 'Read the terms and conditions for using the Dolakha Furniture website and services.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-app pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif italic text-heading mb-12 border-b border-soft pb-8">
          Terms of Service
        </h1>
        
        <div className="space-y-12 text-description leading-relaxed font-sans">
          <section>
            <h2 className="text-xl font-bold text-heading uppercase tracking-widest mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Dolakha Furniture website, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading uppercase tracking-widest mb-4">2. Use of Site</h2>
            <p>
              You agree to use the site for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading uppercase tracking-widest mb-4">3. Products and Pricing</h2>
            <p>
              We strive to ensure that all product descriptions and prices are accurate. However, errors may occur. If we discover an error in the price of any product you have ordered, we will inform you as soon as possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading uppercase tracking-widest mb-4">4. Intellectual Property</h2>
            <p>
              All content on this site, including images, text, and logos, is the property of Dolakha Furniture and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading uppercase tracking-widest mb-4">5. Limitation of Liability</h2>
            <p>
              Dolakha Furniture shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
            </p>
          </section>

          <section>
            <div className="pt-8 border-t border-soft/30 italic">
              <p>Last updated: May 1, 2026</p>
              <p>If you have any questions regarding these terms, please contact us at thakurisuraj38@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
