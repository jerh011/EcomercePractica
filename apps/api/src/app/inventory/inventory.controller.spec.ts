jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

describe('InventoryController', () => {
  let controller: InventoryController;
  let inventoryService: {
    listInventory: jest.Mock;
    getInventoryDetail: jest.Mock;
    getInventoryDistribution: jest.Mock;
    listInventoryMovements: jest.Mock;
    adjustStock: jest.Mock;
    transferStock: jest.Mock;
  };

  const variantId = '018f4dc4-5f51-7c55-9b8f-15fbdd99b601';
  const rackId = '018f4dc4-5f51-7c55-9b8f-15fbdd99b701';

  beforeEach(async () => {
    inventoryService = {
      listInventory: jest.fn(),
      getInventoryDetail: jest.fn(),
      getInventoryDistribution: jest.fn(),
      listInventoryMovements: jest.fn(),
      adjustStock: jest.fn(),
      transferStock: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [{ provide: InventoryService, useValue: inventoryService }],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
  });

  it('validates and forwards inventory list input', async () => {
    inventoryService.listInventory.mockResolvedValue({ items: [], totalCount: 0, totalPages: 0 });

    await controller.listInventory({
      page: '2',
      pageSize: '20',
      query: ' SKU-12345 ',
      rackId,
    } as never);

    expect(inventoryService.listInventory).toHaveBeenCalledWith({
      page: 2,
      pageSize: 20,
      query: 'SKU-12345',
      warehouseId: undefined,
      rackId,
    });
  });

  it('loads variant movements using validated params', async () => {
    inventoryService.listInventoryMovements.mockResolvedValue({
      movements: { movements: [], totalCount: 0, totalPages: 0 },
    });

    await controller.getVariantMovements(
      { variantId },
      { page: '1', pageSize: '10', rackId } as never,
    );

    expect(inventoryService.listInventoryMovements).toHaveBeenCalledWith(
      variantId,
      { page: 1, pageSize: 10, rackId },
    );
  });

  it('forwards validated stock adjustments', async () => {
    inventoryService.adjustStock.mockResolvedValue({
      result: { variantId, stockQuantity: 7, destinationRackId: rackId },
    });

    await controller.adjustStock({
      variantId,
      rackId,
      movementType: 'ADJUSTMENT_IN',
      quantity: 3,
      reason: 'Cycle count',
    });

    expect(inventoryService.adjustStock).toHaveBeenCalledWith({
      variantId,
      rackId,
      movementType: 'ADJUSTMENT_IN',
      quantity: 3,
      reason: 'Cycle count',
      comments: undefined,
    });
  });
});
