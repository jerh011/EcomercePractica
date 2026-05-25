import {
  toContactStoreSettingsDto,
  toFiscalStoreSettingsDto,
  toGeneralStoreSettingsDto,
  toIdentityStoreSettingsDto,
  toMexicoMunicipalityDto,
  toMexicoStateDto,
  toTaxRegimeDto,
} from './store-settings.mapper';

describe('store-settings.mapper', () => {
  const row = {
    id: 'settings-id',
    commercialName: 'MA Store',
    legalName: 'MA Store SA',
    shortDescription: null,
    longDescription: 'Long',
    primaryLogoUrl: 'https://example.com/logo.png',
    alternateLogoUrl: null,
    primaryColorHex: '#3B82F6',
    secondaryColorHex: '#1698B8',
    accentColorHex: null,
    contactEmail: 'hello@example.com',
    phoneCountryCode: '+52',
    phoneNumber: '6621234567',
    whatsappCountryCode: null,
    whatsappNumber: null,
    fiscalStateId: 'state-id',
    fiscalMunicipalityId: 'municipality-id',
    settlement: 'Centro',
    postalCode: '83000',
    street: 'Calle Uno',
    streetNumber: '10',
    addressReferences: null,
    taxId: 'ABC010203AA1',
    taxRegimeCode: '601',
    taxStateId: 'state-id',
    taxMunicipalityId: 'municipality-id',
    taxSettlement: 'Centro',
    taxPostalCode: '83000',
    taxStreet: 'Calle Dos',
    taxStreetNumber: '20',
    taxAddressReferences: null,
    createdAt: new Date('2026-04-24T00:00:00.000Z'),
    updatedAt: new Date('2026-04-24T00:00:00.000Z'),
    contactState: { id: 'state-id', code: 'SON', name: 'Sonora' },
    contactMunicipality: {
      id: 'municipality-id',
      stateId: 'state-id',
      code: null,
      name: 'Hermosillo',
    },
    taxRegime: {
      code: '601',
      name: 'General de Ley Personas Morales',
      personType: null,
    },
    taxState: { id: 'state-id', code: 'SON', name: 'Sonora' },
    taxMunicipality: {
      id: 'municipality-id',
      stateId: 'state-id',
      code: '001',
      name: 'Hermosillo',
    },
  };

  it('maps general and identity settings rows', () => {
    expect(toGeneralStoreSettingsDto(row)).toEqual({
      id: 'settings-id',
      commercialName: 'MA Store',
      legalName: 'MA Store SA',
      shortDescription: undefined,
      longDescription: 'Long',
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });

    expect(toIdentityStoreSettingsDto(row)).toEqual({
      id: 'settings-id',
      primaryLogoUrl: 'https://example.com/logo.png',
      alternateLogoUrl: undefined,
      primaryColorHex: '#3B82F6',
      secondaryColorHex: '#1698B8',
      accentColorHex: '#F59E0B',
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  });

  it('maps contact and fiscal settings rows with nested summaries', () => {
    expect(toContactStoreSettingsDto(row)).toEqual({
      id: 'settings-id',
      contactEmail: 'hello@example.com',
      phoneCountryCode: '+52',
      phoneNumber: '6621234567',
      whatsappCountryCode: undefined,
      whatsappNumber: undefined,
      fiscalState: {
        id: 'state-id',
        code: 'SON',
        name: 'Sonora',
      },
      fiscalMunicipality: {
        id: 'municipality-id',
        stateId: 'state-id',
        code: undefined,
        name: 'Hermosillo',
      },
      settlement: 'Centro',
      postalCode: '83000',
      street: 'Calle Uno',
      streetNumber: '10',
      addressReferences: undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });

    expect(toFiscalStoreSettingsDto(row)).toEqual({
      id: 'settings-id',
      taxId: 'ABC010203AA1',
      taxRegime: {
        code: '601',
        name: 'General de Ley Personas Morales',
        personType: undefined,
      },
      taxState: {
        id: 'state-id',
        code: 'SON',
        name: 'Sonora',
      },
      taxMunicipality: {
        id: 'municipality-id',
        stateId: 'state-id',
        code: '001',
        name: 'Hermosillo',
      },
      taxSettlement: 'Centro',
      taxPostalCode: '83000',
      taxStreet: 'Calle Dos',
      taxStreetNumber: '20',
      taxAddressReferences: undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  });

  it('returns null for incomplete rows and maps catalog items', () => {
    expect(
      toGeneralStoreSettingsDto({
        ...row,
        legalName: null,
      }),
    ).toBeNull();

    expect(
      toIdentityStoreSettingsDto({
        ...row,
        primaryLogoUrl: null,
      }),
    ).toEqual({
      id: 'settings-id',
      primaryLogoUrl: undefined,
      alternateLogoUrl: undefined,
      primaryColorHex: '#3B82F6',
      secondaryColorHex: '#1698B8',
      accentColorHex: '#F59E0B',
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });

    expect(
      toIdentityStoreSettingsDto({
        ...row,
        primaryLogoUrl: null,
        alternateLogoUrl: null,
        primaryColorHex: null,
        secondaryColorHex: null,
        accentColorHex: null,
      }),
    ).toBeNull();

    expect(toMexicoStateDto({ id: 'state-id', code: 'SON', name: 'Sonora' })).toEqual({
      id: 'state-id',
      code: 'SON',
      name: 'Sonora',
    });
    expect(
      toMexicoMunicipalityDto({
        id: 'municipality-id',
        stateId: 'state-id',
        code: null,
        name: 'Hermosillo',
      }),
    ).toEqual({
      id: 'municipality-id',
      stateId: 'state-id',
      code: undefined,
      name: 'Hermosillo',
    });
    expect(
      toTaxRegimeDto({
        code: '601',
        name: 'General de Ley Personas Morales',
        personType: null,
      }),
    ).toEqual({
      code: '601',
      name: 'General de Ley Personas Morales',
      personType: undefined,
    });
  });
});
