import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  AttributeCategoryOption,
  AttributeFormData,
} from '@attributes/interfaces/attribute-form.interface';
import { IDialogComponent } from '@shared/component/ui/dialog/interfaces/dialog-component.interface';
import { DialogRef } from '@shared/component/ui/dialog/models/dialog-ref.model';
import {
  Attribute,
} from '@shared/models/attribute.model';
import { AttributeForm } from '@attributes/components/forms/attribute-form/attribute-form';
import { RegisterAttributeDialogService } from '@attributes/services/register-attribute-dialog/register-attribute-dialog.service';
import { toAttributeCategoryOption } from '@attributes/utils/register-attribute-dialog.utils';
import { ToastService } from '@shared/services/toast/toast.service';
import { attributeFormDataToRegisterAttributeRequest } from '@attributes/mappers/register-attribute-dialog.mapper';
import { AttributeCategoriesService } from '@attributes/services/attribute-categories/attribute-categories.service';
import { DialogService } from '@shared/services/toast/dialog/dialog.service';
import { CategorySummary } from '@shared/models';

@Component({
  selector: 'ecom-register-attribute-dialog',
  imports: [AttributeForm],
  templateUrl: './register-attribute-dialog.html',
  styleUrl: './register-attribute-dialog.css',
  providers: [RegisterAttributeDialogService, AttributeCategoriesService],
})
export class RegisterAttributeDialog
  implements IDialogComponent<Attribute | undefined, AttributeFormData>, OnInit
{
  private readonly attributeCategoriesService: AttributeCategoriesService =
    inject(AttributeCategoriesService);
  private readonly pageService: RegisterAttributeDialogService = inject(
    RegisterAttributeDialogService,
  );

  private readonly dialogService = inject(DialogService);

  private readonly toastService = inject(ToastService);

  categories = signal<CategorySummary[]>([]);

  categoryOptions = computed<AttributeCategoryOption[]>(() => {
    return this.categories().map(toAttributeCategoryOption);
  });

  protected modalRef = signal<
    DialogRef<Attribute | undefined, AttributeFormData> | undefined
  >(undefined);

  ngOnInit(): void {
    this.loadInitialData();
  }

  setDialogRef(
    modalRef: DialogRef<Attribute | undefined, AttributeFormData>,
  ): void {
    this.modalRef.set(modalRef);
  }

  private loadInitialData(): void {
    this.attributeCategoriesService.fetchCategories().subscribe({
      next: (response) => {
        console.log('[loadInitialData] full response:', response);
        console.log('[loadInitialData] response.data:', response.categories);
        this.categories.set(response.categories ?? []);
      },
      error: (err) => console.error('[loadInitialData] error:', err),
    });
  }
  onFormSubmitted(formData: AttributeFormData): void {
    const request = attributeFormDataToRegisterAttributeRequest(formData);
    this.pageService.saveAttribute(request).subscribe({
      next: ({ data }) => {
        this.toastService.showSuccess(
          'Atributo creado',
          `El atributo "${data.name}" ha sido creado exitosamente.`,
        );
        this.modalRef()?.close(formData);
      },
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

  onCancel(hasChanges: boolean): void {
    if (hasChanges) {
      this.dialogService
        .openConfirm(
          {
            message:
              '¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.',
          },
          {
            title: 'Confirmar cancelación',
          },
        )
        .onClose$.subscribe((confirmed) => {
          if (confirmed) {
            this.closeDialog();
          }
        });
    } else {
      this.closeDialog();
    }
  }

  private closeDialog(formData?: AttributeFormData): void {
    this.modalRef()?.close(formData);
  }
}
