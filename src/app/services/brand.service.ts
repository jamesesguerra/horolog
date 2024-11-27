import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand } from '../demo/api/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }

  getBrands() {
    return this.http.get<any>('assets/demo/data/brands.json')
              .toPromise()
              .then(res => res.data as Brand[])
              .then(data => data);
  }

  addBrand(brand: Brand) {
    return brand;
  }
}
