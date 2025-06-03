import mongoose from 'mongoose';
import { PricingRuleService } from '../../src/services/pricing.service';
import { PricingRule } from '../../src/models/pricingRule';
import { IPricingRuleDocument } from '../../src/interfaces/pricingRule';

describe('PricingRuleService', () => {
  let service: PricingRuleService;
  let testRules: IPricingRuleDocument[];

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_checkout', {
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    });
    service = new PricingRuleService(PricingRule);

    // Test data
    testRules = [
      { sku: 'A', unitPrice: 50, specialPrice: { quantity: 3, totalPrice: 130 } },
      { sku: 'B', unitPrice: 30, specialPrice: { quantity: 2, totalPrice: 45 } },
      { sku: 'C', unitPrice: 20 },
    ];
    await PricingRule.insertMany(testRules);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('getPricingRules', () => {
    it('should return all pricing rules with correct fields', async () => {
      const rules = await service.getPricingRules();

      expect(rules.length).toBe(3);
      expect(rules[0]).toMatchObject({
        sku: 'A',
        unitPrice: 50,
        specialPrice: { quantity: 3, totalPrice: 130 },
      });
    });
  });

  describe('getPricingRulesBySku', () => {
    it('should return correct rule for existing SKU', async () => {
      const rule = await service.getPricingRulesBySku('B');

      expect(rule).toMatchObject({
        sku: 'B',
        unitPrice: 30,
        specialPrice: { quantity: 2, totalPrice: 45 },
      });
    });

    it('should return null for non-existent SKU', async () => {
      const rule = await service.getPricingRulesBySku('INVALID');
      expect(rule).toBeNull();
    });
  });
});
