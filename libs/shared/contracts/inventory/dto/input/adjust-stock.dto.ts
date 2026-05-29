export class AdjustStockDto {
  variantId!: string;
  rackId!: string;
  movementType!: 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT';
  quantity!: number;
  reason!: string;
  comments?: string;
}
