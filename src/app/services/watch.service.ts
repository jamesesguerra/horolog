import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WatchRecord } from '../demo/api/watch-record';

@Injectable({
  providedIn: 'root'
})
export class WatchService {

  constructor(private http: HttpClient) { }

  getWatches() {
    return this.http.get<any>('assets/demo/data/watches.json')
              .toPromise()
              .then(res => res.data as WatchRecord[])
              .then(data => data);
  }

  addWatch(watch: WatchRecord) {
    return watch;
  }
}
