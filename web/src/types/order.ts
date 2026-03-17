export type Order = {
  _id: string;
  _createdAt: string;
  status?: string;
  totalPrice: number;
  items: {
    title: string;
    price: number;
    quantity: number;
  }[];
}
