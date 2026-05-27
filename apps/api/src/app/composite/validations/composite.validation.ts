import { BadRequestException } from '@nestjs/common';
import {
  objectValue,
  optionalPositiveInt,
} from '@ecomercepractica/shared/validations';
import { validateListCategoriesQuery } from '../../categories/validations/categories.validation';
//TODO: Amas cambios
// import { validateListWarehousesQuery } from '../../warehouses/validations/warehouses.validation';
import { validateListBrandsQuery } from '../../brands/validations/brands.validation';

export const validateCategoriesPageQuery = validateListCategoriesQuery;
export const validateBrandsPageQuery = validateListBrandsQuery;
// export const validateWarehousesPageQuery = validateListWarehousesQuery;

export function validateCategoryChildrenParams(value: unknown): { id: string } {
  const params = objectValue(value);
  if (typeof params.id !== 'string' || params.id.length === 0) {
    throw new BadRequestException('Invalid input');
  }
  return { id: params.id };
}

export function validateAttributesCreateDialogQuery(value: unknown) {
  objectValue(value);
  return {};
}

export function validateAttributesPageQuery(value: unknown) {
  const query = objectValue(value);
  const issues: string[] = [];
  const pageSize = optionalPositiveInt(query.pageSize, 'pageSize', issues, 50);
  const page = optionalPositiveInt(query.page, 'page', issues);

  if (issues.length > 0) {
    throw new BadRequestException('Invalid query parameters');
  }

  return {
    showDeleted:
      query.showDeleted === undefined ? false : Boolean(query.showDeleted),
    pageSize,
    page: page ?? 1,
  };
}
