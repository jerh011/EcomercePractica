import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { PageHeader } from '@shared/component/page-header/page-header';
import { Card } from '@shared/component/ui/card/card';
import { AttributesToolbar } from '@attributes/components/attributes-toolbar/attributes-toolbar';
import { AttributeRegistrationMode } from '@attributes/components/attributes-toolbar/attributes-toolbar.types';
import { AttributesPageService } from '@attributes/services/attributes-page/attributes-page.service';
import { toAttributePersistedRecord } from '@attributes/mappers/attribute-record.mapper';
import { Attribute } from '@shared/models/attribute.model';
import { AttributesTable } from '@attributes/components/attributes-table/attributes-table';
import { ATTRIBUTE_BASE_COLUMNS } from '@attributes/consts/attributes-table.consts';
import { DataGridColumn } from '@shared/component/ui/data-grid/data-grid.types';
import { PaginationFooter } from '@shared/component/pagination-footer/pagination-footer';
import { Slot } from '@shared/directives/slot/slot';
import { DialogService } from '@shared/services/toast/dialog/dialog.service';
import { RegisterAttributeDialog } from '@attributes/components/dialogs/register-attribute-dialog/register-attribute-dialog';
import { DIMENSIONS } from '@shared/constants/dimensions.consts';
import { Router } from '@angular/router';
import { AttributesCompositeResponse } from '@attributes/interfaces/attributes-page.interface';
import { AttributeRecord } from '@attributes/interfaces/attribute-record.interface';
import { AttributeDetailsDialog } from '@attributes/components/dialogs/attribute-details-dialog/attribute-details-dialog';
@Component({
  selector: 'ecom-attributes-page',
  imports: [
    PageLayout,
    PageHeader,
    Card,
    AttributesToolbar,
    AttributesTable,
    PaginationFooter,
    Slot,
  ],
  templateUrl: './attributes-page.html',
  styleUrl: './attributes-page.css',
  providers: [AttributesPageService],
})
export class AttributesPage implements OnInit {
  private readonly pageService: AttributesPageService = inject(
    AttributesPageService,
  );
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);

  protected totalCount = signal(0);
  protected totalPages = signal(0);
  protected attributes = signal<Attribute[]>([]);

  readonly columns: DataGridColumn[] = ATTRIBUTE_BASE_COLUMNS;
  readonly rows = computed(() =>
    this.attributes().map((attr) => toAttributePersistedRecord(attr)),
  );

  readonly currentPage = computed(
    () => this.pageService.attributesSearchParams().page || 1,
  );
  readonly pageSize = computed(
    () => this.pageService.attributesSearchParams().pageSize || 5,
  );

  onAttributeRegistrationModeSelect(mode: AttributeRegistrationMode): void {
    if (mode === 'unique') {
      this.onRegisterUniqueAttribute();
    } else if (mode === 'multiple') {
      this.onRegisterMultipleAttributes();
    }
  }

  private onRegisterUniqueAttribute(): void {
    this.dialogService
      .open(RegisterAttributeDialog, undefined, {
        title: 'Nuevo registro',
        width: DIMENSIONS.MODAL.WIDTH,
        height: '70%',
        showCloseButton: false,
        closeOnBackdropClick: false,
        closeOnEscape: false,
      })
      .onClose$.subscribe((result) => {
        if (result) {
          this.fetchAttributes();
        }
      });
  }

  private onRegisterMultipleAttributes(): void {
    this.router.navigate(['/catalogs/attributes/register']);
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.pageService.attributesPageComposite().subscribe({
      next: ({ data }) => this.applyCompositeData(data),
      error: (err) =>
        console.error('Error loading attributes composite data', err),
    });
  }

  private applyCompositeData(data: AttributesCompositeResponse): void {
    this.attributes.set(data.table.attributes);
    this.totalCount.set(data.table.totalCount);
    this.totalPages.set(data.table.totalPages);
  }

  onPageChange(newPage: number): void {
    this.pageService.attributesSearchParams.update((params) => ({
      ...params,
      page: newPage,
    }));
    this.fetchAttributes();
  }

  private fetchAttributes(): void {
    this.pageService.fetchAttributes().subscribe({
      next: ({ data }) => {
        this.attributes.set(data.attributes);
        this.totalCount.set(data.totalCount);
        this.totalPages.set(data.totalPages);
      },
    });
  }

  onEditAttribute(record: AttributeRecord): void {
    this.router.navigate(['/catalogs/attributes', record.data.key, 'edit']);
  }

  onViewAttributeDetails(record: AttributeRecord): void {
    this.dialogService.open(AttributeDetailsDialog, record.data.key, {
      title: 'Detalles',
      width: DIMENSIONS.MODAL.WIDTH,
      maxHeight: '80vh',
    });
  }

  onDeleteAttribute(record: AttributeRecord): void {
    if (record.source === 'draft') {
      throw new Error('No se puede eliminar un atributo en estado borrador');
    }
    this.dialogService
      .openConfirm(
        {
          message: `¿Estás seguro de que deseas eliminar el atributo "${record.data.name}"? Esta acción no se puede deshacer.`,
          cancelText: 'Cancelar',
          confirmText: 'Eliminar',
          confirmVariant: 'danger',
          cancelVariant: 'outline',
        },
        {
          title: 'Confirmar eliminación',
        },
      )
      .onClose$.subscribe((confirmed) => {
        if (confirmed) {
          this.handleConfirmDeleteAttribute(record.data.key);
        }
      });
  }

  private handleConfirmDeleteAttribute(attributeKey: string): void {
    this.pageService.deleteAttribute(attributeKey).subscribe({
      next: () => {
        this.fetchAttributes();
      },
      error: (err) => {
        console.error(
          `Error deleting attribute with key "${attributeKey}"`,
          err,
        );
      },
    });
  }
}
