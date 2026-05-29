import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environtment.development';
import {
  CursorPaginationParams,
  OffsetPaginationParams,
} from '@shared/interfaces';
import { Product } from '@shared/models';
import { cleanParams } from '@shared/utils/params.utils';
import { Observable } from 'rxjs';
import { ProductsCursorResponse, ProductsOffsetResponse } from './types';

@Injectable({
  providedIn: 'root',
})
export class ProductsQueryService {
  private readonly http = inject(HttpClient);

  getProductsOffset<TProduct = Product>(
    offsetParams: OffsetPaginationParams,
  ): Observable<ProductsOffsetResponse<TProduct>> {
 

    const cleanedParams = cleanParams(offsetParams);
   

  
    const url = `${environment.apiUrl}/products`;
 

    return this.http.get<ProductsOffsetResponse<TProduct>>(url, {
      params: cleanedParams,
    });
  }

  getProductsCursor<TProduct = Product>(
    cursorParams: CursorPaginationParams,
  ): Observable<ProductsCursorResponse<TProduct>> {
 
    const cleanedParams = cleanParams(cursorParams);

    // Mostrar detalles específicos de paginación cursor
   
    const url = `${environment.apiUrl}/products`;


    return this.http.get<ProductsCursorResponse<TProduct>>(url, {
      params: cleanedParams,
    });
  }
}
