import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategorySummarySwaggerDto } from '../../common/swagger/entity-summary.swagger.dto';

export class AttributeSwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Attribute UUID.',
    example: 'e5d0bdbd-7d6d-4853-b0fc-38f8441ec4fd',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Attribute display name.',
    example: 'Color',
  })
  name!: string;

  @ApiProperty({
    type: String,
    description: 'Normalized attribute slug.',
    example: 'color',
  })
  slug!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional attribute description.',
    example: 'Primary color or finish presented to the customer.',
  })
  description?: string;

  @ApiProperty({
    type: Number,
    description: 'Display order used in attribute listings.',
    example: 10,
  })
  displayOrder!: number;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the attribute is currently active.',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the attribute can be used as a filter.',
    example: true,
  })
  isFilterable!: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the attribute is required for matching products.',
    example: false,
  })
  isRequired!: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the attribute applies to all categories.',
    example: false,
  })
  appliesToAll!: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Creation timestamp.',
    example: '2026-04-20T00:00:00.000Z',
    nullable: true,
  })
  createdAt!: Date | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Last update timestamp.',
    example: '2026-04-20T00:00:00.000Z',
    nullable: true,
  })
  updatedAt!: Date | null;
}

export class AttributeWithCategoriesSwaggerDto extends AttributeSwaggerDto {
  @ApiProperty({
    description: 'Expanded category records linked to the attribute.',
    type: () => [CategorySummarySwaggerDto],
  })
  categories!: CategorySummarySwaggerDto[];
}

export class CreateAttributeSwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Attribute display name.',
    example: 'Color',
  })
  name!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional attribute description.',
    example: 'Primary color or finish presented to the customer.',
    maxLength: 255,
  })
  description?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether the attribute is active.',
    example: true,
    default: true,
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether the attribute is filterable.',
    example: true,
    default: false,
  })
  isFilterable?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether the attribute applies to all categories.',
    example: false,
    default: false,
  })
  appliesToAll?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether the attribute is required.',
    example: false,
    default: false,
  })
  isRequired?: boolean;

  @ApiPropertyOptional({
    description:
      'Category UUIDs linked to the attribute. Required when appliesToAll is false.',
    type: [String],
    example: ['9b8c5c92-7c53-4a90-a4c0-6c8a4c2a4e11'],
  })
  categoryIds?: string[];
}

export class CreateBatchAttributeItemSwaggerDto extends CreateAttributeSwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Client-provided correlation key for the batch item.',
    example: 'tmp-1',
  })
  key!: string;
}

export class CreateBatchAttributesSwaggerDto {
  @ApiProperty({
    description: 'Attributes to create independently.',
    type: () => [CreateBatchAttributeItemSwaggerDto],
  })
  attributes!: CreateBatchAttributeItemSwaggerDto[];
}

export class UpdateAttributeSwaggerDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Updated attribute display name.',
    example: 'Size',
  })
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Updated attribute description.',
    example: 'Sizing option used for apparel and footwear.',
    maxLength: 255,
  })
  description?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Updated active flag.',
    example: true,
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Updated filterable flag.',
    example: true,
  })
  isFilterable?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Updated applies-to-all flag.',
    example: false,
  })
  appliesToAll?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Updated required flag.',
    example: false,
  })
  isRequired?: boolean;

  @ApiPropertyOptional({
    description:
      'Updated category UUIDs. Required when appliesToAll is explicitly false.',
    type: [String],
    example: ['9b8c5c92-7c53-4a90-a4c0-6c8a4c2a4e11'],
  })
  categoryIds?: string[];
}

export class ListAttributesDataSwaggerDto {
  @ApiProperty({
    description: 'Paginated attribute records.',
    type: () => [AttributeWithCategoriesSwaggerDto],
  })
  attributes!: AttributeWithCategoriesSwaggerDto[];

  @ApiPropertyOptional({
    type: Number,
    description: 'Total records available for the current filter.',
    example: 7,
  })
  totalCount?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Total offset pages available.',
    example: 1,
  })
  totalPages?: number;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: 'Next cursor token. Null when there is no next page.',
    example: 'eyJjdXJzb3IiOiJ...',
  })
  nextCursor?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: 'Previous cursor token. Null when there is no previous page.',
    example: 'eyJjdXJzb3IiOiJ...',
  })
  prevCursor?: string | null;
}

export class BatchAttributeSucceededSwaggerDto {
  @ApiProperty({
    type: String,
    description:
      'Client-provided correlation key for the successful batch item.',
    example: 'tmp-1',
  })
  key!: string;

  @ApiProperty({
    type: String,
    description: 'Created attribute UUID.',
    example: 'e5d0bdbd-7d6d-4853-b0fc-38f8441ec4fd',
  })
  id!: string;
}

export class BatchAttributeFailedSwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Client-provided correlation key for the failed batch item.',
    example: 'tmp-2',
  })
  key!: string;

  @ApiProperty({
    type: String,
    description: 'Failure reason returned for the item.',
    example: 'attribute name already exists',
  })
  reason!: string;
}

export class CreateBatchAttributesResultSwaggerDto {
  @ApiProperty({
    type: String,
    description: 'Overall batch outcome.',
    enum: ['success', 'partial', 'failed'],
    example: 'partial',
  })
  status!: 'success' | 'partial' | 'failed';

  @ApiProperty({
    description: 'Successfully created items.',
    type: () => [BatchAttributeSucceededSwaggerDto],
  })
  succeeded!: BatchAttributeSucceededSwaggerDto[];

  @ApiProperty({
    description: 'Failed items with reasons.',
    type: () => [BatchAttributeFailedSwaggerDto],
  })
  failed!: BatchAttributeFailedSwaggerDto[];
}

export class SuccessResponseSwaggerDto {
  @ApiProperty({
    type: Boolean,
    description: 'Success flag for the legacy API envelope.',
    example: true,
  })
  success!: true;

  @ApiProperty({
    type: String,
    description: 'Human-readable success message.',
    example: 'Attributes retrieved successfully',
  })
  message!: string;
}

export class ListAttributesResponseSwaggerDto extends SuccessResponseSwaggerDto {
  @ApiProperty({
    description: 'Paginated attributes payload.',
    type: () => ListAttributesDataSwaggerDto,
  })
  data!: ListAttributesDataSwaggerDto;
}

export class AttributeResponseSwaggerDto extends SuccessResponseSwaggerDto {
  @ApiProperty({
    description: 'Attribute payload.',
    type: () => AttributeWithCategoriesSwaggerDto,
  })
  data!: AttributeWithCategoriesSwaggerDto;
}

export class CreateBatchAttributesResponseSwaggerDto extends SuccessResponseSwaggerDto {
  @ApiProperty({
    description: 'Batch creation payload.',
    type: () => CreateBatchAttributesResultSwaggerDto,
  })
  data!: CreateBatchAttributesResultSwaggerDto;
}
