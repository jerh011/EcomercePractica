export class UpsertContactStoreSettingsDto {
  contactEmail?: string | null;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  whatsappCountryCode?: string | null;
  whatsappNumber?: string | null;
  fiscalStateId?: string | null;
  fiscalMunicipalityId?: string | null;
  settlement?: string | null;
  postalCode?: string | null;
  street?: string | null;
  streetNumber?: string | null;
  addressReferences?: string | null;
}
