import { Injectable } from '@nestjs/common';
// import { ListBrandsQueryDto } from '@ecomercepractica/shared/contracts/brands/dto/input/list-brands.dto';
import { ListCategoriesQueryDto } from '@ecomercepractica/shared/contracts/categories/input/list-categories.dto';
import { CategoryWithChildrenDto } from '@ecomercepractica/shared/contracts/categories/output/category.dto';
// import { ListWarehousesQueryDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/list-warehouses.dto';
import { CategoriesService } from '../categories/categories.service';
// import { BrandsService } from '../brands/brands.service';
// import { PrismaService } from '../../prisma/prisma.service';
// import { PaginationService } from '../common/pagination/pagination.service';

import {
  CategoriesPageDto,
  SyncCategoryCompositeDto,
  CategoryChildrenPageDto,
  AttributesCreateDialogDto,
  AttributeFormOptionsDto,
  BulkAttributeRegistrationCompositeDto,
  // BrandsPageDto,
  RegisterAttributeCompositeDto,
  // WarehousesPageDto,
} from '@ecomercepractica/shared/contracts/composite/composite.dto';
import {
  // AttributeRow,
  // toAttributeWithCategoriesDto,
  toCategorySummaryDto,
} from './mappers/composite.mapper';
// import { StoreSettingsService } from '../store-settings/store-settings.service';
// import { WarehousesService } from '../warehouses/warehouses.service';

// type AttributeDelegate = {
//   findMany(args: unknown): Promise<AttributeRow[]>;
//   count(args: unknown): Promise<number>;
// };

export interface ListAttributesQuery {
  showDeleted?: boolean;
  pageSize?: number;
  page?: number;
}

@Injectable()
export class CompositeService {
  constructor(
    private readonly categoriesService: CategoriesService,
    // private readonly brandsService: BrandsService,
    // private readonly warehousesService: WarehousesService,
    // private readonly storeSettingsService: StoreSettingsService,
    // private readonly prisma: PrismaService,
    // private readonly pagination: PaginationService,
  ) {}

  async getCategoriesPage(
    input: ListCategoriesQueryDto,
  ): Promise<CategoriesPageDto> {
    const table = await this.categoriesService.listCategories(input);
    return { table };
  }

  async getCategoryChildrenPage(id: string): Promise<CategoryChildrenPageDto> {
    const category = await this.categoriesService.getCategory(id, 'children');
    return { category };
  }

  // async getBrandsPage(input: ListBrandsQueryDto): Promise<BrandsPageDto> {
  //   const table = await this.brandsService.listBrands(input);
  //   const legacyTable = table as typeof table & {
  //     brands?: typeof table.brands;
  //   };
  //   const { brands, ...metadata } = legacyTable;

  //   return {
  //     table: {
  //       ...metadata,
  //       brands: legacyTable.brands ?? brands ?? [],
  //     },
  //   };
  // }

  // async getWarehousesPage(
  //   input: ListWarehousesQueryDto,
  // ): Promise<WarehousesPageDto> {
  //   const [table, states] = await Promise.all([
  //     this.warehousesService.listWarehouses(input),
  //     this.storeSettingsService.listMexicoStates(),
  //   ]);

  //   return {
  //     table,
  //     filters: {
  //       states,
  //     },
  //   };
  // }

  async getAttributesCreateDialog(): Promise<AttributesCreateDialogDto> {
    const categories = await this.listAttributeFormCategories();

    return {
      categories,
    };
  }

  async getRegisterAttributeComposite(): Promise<RegisterAttributeCompositeDto> {
    return {
      form: await this.getAttributeFormOptions(),
    };
  }

  async getBulkAttributeRegistrationComposite(): Promise<BulkAttributeRegistrationCompositeDto> {
    return {
      form: await this.getAttributeFormOptions(),
    };
  }

  async getSyncCategoryComposite(id: string): Promise<SyncCategoryCompositeDto> {
    const category = (await this.categoriesService.getCategory(
      id,
      'children',
    )) as CategoryWithChildrenDto;
    const { children = [], ...parentCategory } = category;

    return {
      category: parentCategory,
      children,
    };
  }

  private async getAttributeFormOptions(): Promise<AttributeFormOptionsDto> {
    return {
      categories: await this.listAttributeFormCategories(),
    };
  }

  private async listAttributeFormCategories() {
    const list = await this.categoriesService.listCategories({
      page: 1,
      pageSize: 10,
      rootOnly: false,
    });

    return list.categories
      .filter(
        (category): category is NonNullable<typeof category> =>
          category !== null,
      )
      .map(toCategorySummaryDto);
  }

  // async getAttributesPage(
  //   input: ListAttributesQuery,
  // ): Promise<AttributesPageDto> {
  //   const pageSize = input.pageSize ?? 25;
  //   const window = this.pagination.offsetWindow(input.page, pageSize);
  //   const where = input.showDeleted ? {} : { deletedAt: null };
  //   const [rows, totalCount] = await Promise.all([
  //     this.attribute.findMany({
  //       where,
  //       include: {
  //         categoryLinks: {
  //           include: {
  //             category: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //                 slug: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }, { id: 'asc' }],
  //       take: window.pageSize,
  //       skip: window.offset,
  //     }),
  //     this.attribute.count({ where }),
  //   ]);

  //   return {
  //     table: {
  //       attributes: rows.map(toAttributeWithCategoriesDto),
  //       ...this.pagination.offsetMetadata(totalCount, window.pageSize),
  //     },
  //   };
  // }

  // private get attribute(): AttributeDelegate {
  //   return (this.prisma.client as unknown as { attribute: AttributeDelegate })
  //     .attribute;
  // }
}
