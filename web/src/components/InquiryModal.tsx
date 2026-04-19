"use client";

import { useState } from "react";
import { submitInquiry } from "@/app/actions/inquiry";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { client as sanityClient } from "@/lib/sanity";
import { Order } from "@/types";
import { ChevronDown, Package, Info, HelpCircle, Sparkles } from "lucide-react";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  initialOrderReference?: string;
  title?: string;
  subtitle?: string;
}

export default function InquiryModal({
  isOpen,
  onClose,
  initialData,
  initialOrderReference,
  title = "Inquiry",
  subtitle = "How can we help you today?",
}: InquiryModalProps) {
  const [inquiryData, setInquiryData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    message: "",
    inquiryType: "order",
    orderReference: initialOrderReference || "",
    topic: "delivery",
  });
  const [inquiryStatus, setInquiryStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);

  // Sync initialOrderReference if it changes while modal is open (or opens)
  useEffect(() => {
    if (initialOrderReference) {
      setInquiryData(prev => ({
        ...prev,
        inquiryType: "order",
        orderReference: initialOrderReference
      }));
    }
  }, [initialOrderReference, isOpen]);

  // Fetch orders and FAQs if modal is open
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setIsLoadingFaqs(true);
        try {
          // Fetch FAQs
          const fetchedFaqs = await sanityClient.fetch(
            `*[_type == "faq"] | order(category asc)`,
          );
          setFaqs(fetchedFaqs);

          if (user) {
            setIsLoadingOrders(true);
            const orders = await sanityClient.fetch(
              `*[_type == "order" && (supabaseUserId == $userId || customerEmail == $email)] | order(_createdAt desc)[0...5]`,
              { userId: user.id, email: user.email },
            );
            setUserOrders(orders);
            // Only default to the latest order if a specific one wasn't clicked
            if (orders.length > 0 && !initialOrderReference) {
              setInquiryData((prev) => ({
                ...prev,
                orderReference: orders[0].orderNumber || orders[0]._id,
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching data for inquiry:", error);
        } finally {
          setIsLoadingOrders(false);
          setIsLoadingFaqs(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setInquiryData((prev) => ({ ...prev, [name]: value }));

    // Update selected FAQ if topic changes
    if (name === "topic") {
      const faq = faqs.find((f) => f.question === value);
      setSelectedFaq(faq || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus("submitting");
    try {
      const result = await submitInquiry(inquiryData);
      if (result.success) {
        setInquiryStatus("success");
        setTimeout(() => {
          onClose();
          // Reset form after closing
          setTimeout(() => {
            setInquiryStatus("idle");
            setInquiryData((prev) => ({ ...prev, message: "" }));
          }, 300);
        }, 2000);
      } else {
        setInquiryStatus("error");
      }
    } catch (error) {
      setInquiryStatus("error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-[10px] text-[#a89f91] uppercase tracking-[0.2em] text-center mb-8">
        {subtitle}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* PRIMARY INQUIRY TYPE */}
          <div className="space-y-2">
            <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91] ml-4">
              How can we help?
            </label>
            <div className="relative">
              <select
                name="inquiryType"
                value={inquiryData.inquiryType}
                onChange={handleInputChange}
                className="w-full bg-white border border-[#e5dfd3] px-8 py-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all appearance-none font-sans"
              >
                <option value="general">❓ Questions & FAQ</option>
                <option value="order">📦 Order Inquiry</option>
                <option value="custom">🪑 Product Customization</option>
                <option value="bulk">🏢 Bulk / Corporate Inquiry</option>
              </select>
              <ChevronDown
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#a89f91] pointer-events-none"
                size={16}
              />
            </div>
          </div>

          {/* CONDITIONAL: ORDER REFERENCE */}
          {inquiryData.inquiryType === "order" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="space-y-2">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91] ml-4">
                  Associated Order
                </label>
                <div className="relative">
                  {userOrders.length > 0 ? (
                    <>
                      <select
                        name="orderReference"
                        value={inquiryData.orderReference}
                        onChange={handleInputChange}
                        className="w-full bg-[#fdfaf5] border border-[#a3573a]/30 px-8 py-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all appearance-none font-sans font-bold"
                      >
                        {userOrders.map((order) => (
                          <option
                            key={order._id}
                            value={order.orderNumber || order._id}
                          >
                            Order #
                            {order.orderNumber ||
                              order._id.slice(-6).toUpperCase()}{" "}
                            — {new Date(order._createdAt).toLocaleDateString()}
                          </option>
                        ))}
                        <option value="other">Other / Not Listed</option>
                      </select>
                      <ChevronDown
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-[#a3573a] pointer-events-none"
                        size={16}
                      />
                    </>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-[#fdfaf5] border border-dashed border-[#e5dfd3] rounded-2xl text-[10px] text-[#a89f91] uppercase tracking-widest italic font-medium">
                      <Package size={14} className="opacity-40" />
                      {isLoadingOrders
                        ? "Refreshing your catalog..."
                        : "Manual Order ID required below"}
                    </div>
                  )}
                </div>
              </div>

              {/* DYNAMIC ORDER SUMMARY */}
              {inquiryData.orderReference && inquiryData.orderReference !== 'other' && (
                (() => {
                  const selectedOrder = userOrders.find(o => (o.orderNumber === inquiryData.orderReference) || (o._id === inquiryData.orderReference));
                  if (!selectedOrder) return null;
                  return (
                    <div className="p-6 bg-white border border-[#e5dfd3] rounded-3xl shadow-sm animate-in zoom-in-95 duration-500">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a3573a]">Order Summary</p>
                          <p className="text-xs font-serif italic text-[#3d2b1f]">{new Date(selectedOrder._createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="px-3 py-1 bg-[#fdfaf5] border border-[#a3573a]/20 rounded-full">
                          <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#a3573a]">{selectedOrder.status || 'Processing'}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] text-[#3d2b1f]/70 italic">
                            <span>{item.quantity}x {item.title}</span>
                            <span className="font-sans font-medium text-[#3d2b1f]"> रू {item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-dashed border-[#e5dfd3] flex justify-between items-center">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91]">Total Value</span>
                        <span className="text-lg font-serif italic text-[#a3573a]">रू {selectedOrder.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* CONDITIONAL: FAQ TOPICS */}
          {inquiryData.inquiryType === "general" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="space-y-2">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91] ml-4">
                  Inquiry Topic
                </label>
                <div className="relative">
                  <select
                    name="topic"
                    value={inquiryData.topic}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5dfd3] px-8 py-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all appearance-none font-sans font-bold"
                  >
                    <option value="">Select a topic...</option>
                    {faqs.map((faq) => (
                      <option key={faq._id} value={faq.question}>
                        {faq.question}
                      </option>
                    ))}
                    <option value="other">💬 Other Question</option>
                  </select>
                  <ChevronDown
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#a89f91] pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              {/* INSTANT RESPONSE */}
              {selectedFaq && (
                <div className="p-6 bg-[#fdfaf5] border border-dashed border-[#a3573a]/30 rounded-2xl animate-in zoom-in-95 duration-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-[#a3573a]" />
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#a3573a]">
                      Quick Answer
                    </span>
                  </div>
                  <p className="text-xs text-[#3d2b1f]/80 leading-relaxed italic font-serif">
                    "{selectedFaq.answer}"
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              required
              name="name"
              placeholder="Your Full Name"
              value={inquiryData.name}
              // @ts-ignore
              onChange={(e: any) => handleInputChange(e)}
            />
            <Input
              required
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={inquiryData.phone}
              // @ts-ignore
              onChange={(e: any) => handleInputChange(e)}
            />
          </div>

          <Input
            required
            type="email"
            name="email"
            placeholder="Email Address"
            value={inquiryData.email}
            // @ts-ignore
            onChange={(e: any) => handleInputChange(e)}
          />

          <textarea
            required
            name="message"
            rows={4}
            placeholder={
              inquiryData.inquiryType === "order"
                ? "Details about your order or tracking request..."
                : "How can we help you today?"
            }
            value={inquiryData.message}
            onChange={handleInputChange}
            className="w-full bg-white border border-[#e5dfd3] px-8 py-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all resize-none font-sans"
          />
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={inquiryStatus === "submitting"}
          className={
            inquiryStatus === "success" ? "bg-green-600 hover:bg-green-700" : ""
          }
        >
          {inquiryStatus === "submitting"
            ? "Sending..."
            : inquiryStatus === "success"
              ? "Inquiry Sent!"
              : "Submit Inquiry"}
        </Button>

        {inquiryStatus === "error" && (
          <p className="text-[10px] text-red-500 text-center font-bold uppercase tracking-widest">
            Failed to send. Please check your connection.
          </p>
        )}
      </form>
    </Modal>
  );
}
