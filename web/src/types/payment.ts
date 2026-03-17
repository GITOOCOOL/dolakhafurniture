import { SanityImageSource } from "@sanity/image-url";

export type PaymentAccount = {
  _id: string;
  accountName: string;
  accountNumber: string;
  bankNameOrWalletName: string;
  accountType: 'Bank' | 'Wallet';
  qrCodeImage?: SanityImageSource;
  isActive: boolean;
}
