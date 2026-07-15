import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DateTime } from 'luxon';
import { PriceHelper } from '../helpers/price-helper';
import { BrandWatchSumaryDto } from '../models/brand-watch-summary';

export interface SoldFilterContext {
  soldRange: [Date, Date | null] | null;
  soldOnly: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  async exportReportsAsPdf(summary: BrandWatchSumaryDto[]) {
    const doc = new jsPDF('l', 'mm', 'a4');

    const title = 'Summary Report';
    const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPos = (pageWidth - titleWidth) / 2;

    const data = summary
      .map(x => ({
        ...x,
        totalCost: x.totalCost === 0 ? '' : `Php ${x.totalCost.toLocaleString()}`
      }))
      .sort((a, b) => {
        if (a.brand === 'ALL BRANDS') return 1; 
        if (b.brand === 'ALL BRANDS') return -1;
        return 0;
      });


    doc.setFontSize(14);
    doc.text(title, xPos, 20);

    autoTable(doc, {
      head: [
        [
          'Brand',
          'Quantity',
          'Total Cost'
        ]
      ],
      body: data.map(x => [x.brand, x.quantity, x.totalCost]),
      theme: 'grid',
      margin: { top: 25 },
      didParseCell: function (data) {
        if (data.section === 'body' && data.row.index === data.table.body.length - 1) {
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    doc.save(`watch-report-${new Date().toLocaleString()}`);
  }

  async exportSheetsAsPdf(
    tableData: any[],
    sold: SoldFilterContext = { soldRange: null, soldOnly: false }
  ) {
    const doc = new jsPDF('l', 'mm', 'a4');
    const isSoldReport = sold.soldOnly || sold.soldRange != null;

    const data = tableData.map(item => {
      const row = [
        item.description,
        item.referenceNumber,
        item.serialNumber,
        item.datePurchased ? new Date(item.datePurchased).toLocaleDateString() : "",
        item.location,
        item.hasBox ? "Y" : "N",
        item.hasPapers ? "Y" : "N",
        item.cost?.toLocaleString(),
        item.remarks
      ];

      if (isSoldReport) {
        row.push(item.dateSold ? new Date(item.dateSold).toLocaleDateString() : "");
      }

      return row;
    });

    const title = this.buildSheetsTitle(sold, isSoldReport);
    const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPos = (pageWidth - titleWidth) / 2;

    doc.setFontSize(14);
    doc.text(title, xPos, 20);

    const head = [
      'Item',
      'Reference Number',
      'Serial Number',
      'Date Purchased',
      'Location',
      'Box',
      'Papers',
      'Cost',
      'Remarks'
    ];

    if (isSoldReport) {
      head.push('Date Sold');
    }

    autoTable(doc, {
      head: [head],
      body: data,
      theme: 'grid',
      margin: { top: 25 },
      willDrawCell: (data) => {
        // Every row is sold in a sold report, so the highlight carries no signal.
        if (isSoldReport) return;

        const currentItem = tableData[data.row.index];

        if (currentItem?.dateSold !== null && data.section === "body") {
          doc.setFillColor(255, 244, 190);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      }
    })

    const filePrefix = isSoldReport ? 'watches-sold' : 'watch-data';
    doc.save(`${filePrefix}-${new Date().toLocaleString()}`);
  }

  private buildSheetsTitle(sold: SoldFilterContext, isSoldReport: boolean) {
    if (!isSoldReport) return 'Stock In';
    if (sold.soldRange == null) return 'Watches Sold';

    return `Watches Sold — ${this.formatRange(sold.soldRange)}`;
  }

  private formatRange([start, end]: [Date, Date | null]) {
    const from = DateTime.fromJSDate(start);
    if (end == null) return from.toFormat('LLL d, yyyy');

    const to = DateTime.fromJSDate(end);

    if (from.hasSame(to, 'month')) {
      // A whole calendar month reads better as just the month name.
      return from.day === 1 && to.day === to.daysInMonth
        ? from.toFormat('LLLL yyyy')
        : `${from.toFormat('LLL d')}–${to.toFormat('d, yyyy')}`;
    }

    return from.hasSame(to, 'year')
      ? `${from.toFormat('LLL d')} – ${to.toFormat('LLL d, yyyy')}`
      : `${from.toFormat('LLL d, yyyy')} – ${to.toFormat('LLL d, yyyy')}`;
  }
}
