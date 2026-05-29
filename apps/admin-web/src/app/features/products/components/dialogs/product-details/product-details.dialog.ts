import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ProductService } from '@products/services/product/product.service';
import { Badge } from '@shared/component/ui/badge/badge';
import { Button } from '@shared/component/ui/button/button';
import { HtmlViewer } from '@shared/component/ui/html-viewer/html-viewer';
import { InputText } from '@shared/component/ui/input-text/input-text';
import { InputTextarea } from '@shared/component/ui/input-textarea/input-textarea';
import { Label } from '@shared/component/ui/label/label';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { IDialogComponent } from '@shared/component/ui/dialog/interfaces/dialog-component.interface';
import { DialogRef } from '@shared/component/ui/dialog/models/dialog-ref.model';
import { FormDivider } from '@shared/component/ui/form-divider/form-divider';
import { Product } from '@shared/models';
import { ToastService } from '@shared/services/toast/toast.service';

@Component({
    selector: 'ecom-product-details.dialog',
    imports: [Badge, Button, FormDivider, HtmlViewer, InputText, InputTextarea, Label, PageLayout],
    templateUrl: './product-details.dialog.html',
    providers: [ProductService],
})
export class ProductDetailsDialog implements IDialogComponent<string, void> {
    private readonly productService = inject(ProductService);
    private readonly toastService = inject(ToastService);

    id = signal<string | null>(null);
    dialogRef: WritableSignal<DialogRef<string, void> | null> = signal(null);
    product = signal<Product | null>(null);
    activeLabel = computed(() => (this.product()?.isActive ? 'Activo' : 'Inactivo'));
    featuredLabel = computed(() => (this.product()?.isFeatured ? 'Destacado' : 'No destacado'));
    isLoading = computed(() => this.id() !== null && this.product() === null);
    brandName = computed(() => this.product()?.brand?.name ?? '');
    basePrice = computed(() =>
        new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(this.product()?.basePrice ?? 0),
    );

    constructor() {
        effect(() => {
            const id = this.id();
            if (id !== null) {
                this.loadProductDetails(id);
            }
        });
    }

    private loadProductDetails(id: string): void {
        this.product.set(null);
        this.productService.getProductById(id).subscribe({
            next: ({ data }) => {
                this.product.set(data.product);
            },
            error: () => {
                this.closeDialog();
                this.toastService.showError('Error al cargar los detalles del producto.');
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
