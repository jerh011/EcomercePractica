import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  AttributesCompositeResponse,
  AttributesOffsetResponse,
} from '@attributes/interfaces/attributes-page.interface';
import { environment } from '@environments/environtment.development';
import { ApiResponse } from '@shared/interfaces/api-response.interface';
import { OffsetPagination } from '@shared/interfaces/pagination.interface';
import { Attribute } from '@shared/models/attribute.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttributesPageService {
  private readonly http: HttpClient = inject(HttpClient);

  attributesSearchParams = signal<OffsetPagination>({
    page: 1,
    pageSize: 5,
  });

  attributesPageComposite(): Observable<
    ApiResponse<AttributesCompositeResponse>
  > {
    return this.http.get<ApiResponse<AttributesCompositeResponse>>(
      `${environment.apiUrl}/composite/attributes`,
      {
        params: <any>this.attributesSearchParams(),
      },
    );
  }

  fetchAttributes(): Observable<ApiResponse<AttributesOffsetResponse>> {
    return this.http.get<ApiResponse<AttributesOffsetResponse>>(
      `${environment.apiUrl}/attributes`,
      {
        params: <any>{
          ...this.attributesSearchParams(),
          appliesToAll: true,
        },
      },
    );
  }

  deleteAttribute(attributeKey: string): Observable<ApiResponse<Attribute>> {
    return this.http.delete<ApiResponse<Attribute>>(
      `${environment.apiUrl}/attributes/${attributeKey}`,
    );
  }
}
