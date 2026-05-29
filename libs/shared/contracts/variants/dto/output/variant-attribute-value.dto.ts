import type { AttributeSummaryDto } from '../../../common/dto/output/entity-summary.dto.ts';

export interface VariantAttributeValueDto {
  attribute: AttributeSummaryDto;
  value: string;
}
