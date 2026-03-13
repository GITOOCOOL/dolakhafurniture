import { createClient } from "@/utils/supabase/server";
import { client as sanityClient } from "@/lib/sanity";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import AccountClient from "../../components/AccountClient";


// 1. SEO METADATA
export const metadata: Metadata = {
  title: "Your Account | Dolakha Furniture",
  description: "Manage your artisanal furniture orders and profile.",
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
  const orders = await sanityClient.fetch(
    `*[_type == "order" && supabaseUserId == $userId] | order(_createdAt desc)`,
    { userId: user.id },
    { useCdn: false } // Always get fresh orders
  );

  return (
    <div className="bg-stone-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Pass data to the Client Component for interactivity */}
        <AccountClient 
          user={user} 
          orders={orders} 
          showSuccess={params.ordered === "true"} 
        />
      </div>
    </div>
  )
}