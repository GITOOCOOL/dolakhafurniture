import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Visit our Samakhusi showroom or reach out to us for furniture inquiries and delivery across Kathmandu.",
};

export default function ContactPage() {
  return (
    <div className="bg-app min-h-screen pt-32 pb-20 font-sans text-heading">
      <div className="container mx-auto px-6 text-center">
        <h1 className="type-hero mb-8">Contact Us.</h1>
        <p className="text-label italic font-serif text-xl max-w-2xl mx-auto">
          "Visit our showroom in Samakhusi or message us for inquiries."
        </p>
      </div>
    </div>
  );
}


