import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Watch } from '../demo/api/watch';

@Injectable({
  providedIn: 'root'
})
export class WatchService {

  constructor(private http: HttpClient) { }

  getWatches() {
    return this.http.get<any>('assets/demo/data/watches.json')
              .toPromise()
              .then(res => res.data as Watch[])
              .then(data => data);
  }

  addWatch(watch: Watch) {
    return watch;
  }
}
