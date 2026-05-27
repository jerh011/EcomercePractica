import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environtment.development';
import {
    CursorPaginationParams,
    OffsetPaginationParams,
    PaginatedResponse,
    SearchParams,
} from '@shared/interfaces';
import { cleanParams } from '@shared/utils/params.utils';
import { Observable } from 'rxjs';
import { AttributesCursorResponse, AttributesOffsetResponse, AttributesResponse } from './types';

@Injectable({
    providedIn: 'root',
})
export class AttributesQueryService {
    private readonly http: HttpClient = inject(HttpClient);

    getAttributesOffset(
        offsetParams: OffsetPaginationParams,
    ): Observable<AttributesOffsetResponse> {
        return this.http.get<AttributesOffsetResponse>(`${environment.apiUrl}/attributes`, {
            params: cleanParams(offsetParams),
        });
    }

    getAttributesCursor(
        cursorParams: CursorPaginationParams,
        additionalParams?: Partial<object>,
    ): Observable<AttributesCursorResponse> {
        return this.http.get<AttributesCursorResponse>(`${environment.apiUrl}/attributes`, {
            params: cleanParams({ ...cursorParams, ...additionalParams }),
        });
    }

    getAttributes(
        params: SearchParams,
        additionalParams?: Partial<object>,
    ): Observable<AttributesResponse> {
        return this.http.get<AttributesResponse>(`${environment.apiUrl}/attributes`, {
            params: cleanParams({ ...params, ...additionalParams }),
        });
    }

    getAttributesCursorByCategoryIds(
        categoryIds: string[],
        cursorParams: CursorPaginationParams,
    ): Observable<AttributesCursorResponse> {
        let params = new HttpParams({ fromObject: cleanParams(cursorParams) });

        categoryIds.forEach((categoryId) => {
            params = params.append('categoryIds', categoryId);
        });

        return this.http.get<AttributesCursorResponse>(`${environment.apiUrl}/attributes`, {
            params,
        });
    }
}
