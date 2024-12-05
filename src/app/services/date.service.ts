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

  applyDateFilter(
    records: any[],
    dateField: keyof typeof records[0],
    filterDates: [Date, Date | null]
  ): any[] {
    return records.filter(x => {
      const dateValue = new Date(x[dateField] as string);
      const [startDate, endDate] = filterDates;
  
      if (endDate == null) {
        return dateValue.getTime() === startDate.getTime();
      }
  
      return dateValue >= startDate && dateValue <= endDate;
    });
  }
}
