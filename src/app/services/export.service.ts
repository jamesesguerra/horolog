import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  async exportTableAsPDF(tableData: any[]) {
    const doc = new jsPDF('l', 'mm', 'a4');

    const data = tableData.map(item => [
      item.description,
      item.serialNumber,
      item.dateReceived ? new Date(item.dateReceived).toLocaleDateString() : "",
      item.datePurchased ? new Date(item.datePurchased).toLocaleDateString() : "",
      item.hasBox ? "Y" : "N",
      item.hasPapers ? "Y" : "N",
      item.remarks
    ]);

    const title = 'Stock In'
    const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPos = (pageWidth - titleWidth) / 2;

    doc.setFontSize(14);
    doc.text(title, xPos, 20);

    autoTable(doc, {
      head: [['Item', 'Serial Number', 'Date Received', 'Date Purchased', 'Box', 'Papers', 'Remarks']],
      body: data,
      theme: 'grid',
      margin: { top: 25 }
    })

    doc.save(`watch-data-${new Date().toLocaleDateString()}`);
  }
}
