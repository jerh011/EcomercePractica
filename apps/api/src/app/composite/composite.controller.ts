import { Controller, Get, Param, Query, UseFilters } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LegacyHttpExceptionFilter } from '../../common/http/legacy-http-exception.filter';
import { CompositeService } from './composite.service';
import {
  CompositeAttributesCreateDialogResponseSwaggerDto,
  // CompositeAttributesPageResponseSwaggerDto,
  CompositeBulkAttributeRegistrationResponseSwaggerDto,
  CompositeBrandsPageResponseSwaggerDto,
  CompositeCategoriesPageResponseSwaggerDto,
  CompositeCategoryChildrenResponseSwaggerDto,
  CompositeRegisterAttributeResponseSwaggerDto,
  CompositeSyncCategoryResponseSwaggerDto,
  // CompositeWarehousesPageResponseSwaggerDto,
} from './dto/composite.swagger.dto';
import {
  // validateAttributesCreateDialogQuery,
  // validateAttributesPageQuery,
  validateBrandsPageQuery,
  validateCategoriesPageQuery,
  validateCategoryChildrenParams,
  // validateWarehousesPageQuery,
} from './validations/composite.validation';
import { swaggerResponseExamples } from '../common/swagger/api-response-examples';
import { SuccessResponse } from '../common/interceptors/success-response.decorator';

@ApiTags('Composite')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Bearer access token required or invalid.',
})
@ApiExtraModels(
  CompositeCategoriesPageResponseSwaggerDto,
  CompositeCategoryChildrenResponseSwaggerDto,
  CompositeBrandsPageResponseSwaggerDto,
  // CompositeAttributesPageResponseSwaggerDto,
  CompositeAttributesCreateDialogResponseSwaggerDto,
  CompositeRegisterAttributeResponseSwaggerDto,
  CompositeBulkAttributeRegistrationResponseSwaggerDto,
  CompositeSyncCategoryResponseSwaggerDto,
  // CompositeWarehousesPageResponseSwaggerDto,
)
@UseFilters(LegacyHttpExceptionFilter)
@Controller('composite')
export class CompositeController {
  constructor(private readonly compositeService: CompositeService) {}

  @swaggerResponseExamples.compositeCategories
  @SuccessResponse('Categories page data retrieved successfully')
  @Get('categories')
  @ApiOperation({ summary: 'Get composite categories page data' })
  @ApiQuery({ name: 'parentId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'rootOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiQuery({
    name: 'paginationType',
    required: false,
    enum: ['offset', 'cursor'],
  })
  @ApiQuery({ name: 'after', required: false, type: String })
  @ApiQuery({ name: 'before', required: false, type: String })
  @ApiOkResponse({
    description: 'Categories page data retrieved successfully.',
    type: CompositeCategoriesPageResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid categories page query parameters.',
  })
  async getCategoriesPage(@Query() query: unknown) {
    const input = validateCategoriesPageQuery(query);
    return this.compositeService.getCategoriesPage(input);
  }

  @swaggerResponseExamples.compositeCategoryChildren
  @SuccessResponse('Category children page data retrieved successfully')
  @Get('categories/:id/children')
  @ApiOperation({ summary: 'Get composite category children page data' })
  @ApiParam({ name: 'id', type: String, description: 'Category identifier.' })
  @ApiOkResponse({
    description: 'Category children page data retrieved successfully.',
    type: CompositeCategoryChildrenResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid category route parameters.' })
  async getCategoryChildrenPage(@Param() params: unknown) {
    const input = validateCategoryChildrenParams(params);
    return this.compositeService.getCategoryChildrenPage(input.id);
  }
  @swaggerResponseExamples.compositeBrands
  @SuccessResponse('Brands page data retrieved successfully')
  @Get('brands')
  @ApiOperation({ summary: 'Get composite brands page data' })
  @ApiQuery({
    name: 'paginationType',
    required: false,
    enum: ['offset', 'cursor'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'after', required: false, type: String })
  @ApiQuery({ name: 'before', required: false, type: String })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'metaTitle', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'website', required: false, type: String })
  @ApiQuery({ name: 'slug', required: false, type: String })
  @ApiOkResponse({
    description: 'Brands page data retrieved successfully.',
    type: CompositeBrandsPageResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid brands page query parameters.',
  })
  async getBrandsPage(@Query() query: unknown) {
    const input = validateBrandsPageQuery(query);
    return this.compositeService.getBrandsPage(input);
  }

  //TODO composite warehouses page endpoint implementation is pending WarehousesModule and related service methods implementation
  // @SuccessResponse('Warehouses page data retrieved successfully')
  // @Get('warehouses')
  // @ApiOperation({ summary: 'Get composite warehouses page data' })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  // @ApiQuery({ name: 'pageSize', required: false, type: Number })
  // @ApiQuery({ name: 'query', required: false, type: String })
  // @ApiQuery({ name: 'createdAt', required: false, type: String })
  // @ApiQuery({ name: 'stateId', required: false, type: String })
  // @ApiQuery({ name: 'municipalityId', required: false, type: String })
  // @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  // @ApiOkResponse({
  //   description: 'Warehouses page data retrieved successfully.',
  //   type: CompositeWarehousesPageResponseSwaggerDto,
  // })
  // @ApiBadRequestResponse({
  //   description: 'Invalid warehouses page query parameters.',
  // })
  // async getWarehousesPage(@Query() query: unknown) {
  //   const input = validateWarehousesPageQuery(query);
  //   return this.compositeService.getWarehousesPage(input);
  // }

  //TODO composite attributes page endpoint implementation is pending AttributesModule and related service methods implementation
  // @swaggerResponseExamples.compositeAttributes
  // @SuccessResponse('Attributes page data retrieved successfully')
  // @Get('attributes')
  // @ApiOperation({ summary: 'Get composite attributes page data' })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  // @ApiQuery({ name: 'pageSize', required: false, type: Number })
  // @ApiQuery({ name: 'showDeleted', required: false, type: Boolean })
  // @ApiOkResponse({
  //   description: 'Attributes page data retrieved successfully.',
  //   type: CompositeAttributesPageResponseSwaggerDto,
  // })
  // @ApiBadRequestResponse({
  //   description: 'Invalid attributes page query parameters.',
  // })
  // async getAttributesPage(@Query() query: unknown) {
  //   const input = validateAttributesPageQuery(query);
  //   return this.compositeService.getAttributesPage(input);
  // }

  //TODO composite attribute create dialog endpoint implementation is pending AttributesModule and related service methods implementation
  // @swaggerResponseExamples.compositeAttributesCreateDialog
  // @SuccessResponse('Attributes create dialog data retrieved successfully')
  // @Get('attributes/create-dialog')
  // @ApiOperation({ summary: 'Get composite attribute create dialog data' })
  // @ApiOkResponse({
  //   description: 'Attributes create dialog data retrieved successfully.',
  //   type: CompositeAttributesCreateDialogResponseSwaggerDto,
  // })
  // @ApiBadRequestResponse({
  //   description: 'Invalid create dialog query parameters.',
  // })
  // async getAttributesCreateDialog(@Query() query: unknown) {
  //   validateAttributesCreateDialogQuery(query);
  //   return this.compositeService.getAttributesCreateDialog();
  // }

  //TODO composite attribute register endpoint implementation is pending AttributesModule and related service methods implementation
  // @swaggerResponseExamples.compositeRegisterAttribute
  // @SuccessResponse('Attribute register composite data retrieved successfully')
  // @Get('attributes/register-attribute')
  // @ApiOperation({ summary: 'Get composite attribute register page data' })
  // @ApiOkResponse({
  //   description: 'Attribute register composite data retrieved successfully.',
  //   type: CompositeRegisterAttributeResponseSwaggerDto,
  // })
  // @ApiBadRequestResponse({
  //   description: 'Invalid register attribute query parameters.',
  // })
  // async getRegisterAttributeComposite(@Query() query: unknown) {
  //   validateAttributesCreateDialogQuery(query);
  //   return this.compositeService.getRegisterAttributeComposite();
  // }

  //TODO composite attribute bulk registration endpoint implementation is pending AttributesModule and related service methods implementation
  // @swaggerResponseExamples.compositeBulkAttributeRegistration
  // @SuccessResponse(
  //   'Attribute bulk registration composite data retrieved successfully',
  // )
  // @Get('attributes/bulk-registration')
  // @ApiOperation({
  //   summary: 'Get composite attribute bulk registration page data',
  // })
  // @ApiOkResponse({
  //   description:
  //     'Attribute bulk registration composite data retrieved successfully.',
  //   type: CompositeBulkAttributeRegistrationResponseSwaggerDto,
  // })
  // @ApiBadRequestResponse({
  //   description: 'Invalid bulk registration query parameters.',
  // })
  // async getBulkAttributeRegistrationComposite(@Query() query: unknown) {
  //   validateAttributesCreateDialogQuery(query);
  //   return this.compositeService.getBulkAttributeRegistrationComposite();
  // }

  @swaggerResponseExamples.compositeSyncCategory
  @SuccessResponse('Category sync composite data retrieved successfully')
  @Get('categories/sync-category/:id')
  @ApiOperation({ summary: 'Get composite category sync page data' })
  @ApiParam({ name: 'id', type: String, description: 'Category identifier.' })
  @ApiOkResponse({
    description: 'Category sync composite data retrieved successfully.',
    type: CompositeSyncCategoryResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid category route parameters.' })
  async getSyncCategoryComposite(@Param() params: unknown) {
    const input = validateCategoryChildrenParams(params);
    return this.compositeService.getSyncCategoryComposite(input.id);
  }
}
