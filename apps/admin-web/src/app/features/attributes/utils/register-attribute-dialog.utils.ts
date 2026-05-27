import { AttributeCategoryOption } from "@attributes/interfaces/attribute-form.interface";
import { CategorySummary } from "@shared/models";

export function toAttributeCategoryOption(
  category: CategorySummary,
): AttributeCategoryOption {
  return {
    label: category.name,
    value: category,
  };
}
