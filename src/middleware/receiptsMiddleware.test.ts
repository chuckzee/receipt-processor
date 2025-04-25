import {
  validateReceiptMiddleware,
  validatePointsRequestMiddleware,
} from "./receiptsMiddleware";
import { Request, Response, NextFunction } from "express";

jest.mock("../services/Receipts", () => ({
  // this satisfies linting
  __esModule: true,
  default: {
    getResult: jest.fn((id) => {
      if (id === "abcd-1234-hire-chuck-at-fetch") {
        return { points: 100 };
      } else {
        return null;
      }
    }),
  },
}));

describe("validateReceiptMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  test("passes validation with valid receipt data", () => {
    mockRequest.body = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        {
          shortDescription: "Mountain Dew 12PK",
          price: "6.49",
        },
      ],
      total: "6.49",
    };

    validateReceiptMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test("fails validation with missing required field", () => {
    mockRequest.body = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        {
          shortDescription: "Mountain Dew 12PK",
          price: "6.49",
        },
      ],
    };

    validateReceiptMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "The receipt is invalid.",
    });
  });

  test("fails validation with invalid retailer format", () => {
    mockRequest.body = {
      retailer: "T@rg#t!!!*",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        {
          shortDescription: "Mountain Dew 12PK",
          price: "6.49",
        },
      ],
      total: "6.49",
    };

    validateReceiptMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "The receipt is invalid.",
    });
  });

  test("fails validation with invalid date format", () => {
    mockRequest.body = {
      retailer: "Target",
      purchaseDate: "01/01/2022",
      purchaseTime: "13:01",
      items: [
        {
          shortDescription: "Mountain Dew 12PK",
          price: "6.49",
        },
      ],
      total: "6.49",
    };

    validateReceiptMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "The receipt is invalid.",
    });
  });

  test("fails validation with invalid item price format", () => {
    mockRequest.body = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        {
          shortDescription: "Mountain Dew 12PK",
          price: "6.5",
        },
      ],
      total: "6.50",
    };

    validateReceiptMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "The receipt is invalid.",
    });
  });

  test("fails validation with empty items array", () => {
    mockRequest.body = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [],
      total: "0.00",
    };

    validateReceiptMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "The receipt is invalid.",
    });
  });

  test("fails validation with no request body", () => {
    mockRequest.body = undefined;

    validateReceiptMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "The receipt is invalid.",
    });
  });
});

describe("validatePointsRequestMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();

    jest.clearAllMocks();
  });

  test("passes validation with valid receipt ID", () => {
    mockRequest.params = { id: "abcd-1234-hire-chuck-at-fetch" };

    validatePointsRequestMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test("fails validation with empty receipt ID", () => {
    mockRequest.params = { id: "" };

    validatePointsRequestMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "No receipt found for that ID.",
    });
  });

  test("fails validation with missing receipt ID", () => {
    mockRequest.params = {};

    validatePointsRequestMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "No receipt found for that ID.",
    });
  });

  test("fails validation with non-existent receipt ID", () => {
    mockRequest.params = { id: "chuck-fetch-chuck-fetch-chuck" };

    validatePointsRequestMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "No receipt found for that ID.",
    });
  });
});
