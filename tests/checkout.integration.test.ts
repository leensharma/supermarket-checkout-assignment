import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { checkoutRouter } from '../src/routes/checkout.route';
import { PricingRule } from '../src/models/pricingRule';

const app = express();
app.use(express.json());
app.use('/checkout', checkoutRouter);

describe('Checkout Router Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_checkout_' + Date.now());
  });

  beforeEach(async () => {
    // Clear and initialize fresh test data
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }

    await PricingRule.create([
      {
        sku: 'A',
        unitPrice: 50,
        specialPrice: { quantity: 3, totalPrice: 130 },
      },
      {
        sku: 'B',
        unitPrice: 30,
      },
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('Special Pricing', () => {
    it('should apply 3-for-130 pricing correctly', async () => {
      // Scan 3 items
      await request(app).post('/checkout/scan').send({ sku: 'A' });
      await request(app).post('/checkout/scan').send({ sku: 'A' });
      await request(app).post('/checkout/scan').send({ sku: 'A' });

      // Add small delay if needed (only for debugging)
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check total
      const response = await request(app).get('/checkout/total');

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(130);
    });
  });
});
