import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { PageHeader } from '@shared/component/page-header/page-header';
import { AttributeForm } from '@attributes/components/forms/attribute-form/attribute-form';
import { Button } from '@shared/component/ui/button/button';
import { Card } from '@shared/component/ui/card/card';
import { AttributesTable } from '@attributes/components/attributes-table/attributes-table';
import { ATTRIBUTE_BASE_COLUMNS } from '@attributes/consts/attributes-table.consts';
import { FormActionConfiguration } from '@shared/interfaces/form-actions-configuration.interface';
import {
  AttributeCategoryOption,
  AttributeFormData,
} from '@attributes/interfaces/attribute-form.interface';
import { RegisterAttributeDialogService } from '@attributes/services/register-attribute-dialog/register-attribute-dialog.service';
import { AttributeBulkCreatorPageService } from '@attributes/services/attribute-bulk-creator-page/attribute-bulk-creator-page.service';
import { toAttributeCategoryOption } from '@attributes/utils/register-attribute-dialog.utils';
import {
  attributeFormDataToAttributeDraftRecord,
} from '@attributes/mappers/attribute-record.mapper';
import { AttributeRecord } from '@attributes/interfaces/attribute-record.interface';
import { AttributeActionsOptions } from '@attributes/components/attribute-actions/attribute-actions.types';
import { attributeDraftToRegisterAttributeBatchRequest } from '@attributes/mappers/register-attribute-dialog.mapper';
import {
  BatchOperationResponse,
  CreatedFailed,
  CreatedSucceeded,
} from '@shared/interfaces/api-response.interface';
import { ToastService } from '@shared/services/toast/toast.service';
import { DialogService } from '@shared/services/toast/dialog/dialog.service';
import { Location } from '@angular/common';
import { AttributeCategoriesService } from '@attributes/services/attribute-categories/attribute-categories.service';
import { CategorySummary } from '@shared/models';

@Component({
  selector: 'ecom-attribute-bulk-creator-page',
  imports: [
    PageLayout,
    PageHeader,
    AttributeForm,
    Card,
    Button,
    AttributesTable,
  ],
  templateUrl: './attribute-bulk-creator-page.html',
  styleUrl: './attribute-bulk-creator-page.css',
  providers: [
    RegisterAttributeDialogService,
    AttributeBulkCreatorPageService,
    AttributeCategoriesService,
  ],
})
export class AttributeBulkCreatorPage implements OnInit {
  private readonly attributeCategoriesService: AttributeCategoriesService =
    inject(AttributeCategoriesService);
  private readonly attributesFormService: RegisterAttributeDialogService =
    inject(RegisterAttributeDialogService);
  private readonly pageService: AttributeBulkCreatorPageService = inject(
    AttributeBulkCreatorPageService,
  );
  private readonly toastService: ToastService = inject(ToastService);
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly location = inject(Location);

  private categories = signal<CategorySummary[]>([]);
  categoryOptions = computed<AttributeCategoryOption[]>(() => {
    return this.categories().map(toAttributeCategoryOption);
  });

  readonly hasChanges = computed(() => this.attributes().length > 0);

  formActionOptions = signal<FormActionConfiguration>({
    submitLabel: 'Agregar registro',
    canCancel: false,
    canClear: true,
    clearLabel: 'Limpiar formulario',
    resetOnSubmit: true,
  });
  attributes = signal<AttributeRecord[]>([]);
  columns = ATTRIBUTE_BASE_COLUMNS;

  readonly attributesActionOptions = signal<AttributeActionsOptions>({
    canEdit: false,
    canView: false,
    canDelete: true,
  });

  ngOnInit(): void {
    this.loadInitialData();
  }
  private loadInitialData(): void {
    this.attributeCategoriesService.fetchCategories().subscribe({
      next: (response) => {
        this.categories.set(response.categories ?? []);
      },
      error: (err) => console.error('[loadInitialData] error:', err),
    });
  }

  fetchCategories(): void {
    this.attributeCategoriesService.fetchCategories().subscribe({
      next: (response) => {
        const { categories } = response;
        this.categories.update((current) => {
          const newCategories = categories.filter(
            (newCategory) => !current.some((cat) => cat.id === newCategory.id),
          );
          return [...current, ...newCategories];
        });
      },
    });
  }

  onSearchCategories(query: string): void {
    const isValidQuery = query.length > 0;
    this.attributeCategoriesService.categoriesSearchParams.update((params) => ({
      ...params,
      query: isValidQuery ? query : undefined,
    }));
    if (isValidQuery) {
      this.fetchCategories();
    }
  }

  onScrollCategoriesToEnd(): void {
    if (!this.attributeCategoriesService.categoriesSearchParams().query) {
      return;
    }
    this.fetchCategories();
  }

  onSubmit(formData: AttributeFormData) {
    this.attributes.update((current) => [
      attributeFormDataToAttributeDraftRecord(formData),
      ...current,
    ]);
  }

  onSaveChanges() {
    const attributesToRegister = this.attributes()
      .filter((record) => record.source === 'draft')
      .map((record) =>
        attributeDraftToRegisterAttributeBatchRequest(record.data),
      );

    this.pageService.registerAttributes(attributesToRegister).subscribe({
      next: (response) => {
        this.handleBatchResponse(response.data);
        this.attributes.set([]);
      },
    });
  }

  private handleBatchResponse(data: BatchOperationResponse) {
    if (data.succeeded.length > 0) {
      this.handleSaveSuccess(data.succeeded);
    }
    if (data.failed.length > 0) {
      this.handleSaveFailure(data.failed);
    }
  }

  private handleSaveSuccess(success: CreatedSucceeded[]) {
    this.toastService.showSuccess(
      `Se registraron ${success.length} atributos correctamente.`,
    );
  }

  private handleSaveFailure(errors: CreatedFailed[]) {
    const errorMessages = errors
      .map((e) => `- ${e.key}: ${e.reason}`)
      .join('\n');
    this.toastService.showError(
      `No se pudieron registrar ${errors.length} atributos:\n${errorMessages}`,
    );
  }

  onCancel() {
    if (this.hasChanges()) {
      this.dialogService
        .openConfirm(
          {},
          {
            title: 'Confirmación',
          },
        )
        .onClose$.subscribe((confirmed) => {
          if (confirmed) {
            this.attributes.set([]);
            this.location.back();
          }
        });
    } else {
      this.location.back();
    }
  }

  onDelete(record: AttributeRecord) {
    this.attributes.update((current) =>
      current.filter((r) => r.data.key !== record.data.key),
    );
  }
}
