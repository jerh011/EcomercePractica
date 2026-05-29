import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environtment.development';
import {
  ToggleProductActiveStatus,
  ToggleProductFeaturedStatus,
  ProductDeleted,
  ProductUpdated,
  UpdateProduct,
} from './types';
import { Product } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class ProductActionsService {
  private readonly http = inject(HttpClient);

  toggleProductActiveStatus(data: ToggleProductActiveStatus) {
    const url = `${environment.apiUrl}/products/${data.id}/status`; // ✅
    const body = { isActive: data.isActive };
    return this.http.patch<ProductUpdated>(url, body);
  }

  toggleProductFeaturedStatus(data: ToggleProductFeaturedStatus) {
    const url = `${environment.apiUrl}/products/${data.id}/featured`; // ✅
    const body = { isFeatured: data.isFeatured };
    return this.http.patch<ProductUpdated>(url, body);
  }



  deleteProduct(id: string) {
    return this.http.delete<ProductDeleted>(
      `${environment.apiUrl}/products/${id}`,
    );
  }

  updateProduct(id: Product['id'], payload: UpdateProduct) {

    const url = `${environment.apiUrl}/products/${id}`;

    return this.http.patch<ProductUpdated>(url, payload);
  }
}
