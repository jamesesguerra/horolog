import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { WatchSalesReport } from '../models/watch-sales-report';

@Injectable({
  providedIn: 'root'
})
export class WatchReportService {
  private apiUrl = `${env.baseApiUrl}/api/watch-reports`;

  constructor(private http: HttpClient) { }

  getBestSellingWatches() {
    return this.http.get<WatchSalesReport[]>(`${this.apiUrl}/best-selling`);
  }

  getTotalValue() {
    return this.http.get<number>(`${this.apiUrl}/total-value`);
  }
}
