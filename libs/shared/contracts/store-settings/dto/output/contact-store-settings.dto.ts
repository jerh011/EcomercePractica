import type {
  MexicoMunicipalityCatalogSummaryDto,
  MexicoStateCatalogSummaryDto,
} from '../../../common/dto/output/entity-summary.dto.js';

export class ContactStoreSettingsDto {
  id!: string;
  contactEmail?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  whatsappCountryCode?: string;
  whatsappNumber?: string;
  fiscalState?: MexicoStateCatalogSummaryDto;
  fiscalMunicipality?: MexicoMunicipalityCatalogSummaryDto;
  settlement?: string;
  postalCode?: string;
  street?: string;
  streetNumber?: string;
  addressReferences?: string;
  createdAt!: Date | null;
  updatedAt!: Date | null;
}
