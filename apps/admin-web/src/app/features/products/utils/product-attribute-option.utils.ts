import { attributeToSummary } from '@attributes/utils/attribute-summary.mapper';
import { ProductAttributeOption } from '@products/components/forms/product-form/types';
import { Attribute } from '@shared/models';

export const attributeToProductAttributeOption = (
  attribute: Attribute,
): ProductAttributeOption => ({
  label: attribute.name,
  value: attributeToSummary(attribute),
});

export const attributesToProductAttributeOptions = (
  attributes: Attribute[],
  excludeGlobal = false, // ✅ parámetro opcional
): ProductAttributeOption[] =>
  attributes
    .filter((attribute) => !excludeGlobal || !attribute.appliesToAll)
    .map(attributeToProductAttributeOption);