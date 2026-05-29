import {
  Component,
  computed,
  effect,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { CategoryService } from '@categories/services/category/category.service';
import { IDialogComponent } from '@shared/component/ui/dialog/interfaces/dialog-component.interface';
import { DialogRef } from '@shared/component/ui/dialog/models/dialog-ref.model';
import { Category } from '@shared/models';
import { ToastService } from '@shared/services/toast/toast.service';
import { Label } from '@shared/component/ui/label/label';
import { InputText } from '@shared/component/ui/input-text/input-text';
import { InputTextarea } from '@shared/component/ui/input-textarea/input-textarea';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { Badge } from '@shared/component/ui/badge/badge';
import { Button } from '@shared/component/ui/button/button';
import { Image } from '@shared/component/ui/image/image';

@Component({
  selector: 'ecom-category-details.dialog',
  imports: [Label, InputText, InputTextarea, PageLayout, Badge, Button, Image],
  templateUrl: './category-details.dialog.html',
  styleUrl: './category-details.dialog.css',
  providers: [CategoryService],
})
export class CategoryDetailsDialog implements IDialogComponent<string, void> {
  private readonly categoryService = inject(CategoryService);
  private readonly toastService = inject(ToastService);

  id = signal<string | null>(null);
  dialogRef: WritableSignal<DialogRef<string, void> | null> = signal(null);
  category = signal<Category | null>(null);
  activeLabel = computed(() =>
    this.category()?.isActive ? 'Activa' : 'Inactiva',
  );
  visibleInMenuLabel = computed(() =>
    this.category()?.visibleInMenu ? 'Visible en menú' : 'Oculta en menú',
  );
  imageUrl = computed(() => this.category()?.imageUrl ?? '');
  imageAlt = computed(() => {
    const category = this.category();
    return category?.name
      ? `Imagen de ${category.name}`
      : 'Imagen de la categoría';
  });
  isLoading = computed(() => this.id() !== null && this.category() === null);

  constructor() {
    effect(() => {
      if (this.id() !== null) {
        this.loadCategoryDetails(this.id()!);
      }
    });
  }

  private loadCategoryDetails(id: string) {
    this.categoryService.getCategoryById(id).subscribe({
      next: (response: any) => {
        const category = response.data as Category;
        this.category.set(category);
      },
      error: () => {
        this.closeDialog();
        this.toastService.showError('Failed to load category details.');
      },
    });
  }

  setDialogRef(ref: DialogRef<string, void>): void {
    this.dialogRef.set(ref);
    this.id.set(ref.data);
  }

  closeDialog(): void {
    this.dialogRef()?.close();
  }
}
