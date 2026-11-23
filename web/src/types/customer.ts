export type CustomerData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postcode?: string;
  country?: string;
  shippingMethod?: string;
  paymentMethod: string;
  website?: string; // honeypot: hidden field, real customers leave it empty
}
