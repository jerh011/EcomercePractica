export class TransferStockDto {
  variantId!: string;
  sourceRackId!: string;
  destinationRackId!: string;
  quantity!: number;
  reason!: string;
  comments?: string;
}
