import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { Brand } from '../models/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = `${env.baseApiUrl}/api/brands`;

  constructor(private http: HttpClient) { }

  getBrands() {
    return this.http.get<Brand[]>(this.apiUrl);
  }

  getBrandById(brandId: number) {
    return this.http.get<Brand>(`${this.apiUrl}/${brandId}`);
  }
}
