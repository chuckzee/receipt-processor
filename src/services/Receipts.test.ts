import { processReceipt } from "./Receipts";
import { Receipt } from "../interfaces/Receipts";
import exampleReceipt from "../mock/example.json";
import exampleReceipt2 from "../mock/example2.json";
import weirdExampleReceipt from "../mock/weirdExample.json";
import simpleReceipt from "../mock/simple-receipt.json";
import morningReceipt from "../mock/morning-receipt.json";

describe("Receipts Service", () => {
  describe("processReceipt", () => {
    it("should calculate the correct points for the example receipt", () => {
      const result = processReceipt(exampleReceipt as Receipt);

      expect(result.points).toBe(28);
    });

    it("should calculate the correct points for the example receipt 2", () => {
      const result = processReceipt(exampleReceipt2 as Receipt);

      expect(result.points).toBe(109);
    });

    it("should calculate the correct points for the weird example receipt", () => {
      const result = processReceipt(weirdExampleReceipt as Receipt);

      expect(result.points).toBe(14);
    });

    it("should calculate the correct points for the simple receipt", () => {
      const result = processReceipt(simpleReceipt as Receipt);

      expect(result.points).toBe(31);
    });

    it("should calculate the correct points for the morning receipt", () => {
      const result = processReceipt(morningReceipt as Receipt);

      expect(result.points).toBe(15);
    });
  });
});
