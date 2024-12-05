import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { WatchRecord } from '../demo/api/watch-record';

@Injectable({
  providedIn: 'root'
})
export class WatchRecordService {
  private apiUrl = `${env.baseApiUrl}/api/watch-records`;

  constructor(private http: HttpClient) { }

  getWatchRecords(modelId?: number, serialNumber?: string, datePurchased?: Date, dateSold?: Date) {
    var url = `${this.apiUrl}?`;
    if (modelId !== undefined) url += `modelId=${modelId}&`;
    if (serialNumber != undefined) url += `serialNumber=${serialNumber}&`;
    if (datePurchased != undefined) url += `datePurchased=${datePurchased}&`;
    if (dateSold != undefined) url += `dateSold=${dateSold}&`;

    return this.http.get<WatchRecord[]>(url);
  }

  addWatchRecord(watchRecord: WatchRecord) {
    return this.http.post<WatchRecord>(this.apiUrl, watchRecord);
  }

  patchWatchRecord(watchRecord: WatchRecord) {
    return this.http.patch(`${this.apiUrl}/${watchRecord.id}`, watchRecord); 
  }

  deleteWatchRecord(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
