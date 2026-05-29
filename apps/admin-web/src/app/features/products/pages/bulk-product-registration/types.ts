import { ProductFormData } from '@products/components/forms/product-form/types';
import { DraftRecord, EntityData } from '@shared/interfaces';
import { CreateBatchProductDto } from '@ecomercepractica/shared/contracts/products/dto/input/create-product.dto';

export type ProductDraft = DraftRecord<ProductFormData & EntityData>;
export type BulkSaveProductItem = CreateBatchProductDto;
