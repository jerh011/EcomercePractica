import {
  ApiResponse,
  OffsetPaginatedData,
  OffsetPaginatedResponse,
} from '@shared/interfaces';
import { Category } from '@shared/models';

// type CategoryTable = OffsetPaginatedData<'categories', Category>;

// interface CategoryComposite {
//     table: CategoryTable;
// }

// export type CategoriesCompositeResponse = ApiResponse<CategoryComposite>;

// export type CategoriesOffsetResponse = OffsetPaginatedResponse<'categories', Category>;

type CategoryTable = OffsetPaginatedData<'categories', Category>;

interface CategoryComposite {
  table: CategoryTable;
}

// 📄 CORRECCIÓN: Eliminamos ApiResponse para que TypeScript entienda
// que 'table' está en la raíz del objeto.
export type CategoriesCompositeResponse = CategoryComposite;

export type CategoriesOffsetResponse = OffsetPaginatedData<
  'categories',
  Category
>;