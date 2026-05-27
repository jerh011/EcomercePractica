// brand.service.ts
import { inject, Injectable } from '@angular/core';
import {
  BulkSaveBrandItem,
  SaveBrandRequest,
  SaveBrandResponse,
} from './types';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environtment.development';
import { Brand } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly http: HttpClient = inject(HttpClient);

  // ✅ CORREGIDO: Retorna Brand directamente, no ApiResponse<Brand>
  getBrandById(id: string): Observable<Brand> {
    return this.http.get<Brand>(`${environment.apiUrl}/brands/${id}`);
  }

  saveBrand(brand: SaveBrandRequest): Observable<SaveBrandResponse> {
    return this.http.post<SaveBrandResponse>(
      `${environment.apiUrl}/brands`,
      brand,
    );
  }

  saveBrands(brands: BulkSaveBrandItem[]): Observable<SaveBrandResponse[]> {
    return this.http.post<SaveBrandResponse[]>(
      `${environment.apiUrl}/brands/batch`,
      { brands },
    );
  }
}
