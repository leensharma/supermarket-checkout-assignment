import { Model } from 'mongoose';
import { IPricingRuleDocument } from '../interfaces/pricingRule';
import { PricingRule } from '../models/pricingRule';

export class PricingRuleService {
  constructor(private RuleModel: Model<IPricingRuleDocument>) {}

  async getPricingRules(): Promise<IPricingRuleDocument[]> {
    return await PricingRule.find({}).select('sku unitPrice specialPrice');
  }

  async getPricingRulesBySku(sku: string): Promise<IPricingRuleDocument | null> {
    return await PricingRule.findOne({ sku }).select('sku unitPrice specialPrice');
  }
}
