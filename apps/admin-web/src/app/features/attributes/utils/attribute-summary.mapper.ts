import { Attribute, AttributeSummary } from '@shared/models';

export const attributeToSummary = (attribute: Attribute): AttributeSummary => ({
    id: attribute.id,
    name: attribute.name,
    slug: attribute.slug,
});
