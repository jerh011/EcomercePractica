export class UpsertIdentityStoreSettingsDto {
  primaryLogoUrl?: string | null;
  alternateLogoUrl?: string | null;
  primaryColorHex!: string;
  secondaryColorHex!: string;
  accentColorHex!: string;
}
