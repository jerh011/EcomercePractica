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
 
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LegacyHttpExceptionFilter } from '../../common/http/legacy-http-exception.filter';
import {
  CreateProductDto,
} from '@ecomercepractica/shared/contracts/products/dto/input/create-product.dto';
import { ListProductsQueryDto } from '@ecomercepractica/shared/contracts/products/dto/input/list-products.dto';
import { UpdateProductDto } from '@ecomercepractica/shared/contracts/products/dto/input/update-product.dto';
import { ProductsService } from './products.service';
import { swaggerResponseExamples } from '../common/swagger/api-response-examples';
import {
  CreateProductSwaggerDto,
  CreateBatchProductsResponseSwaggerDto,
  CreateBatchProductsSwaggerDto,
  ListProductsResponseSwaggerDto,
  ProductMutationResponseSwaggerDto,
  ProductRecordResponseSwaggerDto,
  ToggleProductFeaturedSwaggerDto,
  ToggleProductStatusSwaggerDto,
  UpdateProductSwaggerDto,
} from './dto/products.swagger.dto';
import {
  validateCreateProductBody,
  validateCreateBatchProductsBody,
  validateListProductsQuery,
  validateProductCategoryParams,
  validateProductParams,
  validateProductSlugParams,
  validateToggleFeaturedInput,
  validateToggleStatusInput,
  validateUpdateProductBody,
} from './validations/products.validation';

@ApiTags('Products')

@ApiExtraModels(
  ListProductsResponseSwaggerDto,
  ProductRecordResponseSwaggerDto,
  ProductMutationResponseSwaggerDto,
  CreateBatchProductsResponseSwaggerDto,
)
@UseFilters(LegacyHttpExceptionFilter)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @swaggerResponseExamples.productsList
  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiQuery({
    name: 'paginationType',
    required: true,
    enum: ['offset', 'cursor'],
  })
  @ApiQuery({ name: 'pageSize', required: true, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'after', required: false, type: String })
  @ApiQuery({ name: 'before', required: false, type: String })
  @ApiQuery({
    name: 'query',
    required: false,
    type: String,
    description: 'Optional product search text for name, slug, or base SKU.',
  })
  @ApiOkResponse({
    description: 'Products retrieved successfully.',
    type: ListProductsResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid product query parameters.' })
  async listProducts(@Query() query: ListProductsQueryDto) {
    const input = validateListProductsQuery(query);
    const result = await this.productsService.listProducts(input);
    return this.success(result, 'Products retrieved successfully');
  }

  @swaggerResponseExamples.productRetrieved
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a product by slug' })
  @ApiParam({ name: 'slug', type: String, description: 'Product slug.' })
  @ApiOkResponse({
    description: 'Product retrieved successfully.',
    type: ProductRecordResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async getProductBySlug(@Param() params: unknown) {
    const input = validateProductSlugParams(params);
    const result = await this.productsService.getProductBySlug(input.slug);
    return this.success(result, 'Product retrieved successfully');
  }

  @swaggerResponseExamples.productsList
  @Get('category/:categoryId')
  @ApiOperation({ summary: 'List products by category' })
  @ApiParam({ name: 'categoryId', type: String, description: 'Category UUID.' })
  @ApiQuery({
    name: 'paginationType',
    required: true,
    enum: ['offset', 'cursor'],
  })
  @ApiQuery({ name: 'pageSize', required: true, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'after', required: false, type: String })
  @ApiQuery({ name: 'before', required: false, type: String })
  @ApiOkResponse({
    description: 'Products retrieved successfully.',
    type: ListProductsResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid category route parameters or product query.',
  })
  async listProductsByCategory(
    @Param() params: unknown,
    @Query() query: ListProductsQueryDto,
  ) {
    const route = validateProductCategoryParams(params);
    const input = validateListProductsQuery(query);
    const result = await this.productsService.listProductsByCategory(
      route.categoryId,
      input,
    );
    return this.success(result, 'Products retrieved successfully');
  }

  @Post()
  @swaggerResponseExamples.productCreated
  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({ type: CreateProductSwaggerDto })
  @ApiOkResponse({
    description: 'Product created successfully.',
    type: ProductRecordResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid product payload.' })
  async createProduct(@Body() body: CreateProductDto) {
    const input = validateCreateProductBody(body);
    const result = await this.productsService.createProduct(input);
    return this.success(result, 'Product created successfully');
  }

  @Post('batch')
  @swaggerResponseExamples.productBatchCreated
  @ApiOperation({ summary: 'Create products in batch' })
  @ApiBody({ type: CreateBatchProductsSwaggerDto })
  @ApiOkResponse({
    description: 'Batch products created successfully.',
    type: CreateBatchProductsResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid batch product payload.' })
  async createBatchProducts(@Body() body: unknown) {
    const input = validateCreateBatchProductsBody(body);
    const result = await this.productsService.createBatchProducts(input);
    return this.success(result, 'Batch products created successfully');
  }

  @swaggerResponseExamples.productRetrieved
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID.' })
  @ApiOkResponse({
    description: 'Product retrieved successfully.',
    type: ProductRecordResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async getProduct(@Param() params: unknown) {
    const input = validateProductParams(params);
    const result = await this.productsService.getProduct(input.id);
    return this.success(result, 'Product retrieved successfully');
  }

  @Patch(':id')
  @swaggerResponseExamples.productUpdated
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID.' })
  @ApiBody({ type: UpdateProductSwaggerDto })
  @ApiOkResponse({
    description: 'Product updated successfully.',
    type: ProductRecordResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameters or product payload.',
  })
  async updateProduct(@Param() params: unknown, @Body() body: UpdateProductDto) {
    const route = validateProductParams(params);
    const input = validateUpdateProductBody(body);
    const result = await this.productsService.updateProduct(route.id, input);
    return this.success(result, 'Product updated successfully');
  }

  @Patch(':id/status')
  @swaggerResponseExamples.productStatusUpdated
  @ApiOperation({ summary: 'Toggle product active status' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID.' })
  @ApiBody({ type: ToggleProductStatusSwaggerDto })
  @ApiOkResponse({
    description: 'Product status updated successfully.',
    type: ProductMutationResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameters or status payload.',
  })
async toggleStatus(@Param() params: unknown, @Body() body: unknown) {
  const input = validateToggleStatusInput(params, body);
  const result = await this.productsService.toggleStatus(input);
  return this.success(result, 'Product status updated successfully');
}

  @Patch(':id/featured')
  @swaggerResponseExamples.productFeaturedUpdated
  @ApiOperation({ summary: 'Toggle product featured status' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID.' })
  @ApiBody({ type: ToggleProductFeaturedSwaggerDto })
  @ApiOkResponse({
    description: 'Product featured status updated successfully.',
    type: ProductMutationResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameters or featured payload.',
  })
  async toggleFeatured(@Param() params: unknown, @Body() body: unknown) {
    const input = validateToggleFeaturedInput(params, body);
    const result = await this.productsService.toggleFeatured(input);
    return this.success(result, 'Product featured status updated successfully');
  }

  @swaggerResponseExamples.productDeleted
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a product' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID.' })
  @ApiOkResponse({
    description: 'Product deleted successfully.',
    type: ProductRecordResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async deleteProduct(@Param() params: unknown) {
    const input = validateProductParams(params);
    const result = await this.productsService.deleteProduct(input.id);
    return this.success(result, 'Product deleted successfully');
  }

  private success<T>(data: T, message: string) {
    return {
      success: true,
      message,
      data,
    };
  }
}
