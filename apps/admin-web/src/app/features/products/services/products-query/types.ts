import { CursorPaginatedResponse, OffsetPaginatedResponse } from '@shared/interfaces';
import { Product } from '@shared/models';

export type ProductsOffsetResponse<TProduct = Product> = OffsetPaginatedResponse<
  'products',
  TProduct
>;
export type ProductsCursorResponse<TProduct = Product> = CursorPaginatedResponse<
  'products',
  TProduct
>;
