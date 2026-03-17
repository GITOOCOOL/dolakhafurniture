import { createClient } from "@/utils/supabase/server";
import { client as sanityClient } from "@/lib/sanity";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import AccountClient from "../../components/AccountClient";

// 1. SEO METADATA - Updated with "home" and "Artisanal" terminology
export const metadata: Metadata = {
  title: "My home Account | Dolakha Furniture",
  description: "Manage your artisanal furniture orders and curated profile.",
};

// Force fresh data on every visit
export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 2. AUTH CHECK
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const params = await searchParams;

  if (!user) {
    redirect("/");
  }

  // 3. FETCH ORDERS FROM SANITY
  // We fetch orders linked to the user ID OR guest orders that match the user's email
  const orders = await sanityClient.fetch(
    `*[_type == "order" && (supabaseUserId == $userId || (supabaseUserId == "guest" && customerEmail == $email))] | order(_createdAt desc)`,
    { userId: user.id, email: user.email },
    { useCdn: false } // Always get fresh orders
  );

  return (
    /* Changed bg-stone-50 to your new Boho Cream (#fdfaf5) */
    <div className="bg-[#fdfaf5] min-h-screen pt-32 pb-20 font-sans text-[#3d2b1f]">
      <div className="container mx-auto px-6">
        {/* 
            Note: You will likely need to update the AccountClient component next 
            to ensure its internal buttons, cards, and text use the:
            - Espresso (#3d2b1f) 
            - Terracotta (#a3573a)
            - Serif Fonts (Cormorant Garamond)
        */}
        <AccountClient 
          user={user} 
          orders={orders} 
          showSuccess={params.ordered === "true"} 
        />
      </div>
    </div>
  )
}
