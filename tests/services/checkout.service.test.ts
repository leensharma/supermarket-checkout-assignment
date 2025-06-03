import { CheckoutService } from '../../src/services/checkout.service';
import { PricingRuleService } from '../../src/services/pricing.service';
import { PricingRule } from '../../src/models/pricingRule';
import mongoose from 'mongoose';
import { IPricingRuleDocument } from '../../src/interfaces/pricingRule';

describe('CheckoutService', () => {
  let checkoutService: CheckoutService;
  let pricingRuleService: PricingRuleService;
  let testRules: IPricingRuleDocument[];

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_checkout');
    pricingRuleService = new PricingRuleService(PricingRule);

    testRules = [
      { sku: 'A', unitPrice: 50, specialPrice: { quantity: 3, totalPrice: 130 } },
      { sku: 'B', unitPrice: 30, specialPrice: { quantity: 2, totalPrice: 45 } },
      { sku: 'C', unitPrice: 20 },
      { sku: 'D', unitPrice: 15 },
    ];
    await PricingRule.insertMany(testRules);
  });

  beforeEach(() => {
    checkoutService = new CheckoutService(pricingRuleService);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('scan', () => {
    it('should load pricing rules on first scan', async () => {
      await checkoutService.scan('A');
      expect(checkoutService['rulesLoaded']).toBe(true);
      expect(checkoutService['pricingRules'].length).toBe(4);
    });

    it('should throw if invalid SKU is scanned after rules loaded', async () => {
      await checkoutService.scan('A'); // Loads rules
      await expect(checkoutService.scan('INVALID')).rejects.toThrow(
        'Item not found in pricing rules: INVALID',
      );
    });

    it('should throw if invalid SKU is scanned before rules loaded', async () => {
      await expect(checkoutService.scan('INVALID')).rejects.toThrow(
        'Item not found in pricing rules: INVALID',
      );
    });

    it('should allow scanning valid SKUs', async () => {
      await expect(checkoutService.scan('A')).resolves.not.toThrow();
      await expect(checkoutService.scan('B')).resolves.not.toThrow();
      await expect(checkoutService.scan('C')).resolves.not.toThrow();
      await expect(checkoutService.scan('D')).resolves.not.toThrow();
    });
  });

  describe('total', () => {
    it('should calculate total for mixed items with special pricing', async () => {
      // 3A (130) + 2B (45) + 1C (20) = 195
      await checkoutService.scan('A');
      await checkoutService.scan('A');
      await checkoutService.scan('A');
      await checkoutService.scan('B');
      await checkoutService.scan('B');
      await checkoutService.scan('C');

      expect(await checkoutService.total()).toBe(195);
    });

    it('should calculate total with exact special pricing quantities', async () => {
      // 6A (130*2) + 4B (45*2) = 260 + 90 = 350
      for (let i = 0; i < 6; i++) await checkoutService.scan('A');
      for (let i = 0; i < 4; i++) await checkoutService.scan('B');

      expect(await checkoutService.total()).toBe(350);
    });

    it('should calculate total with quantities just below special pricing threshold', async () => {
      // 2A (50*2) + 1B (30) = 100 + 30 = 130
      await checkoutService.scan('A');
      await checkoutService.scan('A');
      await checkoutService.scan('B');

      expect(await checkoutService.total()).toBe(130);
    });

    it('should calculate total without special pricing', async () => {
      // 2C (20*2) + 3D (15*3) = 40 + 45 = 85
      await checkoutService.scan('C');
      await checkoutService.scan('C');
      await checkoutService.scan('D');
      await checkoutService.scan('D');
      await checkoutService.scan('D');
      expect(await checkoutService.total()).toBe(85);
    });

    // it('should return 0 when no items scanned', async () => {
    //   // Force rules to be loaded without scanning
    //   checkoutService['rulesLoaded'] = true;
    //   checkoutService['pricingRules'] = testRules;

    //   expect(await checkoutService.total()).toBe(0);
    // });

    it('should throw if called before scanning items', async () => {
      await expect(checkoutService.total()).rejects.toThrow(
        'Pricing rules not loaded. Scan items first.',
      );
    });

    it('should handle items with no special price correctly', async () => {
      // 4D (15*4) = 60
      await checkoutService.scan('D');
      await checkoutService.scan('D');
      await checkoutService.scan('D');
      await checkoutService.scan('D');
      expect(await checkoutService.total()).toBe(60);
    });
  });

  describe('reset', () => {
    it('should clear all scanned items and reset state', async () => {
      await checkoutService.scan('A');
      await checkoutService.scan('B');
      checkoutService.reset();

      expect(checkoutService['scannedItems']).toEqual([]);
      expect(checkoutService['rulesLoaded']).toBe(false);
      await expect(checkoutService.total()).rejects.toThrow(
        'Pricing rules not loaded. Scan items first.',
      );
    });

    it('should allow scanning items after reset', async () => {
      await checkoutService.scan('A');
      checkoutService.reset();
      await checkoutService.scan('B');

      expect(checkoutService['scannedItems']).toEqual(['B']);
      expect(await checkoutService.total()).toBe(30);
    });
  });
});
