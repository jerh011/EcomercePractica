import type { WarehouseLocationDto } from "./inventory-summary.dto.js";

export class WarehouseDto {
  id!: string;
  name!: string;
  code!: string;
  direction!: string;
  postalCode!: string;
  neighborhood!: string;
  street!: string;
  streetNumber!: string;
  reference?: string;
  isActive!: boolean;
  location!: WarehouseLocationDto;
  createdAt!: Date | null;
  updatedAt!: Date | null;
}
