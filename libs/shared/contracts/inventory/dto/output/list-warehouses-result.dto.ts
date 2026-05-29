import type { WarehouseDto } from './warehouse.dto.js';

export class ListWarehousesResultDto {
  warehouses!: WarehouseDto[];
  totalCount!: number;
  totalPages!: number;
}
