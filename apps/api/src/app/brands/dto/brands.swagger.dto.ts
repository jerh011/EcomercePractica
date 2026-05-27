import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandSwaggerDto {
  @ApiProperty({ type: String, example: 'Nike', description: 'Brand display name.' })
  name!: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Athletic footwear, apparel, and accessories.',
    description: 'Optional brand description.',
  })
  description?: string;

  @ApiProperty({ type: Boolean, example: true, description: 'Whether the brand is active.' })
  isActive!: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether the brand is visible in the menu.',
  })
  visibleInMenu!: boolean;

  @ApiProperty({
    type: String,
    example: 'https://example.test/logos/nike.png',
    description: 'Brand logo URL.',
  })
  logoUrl!: string;

  @ApiPropertyOptional({
    type: String,
    example: 'https://www.nike.com',
    description: 'Brand website input field.',
  })
  webSite?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Nike',
    description: 'Optional SEO meta title.',
  })
  metaTitle?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Shop Nike footwear, apparel, and accessories.',
    description: 'Optional SEO meta description.',
  })
  metaDescription?: string;
}

export class CreateBatchBrandItemSwaggerDto extends CreateBrandSwaggerDto {
  @ApiProperty({
    type: String,
    example: 'tmp-1',
    description: 'Client correlation key for the batch item.',
  })
  key!: string;
}

export class CreateBatchBrandsSwaggerDto {
  @ApiProperty({
    type: () => [CreateBatchBrandItemSwaggerDto],
    description: 'Brands to create independently.',
  })
  brands!: CreateBatchBrandItemSwaggerDto[];
}

export class UpdateBrandSwaggerDto {
  @ApiPropertyOptional({ type: String, example: 'Nike', description: 'Updated brand name.' })
  name?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Athletic footwear, apparel, and accessories.',
    description: 'Updated brand description.',
  })
  description?: string | null;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description: 'Updated active flag.',
  })
  isActive?: boolean | null;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description: 'Updated menu visibility flag.',
  })
  visibleInMenu?: boolean | null;

  @ApiPropertyOptional({
    type: String,
    example: 'https://example.test/logos/nike.png',
    description: 'Updated brand logo URL.',
  })
  logoUrl?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'https://www.nike.com',
    description: 'Updated website input field.',
  })
  webSite?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'nike',
    description: 'Optional updated slug.',
  })
  slug?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Nike',
    description: 'Updated meta title.',
  })
  metaTitle?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Shop Nike footwear, apparel, and accessories.',
    description: 'Updated meta description.',
  })
  metaDescription?: string | null;
}

export class ToggleBrandActiveSwaggerDto {
  @ApiProperty({
    type: String,
    example: '2a9f4a2f-89a4-45d4-885a-a4dcd6d0df12',
    description: 'Brand UUID.',
  })
  id!: string;

  @ApiProperty({ type: Boolean, example: true, description: 'Next active state.' })
  isActive!: boolean;
}

export class ToggleBrandVisibleSwaggerDto {
  @ApiProperty({
    type: String,
    example: '2a9f4a2f-89a4-45d4-885a-a4dcd6d0df12',
    description: 'Brand UUID.',
  })
  id!: string;

  @ApiProperty({ type: Boolean, example: true, description: 'Next menu visibility state.' })
  visibleInMenu!: boolean;
}

export class BrandSwaggerDto {
  @ApiProperty({
    type: String,
    example: '2a9f4a2f-89a4-45d4-885a-a4dcd6d0df12',
    description: 'Brand UUID.',
  })
  id!: string;

  @ApiProperty({ type: String, example: 'Nike', description: 'Brand display name.' })
  name!: string;

  @ApiProperty({ type: Boolean, example: true, description: 'Menu visibility flag.' })
  visibleInMenu!: boolean;

  @ApiProperty({ type: String, example: 'nike', description: 'Normalized brand slug.' })
  slug!: string;

  @ApiPropertyOptional({
    type: String,
    example: 'https://example.test/logos/nike.png',
    description: 'Brand logo URL.',
  })
  logoUrl?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Athletic footwear, apparel, and accessories.',
    description: 'Brand description.',
  })
  description?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'https://www.nike.com',
    description: 'Brand website URL.',
  })
  website?: string;

  @ApiPropertyOptional({ type: String, example: 'Nike', description: 'SEO meta title.' })
  metaTitle?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Shop Nike footwear, apparel, and accessories.',
    description: 'SEO meta description.',
  })
  metaDescription?: string;

  @ApiProperty({ type: Boolean, example: true, description: 'Active flag.' })
  isActive!: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-04-20T00:00:00.000Z',
    nullable: true,
    description: 'Creation timestamp.',
  })
  createdAt!: Date | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-04-20T00:00:00.000Z',
    nullable: true,
    description: 'Last update timestamp.',
  })
  updatedAt!: Date | null;
}

export class ListBrandsDataSwaggerDto {
  @ApiProperty({
    type: () => [BrandSwaggerDto],
    description: 'Brand records in the current page.',
  })
  brands!: BrandSwaggerDto[];

  @ApiPropertyOptional({ type: Number, example: 10, description: 'Total matching records.' })
  totalCount?: number;

  @ApiPropertyOptional({ type: Number, example: 1, description: 'Total pages.' })
  totalPages?: number;

  @ApiPropertyOptional({
    type: String,
    example: 'eyJjdXJzb3IiOiJ...',
    description: 'Next cursor token.',
  })
  nextCursor?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'eyJjdXJzb3IiOiJ..."',
    description: 'Previous cursor token.',
  })
  prevCursor?: string;
}

export class BrandBatchSucceededSwaggerDto {
  @ApiProperty({ type: String, example: 'tmp-1', description: 'Client batch key.' })
  key!: string;

  @ApiProperty({
    type: String,
    example: '2a9f4a2f-89a4-45d4-885a-a4dcd6d0df12',
    description: 'Created resource UUID.',
  })
  id!: string;
}

export class BrandBatchFailedSwaggerDto {
  @ApiProperty({ type: String, example: 'tmp-2', description: 'Client batch key.' })
  key!: string;

  @ApiProperty({
    type: String,
    example: 'brand name already exists',
    description: 'Failure reason.',
  })
  reason!: string;
}

export class CreateBatchBrandsResultSwaggerDto {
  @ApiProperty({
    type: String,
    enum: ['success', 'partial', 'failed'],
    description: 'Overall batch result.',
    example: 'partial',
  })
  status!: 'success' | 'partial' | 'failed';

  @ApiProperty({ type: () => [BrandBatchSucceededSwaggerDto] })
  succeeded!: BrandBatchSucceededSwaggerDto[];

  @ApiProperty({ type: () => [BrandBatchFailedSwaggerDto] })
  failed!: BrandBatchFailedSwaggerDto[];
}

export class BrandSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: Boolean, example: true, description: 'Success flag.' })
  success!: true;

  @ApiProperty({
    type: String,
    example: 'Brand retrieved successfully',
    description: 'Message.',
  })
  message!: string;
}

export class BrandResponseSwaggerDto extends BrandSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: () => BrandSwaggerDto, description: 'Brand payload.' })
  data!: BrandSwaggerDto;
}

export class ListBrandsResponseSwaggerDto extends BrandSuccessEnvelopeSwaggerDto {
  @ApiProperty({
    type: () => ListBrandsDataSwaggerDto,
    description: 'List payload.',
  })
  data!: ListBrandsDataSwaggerDto;
}

export class CreateBatchBrandsResponseSwaggerDto extends BrandSuccessEnvelopeSwaggerDto {
  @ApiProperty({
    type: () => CreateBatchBrandsResultSwaggerDto,
    description: 'Batch creation payload.',
  })
  data!: CreateBatchBrandsResultSwaggerDto;
}

export class BooleanResponseSwaggerDto extends BrandSuccessEnvelopeSwaggerDto {
  @ApiProperty({ type: Boolean, example: true, description: 'Boolean operation result.' })
  data!: boolean;
}
