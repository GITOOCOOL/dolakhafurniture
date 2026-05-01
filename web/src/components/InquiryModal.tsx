"use client";

import { useState } from "react";
import { submitInquiry } from "@/app/actions/inquiry";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { client as sanityClient } from "@/lib/sanity";
import { Order } from "@/types";
import { getCustomerOrders, getFAQs } from "@/app/actions/orders";
import { ChevronDown, Package, Info, HelpCircle, Sparkles, Phone, MessageCircle, Facebook } from "lucide-react";
import { trackEvent } from "./MetaPixel";
import { BusinessMetaData } from "@/types";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessMetaData?: BusinessMetaData | null;
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
  businessMetaData,
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
    inquiryType: initialOrderReference ? "order" : "general",
    orderReference: initialOrderReference || "",
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
        setIsLoadingFaqs(true);
        try {
          // 1. Fetch FAQs via Secure Server Action
          const faqResult = await getFAQs();
          if (faqResult.success) setFaqs(faqResult.faqs || []);

          // 2. Fetch Orders via Secure Server Action
          setIsLoadingOrders(true);
          const orderResult = await getCustomerOrders();
          
          if (orderResult.success && orderResult.orders) {
            setUserOrders(orderResult.orders);
            // Only default to the latest order if a specific one wasn't clicked
            if (orderResult.orders.length > 0 && !initialOrderReference) {
              setInquiryData((prev) => ({
                ...prev,
                orderReference: orderResult.orders[0].orderNumber || orderResult.orders[0]._id,
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
  }, [isOpen, initialOrderReference]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setInquiryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus("submitting");
    try {
      const result = await submitInquiry(inquiryData);
      if (result.success) {
        trackEvent("Contact", {
          inquiry_type: inquiryData.inquiryType,
        });
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
    <Modal isOpen={isOpen} onClose={onClose} title={title} position="bottom" id="inquiry-modal" className="sm:h-[calc(100dvh-var(--header-height,5rem))]">
      <p className="type-label text-description mb-8 -mt-2">
        {subtitle}
      </p>

      {/* QUICK CONNECT HUB */}
      <div className="flex flex-row items-center justify-between gap-2 md:gap-3 mb-8">
        {[
          {
            icon: <MessageCircle size={18} className="fill-[#128C7E] stroke-[0.5]" strokeWidth={1.5} />,
            label: "WhatsApp",
            href: `https://wa.me/${(businessMetaData?.whatsapp || "").replace(/[^0-9]/g, '')}`,
            color: "bg-[#25D366]",
            textColor: "text-white",
          },
          {
            icon: <Facebook size={18} className="fill-[#0084FF] stroke-[0.5]" strokeWidth={1.5} />,
            label: "Messenger",
            href: businessMetaData?.messengerUrl || "#",
            color: "bg-[#0084FF]",
            textColor: "text-white",
          },
          {
            icon: <Phone size={18} className="text-app" strokeWidth={1.5} />,
            label: "Call Us",
            href: `tel:${businessMetaData?.phone || ""}`,
            color: "bg-heading",
            textColor: "text-app",
          }
        ].map((btn, idx) => (
          <a
            key={idx}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-1 items-center justify-center gap-2 py-3 px-1 sm:px-3 rounded-full shadow-sm ${btn.color} ${btn.textColor} hover:scale-[1.03] transition-all duration-300 border border-divider/10`}
          >
            {btn.icon}
            <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-widest leading-none truncate">
              {btn.label}
            </span>
          </a>
        ))}
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {faqs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-description mb-4 ml-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div 
                key={faq._id} 
                className="bg-app border border-soft/20 rounded-[1.5rem] overflow-hidden shadow-sm hover:border-soft/40 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setSelectedFaq(selectedFaq?._id === faq._id ? null : faq)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none touch-manipulation cursor-pointer"
                >
                  <span className="font-sans font-bold text-sm text-heading pr-4">{faq.question}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-action transition-transform duration-300 flex-shrink-0 ${selectedFaq?._id === faq._id ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {selectedFaq?._id === faq._id && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 flex gap-3 items-start">
                        <Sparkles size={14} className="text-action mt-1 flex-shrink-0" />
                        <p className="text-sm text-heading leading-relaxed italic font-serif">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-soft/20" />
        <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-description text-center">Still need help? Send a message</span>
        <div className="h-px flex-1 bg-soft/20" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* PRIMARY INQUIRY TYPE */}
          <div className="space-y-2">
            <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-description ml-4">
              How can we help?
            </label>
            <div className="relative">
              <select
                name="inquiryType"
                value={inquiryData.inquiryType}
                onChange={handleInputChange}
                className="w-full bg-app border border-soft/20 px-8 py-4 rounded-[1.5rem] text-sm focus:outline-none focus:ring-1 focus:ring-action transition-all appearance-none font-sans text-heading font-medium"
              >
                <option value="general">❓ General Inquiry</option>
                <option value="order">📦 Order Inquiry</option>
                <option value="custom">🪑 Product Customization</option>
                <option value="bulk">🏢 Bulk / Corporate Inquiry</option>
              </select>
              <ChevronDown
                className="absolute right-6 top-1/2 -translate-y-1/2 text-heading pointer-events-none"
                size={16}
              />
            </div>
          </div>

          {/* CONDITIONAL: ORDER REFERENCE */}
          {inquiryData.inquiryType === "order" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="space-y-2">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-description ml-4">
                  Associated Order
                </label>
                <div className="relative">
                  {userOrders.length > 0 ? (
                    <>
                      <select
                        name="orderReference"
                        value={inquiryData.orderReference}
                        onChange={handleInputChange}
                        className="w-full bg-app border border-soft/20 px-8 py-4 rounded-[1.5rem] text-sm focus:outline-none focus:ring-1 focus:ring-action transition-all appearance-none font-sans font-bold"
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
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-action pointer-events-none"
                        size={16}
                      />
                    </>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-app border border-dashed border-soft/30 rounded-[1.5rem] text-[10px] text-description uppercase tracking-widest italic font-medium">
                      <Package size={14} className="opacity-70" />
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
                    <div className="p-6 bg-surface border border-soft/10 rounded-[2rem] shadow-sm animate-in zoom-in-95 duration-500">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-action">Order Summary</p>
                          <p className="text-xs font-serif italic text-heading">{new Date(selectedOrder._createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="px-3 py-1 bg-app border border-action/20 rounded-full">
                          <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-action">{selectedOrder.status || 'Processing'}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] text-heading font-medium italic">
                            <span>{item.quantity}x {item.title}</span>
                            <span className="font-sans font-medium text-heading"> रू {item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-dashed border-soft/30 flex justify-between items-center">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-description">Total Value</span>
                        <span className="text-lg font-serif italic text-action">रू {selectedOrder.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}



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
            className="w-full bg-app border border-soft/20 px-8 py-4 rounded-[1.5rem] text-sm focus:outline-none focus:ring-1 focus:ring-action transition-all resize-none font-sans text-heading placeholder:text-heading/40"
          />

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
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={inquiryStatus === "submitting"}
          className={
            inquiryStatus === "success" ? "bg-success hover:opacity-90 shadow-lg shadow-success/20 transition-all scale-[1.02]" : ""
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
