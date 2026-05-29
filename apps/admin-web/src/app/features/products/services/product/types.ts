import { ApiResponse } from '@shared/interfaces';
import { Product } from '@shared/models';

export type GetProductByIdResponse<TProduct = Product> = ApiResponse<{
  product: TProduct;
}>;
