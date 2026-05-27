import { OffsetResponse } from '@shared/interfaces/pagination.interface';
import { Attribute } from '@shared/models/attribute.model';

export interface AttributesTable {
  attributes: Attribute[];
  totalPages: number;
  totalCount: number;
}

export interface AttributesCompositeResponse {
  table: AttributesTable;
}

export interface AttributesOffsetResponse extends OffsetResponse {
  attributes: Attribute[];
}
