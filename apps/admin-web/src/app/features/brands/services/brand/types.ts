import { ApiResponse } from '@shared/interfaces';
import { Brand } from '@shared/models';

export interface SaveBrandRequest {
    name: string;
    logoUrl: string;
    description: string;
    metaTitle: string;
    website: string;
    metaDescription: string;
    visibleInMenu: boolean;
    isActive: boolean;
}

export type BulkSaveBrandItem = SaveBrandRequest & {
    key: string;
};

export type SaveBrandResponse = ApiResponse<Brand>;
