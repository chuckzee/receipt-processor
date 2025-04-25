import { Request, Response, NextFunction } from "express";
import { Receipt, ReceiptResult } from "../interfaces/Receipts";
import { Item } from "../interfaces/Item";
import ReceiptsService from "../services/Receipts";

// define some constants for canned error responses
const INVALID_RECEIPT_RESPONSE = { error: "The receipt is invalid." };
const INVALID_ID_RESPONSE = { error: "No receipt found for that ID." };
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;

export const pointsValidationRules: Record<
  keyof ReceiptResult,
  Validator
> = {
  points: (value: unknown): boolean =>
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= Number.MAX_SAFE_INTEGER,
};

// for this project, using a homemade middleware but I've used express-validator for the same thing
export const validateReceiptMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body || !validateReceipt(req.body)) {
    res.status(HTTP_BAD_REQUEST).json(INVALID_RECEIPT_RESPONSE);
    return;
  }

  next();
};

export const validatePointsRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    res.status(HTTP_BAD_REQUEST).json(INVALID_ID_RESPONSE);
    return;
  }

  const result = ReceiptsService.getResult(id);

  if (!result) {
    res.status(HTTP_NOT_FOUND).json(INVALID_ID_RESPONSE);
    return;
  }

  next();
};

type Validator = (value: unknown) => boolean;

// validation rules for POST'd receipts
const validationRules: Record<keyof Receipt, Validator> = {
  retailer: (value: unknown): boolean =>
    typeof value === "string" && value.match(/^[\w\s\-&]+$/) !== null,

  purchaseDate: (value: unknown): boolean =>
    typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/) !== null,

  purchaseTime: (value: unknown): boolean =>
    typeof value === "string" &&
    value.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/) !== null,

  total: (value: unknown): boolean =>
    typeof value === "string" && value.match(/^\d+\.\d{2}$/) !== null,

  items: (value: unknown): boolean =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => validateItem(item)),
};

// more validation rules but for POST'd items in the receipt JSON
const itemValidationRules: Record<keyof Item, Validator> = {
  shortDescription: (value: unknown): boolean =>
    typeof value === "string" && value.match(/^[\w\s-]+$/) !== null,

  price: (value: unknown): boolean =>
    typeof value === "string" && value.match(/^\d+\.\d{2}$/) !== null,
};

function validateReceipt(data: unknown): data is Receipt {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const requiredProps = Object.keys(validationRules) as Array<keyof Receipt>;
  for (const prop of requiredProps) {
    if (!(prop in data)) {
      return false;
    }
  }

  const receiptData = data as Record<keyof Receipt, unknown>;

  return requiredProps.every((prop) =>
    validationRules[prop](receiptData[prop])
  );
}

function validateItem(item: unknown): item is Item {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  const requiredItemProps = Object.keys(itemValidationRules) as Array<
    keyof Item
  >;
  for (const prop of requiredItemProps) {
    if (!(prop in item)) {
      return false;
    }
  }

  const itemData = item as Record<keyof Item, unknown>;

  return requiredItemProps.every((prop) =>
    itemValidationRules[prop](itemData[prop])
  );
}
