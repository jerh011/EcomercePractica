import { EntityData, PersistedRecord } from '@shared/interfaces';
import { Brand } from '@shared/models';

export type BrandPersistedRecord = PersistedRecord<Brand & EntityData>;
