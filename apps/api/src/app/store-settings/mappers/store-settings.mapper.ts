import type { GeneralStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/output/general-store-settings.dto';
import type { IdentityStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/output/identity-store-settings.dto';
import type { ContactStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/output/contact-store-settings.dto';
import type { FiscalStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/output/fiscal-store-settings.dto';
import type {
  MexicoMunicipalityDto,
  MexicoStateDto,
} from '@ecomercepractica/shared/contracts/store-settings/dto/output/mexico-location.dto';
import type { TaxRegimeDto } from '@ecomercepractica/shared/contracts/store-settings/dto/output/tax-regime.dto';
import type {
  MexicoMunicipalityCatalogSummaryDto,
  MexicoStateCatalogSummaryDto,
  TaxRegimeCatalogSummaryDto,
} from '@ecomercepractica/shared/contracts/common/dto/output/entity-summary.dto';

const DEFAULT_PRIMARY_COLOR_HEX = '#3B82F6';
const DEFAULT_SECONDARY_COLOR_HEX = '#1698B8';
const DEFAULT_ACCENT_COLOR_HEX = '#F59E0B';

export interface StoreSettingsRow {
  id: string;
  commercialName: string | null;
  legalName: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  primaryLogoUrl: string | null;
  alternateLogoUrl: string | null;
  primaryColorHex: string | null;
  secondaryColorHex: string | null;
  accentColorHex: string | null;
  contactEmail: string | null;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  whatsappCountryCode: string | null;
  whatsappNumber: string | null;
  fiscalStateId: string | null;
  fiscalMunicipalityId: string | null;
  settlement: string | null;
  postalCode: string | null;
  street: string | null;
  streetNumber: string | null;
  addressReferences: string | null;
  taxId: string | null;
  taxRegimeCode: string | null;
  taxStateId: string | null;
  taxMunicipalityId: string | null;
  taxSettlement: string | null;
  taxPostalCode: string | null;
  taxStreet: string | null;
  taxStreetNumber: string | null;
  taxAddressReferences: string | null;
  createdAt: Date;
  updatedAt: Date;
  contactState?: MexicoStateRow | null;
  contactMunicipality?: MexicoMunicipalityRow | null;
  taxRegime?: TaxRegimeRow | null;
  taxState?: MexicoStateRow | null;
  taxMunicipality?: MexicoMunicipalityRow | null;
}

export interface MexicoStateRow {
  id: string;
  code: string;
  name: string;
}

export interface MexicoMunicipalityRow {
  id: string;
  stateId: string;
  code: string | null;
  name: string;
}

export interface TaxRegimeRow {
  code: string;
  name: string;
  personType: string | null;
}

function toMexicoStateCatalogSummaryDto(
  row?: MexicoStateRow | null,
): MexicoStateCatalogSummaryDto | undefined {
  if (!row) {
    return undefined;
  }

  return {
    id: row.id,
    code: row.code,
    name: row.name,
  };
}

function toMexicoMunicipalityCatalogSummaryDto(
  row?: MexicoMunicipalityRow | null,
): MexicoMunicipalityCatalogSummaryDto | undefined {
  if (!row) {
    return undefined;
  }

  return {
    id: row.id,
    stateId: row.stateId,
    code: row.code ?? undefined,
    name: row.name,
  };
}

function toTaxRegimeCatalogSummaryDto(
  row?: TaxRegimeRow | null,
): TaxRegimeCatalogSummaryDto | undefined {
  if (!row) {
    return undefined;
  }

  return {
    code: row.code,
    name: row.name,
    personType: row.personType ?? undefined,
  };
}

export function toGeneralStoreSettingsDto(
  row?: StoreSettingsRow | null,
): GeneralStoreSettingsDto | null {
  if (!row || !row.commercialName || !row.legalName) {
    return null;
  }

  return {
    id: row.id,
    commercialName: row.commercialName,
    legalName: row.legalName,
    shortDescription: row.shortDescription ?? undefined,
    longDescription: row.longDescription ?? undefined,
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null,
  };
}

export function toIdentityStoreSettingsDto(
  row?: StoreSettingsRow | null,
): IdentityStoreSettingsDto | null {
  if (!row) {
    return null;
  }

  const hasIdentityData = Boolean(
    row.primaryLogoUrl ||
      row.alternateLogoUrl ||
      row.primaryColorHex ||
      row.secondaryColorHex ||
      row.accentColorHex,
  );

  if (!hasIdentityData) {
    return null;
  }

  return {
    id: row.id,
    primaryLogoUrl: row.primaryLogoUrl ?? undefined,
    alternateLogoUrl: row.alternateLogoUrl ?? undefined,
    primaryColorHex: row.primaryColorHex ?? DEFAULT_PRIMARY_COLOR_HEX,
    secondaryColorHex: row.secondaryColorHex ?? DEFAULT_SECONDARY_COLOR_HEX,
    accentColorHex: row.accentColorHex ?? DEFAULT_ACCENT_COLOR_HEX,
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null,
  };
}

export function toContactStoreSettingsDto(
  row?: StoreSettingsRow | null,
): ContactStoreSettingsDto | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    contactEmail: row.contactEmail ?? undefined,
    phoneCountryCode: row.phoneCountryCode ?? undefined,
    phoneNumber: row.phoneNumber ?? undefined,
    whatsappCountryCode: row.whatsappCountryCode ?? undefined,
    whatsappNumber: row.whatsappNumber ?? undefined,
    fiscalState: toMexicoStateCatalogSummaryDto(row.contactState),
    fiscalMunicipality: toMexicoMunicipalityCatalogSummaryDto(
      row.contactMunicipality,
    ),
    settlement: row.settlement ?? undefined,
    postalCode: row.postalCode ?? undefined,
    street: row.street ?? undefined,
    streetNumber: row.streetNumber ?? undefined,
    addressReferences: row.addressReferences ?? undefined,
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null,
  };
}

export function toFiscalStoreSettingsDto(
  row?: StoreSettingsRow | null,
): FiscalStoreSettingsDto | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    taxId: row.taxId ?? undefined,
    taxRegime: toTaxRegimeCatalogSummaryDto(row.taxRegime),
    taxState: toMexicoStateCatalogSummaryDto(row.taxState),
    taxMunicipality: toMexicoMunicipalityCatalogSummaryDto(row.taxMunicipality),
    taxSettlement: row.taxSettlement ?? undefined,
    taxPostalCode: row.taxPostalCode ?? undefined,
    taxStreet: row.taxStreet ?? undefined,
    taxStreetNumber: row.taxStreetNumber ?? undefined,
    taxAddressReferences: row.taxAddressReferences ?? undefined,
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null,
  };
}

export function toMexicoStateDto(row: MexicoStateRow): MexicoStateDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
  };
}

export function toMexicoMunicipalityDto(
  row: MexicoMunicipalityRow,
): MexicoMunicipalityDto {
  return {
    id: row.id,
    stateId: row.stateId,
    code: row.code ?? undefined,
    name: row.name,
  };
}

export function toTaxRegimeDto(row: TaxRegimeRow): TaxRegimeDto {
  return {
    code: row.code,
    name: row.name,
    personType: row.personType ?? undefined,
  };
}
