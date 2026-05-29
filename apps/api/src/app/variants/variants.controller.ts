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
import { CreateVariantDto } from '@ecomercepractica/shared/contracts/variants/dto/input/create-variant.dto';
import {
  ListVariantsByProductQueryDto,
  ListVariantsQueryDto,
} from '@ecomercepractica/shared/contracts/variants/dto/input/list-variants.dto';
import { UpdateVariantDto } from '@ecomercepractica/shared/contracts/variants/dto/input/update-variant.dto';
import { LegacyHttpExceptionFilter } from '../../common/http/legacy-http-exception.filter';
import { swaggerResponseExamples } from '../common/swagger/api-response-examples';
import {
  CreateVariantSwaggerDto,
  ListVariantsResponseSwaggerDto,
  ToggleVariantStatusSwaggerDto,
  VariantMutationResponseSwaggerDto,
  VariantResponseSwaggerDto,
  UpdateVariantSwaggerDto,
} from './dto/variants.swagger.dto';
import {
  validateCreateVariantBody,
  validateListVariantsQuery,
  validateListVariantsByProductQuery,
  validateToggleVariantStatusInput,
  validateUpdateVariantBody,
  validateVariantIdParams,
  validateVariantProductParams,
  validateVariantSkuParams,
} from './validations/variants.validation';
import { VariantsService } from './variants.service';

@ApiTags('Variants')
@ApiExtraModels(
  ListVariantsResponseSwaggerDto,
  VariantResponseSwaggerDto,
  VariantMutationResponseSwaggerDto,
)
@UseFilters(LegacyHttpExceptionFilter)
@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post()
  @swaggerResponseExamples.variantCreated
  @ApiOperation({ summary: 'Create a variant' })
  @ApiBody({ type: CreateVariantSwaggerDto })
  @ApiOkResponse({
    description: 'Variant created successfully.',
    type: VariantResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid variant payload.' })
  async createVariant(@Body() body: CreateVariantDto) {
    const input = validateCreateVariantBody(body);
    const result = await this.variantsService.createVariant(input);
    return this.success(result, 'Variant created successfully');
  }

  @swaggerResponseExamples.variantRetrieved
  @Get('sku/:sku')
  @ApiOperation({ summary: 'Get a variant by sku' })
  @ApiParam({ name: 'sku', type: String, description: 'Variant SKU.' })
  @ApiOkResponse({
    description: 'Variant retrieved successfully.',
    type: VariantResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async getVariantBySku(@Param() params: unknown) {
    const input = validateVariantSkuParams(params);
    const result = await this.variantsService.getVariantBySku(input.sku);
    return this.success(result, 'Variant retrieved successfully');
  }

  @swaggerResponseExamples.variantsList
  @Get()
  @ApiOperation({ summary: 'List variants' })
  @ApiQuery({
    name: 'productId',
    required: false,
    type: String,
    description: 'Optional product UUID to filter variants.',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Optional active status filter.',
  })
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
    description: 'Variants retrieved successfully.',
    type: ListVariantsResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid variant query.',
  })
  async listVariants(@Query() query: ListVariantsQueryDto) {
    const input = validateListVariantsQuery(query);
    const result = await this.variantsService.listVariants(input);
    return this.success(result, 'Variants retrieved successfully');
  }

  @swaggerResponseExamples.variantsList
  @Get('product/:productId')
  @ApiOperation({ summary: 'List variants by product' })
  @ApiParam({ name: 'productId', type: String, description: 'Product UUID.' })
  @ApiQuery({
    name: 'paginationType',
    required: true,
    enum: ['offset', 'cursor'],
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Optional active status filter.',
  })
  @ApiQuery({ name: 'pageSize', required: true, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'after', required: false, type: String })
  @ApiQuery({ name: 'before', required: false, type: String })
  @ApiOkResponse({
    description: 'Variants retrieved successfully.',
    type: ListVariantsResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameters or variant query.',
  })
  async listVariantsByProduct(
    @Param() params: unknown,
    @Query() query: ListVariantsByProductQueryDto,
  ) {
    const route = validateVariantProductParams(params);
    const input = validateListVariantsByProductQuery(query);
    const result = await this.variantsService.listVariantsByProduct(
      route.productId,
      input,
    );
    return this.success(result, 'Variants retrieved successfully');
  }

  @swaggerResponseExamples.variantRetrieved
  @Get(':id')
  @ApiOperation({ summary: 'Get a variant by id' })
  @ApiParam({ name: 'id', type: String, description: 'Variant UUID.' })
  @ApiOkResponse({
    description: 'Variant retrieved successfully.',
    type: VariantResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async getVariant(@Param() params: unknown) {
    const input = validateVariantIdParams(params);
    const result = await this.variantsService.getVariant(input.id);
    return this.success(result, 'Variant retrieved successfully');
  }

  @Patch(':id')
  @swaggerResponseExamples.variantUpdated
  @ApiOperation({ summary: 'Update a variant' })
  @ApiParam({ name: 'id', type: String, description: 'Variant UUID.' })
  @ApiBody({ type: UpdateVariantSwaggerDto })
  @ApiOkResponse({
    description: 'Variant updated successfully.',
    type: VariantResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameters or variant payload.',
  })
  async updateVariant(@Param() params: unknown, @Body() body: UpdateVariantDto) {
    const route = validateVariantIdParams(params);
    const input = validateUpdateVariantBody(body);
    const result = await this.variantsService.updateVariant(route.id, input);
    return this.success(result, 'Variant updated successfully');
  }

  @Patch(':id/status')
  @swaggerResponseExamples.variantStatusUpdated
  @ApiOperation({ summary: 'Toggle variant active status' })
  @ApiParam({ name: 'id', type: String, description: 'Variant UUID.' })
  @ApiBody({ type: ToggleVariantStatusSwaggerDto })
  @ApiOkResponse({
    description: 'Variant status updated successfully.',
    type: VariantMutationResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameters or status payload.',
  })
  async toggleStatus(@Param() params: unknown, @Body() body: unknown) {
    const input = validateToggleVariantStatusInput(params, body);
    const result = await this.variantsService.toggleStatus(input);
    return this.success(result, 'Variant status updated successfully');
  }

  @swaggerResponseExamples.variantDeleted
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a variant' })
  @ApiParam({ name: 'id', type: String, description: 'Variant UUID.' })
  @ApiOkResponse({
    description: 'Variant deleted successfully.',
    type: VariantResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async deleteVariant(@Param() params: unknown) {
    const input = validateVariantIdParams(params);
    const result = await this.variantsService.deleteVariant(input.id);
    return this.success(result, 'Variant deleted successfully');
  }

  private success<T>(data: T, message: string) {
    return {
      success: true,
      message,
      data,
    };
  }
}
