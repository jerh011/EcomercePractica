import { CursorResponse } from "@shared/interfaces/pagination.interface";
import { CategorySummary } from "@shared/models";

export interface AttributeCategorySummaryCursorResponse extends CursorResponse {
  categories: CategorySummary[];
}
