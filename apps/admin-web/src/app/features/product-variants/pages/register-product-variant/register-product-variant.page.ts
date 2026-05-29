import { Location } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductVariantForm } from '@product-variants/components/forms/product-variant-form/product-variant-form';
import { ProductVariantFormService } from '@product-variants/components/forms/product-variant-form/product-variant-form.service';
import {
  ProductVariantAttributeOption,
  ProductVariantFormData,
  ProductVariantProductOption,
} from '@product-variants/components/forms/product-variant-form/types';
import { productVariantFormDataToCreateVariantRequest } from '@product-variants/mappers/product-variant-request.mapper';
import { ProductVariantActionsService } from '@product-variants/services/product-variant-actions/product-variant-actions.service';
import { AttributeProductVariantSummary } from '@product-variants/types/attribute.type';
import { ProductService } from '@products/services/product/product.service';
import { ProductsQueryService } from '@products/services/products-query/products-query.service';
import { Card } from '@shared/component/ui/card/card';
import { PageHeader } from '@shared/component/page-header/page-header';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { CursorPaginationParams, FormEvent } from '@shared/interfaces';
import { ProductSummary } from '@shared/models';
import { DialogService } from '@shared/services/toast/dialog/dialog.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { Observable, debounceTime, map, of, switchMap, take } from 'rxjs';
import { WARNING_PRICING } from './consts';
import { ProductProductVariantSummary } from './types';

@Component({
  selector: 'ecom-register-product-variant-page',
  imports: [PageLayout, PageHeader, Card, ProductVariantForm],
  templateUrl: './register-product-variant.page.html',
  styleUrl: './register-product-variant.page.css',
  providers: [
    ProductsQueryService,
    ProductVariantActionsService,
    ProductVariantFormService,
  ],
})
export class RegisterProductVariantPage implements OnInit {
  private readonly productsQueryService = inject(ProductsQueryService);
  private readonly productService = inject(ProductService);
  private readonly productVariantActionsService = inject(
    ProductVariantActionsService,
  );
  private readonly productVariantFormService = inject(
    ProductVariantFormService,
  );
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);

  private readonly productsCursorParams = signal<CursorPaginationParams>({
    paginationType: 'cursor',
    after: null,
    pageSize: 8,
    query: '',
  });
  readonly productsOptions = signal<ProductVariantProductOption[]>([]);
  readonly attributesOptions = signal<ProductVariantAttributeOption[]>([]);
  readonly directAttributes = signal<AttributeProductVariantSummary[]>([]);

  ngOnInit(): void {
    console.log('[RegisterProductVariantPage] ngOnInit ejecutado');
    this.loadProducts(true);
    this.registerProductVariantFormHandlers();
  }

  onSubmit(event: FormEvent<ProductVariantFormData>): void {
    console.log('[RegisterProductVariantPage] onSubmit ejecutado');
    console.log('[RegisterProductVariantPage] Event data:', event.data);
    console.log(
      '[RegisterProductVariantPage] Event hasChanges:',
      event.hasChanges,
    );

    if (!event.data?.product) {
      console.warn('[RegisterProductVariantPage] No hay producto seleccionado');
      this.toastService.showError(
        'Selecciona un producto para guardar la variante.',
      );
      return;
    }

    console.log(
      '[RegisterProductVariantPage] Producto seleccionado:',
      event.data.product,
    );
    console.log('[RegisterProductVariantPage] Precio:', event.data.price);
    console.log(
      '[RegisterProductVariantPage] ¿Tiene warning pricing?',
      this.hasWarningPricing(event.data),
    );

    if (this.hasWarningPricing(event.data)) {
      console.log(
        '[RegisterProductVariantPage] Mostrando confirmación de warning de precio',
      );
      this.confirmWarningPricing(event.data);
      return;
    }

    const payload = productVariantFormDataToCreateVariantRequest(event.data);
    console.log('[RegisterProductVariantPage] Payload a enviar:', payload);
    this.createProductVariant(payload);
  }

  private confirmWarningPricing(data: ProductVariantFormData): void {
    console.log(
      '[RegisterProductVariantPage] confirmWarningPricing, precio:',
      data.price,
    );

    const ref = this.dialogService.openConfirm(
      {
        message: `El precio base es menor o igual a $${WARNING_PRICING}. ¿Deseas continuar?`,
        confirmVariant: 'warning',
      },
      {
        title: 'Advertencia de precio',
      },
    );

    ref.onAfterClose$.pipe(take(1)).subscribe((confirmed) => {
      console.log(
        '[RegisterProductVariantPage] Confirmación de warning, confirmed:',
        confirmed,
      );
      if (confirmed) {
        const payload = productVariantFormDataToCreateVariantRequest(data);
        console.log(
          '[RegisterProductVariantPage] Enviando payload después de confirmación:',
          payload,
        );
        this.createProductVariant(payload);
      }
    });
  }

  private createProductVariant(
    payload: ReturnType<typeof productVariantFormDataToCreateVariantRequest>,
  ): void {
    console.log(
      '[RegisterProductVariantPage] createProductVariant - Enviando petición',
    );
    console.log(
      '[RegisterProductVariantPage] URL del endpoint:',
      '/api/variants',
    );
    console.log(
      '[RegisterProductVariantPage] Payload completo:',
      JSON.stringify(payload, null, 2),
    );

    this.productVariantActionsService.createProductVariant(payload).subscribe({
      next: ({ data }) => {
        console.log('[RegisterProductVariantPage] Respuesta exitosa:', data);
        console.log(
          '[RegisterProductVariantPage] Product ID:',
          data.variant.product.id,
        );
        this.onProductVariantCreated(data.variant.product.id);
      },
      error: (error) => {
        console.error(
          '[RegisterProductVariantPage] Error en la petición:',
          error,
        );
        console.error('[RegisterProductVariantPage] Status:', error.status);
        console.error(
          '[RegisterProductVariantPage] StatusText:',
          error.statusText,
        );
        console.error('[RegisterProductVariantPage] URL:', error.url);
        console.error('[RegisterProductVariantPage] Error completo:', error);
        this.onCreateProductVariantError(error);
      },
    });
  }

  onCanceled(event: FormEvent<ProductVariantFormData>): void {
    console.log('[RegisterProductVariantPage] onCanceled ejecutado');
    console.log(
      '[RegisterProductVariantPage] Event hasChanges:',
      event.hasChanges,
    );

    if (!event.hasChanges) {
      console.log('[RegisterProductVariantPage] No hay cambios, regresando');
      this.goBack();
      return;
    }

    console.log(
      '[RegisterProductVariantPage] Hay cambios, confirmando cancelación',
    );
    this.confirmCancelChanges();
  }

  private confirmCancelChanges(): void {
    console.log(
      '[RegisterProductVariantPage] confirmCancelChanges - Mostrando diálogo',
    );

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
      .onAfterClose$.pipe(take(1))
      .subscribe((confirmed) => {
        console.log(
          '[RegisterProductVariantPage] Diálogo cerrado, confirmed:',
          confirmed,
        );
        if (confirmed) {
          console.log(
            '[RegisterProductVariantPage] Cancelación confirmada, regresando',
          );
          this.goBack();
        }
      });
  }

  private loadProducts(reset = false): void {
    console.log('[RegisterProductVariantPage] loadProducts, reset:', reset);
    console.log(
      '[RegisterProductVariantPage] Parámetros de cursor:',
      this.productsCursorParams(),
    );

    this.fetchProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          console.log(
            '[RegisterProductVariantPage] Productos cargados:',
            data.products?.length || 0,
          );
          this.applyProducts(data.products, reset);
          this.updateProductsCursor(data.nextCursor);
        },
        error: (error) => {
          console.error(
            '[RegisterProductVariantPage] Error loading products:',
            error,
          );
        },
      });
  }

  private registerProductVariantFormHandlers(): void {
    console.log(
      '[RegisterProductVariantPage] registerProductVariantFormHandlers',
    );
    this.registerLoadMoreProductsHandler();
    this.registerSearchProductsHandler();
    this.registerSelectedProductChangeHandler();
  }

  private registerLoadMoreProductsHandler(): void {
    this.productVariantFormService.loadMoreProducts$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          console.log(
            '[RegisterProductVariantPage] loadMoreProducts$ triggered',
          );
          this.handleLoadMoreProducts();
        },
      });
  }

  private registerSearchProductsHandler(): void {
    this.productVariantFormService.searchProducts$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (query) => {
          console.log(
            '[RegisterProductVariantPage] searchProducts$ triggered, query:',
            query,
          );
          this.handleSearchProducts(query);
        },
      });
  }

  private registerSelectedProductChangeHandler(): void {
    this.productVariantFormService.selectedProductChange$
      .pipe(
        switchMap((product) => {
          console.log(
            '[RegisterProductVariantPage] selectedProductChange$, product:',
            product,
          );
          return this.fetchSelectedProduct(product);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (product) => {
          console.log(
            '[RegisterProductVariantPage] Producto seleccionado aplicado:',
            product,
          );
          this.applySelectedProduct(product);
        },
        error: (error) => {
          console.error(
            '[RegisterProductVariantPage] Error fetching selected product:',
            error,
          );
        },
      });
  }

  private fetchProducts() {
    return this.productsQueryService.getProductsCursor<ProductProductVariantSummary>(
      this.productsCursorParams(),
    );
  }

  private applyProducts(
    products: ProductProductVariantSummary[],
    reset: boolean,
  ): void {
    console.log(
      '[RegisterProductVariantPage] applyProducts, cantidad:',
      products?.length,
      'reset:',
      reset,
    );
    const options = this.toProductVariantProductOptions(products);
    this.productsOptions.update((prev) =>
      reset ? options : this.mergeProductOptions(prev, options),
    );
    console.log(
      '[RegisterProductVariantPage] productsOptions actualizado:',
      this.productsOptions().length,
    );
  }

  private updateProductsCursor(nextCursor: string | null): void {
    console.log(
      '[RegisterProductVariantPage] updateProductsCursor, nextCursor:',
      nextCursor,
    );
    this.productsCursorParams.update((params) => ({
      ...params,
      after: nextCursor,
    }));
  }

  private handleLoadMoreProducts(): void {
    console.log('[RegisterProductVariantPage] handleLoadMoreProducts');
    if (!this.hasMoreProducts()) {
      console.log(
        '[RegisterProductVariantPage] No hay más productos para cargar',
      );
      return;
    }
    this.loadProducts();
  }

  private handleSearchProducts(query: string): void {
    console.log(
      '[RegisterProductVariantPage] handleSearchProducts, query:',
      query,
    );
    this.resetProductsSearch(query);
    this.loadProducts(true);
  }

  private hasMoreProducts(): boolean {
    const hasMore = Boolean(this.productsCursorParams().after);
    console.log('[RegisterProductVariantPage] hasMoreProducts:', hasMore);
    return hasMore;
  }

  private hasWarningPricing(data: ProductVariantFormData): boolean {
    const hasWarning = this.isWarningPricing(data.price);
    console.log(
      '[RegisterProductVariantPage] hasWarningPricing:',
      hasWarning,
      'price:',
      data.price,
    );
    return hasWarning;
  }

  private isWarningPricing(value: number | null): boolean {
    const isWarning = typeof value === 'number' && value <= WARNING_PRICING;
    console.log(
      '[RegisterProductVariantPage] isWarningPricing:',
      isWarning,
      'value:',
      value,
      'WARNING_PRICING:',
      WARNING_PRICING,
    );
    return isWarning;
  }

  private resetProductsSearch(query: string): void {
    console.log(
      '[RegisterProductVariantPage] resetProductsSearch, query:',
      query,
    );
    this.productsCursorParams.update((params) => ({
      ...params,
      query: query.trim(),
      after: null,
      before: null,
    }));
  }

  private fetchSelectedProduct(
    product: ProductSummary | null,
  ): Observable<ProductProductVariantSummary | null> {
    console.log(
      '[RegisterProductVariantPage] fetchSelectedProduct, product:',
      product,
    );

    if (!product) {
      console.log(
        '[RegisterProductVariantPage] No hay producto, retornando null',
      );
      return of(null);
    }

    console.log(
      '[RegisterProductVariantPage] Obteniendo producto por ID:',
      product.id,
    );
    return this.productService
      .getProductById<ProductProductVariantSummary>(product.id)
      .pipe(
        map(({ data }) => {
          console.log(
            '[RegisterProductVariantPage] Producto obtenido:',
            data.product,
          );
          return data.product;
        }),
      );
  }

  private applySelectedProduct(
    selectedProduct: ProductProductVariantSummary | null,
  ): void {
    console.log(
      '[RegisterProductVariantPage] applySelectedProduct:',
      selectedProduct,
    );

    if (!selectedProduct) {
      console.log(
        '[RegisterProductVariantPage] No hay producto seleccionado, limpiando atributos',
      );
      this.clearSelectedProductAttributes();
      return;
    }

    console.log(
      '[RegisterProductVariantPage] Aplicando atributos del producto:',
      {
        attributes: selectedProduct.attributes?.length,
        directAttributes: selectedProduct.directAttributes?.length,
      },
    );

    this.applySelectedProductAttributes(selectedProduct.attributes);
    this.applySelectedProductDirectAttributes(selectedProduct.directAttributes);
  }

  private clearSelectedProductAttributes(): void {
    console.log('[RegisterProductVariantPage] clearSelectedProductAttributes');
    this.attributesOptions.set([]);
    this.directAttributes.set([]);
  }

  private applySelectedProductAttributes(
    attributes: AttributeProductVariantSummary[],
  ): void {
    console.log(
      '[RegisterProductVariantPage] applySelectedProductAttributes, cantidad:',
      attributes?.length,
    );
    this.attributesOptions.set(
      this.toProductVariantAttributeOptions(attributes),
    );
  }

  private applySelectedProductDirectAttributes(
    attributes: AttributeProductVariantSummary[],
  ): void {
    console.log(
      '[RegisterProductVariantPage] applySelectedProductDirectAttributes, cantidad:',
      attributes?.length,
    );
    this.directAttributes.set(attributes);
  }

  private toProductVariantProductOptions(
    products: ProductProductVariantSummary[],
  ): ProductVariantProductOption[] {
    return products.map((product) =>
      this.toProductVariantProductOption(product),
    );
  }

  private toProductVariantProductOption(
    product: ProductProductVariantSummary,
  ): ProductVariantProductOption {
    return {
      label: product.name,
      value: this.toProductSummary(product),
    };
  }

  private toProductSummary(
    product: ProductProductVariantSummary,
  ): ProductSummary {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
    };
  }

  private toProductVariantAttributeOptions(
    attributes: AttributeProductVariantSummary[],
  ): ProductVariantAttributeOption[] {
    return attributes.map((attribute) =>
      this.toProductVariantAttributeOption(attribute),
    );
  }

  private toProductVariantAttributeOption(
    attribute: AttributeProductVariantSummary,
  ): ProductVariantAttributeOption {
    return {
      label: attribute.name,
      value: attribute,
    };
  }

  private mergeProductOptions(
    previous: ProductVariantProductOption[],
    next: ProductVariantProductOption[],
  ): ProductVariantProductOption[] {
    const existing = new Set(previous.map((option) => option.value.id));
    const missing = next.filter((option) => !existing.has(option.value.id));
    console.log('[RegisterProductVariantPage] mergeProductOptions:', {
      previous: previous.length,
      next: next.length,
      missing: missing.length,
    });
    return [...previous, ...missing];
  }

  private onProductVariantCreated(productId: string): void {
    console.log(
      '[RegisterProductVariantPage] onProductVariantCreated, productId:',
      productId,
    );
    this.toastService.showSuccess('Variante creada correctamente.');
    this.navigateToProductVariants(productId);
  }

  private onCreateProductVariantError(error: unknown): void {
    console.error(
      '[RegisterProductVariantPage] onCreateProductVariantError:',
      error,
    );
    const errorMessage =
      this.getErrorMessage(error) ?? 'Error al crear la variante.';
    console.error(
      '[RegisterProductVariantPage] Mensaje de error:',
      errorMessage,
    );
    this.toastService.showError(errorMessage);
  }

  private navigateToProductVariants(productId?: string): void {
    console.log(
      '[RegisterProductVariantPage] navigateToProductVariants, productId:',
      productId,
    );
    this.router.navigate(['catalogs', 'product-variants'], {
      ...(productId ? { queryParams: { productId } } : {}),
    });
  }

  private goBack(): void {
    console.log('[RegisterProductVariantPage] goBack ejecutado');
    this.location.back();
  }

  private getErrorMessage(error: unknown): string | null {
    console.log('[RegisterProductVariantPage] getErrorMessage, error:', error);

    if (
      error &&
      typeof error === 'object' &&
      'error' in error &&
      error.error &&
      typeof error.error === 'object' &&
      'message' in error.error &&
      typeof error.error.message === 'string'
    ) {
      console.log(
        '[RegisterProductVariantPage] Mensaje encontrado en error.error.message:',
        error.error.message,
      );
      return error.error.message;
    }

    console.log('[RegisterProductVariantPage] No se encontró mensaje de error');
    return null;
  }
}
