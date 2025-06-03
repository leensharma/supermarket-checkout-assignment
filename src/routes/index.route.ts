import express from 'express';
import { checkoutRouter } from './checkout.route';

const router = express.Router();

router.use('/checkout', checkoutRouter);

export { router as indexRouter };
