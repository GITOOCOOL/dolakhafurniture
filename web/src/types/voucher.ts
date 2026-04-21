export type Voucher = {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  details?: string;
  isWelcomeVoucher?: boolean;
};
