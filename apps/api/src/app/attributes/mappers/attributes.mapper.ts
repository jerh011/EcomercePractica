import type { AttributeWithCategoriesDto } from '@ecomercepractica/shared/contracts/attributes/dto/output/attribute.dto';
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
  version: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt?: Date | null;
  categoryLinks?: {
    category: {
      id: string;
      name: string;
      slug: string;
      deletedAt?: Date | null;
    };
  }[];
}

export function toAttributeWithCategoriesDto(
  row: AttributeRow,
): AttributeWithCategoriesDto {
  const categories: CategorySummaryDto[] = (row.categoryLinks ?? [])
    .map((link) => link.category)
    .filter(
      (category) => category.deletedAt === undefined || !category.deletedAt,
    )
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    displayOrder: row.displayOrder,
    isActive: row.isActive,
    isFilterable: row.isFilterable,
    appliesToAll: row.appliesToAll,
    isRequired: row.isRequired,
    categories,
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null,
  };
}
