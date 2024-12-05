import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  convertToISOString(date: Date | null) {
    if (date === null) return date;
    
    return DateTime.fromJSDate(date)
      .setZone('Asia/Manila')
      .toISO(); 
  }
}
