import { TestBed } from '@angular/core/testing';
import jsPDF from 'jspdf';
import { DateTime } from 'luxon';

import { ExportService, SoldFilterContext } from './export.service';

const records = [
  { description: 'SUBMARINER', referenceNumber: '126610', serialNumber: 'X1',
    datePurchased: '2026-01-05T00:00:00', dateSold: '2026-03-14T00:00:00',
    location: 'SAFE', hasBox: true, hasPapers: true, cost: 500000, remarks: 'ok' },
  { description: 'SPEEDMASTER', referenceNumber: '310.30', serialNumber: 'X2',
    datePurchased: '2026-02-02T00:00:00', dateSold: '2026-03-31T00:00:00',
    location: 'SIDE', hasBox: false, hasPapers: true, cost: 300000, remarks: '' },
];

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportService);
  });

  describe('sheets title', () => {
    const titleFor = (sold: SoldFilterContext) =>
      service['buildSheetsTitle'](sold, sold.soldOnly || sold.soldRange != null);

    it('stays "Stock In" when no sold filter is active', () => {
      expect(titleFor({ soldRange: null, soldOnly: false })).toBe('Stock In');
    });

    it('reads "Watches Sold" when only the Is Sold checkbox is ticked', () => {
      expect(titleFor({ soldRange: null, soldOnly: true })).toBe('Watches Sold');
    });

    it('collapses a whole calendar month to the month name', () => {
      expect(titleFor({ soldRange: [new Date(2026, 2, 1), new Date(2026, 2, 31)], soldOnly: false }))
        .toBe('Watches Sold — March 2026');
    });

    it('collapses February in a leap year', () => {
      expect(titleFor({ soldRange: [new Date(2028, 1, 1), new Date(2028, 1, 29)], soldOnly: false }))
        .toBe('Watches Sold — February 2028');
    });

    it('does not collapse a partial month', () => {
      expect(titleFor({ soldRange: [new Date(2026, 2, 1), new Date(2026, 2, 15)], soldOnly: false }))
        .toBe('Watches Sold — Mar 1–15, 2026');
    });

    it('does not collapse Feb 1-28 in a leap year', () => {
      expect(titleFor({ soldRange: [new Date(2028, 1, 1), new Date(2028, 1, 28)], soldOnly: false }))
        .toBe('Watches Sold — Feb 1–28, 2028');
    });

    it('spans months within a year', () => {
      expect(titleFor({ soldRange: [new Date(2026, 2, 1), new Date(2026, 3, 10)], soldOnly: false }))
        .toBe('Watches Sold — Mar 1 – Apr 10, 2026');
    });

    it('spans years', () => {
      expect(titleFor({ soldRange: [new Date(2026, 2, 1), new Date(2027, 3, 10)], soldOnly: false }))
        .toBe('Watches Sold — Mar 1, 2026 – Apr 10, 2027');
    });

    it('handles a single day, where the range end is still null', () => {
      expect(titleFor({ soldRange: [new Date(2026, 2, 14), null], soldOnly: false }))
        .toBe('Watches Sold — Mar 14, 2026');
    });

    // The Month Sold picker feeds startOf/endOf month, so the end carries a
    // 23:59:59.999 time — the shape the app actually sends.
    it('collapses the range the Month Sold picker produces', () => {
      const picked = DateTime.fromJSDate(new Date(2026, 2, 9));
      const range: [Date, Date] = [
        picked.startOf('month').toJSDate(),
        picked.endOf('month').toJSDate()
      ];
      expect(titleFor({ soldRange: range, soldOnly: false })).toBe('Watches Sold — March 2026');
    });

    it('collapses the Month Sold range for a leap February', () => {
      const picked = DateTime.fromJSDate(new Date(2028, 1, 9));
      const range: [Date, Date] = [
        picked.startOf('month').toJSDate(),
        picked.endOf('month').toJSDate()
      ];
      expect(titleFor({ soldRange: range, soldOnly: false })).toBe('Watches Sold — February 2028');
    });
  });

  describe('generated PDF', () => {
    const API = (jsPDF as any).API;
    let realSave: any;
    let captured: any;

    beforeEach(() => {
      captured = null;
      realSave = API.save;
      // jsPDF copies API members onto each instance at construction, so patch before use.
      API.save = function (this: any) { captured = this; return this; };
    });

    afterEach(() => {
      API.save = realSave;
    });

    const textOf = (doc: any) => doc.output().replace(/\\\(/g, '(').replace(/\\\)/g, ')');
    // Yellow 255,244,190 -> "1. 0.96 0.75 rg" fill operator in the content stream.
    const hasYellowFill = (doc: any) => /1\.\s+0\.96\s+0\.75\s+rg/.test(doc.output());

    it('titles a whole-month sold report and lists the sale dates', async () => {
      await service.exportSheetsAsPdf(records, {
        soldRange: [new Date(2026, 2, 1), new Date(2026, 2, 31)],
        soldOnly: false
      });

      expect(captured).withContext('save() called').not.toBeNull();
      const txt = textOf(captured);

      expect(txt).toContain('Watches Sold');
      expect(txt).toContain('March 2026');
      expect(txt).toContain('Date Sold');
      expect(txt).withContext('sale dates rendered').toContain('3/14/2026');
      expect(txt).toContain('3/31/2026');
      expect(hasYellowFill(captured)).withContext('no yellow in a sold report').toBeFalse();
    });

    it('adds the Date Sold column when only Is Sold is ticked', async () => {
      await service.exportSheetsAsPdf(records, { soldRange: null, soldOnly: true });
      const txt = textOf(captured);

      expect(txt).toContain('Watches Sold');
      expect(txt).toContain('Date Sold');
      expect(hasYellowFill(captured)).toBeFalse();
    });

    it('leaves an unfiltered export as Stock In, with yellow sold rows', async () => {
      await service.exportSheetsAsPdf(records);
      const txt = textOf(captured);

      expect(txt).toContain('Stock In');
      expect(txt).not.toContain('Watches Sold');
      expect(txt).not.toContain('Date Sold');
      expect(hasYellowFill(captured)).withContext('yellow still applied').toBeTrue();
    });
  });
});
