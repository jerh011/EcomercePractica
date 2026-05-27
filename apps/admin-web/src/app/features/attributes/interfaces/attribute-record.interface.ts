import { CategorySummary } from '@shared/models';
import { Attribute } from '@shared/models/attribute.model';

export type AttributeRecordKey = string;

export type AttributeDraft = Partial<Omit<Attribute, 'id' | 'categories'>> & {
  key: AttributeRecordKey;
  categories: CategorySummary[];
};

export type AttributeOriginal = Partial<Omit<Attribute, 'id'>> & {
  key: AttributeRecordKey;
};

export type AttributePersisted = AttributeOriginal & {
  original: AttributeOriginal;
};

export type AttributeRecord =
  | { source: 'draft'; data: AttributeDraft }
  | { source: 'persisted'; data: AttributePersisted };

export interface PendingAttributeChanges {
  id: string;
  changes: Partial<AttributePersisted>;
}
