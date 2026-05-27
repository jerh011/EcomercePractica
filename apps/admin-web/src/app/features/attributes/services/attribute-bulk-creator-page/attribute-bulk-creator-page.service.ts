import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterAttributeBatchItem } from '@attributes/interfaces/register-attribute.interface';
import { environment } from '@environments/environtment.development';
import { ApiResponse, BatchOperationResponse } from '@shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';

@Injectable()
export class AttributeBulkCreatorPageService {
  private readonly http: HttpClient = inject(HttpClient);

  constructor() {}

  registerAttributes(
    attributes: RegisterAttributeBatchItem[],
  ): Observable<ApiResponse<BatchOperationResponse>> {
    return this.http.post<ApiResponse<BatchOperationResponse>>(
      `${environment.apiUrl}/attributes/batch`,
      {
        attributes,
      },
    );
  }
}
