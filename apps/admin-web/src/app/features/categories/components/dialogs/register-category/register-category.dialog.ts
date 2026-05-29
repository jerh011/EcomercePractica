import { Component, inject, signal } from '@angular/core';
import { IDialogComponent } from '@shared/component/ui/dialog/interfaces/dialog-component.interface';
import { DialogRef } from '@shared/component/ui/dialog/models/dialog-ref.model';
import { Category } from '@shared/models';
import { CategoryForm } from '@categories/components/forms/category-form/category-form';
import { CategoryFormData } from '@categories/components/forms/category-form/types';
import { CategoryService } from '@categories/services/category/category.service';
import { SaveCategoryRequest } from '@categories/services/category/types';
import { FormActionsOptions, FormEvent } from '@shared/interfaces';

@Component({
  selector: 'ecom-register-category.dialog',
  imports: [CategoryForm],
  templateUrl: './register-category.dialog.html',
  styleUrl: './register-category.dialog.css',
  providers: [CategoryService],
})
export class RegisterCategoryDialog implements IDialogComponent<
  void,
  Category
> {
  private readonly categoryService = inject(CategoryService);

  protected readonly categoryFormActions = signal<FormActionsOptions>(
    new FormActionsOptions({
      submitButtonVariant: 'secondary',
    }),
  );

  private readonly dialogRef = signal<DialogRef<void, Category> | null>(null);

  async onSubmit(event: FormEvent<CategoryFormData>): Promise<void> {
    if (!event.data) {
      return;
    }

    try {
      let imageUrl = this.toCategoryImageUrl(event.data.imageUrl);

      if (imageUrl && imageUrl.length > 100000) {
        imageUrl = await this.compressImage(imageUrl, 800, 0.7);
      }

      const request = this.toSaveCategoryRequest(event.data, imageUrl);
      this.categoryService.saveCategory(request).subscribe({
        next: ({ data }) => {
          void this.dialogRef()?.close(data);
        },
      });
    } catch (error) {
      // Error handled silently
    }
  }

  setDialogRef(ref: DialogRef<void, Category>): void {
    this.dialogRef.set(ref);
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

  private toSaveCategoryRequest(
    formData: CategoryFormData,
    imageUrl?: string,
  ): SaveCategoryRequest {
    return {
      name: formData.name,
      description: formData.description,
      imageUrl: imageUrl,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      isActive: formData.isActive,
      visibleInMenu: formData.visibleInMenu,
    };
  }

  private toCategoryImageUrl(value: string[]): string | undefined {
    return value[0] || undefined;
  }
}
