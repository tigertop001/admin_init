export interface CardData {
  id: string | null;
  uid: string | null;
  account: string | null;
  walletBalance: string | number | null;
  convertAmount: string | number | null;
  [key: string]: any;
}
