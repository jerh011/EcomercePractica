import { BrandPersistedRecord } from '@brands/interfaces/brand-persisted-record.interface';
import { DraftRecord, EntityData, OffsetPaginatedResponse } from '@shared/interfaces';
import { Brand } from '@shared/models';

export type BrandsOffsetResponse = OffsetPaginatedResponse<'brands', Brand>;

export type BrandTableDraft = DraftRecord<Pick<Brand, 'name' | 'slug'> & EntityData>;
export type BrandTableRecord = BrandPersistedRecord | BrandTableDraft;
