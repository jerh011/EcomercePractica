export interface AdditionalAttributesSearchParams {
    categoryIds: string;
    appliesToAll?: boolean;
}

export interface CategoryAttributesSearchParams {
    categoryIds: string;
    appliesToAll?: true;
    or?: 'categoryIds,appliesToAll';
}
