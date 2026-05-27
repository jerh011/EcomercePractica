import { ApiProperty } from '@nestjs/swagger';
import {
  // AttributeWithCategoriesSwaggerDto,
  ListAttributesDataSwaggerDto,
} from '../../attributes/dto/attributes.swagger.dto';
import {
  BrandSwaggerDto,
  ListBrandsDataSwaggerDto,
} from '../../brands/dto/brands.swagger.dto';

import {
  CategorySwaggerDto,
  CategoryWithChildrenSwaggerDto,
  ListCategoriesDataSwaggerDto,
} from '../../categories/dto/categories.swagger.dto';

import {
  CategorySummarySwaggerDto,
  MexicoStateCatalogSummarySwaggerDto,
} from '../../common/swagger/entity-summary.swagger.dto';
// import { ListWarehousesDataSwaggerDto } from '../../warehouses/dto/warehouses.swagger.dto';

export class CompositeSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: Boolean, example: true, description: 'Success flag.' })
  success!: true;

  @ApiProperty({
    type: String,
    example: 'Categories page data retrieved successfully',
    description: 'Message.',
  })
  message!: string;
}

export class CompositeCategoriesPageDataSwaggerDto {
  @ApiProperty({ type: () => ListCategoriesDataSwaggerDto })
  table!: ListCategoriesDataSwaggerDto;
}

export class CompositeCategoryChildrenDataSwaggerDto {
  @ApiProperty({ type: () => CategoryWithChildrenSwaggerDto, nullable: true })
  category!: CategoryWithChildrenSwaggerDto | null;
}

export class CompositeBrandsPageTableSwaggerDto extends ListBrandsDataSwaggerDto {
  @ApiProperty({ type: () => [BrandSwaggerDto] })
  override brands!: BrandSwaggerDto[];
}

export class CompositeBrandsPageDataSwaggerDto {
  @ApiProperty({ type: () => CompositeBrandsPageTableSwaggerDto })
  table!: CompositeBrandsPageTableSwaggerDto;
}

export class CompositeWarehousesPageFiltersSwaggerDto {
  @ApiProperty({ type: () => [MexicoStateCatalogSummarySwaggerDto] })
  states!: MexicoStateCatalogSummarySwaggerDto[];
}

// export class CompositeWarehousesPageDataSwaggerDto {
//   @ApiProperty({ type: () => ListWarehousesDataSwaggerDto })
//   table!: ListWarehousesDataSwaggerDto;

//   @ApiProperty({ type: () => CompositeWarehousesPageFiltersSwaggerDto })
//   filters!: CompositeWarehousesPageFiltersSwaggerDto;
// }

export class CompositeAttributesPageDataSwaggerDto {
  @ApiProperty({ type: () => ListAttributesDataSwaggerDto })
  table!: ListAttributesDataSwaggerDto;
}

export class CompositeAttributesCreateDialogDataSwaggerDto {
  @ApiProperty({ type: () => [CategorySummarySwaggerDto] })
  categories!: CategorySummarySwaggerDto[];
}

export class CompositeAttributeFormOptionsDataSwaggerDto {
  @ApiProperty({ type: () => [CategorySummarySwaggerDto] })
  categories!: CategorySummarySwaggerDto[];
}

export class CompositeRegisterAttributeDataSwaggerDto {
  @ApiProperty({ type: () => CompositeAttributeFormOptionsDataSwaggerDto })
  form!: CompositeAttributeFormOptionsDataSwaggerDto;
}

export class CompositeBulkAttributeRegistrationDataSwaggerDto {
  @ApiProperty({ type: () => CompositeAttributeFormOptionsDataSwaggerDto })
  form!: CompositeAttributeFormOptionsDataSwaggerDto;
}

export class CompositeSyncCategoryDataSwaggerDto {
  @ApiProperty({ type: () => CategorySwaggerDto })
  category!: CategorySwaggerDto;

  @ApiProperty({ type: () => [CategorySwaggerDto] })
  children!: CategorySwaggerDto[];
}

export class CompositeCategoriesPageResponseSwaggerDto extends CompositeSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: () => CompositeCategoriesPageDataSwaggerDto })
  data!: CompositeCategoriesPageDataSwaggerDto;
}

export class CompositeCategoryChildrenResponseSwaggerDto extends CompositeSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: () => CompositeCategoryChildrenDataSwaggerDto })
  data!: CompositeCategoryChildrenDataSwaggerDto;
}

export class CompositeBrandsPageResponseSwaggerDto extends CompositeSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: () => CompositeBrandsPageDataSwaggerDto })
  data!: CompositeBrandsPageDataSwaggerDto;
}

// export class CompositeWarehousesPageResponseSwaggerDto extends CompositeSuccessEnvelopeSwaggerDto {
//   @ApiProperty({ type: () => CompositeWarehousesPageDataSwaggerDto })
//   data!: CompositeWarehousesPageDataSwaggerDto;
// }

export class CompositeAttributesPageResponseSwaggerDto extends CompositeSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: () => CompositeAttributesPageDataSwaggerDto })
  data!: CompositeAttributesPageDataSwaggerDto;
}

export class CompositeAttributesCreateDialogResponseSwaggerDto extends CompositeSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: () => CompositeAttributesCreateDialogDataSwaggerDto })
  data!: CompositeAttributesCreateDialogDataSwaggerDto;
}

export class CompositeRegisterAttributeResponseSwaggerDto extends CompositeSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: () => CompositeRegisterAttributeDataSwaggerDto })
  data!: CompositeRegisterAttributeDataSwaggerDto;
}

export class CompositeBulkAttributeRegistrationResponseSwaggerDto extends CompositeSuccessEnvelopeSwaggerDto {
  @ApiProperty({
    type: () => CompositeBulkAttributeRegistrationDataSwaggerDto,
  })
  data!: CompositeBulkAttributeRegistrationDataSwaggerDto;
}

export class CompositeSyncCategoryResponseSwaggerDto extends CompositeSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: () => CompositeSyncCategoryDataSwaggerDto })
  data!: CompositeSyncCategoryDataSwaggerDto;
}
