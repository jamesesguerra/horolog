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

  getWatches() {
    return this.http.get<any>('assets/demo/data/watches.json')
              .toPromise()
              .then(res => res.data as WatchRecord[])
              .then(data => data);
  }

  getWatchRecordsByModelId(id: number) {
    return this.http.get<WatchRecord[]>(`${this.apiUrl}?modelId=${id}`);
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
