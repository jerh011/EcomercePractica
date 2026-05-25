// import type { AttributeWithCategoriesDto } from '@ecomercepractica/shared/contracts/composite/composite.dto';
import type { CategorySummaryDto } from '@ecomercepractica/shared/contracts/common/dto/output/entity-summary.dto';

export interface AttributeRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  isFilterable: boolean;
  isRequired: boolean;
  appliesToAll: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryLinks?: {
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

export function toCategorySummaryDto(category: {
  id: string;
  name: string;
  slug: string;
}): CategorySummaryDto {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

// export function toAttributeWithCategoriesDto(
//   row: AttributeRow,
// ): AttributeWithCategoriesDto {
//   const categories = (row.categoryLinks ?? []).map((link) =>
//     toCategorySummaryDto(link.category),
//   );

//   return {
//     id: row.id,
//     name: row.name,
//     slug: row.slug,
//     description: row.description ?? undefined,
//     displayOrder: row.displayOrder,
//     isActive: row.isActive,
//     isFilterable: row.isFilterable,
//     appliesToAll: row.appliesToAll,
//     isRequired: row.isRequired,
//     categories,
//     createdAt: row.createdAt ?? null,
//     updatedAt: row.updatedAt ?? null,
//   };
// }
