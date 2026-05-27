import { AttributeFormData } from '@attributes/interfaces/attribute-form.interface';
import {
  AttributeDraft,
  AttributeOriginal,
  AttributePersisted,
  AttributeRecord,
} from '@attributes/interfaces/attribute-record.interface';
import { Attribute } from '@shared/models/attribute.model';

export function toAttributePersistedRecord(attribute: Attribute): AttributeRecord {
  const original: AttributeOriginal = {
    key: attribute.id,
    name: attribute.name,
    isActive: attribute.isActive,
    appliesToAll: attribute.appliesToAll,
    categories: attribute.categories,
    description: attribute.description,
    isRequired: attribute.isRequired,
    isFilterable: attribute.isFilterable,
  };
  return {
    source: 'persisted',
    data: { ...original, original },
  };
}

export function toAttributeDraftRecord(draft: AttributeDraft): AttributeRecord {
  return { source: 'draft', data: draft };
}

export function attributeDraftToAttributePersistedRecord(
  draft: AttributeDraft,
  id: string,
  categories: Attribute['categories'],
): AttributeRecord {
  const base = {
    key: id,
    name: draft.name,
    isActive: draft.isActive,
    appliesToAll: draft.appliesToAll,
    description: draft.description,
    isRequired: draft.isRequired,
    isFilterable: draft.isFilterable,
    categories: categories,
  };

  const data: AttributePersisted = {
    ...base,
    original: { ...base } as AttributePersisted,
  };

  return { source: 'persisted', data };
}

export function attributeFormDataToAttributeDraftRecord(
  formData: AttributeFormData,
): AttributeRecord {
  const draft: AttributeDraft = {
    name: formData.name,
    isActive: formData.isActive,
    appliesToAll: formData.appliesToAll,
    description: formData.description,
    isRequired: formData.isRequired,
    isFilterable: formData.isFilterable,
    categories: formData.categories,
    key: crypto.randomUUID(),
  };
  return toAttributeDraftRecord(draft);
}
