import { BadRequestException } from '@nestjs/common';
import { AdjustStockDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/adjust-stock.dto';
import { ListInventoryQueryDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/list-inventory.dto';
import { ListInventoryMovementsQueryDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/list-inventory-movements.dto';
import { TransferStockDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/transfer-stock.dto';
import {
  objectValue,
  requireNumber,
  optionalPositiveInt,
  optionalTrimmedStringValue,
  optionalUuid,
  requireString,
  requireUuid,
  throwIfInvalid,
} from '@ecomercepractica/shared/validations';

export function validateListInventoryQuery(
  value: unknown,
): ListInventoryQueryDto {
  const query = objectValue(value);
  const issues: string[] = [];

  const pageSize = optionalPositiveInt(query.pageSize, 'pageSize', issues, 100);
  const page = optionalPositiveInt(query.page, 'page', issues);

  optionalUuid(query.warehouseId, 'warehouseId', issues);
  optionalUuid(query.rackId, 'rackId', issues);

  throwInvalid(issues);

  return {
    pageSize,
    page,
    query: optionalTrimmedStringValue(query.query),
    warehouseId:
      typeof query.warehouseId === 'string' ? query.warehouseId : undefined,
    rackId: typeof query.rackId === 'string' ? query.rackId : undefined,
  };
}

export function validateListInventoryMovementsQuery(
  value: unknown,
): ListInventoryMovementsQueryDto {
  const query = objectValue(value);
  const issues: string[] = [];

  const pageSize = optionalPositiveInt(query.pageSize, 'pageSize', issues, 100);
  const page = optionalPositiveInt(query.page, 'page', issues);
  optionalUuid(query.rackId, 'rackId', issues);

  throwInvalid(issues);

  return {
    pageSize,
    page,
    rackId: typeof query.rackId === 'string' ? query.rackId : undefined,
  };
}

export function validateAdjustStockBody(value: unknown): AdjustStockDto {
  const body = objectValue(value);
  const issues: string[] = [];

  requireUuid(body.variantId, 'variantId', issues);
  requireUuid(body.rackId, 'rackId', issues);
  requireString(body.movementType, 'movementType', issues, { min: 1 });
  requireInventoryQuantity(body.quantity, 'quantity', issues);
  requireString(body.reason, 'reason', issues, { min: 1, max: 120 });

  if (
    body.comments !== undefined &&
    body.comments !== null &&
    typeof body.comments !== 'string'
  ) {
    issues.push('comments must be a string');
  }

  throwInvalid(issues);

  if (body.movementType !== 'ADJUSTMENT_IN' && body.movementType !== 'ADJUSTMENT_OUT') {
    issues.push('movementType must be ADJUSTMENT_IN or ADJUSTMENT_OUT');
    throwInvalid(issues);
  }

  return {
    variantId: body.variantId as string,
    rackId: body.rackId as string,
    movementType: body.movementType as 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT',
    quantity: body.quantity as number,
    reason: body.reason as string,
    comments: typeof body.comments === 'string' ? body.comments : undefined,
  };
}

export function validateTransferStockBody(value: unknown): TransferStockDto {
  const body = objectValue(value);
  const issues: string[] = [];

  requireUuid(body.variantId, 'variantId', issues);
  requireUuid(body.sourceRackId, 'sourceRackId', issues);
  requireUuid(body.destinationRackId, 'destinationRackId', issues);
  requireInventoryQuantity(body.quantity, 'quantity', issues);
  requireString(body.reason, 'reason', issues, { min: 1, max: 120 });

  if (
    body.comments !== undefined &&
    body.comments !== null &&
    typeof body.comments !== 'string'
  ) {
    issues.push('comments must be a string');
  }

  throwInvalid(issues);

  if (body.sourceRackId === body.destinationRackId) {
    throw new BadRequestException({
      message: 'Invalid input',
      issues: ['sourceRackId and destinationRackId must be different'],
    });
  }

  return {
    variantId: body.variantId as string,
    sourceRackId: body.sourceRackId as string,
    destinationRackId: body.destinationRackId as string,
    quantity: body.quantity as number,
    reason: body.reason as string,
    comments: typeof body.comments === 'string' ? body.comments : undefined,
  };
}

export function validateVariantInventoryParams(value: unknown): { variantId: string } {
  const params = objectValue(value);
  const issues: string[] = [];

  requireUuid(params.variantId, 'variantId', issues);
  throwInvalid(issues);
  return { variantId: params.variantId as string };
}

function throwInvalid(issues: string[]) {
  throwIfInvalid(issues, (currentIssues) => {
    throw new BadRequestException({
      message: 'Invalid input',
      issues: currentIssues,
    });
  });
}

function requireInventoryQuantity(
  value: unknown,
  field: string,
  issues: string[],
) {
  const quantity = requireNumber(value, field, issues);

  if (quantity === undefined) {
    return;
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    issues.push(`${field} must be a positive integer`);
  }
}
