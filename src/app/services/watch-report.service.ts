import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { WatchSalesReport } from '../models/watch-sales-report';
import { BrandWatchSumaryDto } from '../models/brand-watch-summary';
import { MonthlySales } from '../models/monthly-sales';
import { WatchMetrics } from '../models/watch-metrics';
import { BrandInventoryCount } from './brand-inventory-count';
import { InventoryBreakdown } from './inventory-breakdown';
import { BrandPriceTrend } from '../models/brand-price-trend';

@Injectable({
  providedIn: 'root'
})
export class WatchReportService {
  private apiUrl = `${env.baseApiUrl}/api/watch-reports`;

  constructor(private http: HttpClient) { }

  getBestSellingWatches() {
    return this.http.get<WatchSalesReport[]>(`${this.apiUrl}/best-selling`);
  }

  getWatchMetrics() {
    return this.http.get<WatchMetrics>(`${this.apiUrl}/watch-metrics`);
  }

  getBrandWatchSummary() {
    return this.http.get<BrandWatchSumaryDto[]>(`${this.apiUrl}/brand-watch-summary`);
  }

  getMonthlySales() {
    return this.http.get<MonthlySales[]>(`${this.apiUrl}/monthly-sales`);
  }

  getBrandInventoryCount() {
    return this.http.get<BrandInventoryCount[]>(`${this.apiUrl}/brand-inventory-count`);
  }

  getInventoryBreakdown() {
    return this.http.get<InventoryBreakdown>(`${this.apiUrl}/inventory-breakdown`);
  }

  getMonthlyTrend() {
    return this.http.get<BrandPriceTrend[]>(`${this.apiUrl}/monthly-trend`);
  }

  getBoxPapersStatus() {
    return this.http.get<any>(`${this.apiUrl}/box-papers-status`);
  }
}
