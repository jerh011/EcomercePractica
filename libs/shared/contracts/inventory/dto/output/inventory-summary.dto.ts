import type {
  MexicoMunicipalityCatalogSummaryDto,
  MexicoStateCatalogSummaryDto,
} from '../../../common/dto/output/entity-summary.dto.js';

export interface WarehouseSummaryDto {
  id: string;
  name: string;
  code: string;
}

export interface RackSummaryDto {
  id: string;
  code: string;
  description?: string;
  warehouse: WarehouseSummaryDto;
}

export interface InventoryVariantSummaryDto {
  id: string;
  sku: string;
  minimumStock: number;
}

export interface WarehouseLocationDto {
  state: MexicoStateCatalogSummaryDto;
  municipality: MexicoMunicipalityCatalogSummaryDto;
}
