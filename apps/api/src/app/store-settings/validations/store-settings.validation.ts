import { LegacyHttpException } from '../../../common/http/legacy-http-exception.filter';
import { UpsertContactStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/input/upsert-contact-store-settings.dto';
import { UpsertFiscalStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/input/upsert-fiscal-store-settings.dto';
import { UpsertGeneralStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/input/upsert-general-store-settings.dto';
import { UpsertIdentityStoreSettingsDto } from '@ecomercepractica/shared/contracts/store-settings/dto/input/upsert-identity-store-settings.dto';
import {
  objectValue,
  optionalNullableString,
  requireString,
  requireUuid,
  throwIfInvalid,
} from '@ecomercepractica/shared/validations';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRY_CODE_PATTERN = /^\+\d{1,3}$/;
const PHONE_PATTERN = /^[0-9\s().-]{7,20}$/;
const POSTAL_CODE_PATTERN = /^\d{5}$/;
const RFC_PATTERN = /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/i;
const HEX_COLOR_PATTERN = /^#([A-Fa-f0-9]{6})$/;
const IMAGE_URL_PATTERN =
  /^(https?:\/\/[^\s]+|data:image\/(?:png|jpeg|svg\+xml);base64,[A-Za-z0-9+/=]+)$/;
const MAX_IMAGE_URL_LENGTH = 3_000_000;

export function validateUpsertGeneralStoreSettingsBody(
  value: unknown,
): UpsertGeneralStoreSettingsDto {
  const body = objectValue(value);
  const issues: string[] = [];

  requireString(body.commercialName, 'commercialName', issues, {
    min: 1,
    max: 160,
  });
  requireString(body.legalName, 'legalName', issues, { min: 1, max: 160 });
  optionalNullableString(body.shortDescription, 'shortDescription', issues, {
    max: 280,
  });
  optionalNullableString(body.longDescription, 'longDescription', issues, {
    max: 4000,
  });

  throwIfInvalid(issues, throwInvalid);
  return body as unknown as UpsertGeneralStoreSettingsDto;
}

export function validateUpsertIdentityStoreSettingsBody(
  value: unknown,
): UpsertIdentityStoreSettingsDto {
  const body = objectValue(value);
  const issues: string[] = [];

  requireString(body.primaryLogoUrl, 'primaryLogoUrl', issues, {
    min: 1,
    max: MAX_IMAGE_URL_LENGTH,
  });
  optionalNullableString(body.alternateLogoUrl, 'alternateLogoUrl', issues, {
    max: MAX_IMAGE_URL_LENGTH,
  });
  requireString(body.primaryColorHex, 'primaryColorHex', issues, {
    min: 7,
    max: 7,
  });
  requireString(body.secondaryColorHex, 'secondaryColorHex', issues, {
    min: 7,
    max: 7,
  });
  requireString(body.accentColorHex, 'accentColorHex', issues, {
    min: 7,
    max: 7,
  });
  validateImageUrl(body.primaryLogoUrl, 'primaryLogoUrl', issues);
  validateImageUrl(body.alternateLogoUrl, 'alternateLogoUrl', issues);
  validateHexColor(body.primaryColorHex, 'primaryColorHex', issues);
  validateHexColor(body.secondaryColorHex, 'secondaryColorHex', issues);
  validateHexColor(body.accentColorHex, 'accentColorHex', issues);

  throwIfInvalid(issues, throwInvalid);
  return body as unknown as UpsertIdentityStoreSettingsDto;
}

export function validateUpsertContactStoreSettingsBody(
  value: unknown,
): UpsertContactStoreSettingsDto {
  const body = objectValue(value);
  const issues: string[] = [];

  optionalNullableString(body.contactEmail, 'contactEmail', issues, {
    max: 254,
  });
  optionalNullableString(body.phoneCountryCode, 'phoneCountryCode', issues, {
    max: 4,
  });
  optionalNullableString(body.phoneNumber, 'phoneNumber', issues, { max: 20 });
  optionalNullableString(
    body.whatsappCountryCode,
    'whatsappCountryCode',
    issues,
    { max: 4 },
  );
  optionalNullableString(body.whatsappNumber, 'whatsappNumber', issues, {
    max: 20,
  });
  optionalNullableUuid(body.fiscalStateId, 'fiscalStateId', issues);
  optionalNullableUuid(
    body.fiscalMunicipalityId,
    'fiscalMunicipalityId',
    issues,
  );
  optionalNullableString(body.settlement, 'settlement', issues, { max: 160 });
  optionalNullableString(body.postalCode, 'postalCode', issues, { max: 5 });
  optionalNullableString(body.street, 'street', issues, { max: 240 });
  optionalNullableString(body.streetNumber, 'streetNumber', issues, {
    max: 30,
  });
  optionalNullableString(body.addressReferences, 'addressReferences', issues, {
    max: 500,
  });
  validateEmail(body.contactEmail, 'contactEmail', issues);
  validateCountryCode(body.phoneCountryCode, 'phoneCountryCode', issues);
  validateCountryCode(body.whatsappCountryCode, 'whatsappCountryCode', issues);
  validatePhone(body.phoneNumber, 'phoneNumber', issues);
  validatePhone(body.whatsappNumber, 'whatsappNumber', issues);
  validatePostalCode(body.postalCode, 'postalCode', issues);

  throwIfInvalid(issues, throwInvalid);
  return body as unknown as UpsertContactStoreSettingsDto;
}

export function validateListMunicipalitiesQuery(value: unknown): {
  stateId?: string;
} {
  const query = objectValue(value);
  const issues: string[] = [];
  optionalNullableUuid(query.stateId, 'stateId', issues);
  throwIfInvalid(issues, throwInvalid);

  return {
    stateId: typeof query.stateId === 'string' ? query.stateId : undefined,
  };
}

export function validateUpsertFiscalStoreSettingsBody(
  value: unknown,
): UpsertFiscalStoreSettingsDto {
  const body = objectValue(value);
  const issues: string[] = [];

  optionalNullableString(body.taxId, 'taxId', issues, { max: 13 });
  optionalNullableString(body.taxRegimeCode, 'taxRegimeCode', issues, {
    max: 3,
  });
  optionalNullableUuid(body.taxStateId, 'taxStateId', issues);
  optionalNullableUuid(body.taxMunicipalityId, 'taxMunicipalityId', issues);
  optionalNullableString(body.taxSettlement, 'taxSettlement', issues, {
    max: 160,
  });
  optionalNullableString(body.taxPostalCode, 'taxPostalCode', issues, {
    max: 5,
  });
  optionalNullableString(body.taxStreet, 'taxStreet', issues, { max: 240 });
  optionalNullableString(body.taxStreetNumber, 'taxStreetNumber', issues, {
    max: 30,
  });
  optionalNullableString(
    body.taxAddressReferences,
    'taxAddressReferences',
    issues,
    {
      max: 500,
    },
  );
  validateRfc(body.taxId, 'taxId', issues);
  validatePostalCode(body.taxPostalCode, 'taxPostalCode', issues);

  throwIfInvalid(issues, throwInvalid);
  return body as unknown as UpsertFiscalStoreSettingsDto;
}

function validateEmail(value: unknown, field: string, issues: string[]) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  if (typeof value === 'string' && !EMAIL_PATTERN.test(value.trim())) {
    issues.push(`${field} must be a valid email`);
  }
}

function validatePhone(value: unknown, field: string, issues: string[]) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  if (typeof value === 'string' && !PHONE_PATTERN.test(value.trim())) {
    issues.push(`${field} must be a valid phone number`);
  }
}

function validateCountryCode(value: unknown, field: string, issues: string[]) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  if (typeof value === 'string' && !COUNTRY_CODE_PATTERN.test(value.trim())) {
    issues.push(`${field} must be a valid country code`);
  }
}

function validatePostalCode(value: unknown, field: string, issues: string[]) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  if (typeof value === 'string' && !POSTAL_CODE_PATTERN.test(value.trim())) {
    issues.push(`${field} must be a valid postal code`);
  }
}

function validateRfc(value: unknown, field: string, issues: string[]) {
  if (value === undefined || value === null || value === '') {
    return;
  }

  if (
    typeof value === 'string' &&
    !RFC_PATTERN.test(value.trim().toUpperCase())
  ) {
    issues.push(`${field} must be a valid RFC`);
  }
}

function validateHexColor(value: unknown, field: string, issues: string[]) {
  if (typeof value !== 'string' || !HEX_COLOR_PATTERN.test(value.trim())) {
    issues.push(`${field} must be a valid hex color`);
  }
}

function validateImageUrl(value: unknown, field: string, issues: string[]) {
  if (value === undefined || value === null || value === '') {
    return;
  }

  if (typeof value !== 'string' || !IMAGE_URL_PATTERN.test(value.trim())) {
    issues.push(`${field} must be a valid image URL or data URL`);
  }
}

function optionalNullableUuid(value: unknown, field: string, issues: string[]) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  requireUuid(value, field, issues);
}

export function throwInvalid(issues: string[]) {
  throw new LegacyHttpException(400, 'Invalid input', {
    issues,
  });
}
