import type {
  RackSummaryDto,
  InventoryVariantSummaryDto,
} from './inventory-summary.dto.js';

export class InventoryMovementDto {
  id!: string;
  movementType!: 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT' | 'TRANSFER';
  quantity!: number;
  reason!: string;
  comments?: string;
  variant!: InventoryVariantSummaryDto;
  sourceRack?: RackSummaryDto;
  destinationRack?: RackSummaryDto;
  performedByUserName?: string;
  createdAt!: Date | null;
}
