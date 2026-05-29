export class InventoryMutationResultDto {
  variantId!: string;
  stockQuantity!: number;
  sourceRackId?: string;
  destinationRackId?: string;
}
