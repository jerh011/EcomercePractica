import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environtment.development';
import { ApiResponse } from '@shared/interfaces/api-response.interface';
import { Attribute } from '@shared/models/attribute.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttributeDetailsDialogService {
  private readonly http: HttpClient = inject(HttpClient);

  getAttribute(id: string): Observable<ApiResponse<Attribute>> {
    return this.http.get<ApiResponse<Attribute>>(
      `${environment.apiUrl}/attributes/${id}`,
    );
  }
}
