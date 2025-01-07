import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { WatchModel } from '../models/watch-model';

@Injectable({
  providedIn: 'root'
})
export class WatchModelService {
  private apiUrl = `${env.baseApiUrl}/api/watch-models`;

  constructor(private http: HttpClient) { }

  getWatchModelsByBrandId(id: number) {
    return this.http.get<WatchModel[]>(`${this.apiUrl}?brandId=${id}`);
  }

  addWatchModel(watchModel: WatchModel) {
    return this.http.post<WatchModel>(this.apiUrl, watchModel);
  }

  getIndependentBrandWatchModelIds() {
    return this.http.get<number[]>(`${this.apiUrl}/independent-brands`); 
  }
}
