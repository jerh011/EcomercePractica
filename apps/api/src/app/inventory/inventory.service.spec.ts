jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { BadRequestException } from '@nestjs/common';
import { PaginationService } from '../common/pagination/pagination.service';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  const variantId = '018f4dc4-5f51-7c55-9b8f-15fbdd99b601';
  const sourceRackId = '018f4dc4-5f51-7c55-9b8f-15fbdd99b701';
  const destinationRackId = '018f4dc4-5f51-7c55-9b8f-15fbdd99b702';

  let queryRawUnsafe: jest.Mock;
  let executeRawUnsafe: jest.Mock;
  let transaction: jest.Mock;
  let service: InventoryService;

  beforeEach(() => {
    queryRawUnsafe = jest.fn();
    executeRawUnsafe = jest.fn();
    transaction = jest.fn();

    service = new InventoryService(
      {
        client: {
          $queryRawUnsafe: queryRawUnsafe,
          $executeRawUnsafe: executeRawUnsafe,
          $transaction: transaction,
        },
      } as never,
      new PaginationService(),
    );
  });

  it('returns zeroed derived stock map defaults when no allocations exist', async () => {
    queryRawUnsafe.mockResolvedValueOnce([]);

    await expect(
      service.loadVariantStockMap([variantId, '018f4dc4-5f51-7c55-9b8f-15fbdd99b602']),
    ).resolves.toEqual(
      new Map([
        [variantId, 0],
        ['018f4dc4-5f51-7c55-9b8f-15fbdd99b602', 0],
      ]),
    );
  });

  it('uses camelCase user columns in inventory movement queries', async () => {
    queryRawUnsafe
      .mockResolvedValueOnce([{ id: variantId }])
      .mockResolvedValueOnce([
        {
          id: 'movement-1',
          movementType: 'ADJUSTMENT_IN',
          quantity: 2,
          reason: 'Cycle count',
          comments: null,
          createdAt: new Date('2026-05-13T17:00:00.000Z'),
          variantId,
          sku: 'SKU-12345',
          minimumStock: 1,
          performedByUserName: 'Admin User',
        },
      ])
      .mockResolvedValueOnce([{ totalCount: 1 }]);

    const result = await service.listInventoryMovements(variantId, {
      page: 1,
      pageSize: 10,
    });

    const movementSql = queryRawUnsafe.mock.calls[1]?.[0] as string;
    expect(movementSql).toContain('u."firstName"');
    expect(movementSql).toContain('u."lastName"');
    expect(movementSql).not.toContain('u.first_name');
    expect(result.movements.totalCount).toBe(1);
  });

  it('rejects stock adjustments that would make an allocation negative', async () => {
    queryRawUnsafe
      .mockResolvedValueOnce([{ id: variantId }])
      .mockResolvedValueOnce([{ id: sourceRackId }]);

    transaction.mockImplementation(async (callback) =>
      callback({
        $queryRawUnsafe: jest.fn().mockResolvedValueOnce([{ quantity: 2 }]),
        $executeRawUnsafe: jest.fn(),
      }),
    );

    await expect(
      service.adjustStock({
        variantId,
        rackId: sourceRackId,
        movementType: 'ADJUSTMENT_OUT',
        quantity: 3,
        reason: 'Cycle count',
      }),
    ).rejects.toEqual(
      new BadRequestException(
        'validation error: insufficient stock in the source rack',
      ),
    );
  });

  it('transfers stock atomically between allocations and returns derived stock', async () => {
    queryRawUnsafe
      .mockResolvedValueOnce([{ id: variantId }])
      .mockResolvedValueOnce([{ id: sourceRackId }])
      .mockResolvedValueOnce([{ id: destinationRackId }]);

    const txQuery = jest
      .fn()
      .mockResolvedValueOnce([{ quantity: 10 }])
      .mockResolvedValueOnce([{ quantity: 3 }])
      .mockResolvedValueOnce([{ exists: 1 }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ stockQuantity: 13 }]);
    const txExecute = jest.fn().mockResolvedValue(undefined);

    transaction.mockImplementation(async (callback) =>
      callback({
        $queryRawUnsafe: txQuery,
        $executeRawUnsafe: txExecute,
      }),
    );

    await expect(
      service.transferStock({
        variantId,
        sourceRackId,
        destinationRackId,
        quantity: 4,
        reason: 'Rebalance',
      }),
    ).resolves.toEqual({
      result: {
        variantId,
        stockQuantity: 13,
        sourceRackId,
        destinationRackId,
      },
    });

    expect(txExecute).toHaveBeenCalledTimes(3);
    expect((txExecute.mock.calls[2]?.[0] as string)).toContain(
      'INSERT INTO inventory_movements',
    );
  });
});
