import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { AttributeForm } from '@attributes/components/forms/attribute-form/attribute-form';
import {
  AttributeCategoryOption,
  AttributeFormData,
} from '@attributes/interfaces/attribute-form.interface';
import { RegisterAttributeRequest } from '@attributes/interfaces/register-attribute.interface';
import { attributeFormDataToRegisterAttributeRequest } from '@attributes/mappers/register-attribute-dialog.mapper';
import { EditAttributePageService } from '@attributes/services/edit-attribute-page/edit-attribute-page.service';
import { Attribute } from '@shared/models/attribute.model';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { PageHeader } from '@shared/component/page-header/page-header';
import { Card } from '@shared/component/ui/card/card';
import { AttributeCategoriesService } from '@attributes/services/attribute-categories/attribute-categories.service';
import { toAttributeCategoryOption } from '@attributes/utils/register-attribute-dialog.utils';
import { ToastService } from '@shared/services/toast/toast.service';
import { getDiff } from '@attributes/utils/get-diff.util';
import { CategorySummary } from '@shared/models';

@Component({
  selector: 'ecom-edit-attribute-page',
  imports: [AttributeForm, PageLayout, PageHeader, Card],
  templateUrl: './edit-attribute-page.html',
  styleUrl: './edit-attribute-page.css',
  providers: [EditAttributePageService, AttributeCategoriesService],
})
export class EditAttributePage implements OnInit {
  private readonly attributeCategoriesService: AttributeCategoriesService =
    inject(AttributeCategoriesService);
  private readonly editAttributePageService: EditAttributePageService = inject(
    EditAttributePageService,
  );
  private readonly toastService = inject(ToastService);

  id = input<string>();
  attribute = signal<Attribute | null>(null);
  attributeVersion = signal<number | null>(null);
  categories = signal<CategorySummary[]>([]);

  categoryOptions = computed<AttributeCategoryOption[]>(() => {
    return this.categories().map(toAttributeCategoryOption);
  });

  ngOnInit(): void {
    console.log('[EditAttributePage] ngOnInit - id:', this.id());
    if (!this.validateId()) return;
    this.loadAttribute(this.id()!);
  }

  private validateId(): boolean {
    console.log('[validateId] id value:', this.id());
    if (!this.id()) {
      console.error(
        '[validateId] Attribute ID is required to edit an attribute.',
      );
      return false;
    }
    return true;
  }

  private loadAttribute(id: string): void {
    console.log('[loadAttribute] loading attribute with id:', id);
    this.editAttributePageService.getAttribute(id).subscribe({
      next: (response) => {
        console.log('[loadAttribute] response:', response);
        const etag = response.headers.get('etag');
        console.log('[loadAttribute] etag:', etag);
        const version = etag ? Number(etag.replace(/"/g, '')) : null;
        this.attributeVersion.set(version);
        console.log('[loadAttribute] version set:', version);
        if (response.body) {
          this.onAttributeLoaded(response.body);
        }
      },
      error: (err) => this.onAttributeLoadError(err),
    });
  }

  private onAttributeLoaded(response: {
    success: boolean;
    data: Attribute;
  }): void {
    console.log(
      '[onAttributeLoaded] success:',
      response.success,
      'data:',
      response.data,
    );
    if (response.success) {
      this.categories.set(response.data.categories);
      this.attribute.set(response.data);
      console.log('[onAttributeLoaded] attribute set:', this.attribute());
    }
  }

  private onAttributeLoadError(err: unknown): void {
    console.error('Error fetching attribute:', err);
    this.toastService.showError(
      'Error al cargar el atributo. Por favor, intenta nuevamente.',
    );
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

  onSubmit(formData: AttributeFormData): void {
    const currentAttribute = this.attribute();
    const version = this.attributeVersion();

    if (!currentAttribute) {
      console.error('No attribute data available for editing.');
      this.toastService.showError(
        'Error al actualizar el atributo. Por favor, intenta nuevamente.',
      );
      return;
    }

    if (version === null) {
      console.error('No version available for optimistic concurrency.');
      this.toastService.showError(
        'Error al actualizar el atributo. Por favor, intenta nuevamente.',
      );
      return;
    }

    const currentRequest = this.attributeToRequest(currentAttribute);
    const updatedRequest =
      attributeFormDataToRegisterAttributeRequest(formData);
    const diff = getDiff<RegisterAttributeRequest, RegisterAttributeRequest>(
      currentRequest,
      updatedRequest,
    );

    console.log('[onSubmit] currentRequest:', currentRequest);
    console.log('[onSubmit] updatedRequest:', updatedRequest);
    console.log('[onSubmit] diff:', diff);
    console.log('[onSubmit] version:', version);

    if (Object.keys(diff).length === 0) {
      console.log('[onSubmit] no changes detected, skipping update');
      return;
    }

    this.editAttributePageService
      .editAttribute(currentAttribute.id, diff, version)
      .subscribe({
        next: (response) => {
          const etag = response.headers.get('etag');
          const newVersion = etag ? Number(etag.replace(/"/g, '')) : null;
          this.attributeVersion.set(newVersion);
          console.log('[onSubmit] updated version:', newVersion);
          if (response.body) {
            this.onAttributeUpdated(response.body);
          }
        },
        error: (err) => this.onAttributeUpdateError(err),
      });
  }

  private attributeToRequest(attribute: Attribute): RegisterAttributeRequest {
    return {
      name: attribute.name,
      description: attribute.description,
      isActive: attribute.isActive,
      isFilterable: attribute.isFilterable,
      appliesToAll: attribute.appliesToAll,
      isRequired: attribute.isRequired,
      categoryIds: attribute.categories.map((category) => category.id),
    };
  }

  private onAttributeUpdated(response: {
    success: boolean;
    data: Attribute;
  }): void {
    if (response.success) {
      this.categories.set(response.data.categories);
      this.attribute.set(response.data);
      this.toastService.showSuccess('Atributo actualizado exitosamente.');
    }
  }

  private onAttributeUpdateError(err: unknown): void {
    console.error('Error updating attribute:', err);
    this.toastService.showError(
      'Error al actualizar el atributo. Por favor, intenta nuevamente.',
    );
  }
}
