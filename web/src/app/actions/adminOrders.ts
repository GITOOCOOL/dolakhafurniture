"use server";

import { createClient as createSanity } from "@sanity/client";
import { revalidatePath } from "next/cache";

// Initialize Sanity Admin Client with Write Permissions
const sanityAdmin = createSanity({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-12"
});

function generateOrderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; 
  let result = "DF-";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export type ManualOrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export type ManualOrderData = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    firstName: string;
    lastName: string;
  };
  items: ManualOrderItem[];
  orderSource: string;
  internalNotes?: string;
  discountValue?: number;
  advanceDeposit?: number;
  voucherCodes?: string[];
};

export async function createManualOrder(data: ManualOrderData) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return { success: false, message: "Sanity write token is missing." };
  }

  try {
    const orderNumber = generateOrderNumber();
    const grossPrice = data.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalPrice = Math.max(0, grossPrice - (data.discountValue || 0));

    // 1. Prepare the Order Document
    const orderDocument = {
      _type: "order",
      orderNumber,
      orderSource: data.orderSource,
      isPhoneOrder: true,
      internalNotes: data.internalNotes,
      voucherCodes: data.voucherCodes || [],
      discountValue: data.discountValue || 0,
      customerName: data.customerName,
      customerEmail: data.customerEmail || "",
      customerPhone: data.customerPhone,
      shippingAddress: {
        _type: "object",
        firstName: data.shippingAddress.firstName,
        lastName: data.shippingAddress.lastName,
        address: data.shippingAddress.address,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        country: "Nepal",
      },
      paymentMethod: "manual",
      status: "pending",
      totalPrice,
      advanceDeposit: data.advanceDeposit || 0,
      items: data.items.map((item) => ({
        _key: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        product: {
          _type: "reference",
          _ref: item.productId,
        },
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      orderDate: new Date().toISOString(),
    };

    // 2. Start a Transaction to ensure atomic stock decrement and order creation
    const transaction = sanityAdmin.transaction();

    // Create Order
    transaction.create(orderDocument);

    // Decrement Stock for each product
    data.items.forEach((item) => {
      transaction.patch(item.productId, (p) => p.dec({ stock: item.quantity }));
    });

    const result = await transaction.commit();

    revalidatePath("/admin/orders");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");

    return { 
      success: true, 
      orderId: result.results[0].id, 
      orderNumber 
    };
  } catch (error: any) {
    console.error("Manual Order Error:", error);
    return { success: false, message: error.message || "Failed to create manual order." };
  }
}

export async function deleteOrder(orderId: string, restoreStock: boolean) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return { success: false, message: "Sanity write token is missing." };
  }

  try {
    // 1. Fetch order details first to get items and quantity for restoration
    const order = await sanityAdmin.fetch(`*[_id == $orderId][0]{ 
      items[] {
        quantity,
        "productId": product._ref
      } 
    }`, { orderId });
    
    if (!order) {
       return { success: false, message: "Order not found or already deleted." };
    }

    const transaction = sanityAdmin.transaction();

    // 2. Restore stock if requested
    if (restoreStock && order.items && order.items.length > 0) {
      order.items.forEach((item: any) => {
        if (item.productId) {
           transaction.patch(item.productId, (p) => p.inc({ stock: item.quantity }));
        }
      });
    }

    // 3. Delete the order document
    transaction.delete(orderId);

    await transaction.commit();

    revalidatePath("/admin/orders");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    console.error("Delete Order Error:", error);
    return { success: false, message: error.message || "Failed to delete order." };
  }
}
