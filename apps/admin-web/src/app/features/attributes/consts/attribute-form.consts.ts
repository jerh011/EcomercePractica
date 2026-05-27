import { AttributeFormData } from "@attributes/interfaces/attribute-form.interface";

export const DEFAULT_ATTRIBUTE_FORM_VALUE: AttributeFormData = {
  name: '',
  description: '',
  isActive: true,
  isFilterable: true,
  appliesToAll: false,
  isRequired: false,
  categories: [],
}
