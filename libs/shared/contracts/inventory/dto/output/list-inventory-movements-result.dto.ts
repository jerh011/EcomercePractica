import type { InventoryMovementDto } from './inventory-movement.dto.js';

export class ListInventoryMovementsResultDto {
  movements!: InventoryMovementDto[];
  totalCount!: number;
  totalPages!: number;
}
