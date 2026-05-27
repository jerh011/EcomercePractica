import { CursorPaginatedResponse, NonPaginatedResponse, OffsetPaginatedResponse } from '@shared/interfaces';
import { Attribute } from '@shared/models';

export type AttributesOffsetResponse = OffsetPaginatedResponse<'attributes', Attribute>;
export type AttributesCursorResponse = CursorPaginatedResponse<'attributes', Attribute>;
export type AttributesNonPaginatedResponse = NonPaginatedResponse<'attributes', Attribute>;

export type AttributesResponse = AttributesOffsetResponse | AttributesCursorResponse | AttributesNonPaginatedResponse;
