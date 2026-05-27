import { CursorPaginatedResponse, OffsetPaginatedResponse } from '@shared/interfaces';
import { Brand } from '@shared/models';

export type BrandsOffsetResponse = OffsetPaginatedResponse<'brands', Brand>;
export type BrandsCursorResponse = CursorPaginatedResponse<'brands', Brand>;
