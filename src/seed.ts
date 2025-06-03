import { PricingRule } from './models/pricingRule';
import mongoose from 'mongoose';

export async function seedDatabase() {
  try {
    await PricingRule.deleteMany({});

    await PricingRule.insertMany([
      {
        sku: 'A',
        unitPrice: 50,
        specialPrice: { quantity: 3, totalPrice: 130 },
      },
      {
        sku: 'B',
        unitPrice: 30,
        specialPrice: { quantity: 2, totalPrice: 45 },
      },
      { sku: 'C', unitPrice: 20 },
      { sku: 'D', unitPrice: 15 },
    ]);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

export const clearDatabase = async () => {
  await PricingRule.deleteMany({});
  await mongoose.connection.close();
};
