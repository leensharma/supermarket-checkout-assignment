import { CheckoutController } from '../../src/controllers/checkout.controller';
import { Request, Response } from 'express';
import { IPricingRuleDocument } from '../../src/interfaces/pricingRule';

// 1. Define mock service types
type MockedCheckoutService = {
  scan: jest.Mock<Promise<void>, [sku: string]>;
  total: jest.Mock<Promise<number>, []>;
  reset: jest.Mock<void, []>;
};

type MockedPricingRuleService = {
  getPricingRule: jest.Mock<Promise<IPricingRuleDocument | null>, [sku: string]>;
  // Add other methods if used
};

describe('CheckoutController', () => {
  let controller: CheckoutController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockCheckoutService: MockedCheckoutService;
  let mockPricingService: MockedPricingRuleService;

  beforeEach(() => {
    mockPricingService = {
      getPricingRule: jest.fn().mockResolvedValue({
        sku: 'A',
        unitPrice: 50,
        specialPrice: { quantity: 3, totalPrice: 130 },
      }),
      // Mock other methods if used
    };

    mockCheckoutService = {
      scan: jest.fn().mockResolvedValue(undefined),
      total: jest.fn().mockResolvedValue(130),
      reset: jest.fn(),
    };

    // 4. Instantiate controller with mocked services
    controller = new CheckoutController();
    (controller as any).checkoutService = mockCheckoutService;
    (controller as any).pricingRuleService = mockPricingService;

    // 5. Setup Express mock objects
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTotal()', () => {
    it('should return correct total', async () => {
      mockRequest = {};

      await controller.getTotal(mockRequest as Request, mockResponse as Response);

      expect(mockCheckoutService.total).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({ status: 200, total: 130 });
    });
  });

  describe('resetCheckout()', () => {
    it('should reset checkout state', async () => {
      mockRequest = {};

      await controller.resetCheckout(mockRequest as Request, mockResponse as Response);

      expect(mockCheckoutService.reset).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Checkout reset',
      });
    });
  });
});
