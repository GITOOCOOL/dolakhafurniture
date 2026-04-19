import { createClient } from "@/utils/supabase/server";
import { client as sanityClient } from "@/lib/sanity";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import OrdersClient from "../../components/OrdersClient";

export const metadata: Metadata = {
  title: "My Orders | Dolakha Furniture",
  description: "Track your   furniture orders.",
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch orders with an intelligent fallback for product images
  const orders = await sanityClient.fetch(
    `*[_type == "order" && (supabaseUserId == $userId || (supabaseUserId == "guest" && customerEmail == $email))] | order(_createdAt desc) {
      ...,
      items[] {
        ...,
        "image": coalesce(image, *[_type == "product" && _id == ^.productId][0].mainImage)
      }
    }`,
    { userId: user.id, email: user.email },
    { useCdn: false },
  );

  return (
    <div className="bg-[#fdfaf5] min-h-screen">
      <div className="container mx-auto px-6">
        <OrdersClient orders={orders} />
      </div>
    </div>
  );
}
