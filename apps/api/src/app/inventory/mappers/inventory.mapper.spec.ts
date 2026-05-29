import {
  normalizeAttributes,
  toAvailabilityStatus,
  toDistributionStatus,
  toInventoryListItemDto,
  toInventoryMovementDto,
  toInventoryVariantDetailDto,
} from './inventory.mapper';

describe('inventory mapper', () => {
  it('derives availability status from derived stock totals', () => {
    expect(toAvailabilityStatus(0, 2)).toBe('OUT_OF_STOCK');
    expect(toAvailabilityStatus(2, 2)).toBe('LOW_STOCK');
    expect(toAvailabilityStatus(5, 2)).toBe('AVAILABLE');
  });

  it('derives distribution status from rack spread', () => {
    expect(toDistributionStatus(true)).toBe('DISTRIBUTED');
    expect(toDistributionStatus(false)).toBe('SINGLE_RACK');
  });

  it('filters invalid attributes from aggregated json', () => {
    expect(
      normalizeAttributes([
        { id: 'a1', name: 'Color', slug: 'color' },
        { id: 'a2', name: 'Size' },
        null,
      ]),
    ).toEqual([{ id: 'a1', name: 'Color', slug: 'color' }]);
  });

  it('maps inventory list items with derived statuses', () => {
    const dto = toInventoryListItemDto({
      variantId: 'variant-1',
      sku: 'SKU-12345',
      minimumStock: 2,
      productId: 'product-1',
      productName: 'Producto',
      productSlug: 'producto',
      stockQuantity: 2,
      warehousesWithStock: 1,
      rackCountWithStock: 2,
      lastMovementAt: new Date('2026-05-13T17:00:00.000Z'),
      attributes: [{ id: 'a1', name: 'Color', slug: 'color' }],
    });

    expect(dto.availabilityStatus).toBe('LOW_STOCK');
    expect(dto.distributionStatus).toBe('DISTRIBUTED');
    expect(dto.distributed).toBe(true);
  });

  it('maps inventory movements with optional rack endpoints', () => {
    const dto = toInventoryMovementDto({
      id: 'movement-1',
      movementType: 'TRANSFER',
      quantity: 3,
      reason: 'Rebalance',
      comments: null,
      createdAt: new Date('2026-05-13T17:00:00.000Z'),
      variantId: 'variant-1',
      sku: 'SKU-12345',
      minimumStock: 2,
      sourceRackId: 'rack-1',
      sourceRackCode: 'A-01',
      sourceRackDescription: 'Primary',
      sourceWarehouseId: 'warehouse-1',
      sourceWarehouseName: 'Main',
      sourceWarehouseCode: 'MEX-CEN',
      destinationRackId: 'rack-2',
      destinationRackCode: 'B-03',
      destinationRackDescription: null,
      destinationWarehouseId: 'warehouse-1',
      destinationWarehouseName: 'Main',
      destinationWarehouseCode: 'MEX-CEN',
      performedByUserName: 'Admin User',
    });

    expect(dto.sourceRack?.warehouse.code).toBe('MEX-CEN');
    expect(dto.destinationRack?.code).toBe('B-03');
    expect(dto.performedByUserName).toBe('Admin User');
  });

  it('maps inventory variant detail with derived availability', () => {
    const dto = toInventoryVariantDetailDto({
      variant: {
        id: 'variant-1',
        sku: 'SKU-12345',
        minimumStock: 1,
        barcodeGtin: '96385074',
        price: '199.5',
      },
      product: {
        id: 'product-1',
        name: 'Producto',
        slug: 'producto',
      },
      attributes: [{ id: 'a1', name: 'Color', slug: 'color' }],
      stockQuantity: 4,
      warehousesWithStock: 2,
      distributed: true,
      recentMovements: [],
    });

    expect(dto.availabilityStatus).toBe('AVAILABLE');
    expect(dto.distributed).toBe(true);
    expect(dto.productName).toBe('Producto');
  });
});
