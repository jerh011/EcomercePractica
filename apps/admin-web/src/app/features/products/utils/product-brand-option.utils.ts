import { ProductBrandOption } from '@products/components/forms/product-form/types';
import { Brand } from '@shared/models';

export const brandToProductBrandOption = (brand: Brand): ProductBrandOption => ({
    label: brand.name,
    value: brand.id,
});
