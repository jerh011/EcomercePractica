import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AttributeCategorySummaryCursorResponse } from '@attributes/interfaces/attribute-category-summary.interface';
import { environment } from '@environments/environtment.development';
import { CursorPagination } from '@shared/interfaces/pagination.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttributeCategoriesService {
  private readonly http: HttpClient = inject(HttpClient);

  categoriesSearchParams = signal<CursorPagination>({
    paginationType: 'cursor',
  });

  private categoriesSearchParamsClean = computed(() =>
    Object.fromEntries(
      Object.entries(this.categoriesSearchParams()).filter(
        ([_, v]) => v !== undefined && v !== '',
      ),
    ),
  );

  fetchCategories(): Observable<AttributeCategorySummaryCursorResponse> {
    return this.http.get<AttributeCategorySummaryCursorResponse>(
      `${environment.apiUrl}/categories`,
      {
        params: { pageSize: 50 },
      },
    );
  }
}
