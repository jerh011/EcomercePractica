import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PageHeader } from '@shared/component/page-header/page-header';
import { Card } from '@shared/component/ui/card/card';
import { Button } from '@shared/component/ui/button/button';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { CategoryForm } from '@categories/components/forms/category-form/category-form';
import { CategoriesTable } from '@categories/components/categories-table/categories-table';
import {
  createPagination,
  FormActionsOptions,
  FormEvent,
} from '@shared/interfaces';
import { CategoryDraft } from './types';
import { CategoryFormData } from '@categories/components/forms/category-form/types';
import { toDraftRecord } from '@shared/mappers/entity-record.mapper';
import { BULK_CATEGORY_REGISTRATION_COLUMNS } from './consts';
import { CategoriesActionsOptions } from '@categories/components/category-table-actions/types';
import { CategoriesTableService } from '@categories/components/categories-table/categories-table.service';
import { CategoryRecord } from '@categories/components/categories-table/types';
import { CategoryService } from '@categories/services/category/category.service';
import { BulkSaveCategoryItem } from '@categories/services/category/types';
import { ToastService } from '@shared/services/toast/toast.service';
import { DialogService } from '@shared/services/toast/dialog/dialog.service';
import { Location } from '@angular/common';

@Component({
  selector: 'ecom-bulk-category-registration.page',
  imports: [
    PageLayout,
    PageHeader,
    CategoryForm,
    Card,
    CategoriesTable,
    Button,
  ],
  templateUrl: './bulk-category-registration.page.html',
  styleUrl: './bulk-category-registration.page.css',
  providers: [CategoriesTableService, CategoryService],
})
export class BulkCategoryRegistrationPage implements OnInit {
  private readonly categoriesTableService: CategoriesTableService = inject(
    CategoriesTableService,
  );
  private readonly toastService: ToastService = inject(ToastService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly dialogService = inject(DialogService);
  private readonly location: Location = inject(Location);

  categories = signal<CategoryDraft[]>([]);

  readonly canSave = computed(() => this.categories().length > 0);
  readonly columns = BULK_CATEGORY_REGISTRATION_COLUMNS;

  readonly pagination = createPagination({
    showPagination: false,
  });

  readonly categoryTableActions: CategoriesActionsOptions = {
    canDelete: true,
    canEdit: false,
    canView: false,
    canViewSubcategories: false,
  };

  readonly formActions = new FormActionsOptions({
    canCancel: false,
    canClear: true,
    clearOnSubmit: true,
    submitButtonVariant: 'secondary',
    submitLabel: 'Agregar Registro',
    clearButtonVariant: 'ghost',
  });

  ngOnInit(): void {
    this.registerTableHandlers();
  }

  private registerTableHandlers() {
    this.registerActionCategoryHanlder();
  }

  private registerActionCategoryHanlder() {
    this.categoriesTableService.actionCategory$.subscribe(
      ({ action, record }) => {
        switch (action) {
          case 'delete':
            this.onDeleteCategory(record);
            break;
        }
      },
    );
  }

  private onDeleteCategory(record: CategoryRecord) {
    this.categories.update((categories) =>
      categories.filter((c) => c.data._recordKey !== record.data._recordKey),
    );
  }

  async onSubmit(event: FormEvent<CategoryFormData>) {
    const data = event.data!;
    let imageUrl = this.toCategoryImageUrl(data.imageUrl);

    if (imageUrl && imageUrl.length > 100000) {
      imageUrl = await this.compressImage(imageUrl, 800, 0.7);
      data.imageUrl = imageUrl ? [imageUrl] : [];
    }

    const draft = toDraftRecord<CategoryFormData>(data);
    this.categories.update((categories) => [...categories, draft]);
  }

  private compressImage(
    base64: string,
    maxWidth = 800,
    quality = 0.7,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  }

  async onSave() {
    const categoriesToSave: BulkSaveCategoryItem[] = [];

    for (const category of this.categories()) {
      let imageUrl = this.toCategoryImageUrl(category.data.imageUrl);

      if (imageUrl && imageUrl.length > 100000) {
        imageUrl = await this.compressImage(imageUrl, 800, 0.7);
      }

      categoriesToSave.push({
        key: category.data._recordKey,
        description: category.data.description,
        imageUrl: imageUrl,
        isActive: category.data.isActive,
        metaDescription: category.data.metaDescription,
        metaTitle: category.data.metaTitle,
        name: category.data.name,
        visibleInMenu: category.data.visibleInMenu,
      });
    }

    this.categoryService
      .saveBatchCategories(categoriesToSave)
      .subscribe((response: any) => {
        const succeeded = response.succeeded || response.data?.succeeded || [];
        const failed = response.failed || response.data?.failed || [];

        const savedCount = succeeded.length;
        if (savedCount > 0) {
          this.toastService.showSuccess(
            `${savedCount} categorías registradas exitosamente.`,
          );
        }
        const failedCount = failed.length;
        if (failedCount > 0) {
          this.toastService.showError(
            `${failedCount} categorías no pudieron ser registradas.`,
          );
        }
        this.categories.update((categories) =>
          categories.filter(
            (c) => !succeeded.some((s: any) => s.key === c.data._recordKey),
          ),
        );
      });
  }

  private toCategoryItem({ data }: CategoryDraft): BulkSaveCategoryItem {
    return {
      key: data._recordKey,
      description: data.description,
      imageUrl: this.toCategoryImageUrl(data.imageUrl),
      isActive: data.isActive,
      metaDescription: data.metaDescription,
      metaTitle: data.metaTitle,
      name: data.name,
      visibleInMenu: data.visibleInMenu,
    };
  }

  private toCategoryImageUrl(value: string[]): string | undefined {
    return value[0] || undefined;
  }

  onCancel(): void {
    if (this.categories().length === 0) {
      return this.goBack();
    }
    this.dialogService
      .openConfirm(
        {
          message:
            '¿Estás seguro que deseas cancelar? Se perderán los cambios no guardados.',
          confirmText: 'Sí, cancelar',
          confirmVariant: 'danger',
          cancelText: 'No, continuar editando',
        },
        {
          title: 'Confirmar cancelación',
        },
      )
      .onClose$.subscribe((confirmed) => {
        if (confirmed) {
          this.goBack();
        }
      });
  }

  private goBack() {
    this.location.back();
  }
}
