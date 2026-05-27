import { ApiResponse } from '@shared/interfaces';
import { Category } from '@shared/models';

export interface ToggleCategoryVisibilityInMenu {
  id: string;
  visibleInMenu: boolean;
}

export interface ToggleCategoryActiveStatus {
  id: string;
  isActive: boolean;
}

export type UpdateCategory = Partial<
  Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
>;

export type CategoryUpdated = Category;
export type CategoryDeleted = { category: Category };