import type { WarehouseSummaryDto } from './inventory-summary.dto.js';

export class RackDto {
  id!: string;
  code!: string;
  description?: string;
  isActive!: boolean;
  warehouse!: WarehouseSummaryDto;
  createdAt!: Date | null;
  updatedAt!: Date | null;
}
