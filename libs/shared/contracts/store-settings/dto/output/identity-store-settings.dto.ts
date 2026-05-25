export class IdentityStoreSettingsDto {
  id!: string;
  primaryLogoUrl?: string;
  alternateLogoUrl?: string;
  primaryColorHex!: string;
  secondaryColorHex!: string;
  accentColorHex!: string;
  createdAt!: Date | null;
  updatedAt!: Date | null;
}
