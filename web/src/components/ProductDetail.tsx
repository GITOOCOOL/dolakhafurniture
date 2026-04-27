"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor, client } from "@/lib/sanity";
import { useCart } from "@/store/useCart";
import {
  Leaf,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  MessageCircle,
  MessageSquare,
} from "lucide-react";
import Button from "./ui/Button";
import { Product, BusinessMetaData } from "@/types";
import { trackEvent } from "./MetaPixel";
import { useToast } from "./Toast";
import { useEffect } from "react";

export default function ProductDetail({
  product,
  businessMetaData,
  variant = "default",
}: {
  product: Product;
  businessMetaData?: BusinessMetaData | null;
  variant?: "default" | "modal";
}) {
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { showToast } = useToast();

  // FETCH ACTIVE CAMPAIGNS AND GLOBAL VOUCHERS FOR REAL-TIME DISCOUNTING
  useEffect(() => {
    async function fetchPromotions() {
      try {
        // 1. Fetch Active Campaign and its vouchers
        const campaign = await client.fetch(
          `*[_type == "campaign" && status == "active"] | order(startDate desc)[0] {
            title,
            "vouchers": vouchers[]->{code, details, discountType, discountValue, isFirstOrderVoucher, isOneTimePerCustomer, minimumSpend}
          }`,
        );

        // 2. Fetch Global Active Vouchers (including those not linked to a specific campaign)
        const globalVouchers = await client.fetch(
          `*[_type == "discountVoucher" && isActive == true] {
            code, details, discountType, discountValue, isFirstOrderVoucher, isOneTimePerCustomer, minimumSpend
          }`,
        );

        // Merge and filter for guest-eligible vouchers AND minimum spend threshold
        const allVouchers = [...(campaign?.vouchers || []), ...globalVouchers];

        // Unique vouchers by code
        const uniqueVouchers = Array.from(
          new Map(allVouchers.map((v) => [v.code, v])).values(),
        );

        const eligibleVouchers = uniqueVouchers.filter(
          (v: any) =>
            !v.isFirstOrderVoucher &&
            !v.isOneTimePerCustomer &&
            (!v.minimumSpend || product.price >= v.minimumSpend),
        );

        if (eligibleVouchers.length > 0) {
          setActiveCampaign({
            title: campaign?.title || "Active Promotions",
            vouchers: eligibleVouchers,
          });
        } else {
          setActiveCampaign(null); // Reset if no vouchers qualify for this price point
        }
      } catch (error) {
        console.error("Discovery: Failed to fetch promotion context:", error);
      }
    }
    fetchPromotions();
  }, []);

  // CALCULATE DISCOUNTS (Finding the best guest-eligible discount)
  const originalPrice = product.price;
  let discountedPrice = originalPrice;
  let activeDiscountEffect = null;

  if (activeCampaign?.vouchers?.length > 0) {
    // Find the most beneficial discount for the user
    const bestVoucher = activeCampaign.vouchers.reduce(
      (best: any, current: any) => {
        let currentDiscount = 0;
        if (current.discountType === "percentage") {
          currentDiscount = originalPrice * (current.discountValue / 100);
        } else if (current.discountType === "fixed") {
          currentDiscount = current.discountValue;
        }

        let bestDiscount = 0;
        if (best.discountType === "percentage") {
          bestDiscount = originalPrice * (best.discountValue / 100);
        } else if (best.discountType === "fixed") {
          bestDiscount = best.discountValue;
        }

        return currentDiscount > bestDiscount ? current : best;
      },
      activeCampaign.vouchers[0],
    );

    if (bestVoucher.discountType === "percentage") {
      discountedPrice =
        originalPrice - originalPrice * (bestVoucher.discountValue / 100);
      activeDiscountEffect = `${bestVoucher.discountValue}% OFF`;
    } else if (bestVoucher.discountType === "fixed") {
      discountedPrice = Math.max(0, originalPrice - bestVoucher.discountValue);
      activeDiscountEffect = `Rs. ${bestVoucher.discountValue} OFF`;
    }
  }

  // Tracking: ViewContent and AddToCart
  useEffect(() => {
    if (product) {
      const cleanId = product._id.replace("drafts.", "");
      trackEvent("ViewContent", {
        content_name: product.title,
        content_category: product.category?.title,
        content_ids: [cleanId],
        content_type: "product",
        currency: "NPR",
        brand: businessMetaData?.businessName || "Dolakha Furniture",
        availability:
          (product.stock ?? 0) > 0 ? "in stock" : "available for order",
      });
    }
  }, [product]);

  // Combined Gallery: mainImage + visible gallery images with valid assets
  const allImages = [
    product.mainImage,
    ...(product.images?.filter((img) => img.isVisible && img.asset) || []),
  ].filter((img) => img && ((img as any).asset || (img as any)._ref));

  const [selectedImage, setSelectedImage] = useState<any>(
    allImages[0] || product.mainImage,
  );
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product) return;
    const cleanId = product._id.replace("drafts.", "");
    addItem(product, quantity);
    trackEvent("AddToCart", {
      content_name: product.title,
      content_category: product.category?.title,
      content_ids: [cleanId],
      content_type: "product",
      currency: "NPR",
      brand: businessMetaData?.businessName || "Dolakha Furniture",
      availability:
        (product.stock ?? 0) > 0 ? "in stock" : "available for order",
    });
    setIsSuccess(true);
    let thumbUrl = "";
    try {
      // Prioritize mainImage, fallback to first gallery image if needed
      const imgSource =
        product.mainImage ||
        (product.images && product.images.length > 0
          ? product.images[0]
          : null);

      if (imgSource) {
        thumbUrl = urlFor(imgSource).width(120).height(120).fit("crop").url();
      }
    } catch (e) {
      console.error("Toast Image Error", e);
    }

    showToast(`${quantity} x ${product.title} added`, thumbUrl);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div
      className={`${variant === "modal" ? "pt-0 pb-10" : "pt-32 pb-20 container mx-auto px-6"} text-heading`}
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 ${variant === "modal" ? "gap-0" : "gap-16"} items-start`}
      >
        <div className="space-y-4">
          <div className="relative group overflow-hidden">
            {/* TOP STORY BARS INDICATOR */}
            {allImages.length > 1 && (
              <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5 pointer-events-none">
                {allImages.map((_, i) => (
                  <div 
                    key={i} 
                    className="h-1.5 flex-1 rounded-full transition-colors duration-300 transform-gpu"
                    style={{ backgroundColor: i === activeIndex ? '#ff6b00' : 'rgba(0, 0, 0, 0.4)' }}
                  />
                ))}
              </div>
            )}
            {/* SWIPEABLE MAIN IMAGE CONTAINER */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (allImages.length <= 1) return;

                if (x < rect.width / 3) {
                  // Prev
                  const newIndex = Math.max(0, activeIndex - 1);
                  document.getElementById(`product-image-${newIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  setActiveIndex(newIndex);
                  if (allImages[newIndex]) setSelectedImage(allImages[newIndex]);
                } else if (x > (rect.width * 2) / 3) {
                  // Next
                  const newIndex = Math.min(allImages.length - 1, activeIndex + 1);
                  document.getElementById(`product-image-${newIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  setActiveIndex(newIndex);
                  if (allImages[newIndex]) setSelectedImage(allImages[newIndex]);
                }
              }}
              onScroll={(e) => {
                const container = e.currentTarget;
                const index = Math.round(
                  container.scrollLeft / container.clientWidth,
                );
                if (index !== activeIndex) {
                  setActiveIndex(index);
                  if (allImages[index]) setSelectedImage(allImages[index]);
                  
                  // Sync thumbnail scroll as well
                  const thumb = document.getElementById(`thumb-${index}`);
                  thumb?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }
              }}
              className={`relative bg-app overflow-x-hidden overflow-y-hidden flex flex-nowrap scrollbar-hide transition-all duration-700 ${variant === "modal" ? "aspect-square lg:aspect-auto lg:h-[600px] rounded-none" : "aspect-square rounded-[3rem] border border-divider shadow-sm hover:shadow-[0_20px_60px_rgba(163,87,58,0.1)] hover:border-action/20"}`}
            >

              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full h-full snap-center snap-always relative overflow-hidden bg-app"
                  id={`product-image-${idx}`}
                >
                  {/* BASE ATMOSPHERE */}
                  <Image
                    src={urlFor(img).width(200).blur(5).auto("format").url()}
                    alt=""
                    fill
                    className="object-cover opacity-20 scale-105 pointer-events-none"
                  />

                  {/* SHARP IMAGE PORTAL */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={urlFor(img).width(1200).auto("format").url()}
                      alt={`${product.title} view ${idx}`}
                      fill
                      className={`transition-transform duration-[1.5s] ${variant === "modal" ? "object-cover" : "object-contain"}`}
                      priority={idx === 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

            <div
              className={`flex flex-col sm:grid sm:grid-cols-[auto,1fr] items-center gap-6 sm:gap-8 py-6 border-t border-divider/10 ${variant === "modal" ? "px-4 sm:px-6 bg-surface/50 backdrop-blur-sm" : ""}`}
            >
              {/* COL 1: PRICE READOUT */}
              <div className="w-full sm:w-auto text-center sm:text-left">
                <div className="flex flex-col sm:items-start items-center">
                  {/* TOP LINE: ORIGINAL PRICE BENCHMARK */}
                  {activeDiscountEffect ? (
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base sm:text-lg font-sans font-extrabold text-label/30 line-through">
                        Rs. {originalPrice.toLocaleString()}
                      </p>
                      <span className="bg-action text-white text-[9px] font-sans font-black px-1.5 py-0.5 rounded-sm tracking-widest uppercase shadow-sm">
                        {activeDiscountEffect}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[10px] sm:text-[11px] font-sans font-extrabold uppercase tracking-[0.2em] text-label opacity-40 mb-1">
                      Archival Value
                    </p>
                  )}

                  {/* SECOND LINE: ACTIVE OFFER PRICE */}
                  <span className="text-4xl font-extrabold text-heading tracking-tight sm:text-5xl leading-none">
                    Rs. {discountedPrice.toLocaleString()}
                  </span>
                </div>

                {/* VOUCHER DISCOVERY PILLS */}
                {activeCampaign?.vouchers?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                    {activeCampaign.vouchers.map((v: any) => (
                      <div
                        key={v.code}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-action/5 border border-action/20 rounded-full group cursor-default transition-all hover:bg-action/10"
                      >
                        <div className="w-1 h-1 rounded-full bg-action animate-pulse" />
                        <span className="text-[9px] font-sans font-black uppercase tracking-widest text-action">
                          {v.code}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* COL 2: TACTICAL STACK (Multi-Row) */}
              <div className="flex flex-col items-center sm:items-stretch gap-4 w-full sm:w-auto">
                {/* ROW 1: QUANTITY PRECISION CONTROL */}
                <div className="flex items-center border border-divider/50 rounded-full px-2 py-1 bg-app shadow-sm self-center min-w-[120px] justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 min-h-0 text-description hover:text-action h-8 w-8 transition-all hover:bg-soft/10"
                    leftIcon={<Minus size={14} />}
                  />
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-12 bg-transparent border-none text-center font-sans font-extrabold text-sm text-heading focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 min-h-0 text-description hover:text-action h-8 w-8 transition-all hover:bg-soft/10"
                    leftIcon={<Plus size={14} />}
                  />
                </div>

                {/* ROW 2: ADD TO BAG */}
                <Button
                  onClick={handleAddToCart}
                  size="md"
                  variant={isSuccess ? "accent" : "primary"}
                  className={`rounded-full py-4 px-10 text-[9px] tracking-[0.2em] font-sans font-bold transition-all duration-500 hover:shadow-[0_15px_30px_rgba(163,87,58,0.15)] active:scale-[0.98] w-full ${
                    isSuccess ? "bg-green-600 border-green-600 text-white" : ""
                  }`}
                  leftIcon={isSuccess ? <ShieldCheck size={14} /> : undefined}
                >
                  {isSuccess ? "Added" : "Add to Bag"}
                </Button>

                {/* ROW 3: SOCIAL ASSISTANCE (MATCHING PRODUCT CARD ARCHITECTURE) */}
                <div className="flex items-stretch w-full overflow-hidden rounded-full border border-soft shadow-sm bg-surface">
                  {/* WHATSAPP ACTION */}
                  <a
                    href={`https://wa.me/${(businessMetaData?.whatsapp || "undefined_setmetadata_in_studio").replace(/[^0-9]/g, "")}?text=Hi ${businessMetaData?.businessName || "undefined_setmetadata_in_studio"}! I'm interested in the ${product.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center py-4 bg-app hover:bg-green-600 group/wa transition-all duration-300"
                    title="WhatsApp"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        className="fill-green-600 group-hover/wa:fill-white transition-colors"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-green-600 group-hover/wa:text-white transition-colors">
                        WhatsApp
                      </span>
                    </div>
                  </a>

                  {/* MESSENGER ACTION */}
                  <a
                    href={
                      businessMetaData?.messengerUrl ||
                      "undefined_setmetadata_in_studio"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center py-4 bg-app hover:bg-action group/ms transition-all duration-300 border-l border-soft"
                    title="Messenger"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        className="fill-action group-hover/ms:fill-white transition-colors"
                      >
                        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.303 2.254.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.12l-3.058-3.268-5.965 3.268 6.556-6.974 3.125 3.268 5.898-3.268-6.556 6.974z" />
                      </svg>
                      <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-action group-hover/ms:text-white transition-colors">
                        Messenger
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
        </div>

        {/* RIGHT: CONTENT */}
        <div
          className={`space-y-10 ${variant === "modal" ? "p-10 lg:p-12" : "lg:pl-10"}`}
        >
          <header>
            <div className="flex items-center gap-3 mb-4">
              <Leaf size={14} className="text-action opacity-70" />
              <p className="text-[10px] font-sans font-extrabold text-action uppercase tracking-[0.2em]">
                {product.category?.title || "Signature Piece"}
              </p>
            </div>

            <h1 className={`${variant === "modal" ? "text-3xl" : "type-section"} text-heading mb-4 leading-tight`}>
              {product.title}
            </h1>
          </header>

          <div className="space-y-4">
            <h3 className="text-[10px] font-sans font-extrabold uppercase tracking-[0.2em] text-action">
              Description
            </h3>
            <p className="text-sm md:text-base text-description font-sans leading-relaxed max-w-2xl whitespace-pre-line">
              {product.description ||
                "Details for this piece are currently being curated. You can always contact us for any information."}
            </p>
          </div>

          {product.category?.description && (
            <div className="space-y-4 pt-10 border-t border-divider/10">
              <h3 className="text-[10px] font-sans font-extrabold uppercase tracking-[0.2em] text-label opacity-40">
                The {product.category.title} Story
              </h3>
              <p className="text-sm md:text-base text-description font-sans italic leading-relaxed max-w-2xl whitespace-pre-line">
                {product.category.description}
              </p>
            </div>
          )}

          {/* SPECIFICATIONS */}
          {(product.material ||
            product.length ||
            product.breadth ||
            product.height) && (
            <div className="pt-8 border-t border-divider/10">
              <div className="grid grid-cols-2 gap-8">
                {product.material && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label opacity-40">
                      Material
                    </p>
                    <p className="text-sm font-sans font-bold text-heading">
                      {product.material}
                    </p>
                  </div>
                )}
                {(product.length || product.breadth || product.height) && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label opacity-40">
                      Dimensions
                    </p>
                    <p className="text-sm font-sans font-bold text-heading">
                      {[product.length, product.breadth, product.height]
                        .filter(Boolean)
                        .join(" x ")}{" "}
                      inches
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-2 text-action">
              <Truck size={14} />
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.1em]">
                Free Delivery inside Ringroad Kathmandu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
