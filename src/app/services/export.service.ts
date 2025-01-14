import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PriceHelper } from '../helpers/price-helper';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  async exportTableAsPDF(tableData: any[]) {
    const doc = new jsPDF('l', 'mm', 'a4');

    const data = tableData.map(item => [
      item.description,
      item.referenceNumber,
      item.serialNumber,
      item.datePurchased ? new Date(item.datePurchased).toLocaleDateString() : "",
      item.location,
      item.hasBox ? "Y" : "N",
      item.hasPapers ? "Y" : "N",
      PriceHelper.format(item.cost),
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
