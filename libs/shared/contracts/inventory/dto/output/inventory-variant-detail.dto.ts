import type {
  ProductSummaryDto,
  AttributeSummaryDto,
} from '../../../common/dto/output/entity-summary.dto.js';
import type { InventoryVariantSummaryDto } from './inventory-summary.dto.js';
import type { InventoryMovementDto } from './inventory-movement.dto.js';

export class InventoryVariantDetailDto {
  variant!: InventoryVariantSummaryDto;
  product!: ProductSummaryDto;
  productName!: string;
  variantName!: string;
  barcodeGtin?: string;
  price?: string;
  stockQuantity!: number;
  minimumStock!: number;
  warehousesWithStock!: number;
  distributed!: boolean;
  availabilityStatus!: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  attributes!: AttributeSummaryDto[];
  recentMovements!: InventoryMovementDto[];
}
