import { CursorResponse } from "@shared/interfaces/pagination.interface";
import { CategorySummary } from "@shared/models";

export interface RegisterAttributeCompositeResponse {
  categories: CategorySummary[];
}

export interface RegisterAttributeCursorResponse extends CursorResponse {
  categories: CategorySummary[];
}
