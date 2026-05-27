import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterAttributeCompositeResponse } from '@attributes/interfaces/register-attribute-dialog.interface';
import { RegisterAttributeRequest } from '@attributes/interfaces/register-attribute.interface';
import { environment } from '@environments/environtment.development';
import { ApiResponse } from '@shared/interfaces/api-response.interface';
import { Attribute } from '@shared/models/attribute.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterAttributeDialogService {
  private readonly http: HttpClient = inject(HttpClient);

  fetchRegisterAttributeDialogComposite(): Observable<
    ApiResponse<RegisterAttributeCompositeResponse>
  > {
    return this.http.get<ApiResponse<RegisterAttributeCompositeResponse>>(
      `${environment.apiUrl}/composite/attributes/create-dialog`,
    );
  }

  saveAttribute(
    request: RegisterAttributeRequest,
  ): Observable<ApiResponse<Attribute>> {
    return this.http.post<ApiResponse<Attribute>>(
      `${environment.apiUrl}/attributes`,
      request,
    );
  }
}
