import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AttributeSummarySwaggerDto,
  BrandSummarySwaggerDto,
  ProductSummarySwaggerDto,
} from '../../common/swagger/entity-summary.swagger.dto';

export class VariantAttributeValueInputSwaggerDto {
  @ApiProperty({
    type: String,
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b301',
    description: 'Attribute UUID.',
  })
  attributeId!: string;

  @ApiProperty({
    type: String,
    example: 'Black',
    description: 'Variant-specific string value for the attribute.',
  })
  value!: string;
}

export class VariantAttributeValueSwaggerDto {
  @ApiProperty({
    type: () => AttributeSummarySwaggerDto,
    description: 'Resolved attribute summary.',
  })
  attribute!: AttributeSummarySwaggerDto;

  @ApiProperty({
    type: String,
    example: 'Black',
    description: 'Variant-specific string value.',
  })
  value!: string;
}

export class CreateVariantSwaggerDto {
  @ApiProperty({
    type: String,
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b501',
  })
  productId!: string;

  @ApiProperty({ type: String, example: 'SKU-12345' })
  sku!: string;

  @ApiPropertyOptional({ type: String, example: '10.50' })
  price?: string;

  @ApiPropertyOptional({ type: Number, example: 1 })
  minimumStock?: number;

  @ApiPropertyOptional({ type: String, example: '00012345600012' })
  barcodeGtin?: string;

  @ApiPropertyOptional({ type: String, example: '<p>Description</p>' })
  descriptionHtml?: string;

  @ApiPropertyOptional({
    type: Object,
    example: {
      weight: '0.24 kg',
      packaging: { unit: 'cm', depth: 22, width: 28, height: 2 },
    },
  })
  dimensions?: Record<string, unknown>;

  @ApiPropertyOptional({ type: Boolean, example: true })
  isActive?: boolean;

  @ApiPropertyOptional({
    type: () => [String],
    example: ['https://example.test/image.jpg'],
  })
  imageUrls?: string[];

  @ApiPropertyOptional({
    type: () => [String],
    example: ['018f4dc4-5f51-7c55-9b8f-15fbdd99b302'],
    description:
      'Variant-only attribute UUIDs to add on top of inherited product/category attributes.',
  })
  attributeIds?: string[];

  @ApiProperty({
    type: () => [VariantAttributeValueInputSwaggerDto],
    description:
      'Complete attribute values for the variant, including inherited product/category attributes.',
  })
  attributeValues!: VariantAttributeValueInputSwaggerDto[];
}

export class UpdateVariantSwaggerDto {
  @ApiPropertyOptional({ type: String, example: 'SKU-12346' })
  sku?: string;

  @ApiPropertyOptional({ type: String, example: '11.00' })
  price?: string;

  @ApiPropertyOptional({ type: Number, example: 2 })
  minimumStock?: number;

  @ApiPropertyOptional({ type: String, example: '00012345600012' })
  barcodeGtin?: string;

  @ApiPropertyOptional({ type: Boolean, example: false })
  clearBarcodeGtin?: boolean;

  @ApiPropertyOptional({ type: String, example: '<p>Updated</p>' })
  descriptionHtml?: string;

  @ApiPropertyOptional({ type: Boolean, example: false })
  clearDescriptionHtml?: boolean;

  @ApiPropertyOptional({ type: String, example: '9.99' })
  offerPrice?: string;

  @ApiPropertyOptional({ type: Boolean, example: false })
  clearOfferPrice?: boolean;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  offerStart?: string;

  @ApiPropertyOptional({ type: Boolean, example: false })
  clearOfferStart?: boolean;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  offerEnd?: string;

  @ApiPropertyOptional({ type: Boolean, example: false })
  clearOfferEnd?: boolean;

  @ApiPropertyOptional({
    type: Object,
    example: {
      weight: '0.24 kg',
      packaging: { unit: 'cm', depth: 22, width: 28, height: 2 },
    },
  })
  dimensions?: Record<string, unknown>;

  @ApiPropertyOptional({ type: Boolean, example: false })
  clearDimensions?: boolean;

  @ApiPropertyOptional({ type: Boolean, example: true })
  isActive?: boolean;

  @ApiPropertyOptional({
    type: () => [String],
    example: ['https://example.test/image.jpg'],
  })
  imageUrls?: string[];

  @ApiPropertyOptional({
    type: () => [String],
    example: ['018f4dc4-5f51-7c55-9b8f-15fbdd99b302'],
    description:
      'Variant-only attribute UUIDs to replace or merge, depending on replaceAttributeIds.',
  })
  attributeIds?: string[];

  @ApiPropertyOptional({
    type: () => [VariantAttributeValueInputSwaggerDto],
    description:
      'Attribute values to replace or merge, depending on replaceAttributeValues.',
  })
  attributeValues?: VariantAttributeValueInputSwaggerDto[];

  @ApiPropertyOptional({ type: Boolean, example: true })
  replaceImageUrls?: boolean;

  @ApiPropertyOptional({ type: Boolean, example: true })
  replaceAttributeIds?: boolean;

  @ApiPropertyOptional({ type: Boolean, example: true })
  replaceAttributeValues?: boolean;
}

export class ToggleVariantStatusSwaggerDto {
  @ApiProperty({ type: Boolean, example: false })
  isActive!: boolean;
}

export class VariantProductSummarySwaggerDto extends ProductSummarySwaggerDto {
  @ApiPropertyOptional({
    type: () => BrandSummarySwaggerDto,
    description: 'Optional brand summary for the variant product.',
  })
  brand?: BrandSummarySwaggerDto;
}

export class VariantSwaggerDto {
  @ApiProperty({
    type: String,
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b601',
  })
  id!: string;

  @ApiProperty({ type: () => VariantProductSummarySwaggerDto })
  product!: VariantProductSummarySwaggerDto;

  @ApiProperty({ type: String, example: 'SKU-12345' })
  sku!: string;

  @ApiPropertyOptional({ type: String, example: '10.5' })
  price?: string;

  @ApiProperty({ type: Number, example: 5 })
  stockQuantity!: number;

  @ApiProperty({ type: Number, example: 1 })
  minimumStock!: number;

  @ApiPropertyOptional({ type: String, example: '00012345600012' })
  barcodeGtin?: string;

  @ApiPropertyOptional({ type: String, example: '<p>Description</p>' })
  descriptionHtml?: string;

  @ApiPropertyOptional({ type: String, example: '9.99' })
  offerPrice?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  offerStart?: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  offerEnd?: Date;

  @ApiProperty({
    type: Object,
    example: {
      weight: '0.24 kg',
      packaging: { unit: 'cm', depth: 22, width: 28, height: 2 },
    },
  })
  dimensions!: Record<string, unknown>;

  @ApiProperty({ type: Boolean, example: true })
  isActive!: boolean;

  @ApiProperty({ type: () => [String], example: [] })
  imageUrls!: string[];

  @ApiProperty({
    type: () => [AttributeSummarySwaggerDto],
    description:
      'Variant-only attributes that are not inherited from the product/category hierarchy.',
  })
  directAttributes!: AttributeSummarySwaggerDto[];

  @ApiProperty({
    type: () => [AttributeSummarySwaggerDto],
    description:
      'Effective attribute set available on the variant, including inherited and variant-only attributes.',
  })
  attributes!: AttributeSummarySwaggerDto[];

  @ApiProperty({
    type: () => [VariantAttributeValueSwaggerDto],
    description: 'Resolved effective attribute values for the variant.',
  })
  attributeValues!: VariantAttributeValueSwaggerDto[];

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  createdAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  updatedAt!: Date | null;
}

export class VariantResponseSwaggerDto {
  @ApiProperty({ type: VariantSwaggerDto })
  variant!: VariantSwaggerDto;
}

export class VariantMutationResponseSwaggerDto {
  @ApiProperty({ type: Boolean, example: true })
  success!: boolean;
}

export class ListVariantsResponseSwaggerDto {
  @ApiProperty({ type: () => [VariantSwaggerDto] })
  variants!: VariantSwaggerDto[];

  @ApiProperty({
    type: Object,
    example: {
      offset: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
      },
    },
  })
  pagination!: unknown;
}
