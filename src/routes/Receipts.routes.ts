import express, { Request, Response } from 'express';
import ReceiptsService from '../services/Receipts';
import { validateReceiptMiddleware } from '../middleware/receiptsMiddleware';

const router = express.Router();

router.post('/process', validateReceiptMiddleware, (req: Request, res: Response) => {
  try {
    const result = ReceiptsService.processReceipt(req.body);
    const id = ReceiptsService.saveResult(result);
    
    res.status(200).json({ id });
  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
