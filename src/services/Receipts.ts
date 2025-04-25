import { Receipt, ReceiptResult } from "../interfaces/Receipts";
import { v4 as uuidv4 } from "uuid";

const receiptResults: Record<string, ReceiptResult> = {};

export function processReceipt(receipt: Receipt): { points: number } {
  let points = 0;

  // 1 point for every alphanumeric character in the retailer name
  points += receipt.retailer.replace(/[^a-zA-Z0-9]/g, "").length;

  // 50 points if the total is a round dollar amount with no cents
  // adding .0 in case of any funny business
  if (receipt.total.endsWith(".00") || receipt.total.endsWith(".0")) {
    points += 50;
  }

  // 25 points if the total is a multiple of 0.25
  if (Number(receipt.total) % 0.25 === 0) {
    points += 25;
  }

  // 5 points for every two items on the receipt
  points += Math.floor(receipt.items.length / 2) * 5;

  // If the trimmed length of the item description is a multiple of 3, multiple the price by 0.2 and round up to the nearest integer.
  // the result is the number of points earned.
  receipt.items.forEach((item) => {
    const trimmedDescription = item.shortDescription.trim();
    if (trimmedDescription.length % 3 === 0) {
      const price = Number(item.price);
      const pointsForItem = Math.ceil(price * 0.2);
      points += pointsForItem;
    }
  });

  // 6 points if the day in the purchase date is odd
  const dateParts = receipt.purchaseDate.split("-");
  if (dateParts.length === 3) {
    const day = parseInt(dateParts[2], 10);
    if (!isNaN(day) && day % 2 === 1) {
      points += 6;
    }
  }

  // 10 points if the time of purchase is after 2:00pm and before 4:00pm
  const timeParts = receipt.purchaseTime.split(":");
  if (timeParts.length === 2) {
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    if (!isNaN(hours) && !isNaN(minutes)) {
      const timeInMinutes = hours * 60 + minutes;
      const after2pm = 14 * 60;
      const before4pm = 16 * 60;

      if (timeInMinutes >= after2pm && timeInMinutes < before4pm) {
        points += 10;
      }
    }
  }

  points = Math.floor(points);

  return { points };
}

export function saveResult(result: { points: number }): string {
  const id = uuidv4();

  receiptResults[id] = {
    points: Math.floor(result.points),
  };

  return id;
}

export function getResult(id: string): ReceiptResult | null {
  return receiptResults[id] || null;
}

export default {
  processReceipt,
  saveResult,
  getResult,
};
