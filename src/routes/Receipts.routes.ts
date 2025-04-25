import express, { Request, Response } from "express";
import ReceiptsService from "../services/Receipts";
import {
  validateReceiptMiddleware,
  validatePointsRequestMiddleware,
} from "../middleware/receiptsMiddleware";

const router = express.Router();

router.post(
  "/process",
  validateReceiptMiddleware,
  (req: Request, res: Response) => {
    try {
      const result = ReceiptsService.processReceipt(req.body);
      const id = ReceiptsService.saveResult(result);

      res.status(200).json({ id });
    } catch (error) {
      console.error("Error processing receipt: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/:id/points",
  validatePointsRequestMiddleware,
  (req: Request, res: Response) => {
    const { id } = req.params;
    const result = ReceiptsService.getResult(id);
    
    if (!result) {
      res.status(404).json({ error: "No receipt found for that ID." });
      return;
    }
    
    res.status(200).json({ points: result.points });
  }
);

export default router;
