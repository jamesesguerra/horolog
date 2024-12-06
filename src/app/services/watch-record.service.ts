import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { WatchRecord } from '../demo/api/watch-record';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class WatchRecordService {
  private apiUrl = `${env.baseApiUrl}/api/watch-records`;

  constructor(private http: HttpClient, private dateService: DateService) { }

  getWatchRecords(modelId?: number) {
    var url = `${this.apiUrl}?`;
    if (modelId !== undefined) url += `modelId=${modelId}&`;

    return this.http.get<WatchRecord[]>(url);
  }

  addWatchRecord(watchRecord: WatchRecord) {
    return this.http.post<WatchRecord>(this.apiUrl, watchRecord);
  }

  patchWatchRecord(watchRecord: WatchRecord) {
    return this.http.patch(`${this.apiUrl}/${watchRecord.id}`, watchRecord); 
  }

  setDateBorrowedToNull(id: number) {
    return this.http.patch(`${this.apiUrl}/date-borrowed/${id}`, {});
  }

  deleteWatchRecord(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  patchRecordDate(type: string, date: Date, recordId: number) {
    const editedRecord: WatchRecord = {};
    editedRecord.id = recordId;
    editedRecord[type] = this.dateService.convertToISOString(date);

    if (type === "dateReturned") {
      this.setDateBorrowedToNull(recordId).subscribe();
    }

    return this.patchWatchRecord(editedRecord);
  }
}
