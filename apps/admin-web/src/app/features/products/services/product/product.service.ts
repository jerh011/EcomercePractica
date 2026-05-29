import { Product } from '@shared/models';
import { Observable } from 'rxjs';
import { GetProductByIdResponse } from './types';
import { Injectable, inject } from '@angular/core'; // Asegúrate de importar inject
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environtment.development'; // Ajusta la ruta según tu proyecto

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  getProductById<TProduct = Product>(
    id: string,
  ): Observable<GetProductByIdResponse<TProduct>> {
    const url = `${environment.apiUrl}/products/${id}`;
    const response = this.http.get<GetProductByIdResponse<TProduct>>(url);
    // Opcional: si quieres ver la respuesta cuando llegue
    response.subscribe({
      next: (data) => console.log('✅ Respuesta exitosa:', data),
      error: (err) => console.error('❌ Error en la petición:', err),
      complete: () => console.log('🏁 Petición completada'),
    });

    return response;
  }
}
