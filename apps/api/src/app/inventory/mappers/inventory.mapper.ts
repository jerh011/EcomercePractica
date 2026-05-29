import type { AttributeSummaryDto, ProductSummaryDto } from '@ecomercepractica/shared/contracts/common/dto/output/entity-summary.dto';
import type { InventoryDistributionRowDto } from '@ecomercepractica/shared/contracts/inventory/dto/output/inventory-distribution-row.dto';
import type { InventoryListItemDto } from '@ecomercepractica/shared/contracts/inventory/dto/output/inventory-list-item.dto';
import type { InventoryMovementDto } from '@ecomercepractica/shared/contracts/inventory/dto/output/inventory-movement.dto';
import type { InventoryVariantDetailDto } from '@ecomercepractica/shared/contracts/inventory/dto/output/inventory-variant-detail.dto';

type JsonAttribute = {
  id: string;
  name: string;
  slug: string;
};

export function toAvailabilityStatus(
  stockQuantity: number,
  minimumStock: number,
): 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' {
  if (stockQuantity <= 0) {
    return 'OUT_OF_STOCK';
  }

  if (stockQuantity <= minimumStock) {
    return 'LOW_STOCK';
  }

  return 'AVAILABLE';
}

export function toDistributionStatus(
  distributed: boolean,
): 'DISTRIBUTED' | 'SINGLE_RACK' {
  return distributed ? 'DISTRIBUTED' : 'SINGLE_RACK';
}

export function normalizeAttributes(
  value: unknown,
): AttributeSummaryDto[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is JsonAttribute =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as JsonAttribute).id === 'string' &&
        typeof (item as JsonAttribute).name === 'string' &&
        typeof (item as JsonAttribute).slug === 'string',
    )
    .map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
    }));
}

export function toInventoryListItemDto(row: {
  variantId: string;
  sku: string;
  minimumStock: number;
  productId: string;
  productName: string;
  productSlug: string;
  stockQuantity: number;
  warehousesWithStock: number;
  rackCountWithStock: number;
  lastMovementAt: Date | null;
  attributes: unknown;
}): InventoryListItemDto {
  const distributed = row.rackCountWithStock > 1;

  return {
    variant: {
      id: row.variantId,
      sku: row.sku,
      minimumStock: row.minimumStock,
    },
    product: {
      id: row.productId,
      name: row.productName,
      slug: row.productSlug,
    },
    attributes: normalizeAttributes(row.attributes),
    stockQuantity: row.stockQuantity,
    minimumStock: row.minimumStock,
    warehousesWithStock: row.warehousesWithStock,
    distributed,
    availabilityStatus: toAvailabilityStatus(
      row.stockQuantity,
      row.minimumStock,
    ),
    distributionStatus: toDistributionStatus(distributed),
    lastMovementAt: row.lastMovementAt ?? null,
  };
}

export function toInventoryMovementDto(row: {
  id: string;
  movementType: 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT' | 'TRANSFER';
  quantity: number;
  reason: string;
  comments: string | null;
  createdAt: Date | null;
  performedByUserId?: string | null;
  performedByUserName?: string | null;
  variantId: string;
  sku: string;
  minimumStock: number;
  sourceRackId?: string | null;
  sourceRackCode?: string | null;
  sourceRackDescription?: string | null;
  sourceWarehouseId?: string | null;
  sourceWarehouseName?: string | null;
  sourceWarehouseCode?: string | null;
  destinationRackId?: string | null;
  destinationRackCode?: string | null;
  destinationRackDescription?: string | null;
  destinationWarehouseId?: string | null;
  destinationWarehouseName?: string | null;
  destinationWarehouseCode?: string | null;
}): InventoryMovementDto {
  return {
    id: row.id,
    movementType: row.movementType,
    quantity: row.quantity,
    reason: row.reason,
    comments: row.comments ?? undefined,
    variant: {
      id: row.variantId,
      sku: row.sku,
      minimumStock: row.minimumStock,
    },
    sourceRack:
      row.sourceRackId && row.sourceRackCode && row.sourceWarehouseId
        ? {
            id: row.sourceRackId,
            code: row.sourceRackCode,
            description: row.sourceRackDescription ?? undefined,
            warehouse: {
              id: row.sourceWarehouseId,
              name: row.sourceWarehouseName ?? '',
              code: row.sourceWarehouseCode ?? '',
            },
          }
        : undefined,
    destinationRack:
      row.destinationRackId && row.destinationRackCode && row.destinationWarehouseId
        ? {
            id: row.destinationRackId,
            code: row.destinationRackCode,
            description: row.destinationRackDescription ?? undefined,
            warehouse: {
              id: row.destinationWarehouseId,
              name: row.destinationWarehouseName ?? '',
              code: row.destinationWarehouseCode ?? '',
            },
          }
        : undefined,
    performedByUserName: row.performedByUserName ?? undefined,
    createdAt: row.createdAt ?? null,
  };
}

export function toInventoryDistributionRowDto(row: {
  rackId: string;
  rackCode: string;
  rackDescription: string | null;
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  quantity: number;
  minimumStock: number;
  lastUpdatedAt: Date | null;
  lastMovementAt: Date | null;
  variantId: string;
  sku: string;
}): InventoryDistributionRowDto {
  return {
    rack: {
      id: row.rackId,
      code: row.rackCode,
      description: row.rackDescription ?? undefined,
      warehouse: {
        id: row.warehouseId,
        name: row.warehouseName,
        code: row.warehouseCode,
      },
    },
    variant: {
      id: row.variantId,
      sku: row.sku,
      minimumStock: row.minimumStock,
    },
    quantity: row.quantity,
    minimumStock: row.minimumStock,
    lastUpdatedAt: row.lastUpdatedAt ?? null,
    lastMovementAt: row.lastMovementAt ?? null,
  };
}

export function toInventoryVariantDetailDto(options: {
  variant: {
    id: string;
    sku: string;
    minimumStock: number;
    barcodeGtin?: string | null;
    price?: string | null;
  };
  product: ProductSummaryDto;
  attributes: AttributeSummaryDto[];
  stockQuantity: number;
  warehousesWithStock: number;
  distributed: boolean;
  recentMovements: InventoryMovementDto[];
}): InventoryVariantDetailDto {
  return {
    variant: {
      id: options.variant.id,
      sku: options.variant.sku,
      minimumStock: options.variant.minimumStock,
    },
    product: options.product,
    productName: options.product.name,
    variantName: options.variant.sku,
    barcodeGtin: options.variant.barcodeGtin ?? undefined,
    price: options.variant.price ?? undefined,
    stockQuantity: options.stockQuantity,
    minimumStock: options.variant.minimumStock,
    warehousesWithStock: options.warehousesWithStock,
    distributed: options.distributed,
    availabilityStatus: toAvailabilityStatus(
      options.stockQuantity,
      options.variant.minimumStock,
    ),
    attributes: options.attributes,
    recentMovements: options.recentMovements,
  };
}
