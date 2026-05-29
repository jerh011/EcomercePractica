import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationService } from '../common/pagination/pagination.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AdjustStockDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/adjust-stock.dto';
import { ListInventoryQueryDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/list-inventory.dto';
import { ListInventoryMovementsQueryDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/list-inventory-movements.dto';
import { TransferStockDto } from '@ecomercepractica/shared/contracts/inventory/dto/input/transfer-stock.dto';
import { ListInventoryDistributionResultDto } from '@ecomercepractica/shared/contracts/inventory/dto/output/list-inventory-distribution-result.dto';
import { ListInventoryMovementsResultDto } from '@ecomercepractica/shared/contracts/inventory/dto/output/list-inventory-movements-result.dto';
import { ListInventoryResultDto } from '@ecomercepractica/shared/contracts/inventory/dto/output/list-inventory-result.dto';
import { InventoryMutationResultDto } from '@ecomercepractica/shared/contracts/inventory/dto/output/inventory-mutation-result.dto';
import { InventoryVariantDetailDto } from '@ecomercepractica/shared/contracts/inventory/dto/output/inventory-variant-detail.dto';
import {
  normalizeAttributes,
  toInventoryDistributionRowDto,
  toInventoryListItemDto,
  toInventoryMovementDto,
  toInventoryVariantDetailDto,
} from './mappers/inventory.mapper';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
  ) {}

  async listInventory(
    input: ListInventoryQueryDto,
  ): Promise<ListInventoryResultDto> {
    const pageSize = input.pageSize ?? 10;
    const window = this.pagination.offsetWindow(input.page, pageSize);
    const filters = this.inventoryFilterParams(input);

    const [rows, totalRows] = await Promise.all([
      this.prisma.client.$queryRawUnsafe(
        `
          WITH inventory_rows AS (
            SELECT
              v.id AS "variantId",
              v.sku,
              v.minimum_stock AS "minimumStock",
              p.id AS "productId",
              p.name AS "productName",
              p.slug AS "productSlug",
              COALESCE(SUM(ia.quantity), 0)::int AS "stockQuantity",
              COUNT(DISTINCT CASE WHEN ia.quantity > 0 THEN w.id END)::int AS "warehousesWithStock",
              COUNT(DISTINCT CASE WHEN ia.quantity > 0 THEN r.id END)::int AS "rackCountWithStock",
              MAX(im.created_at) AS "lastMovementAt",
              COALESCE(
                jsonb_agg(
                  DISTINCT jsonb_build_object(
                    'id', a.id,
                    'name', a.name,
                    'slug', a.slug
                  )
                ) FILTER (WHERE a.id IS NOT NULL),
                '[]'::jsonb
              ) AS attributes
            FROM variants v
            INNER JOIN products p ON p.id = v.product_id
            LEFT JOIN inventory_allocations ia ON ia.variant_id = v.id
            LEFT JOIN racks r
              ON r.id = ia.rack_id
              AND r.deleted_at IS NULL
              AND r.is_active = TRUE
            LEFT JOIN warehouses w
              ON w.id = r.warehouse_id
              AND w.deleted_at IS NULL
              AND w.is_active = TRUE
            LEFT JOIN inventory_movements im ON im.variant_id = v.id
            LEFT JOIN variant_attribute_values vav ON vav.variant_id = v.id
            LEFT JOIN attributes a
              ON a.id = vav.attribute_id
              AND a.deleted_at IS NULL
              AND a.is_active = TRUE
            WHERE v.deleted_at IS NULL
              AND ($1::text IS NULL OR v.sku ILIKE $2 OR p.name ILIKE $2)
              AND ($3::uuid IS NULL OR w.id = $3::uuid)
              AND ($4::uuid IS NULL OR r.id = $4::uuid)
            GROUP BY v.id, v.sku, v.minimum_stock, p.id, p.name, p.slug
          )
          SELECT *
          FROM inventory_rows
          ORDER BY "productName" ASC, sku ASC
          LIMIT $5 OFFSET $6
        `,
        filters.query,
        filters.queryLike,
        filters.warehouseId,
        filters.rackId,
        window.pageSize,
        window.offset,
      ),
      this.prisma.client.$queryRawUnsafe(
        `
          SELECT COUNT(*)::int AS "totalCount"
          FROM (
            SELECT v.id
            FROM variants v
            INNER JOIN products p ON p.id = v.product_id
            LEFT JOIN inventory_allocations ia ON ia.variant_id = v.id
            LEFT JOIN racks r
              ON r.id = ia.rack_id
              AND r.deleted_at IS NULL
              AND r.is_active = TRUE
            LEFT JOIN warehouses w
              ON w.id = r.warehouse_id
              AND w.deleted_at IS NULL
              AND w.is_active = TRUE
            WHERE v.deleted_at IS NULL
              AND ($1::text IS NULL OR v.sku ILIKE $2 OR p.name ILIKE $2)
              AND ($3::uuid IS NULL OR w.id = $3::uuid)
              AND ($4::uuid IS NULL OR r.id = $4::uuid)
            GROUP BY v.id
          ) counted
        `,
        filters.query,
        filters.queryLike,
        filters.warehouseId,
        filters.rackId,
      ),
    ]);

    const totalCount = totalRows[0]?.totalCount ?? 0;
    const metadata = this.pagination.offsetMetadata(totalCount, window.pageSize);

    return {
      items: (rows as any[]).map((row) => toInventoryListItemDto(row)),
      totalCount: metadata.totalCount,
      totalPages: metadata.totalPages,
    };
  }

  async getInventoryDetail(variantId: string): Promise<{ detail: InventoryVariantDetailDto }> {
    const variant = await this.loadVariantDetailRow(variantId);
    const summary = await this.loadVariantInventorySummary(variantId);
    const recentMovements = await this.listRecentMovements(variantId, 5);

    return {
      detail: toInventoryVariantDetailDto({
        variant: {
          id: variant.id,
          sku: variant.sku,
          minimumStock: variant.minimumStock,
          barcodeGtin: variant.barcodeGtin,
          price: variant.price,
        },
        product: {
          id: variant.productId,
          name: variant.productName,
          slug: variant.productSlug,
        },
        attributes: normalizeAttributes(variant.attributes),
        stockQuantity: summary.stockQuantity,
        warehousesWithStock: summary.warehousesWithStock,
        distributed: summary.rackCountWithStock > 1,
        recentMovements,
      }),
    };
  }

  async getInventoryDistribution(
    variantId: string,
    input: ListInventoryQueryDto,
  ): Promise<{ distribution: ListInventoryDistributionResultDto }> {
    await this.assertVariantExists(variantId);

    const pageSize = input.pageSize ?? 10;
    const window = this.pagination.offsetWindow(input.page, pageSize);

    const [rows, totalRows, summary] = await Promise.all([
      this.prisma.client.$queryRawUnsafe(
        `
          SELECT
            r.id AS "rackId",
            r.code AS "rackCode",
            r.description AS "rackDescription",
            w.id AS "warehouseId",
            w.name AS "warehouseName",
            w.code AS "warehouseCode",
            ia.quantity,
            v.minimum_stock AS "minimumStock",
            ia.updated_at AS "lastUpdatedAt",
            (
              SELECT MAX(im.created_at)
              FROM inventory_movements im
              WHERE im.variant_id = ia.variant_id
                AND (
                  im.source_rack_id = ia.rack_id
                  OR im.destination_rack_id = ia.rack_id
                )
            ) AS "lastMovementAt",
            v.id AS "variantId",
            v.sku
          FROM inventory_allocations ia
          INNER JOIN racks r ON r.id = ia.rack_id
          INNER JOIN warehouses w ON w.id = r.warehouse_id
          INNER JOIN variants v ON v.id = ia.variant_id
          WHERE ia.variant_id = $1
            AND r.deleted_at IS NULL
            AND w.deleted_at IS NULL
          ORDER BY w.name ASC, r.code ASC
          LIMIT $2 OFFSET $3
        `,
        variantId,
        window.pageSize,
        window.offset,
      ),
      this.prisma.client.$queryRawUnsafe(
        `
          SELECT COUNT(*)::int AS "totalCount"
          FROM inventory_allocations ia
          INNER JOIN racks r ON r.id = ia.rack_id
          INNER JOIN warehouses w ON w.id = r.warehouse_id
          WHERE ia.variant_id = $1
            AND r.deleted_at IS NULL
            AND w.deleted_at IS NULL
        `,
        variantId,
      ),
      this.loadVariantInventorySummary(variantId),
    ]);

    const totalCount = totalRows[0]?.totalCount ?? 0;
    const metadata = this.pagination.offsetMetadata(totalCount, window.pageSize);

    return {
      distribution: {
        rows: (rows as any[]).map((row) => toInventoryDistributionRowDto(row)),
        totalCount: metadata.totalCount,
        totalPages: metadata.totalPages,
        stockQuantity: summary.stockQuantity,
        warehousesWithStock: summary.warehousesWithStock,
        minimumStock: summary.minimumStock,
      },
    };
  }

  async listInventoryMovements(
    variantId: string | undefined,
    input: ListInventoryMovementsQueryDto,
  ): Promise<{ movements: ListInventoryMovementsResultDto }> {
    if (variantId) {
      await this.assertVariantExists(variantId);
    }

    const pageSize = input.pageSize ?? 10;
    const window = this.pagination.offsetWindow(input.page, pageSize);

    const [rows, totalRows] = await Promise.all([
      this.prisma.client.$queryRawUnsafe(
        `
          SELECT
            im.id,
            im.movement_type AS "movementType",
            im.quantity,
            im.reason,
            im.comments,
            im.created_at AS "createdAt",
            v.id AS "variantId",
            v.sku,
            v.minimum_stock AS "minimumStock",
            src.id AS "sourceRackId",
            src.code AS "sourceRackCode",
            src.description AS "sourceRackDescription",
            srcw.id AS "sourceWarehouseId",
            srcw.name AS "sourceWarehouseName",
            srcw.code AS "sourceWarehouseCode",
            dst.id AS "destinationRackId",
            dst.code AS "destinationRackCode",
            dst.description AS "destinationRackDescription",
            dstw.id AS "destinationWarehouseId",
            dstw.name AS "destinationWarehouseName",
            dstw.code AS "destinationWarehouseCode",
            u.id AS "performedByUserId",
            COALESCE(NULLIF(TRIM(COALESCE(u.name, '')), ''), TRIM(CONCAT(COALESCE(u."firstName", ''), ' ', COALESCE(u."lastName", '')))) AS "performedByUserName"
          FROM inventory_movements im
          INNER JOIN variants v ON v.id = im.variant_id
          LEFT JOIN racks src ON src.id = im.source_rack_id
          LEFT JOIN warehouses srcw ON srcw.id = src.warehouse_id
          LEFT JOIN racks dst ON dst.id = im.destination_rack_id
          LEFT JOIN warehouses dstw ON dstw.id = dst.warehouse_id
          LEFT JOIN users u ON u.id = im.performed_by_user_id
          WHERE ($1::uuid IS NULL OR im.variant_id = $1::uuid)
            AND ($2::uuid IS NULL OR im.source_rack_id = $2::uuid OR im.destination_rack_id = $2::uuid)
          ORDER BY im.created_at DESC, im.id DESC
          LIMIT $3 OFFSET $4
        `,
        variantId ?? null,
        input.rackId ?? null,
        window.pageSize,
        window.offset,
      ),
      this.prisma.client.$queryRawUnsafe(
        `
          SELECT COUNT(*)::int AS "totalCount"
          FROM inventory_movements im
          WHERE ($1::uuid IS NULL OR im.variant_id = $1::uuid)
            AND ($2::uuid IS NULL OR im.source_rack_id = $2::uuid OR im.destination_rack_id = $2::uuid)
        `,
        variantId ?? null,
        input.rackId ?? null,
      ),
    ]);

    const totalCount = totalRows[0]?.totalCount ?? 0;
    const metadata = this.pagination.offsetMetadata(totalCount, window.pageSize);

    return {
      movements: {
        movements: (rows as any[]).map((row) => toInventoryMovementDto(row)),
        totalCount: metadata.totalCount,
        totalPages: metadata.totalPages,
      },
    };
  }

  async adjustStock(input: AdjustStockDto): Promise<{ result: InventoryMutationResultDto }> {
    await this.assertVariantExists(input.variantId);
    await this.assertRackExists(input.rackId);

    const result = await this.prisma.client.$transaction(async (tx: any) => {
      const currentQuantity = await this.getAllocationQuantity(
        tx,
        input.rackId,
        input.variantId,
      );

      if (input.movementType === 'ADJUSTMENT_OUT' && currentQuantity < input.quantity) {
        throw new BadRequestException(
          'validation error: insufficient stock in the source rack',
        );
      }

      const nextQuantity =
        input.movementType === 'ADJUSTMENT_IN'
          ? currentQuantity + input.quantity
          : currentQuantity - input.quantity;

      await this.upsertAllocation(
        tx,
        input.rackId,
        input.variantId,
        nextQuantity,
      );

      await tx.$executeRawUnsafe(
        `
          INSERT INTO inventory_movements (
            variant_id,
            source_rack_id,
            destination_rack_id,
            movement_type,
            quantity,
            reason,
            comments
          )
          VALUES ($1, $2, $3, $4::"InventoryMovementType", $5, $6, $7)
        `,
        input.variantId,
        input.movementType === 'ADJUSTMENT_OUT' ? input.rackId : null,
        input.movementType === 'ADJUSTMENT_IN' ? input.rackId : null,
        input.movementType,
        input.quantity,
        input.reason,
        input.comments ?? null,
      );

      return this.getVariantStockQuantityTx(tx, input.variantId);
    });

    return {
      result: {
        variantId: input.variantId,
        stockQuantity: result,
        destinationRackId:
          input.movementType === 'ADJUSTMENT_IN' ? input.rackId : undefined,
        sourceRackId:
          input.movementType === 'ADJUSTMENT_OUT' ? input.rackId : undefined,
      },
    };
  }

  async transferStock(input: TransferStockDto): Promise<{ result: InventoryMutationResultDto }> {
    await this.assertVariantExists(input.variantId);
    await this.assertRackExists(input.sourceRackId);
    await this.assertRackExists(input.destinationRackId);

    const result = await this.prisma.client.$transaction(async (tx: any) => {
      const sourceQuantity = await this.getAllocationQuantity(
        tx,
        input.sourceRackId,
        input.variantId,
      );

      if (sourceQuantity < input.quantity) {
        throw new BadRequestException(
          'validation error: insufficient stock in the source rack',
        );
      }

      const destinationQuantity = await this.getAllocationQuantity(
        tx,
        input.destinationRackId,
        input.variantId,
      );

      await this.upsertAllocation(
        tx,
        input.sourceRackId,
        input.variantId,
        sourceQuantity - input.quantity,
      );
      await this.upsertAllocation(
        tx,
        input.destinationRackId,
        input.variantId,
        destinationQuantity + input.quantity,
      );

      await tx.$executeRawUnsafe(
        `
          INSERT INTO inventory_movements (
            variant_id,
            source_rack_id,
            destination_rack_id,
            movement_type,
            quantity,
            reason,
            comments
          )
          VALUES ($1, $2, $3, 'TRANSFER'::"InventoryMovementType", $4, $5, $6)
        `,
        input.variantId,
        input.sourceRackId,
        input.destinationRackId,
        input.quantity,
        input.reason,
        input.comments ?? null,
      );

      return this.getVariantStockQuantityTx(tx, input.variantId);
    });

    return {
      result: {
        variantId: input.variantId,
        stockQuantity: result,
        sourceRackId: input.sourceRackId,
        destinationRackId: input.destinationRackId,
      },
    };
  }

  async loadVariantStockMap(variantIds: string[]): Promise<Map<string, number>> {
    if (variantIds.length === 0) {
      return new Map();
    }

    const placeholders = variantIds.map((_, index) => `$${index + 1}`).join(', ');
    const rows = await this.prisma.client.$queryRawUnsafe(
      `
        SELECT
          ia.variant_id AS "variantId",
          COALESCE(SUM(ia.quantity), 0)::int AS "stockQuantity"
        FROM inventory_allocations ia
        INNER JOIN racks r ON r.id = ia.rack_id
        INNER JOIN warehouses w ON w.id = r.warehouse_id
        WHERE ia.variant_id IN (${placeholders})
          AND r.deleted_at IS NULL
          AND r.is_active = TRUE
          AND w.deleted_at IS NULL
          AND w.is_active = TRUE
        GROUP BY ia.variant_id
      `,
      ...variantIds,
    );

    const result = new Map<string, number>();
    for (const variantId of variantIds) {
      result.set(variantId, 0);
    }

    for (const row of rows as Array<{ variantId: string; stockQuantity: number }>) {
      result.set(row.variantId, row.stockQuantity);
    }

    return result;
  }

  private inventoryFilterParams(input: ListInventoryQueryDto) {
    const query = input.query?.trim();

    return {
      query: query && query.length > 0 ? query : null,
      queryLike: query && query.length > 0 ? `%${query}%` : null,
      warehouseId: input.warehouseId ?? null,
      rackId: input.rackId ?? null,
    };
  }

  private async loadVariantDetailRow(variantId: string) {
    const rows = await this.prisma.client.$queryRawUnsafe(
      `
        SELECT
          v.id,
          v.sku,
          v.minimum_stock AS "minimumStock",
          v.barcode_gtin AS "barcodeGtin",
          v.price::text AS price,
          p.id AS "productId",
          p.name AS "productName",
          p.slug AS "productSlug",
          COALESCE(
            jsonb_agg(
              DISTINCT jsonb_build_object(
                'id', a.id,
                'name', a.name,
                'slug', a.slug
              )
            ) FILTER (WHERE a.id IS NOT NULL),
            '[]'::jsonb
          ) AS attributes
        FROM variants v
        INNER JOIN products p ON p.id = v.product_id
        LEFT JOIN variant_attribute_values vav ON vav.variant_id = v.id
        LEFT JOIN attributes a
          ON a.id = vav.attribute_id
          AND a.deleted_at IS NULL
          AND a.is_active = TRUE
        WHERE v.id = $1
          AND v.deleted_at IS NULL
        GROUP BY v.id, p.id
      `,
      variantId,
    );

    const row = rows[0];
    if (!row) {
      throw new NotFoundException('inventory variant not found');
    }

    return row;
  }

  private async loadVariantInventorySummary(variantId: string) {
    const rows = await this.prisma.client.$queryRawUnsafe(
      `
        SELECT
          v.minimum_stock AS "minimumStock",
          COALESCE(SUM(ia.quantity), 0)::int AS "stockQuantity",
          COUNT(DISTINCT CASE WHEN ia.quantity > 0 THEN w.id END)::int AS "warehousesWithStock",
          COUNT(DISTINCT CASE WHEN ia.quantity > 0 THEN r.id END)::int AS "rackCountWithStock"
        FROM variants v
        LEFT JOIN inventory_allocations ia ON ia.variant_id = v.id
        LEFT JOIN racks r
          ON r.id = ia.rack_id
          AND r.deleted_at IS NULL
          AND r.is_active = TRUE
        LEFT JOIN warehouses w
          ON w.id = r.warehouse_id
          AND w.deleted_at IS NULL
          AND w.is_active = TRUE
        WHERE v.id = $1
          AND v.deleted_at IS NULL
        GROUP BY v.id
      `,
      variantId,
    );

    const row = rows[0];
    if (!row) {
      throw new NotFoundException('inventory variant not found');
    }

    return row as {
      minimumStock: number;
      stockQuantity: number;
      warehousesWithStock: number;
      rackCountWithStock: number;
    };
  }

  private async listRecentMovements(
    variantId: string,
    limit: number,
  ) {
    const rows = await this.prisma.client.$queryRawUnsafe(
      `
        SELECT
          im.id,
          im.movement_type AS "movementType",
          im.quantity,
          im.reason,
          im.comments,
          im.created_at AS "createdAt",
          v.id AS "variantId",
          v.sku,
          v.minimum_stock AS "minimumStock",
          src.id AS "sourceRackId",
          src.code AS "sourceRackCode",
          src.description AS "sourceRackDescription",
          srcw.id AS "sourceWarehouseId",
          srcw.name AS "sourceWarehouseName",
          srcw.code AS "sourceWarehouseCode",
          dst.id AS "destinationRackId",
          dst.code AS "destinationRackCode",
          dst.description AS "destinationRackDescription",
          dstw.id AS "destinationWarehouseId",
          dstw.name AS "destinationWarehouseName",
          dstw.code AS "destinationWarehouseCode",
          u.id AS "performedByUserId",
          COALESCE(NULLIF(TRIM(COALESCE(u.name, '')), ''), TRIM(CONCAT(COALESCE(u."firstName", ''), ' ', COALESCE(u."lastName", '')))) AS "performedByUserName"
        FROM inventory_movements im
        INNER JOIN variants v ON v.id = im.variant_id
        LEFT JOIN racks src ON src.id = im.source_rack_id
        LEFT JOIN warehouses srcw ON srcw.id = src.warehouse_id
        LEFT JOIN racks dst ON dst.id = im.destination_rack_id
        LEFT JOIN warehouses dstw ON dstw.id = dst.warehouse_id
        LEFT JOIN users u ON u.id = im.performed_by_user_id
        WHERE im.variant_id = $1
        ORDER BY im.created_at DESC, im.id DESC
        LIMIT $2
      `,
      variantId,
      limit,
    );

    return (rows as any[]).map((row) => toInventoryMovementDto(row));
  }

  private async assertVariantExists(variantId: string) {
    const rows = await this.prisma.client.$queryRawUnsafe(
      `
        SELECT id
        FROM variants
        WHERE id = $1
          AND deleted_at IS NULL
        LIMIT 1
      `,
      variantId,
    );

    if (!rows[0]) {
      throw new NotFoundException('inventory variant not found');
    }
  }

  private async assertRackExists(rackId: string) {
    const rows = await this.prisma.client.$queryRawUnsafe(
      `
        SELECT r.id
        FROM racks r
        INNER JOIN warehouses w ON w.id = r.warehouse_id
        WHERE r.id = $1
          AND r.deleted_at IS NULL
          AND r.is_active = TRUE
          AND w.deleted_at IS NULL
          AND w.is_active = TRUE
        LIMIT 1
      `,
      rackId,
    );

    if (!rows[0]) {
      throw new NotFoundException('inventory rack not found');
    }
  }

  private async getAllocationQuantity(
    tx: any,
    rackId: string,
    variantId: string,
  ): Promise<number> {
    const rows = await tx.$queryRawUnsafe(
      `
        SELECT quantity
        FROM inventory_allocations
        WHERE rack_id = $1
          AND variant_id = $2
        LIMIT 1
      `,
      rackId,
      variantId,
    );

    return rows[0]?.quantity ?? 0;
  }

  private async upsertAllocation(
    tx: any,
    rackId: string,
    variantId: string,
    quantity: number,
  ) {
    const rows = await tx.$queryRawUnsafe(
      `
        SELECT 1
        FROM inventory_allocations
        WHERE rack_id = $1
          AND variant_id = $2
        LIMIT 1
      `,
      rackId,
      variantId,
    );

    if (rows[0]) {
      await tx.$executeRawUnsafe(
        `
          UPDATE inventory_allocations
          SET
            quantity = $3,
            updated_at = NOW()
          WHERE rack_id = $1
            AND variant_id = $2
        `,
        rackId,
        variantId,
        quantity,
      );
      return;
    }

    await tx.$executeRawUnsafe(
      `
        INSERT INTO inventory_allocations (
          rack_id,
          variant_id,
          quantity
        )
        VALUES ($1, $2, $3)
      `,
      rackId,
      variantId,
      quantity,
    );
  }

  private async getVariantStockQuantityTx(tx: any, variantId: string): Promise<number> {
    const rows = await tx.$queryRawUnsafe(
      `
        SELECT COALESCE(SUM(quantity), 0)::int AS "stockQuantity"
        FROM inventory_allocations
        WHERE variant_id = $1
      `,
      variantId,
    );

    return rows[0]?.stockQuantity ?? 0;
  }
}
