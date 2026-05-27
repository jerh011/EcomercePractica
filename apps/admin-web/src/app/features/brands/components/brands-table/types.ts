import { EntityData, EntityRecord } from '@shared/interfaces';
import { Brand } from '@shared/models';

export type BrandRecord<TDraft extends EntityData = EntityData> = EntityRecord<
    TDraft,
    Brand & EntityData
>;

export type BrandStatusChange = { snapshot: BrandRecord; newValue: boolean };
export type BrandVisibleInMenuChange = { snapshot: BrandRecord; newValue: boolean };
