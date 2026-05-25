export class UpsertGeneralStoreSettingsDto {
  commercialName!: string;
  legalName!: string;
  shortDescription?: string | null;
  longDescription?: string | null;
}
