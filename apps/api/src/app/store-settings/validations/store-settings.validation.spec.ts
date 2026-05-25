import { LegacyHttpException } from '../../../common/http/legacy-http-exception.filter';
import {
  throwInvalid,
  validateListMunicipalitiesQuery,
  validateUpsertContactStoreSettingsBody,
  validateUpsertFiscalStoreSettingsBody,
  validateUpsertGeneralStoreSettingsBody,
  validateUpsertIdentityStoreSettingsBody,
} from './store-settings.validation';

describe('store-settings.validation', () => {
  function expectIssues(action: () => unknown, issues: string[]) {
    try {
      action();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(LegacyHttpException);
      const legacyError = error as LegacyHttpException;
      expect(legacyError.statusCode).toBe(400);
      expect(legacyError.message).toBe('Invalid input');
      expect(legacyError.error).toEqual({ issues });
    }
  }

  it('accepts valid general settings payloads', () => {
    expect(
      validateUpsertGeneralStoreSettingsBody({
        commercialName: 'MA Store',
        legalName: 'MA Store SA',
        shortDescription: 'Short',
        longDescription: 'Long',
      }),
    ).toEqual({
      commercialName: 'MA Store',
      legalName: 'MA Store SA',
      shortDescription: 'Short',
      longDescription: 'Long',
    });
  });

  it('rejects invalid identity settings payloads', () => {
    expectIssues(
      () =>
      validateUpsertIdentityStoreSettingsBody({
        primaryLogoUrl: 'notaurl',
        alternateLogoUrl: 'still-bad',
        primaryColorHex: '#12345',
        secondaryColorHex: '#000000',
        accentColorHex: '#gggggg',
      }),
      [
        'primaryColorHex is required',
        'primaryLogoUrl must be a valid image URL or data URL',
        'alternateLogoUrl must be a valid image URL or data URL',
        'primaryColorHex must be a valid hex color',
        'accentColorHex must be a valid hex color',
      ],
    );
  });

  it('accepts optional empty contact fields and rejects invalid formats', () => {
    expect(
      validateUpsertContactStoreSettingsBody({
        contactEmail: '',
        phoneCountryCode: '',
        phoneNumber: '',
        whatsappCountryCode: '',
        whatsappNumber: '',
        fiscalStateId: '',
        fiscalMunicipalityId: '',
        settlement: '',
        postalCode: '',
        street: '',
        streetNumber: '',
        addressReferences: '',
      }),
    ).toEqual({
      contactEmail: '',
      phoneCountryCode: '',
      phoneNumber: '',
      whatsappCountryCode: '',
      whatsappNumber: '',
      fiscalStateId: '',
      fiscalMunicipalityId: '',
      settlement: '',
      postalCode: '',
      street: '',
      streetNumber: '',
      addressReferences: '',
    });

    expectIssues(
      () =>
      validateUpsertContactStoreSettingsBody({
        contactEmail: 'bad-email',
        phoneCountryCode: '52',
        phoneNumber: '12',
        postalCode: '12',
      }),
      [
        'contactEmail must be a valid email',
        'phoneCountryCode must be a valid country code',
        'phoneNumber must be a valid phone number',
        'postalCode must be a valid postal code',
      ],
    );
  });

  it('validates municipality filters and RFC formats', () => {
    expect(
      validateListMunicipalitiesQuery({
        stateId: '018f4dc4-5f51-7c55-9b8f-15fbdd99b101',
      }),
    ).toEqual({
      stateId: '018f4dc4-5f51-7c55-9b8f-15fbdd99b101',
    });

    expectIssues(
      () =>
      validateListMunicipalitiesQuery({
        stateId: 'bad-id',
      }),
      ['stateId must be a valid UUID'],
    );

    expectIssues(
      () =>
      validateUpsertFiscalStoreSettingsBody({
        taxId: 'invalid-rfc',
        taxPostalCode: '12',
      }),
      ['taxId must be a valid RFC', 'taxPostalCode must be a valid postal code'],
    );
  });

  it('exposes legacy validation errors with the collected issues payload', () => {
    expect(() => throwInvalid(['first issue', 'second issue'])).toThrow(
      new LegacyHttpException(400, 'Invalid input', {
        issues: ['first issue', 'second issue'],
      }),
    );
  });
});
