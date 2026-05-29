import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListInventoryItemSwaggerDto {
  @ApiProperty() variant!: { id: string; sku: string; minimumStock: number };
  @ApiProperty() product!: { id: string; name: string; slug: string };
  @ApiProperty({ type: () => [Object] }) attributes!: Array<{ id: string; name: string; slug: string }>;
  @ApiProperty() stockQuantity!: number;
  @ApiProperty() minimumStock!: number;
  @ApiProperty() warehousesWithStock!: number;
  @ApiProperty() distributed!: boolean;
  @ApiProperty() availabilityStatus!: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  @ApiProperty() distributionStatus!: 'DISTRIBUTED' | 'SINGLE_RACK';
  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true }) lastMovementAt?: Date | null;
}

export class ListInventoryResponseSwaggerDto {
  @ApiProperty({ type: () => [ListInventoryItemSwaggerDto] }) items!: ListInventoryItemSwaggerDto[];
  @ApiProperty() totalCount!: number;
  @ApiProperty() totalPages!: number;
}

export class InventoryMovementSwaggerDto {
  @ApiProperty() id!: string;
  @ApiProperty() movementType!: string;
  @ApiProperty() quantity!: number;
  @ApiProperty() reason!: string;
  @ApiPropertyOptional() comments?: string;
  @ApiProperty() variant!: { id: string; sku: string; minimumStock: number };
  @ApiPropertyOptional() sourceRack?: unknown;
  @ApiPropertyOptional() destinationRack?: unknown;
  @ApiPropertyOptional() performedByUserName?: string;
  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true }) createdAt?: Date | null;
}

export class ListInventoryMovementsResponseSwaggerDto {
  @ApiProperty({ type: () => [InventoryMovementSwaggerDto] }) movements!: InventoryMovementSwaggerDto[];
  @ApiProperty() totalCount!: number;
  @ApiProperty() totalPages!: number;
}

export class InventoryVariantDetailResponseSwaggerDto {
  @ApiProperty() variant!: { id: string; sku: string; minimumStock: number };
  @ApiProperty() product!: { id: string; name: string; slug: string };
  @ApiProperty() productName!: string;
  @ApiProperty() variantName!: string;
  @ApiPropertyOptional() barcodeGtin?: string;
  @ApiPropertyOptional() price?: string;
  @ApiProperty() stockQuantity!: number;
  @ApiProperty() minimumStock!: number;
  @ApiProperty() warehousesWithStock!: number;
  @ApiProperty() distributed!: boolean;
  @ApiProperty() availabilityStatus!: string;
  @ApiProperty({ type: () => [Object] }) attributes!: Array<{ id: string; name: string; slug: string }>;
  @ApiProperty({ type: () => [InventoryMovementSwaggerDto] }) recentMovements!: InventoryMovementSwaggerDto[];
}

export class InventoryDistributionRowSwaggerDto {
  @ApiProperty() rack!: unknown;
  @ApiProperty() variant!: { id: string; sku: string; minimumStock: number };
  @ApiProperty() quantity!: number;
  @ApiProperty() minimumStock!: number;
  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true }) lastUpdatedAt?: Date | null;
  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true }) lastMovementAt?: Date | null;
}

export class InventoryDistributionResponseSwaggerDto {
  @ApiProperty({ type: () => [InventoryDistributionRowSwaggerDto] }) rows!: InventoryDistributionRowSwaggerDto[];
  @ApiProperty() totalCount!: number;
  @ApiProperty() totalPages!: number;
  @ApiProperty() stockQuantity!: number;
  @ApiProperty() warehousesWithStock!: number;
  @ApiProperty() minimumStock!: number;
}

export class AdjustStockSwaggerDto {
  @ApiProperty() variantId!: string;
  @ApiProperty() rackId!: string;
  @ApiProperty({ enum: ['ADJUSTMENT_IN', 'ADJUSTMENT_OUT'] }) movementType!: 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT';
  @ApiProperty() quantity!: number;
  @ApiProperty() reason!: string;
  @ApiPropertyOptional() comments?: string;
}

export class TransferStockSwaggerDto {
  @ApiProperty() variantId!: string;
  @ApiProperty() sourceRackId!: string;
  @ApiProperty() destinationRackId!: string;
  @ApiProperty() quantity!: number;
  @ApiProperty() reason!: string;
  @ApiPropertyOptional() comments?: string;
}

export class InventoryMutationResponseSwaggerDto {
  @ApiProperty() variantId!: string;
  @ApiProperty() stockQuantity!: number;
  @ApiPropertyOptional() sourceRackId?: string;
  @ApiPropertyOptional() destinationRackId?: string;
}
