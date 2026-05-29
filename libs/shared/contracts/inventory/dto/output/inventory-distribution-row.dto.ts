import type {
  RackSummaryDto,
  InventoryVariantSummaryDto,
} from './inventory-summary.dto.js';

export class InventoryDistributionRowDto {
  rack!: RackSummaryDto;
  variant!: InventoryVariantSummaryDto;
  quantity!: number;
  minimumStock!: number;
  lastUpdatedAt!: Date | null;
  lastMovementAt?: Date | null;
}
