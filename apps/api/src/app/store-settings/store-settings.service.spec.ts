import { BadRequestException } from '@nestjs/common';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { StoreSettingsService } from './store-settings.service';

describe('StoreSettingsService', () => {
  const stateId = 'f242f574-d355-4fec-b86a-9269d18ed94a';
  const municipalityId = '09c303de-5d56-4d8a-9d8c-38c0ded0387d';
  const taxRegimeCode = '601';

  let storeSettings: {
    findUnique: jest.Mock;
    upsert: jest.Mock;
  };
  let mexicoState: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
  };
  let mexicoMunicipality: {
    findFirst: jest.Mock;
    findMany: jest.Mock;
  };
  let taxRegime: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
  };
  let service: StoreSettingsService;

  beforeEach(() => {
    storeSettings = {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    };
    mexicoState = {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    };
    mexicoMunicipality = {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    };
    taxRegime = {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    };

    service = new StoreSettingsService({
      client: {
        storeSettings,
        mexicoState,
        mexicoMunicipality,
        taxRegime,
      },
    } as never);
  });

  describe('General tab', () => {
    it('returns null when general settings are incomplete', async () => {
      storeSettings.findUnique.mockResolvedValue({
        id: 'settings-id',
        commercialName: null,
        legalName: 'Comercio MX SA de CV',
      });

      await expect(service.getGeneralSettings()).resolves.toBeNull();
    });

    it('maps general settings rows into DTOs', async () => {
      const row = createStoreSettingsRow({
        commercialName: 'MA Store',
        legalName: 'MA Store SA',
        shortDescription: 'Short',
        longDescription: 'Long',
      });
      storeSettings.findUnique.mockResolvedValue(row);

      await expect(service.getGeneralSettings()).resolves.toEqual({
        id: 'settings-id',
        commercialName: 'MA Store',
        legalName: 'MA Store SA',
        shortDescription: 'Short',
        longDescription: 'Long',
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      });
    });

    it('upserts general settings and maps nullable descriptions', async () => {
      const row = createStoreSettingsRow({
        commercialName: 'Comercio MX',
        legalName: 'Comercio MX SA de CV',
        shortDescription: null,
        longDescription: 'Descripcion completa',
      });
      storeSettings.upsert.mockResolvedValue(row);

      await expect(
        service.upsertGeneralSettings({
          commercialName: 'Comercio MX',
          legalName: 'Comercio MX SA de CV',
          shortDescription: '',
          longDescription: 'Descripcion completa',
        }),
      ).resolves.toMatchObject({
        id: row.id,
        commercialName: 'Comercio MX',
        legalName: 'Comercio MX SA de CV',
        shortDescription: undefined,
        longDescription: 'Descripcion completa',
      });
    });
  });

  describe('Identity tab', () => {
    it('upserts identity settings and normalizes colors to uppercase', async () => {
      const row = createStoreSettingsRow({
        primaryLogoUrl: 'https://example.test/logo.png',
        alternateLogoUrl: null,
        primaryColorHex: '#3B82F6',
        secondaryColorHex: '#1698B8',
        accentColorHex: '#F59E0B',
      });
      storeSettings.upsert.mockResolvedValue(row);

      await expect(
        service.upsertIdentitySettings({
          primaryLogoUrl: 'https://example.test/logo.png',
          alternateLogoUrl: '',
          primaryColorHex: '#3b82f6',
          secondaryColorHex: '#1698b8',
          accentColorHex: '#f59e0b',
        }),
      ).resolves.toMatchObject({
        primaryLogoUrl: 'https://example.test/logo.png',
        alternateLogoUrl: undefined,
        primaryColorHex: '#3B82F6',
        secondaryColorHex: '#1698B8',
        accentColorHex: '#F59E0B',
      });
    });

    it('trims identity logo urls before upserting', async () => {
      storeSettings.upsert.mockResolvedValue(
        createStoreSettingsRow({
          primaryLogoUrl: 'https://example.com/logo.png',
          alternateLogoUrl: null,
          primaryColorHex: '#ABCDEF',
          secondaryColorHex: '#123456',
          accentColorHex: '#FEDCBA',
        }),
      );

      await expect(
        service.upsertIdentitySettings({
          primaryLogoUrl: ' https://example.com/logo.png ',
          alternateLogoUrl: '   ',
          primaryColorHex: '#abcdef',
          secondaryColorHex: '#123456',
          accentColorHex: '#fedcba',
        }),
      ).resolves.toMatchObject({
        primaryLogoUrl: 'https://example.com/logo.png',
        alternateLogoUrl: undefined,
        primaryColorHex: '#ABCDEF',
        secondaryColorHex: '#123456',
        accentColorHex: '#FEDCBA',
      });
    });
  });

  describe('Contact tab', () => {
    it('upserts contact settings and returns catalog summaries', async () => {
      mexicoState.findUnique.mockResolvedValue({ id: stateId });
      mexicoMunicipality.findFirst.mockResolvedValue({ id: municipalityId });
      const row = createStoreSettingsRow({
        contactEmail: 'contacto@example.test',
        phoneCountryCode: '+52',
        phoneNumber: '6441234567',
        whatsappCountryCode: '+52',
        whatsappNumber: '6441234567',
        fiscalStateId: stateId,
        fiscalMunicipalityId: municipalityId,
        settlement: 'Centro',
        postalCode: '85000',
        street: 'Miguel Aleman',
        streetNumber: '100',
        addressReferences: 'Frente a la plaza',
        contactState: { id: stateId, code: '26', name: 'Sonora' },
        contactMunicipality: {
          id: municipalityId,
          stateId,
          code: '018',
          name: 'Cajeme',
        },
      });
      storeSettings.upsert.mockResolvedValue(row);

      await expect(
        service.upsertContactSettings({
          contactEmail: 'contacto@example.test',
          phoneCountryCode: '+52',
          phoneNumber: '6441234567',
          whatsappCountryCode: '+52',
          whatsappNumber: '6441234567',
          fiscalStateId: stateId,
          fiscalMunicipalityId: municipalityId,
          settlement: 'Centro',
          postalCode: '85000',
          street: 'Miguel Aleman',
          streetNumber: '100',
          addressReferences: 'Frente a la plaza',
        }),
      ).resolves.toMatchObject({
        contactEmail: 'contacto@example.test',
        fiscalState: { id: stateId, name: 'Sonora' },
        fiscalMunicipality: { id: municipalityId, name: 'Cajeme' },
      });
    });

    it('rejects a contact municipality when the state is missing', async () => {
      await expect(
        service.upsertContactSettings({
          fiscalMunicipalityId: municipalityId,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(storeSettings.upsert).not.toHaveBeenCalled();
    });

    it('rejects contact settings when a municipality is provided without a state', async () => {
      await expect(
        service.upsertContactSettings({
          contactEmail: null,
          phoneCountryCode: null,
          phoneNumber: null,
          whatsappCountryCode: null,
          whatsappNumber: null,
          fiscalStateId: null,
          fiscalMunicipalityId: 'municipality-id',
          settlement: null,
          postalCode: null,
          street: null,
          streetNumber: null,
          addressReferences: null,
        }),
      ).rejects.toEqual(
        new BadRequestException(
          'fiscalStateId is required when fiscalMunicipalityId is provided',
        ),
      );
    });
  });

  describe('Fiscal tab', () => {
    it('upserts fiscal settings, uppercases the RFC, and returns summaries', async () => {
      taxRegime.findUnique.mockResolvedValue({ code: taxRegimeCode });
      mexicoState.findUnique.mockResolvedValue({ id: stateId });
      mexicoMunicipality.findFirst.mockResolvedValue({ id: municipalityId });
      const row = createStoreSettingsRow({
        taxId: 'XAXX010101000',
        taxRegimeCode,
        taxStateId: stateId,
        taxMunicipalityId: municipalityId,
        taxSettlement: 'Centro',
        taxPostalCode: '85000',
        taxStreet: 'Miguel Aleman',
        taxStreetNumber: '100',
        taxAddressReferences: 'Frente a la plaza',
        taxRegime: {
          code: taxRegimeCode,
          name: 'General de Ley Personas Morales',
          personType: 'moral',
        },
        taxState: { id: stateId, code: '26', name: 'Sonora' },
        taxMunicipality: {
          id: municipalityId,
          stateId,
          code: '018',
          name: 'Cajeme',
        },
      });
      storeSettings.upsert.mockResolvedValue(row);

      await expect(
        service.upsertFiscalSettings({
          taxId: 'xaxx010101000',
          taxRegimeCode,
          taxStateId: stateId,
          taxMunicipalityId: municipalityId,
          taxSettlement: 'Centro',
          taxPostalCode: '85000',
          taxStreet: 'Miguel Aleman',
          taxStreetNumber: '100',
          taxAddressReferences: 'Frente a la plaza',
        }),
      ).resolves.toMatchObject({
        taxId: 'XAXX010101000',
        taxRegime: { code: taxRegimeCode },
        taxState: { id: stateId, name: 'Sonora' },
        taxMunicipality: { id: municipalityId, name: 'Cajeme' },
      });
    });

    it('rejects an invalid tax regime before upserting', async () => {
      taxRegime.findUnique.mockResolvedValue(null);

      await expect(
        service.upsertFiscalSettings({
          taxRegimeCode,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(storeSettings.upsert).not.toHaveBeenCalled();
    });

    it('rejects fiscal settings when the tax regime does not exist', async () => {
      taxRegime.findUnique.mockResolvedValue(null);

      await expect(
        service.upsertFiscalSettings({
          taxId: 'ABC010203AA1',
          taxRegimeCode: '999',
          taxStateId: null,
          taxMunicipalityId: null,
          taxSettlement: null,
          taxPostalCode: null,
          taxStreet: null,
          taxStreetNumber: null,
          taxAddressReferences: null,
        }),
      ).rejects.toEqual(
        new BadRequestException(
          'taxRegimeCode must reference a valid tax regime',
        ),
      );
    });
  });

  describe('Catalog routes', () => {
    it('filters municipalities by state id when requested', async () => {
      mexicoMunicipality.findMany.mockResolvedValue([
        {
          id: 'municipality-id',
          stateId: 'state-id',
          code: '001',
          name: 'Hermosillo',
        },
      ]);

      await expect(
        service.listMexicoMunicipalities('state-id'),
      ).resolves.toEqual([
        {
          id: 'municipality-id',
          stateId: 'state-id',
          code: '001',
          name: 'Hermosillo',
        },
      ]);

      expect(mexicoMunicipality.findMany).toHaveBeenCalledWith({
        where: { stateId: 'state-id' },
        orderBy: {
          name: 'asc',
        },
      });
    });
  });
});

function createStoreSettingsRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'settings-id',
    commercialName: 'Comercio MX',
    legalName: 'Comercio MX SA de CV',
    shortDescription: 'Tienda',
    longDescription: 'Descripcion completa',
    primaryLogoUrl: 'https://example.test/logo.png',
    alternateLogoUrl: 'https://example.test/logo-alt.png',
    primaryColorHex: '#3B82F6',
    secondaryColorHex: '#1698B8',
    accentColorHex: '#F59E0B',
    contactEmail: null,
    phoneCountryCode: null,
    phoneNumber: null,
    whatsappCountryCode: null,
    whatsappNumber: null,
    fiscalStateId: null,
    fiscalMunicipalityId: null,
    settlement: null,
    postalCode: null,
    street: null,
    streetNumber: null,
    addressReferences: null,
    taxId: null,
    taxRegimeCode: null,
    taxStateId: null,
    taxMunicipalityId: null,
    taxSettlement: null,
    taxPostalCode: null,
    taxStreet: null,
    taxStreetNumber: null,
    taxAddressReferences: null,
    createdAt: new Date('2026-04-24T00:00:00.000Z'),
    updatedAt: new Date('2026-04-24T00:00:00.000Z'),
    contactState: null,
    contactMunicipality: null,
    taxRegime: null,
    taxState: null,
    taxMunicipality: null,
    ...overrides,
  };
}
