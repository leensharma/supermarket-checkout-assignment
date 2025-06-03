import express from 'express';
import { CheckoutController } from '../controllers/checkout.controller';

const router = express.Router();

const checkoutController = new CheckoutController();

router.post('/scan', checkoutController.scanItem);
router.get('/total', checkoutController.getTotal);
router.post('/reset', checkoutController.resetCheckout);

export { router as checkoutRouter };
