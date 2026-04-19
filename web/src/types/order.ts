import { SanityImageSource } from "@sanity/image-url";

export type Order = {
  _id: string;
  _createdAt: string;
  orderNumber?: string;
  voucherCode?: string;
  status?: string;
  customerPhone?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postcode: string;
    country?: string;
  };
  totalPrice: number;
  items: {
    title: string;
    price: number;
    quantity: number;
    image?: SanityImageSource;
  }[];
}
