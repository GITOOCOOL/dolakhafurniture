import React from "react";
import Link from "next/link";

type CategoryRibbonProps = {
  title: string;
  slug: string;
  subtitle?: string;
  vouchers?: string[];
  description?: string;
};

const CategoryRibbon = ({
  title,
  slug,
  subtitle,
  vouchers,
  description,
}: CategoryRibbonProps) => {
  const isFeatured = slug === "featured";
  const isCampaign = slug.startsWith("campaign/");

  const buttonText = isFeatured ? "Shop All" : "Explore";
  const buttonHref = isFeatured
    ? "/shop"
    : isCampaign
      ? `/${slug}`
      : `/category/${slug}`;

  const defaultFeaturedDesc = "Our top-rated pieces for every room.";
  const displayDescription =
    description || (isFeatured ? defaultFeaturedDesc : null);

  const formattedSubtitle =
    subtitle && !isNaN(Date.parse(subtitle))
      ? `Ends on: ${new Date(subtitle).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
      : subtitle;

  return (
    <div
      className="relative group w-full flex flex-row items-center justify-between
                    bg-app px-4 py-4 md:py-6 md:px-8
                    shadow-sm transition-all duration-500 
                    hover:bg-surface hover:border-action rounded-r-md min-h-[80px]"
    >
      <div className="z-10 w-full flex flex-row gap-8 items-center lg:items-center">
        {/* LEFT SECTION (Branding) */}
        <div className="flex-shrink-0 w-fit flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h2 className="type-product text-heading leading-tight capitalize transition-colors group-hover:text-action">
              {title}
            </h2>

            {formattedSubtitle && (
              <p className="type-label text-action text-[8px] lg:text-[10px]">
                {formattedSubtitle}
              </p>
            )}

            {vouchers && vouchers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {vouchers.map((code) => (
                  <span
                    key={code}
                    className="type-label inline-block px-2 py-0.5 bg-surface border border-action/40 
                               text-action rounded-sm tracking-tighter"
                  >
                    {code}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Link
            href={buttonHref}
            className="type-action inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-invert text-app transition-all hover:bg-action w-fit"
          >
            <span className="lg:hidden text-[9px]">{buttonText}</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

        {/* RIGHT SECTION (Description) */}
        {displayDescription && (
          <div className="flex-1 flex flex-col justify-center lg:justify-start border-l border-soft/30 pl-4 lg:pl-8">
            <p className="type-body text-description leading-relaxed italic text-[11px] md:text-[13px]">
              {displayDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryRibbon;
