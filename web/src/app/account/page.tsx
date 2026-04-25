import { createClient } from "@/utils/supabase/server";
import { client as sanityClient } from "@/lib/sanity";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import AccountClient from "../../components/AccountClient";
import { getUserRole } from "@/lib/auth";
import Link from "next/link";

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
  
  // 4. ROLE CHECK
  const { role } = await getUserRole();

  return (
    <div className="bg-app min-h-screen pt-32 pb-20 font-sans text-heading">
      <div className="container mx-auto px-6 relative">
        {/* TOP LEFT: Back to home */}
        <div className="absolute top-12 left-6">
          <Link 
            href="/" 
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-heading hover:text-action transition-all flex items-center gap-2"
          >
            <span className="text-sm">←</span> Back to home
          </Link>
        </div>
        <AccountClient
          user={user}
          role={role || "user"}
          lastOrder={lastOrder}
          showSuccess={params.updated === "true"}
        />
      </div>
    </div>
  );
}
