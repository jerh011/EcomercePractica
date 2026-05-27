import { FormControl } from '@angular/forms';
import { InputSelectOption } from '@shared/component/ui/input-select/input-select.types';
import { CategorySummary } from '@shared/models';
import { Attribute } from '@shared/models/attribute.model';

export type AttributeFormData = Pick<
  Attribute,
  | 'name'
  | 'description'
  | 'isActive'
  | 'isFilterable'
  | 'appliesToAll'
  | 'isRequired'
> & { categories: CategorySummary[] };

export type AttributeFormSchema = {
  [K in keyof AttributeFormData]: FormControl<AttributeFormData[K]>;
};

export interface AttributeCategoryOption
  extends InputSelectOption<CategorySummary> {
  isSelected?: boolean;
}
