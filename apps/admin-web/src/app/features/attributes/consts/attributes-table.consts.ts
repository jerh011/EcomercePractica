import { DataGridColumn } from "@shared/component/ui/data-grid/data-grid.types";

export const ATTRIBUTE_NAME_COLUMN: DataGridColumn = {
  label: 'Nombre',
  field: 'name',
};

export const ATTRIBUTE_CATEGORIES_COLUMN: DataGridColumn = {
  label: 'Categorías Aplicables',
  field: 'categories',
  template: 'categories',
};

export const ATTRIBUTE_FILTERABLE_COLUMN: DataGridColumn = {
  label: 'Visible en Filtros',
  field: 'isFilterable',
  template: 'filterable',
};

export const IS_REQUIRED_COLUMN: DataGridColumn = {
  label: 'Obligatorio',
  field: 'isRequired',
  template: 'required',
};

export const IS_ACTIVE_COLUMN: DataGridColumn = {
  label: 'Estado',
  field: 'isActive',
  template: 'active',
};

export const ATTRIBUTE_ACTIONS_COLUMN: DataGridColumn = {
  label: 'Acciones',
  field: 'actions',
  template: 'actions',
};

export const ATTRIBUTE_BASE_COLUMNS: DataGridColumn[] = [
  ATTRIBUTE_NAME_COLUMN,
  ATTRIBUTE_CATEGORIES_COLUMN,
  ATTRIBUTE_FILTERABLE_COLUMN,
  IS_REQUIRED_COLUMN,
  IS_ACTIVE_COLUMN,
  ATTRIBUTE_ACTIONS_COLUMN,
];

export const ATTRIBUTE_BULK_CREATOR_COLUMNS: DataGridColumn[] = [
  ATTRIBUTE_NAME_COLUMN,
  ATTRIBUTE_CATEGORIES_COLUMN,
  ATTRIBUTE_FILTERABLE_COLUMN,
  IS_REQUIRED_COLUMN,
  IS_ACTIVE_COLUMN,
  ATTRIBUTE_ACTIONS_COLUMN,
];
