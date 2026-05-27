import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { LegacyHttpExceptionFilter } from '../../common/http/legacy-http-exception.filter';
import { AttributesService } from './attributes.service';
import {
  AttributeResponseSwaggerDto,
  CreateAttributeSwaggerDto,
  CreateBatchAttributesResponseSwaggerDto,
  CreateBatchAttributesSwaggerDto,
  ListAttributesResponseSwaggerDto,
  UpdateAttributeSwaggerDto,
} from './dto/attributes.swagger.dto';
import {
  validateCreateAttributeBody,
  validateCreateBatchBody,
  validateDeleteParams,
  validateGetParams,
  validateIfMatch,
  validateListAttributesQuery,
  validateUpdateAttributeBody,
} from './validations/attributes.validation';

@ApiTags('Attributes')

@ApiExtraModels(
  ListAttributesResponseSwaggerDto,
  AttributeResponseSwaggerDto,
  CreateBatchAttributesResponseSwaggerDto,
)
@UseFilters(LegacyHttpExceptionFilter)
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get()
  @ApiOperation({ summary: 'List attributes' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Offset page number. Defaults to 1.',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Offset page size. Maximum 50.',
  })
  @ApiQuery({
    name: 'paginationType',
    required: false,
    enum: ['offset', 'cursor', 'none'],
  })
  @ApiQuery({ name: 'after', required: false, type: String })
  @ApiQuery({ name: 'before', required: false, type: String })
  @ApiQuery({
    name: 'showDeleted',
    required: false,
    type: Boolean,
    description: 'Legacy boolean flag to include soft-deleted attributes.',
  })
  @ApiQuery({
    name: 'appliesToAll',
    required: false,
    type: Boolean,
    description:
      'Filters global attributes when true. Defaults to false for category-scoped attributes.',
  })
  @ApiQuery({
    name: 'categoryIds',
    required: false,
    type: String,
    isArray: true,
    description:
      'Category UUID filters. Can be repeated or sent as a comma-separated list.',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    isArray: true,
    description:
      'Alias for categoryIds. Can be repeated or sent as a comma-separated list.',
  })
  @ApiQuery({
    name: 'exclude',
    required: false,
    enum: ['categoryIds'],
    isArray: true,
    description:
      'Filter modifier. Use categoryIds to return attributes not linked to the provided categoryIds.',
  })
  @ApiQuery({
    name: 'or',
    required: false,
    enum: ['categoryIds', 'categoryId', 'appliesToAll'],
    isArray: true,
    description:
      'Filter combiner. Send comma-separated filter names to evaluate those filters with OR instead of the default AND.',
  })
  @ApiOkResponse({
    description: 'Attributes retrieved successfully.',
    type: ListAttributesResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
  async listAttributes(@Query() query: unknown) {
    const input = validateListAttributesQuery(query);
    const result = await this.attributesService.listAttributes(input);
    return this.success(result, 'Attributes retrieved successfully');
  }

  @Post('batch')
  @ApiOperation({ summary: 'Create attributes in batch' })
  @ApiBody({ type: CreateBatchAttributesSwaggerDto })
  @ApiCreatedResponse({
    description: 'Batch attributes created successfully.',
    type: CreateBatchAttributesResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid batch payload.' })
  async createBatchAttributes(@Body() body: unknown) {
    const input = validateCreateBatchBody(body);
    const result = await this.attributesService.createBatchAttributes(input);
    return this.success(result, 'Batch attributes created successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create an attribute' })
  @ApiBody({ type: CreateAttributeSwaggerDto })
  @ApiCreatedResponse({
    description: 'Attribute created successfully.',
    type: AttributeResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid attribute payload.' })
  async createAttribute(@Body() body: unknown) {
    const input = validateCreateAttributeBody(body);
    const result = await this.attributesService.createAttribute(input);
    return this.success(result, 'Attribute created successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an attribute by id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Attribute UUID.',
  })
  @ApiOkResponse({
    description: 'Attribute retrieved successfully.',
    type: AttributeResponseSwaggerDto,
    headers: {
      ETag: {
        description:
          'Quoted numeric resource version for optimistic concurrency.',
        schema: { type: 'string', example: '"2"' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async getAttribute(
    @Param() params: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const input = validateGetParams(params);
    const result = await this.attributesService.getAttribute(input.id);
    response.setHeader('ETag', `"${result.version}"`);
    return this.success(result.attribute, 'Attribute retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attribute' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Attribute UUID.',
  })
  @ApiHeader({
    name: 'If-Match',
    required: true,
    description: 'Quoted numeric resource version from the latest ETag header.',
    schema: { type: 'string', example: '"2"' },
  })
  @ApiBody({ type: UpdateAttributeSwaggerDto })
  @ApiOkResponse({
    description: 'Attribute updated successfully.',
    type: AttributeResponseSwaggerDto,
    headers: {
      ETag: {
        description: 'Quoted numeric resource version after the update.',
        schema: { type: 'string', example: '"3"' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameters, headers, or update payload.',
  })
  async updateAttribute(
    @Param() params: unknown,
    @Body() body: unknown,
    @Headers('if-match') ifMatch: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const headers = validateIfMatch(ifMatch);
    const parsedBody = validateUpdateAttributeBody(body);
    const route = validateGetParams(params);
    const result = await this.attributesService.updateAttribute(
      route.id,
      parsedBody,
      headers.expectedVersion,
    );
    response.setHeader('ETag', `"${result.version}"`);
    return this.success(result.attribute, 'Attribute updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an attribute' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Attribute UUID.',
  })
  @ApiOkResponse({
    description: 'Attribute deleted successfully.',
    type: AttributeResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameters.' })
  async deleteAttribute(@Param() params: unknown) {
    const input = validateDeleteParams(params);
    const result = await this.attributesService.deleteAttribute(input.id);
    return this.success(result, 'Attribute deleted successfully');
  }

  private success<T>(data: T, message: string) {
    return {
      success: true,
      message,
      data,
    };
  }
}
