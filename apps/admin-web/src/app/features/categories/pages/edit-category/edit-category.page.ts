import { Component, computed, inject, signal, effect } from '@angular/core';
import { PageHeader } from '@shared/component/page-header/page-header';
import { Card } from '@shared/component/ui/card/card';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { CategoryForm } from '@categories/components/forms/category-form/category-form';
import { CategoryService } from '@categories/services/category/category.service';
import { Category } from '@shared/models';
import { CategoryFormData } from '@categories/components/forms/category-form/types';
import { FormEvent } from '@shared/interfaces';
import { UpdateCategory } from '@categories/services/category-actions/types';
import { CategoryActionsService } from '@categories/services/category-actions/category-actions.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { Location } from '@angular/common';
import { DialogService } from '@shared/services/toast/dialog/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ecom-edit-category.page',
  imports: [PageLayout, PageHeader, Card, CategoryForm],
  templateUrl: './edit-category.page.html',
  styleUrl: './edit-category.page.css',
  providers: [CategoryService, CategoryActionsService],
})
export class EditCategoryPage {
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly categoryActionsService: CategoryActionsService = inject(CategoryActionsService);
  private readonly toastService = inject(ToastService);
  private readonly location = inject(Location);
  private readonly dialogService = inject(DialogService);
  private readonly route = inject(ActivatedRoute);
  
  private routeParams = toSignal(this.route.params);
  private id = computed(() => this.routeParams()?.['id'] as string | undefined);
  private category = signal<Category | null>(null);
  
  isLoading = computed(() => this.category() === null);
  
  // IMPORTANTE: Esto nunca retorna null, retorna un objeto vacío mientras carga
  categoryFormData = computed((): CategoryFormData => {
    const currentCategory = this.category();
    if (!currentCategory) {
      // Retorna un objeto vacío mientras carga
      return {
        name: '',
        description: '',
        imageUrl: [],
        isActive: true,
        metaDescription: '',
        metaTitle: '',
        visibleInMenu: false,
      };
    }
    return this.toCategoryFormData(currentCategory);
  });
  
  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadCategory(currentId);
      }
    });
  }
  
  private loadCategory(categoryId: string) {
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (category) => {
        this.category.set(category);
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.toastService.showError('Error al cargar la categoría');
      }
    });
  }
  
  onSubmit(event: FormEvent<CategoryFormData>) {
    this.submitActionHandler(event);
  }
  
  onCanceled(event: FormEvent<CategoryFormData>) {
    this.cancelActionHandler(event);
  }
  
  private submitActionHandler(event: FormEvent<CategoryFormData>) {
    const currentId = this.id();
    if (!currentId) return;
    
    const payload = this.toUpdateCategoryPayload(event.changes!);
    this.categoryActionsService.updateCategory(currentId, payload).subscribe({
      next: (category) => {
        this.category.set(category);
        this.toastService.showSuccess('Categoría actualizada exitosamente');
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this.toastService.showError('Error al actualizar la categoría');
      },
    });
  }
  
  private cancelActionHandler({ hasChanges }: FormEvent<CategoryFormData>) {
    if (!hasChanges) {
      return this.goBack();
    }
    
    this.dialogService
      .openConfirm(
        {
          message: '¿Estás seguro de que quieres cancelar los cambios?',
          confirmText: 'Sí, cancelar',
          confirmVariant: 'danger',
          cancelText: 'No, seguir editando',
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
  
  private toUpdateCategoryPayload(formData: Partial<CategoryFormData>): UpdateCategory {
    return {
      ...(formData.name !== undefined && { name: formData.name }),
      ...(formData.description !== undefined && { description: formData.description }),
      ...(formData.imageUrl !== undefined && { imageUrl: this.toCategoryImageUrl(formData.imageUrl) }),
      ...(formData.isActive !== undefined && { isActive: formData.isActive }),
      ...(formData.metaDescription !== undefined && { metaDescription: formData.metaDescription }),
      ...(formData.metaTitle !== undefined && { metaTitle: formData.metaTitle }),
      ...(formData.visibleInMenu !== undefined && { visibleInMenu: formData.visibleInMenu }),
    };
  }
  
  private toCategoryFormData(category: Category): CategoryFormData {
    return {
      name: category.name,
      description: category.description,
      imageUrl: this.toCategoryImageUploadValue(category.imageUrl),
      isActive: category.isActive,
      metaDescription: category.metaDescription,
      metaTitle: category.metaTitle,
      visibleInMenu: category.visibleInMenu,
    };
  }
  
  private toCategoryImageUrl(value: string[]): string | undefined {
    return value[0] || undefined;
  }
  
  private toCategoryImageUploadValue(value?: string | null): string[] {
    return value ? [value] : [];
  }
}