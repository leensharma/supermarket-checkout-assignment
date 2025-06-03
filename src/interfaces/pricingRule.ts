export interface IPricingRuleDocument {
  sku: string;
  unitPrice: number;
  specialPrice?: {
    quantity: number;
    totalPrice: number;
  };
}
