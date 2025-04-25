import { Receipt } from '../interfaces/Receipts';

export function processReceipt(receipt: Receipt): { foo: string } {
  return { foo: "bar" };
}

export default {
  processReceipt
};
