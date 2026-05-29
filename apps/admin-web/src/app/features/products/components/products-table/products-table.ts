import { Component, computed, inject, input } from '@angular/core';
import { DataGridColumn } from '@shared/component/ui/data-grid/data-grid.types';
import { PRODUCTS_TABLE_BASE_COLUMNS } from './consts';
import { ProductRecord } from './types';
import { Card } from '@shared/component/ui/card/card';
import { PaginationFooter } from '@shared/component/pagination-footer/pagination-footer';
import { Switch } from '@shared/component/ui/switch/switch';
import { Tooltip } from '@shared/component/ui/tooltip/tooltip';
import { DataGrid } from '@shared/component/ui/data-grid/data-grid';
import { CellTemplate } from '@shared/component/ui/data-grid/directives/cell-template';
import { ProductTableActions } from '../product-table-actions/product-table-actions';
import { ProductTableActionsOptions } from '../product-table-actions/types';
import { PaginationOptions } from '@shared/interfaces';
import { EntityData } from '@shared/interfaces';
import { CurrencyPipe } from '@shared/pipes/currency/currency-pipe';
import { ProductsTableService } from './products-table.service';
import { Slot } from "@shared/directives/slot/slot";

@Component({
  selector: 'ecom-products-table',
  imports: [
    Card,
    DataGrid,
    CellTemplate,
    ProductTableActions,
    PaginationFooter,
    CurrencyPipe,
    Switch,
    Slot,
    Tooltip
],
  templateUrl: './products-table.html',
})
export class ProductsTable {
  private readonly service = inject(ProductsTableService);

  columns = input<DataGridColumn[]>(PRODUCTS_TABLE_BASE_COLUMNS);
  data = input<ProductRecord[]>([]);
  rows = computed(() => this.data().map((record) => record.data));
  titleCard = input<string | null>(null);
  private readonly snapshot = computed(() =>
    this.data().map((record) => structuredClone(record)),
  );
  actionsOptions = input<ProductTableActionsOptions>({
    canAddOffer: true,
    canDelete: true,
    canEdit: true,
    canView: true,
  });

  pagination = input.required<PaginationOptions>();

  onPageChange(page: number) {
    this.service.pageChange$.next(page);
  }

  toggleFeatured(data: EntityData, newValue: boolean): void {
    const snapshot = this.snapshot().find(
      (r) => r.data._recordKey === data._recordKey,
    );
    if (!snapshot) {
      this.service.productFeaturedChange$.error(
        new Error(
          `No se encontró el registro para el producto con _recordKey: ${data._recordKey}`,
        ),
      );
    }
    if (snapshot) {
      this.service.productFeaturedChange$.next({
        snapshot,
        newValue,
      });
    }
  }

  toggleStatus(data: EntityData, newValue: boolean): void {
    const snapshot = this.snapshot().find(
      (r) => r.data._recordKey === data._recordKey,
    );
    if (!snapshot) {
      this.service.productStatusChange$.error(
        new Error(
          `No se encontró el registro para el producto con _recordKey: ${data._recordKey}`,
        ),
      );
    }
    if (snapshot) {
      this.service.productStatusChange$.next({
        snapshot,
        newValue,
      });
    }
  }

  onDelete(data: EntityData) {
    const record = this.data().find(
      (r) => r.data._recordKey === data._recordKey,
    );
    if (!record) {
      this.service.actionProduct$.error(
        new Error(
          `No se encontró el registro para el producto con _recordKey: ${data._recordKey}`,
        ),
      );
    }
    if (record) {
      this.service.actionProduct$.next({ action: 'delete', record });
    }
  }

  onEdit(data: EntityData) {
    const record = this.data().find(
      (r) => r.data._recordKey === data._recordKey,
    );
    if (record) {
      this.service.actionProduct$.next({ action: 'edit', record });
    }
  }

  onView(data: EntityData) {
    const record = this.data().find(
      (r) => r.data._recordKey === data._recordKey,
    );
    if (record) {
      this.service.actionProduct$.next({ action: 'view', record });
    }
  }

  onAddOffer(data: EntityData) {
    const record = this.data().find(
      (r) => r.data._recordKey === data._recordKey,
    );
    if (record) {
      this.service.actionProduct$.next({ action: 'addOffer', record });
    }
  }
}
