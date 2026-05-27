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
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LegacyHttpExceptionFilter } from '../../common/http/legacy-http-exception.filter';
import { BrandsService } from './brands.service';
import { ListBrandsQueryDto } from '@ecomercepractica/shared/contracts/brands/dto/input/list-brands.dto';
import {
  validateCreateBatchBody,
  validateCreateBrandBody,
  validateDeleteParams,
  validateGetParams,
  validateListBrandsQuery,
  validateToggleActiveBody,
  validateToggleVisibleBody,
  validateUpdateBrandBody,
} from './validations/brands.validation';
import { swaggerResponseExamples } from '../common/swagger/api-response-examples';
import {
  BooleanResponseSwaggerDto,
  BrandResponseSwaggerDto,
  CreateBatchBrandsResponseSwaggerDto,
  CreateBatchBrandsSwaggerDto,
  CreateBrandSwaggerDto,
  ListBrandsResponseSwaggerDto,
  ToggleBrandActiveSwaggerDto,
  ToggleBrandVisibleSwaggerDto,
  UpdateBrandSwaggerDto,
} from './dto/brands.swagger.dto';
import { SuccessResponse } from '../common/interceptors/success-response.decorator';

@ApiTags('Brands')
@ApiExtraModels(
  ListBrandsResponseSwaggerDto,
  BrandResponseSwaggerDto,
  CreateBatchBrandsResponseSwaggerDto,
  BooleanResponseSwaggerDto,
)
@UseFilters(LegacyHttpExceptionFilter)
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @swaggerResponseExamples.brandsList
  @SuccessResponse('Brands retrieved successfully')
  @Get()
  @ApiOperation({ summary: 'List brands' })
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
    description: 'Brands retrieved successfully.',
    type: ListBrandsResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid brand query parameters.' })
  async listBrands(@Query() query: ListBrandsQueryDto) {
    const input = validateListBrandsQuery(query);
    return this.brandsService.listBrands(input);
  }

  @swaggerResponseExamples.brandBatchCreated
  @SuccessResponse('Batch brands created successfully')
  @Post('batch')
  @ApiOperation({ summary: 'Create brands in batch' })
  @ApiBody({ type: CreateBatchBrandsSwaggerDto })
  @ApiCreatedResponse({
    description: 'Batch brands created successfully.',
    type: CreateBatchBrandsResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid batch payload.' })
  async createBatchBrands(@Body() body: unknown) {
    const input = validateCreateBatchBody(body);
    return this.brandsService.createBatchBrands(input);
  }

  @swaggerResponseExamples.brandCreated
  @SuccessResponse('Brand created successfully')
  @Post()
  @ApiOperation({ summary: 'Create a brand' })
  @ApiBody({ type: CreateBrandSwaggerDto })
  @ApiCreatedResponse({
    description: 'Brand created successfully.',
    type: BrandResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid brand payload.' })
  async createBrand(@Body() body: unknown) {
    const input = validateCreateBrandBody(body);
    return this.brandsService.createBrand(input);
  }

  @swaggerResponseExamples.brandRetrieved
  @SuccessResponse('Brand retrieved successfully')
  @Get(':id')
  @ApiOperation({ summary: 'Get a brand by id' })
  @ApiParam({ name: 'id', type: String, description: 'Brand UUID.' })
  @ApiOkResponse({
    description: 'Brand retrieved successfully.',
    type: BrandResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async getBrand(@Param() params: unknown) {
    const input = validateGetParams(params);
    return this.brandsService.getBrand(input.id);
  }

  @swaggerResponseExamples.brandUpdated
  @SuccessResponse('Brand updated successfully')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a brand' })
  @ApiParam({ name: 'id', type: String, description: 'Brand UUID.' })
  @ApiBody({ type: UpdateBrandSwaggerDto })
  @ApiOkResponse({
    description: 'Brand updated successfully.',
    type: BrandResponseSwaggerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameters or payload.',
  })
  async updateBrand(@Param('id') id: string, @Body() body: unknown) {
    const input = validateUpdateBrandBody(body);
    return this.brandsService.updateBrand(id, input);
  }

  @swaggerResponseExamples.brandDeleted
  @SuccessResponse('Brand deleted successfully')
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a brand' })
  @ApiParam({ name: 'id', type: String, description: 'Brand UUID.' })
  @ApiOkResponse({
    description: 'Brand deleted successfully.',
    type: BooleanResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async deleteBrand(@Param() params: unknown) {
    const input = validateDeleteParams(params);
    return this.brandsService.deleteBrand(input.id);
  }

  @swaggerResponseExamples.brandActiveToggled
  @SuccessResponse('Brand active state updated successfully')
  @Post('active')
  @ApiOperation({ summary: 'Toggle brand active status' })
  @ApiBody({ type: ToggleBrandActiveSwaggerDto })
  @ApiOkResponse({
    description: 'Brand active state updated successfully.',
    type: BooleanResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid active toggle payload.' })
  async toggleActiveBrand(@Body() body: unknown) {
    const input = validateToggleActiveBody(body);
    return this.brandsService.toggleActive(input);
  }

  @swaggerResponseExamples.brandVisibleInMenuToggled
  @SuccessResponse('Brand menu visibility updated successfully')
  @Post('visiblemenu')
  @ApiOperation({ summary: 'Toggle brand menu visibility' })
  @ApiBody({ type: ToggleBrandVisibleSwaggerDto })
  @ApiOkResponse({
    description: 'Brand menu visibility updated successfully.',
    type: BooleanResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid visibility toggle payload.' })
  async toggleVisibleInMenuBrand(@Body() body: unknown) {
    const input = validateToggleVisibleBody(body);
    return this.brandsService.toggleVisibleInMenu(input);
  }
}
