import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PriceHelper } from '../helpers/price-helper';
import { BrandWatchSumaryDto } from '../models/brand-watch-summary';

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

  async exportSheetsAsPdf(tableData: any[]) {
    const doc = new jsPDF('l', 'mm', 'a4');

    const data = tableData.map(item => [
      item.description,
      item.referenceNumber,
      item.serialNumber,
      item.datePurchased ? new Date(item.datePurchased).toLocaleDateString() : "",
      item.location,
      item.hasBox ? "Y" : "N",
      item.hasPapers ? "Y" : "N",
      item.cost?.toLocaleString(),
      item.remarks
    ]);

    const title = 'Stock In'
    const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPos = (pageWidth - titleWidth) / 2;

    doc.setFontSize(14);
    doc.text(title, xPos, 20);

    autoTable(doc, {
      head: [
        [
          'Item',
          'Reference Number',
          'Serial Number',
          'Date Purchased',
          'Location',
          'Box',
          'Papers',
          'Cost',
          'Remarks'
        ]
      ],
      body: data,
      theme: 'grid',
      margin: { top: 25 },
      willDrawCell: (data) => {
        const currentItem = tableData[data.row.index];

        if (currentItem?.dateSold !== null && data.section === "body") {
          doc.setFillColor(255, 244, 190);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      }
    })

    doc.save(`watch-data-${new Date().toLocaleString()}`);
  }
}
