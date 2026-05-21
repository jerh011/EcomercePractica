import { ACTIONS_COLUMN, META_TITLE_COLUMN, NAME_COLUMN, PARENT_COLUMN, SLUG_COLUMN, STATUS_COLUMN, VISIBLE_IN_MENU_COLUMN } from "@categories/consts/categories-columns.consts";
import { DataGridColumn } from "@shared/component/ui/data-grid/data-grid.types";

export const CATEGORIES_BASE_COLUMNS: DataGridColumn[] = [
    NAME_COLUMN,
    SLUG_COLUMN,
    PARENT_COLUMN,
    VISIBLE_IN_MENU_COLUMN,
    STATUS_COLUMN,
    ACTIONS_COLUMN,
];
