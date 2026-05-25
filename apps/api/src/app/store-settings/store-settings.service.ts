import { BadRequestException, Injectable } from '@nestjs/common';
import { UpsertGeneralStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/input/upsert-general-store-settings.dto';
import { UpsertIdentityStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/input/upsert-identity-store-settings.dto';
import { UpsertContactStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/input/upsert-contact-store-settings.dto';
import { UpsertFiscalStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/input/upsert-fiscal-store-settings.dto';
import { GeneralStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/output/general-store-settings.dto';
import { IdentityStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/output/identity-store-settings.dto';
import { ContactStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/output/contact-store-settings.dto';
import { FiscalStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/output/fiscal-store-settings.dto';
import {
  MexicoMunicipalityDto,
  MexicoStateDto,
} from '@ecomercepractica/shared/contracts/store-settings/dto/output/mexico-location.dto';
import { TaxRegimeDto } from '@ecomercepractica/shared/contracts/store-settings/dto/output/tax-regime.dto';
import { PrismaService } from '../../prisma/prisma.service';
import {
  toMexicoMunicipalityDto,
  toMexicoStateDto,
  toContactStoreSettingsDto,
  toFiscalStoreSettingsDto,
  toGeneralStoreSettingsDto,
  toIdentityStoreSettingsDto,
  toTaxRegimeDto,
} from './mappers/store-settings.mapper';

const STORE_SETTINGS_KEY = 'default';
const STORE_SETTINGS_RELATION_INCLUDE = {
  contactState: true,
  contactMunicipality: true,
  taxRegime: true,
  taxState: true,
  taxMunicipality: true,
} as const;

@Injectable()
export class StoreSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGeneralSettings(): Promise<GeneralStoreSettingsDto | null> {
    const row = await this.prisma.client.storeSettings.findUnique({
      where: {
        settingsKey: STORE_SETTINGS_KEY,
      },
      include: STORE_SETTINGS_RELATION_INCLUDE,
    });

    return toGeneralStoreSettingsDto(row);
  }

  async upsertGeneralSettings(
    input: UpsertGeneralStoreSettingsDto,
  ): Promise<GeneralStoreSettingsDto> {
    const row = await this.prisma.client.storeSettings.upsert({
      where: {
        settingsKey: STORE_SETTINGS_KEY,
      },
      update: {
        commercialName: input.commercialName,
        legalName: input.legalName,
        shortDescription: input.shortDescription ?? null,
        longDescription: input.longDescription ?? null,
        updatedAt: new Date(),
      },
      create: {
        settingsKey: STORE_SETTINGS_KEY,
        commercialName: input.commercialName,
        legalName: input.legalName,
        shortDescription: input.shortDescription ?? null,
        longDescription: input.longDescription ?? null,
      },
      include: STORE_SETTINGS_RELATION_INCLUDE,
    });

    return toGeneralStoreSettingsDto(row) as GeneralStoreSettingsDto;
  }

  async getIdentitySettings(): Promise<IdentityStoreSettingsDto | null> {
    const row = await this.prisma.client.storeSettings.findUnique({
      where: {
        settingsKey: STORE_SETTINGS_KEY,
      },
      include: STORE_SETTINGS_RELATION_INCLUDE,
    });

    return toIdentityStoreSettingsDto(row);
  }

  async upsertIdentitySettings(
    input: UpsertIdentityStoreSettingsDto,
  ): Promise<IdentityStoreSettingsDto> {
    const row = await this.prisma.client.storeSettings.upsert({
      where: {
        settingsKey: STORE_SETTINGS_KEY,
      },
      update: {
        primaryLogoUrl: this.emptyToNull(input.primaryLogoUrl),
        alternateLogoUrl: this.emptyToNull(input.alternateLogoUrl),
        primaryColorHex: this.normalizeColorHex(input.primaryColorHex),
        secondaryColorHex: this.normalizeColorHex(input.secondaryColorHex),
        accentColorHex: this.normalizeColorHex(input.accentColorHex),
        updatedAt: new Date(),
      },
      create: {
        settingsKey: STORE_SETTINGS_KEY,
        primaryLogoUrl: this.emptyToNull(input.primaryLogoUrl),
        alternateLogoUrl: this.emptyToNull(input.alternateLogoUrl),
        primaryColorHex: this.normalizeColorHex(input.primaryColorHex),
        secondaryColorHex: this.normalizeColorHex(input.secondaryColorHex),
        accentColorHex: this.normalizeColorHex(input.accentColorHex),
      },
      include: STORE_SETTINGS_RELATION_INCLUDE,
    });

    return toIdentityStoreSettingsDto(row) as IdentityStoreSettingsDto;
  }

  async getContactSettings(): Promise<ContactStoreSettingsDto | null> {
    const row = await this.prisma.client.storeSettings.findUnique({
      where: {
        settingsKey: STORE_SETTINGS_KEY,
      },
      include: STORE_SETTINGS_RELATION_INCLUDE,
    });

    return toContactStoreSettingsDto(row);
  }

  async upsertContactSettings(
    input: UpsertContactStoreSettingsDto,
  ): Promise<ContactStoreSettingsDto> {
    await this.validateLocation(
      this.emptyToNull(input.fiscalStateId),
      this.emptyToNull(input.fiscalMunicipalityId),
      'fiscal',
    );

    const row = await this.prisma.client.storeSettings.upsert({
      where: {
        settingsKey: STORE_SETTINGS_KEY,
      },
      update: {
        contactEmail: this.emptyToNull(input.contactEmail),
        phoneCountryCode: this.emptyToNull(input.phoneCountryCode),
        phoneNumber: this.emptyToNull(input.phoneNumber),
        whatsappCountryCode: this.emptyToNull(input.whatsappCountryCode),
        whatsappNumber: this.emptyToNull(input.whatsappNumber),
        fiscalStateId: this.emptyToNull(input.fiscalStateId),
        fiscalMunicipalityId: this.emptyToNull(input.fiscalMunicipalityId),
        settlement: this.emptyToNull(input.settlement),
        postalCode: this.emptyToNull(input.postalCode),
        street: this.emptyToNull(input.street),
        streetNumber: this.emptyToNull(input.streetNumber),
        addressReferences: this.emptyToNull(input.addressReferences),
        updatedAt: new Date(),
      },
      create: {
        settingsKey: STORE_SETTINGS_KEY,
        contactEmail: this.emptyToNull(input.contactEmail),
        phoneCountryCode: this.emptyToNull(input.phoneCountryCode),
        phoneNumber: this.emptyToNull(input.phoneNumber),
        whatsappCountryCode: this.emptyToNull(input.whatsappCountryCode),
        whatsappNumber: this.emptyToNull(input.whatsappNumber),
        fiscalStateId: this.emptyToNull(input.fiscalStateId),
        fiscalMunicipalityId: this.emptyToNull(input.fiscalMunicipalityId),
        settlement: this.emptyToNull(input.settlement),
        postalCode: this.emptyToNull(input.postalCode),
        street: this.emptyToNull(input.street),
        streetNumber: this.emptyToNull(input.streetNumber),
        addressReferences: this.emptyToNull(input.addressReferences),
      },
      include: STORE_SETTINGS_RELATION_INCLUDE,
    });

    return toContactStoreSettingsDto(row) as ContactStoreSettingsDto;
  }

  async getFiscalSettings(): Promise<FiscalStoreSettingsDto | null> {
    const row = await this.prisma.client.storeSettings.findUnique({
      where: {
        settingsKey: STORE_SETTINGS_KEY,
      },
      include: STORE_SETTINGS_RELATION_INCLUDE,
    });

    return toFiscalStoreSettingsDto(row);
  }

  async upsertFiscalSettings(
    input: UpsertFiscalStoreSettingsDto,
  ): Promise<FiscalStoreSettingsDto> {
    const taxRegimeCode = this.emptyToNull(input.taxRegimeCode);
    const taxStateId = this.emptyToNull(input.taxStateId);
    const taxMunicipalityId = this.emptyToNull(input.taxMunicipalityId);

    await this.validateTaxRegime(taxRegimeCode);
    await this.validateLocation(taxStateId, taxMunicipalityId, 'tax');

    const row = await this.prisma.client.storeSettings.upsert({
      where: {
        settingsKey: STORE_SETTINGS_KEY,
      },
      update: {
        taxId: this.normalizeTaxId(input.taxId),
        taxRegimeCode,
        taxStateId,
        taxMunicipalityId,
        taxSettlement: this.emptyToNull(input.taxSettlement),
        taxPostalCode: this.emptyToNull(input.taxPostalCode),
        taxStreet: this.emptyToNull(input.taxStreet),
        taxStreetNumber: this.emptyToNull(input.taxStreetNumber),
        taxAddressReferences: this.emptyToNull(input.taxAddressReferences),
        updatedAt: new Date(),
      },
      create: {
        settingsKey: STORE_SETTINGS_KEY,
        taxId: this.normalizeTaxId(input.taxId),
        taxRegimeCode,
        taxStateId,
        taxMunicipalityId,
        taxSettlement: this.emptyToNull(input.taxSettlement),
        taxPostalCode: this.emptyToNull(input.taxPostalCode),
        taxStreet: this.emptyToNull(input.taxStreet),
        taxStreetNumber: this.emptyToNull(input.taxStreetNumber),
        taxAddressReferences: this.emptyToNull(input.taxAddressReferences),
      },
      include: STORE_SETTINGS_RELATION_INCLUDE,
    });

    return toFiscalStoreSettingsDto(row) as FiscalStoreSettingsDto;
  }

  async listMexicoStates(): Promise<MexicoStateDto[]> {
    const rows = await this.prisma.client.mexicoState.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return rows.map(toMexicoStateDto);
  }

  async listMexicoMunicipalities(
    stateId?: string,
  ): Promise<MexicoMunicipalityDto[]> {
    const rows = await this.prisma.client.mexicoMunicipality.findMany({
      where: stateId ? { stateId } : undefined,
      orderBy: {
        name: 'asc',
      },
    });

    return rows.map(toMexicoMunicipalityDto);
  }

  async listTaxRegimes(): Promise<TaxRegimeDto[]> {
    const rows = await this.prisma.client.taxRegime.findMany({
      orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
    });

    return rows.map(toTaxRegimeDto);
  }

  private emptyToNull(value: string | null | undefined): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private normalizeTaxId(value: string | null | undefined): string | null {
    const normalized = this.emptyToNull(value);
    return normalized ? normalized.toUpperCase() : null;
  }

  private normalizeColorHex(value: string | null | undefined): string {
    return (this.emptyToNull(value) ?? '').toUpperCase();
  }

  private async validateLocation(
    stateId: string | null,
    municipalityId: string | null,
    prefix: 'fiscal' | 'tax',
  ): Promise<void> {
    if (!stateId && municipalityId) {
      throw new BadRequestException(
        `${prefix}StateId is required when ${prefix}MunicipalityId is provided`,
      );
    }

    if (!stateId) {
      return;
    }

    const state = await this.prisma.client.mexicoState.findUnique({
      where: {
        id: stateId,
      },
      select: {
        id: true,
      },
    });

    if (!state) {
      throw new BadRequestException(
        `${prefix}StateId must reference a valid state`,
      );
    }

    if (!municipalityId) {
      return;
    }

    const municipality = await this.prisma.client.mexicoMunicipality.findFirst({
      where: {
        id: municipalityId,
        stateId,
      },
      select: {
        id: true,
      },
    });

    if (!municipality) {
      throw new BadRequestException(
        `${prefix}MunicipalityId must reference a valid municipality for ${prefix}StateId`,
      );
    }
  }

  private async validateTaxRegime(code: string | null): Promise<void> {
    if (!code) {
      return;
    }

    const regime = await this.prisma.client.taxRegime.findUnique({
      where: {
        code,
      },
      select: {
        code: true,
      },
    });

    if (!regime) {
      throw new BadRequestException(
        'taxRegimeCode must reference a valid tax regime',
      );
    }
  }
}
