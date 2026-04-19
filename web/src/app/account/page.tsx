import { createClient } from "@/utils/supabase/server";
import { client as sanityClient } from "@/lib/sanity";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import AccountClient from "../../components/AccountClient";

// 1. SEO METADATA - Updated with "home" and "" terminology
export const metadata: Metadata = {
  title: "My Account | Dolakha Furniture",
  description: "Manage your  profile and  preferences.",
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const params = await searchParams;

  if (!user) {
    redirect("/");
  }

  // 3. FETCH LATEST ORDER FOR ADDRESS HARVESTING
  const lastOrder = await sanityClient.fetch(
    `*[_type == "order" && (supabaseUserId == $userId || customerEmail == $email)] | order(_createdAt desc)[0]`,
    { userId: user.id, email: user.email },
    { useCdn: false },
  );

  return (
    <div className="bg-[#fdfaf5] min-h-screen pt-32 pb-20 font-sans text-[#3d2b1f]">
      <div className="container mx-auto px-6">
        <AccountClient
          user={user}
          lastOrder={lastOrder}
          showSuccess={params.updated === "true"}
        />
      </div>
    </div>
  );
}
