import { Injectable } from '@angular/core';
import { WatchImage } from '../models/watch-image';
import { environment as env } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WatchImageService {
  private apiUrl = `${env.baseApiUrl}/api/watch-images`;

  constructor(private http: HttpClient) { }

  addImages(watchImages: WatchImage[]) {
    return this.http.post(this.apiUrl, watchImages);
  }

  getWatchImagesByRecordId(recordId: number) {
    return this.http.get(`${this.apiUrl}?recordId=${recordId}`);
  }

  deleteWatchImage(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
