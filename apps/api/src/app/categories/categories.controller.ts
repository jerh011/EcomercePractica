import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LegacyHttpExceptionFilter } from '../../common/http/legacy-http-exception.filter';
import { CategoriesService } from './categories.service';
import { ListCategoriesQueryDto } from '@ecomercepractica/shared/contracts/categories/input/list-categories.dto';
import {
  validateCreateBatchBody,
  validateCreateCategoryBody,
  validateDeleteParams,
  validateGetParams,
  validateGetQuery,
  validateListCategoriesQuery,
  validateSyncChildrenInput,
  validateUpdateCategoryBody,
} from './validations/categories.validation';
import { swaggerResponseExamples } from '../common/swagger/api-response-examples';
import {
  CategoryResponseSwaggerDto,
  CategoryWithChildrenResponseSwaggerDto,
  CreateBatchCategoriesResponseSwaggerDto,
  CreateBatchCategoriesSwaggerDto,
  CreateCategorySwaggerDto,
  DeleteCategoryResponseSwaggerDto,
  ListCategoriesResponseSwaggerDto,
  SyncCategoryChildrenResponseSwaggerDto,
  SyncCategoryChildrenSwaggerDto,
  UpdateCategorySwaggerDto,
} from './dto/categories.swagger.dto';
import { SuccessResponse } from '../common/interceptors/success-response.decorator';

@ApiTags('Categories')
@ApiBearerAuth()

@ApiExtraModels(
  ListCategoriesResponseSwaggerDto,
  CategoryResponseSwaggerDto,
  CategoryWithChildrenResponseSwaggerDto,
  CreateBatchCategoriesResponseSwaggerDto,
  DeleteCategoryResponseSwaggerDto,
  SyncCategoryChildrenResponseSwaggerDto,
)
@UseFilters(LegacyHttpExceptionFilter)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @swaggerResponseExamples.categoriesList
  @SuccessResponse('Categories retrieved successfully')
  @Get()
  @ApiOperation({ summary: 'List categories' })
  @ApiQuery({ name: 'parentId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'rootOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiQuery({
    name: 'paginationType',
    required: false,
    enum: ['offset', 'cursor'],
  })
  @ApiQuery({ name: 'after', required: false, type: String })
  @ApiQuery({ name: 'before', required: false, type: String })
  @ApiOkResponse({
    description: 'Categories retrieved successfully.',
    type: ListCategoriesResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid category query parameters.' })
  async listCategories(@Query() query: ListCategoriesQueryDto) {
    const input = validateListCategoriesQuery(query);
    return this.categoriesService.listCategories(input);
  }

  @swaggerResponseExamples.categoryBatchCreated
  @SuccessResponse('Batch categories created successfully')
  @Post('batch')
  @ApiOperation({ summary: 'Create categories in batch' })
  @ApiBody({ type: CreateBatchCategoriesSwaggerDto })
  @ApiCreatedResponse({
    description: 'Batch categories created successfully.',
    type: CreateBatchCategoriesResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid batch payload.' })
  async createBatchCategories(@Body() body: unknown) {
    const input = validateCreateBatchBody(body);
    return this.categoriesService.createBatchCategories(input);
  }

  @swaggerResponseExamples.categoryCreated
  @SuccessResponse('Category created successfully')
  @Post()
  @ApiOperation({ summary: 'Create a category' })
  @ApiBody({ type: CreateCategorySwaggerDto })
  @ApiCreatedResponse({
    description: 'Category created successfully.',
    type: CategoryResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid category payload.' })
  async createCategory(@Body() body: unknown) {
    const input = validateCreateCategoryBody(body);
    return this.categoriesService.createCategory(input);
  }

  @swaggerResponseExamples.categoryRetrieved
  @SuccessResponse('Category retrieved successfully')
  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID.' })
  @ApiQuery({
    name: 'include',
    required: false,
    enum: ['children'],
    description: 'Include child categories when set to children.',
  })
  @ApiOkResponse({
    description: 'Category retrieved successfully.',
    type: CategoryResponseSwaggerDto,
  })
  @ApiOkResponse({
    description: 'Category with children retrieved successfully.',
    type: CategoryWithChildrenResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters or query.' })
  async getCategory(@Param() params: unknown, @Query() query: unknown) {
    const route = validateGetParams(params);
    const parsedQuery = validateGetQuery(query);
    return this.categoriesService.getCategory(route.id, parsedQuery.include);
  }

  @swaggerResponseExamples.categoryUpdated
  @SuccessResponse('Category updated successfully')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID.' })
  @ApiBody({ type: UpdateCategorySwaggerDto })
  @ApiOkResponse({
    description: 'Category updated successfully.',
    type: CategoryResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameters or payload.',
  })
  async updateCategory(@Param() params: unknown, @Body() body: unknown) {
    const route = validateGetParams(params);
    const input = validateUpdateCategoryBody(body);
    return this.categoriesService.updateCategory(route.id, input);
  }

  @swaggerResponseExamples.categoryDeleted
  @SuccessResponse('Category deleted successfully')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID.' })
  @ApiOkResponse({
    description: 'Category deleted successfully.',
    type: DeleteCategoryResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async deleteCategory(@Param() params: unknown) {
    const input = validateDeleteParams(params);
    return this.categoriesService.deleteCategory(input.id);
  }

  @swaggerResponseExamples.categoryChildrenSynced
  @SuccessResponse('Batch categories synced')
  @Patch(':id/children/sync')
  @ApiOperation({ summary: 'Sync child categories for a category' })
  @ApiParam({ name: 'id', type: String, description: 'Parent category UUID.' })
  @ApiBody({ type: SyncCategoryChildrenSwaggerDto })
  @ApiOkResponse({
    description: 'Batch categories synced.',
    type: SyncCategoryChildrenResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameters or sync payload.',
  })
  async syncCategoryChildren(@Param() params: unknown, @Body() body: unknown) {
    const input = validateSyncChildrenInput(params, body);
    return this.categoriesService.syncCategoryChildren(input);
  }
}
