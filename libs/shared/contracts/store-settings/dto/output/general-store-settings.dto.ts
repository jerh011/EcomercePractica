export class GeneralStoreSettingsDto {
  id!: string;
  commercialName!: string;
  legalName!: string;
  shortDescription?: string;
  longDescription?: string;
  createdAt!: Date | null;
  updatedAt!: Date | null;
}
