import { BatchItem } from "@shared/interfaces/api-request.interface";

export interface RegisterAttributeRequest {
  name: string;
  description: string;
  isActive: boolean;
  isFilterable: boolean;
  appliesToAll: boolean;
  isRequired: boolean;
  categoryIds: string[];
}

export type RegisterAttributeBatchItem = RegisterAttributeRequest & BatchItem;

export interface RegisterAttributeBatchRequest {
  attributes: RegisterAttributeBatchItem[];
}
