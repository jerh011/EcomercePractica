import { Component, computed, inject, signal } from '@angular/core';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { PageHeader } from '@shared/component/page-header/page-header';
import { Card } from '@shared/component/ui/card/card';
import { Button } from '@shared/component/ui/button/button';
import { BrandForm } from '@brands/components/forms/brand-form/brand-form';
import { BrandsTable } from '@brands/components/brands-table/brands-table';
import {
  createPagination,
  FormActionsOptions,
  FormEvent,
} from '@shared/interfaces';
import { BrandDraft } from './types';
import { BrandFormData } from '@brands/components/forms/brand-form/types';
import { toDraftRecord } from '@shared/mappers/entity-record.mapper';
import { BRAND_DRAFTS_COLUMNS } from './consts';
import { BrandService } from '@brands/services/brand/brand.service';
import { BulkSaveBrandItem } from '@brands/services/brand/types';

@Component({
  selector: 'ecom-bulk-brand-registration.page',
  imports: [PageLayout, PageHeader, Card, BrandForm, BrandsTable, Button],
  templateUrl: './bulk-brand-registration.page.html',
  styleUrl: './bulk-brand-registration.page.css',
  providers: [BrandService],
})
export class BulkBrandRegistrationPage {
  private readonly brandService: BrandService = inject(BrandService);

  brandDrafts = signal<BrandDraft[]>([]);
  readonly columns = computed(() => BRAND_DRAFTS_COLUMNS);
  readonly formActions = computed(
    () =>
      new FormActionsOptions({
        canClear: true,
        canCancel: false,
        clearOnSubmit: true,
        clearButtonVariant: 'ghost',
      }),
  );

  readonly hasChanges = computed(() => this.brandDrafts().length > 0);

  pagination = computed(() =>
    createPagination({
      showPagination: false,
    }),
  );

  onSubmit(event: FormEvent<BrandFormData>): void {
    const data = event.data;
    if (!data) {
      throw new Error('No se recibieron datos del formulario de marca.');
    }

    const draft = toDraftRecord<BrandFormData>(data);
    this.brandDrafts.update((drafts) => [...drafts, draft]);
  }

  async saveChanges(): Promise<void> {
    const drafts = this.brandDrafts();

    if (drafts.length === 0) {
      return;
    }

    try {
      const bulkSaveItems: BulkSaveBrandItem[] = [];

      for (const draft of drafts) {
        let logoUrl = this.toBrandLogoUrl(draft.data.logoUrl);

        if (logoUrl && logoUrl.length > 100000) {
          logoUrl = await this.compressImage(logoUrl, 800, 0.7);
        }

        bulkSaveItems.push({
          key: draft.data._recordKey,
          name: draft.data.name,
          logoUrl: logoUrl,
          description: draft.data.description,
          metaTitle: draft.data.metaTitle,
          website: draft.data.website,
          metaDescription: draft.data.metaDescription,
          visibleInMenu: draft.data.visibleInMenu,
          isActive: draft.data.isActive,
        });
      }

      this.brandService.saveBrands(bulkSaveItems).subscribe({
        next: () => {
          this.brandDrafts.set([]);
        },
        error: (error) => {
          console.error('Error al guardar las marcas:', error);
        },
      });
    } catch (error) {
      console.error('Error al procesar las imágenes:', error);
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

      img.onerror = (error) => {
        reject(error);
      };
    });
  }

  private brandDraftToBulkSaveBrandItem(draft: BrandDraft): BulkSaveBrandItem {
    return {
      key: draft.data._recordKey,
      name: draft.data.name,
      logoUrl: this.toBrandLogoUrl(draft.data.logoUrl),
      description: draft.data.description,
      metaTitle: draft.data.metaTitle,
      website: draft.data.website,
      metaDescription: draft.data.metaDescription,
      visibleInMenu: draft.data.visibleInMenu,
      isActive: draft.data.isActive,
    };
  }

  private toBrandLogoUrl(value: string[]): string {
    return value && value.length > 0 ? value[0] : '';
  }
}
