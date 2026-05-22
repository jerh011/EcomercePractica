import { ApiProperty } from '@nestjs/swagger';

export class EntitySummarySwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Entity UUID.',
    example: '9b8c5c92-7c53-4a90-a4c0-6c8a4c2a4e11',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Entity display name.',
    example: 'Phones',
  })
  name!: string;

  @ApiProperty({
    type: String,
    description: 'Entity slug.',
    example: 'phones',
  })
  slug!: string;
}

export class CategorySummarySwaggerDto extends EntitySummarySwaggerDto {}

export class BrandSummarySwaggerDto extends EntitySummarySwaggerDto {}

export class AttributeSummarySwaggerDto extends EntitySummarySwaggerDto {}

export class ProductSummarySwaggerDto extends EntitySummarySwaggerDto {}

export class VariantReferenceSummarySwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Variant UUID.',
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b601',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Variant SKU.',
    example: 'SKU-12345',
  })
  sku!: string;
}

export class AttributeValueReferenceSummarySwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Attribute value reference UUID.',
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b701',
  })
  id!: string;
}

export class MexicoStateCatalogSummarySwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Mexico state UUID.',
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b801',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Two-digit state code.',
    example: '26',
  })
  code!: string;

  @ApiProperty({
    type: String,
    description: 'State name.',
    example: 'Sonora',
  })
  name!: string;
}

export class MexicoMunicipalityCatalogSummarySwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Mexico municipality UUID.',
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b802',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Owning state UUID.',
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b801',
  })
  stateId!: string;

  @ApiProperty({
    type: String,
    description: 'Three-digit municipality code.',
    example: '030',
    required: false,
  })
  code?: string;

  @ApiProperty({
    type: String,
    description: 'Municipality name.',
    example: 'Hermosillo',
  })
  name!: string;
}

export class TaxRegimeCatalogSummarySwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Tax regime code.',
    example: '601',
  })
  code!: string;

  @ApiProperty({
    type: String,
    description: 'Tax regime name.',
    example: 'General de Ley Personas Morales',
  })
  name!: string;

  @ApiProperty({
    type: String,
    description: 'Supported person type.',
    example: 'Moral',
    required: false,
  })
  personType?: string;
}

export class UserRoleSummarySwaggerDto {
  @ApiProperty({
    type: String,
    description: 'User role UUID.',
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b901',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Stable user role code.',
    example: 'ADMIN',
  })
  code!: string;

  @ApiProperty({
    type: String,
    description: 'User role display name.',
    example: 'Administrador',
  })
  name!: string;
}

export class AppModuleAccessSummarySwaggerDto {
  @ApiProperty({
    type: String,
    description: 'App module UUID.',
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b902',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Stable app module code.',
    example: 'users',
  })
  code!: string;

  @ApiProperty({
    type: String,
    description: 'App module display name.',
    example: 'Usuarios',
  })
  name!: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the role can view this module.',
    example: true,
  })
  canView!: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the role can create records in this module.',
    example: true,
  })
  canCreate!: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the role can edit records in this module.',
    example: true,
  })
  canEdit!: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the role can delete records in this module.',
    example: true,
  })
  canDelete!: boolean;
}
