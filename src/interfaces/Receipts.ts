import { Item } from './Item';

export interface Receipt {
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items: Item[];
  total: string;
}
