import { Component, inject, signal } from '@angular/core';
import { IDialogComponent } from '@shared/component/ui/dialog/interfaces/dialog-component.interface';
import { DialogRef } from '@shared/component/ui/dialog/models/dialog-ref.model';
import { Brand } from '@shared/models';
import { BrandForm } from '@brands/components/forms/brand-form/brand-form';
import { FormActionsOptions, FormEvent } from '@shared/interfaces';
import { BrandService } from '@brands/services/brand/brand.service';
import { BrandFormData } from '@brands/components/forms/brand-form/types';
import { SaveBrandRequest } from '@brands/services/brand/types';

@Component({
  selector: 'ecom-register-brand.dialog',
  imports: [BrandForm],
  templateUrl: './register-brand.dialog.html',
  styleUrl: './register-brand.dialog.css',
  providers: [BrandService],
})
export class RegisterBrandDialog implements IDialogComponent<
  undefined,
  Brand | undefined
> {
  private readonly brandService: BrandService = inject(BrandService);

  brandFormActions = signal<FormActionsOptions>(
    new FormActionsOptions({
      submitButtonVariant: 'secondary',
    }),
  );

  dialogRef = signal<DialogRef<void, Brand> | null>(null);

  async onSubmit(event: FormEvent<BrandFormData>): Promise<void> {
    const data = event.data;
    if (!data) {
      return;
    }

    try {
      let logoUrl = this.toBrandLogoUrl(data.logoUrl);

      if (logoUrl && logoUrl.length > 100000) {
        logoUrl = await this.compressImage(logoUrl, 800, 0.7);
      }

      const request = this.formDataToSaveBrandRequest(data, logoUrl);
      this.brandService.saveBrand(request).subscribe({
        next: (response) => {
          this.dialogRef()?.close(response.data);
        },
        error: (error) => {
          // Error handled silently
        },
      });
    } catch (error) {
      // Error handled silently
    }
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

  private formDataToSaveBrandRequest(
    formData: BrandFormData,
    logoUrl: string,
  ): SaveBrandRequest {
    return {
      name: formData.name,
      logoUrl: logoUrl,
      description: formData.description,
      metaTitle: formData.metaTitle,
      website: formData.website,
      metaDescription: formData.metaDescription,
      visibleInMenu: formData.visibleInMenu,
      isActive: formData.isActive,
    };
  }

  private toBrandLogoUrl(value: string[]): string {
    return value[0] ?? '';
  }

  setDialogRef(ref: DialogRef<void, Brand>): void {
    this.dialogRef.set(ref);
  }
}
