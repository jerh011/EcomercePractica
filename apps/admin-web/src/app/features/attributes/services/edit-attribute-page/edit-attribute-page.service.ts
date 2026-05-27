import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterAttributeRequest } from '@attributes/interfaces/register-attribute.interface';
import { environment } from '@environments/environtment.development';
import { ApiResponse } from '@shared/interfaces/api-response.interface';
import { Attribute } from '@shared/models/attribute.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditAttributePageService {
  private readonly http: HttpClient = inject(HttpClient);

  getAttribute(id: string): Observable<HttpResponse<ApiResponse<Attribute>>> {
    return this.http.get<ApiResponse<Attribute>>(
      `${environment.apiUrl}/attributes/${id}`,
      { observe: 'response' },
    );
  }

  editAttribute(
    id: string,
    attributeData: Partial<RegisterAttributeRequest>,
    version: number,
  ): Observable<HttpResponse<ApiResponse<Attribute>>> {
    return this.http.patch<ApiResponse<Attribute>>(
      `${environment.apiUrl}/attributes/${id}`,
      attributeData,
      {
        headers: { 'If-Match': `"${version}"` },
        observe: 'response',
      },
    );
  }
}
