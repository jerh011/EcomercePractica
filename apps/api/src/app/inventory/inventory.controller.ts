import { Body, Controller, Get, Param, Post, Query, UseFilters } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdjustStockDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/adjust-stock.dto';
import { ListInventoryQueryDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/list-inventory.dto';
import { ListInventoryMovementsQueryDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/list-inventory-movements.dto';
import { TransferStockDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/transfer-stock.dto';
import { LegacyHttpExceptionFilter } from '../../common/http/legacy-http-exception.filter';
import { SuccessResponse } from '../common/interceptors/success-response.decorator';
import {
  AdjustStockSwaggerDto,
  InventoryDistributionResponseSwaggerDto,
  InventoryMutationResponseSwaggerDto,
  InventoryVariantDetailResponseSwaggerDto,
  ListInventoryMovementsResponseSwaggerDto,
  ListInventoryResponseSwaggerDto,
  TransferStockSwaggerDto,
} from './dto/inventory.swagger.dto';
import { InventoryService } from './inventory.service';
import {
  validateAdjustStockBody,
  validateListInventoryMovementsQuery,
  validateListInventoryQuery,
  validateTransferStockBody,
  validateVariantInventoryParams,
} from './validations/inventory.validation';

@ApiTags('Inventory')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Bearer access token required or invalid.',
})
@ApiExtraModels(
  ListInventoryResponseSwaggerDto,
  InventoryVariantDetailResponseSwaggerDto,
  InventoryDistributionResponseSwaggerDto,
  ListInventoryMovementsResponseSwaggerDto,
  InventoryMutationResponseSwaggerDto,
)
@UseFilters(LegacyHttpExceptionFilter)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @SuccessResponse('Inventory retrieved successfully')
  @Get()
  @ApiOperation({ summary: 'List inventory across variants' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiQuery({ name: 'rackId', required: false, type: String })
  @ApiOkResponse({
    description: 'Inventory retrieved successfully.',
    type: ListInventoryResponseSwaggerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid inventory query parameters.' })
  async listInventory(@Query() query: ListInventoryQueryDto) {
    const input = validateListInventoryQuery(query);
    return this.inventoryService.listInventory(input);
  }

  @SuccessResponse('Inventory detail retrieved successfully')
  @Get(':variantId')
  @ApiOperation({ summary: 'Get inventory detail for a variant' })
  @ApiParam({ name: 'variantId', type: String, description: 'Variant UUID.' })
  @ApiOkResponse({
    description: 'Inventory detail retrieved successfully.',
    type: InventoryVariantDetailResponseSwaggerDto,
  })
  async getInventoryDetail(@Param() params: unknown) {
    const input = validateVariantInventoryParams(params);
    return this.inventoryService.getInventoryDetail(input.variantId);
  }

  @SuccessResponse('Inventory distribution retrieved successfully')
  @Get(':variantId/distribution')
  @ApiOperation({ summary: 'Get inventory distribution by rack' })
  @ApiParam({ name: 'variantId', type: String, description: 'Variant UUID.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiOkResponse({
    description: 'Inventory distribution retrieved successfully.',
    type: InventoryDistributionResponseSwaggerDto,
  })
  async getInventoryDistribution(
    @Param() params: unknown,
    @Query() query: ListInventoryQueryDto,
  ) {
    const route = validateVariantInventoryParams(params);
    const input = validateListInventoryQuery(query);
    return this.inventoryService.getInventoryDistribution(route.variantId, input);
  }

  @SuccessResponse('Inventory movements retrieved successfully')
  @Get(':variantId/movements')
  @ApiOperation({ summary: 'Get inventory movements for a variant' })
  @ApiParam({ name: 'variantId', type: String, description: 'Variant UUID.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'rackId', required: false, type: String })
  @ApiOkResponse({
    description: 'Inventory movements retrieved successfully.',
    type: ListInventoryMovementsResponseSwaggerDto,
  })
  async getVariantMovements(
    @Param() params: unknown,
    @Query() query: ListInventoryMovementsQueryDto,
  ) {
    const route = validateVariantInventoryParams(params);
    const input = validateListInventoryMovementsQuery(query);
    return this.inventoryService.listInventoryMovements(route.variantId, input);
  }

  @SuccessResponse('Inventory movements retrieved successfully')
  @Get('movements/all')
  @ApiOperation({ summary: 'List inventory movements with optional rack filter' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'rackId', required: false, type: String })
  @ApiOkResponse({
    description: 'Inventory movements retrieved successfully.',
    type: ListInventoryMovementsResponseSwaggerDto,
  })
  async listAllMovements(@Query() query: ListInventoryMovementsQueryDto) {
    const input = validateListInventoryMovementsQuery(query);
    return this.inventoryService.listInventoryMovements(undefined, input);
  }

  @SuccessResponse('Inventory adjusted successfully')
  @Post('adjustments')
  @ApiOperation({ summary: 'Adjust inventory for a rack allocation' })
  @ApiBody({ type: AdjustStockSwaggerDto })
  @ApiOkResponse({
    description: 'Inventory adjusted successfully.',
    type: InventoryMutationResponseSwaggerDto,
  })
  async adjustStock(@Body() body: AdjustStockDto) {
    const input = validateAdjustStockBody(body);
    return this.inventoryService.adjustStock(input);
  }

  @SuccessResponse('Inventory transferred successfully')
  @Post('transfers')
  @ApiOperation({ summary: 'Transfer inventory between racks' })
  @ApiBody({ type: TransferStockSwaggerDto })
  @ApiOkResponse({
    description: 'Inventory transferred successfully.',
    type: InventoryMutationResponseSwaggerDto,
  })
  async transferStock(@Body() body: TransferStockDto) {
    const input = validateTransferStockBody(body);
    return this.inventoryService.transferStock(input);
  }
}
