export type Voucher = {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  details?: string;
  isWelcomeVoucher?: boolean;
  isOneTimePerCustomer?: boolean;
  startsImmediately?: boolean;
  neverExpires?: boolean;
  startsAt?: string;
  endsAt?: string;
};
