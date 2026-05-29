import { CreateVariantDto } from '@ecomercepractica/shared/contracts/variants/dto/input/create-variant.dto';
import { UpdateVariantDto } from '@ecomercepractica/shared/contracts/variants/dto/input/update-variant.dto';
import { ApiResponse } from '@shared/interfaces';
import { ProductVariant } from '@shared/models';

export type CreateProductVariant = CreateVariantDto;
export type UpdateProductVariant = UpdateVariantDto;
export type ProductVariantCreated = ApiResponse<{ variant: ProductVariant }>;
export type ProductVariantUpdated = ApiResponse<{ variant: ProductVariant }>;
export type ProductVariantDeleted = ApiResponse<{ variant: ProductVariant }>;
