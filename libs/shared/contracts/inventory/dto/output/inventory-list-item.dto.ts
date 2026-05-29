import type {
  ProductSummaryDto,
  AttributeSummaryDto,
} from '../../../common/dto/output/entity-summary.dto.js';
import type { InventoryVariantSummaryDto } from './inventory-summary.dto.js';

export class InventoryListItemDto {
  variant!: InventoryVariantSummaryDto;
  product!: ProductSummaryDto;
  attributes!: AttributeSummaryDto[];
  stockQuantity!: number;
  minimumStock!: number;
  warehousesWithStock!: number;
  distributed!: boolean;
  availabilityStatus!: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  distributionStatus!: 'DISTRIBUTED' | 'SINGLE_RACK';
  lastMovementAt?: Date | null;
}
