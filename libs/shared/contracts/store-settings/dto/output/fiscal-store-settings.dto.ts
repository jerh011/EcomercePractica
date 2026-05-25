import type {
  MexicoMunicipalityCatalogSummaryDto,
  MexicoStateCatalogSummaryDto,
  TaxRegimeCatalogSummaryDto,
} from '../../../common/dto/output/entity-summary.dto.js';

export class FiscalStoreSettingsDto {
  id!: string;
  taxId?: string;
  taxRegime?: TaxRegimeCatalogSummaryDto;
  taxState?: MexicoStateCatalogSummaryDto;
  taxMunicipality?: MexicoMunicipalityCatalogSummaryDto;
  taxSettlement?: string;
  taxPostalCode?: string;
  taxStreet?: string;
  taxStreetNumber?: string;
  taxAddressReferences?: string;
  createdAt!: Date | null;
  updatedAt!: Date | null;
}
