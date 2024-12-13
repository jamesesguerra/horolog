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

  getImages() {
    return [
      {
        "itemImageSrc": "https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg",
        "thumbnailImageSrc": "https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg",
        "alt": "description",
        "title": "Image 1"
      },
      {
        "itemImageSrc": "https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg",
        "thumbnailImageSrc": "https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg",
        "alt": "description",
        "title": "Image 1"
      },
    ];
  }
}
