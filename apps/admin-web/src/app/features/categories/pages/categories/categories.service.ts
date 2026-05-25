import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environtment.development';
import { OffsetPaginationParams } from '@shared/interfaces';
import { Observable } from 'rxjs';
import { CategoriesCompositeResponse, CategoriesOffsetResponse } from './types';

@Injectable({
    providedIn: 'root',
})

//TODO: Servicios de categorias
export class CategoriesService {
    private readonly http: HttpClient = inject(HttpClient);

    paginationParams = signal<OffsetPaginationParams>({
        page: 1,
        pageSize: 5,
        paginationType: 'offset',
        query: '',
    });

    getCompositeCategoriesPage(): Observable<CategoriesCompositeResponse> {
        return this.http.get<CategoriesCompositeResponse>(
            `${environment.apiUrl}/composite/categories`,
            {
                params: {
                    page: this.paginationParams().page,
                    pageSize: this.paginationParams().pageSize,
                },
            }
        );
    }

    fetchCategoriesPage(): Observable<CategoriesOffsetResponse> {
        return this.http.get<CategoriesOffsetResponse>(
            `${environment.apiUrl}/categories`,
            {
                params: {
                    page: this.paginationParams().page,
                    pageSize: this.paginationParams().pageSize,
                },
            }
        );
    }
}
