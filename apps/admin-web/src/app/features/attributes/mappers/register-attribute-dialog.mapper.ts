import { AttributeFormData } from '@attributes/interfaces/attribute-form.interface';
import { AttributeDraft } from '@attributes/interfaces/attribute-record.interface';
import {
  RegisterAttributeBatchItem,
  RegisterAttributeRequest,
} from '@attributes/interfaces/register-attribute.interface';

export function attributeFormDataToRegisterAttributeRequest(
  formData: AttributeFormData,
): RegisterAttributeRequest {
  return {
    name: formData.name,
    description: formData.description,
    isActive: formData.isActive,
    isFilterable: formData.isFilterable,
    appliesToAll: formData.appliesToAll,
    isRequired: formData.isRequired,
    categoryIds: formData.categories.map((c) => c.id),
  };
}

export function attributeDraftToRegisterAttributeBatchRequest(
  record: AttributeDraft,
): RegisterAttributeBatchItem {
  return {
    key: record.key!,
    name: record.name!,
    description: record.description!,
    isActive: record.isActive!,
    isFilterable: record.isFilterable!,
    appliesToAll: record.appliesToAll!,
    isRequired: record.isRequired!,
    categoryIds: record.categories.map((c) => c.id),
  };
}
