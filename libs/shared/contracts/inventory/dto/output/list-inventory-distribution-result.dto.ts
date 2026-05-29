import type { InventoryDistributionRowDto } from './inventory-distribution-row.dto.js';

export class ListInventoryDistributionResultDto {
  rows!: InventoryDistributionRowDto[];
  totalCount!: number;
  totalPages!: number;
  stockQuantity!: number;
  warehousesWithStock!: number;
  minimumStock!: number;
}
