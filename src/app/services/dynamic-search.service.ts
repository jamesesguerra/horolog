import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DynamicSearchService {
    private apiUrl = `${env.baseApiUrl}/api/search`;

    constructor(private http: HttpClient) {}

    search(
        selectBy: string,
        searchBy: string,
        query: string,
    ): Observable<string> {
        const params = new HttpParams()
            .set('selectBy', selectBy)
            .set('searchBy', searchBy)
            .set('query', query);

        return this.http.get<any>(this.apiUrl, { params });
    }
}
