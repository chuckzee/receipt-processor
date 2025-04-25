import request from "supertest";
import express from "express";
import ReceiptsRouter from "./Receipts.routes";
import { Receipt } from "../interfaces/Receipts";
import ReceiptsService from "../services/Receipts";

jest.mock("../services/Receipts");
const mockProcessReceipt = ReceiptsService.processReceipt as jest.Mock;
const mockSaveResult = ReceiptsService.saveResult as jest.Mock;
const mockGetResult = ReceiptsService.getResult as jest.Mock;

jest.mock("../middleware/receiptsMiddleware", () => ({
  __esModule: true,
  validateReceiptMiddleware: jest.fn((req, res, next) => next()),
  validatePointsRequestMiddleware: jest.fn((req, res, next) => next()),
}));

describe("Receipt Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/receipts", ReceiptsRouter);
    
    mockProcessReceipt.mockReturnValue({ points: 100 });
    mockSaveResult.mockReturnValue("abcd-1234-hire-chuck-at-fetch");
    mockGetResult.mockImplementation((id) => {
      if (id === "abcd-1234-hire-chuck-at-fetch") {
        return { points: 100 };
      }
      return null;
    });
    
    jest.clearAllMocks();
  });

  describe("POST /receipts/process", () => {
    const validReceipt: Receipt = {
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

    test("should process a valid receipt and return an ID", async () => {
      const response = await request(app)
        .post("/receipts/process")
        .send(validReceipt)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(mockProcessReceipt).toHaveBeenCalledTimes(1);
      expect(mockSaveResult).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: "abcd-1234-hire-chuck-at-fetch" });
    });

    test("should return 500 if server side failure", async () => {
      mockProcessReceipt.mockImplementation(() => {
        throw new Error("Processing failed");
      });

      const response = await request(app)
        .post("/receipts/process")
        .send(validReceipt)
        .expect("Content-Type", /json/)
        .expect(500);

      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("GET /receipts/:id/points", () => {
    test("should return points for a valid receipt ID", async () => {
      mockGetResult.mockReturnValue({ points: 100 });
      
      const response = await request(app)
        .get("/receipts/abcd-1234-hire-chuck-at-fetch/points")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(mockGetResult).toHaveBeenCalledWith("abcd-1234-hire-chuck-at-fetch");
      expect(response.body).toEqual({ points: 100 });
    });

    test("should return 404 for non-existent receipt ID", async () => {
      mockGetResult.mockReturnValue(null);
      
      const response = await request(app)
        .get("/receipts/some-super-fake-id-hi-fetch/points")
        .expect("Content-Type", /json/)
        .expect(404);

      expect(mockGetResult).toHaveBeenCalledWith("some-super-fake-id-hi-fetch");
      expect(response.body).toEqual({ error: "No receipt found for that ID." });
    });
  });
});
