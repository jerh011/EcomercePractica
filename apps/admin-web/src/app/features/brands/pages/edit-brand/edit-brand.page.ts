import { Component, computed, inject, signal, effect } from '@angular/core';
import { BrandActionsService } from '@brands/services/brand-actions/brand-actions.service';
import { BrandService } from '@brands/services/brand/brand.service';
import { Brand } from '@shared/models';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { PageHeader } from '@shared/component/page-header/page-header';
import { Card } from '@shared/component/ui/card/card';
import { BrandForm } from '@brands/components/forms/brand-form/brand-form';
import { BrandFormData } from '@brands/components/forms/brand-form/types';
import { FormEvent } from '@shared/interfaces';
import { UpdateBrand } from '@brands/services/brand-actions/types';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService } from '@shared/services/toast/toast.service';
import { DialogService } from '@shared/services/toast/dialog/dialog.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ecom-edit-brand.page',
  imports: [PageLayout, PageHeader, BrandForm, Card],
  templateUrl: './edit-brand.page.html',
  styleUrl: './edit-brand.page.css',
  providers: [BrandActionsService, BrandService],
})
export class EditBrandPage {
  private readonly brandActionsService: BrandActionsService =
    inject(BrandActionsService);
  private readonly brandService: BrandService = inject(BrandService);
  private readonly toastService = inject(ToastService);
  private readonly location = inject(Location);
  private readonly dialogService = inject(DialogService);
  private readonly route = inject(ActivatedRoute);

  private routeParams = toSignal(this.route.params);
  private id = computed(() => this.routeParams()?.['id'] as string | undefined);

  private brandSignal = signal<Brand | null>(null);
  readonly brand = this.brandSignal.asReadonly();

  isLoading = computed(() => this.brand() === null);
  brandFormData = computed(() => {
    const currentBrand = this.brand();
    return currentBrand ? this.toBrandFormData(currentBrand) : undefined;
  });

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadBrand(currentId);
      }
    });
  }

  private loadBrand(currentId: string): void {
    // ✅ Usar aserción de tipo para decirle a TypeScript que es Brand
    this.brandService.getBrandById(currentId).subscribe({
      next: (response) => {
        const brand = response as unknown as Brand;
        if (brand && brand.id) {
          this.brandSignal.set(brand);
        }
      },
      error: (error) => {
        console.error('Error loading brand:', error);
        this.toastService.showError('Error al cargar la marca');
      },
    });
  }

  onSaveChanges(event: FormEvent<BrandFormData>): void {
    const currentBrand = this.brand();
    const currentId = this.id();

    if (!currentBrand || !event.hasChanges || !currentId) return;

    const changes = event.changes;
    if (!changes) return;

    const payload = this.brandFormDataToUpdateBrand(changes);

    // ✅ Usar aserción de tipo
    this.brandActionsService.updateBrand(currentId, payload).subscribe({
      next: (response) => {
        const updatedBrand = response as unknown as Brand;
        if (updatedBrand && updatedBrand.id) {
          this.brandSignal.set(updatedBrand);
          this.toastService.showSuccess('Marca actualizada exitosamente');
        }
      },
      error: (error) => {
        console.error('Error updating brand:', error);
        this.toastService.showError('Error al actualizar la marca');
      },
    });
  }

  onCancel(event: FormEvent<BrandFormData>): void {
    if (!event.hasChanges) {
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

  private goBack(): void {
    this.location.back();
  }

  private brandFormDataToUpdateBrand(
    changes: Partial<BrandFormData>,
  ): UpdateBrand {
    return {
      ...(changes.name !== undefined && { name: changes.name }),
      ...(changes.description !== undefined && {
        description: changes.description,
      }),
      ...(changes.logoUrl !== undefined && {
        logoUrl: this.toBrandLogoUrl(changes.logoUrl),
      }),
      ...(changes.isActive !== undefined && { isActive: changes.isActive }),
      ...(changes.metaDescription !== undefined && {
        metaDescription: changes.metaDescription,
      }),
      ...(changes.metaTitle !== undefined && { metaTitle: changes.metaTitle }),
      ...(changes.website !== undefined && { website: changes.website }),
      ...(changes.visibleInMenu !== undefined && {
        visibleInMenu: changes.visibleInMenu,
      }),
    };
  }

  private toBrandFormData(brand: Brand): BrandFormData {
    return {
      name: brand.name,
      description: brand.description,
      logoUrl: this.toBrandLogoUploadValue(brand.logoUrl),
      isActive: brand.isActive,
      metaDescription: brand.metaDescription,
      metaTitle: brand.metaTitle,
      website: brand.website,
      visibleInMenu: brand.visibleInMenu,
    };
  }

  private toBrandLogoUrl(value: string[]): string {
    return value[0] ?? '';
  }

  private toBrandLogoUploadValue(value?: string | null): string[] {
    return value ? [value] : [];
  }
}
