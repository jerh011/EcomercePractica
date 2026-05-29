import type { InventoryListItemDto } from './inventory-list-item.dto.js';

export class ListInventoryResultDto {
  items!: InventoryListItemDto[];
  totalCount!: number;
  totalPages!: number;
}
