import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${env.baseApiUrl}/api/files`;

  constructor(private http: HttpClient) { }

  uploadFile(file: any) {
    const formData = new FormData();
    formData.append('blob', file);
    return this.http.post(this.apiUrl, formData);
  }

  deleteFile(blob: string) {
    return this.http.delete(`${this.apiUrl}?blobName=${blob}`);
  }

  getBlobName(uri) {
    const url = new URL(uri);
    const pathSegments = url.pathname.split('/');
    return decodeURIComponent(pathSegments[pathSegments.length - 1]);
  }
}