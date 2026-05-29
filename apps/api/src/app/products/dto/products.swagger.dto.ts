import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AttributeSummarySwaggerDto,
  BrandSummarySwaggerDto,
  CategorySummarySwaggerDto,
  VariantReferenceSummarySwaggerDto,
} from '../../common/swagger/entity-summary.swagger.dto';

export class CreateProductSwaggerDto {
  @ApiProperty({
    type: String,
    example: 'Pegasus 41',
    description: 'Product display name.',
  })
  name!: string;

  @ApiProperty({
    type: String,
    example: '2026',
    description: 'Base model year or SKU label.',
  })
  modelYear!: string;

  @ApiProperty({
    type: String,
    example: '<p>Responsive everyday running shoe.</p>',
    description: 'Primary rich description.',
  })
  descriptionHtml!: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Responsive everyday running shoe.',
    description: 'Short summary shown in listings.',
  })
  descriptionShort?: string;

  @ApiPropertyOptional({
    type: String,
    example: '<ul><li>Foam midsole</li></ul>',
    description: 'Optional rich specifications block.',
  })
  specificationsHtml?: string;

  @ApiProperty({
    type: Number,
    example: 149.99,
    description: 'Base product price.',
  })
  basePrice!: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether the product is active.',
  })
  isActive!: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether the product is featured.',
  })
  isFeatured!: boolean;

  @ApiPropertyOptional({
    type: Object,
    example: {
      weight: '0.24 kg',
      length: '22 cm',
      width: '28 cm',
      height: '2 cm',
    },
    description:
      'Optional dimensions payload. Weight is a string with the unit included.',
  })
  dimensionsBase?: Record<string, unknown>;

  @ApiProperty({
    type: () => [String],
    example: ['018f4dc4-5f51-7c55-9b8f-15fbdd99b102'],
    description: 'Assigned category UUIDs.',
  })
  categoriesId!: string[];

  @ApiPropertyOptional({
    type: () => [String],
    example: ['018f4dc4-5f51-7c55-9b8f-15fbdd99b301'],
    description:
      'Direct product attribute UUIDs added on top of inherited category attributes.',
  })
  attributeIds?: string[];

  @ApiPropertyOptional({
    type: String,
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b104',
    description: 'Optional brand UUID.',
  })
  brandId?: string;
}

export class CreateBatchProductSwaggerDto extends CreateProductSwaggerDto {
  @ApiProperty({
    type: String,
    example: 'tmp-1',
    description: 'Client correlation key for the batch item.',
  })
  key!: string;
}

export class CreateBatchProductsSwaggerDto {
  @ApiProperty({
    type: () => [CreateBatchProductSwaggerDto],
    description: 'Products to create independently.',
  })
  products!: CreateBatchProductSwaggerDto[];
}

export class UpdateProductSwaggerDto {
  @ApiPropertyOptional({
    type: String,
    example: 'Pegasus 41',
    description: 'Updated product name.',
  })
  name?: string;

  @ApiPropertyOptional({
    type: String,
    example: '2026',
    description: 'Updated model year or SKU label.',
  })
  modelYear?: string;

  @ApiPropertyOptional({
    type: String,
    example: '<p>Responsive everyday running shoe.</p>',
    description: 'Updated rich description.',
  })
  descriptionHtml?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Responsive everyday running shoe.',
    description: 'Updated short summary.',
  })
  descriptionShort?: string;

  @ApiPropertyOptional({
    type: String,
    example: '<ul><li>Foam midsole</li></ul>',
    description: 'Updated rich specifications block.',
  })
  specificationsHtml?: string;

  @ApiPropertyOptional({
    type: Number,
    example: 149.99,
    description: 'Updated base price.',
  })
  basePrice?: number;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description: 'Updated active flag.',
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    example: false,
    description: 'Updated featured flag.',
  })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    type: Object,
    example: {
      weight: '0.24 kg',
      length: '22 cm',
      width: '28 cm',
      height: '2 cm',
    },
    description:
      'Updated dimensions payload. Weight is a string with the unit included.',
  })
  dimensionsBase?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: () => [String],
    example: ['018f4dc4-5f51-7c55-9b8f-15fbdd99b102'],
    description: 'Updated category UUIDs.',
  })
  categoriesId?: string[];

  @ApiPropertyOptional({
    type: () => [String],
    example: ['018f4dc4-5f51-7c55-9b8f-15fbdd99b301'],
    description: 'Replacement direct product attribute UUIDs.',
  })
  attributeIds?: string[];

  @ApiPropertyOptional({
    type: String,
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b104',
    description: 'Updated brand UUID.',
  })
  brandId?: string;
}

export class ToggleProductStatusSwaggerDto {
  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Next active state.',
  })
  isActive!: boolean;
}

export class ToggleProductFeaturedSwaggerDto {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Next featured state.',
  })
  isFeatured!: boolean;
}

export class ProductSwaggerDto {
  @ApiProperty({
    type: String,
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b101',
    description: 'Product UUID.',
  })
  id!: string;

  @ApiProperty({
    type: String,
    example: 'Pegasus 41',
    description: 'Product display name.',
  })
  name!: string;

  @ApiProperty({
    type: String,
    example: 'pegasus-41',
    description: 'Normalized product slug.',
  })
  slug!: string;

  @ApiProperty({
    type: String,
    example: '2026',
    description: 'Base model year or SKU label.',
  })
  modelYear!: string;

  @ApiProperty({
    type: String,
    example: '<p>Responsive everyday running shoe.</p>',
    description: 'Primary rich description.',
  })
  descriptionHtml!: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Responsive everyday running shoe.',
    description: 'Short summary.',
  })
  descriptionShort?: string;

  @ApiPropertyOptional({
    type: String,
    example: '<ul><li>Foam midsole</li></ul>',
    description: 'Optional rich specifications block.',
  })
  specificationsHtml?: string;

  @ApiProperty({
    type: Number,
    example: 149.99,
    description: 'Base product price.',
  })
  basePrice!: number;

  @ApiProperty({ type: Boolean, example: true, description: 'Active flag.' })
  isActive!: boolean;

  @ApiProperty({ type: Boolean, example: false, description: 'Featured flag.' })
  isFeatured!: boolean;

  @ApiProperty({
    type: Object,
    example: {
      weight: '0.24 kg',
      length: '22 cm',
      width: '28 cm',
      height: '2 cm',
    },
    description:
      'Dimensions payload. Weight is a string with the unit included.',
  })
  dimensionsBase!: Record<string, unknown>;

  @ApiProperty({
    type: () => [CategorySummarySwaggerDto],
    description: 'Assigned category summaries.',
  })
  categories!: CategorySummarySwaggerDto[];

  @ApiProperty({
    type: () => [AttributeSummarySwaggerDto],
    description: 'Direct product attributes only.',
  })
  directAttributes!: AttributeSummarySwaggerDto[];

  @ApiProperty({
    type: () => [AttributeSummarySwaggerDto],
    description:
      'Effective product attributes after category inheritance plus direct attributes.',
  })
  attributes!: AttributeSummarySwaggerDto[];

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

  @ApiProperty({
    type: () => [VariantReferenceSummarySwaggerDto],
    description: 'Linked variant summaries.',
  })
  variants!: VariantReferenceSummarySwaggerDto[];

  @ApiPropertyOptional({
    type: () => BrandSummarySwaggerDto,
    description: 'Linked brand summary.',
  })
  brand?: BrandSummarySwaggerDto;
}

export class ProductRecordResponseSwaggerDto {
  @ApiProperty({ type: ProductSwaggerDto })
  product!: ProductSwaggerDto;
}

export class ProductMutationResponseSwaggerDto {
  @ApiProperty({ type: Boolean, example: true })
  success!: boolean;
}

export class ProductBatchSucceededSwaggerDto {
  @ApiProperty({
    type: String,
    example: 'tmp-1',
    description: 'Client batch key.',
  })
  key!: string;

  @ApiProperty({
    type: String,
    example: '018f4dc4-5f51-7c55-9b8f-15fbdd99b101',
    description: 'Created product UUID.',
  })
  id!: string;
}

export class ProductBatchFailedSwaggerDto {
  @ApiProperty({
    type: String,
    example: 'tmp-2',
    description: 'Client batch key.',
  })
  key!: string;

  @ApiProperty({
    type: String,
    example: 'product slug already exists',
    description: 'Failure reason for this item.',
  })
  reason!: string;
}

export class CreateBatchProductsDataSwaggerDto {
  @ApiProperty({
    enum: ['success', 'partial', 'failed'],
    example: 'partial',
    description: 'Overall batch result.',
  })
  status!: 'success' | 'partial' | 'failed';

  @ApiProperty({ type: () => [ProductBatchSucceededSwaggerDto] })
  succeeded!: ProductBatchSucceededSwaggerDto[];

  @ApiProperty({ type: () => [ProductBatchFailedSwaggerDto] })
  failed!: ProductBatchFailedSwaggerDto[];
}

export class CreateBatchProductsResponseSwaggerDto {
  @ApiProperty({ type: Boolean, example: true, description: 'Success flag.' })
  success!: true;

  @ApiProperty({
    type: String,
    example: 'Batch products created successfully',
    description: 'Human-readable status message.',
  })
  message!: string;

  @ApiProperty({ type: () => CreateBatchProductsDataSwaggerDto })
  data!: CreateBatchProductsDataSwaggerDto;
}

export class ListProductsDataSwaggerDto {
  @ApiProperty({
    type: () => [ProductSwaggerDto],
    description: 'Product records in the current page.',
  })
  products!: ProductSwaggerDto[];

  @ApiPropertyOptional({
    type: Number,
    example: 12,
    description: 'Total matching records.',
  })
  totalCount?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 1,
    description: 'Total pages.',
  })
  totalPages?: number;

  @ApiPropertyOptional({
    type: String,
    example: 'cursor-next-token',
    description: 'Next cursor token.',
  })
  nextCursor?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'cursor-prev-token',
    description: 'Previous cursor token.',
  })
  prevCursor?: string;
}

export class ListProductsResponseSwaggerDto {
  @ApiProperty({ type: Boolean, example: true, description: 'Success flag.' })
  success!: true;

  @ApiProperty({
    type: Object,
    example: {
      offset: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 1,
      },
    },
  })
  pagination!: unknown;
}
