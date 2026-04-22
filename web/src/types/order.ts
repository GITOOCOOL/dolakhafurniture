import { SanityImageSource } from "@sanity/image-url";

export type Order = {
  _id: string;
  _createdAt: string;
  orderNumber?: string;
  status?: string;
  orderSource?: string;
  isPhoneOrder?: boolean;
  internalNotes?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  totalPrice: number;
  discountValue?: number;
  advanceDeposit?: number;
  voucherCodes?: string[];
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postcode?: string;
    country?: string;
  };
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    image?: SanityImageSource;
    isCustom?: boolean;
    spec?: any;
  }[];
}
