import { BadRequestException } from '@nestjs/common';
import {
  validateAdjustStockBody,
  validateListInventoryMovementsQuery,
  validateListInventoryQuery,
  validateTransferStockBody,
  validateVariantInventoryParams,
} from './inventory.validation';

describe('inventory validation', () => {
  const variantId = '018f4dc4-5f51-7c55-9b8f-15fbdd99b601';
  const rackId = '018f4dc4-5f51-7c55-9b8f-15fbdd99b701';
  const destinationRackId = '018f4dc4-5f51-7c55-9b8f-15fbdd99b702';

  it('accepts list inventory filters', () => {
    expect(
      validateListInventoryQuery({
        page: '2',
        pageSize: '25',
        query: ' SKU-12345 ',
        warehouseId: variantId,
        rackId,
      }),
    ).toEqual({
      page: 2,
      pageSize: 25,
      query: 'SKU-12345',
      warehouseId: variantId,
      rackId,
    });
  });

  it('accepts list inventory movements filters', () => {
    expect(
      validateListInventoryMovementsQuery({
        page: '1',
        pageSize: '50',
        rackId,
      }),
    ).toEqual({
      page: 1,
      pageSize: 50,
      rackId,
    });
  });

  it('rejects non-positive adjustment quantities', () => {
    expect(() =>
      validateAdjustStockBody({
        variantId,
        rackId,
        movementType: 'ADJUSTMENT_IN',
        quantity: 0,
        reason: 'Cycle count',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects invalid adjustment movement types', () => {
    expect(() =>
      validateAdjustStockBody({
        variantId,
        rackId,
        movementType: 'TRANSFER',
        quantity: 2,
        reason: 'Cycle count',
      }),
    ).toThrow(BadRequestException);
  });

  it('accepts valid transfers', () => {
    expect(
      validateTransferStockBody({
        variantId,
        sourceRackId: rackId,
        destinationRackId,
        quantity: 4,
        reason: 'Rebalance',
        comments: ' Move to picking zone ',
      }),
    ).toEqual({
      variantId,
      sourceRackId: rackId,
      destinationRackId,
      quantity: 4,
      reason: 'Rebalance',
      comments: ' Move to picking zone ',
    });
  });

  it('rejects transfers within the same rack', () => {
    expect(() =>
      validateTransferStockBody({
        variantId,
        sourceRackId: rackId,
        destinationRackId: rackId,
        quantity: 4,
        reason: 'Rebalance',
      }),
    ).toThrow(BadRequestException);
  });

  it('accepts valid variant params', () => {
    expect(validateVariantInventoryParams({ variantId })).toEqual({ variantId });
  });
});
