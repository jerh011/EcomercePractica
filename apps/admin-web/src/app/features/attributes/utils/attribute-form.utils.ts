import {
  AttributeCategoryOption,
  AttributeFormData,
} from '@attributes/interfaces/attribute-form.interface';

export function areAttributeFormDataEqual(
  a: AttributeFormData,
  b: AttributeFormData,
): boolean {
  return (
    a.name === b.name &&
    a.description === b.description &&
    a.isActive === b.isActive &&
    a.isFilterable === b.isFilterable &&
    a.appliesToAll === b.appliesToAll &&
    a.isRequired === b.isRequired &&
    JSON.stringify(a.categories) === JSON.stringify(b.categories)
  );
}

export function getCategoriesSelectOptions(
  options: AttributeCategoryOption[],
  selectedCategoryIds: AttributeCategoryOption[],
): AttributeCategoryOption[] {
  return options.map((option) => ({
    ...option,
    isSelected: selectedCategoryIds.includes(option),
  }));
}
