import { Request, Response } from 'express';
import { CheckoutService } from '../services/checkout.service';
import { PricingRule } from '../models/pricingRule';
import { PricingRuleService } from '../services/pricing.service';

export class CheckoutController {
  private checkoutService: CheckoutService;
  private pricingService: PricingRuleService;

  constructor() {
    this.pricingService = new PricingRuleService(PricingRule);
    this.checkoutService = new CheckoutService(this.pricingService);
  }

  scanItem = async (req: Request, res: Response) => {
    const { sku } = req.body;

    if (!sku) {
      return res.status(400).json({ message: 'SKU is required' });
    }

    // Now use this.pricingService, not pricingService
    const skuExist = await this.pricingService.getPricingRulesBySku(sku);
    if (!skuExist) {
      return res.status(400).json({ status: 400, message: 'Invalid SKU' });
    }

    await this.checkoutService.scan(sku);
    res.status(200).json({ status: 200, success: true, message: `Item ${sku} scanned` });
  };

  getTotal = async (req: Request, res: Response) => {
    const total = await this.checkoutService.total();

    res.status(200).json({ status: 200, total });
  };

  resetCheckout = async (req: Request, res: Response) => {
    this.checkoutService.reset();
    res.json({ message: 'Checkout reset' });
  };
}
