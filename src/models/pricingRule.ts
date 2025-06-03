import mongoose, { Schema } from 'mongoose';
import { IPricingRuleDocument } from '../interfaces/pricingRule';

const SpecialPriceSchema = new Schema(
  {
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    totalPrice: {
      type: Number,
      require: true,
      min: 0,
    },
  },
  { _id: false },
);

const PricingRuleSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    specialPrice: {
      type: SpecialPriceSchema,
      required: false,
    },
  },
  { timestamps: true },
);

export const PricingRule = mongoose.model<IPricingRuleDocument>('PricingRule', PricingRuleSchema);
