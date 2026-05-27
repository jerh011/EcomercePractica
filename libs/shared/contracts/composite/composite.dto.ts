import type { BrandDto } from '../brands/dto/output/brand.dto.js';
import type { ListBrandsDto } from '../brands/dto/output/list-brands-result.dto.js';
import type { CategoryDto } from '../categories/output/category.dto.js';
import type { ListCategoriesResultDto } from '../categories/output/list-categories-result.dto.js';
import type {
  CategorySummaryDto,
  MexicoStateCatalogSummaryDto,
} from '../common/dto/output/entity-summary.dto.js';
// import type { ListWarehousesResultDto } from '../inventory/dto/output/list-warehouses-result.dto';


export interface AttributeDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
  isActive: boolean;
  isFilterable: boolean;
  isRequired: boolean;
  appliesToAll: boolean;
  categories: CategorySummaryDto[];
  createdAt: Date | null;
  updatedAt: Date | null;
}
// export interface AttributeWithCategoriesDto extends AttributeDto {}

// export interface ListAttributesResultDto {
//   attributes: AttributeWithCategoriesDto[];
//   totalCount: number;
//   totalPages: number;
// }

export interface CategoriesPageDto {
  table: ListCategoriesResultDto;
}

export interface CategoryChildrenPageDto {
  category: CategoryDto | null;
}

export interface BrandsPageDto {
  table: Omit<ListBrandsDto, 'brands'> & {
    brands: (BrandDto | null)[];
  };
}

export interface WarehousesPageFiltersDto {
  states: MexicoStateCatalogSummaryDto[];
}

// export interface WarehousesPageDto {
//   table: ListWarehousesResultDto;
//   filters: WarehousesPageFiltersDto;
// }

// export interface AttributesPageDto {
//   table: ListAttributesResultDto;
// }

export interface AttributesCreateDialogDto {
  categories: CategorySummaryDto[];
}

export interface AttributeFormOptionsDto {
  categories: CategorySummaryDto[];
}

export interface RegisterAttributeCompositeDto {
  form: AttributeFormOptionsDto;
}

export interface BulkAttributeRegistrationCompositeDto {
  form: AttributeFormOptionsDto;
}

export interface SyncCategoryCompositeDto {
  category: CategoryDto;
  children: CategoryDto[];
}
