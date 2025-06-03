import { IPricingRuleDocument } from '../interfaces/pricingRule';
import { PricingRuleService } from './pricing.service';

export class CheckoutService {
  private scannedItems: string[] = [];
  private pricingRules: IPricingRuleDocument[] = [];
  private rulesLoaded = false;

  constructor(private pricingRuleService: PricingRuleService) {}

  async scan(sku: string): Promise<void> {
    if (!this.rulesLoaded) {
      this.pricingRules = await this.pricingRuleService.getPricingRules();
      this.rulesLoaded = true;
    }

    // Check if SKU exists in pricing rules
    if (!this.pricingRules.some((rule) => rule.sku === sku)) {
      throw new Error(`Item not found in pricing rules: ${sku}`);
    }

    this.scannedItems.push(sku);
  }

  async total(): Promise<number> {
    if (!this.rulesLoaded) {
      throw new Error('Pricing rules not loaded. Scan items first.');
    }

    const itemCounts = this.countItems();
    return this.calculateTotal(itemCounts);
  }

  private countItems(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.scannedItems.forEach((sku) => {
      counts[sku] = (counts[sku] || 0) + 1;
    });
    return counts;
  }

  private calculateTotal(itemCounts: Record<string, number>): number {
    let total = 0;

    for (const [sku, count] of Object.entries(itemCounts)) {
      const item = this.pricingRules.find((rule) => rule.sku === sku);

      if (!item) continue;

      if (item.specialPrice && count >= item.specialPrice.quantity) {
        total += this.applySpecialPricing(item, count);
      } else {
        total += count * item.unitPrice;
      }
    }
    return total;
  }

  private applySpecialPricing(item: IPricingRuleDocument, count: number): number {
    const specialGroups = Math.floor(count / item.specialPrice!.quantity);

    const remainingItems = count % item.specialPrice!.quantity;

    return specialGroups * item.specialPrice!.totalPrice + remainingItems * item.unitPrice;
  }

  reset(): void {
    this.scannedItems = [];
    this.rulesLoaded = false;
  }
}
